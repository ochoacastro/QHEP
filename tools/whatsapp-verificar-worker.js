/* Mi Pradera · Verificación del celular por WhatsApp (v365) — Cloudflare Worker
 *
 * Cómo funciona:
 *  1. En la página, la persona toca «Verificar mi celular». Se guarda celcod/{código} = {k, uid, wa, ts} en Firestore
 *     y se abre su WhatsApp con «Hola Mi Pradera. Mi código para verificar mi celular es: 123456».
 *  2. Ella envía el mensaje al número de WhatsApp Business. Meta lo reenvía a este trabajador (webhook).
 *  3. El trabajador busca el código, comprueba que el mensaje salió del mismo celular de la cuenta y que no
 *     tiene más de 30 minutos, escribe plans/{k}.waV = celular y borra el código. Responde por WhatsApp.
 *
 * Los mensajes que inicia el usuario y la respuesta dentro de las 24 horas siguientes no tienen costo en WhatsApp.
 *
 * Secretos (Cloudflare → el trabajador → Configuración → Variables y secretos → tipo «Secreto»). Nunca en el código ni en el chat:
 *   WA_TOKEN       token permanente del usuario del sistema de Meta (permiso whatsapp_business_messaging)
 *   WA_PHONE_ID    «Identificador del número de teléfono» (WhatsApp → Configuración de la API)
 *   WA_APP_SECRET  «Clave secreta de la app» (Configuración de la app → Básica); sirve para comprobar que el aviso viene de Meta
 *   WA_VERIFY      un texto cualquiera inventado por ti; el mismo se pega en Meta al configurar el webhook
 *   FB_SA          el JSON completo de la cuenta de servicio de Firebase (Configuración del proyecto → Cuentas de servicio)
 */

const MAX_AGE = 30 * 60 * 1000;
const GRAPH = 'https://graph.facebook.com/v21.0';

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);

    // Meta comprueba el webhook una vez con GET
    if (req.method === 'GET') {
      if (url.searchParams.get('hub.mode') === 'subscribe' && env.WA_VERIFY &&
          url.searchParams.get('hub.verify_token') === env.WA_VERIFY) {
        return new Response(url.searchParams.get('hub.challenge') || '', { status: 200 });
      }
      return new Response('Mi Pradera · verificación por WhatsApp', { status: 200 });
    }
    if (req.method !== 'POST') return new Response('', { status: 405 });

    const raw = await req.text();
    if (!(await signatureOk(raw, req.headers.get('x-hub-signature-256') || '', env.WA_APP_SECRET))) {
      return new Response('firma inválida', { status: 401 });
    }
    let body;
    try { body = JSON.parse(raw); } catch (e) { return new Response('', { status: 200 }); }

    const msgs = [];
    for (const en of body.entry || []) for (const ch of en.changes || []) for (const m of (ch.value && ch.value.messages) || []) msgs.push(m);
    // Meta espera un 200 rápido; el trabajo sigue en segundo plano
    ctx.waitUntil(Promise.all(msgs.map(m => handle(m, env).catch(e => console.log('error', e && e.message)))));
    return new Response('ok', { status: 200 });
  }
};

async function handle(m, env) {
  const from = String(m.from || '').replace(/\D/g, '');
  const txt = m.type === 'text' ? String((m.text && m.text.body) || '') : '';
  const code = (txt.match(/(?:^|\D)(\d{6})(?:\D|$)/) || [])[1];
  if (!from || !code) return; // otros mensajes: no se responde nada

  const tok = await gToken(env);
  const sa = JSON.parse(env.FB_SA);
  const base = `https://firestore.googleapis.com/v1/projects/${sa.project_id}/databases/(default)/documents`;
  const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };

  const r = await fetch(`${base}/celcod/${code}`, { headers: H });
  if (r.status === 404) return reply(env, from, 'No encontramos ese código o ya se usó. Vuelve a Mi Pradera y toca «Verificar mi celular» otra vez.');
  if (!r.ok) throw new Error('firestore get ' + r.status);
  const d = (await r.json()).fields || {};
  const wa = str(d.wa), k = str(d.k), ts = d.ts && d.ts.timestampValue ? Date.parse(d.ts.timestampValue) : Number((d.ts && (d.ts.integerValue || d.ts.doubleValue)) || 0);

  if (!wa || !k || Date.now() - ts > MAX_AGE) {
    await fetch(`${base}/celcod/${code}`, { method: 'DELETE', headers: H });
    return reply(env, from, 'Ese código ya venció. Vuelve a Mi Pradera y toca «Verificar mi celular» otra vez.');
  }
  if (!(from.length === 12 && from.startsWith('57') && from.slice(-10) === wa)) {
    return reply(env, from, `Este WhatsApp no es el celular de tu cuenta (termina en ${wa.slice(-4)}). Envía el mensaje desde ese número.`);
  }

  // plans/{k}.waV = celular verificado (solo si el plan existe)
  const p = await fetch(`${base}/plans/${encodeURIComponent(k)}?updateMask.fieldPaths=waV&updateMask.fieldPaths=waVts&currentDocument.exists=true`, {
    method: 'PATCH', headers: H,
    body: JSON.stringify({ fields: { waV: { stringValue: wa }, waVts: { integerValue: String(Date.now()) } } })
  });
  await fetch(`${base}/celcod/${code}`, { method: 'DELETE', headers: H });
  if (!p.ok) return reply(env, from, 'No pudimos encontrar tu cuenta. Entra a Mi Pradera e intenta de nuevo.');
  return reply(env, from, '¡Listo! Tu celular quedó verificado en Mi Pradera. Ya puedes volver a la página.');
}

function str(f) { return (f && f.stringValue) || ''; }

async function reply(env, to, text) {
  await fetch(`${GRAPH}/${env.WA_PHONE_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.WA_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text } })
  });
}

async function signatureOk(raw, header, secret) {
  if (!secret || !header.startsWith('sha256=')) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw)));
  const hex = [...sig].map(b => b.toString(16).padStart(2, '0')).join('');
  const got = header.slice(7);
  if (got.length !== hex.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ got.charCodeAt(i);
  return diff === 0;
}

// Token de Google para Firestore con la cuenta de servicio (JWT firmado con RS256); se guarda ~50 minutos
let cache = { t: '', exp: 0 };
async function gToken(env) {
  if (cache.t && Date.now() < cache.exp) return cache.t;
  const sa = JSON.parse(env.FB_SA);
  const now = Math.floor(Date.now() / 1000);
  const b64 = o => btoa(typeof o === 'string' ? o : String.fromCharCode(...new Uint8Array(o))).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const head = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const pem = sa.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(head + '.' + claim));
  const jwt = head + '.' + claim + '.' + b64(sig);
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + jwt
  });
  if (!r.ok) throw new Error('google token ' + r.status);
  const j = await r.json();
  cache = { t: j.access_token, exp: Date.now() + 50 * 60 * 1000 };
  return cache.t;
}
