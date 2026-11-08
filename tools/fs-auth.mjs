// v379: encabezado de autorización para leer Firestore desde las acciones de GitHub.
// Si existe el secreto FB_SA (el JSON de la cuenta de servicio de Firebase, guardado en GitHub → Settings → Secrets and
// variables → Actions), las lecturas van identificadas con esa cuenta. Así siguen funcionando aunque se active
// App Check obligatorio en Firestore (App Check bloquea las lecturas anónimas que no vienen de la página).
// Sin el secreto, lee como antes (sin identificarse). Solo lee: los scripts no escriben en Firestore.
import crypto from 'crypto';
let cache = { t: '', exp: 0 };
export async function authHeaders() {
  const raw = process.env.FB_SA;
  if (!raw) return {};
  if (cache.t && Date.now() < cache.exp) return { Authorization: 'Bearer ' + cache.t };
  const sa = JSON.parse(raw), now = Math.floor(Date.now() / 1000);
  const b64 = o => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
  const head = b64({ alg: 'RS256', typ: 'JWT' });
  const claim = b64({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
  const sig = crypto.sign('RSA-SHA256', Buffer.from(head + '.' + claim), sa.private_key).toString('base64url');
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + head + '.' + claim + '.' + sig
  });
  if (!r.ok) throw new Error('No se pudo obtener el permiso de Google (' + r.status + '): ' + (await r.text()).slice(0, 200));
  const j = await r.json();
  cache = { t: j.access_token, exp: Date.now() + 50 * 60 * 1000 };
  return { Authorization: 'Bearer ' + cache.t };
}
