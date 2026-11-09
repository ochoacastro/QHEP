// Pruebas automáticas de la página (index.html) con un navegador de verdad (Playwright) y un Firebase falso
// (firebase-falso.js): no toca la base de datos real ni internet. Cada prueba abre la página en tamaño celular.
// Uso:  cd tests && npm install && npx playwright install chromium && node pagina/pruebas.cjs
// Si una prueba falla, termina con error y dice cuál. Cada bloque dice qué versión de la página cubre.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'), FB = fs.readFileSync(path.join(__dirname, 'firebase-falso.js'), 'utf8');
const ADMIN_UID = 'UKluJD3k7gP4HJN24KjK1HSHlIC3';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.css': 'text/css' };

// servidor local de la carpeta del proyecto
function serve() {
  return new Promise(ok => {
    const s = http.createServer((q, r) => {
      const u = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, u === '/' ? 'index.html' : u);
      if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end() }
      fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end() } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(b) });
    }).listen(0, '127.0.0.1', () => ok(s));
  });
}

let browser, base, fallas = 0, total = 0;
const check = (nombre, ok, detalle) => { total++; if (ok) console.log('  ✔ ' + nombre); else { fallas++; console.log('  ✘ ' + nombre + (detalle ? '  → ' + detalle : '')) } };

// abre la página: dark = modo oscuro; admin = modo administrador con sesión; user = sesión de Firebase; seed = documentos iniciales
async function abrir({ dark = false, admin = false, user = null, seed = {} } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: dark ? 'dark' : 'light', serviceWorkers: 'block' });
  await ctx.route(/gstatic\.com\/firebasejs\//, r => r.fulfill({ body: /app-compat/.test(r.request().url()) ? FB : '', contentType: 'application/javascript' }));
  const pedidos = { recaptcha: 0 };
  await ctx.route(/google\.com\/recaptcha/, r => { pedidos.recaptcha++; r.fulfill({ contentType: 'application/javascript', body: 'window.grecaptcha={ready:f=>f(),execute:async()=>"TOKEN"}' }) });
  await ctx.route(/workers\.dev|googleapis|firebaseio|accounts\.google|cdnjs|ytimg|fonts\.|maps\./, r => r.fulfill({ status: 500, body: '' }));
  if (admin) await ctx.route(/\/index\.html/, async r => { const res = await r.fetch(); let t = await res.text(); t = t.replace("if(k&&sha256(k)===ADMIN_HASH)return'admin'", "if(k)return'admin'"); r.fulfill({ response: res, body: t }) });
  await ctx.addInitScript(([d, u, s]) => { localStorage.setItem('qh_cookies', '1'); if (d) localStorage.setItem('qh_theme', 'dark'); window.__authUser = u; window.__seed = s }, [dark, admin ? { uid: ADMIN_UID, isAnonymous: false, email: 'admin@x.co' } : user, seed]);
  const p = await ctx.newPage(); p.errores = [];
  p.on('pageerror', e => p.errores.push(e.message));
  p.on('console', m => { if (/Content Security Policy|Refused to/.test(m.text())) p.errores.push(m.text().slice(0, 160)) });
  await p.goto(base + '/index.html' + (admin ? '?admin=x' : '')); await p.waitForTimeout(3000);
  await p.evaluate(() => document.querySelectorAll('.qtour,.qhb').forEach(x => x.remove()));
  p.pedidos = pedidos; p.cerrar = () => ctx.close(); return p;
}
const sinErrores = (p, quien) => check(quien + ': sin errores', !p.errores.length, p.errores.join(' | '));
const conCuenta = p => p.evaluate(() => { roleShown = true; S.user = { id: 'd', name: 'Ana Pérez', email: 'ana@x.co', wa: '3155555233', pw: 1, k: 'kA' }; save(); try { syncUI() } catch (e) {} });

const PRUEBAS = {
  async inicio() { // v370 inicio limpio, v375 «Lo más reciente», v378 logo y reCAPTCHA bajo demanda
    for (const dark of [false, true]) {
      const p = await abrir({ dark }), m = dark ? 'oscuro' : 'claro';
      check('Inicio (' + m + ') se dibuja', await p.evaluate(() => !!document.querySelector('.hub .hubhero h2')));
      check('Primera pestaña es «Lo más reciente»', await p.evaluate(() => /Lo más reciente/.test((document.querySelector('.hswt button') || {}).textContent || '')));
      check('El logo carga desde su archivo', await p.evaluate(() => { const i = document.querySelector('#home img'); return !!i && /logo-mp(-oscuro)?\.webp$/.test(i.src) && i.complete && i.naturalWidth > 0 }));
      check('reCAPTCHA no se descarga al abrir', p.pedidos.recaptcha === 0, p.pedidos.recaptcha + ' pedidos');
      sinErrores(p, 'Inicio ' + m); await p.cerrar();
    }
  },
  async admin() { // las 12 pestañas del panel
    for (const dark of [false, true]) {
      const p = await abrir({ dark, admin: true });
      const tabs = await p.evaluate(() => [...new Set([...document.querySelectorAll('[data-act="at"]')].map(x => x.dataset.v))]);
      for (const t of tabs) { await p.evaluate(t => { const e = document.querySelector('[data-act="at"][data-v="' + t + '"]'); e && e.click() }, t); await p.waitForTimeout(250) }
      check('Admin (' + (dark ? 'oscuro' : 'claro') + '): abre ' + tabs.length + ' pestañas', tabs.length >= 12, tabs.join(','));
      sinErrores(p, 'Admin'); await p.cerrar();
    }
  },
  async registro() { // v368 registro en un paso, v371 celular ya usado
    const p = await abrir({ seed: { 'tels/3009998877': { uid: 'otro', k: 'kO' } } });
    await p.evaluate(() => {
      window.rcToken = async () => 't'; window.__log = [];
      const mk = em => ({ email: em, emailVerified: false, displayName: '', async updateProfile(o) { this.displayName = o.displayName }, async sendEmailVerification() { __log.push('enlace') }, async reload() { if (window.__ok) this.emailVerified = true }, async delete() { __log.push('borrada') } });
      const A = { currentUser: null, async createUserWithEmailAndPassword(em) { this.currentUser = mk(em); __log.push('creada'); return { user: this.currentUser } }, async signOut() { this.currentUser = null } };
      window.authB = async () => A; firebase.auth = Object.assign(() => ({ currentUser: { uid: 'anon', isAnonymous: true }, signInWithEmailAndPassword: async () => {}, onAuthStateChanged() {}, signOut: async () => {} }), firebase.auth);
      regForm();
    });
    await p.waitForTimeout(300);
    check('Registro sin «Repite la contraseña»', await p.evaluate(() => !document.getElementById('r-pw2') && !!document.getElementById('r-pw')));
    const llenar = async tel => { await p.fill('#r-name', 'Ana Pérez'); await p.fill('#r-em', 'ana@x.co'); await p.fill('#r-tel', tel); await p.fill('#r-pw', 'Clave1234'); await p.check('#u-ok') };
    await llenar('3009998877'); await p.click('#reg-go'); await p.waitForTimeout(500);
    check('No deja registrar un celular de otra cuenta', /otra cuenta/.test(await p.evaluate(() => document.getElementById('err').textContent)));
    await p.fill('#r-tel', '3155555233'); await p.click('#reg-go'); await p.waitForTimeout(600);
    check('Después de «Registrarme» pide abrir el enlace', await p.evaluate(() => !!document.getElementById('rw')));
    await p.evaluate(() => { closeModal(1); window.__ok = true }); await p.waitForTimeout(3800);
    const u = await p.evaluate(() => S.user && S.user.email + '|' + S.user.wa);
    check('Al confirmar el correo entra solo', u === 'ana@x.co|3155555233', u);
    sinErrores(p, 'Registro'); await p.cerrar();
  },
  async pedido() { // v363 si se registra para pedir, al tener cuenta y dirección se abre el carrito
    const p = await abrir();
    await p.evaluate(() => { QH.push = () => {}; window.open = u => { window.__wa = decodeURIComponent(u) }; S.stores.push({ id: 'sw', name: 'Tienda WA', wa: '3001234567', pays: ['cash'], products: [{ id: 'p2', name: 'Arroz', price: 4000, imgs: [] }] }); S.cart = { 'sw|p2||': 2 }; save(); openCart() });
    await p.waitForTimeout(300); await p.evaluate(() => document.querySelector('[data-act="order"][data-id="sw"]').click()); await p.waitForTimeout(400);
    check('Sin cuenta, pedir abre «Registrarme»', /Registrarme/.test(await p.evaluate(() => (document.querySelector('#ov .am-tab[aria-selected="true"]') || {}).textContent || '')));
    await p.evaluate(() => { closeModal(1); S.user = { id: 'u9', name: 'Ana Pérez', email: 'a@x.co', wa: '3112223344', pw: 1, k: 'kN' }; save(); syncUI() }); await p.waitForTimeout(2200);
    check('Con cuenta y sin dirección, pide la dirección', /dirección/i.test(await p.evaluate(() => (document.querySelector('#ov h2') || {}).textContent || '')));
    await p.evaluate(() => { const z = document.querySelector('#ov .znsel'); z.value = 'Centro'; z.dispatchEvent(new Event('change', { bubbles: true })); document.getElementById('ad-dir').value = 'Calle 5 # 3-20'; document.querySelector('[data-adok="1"]').click(); document.querySelector('[data-adsave]').click() });
    await p.waitForTimeout(2500);
    check('Con dirección, se abre el carrito resaltado', await p.evaluate(() => !!document.querySelector('#drawer.open .ordgo, #drawer .ordgo')));
    await p.evaluate(() => document.querySelector('#drawer .ordgo').click()); await p.waitForTimeout(400);
    const wa = await p.evaluate(() => window.__wa || '');
    check('El WhatsApp lleva cliente, teléfono y dirección', /Cliente: Ana Pérez/.test(wa) && /3112223344/.test(wa) && /Calle 5/.test(wa), wa.slice(0, 120));
    sinErrores(p, 'Pedido'); await p.cerrar();
  },
  async direccion() { // v372 la pregunta del mapa no se repite si ya se respondió
    const p = await abrir(); await conCuenta(p);
    const st = () => p.evaluate(() => { const v = s => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== 'none' }; return v('#ov .adq') });
    await p.evaluate(() => adrForm('main')); await p.waitForTimeout(300);
    check('Dirección nueva: sale la pregunta del mapa', await st());
    await p.evaluate(() => { const s = document.querySelector('#ov .znsel'); s.value = 'Centro'; s.dispatchEvent(new Event('change', { bubbles: true })) }); await p.fill('#ad-dir', 'Calle 5 # 3-20');
    await p.evaluate(() => document.querySelector('[data-adok="1"]').click()); await p.click('[data-adsave]'); await p.waitForTimeout(300);
    await p.evaluate(() => adrForm('main')); await p.waitForTimeout(300);
    check('Ya respondida: la pregunta no sale', !(await st()));
    await p.fill('#ad-dir', 'Calle 7 # 2-10'); await p.waitForTimeout(100);
    check('Si cambia la dirección, vuelve a preguntar', await st());
    sinErrores(p, 'Dirección'); await p.cerrar();
  },
  async anuncio() { // v380 ubicación del anuncio desde la dirección registrada
    const p = await abrir({ user: { uid: 'uA', isAnonymous: false, email: 'ana@x.co' } }); await conCuenta(p);
    await p.evaluate(() => { window.adrGet = w => w === 'main' ? { zone: 'Centro', dir: 'Calle 5' } : null; comForm() }); await p.waitForTimeout(800);
    const op = await p.evaluate(() => [...document.querySelectorAll('.cml input')].map(i => i.value + (i.checked ? '*' : '')).join(','));
    check('Ubicación: «Mi barrio», «Otro» y «No mostrar»', op === 'mine*,otro,none', op);
    check('Usa el barrio de la dirección', await p.evaluate(() => document.getElementById('cm-z').value === 'Centro'));
    await p.evaluate(() => document.querySelector('.cml input[value="none"]').click()); await p.waitForTimeout(150);
    check('«No mostrar» deja el barrio vacío', await p.evaluate(() => document.getElementById('cm-z').value === ''));
    sinErrores(p, 'Anuncio'); await p.cerrar();
  },
  async notificaciones() { // v381-v383 avisos dentro de Notificaciones y número en la pestaña
    const p = await abrir({ user: { uid: 'uA', isAnonymous: false, email: 'ana@x.co' } });
    const n = () => p.evaluate(() => { const e = document.querySelector('#bnav .bnb'); return e && !e.hidden ? +e.textContent : 0 });
    check('Sin cuenta no hay número en «Mi cuenta»', (await n()) === 0);
    await conCuenta(p); await p.waitForTimeout(1800);
    check('Con cuenta: 2 avisos sin leer', (await n()) === 2, String(await n()));
    await p.evaluate(() => nfOpen()); await p.waitForTimeout(200); await p.evaluate(() => closeModal(1)); await p.waitForTimeout(1700);
    check('Al abrirlas queda solo «Publica tu anuncio gratis»', (await n()) === 1, String(await n()));
    await p.evaluate(() => { __fake.docs['community/c1'] = { id: 'c1', ownerKey: QH.key(), pl: 'free', ts: Date.now(), exp: Date.now() + 864e5, title: 'Vendo nevera', cat: 'hog', op: 'venta' }; __fake.notify('community/c1') }); await p.waitForTimeout(1700);
    check('Al publicar el anuncio gratis se apaga', (await n()) === 0, String(await n()));
    await p.evaluate(() => { const a = __fake.docs['community/c1']; a.ts = Date.now() - 30 * 36e5; a.exp = Date.now() - 6 * 36e5; __fake.notify('community/c1') }); await p.waitForTimeout(1700);
    check('Anuncio vencido: aviso «venció» con «Renovar ahora»', await p.evaluate(() => /venció/.test(nfPromos()) && /cmxRenew/.test(nfPromos())));
    sinErrores(p, 'Notificaciones'); await p.cerrar();
  },
  async celular() { // v371 un celular por cuenta
    const p = await abrir({ user: { uid: 'uA', isAnonymous: false, email: 'ana@x.co' }, seed: { 'tels/3155555233': { uid: 'otro', k: 'kO' } } });
    await p.evaluate(() => { S.user = { id: 'd', name: 'Julia', email: 'julia@x.co', wa: '3001234567' } });
    check('Con correo, la ficha usa la llave del correo', await p.evaluate(() => QH.key() === sha256('mail:julia@x.co')));
    await p.evaluate(() => { const k = QH.key(); __fake.docs['plans/' + k] = { k, name: 'Julia', wa: '3001234567', uid: 'uA' }; __fake.notify('plans/' + k); S.plan = __fake.docs['plans/' + k] });
    await p.evaluate(() => { S.user.wa = '3155555233'; QH.planProf('Julia', '3155555233') }); await p.waitForTimeout(500);
    check('No deja guardar el celular de otra cuenta', await p.evaluate(() => __fake.docs['plans/' + QH.key()].wa === '3001234567'));
    await p.evaluate(() => { S.user.wa = '3009998877'; QH.planProf('Julia', '3009998877') }); await p.waitForTimeout(500);
    check('Un celular libre se reserva', await p.evaluate(() => (__fake.docs['tels/3009998877'] || {}).uid === 'uA'));
    sinErrores(p, 'Celular'); await p.cerrar();
  },
};

(async () => {
  const s = await serve(); base = 'http://127.0.0.1:' + s.address().port;
  browser = await chromium.launch();
  const solo = process.argv.slice(2);
  for (const [nombre, fn] of Object.entries(PRUEBAS)) {
    if (solo.length && !solo.includes(nombre)) continue;
    console.log('\n' + nombre.toUpperCase());
    try { await fn() } catch (e) { fallas++; total++; console.log('  ✘ se detuvo: ' + String(e.message).split('\n')[0]) }
  }
  await browser.close(); s.close();
  console.log('\nPruebas: ' + total + ' · fallas: ' + fallas);
  process.exit(fallas ? 1 : 0);
})();
