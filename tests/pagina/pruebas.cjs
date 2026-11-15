// Pruebas automáticas de la página (index.html) con un navegador de verdad (Playwright) y un Firebase falso
// (firebase-falso.js): no toca la base de datos real ni internet. Cada prueba abre la página en tamaño celular.
// Uso:  cd tests && npm install && npx playwright install chromium && node pagina/pruebas.cjs
// Si una prueba falla, termina con error y dice cuál. Cada bloque dice qué versión de la página cubre.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'), FB = fs.readFileSync(path.join(__dirname, 'firebase-falso.js'), 'utf8');
const ADMIN_UID = 'KUowZZ25CePVc9IXGmhCLVbbSIB3';
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
  const p = await ctx.newPage(); p.errores = []; p.danados = [];
  p.on('pageerror', e => p.errores.push(e.message));
  p.on('console', m => { if (/Content Security Policy|Refused to/.test(m.text())) p.errores.push(m.text().slice(0, 160)); if (/^v413:/.test(m.text())) p.danados.push(m.text().slice(0, 160)) }); // v413: ninguna publicación bien hecha debe ser corregida
  await p.goto(base + '/index.html' + (admin ? '?admin=x' : '')); await p.waitForTimeout(3000);
  await p.evaluate(() => document.querySelectorAll('.qtour,.qhb').forEach(x => x.remove()));
  p.pedidos = pedidos; p.cerrar = () => ctx.close(); return p;
}
const sinErrores = (p, quien) => check(quien + ': sin errores', !p.errores.length && (p.raros || !(p.danados || []).length), p.errores.concat(p.raros ? [] : p.danados || []).join(' | '));
const conCuenta = p => p.evaluate(() => { roleShown = true; S.user = { id: 'd', name: 'Ana Pérez', email: 'ana@x.co', wa: '3155555233', pw: 1, k: 'kA' }; save(); try { syncUI() } catch (e) {} });

const PRUEBAS = {
  async inicio() { // v370 inicio limpio, v375 «Lo más reciente», v378 logo y reCAPTCHA bajo demanda
    for (const dark of [false, true]) {
      const p = await abrir({ dark }), m = dark ? 'oscuro' : 'claro';
      check('Inicio (' + m + ') se dibuja', await p.evaluate(() => !!document.querySelector('.hub .hubhero h2')));
      check('Primera pestaña es «Lo más reciente»', await p.evaluate(() => /Lo más reciente/.test((document.querySelector('.hswt button') || {}).textContent || '')));
      check('Primer aviso del carrusel: «Publica tu anuncio gratis»', /Publica tu anuncio gratis/.test(await p.evaluate(() => ((document.querySelector('.bzcs > .bzc h3') || {}).textContent || ''))));
      check('El logo carga desde su archivo', await p.evaluate(() => { const i = document.querySelector('#home img'); return !!i && /logo-mp(-oscuro)?\.webp$/.test(i.src) && i.complete && i.naturalWidth > 0 }));
      check('Las imágenes de categorías y pagos existen como archivos', await p.evaluate(async () => { const l = ['img/cat-moda.webp', 'img/cat-inmuebles.webp', 'img/pago-bre.jpg', 'img/pago-nequi.jpg']; for (const u of l) { const r = await fetch(u); if (!r.ok) return false } return /img\/cat-/.test(JSON.stringify(MLIMG)) }));
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
  async pedido() { // pedir por WhatsApp sin cuenta (v416) y con cuenta (v424: ya no se pide la dirección con mapa)
    const p = await abrir();
    await p.evaluate(() => { QH.push = () => {}; window.open = u => { window.__wa = decodeURIComponent(u) }; S.stores.push({ id: 'sw', name: 'Tienda WA', wa: '3001234567', pays: ['cash'], products: [{ id: 'p2', name: 'Arroz', price: 4000, imgs: [] }] }); S.cart = { 'sw|p2||': 2 }; save(); openCart() });
    await p.waitForTimeout(300); await p.evaluate(() => document.querySelector('[data-act="order"][data-id="sw"]').click()); await p.waitForTimeout(400);
    check('Sin cuenta, pedir abre «Tus datos para el pedido» (v416), no «Registrarme»', /Tus datos para el pedido/.test(await p.evaluate(() => (document.querySelector('#ov h2') || {}).textContent || '')));
    await p.evaluate(() => { closeModal(1); S.user = { id: 'u9', name: 'Ana Pérez', email: 'a@x.co', wa: '3112223344', pw: 1, k: 'kN' }; save(); syncUI() }); await p.waitForTimeout(400);
    await p.evaluate(() => { openCart(); document.querySelector('[data-act="order"][data-id="sw"]').click() }); await p.waitForTimeout(600);
    check('Con cuenta, pedir abre «Tus datos para el pedido», sin dirección con mapa (v424)', /Tus datos para el pedido/.test(await p.evaluate(() => (document.querySelector('#ov h2') || {}).textContent || '')) && await p.evaluate(() => !document.querySelector('#ov #ad-map, #ov .adq')));
    check('La ventana queda encima del carrito (v416)', await p.evaluate(() => { const h = document.querySelector('#ov h2'), r = h.getBoundingClientRect(), t = document.elementFromPoint(r.x + 5, r.y + 5); return !!t && !!t.closest('#ov') }));
    await p.evaluate(() => { const z = document.querySelector('#ov .znsel'); z.value = 'Centro'; z.dispatchEvent(new Event('change', { bubbles: true })); document.getElementById('iv-d').value = 'Calle 5 # 3-20'; document.querySelector('[data-ivgo="ped"]').click() });
    await p.waitForTimeout(1200);
    const wa = await p.evaluate(() => window.__wa || '');
    check('El WhatsApp lleva cliente, teléfono y dirección', /Cliente: Ana Pérez/.test(wa) && /3112223344/.test(wa) && /Calle 5/.test(wa), wa.slice(0, 120));
    sinErrores(p, 'Pedido'); await p.cerrar();
  },
  async direccion() { // v372 la pregunta del mapa no se repite si ya se respondió
    const p = await abrir(); await conCuenta(p);
    const st = () => p.evaluate(() => { const v = s => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== 'none' }; return v('#ov .adq') });
    await p.evaluate(() => adrForm('main')); await p.waitForTimeout(300); await p.evaluate(() => qhPasos.ver('.adq')); // v417: la pregunta está en el paso del mapa
    check('Dirección nueva: sale la pregunta del mapa', await st());
    await p.evaluate(() => qhPasos.ver('#ad-dir')); await p.evaluate(() => { const s = document.querySelector('#ov .znsel'); s.value = 'Centro'; s.dispatchEvent(new Event('change', { bubbles: true })) }); await p.fill('#ad-dir', 'Calle 5 # 3-20');
    await p.evaluate(() => qhPasos.ver('.adq')); await p.evaluate(() => document.querySelector('[data-adok="1"]').click()); await p.click('[data-adsave]'); await p.waitForTimeout(300);
    await p.evaluate(() => adrForm('main')); await p.waitForTimeout(300); await p.evaluate(() => qhPasos.ver('.adq')); 
    check('Ya respondida: la pregunta no sale', !(await st()));
    await p.evaluate(() => qhPasos.ver('#ad-dir')); await p.fill('#ad-dir', 'Calle 7 # 2-10'); await p.waitForTimeout(100); await p.evaluate(() => qhPasos.ver('.adq')); 
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
  async appcheck() { // v379/v385 App Check con Fraud Defense (en mipradera.com.co; aquí se fuerza con ?appcheck=1)
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    const AC = 'firebase.appCheck=function(app){return{activate:function(p,a){(window.__ac=window.__ac||[]).push((app&&app.name)+"|"+p.tipo+"|"+p.k+"|"+a)}}};firebase.appCheck.ReCaptchaEnterpriseProvider=function(k){this.k=k;this.tipo="enterprise"};firebase.appCheck.ReCaptchaV3Provider=function(k){this.k=k;this.tipo="v3"};';
    await ctx.route(/gstatic\.com\/firebasejs\//, r => { const u = r.request().url(); r.fulfill({ body: /app-compat/.test(u) ? FB : /app-check-compat/.test(u) ? AC : '', contentType: 'application/javascript' }) });
    await ctx.route(/google\.com\/recaptcha|workers\.dev|googleapis|firebaseio|accounts\.google|cdnjs|ytimg|fonts\.|maps\./, r => r.fulfill({ status: 500, body: '' }));
    await ctx.addInitScript(() => localStorage.setItem('qh_cookies', '1'));
    const p = await ctx.newPage(); p.errores = []; p.on('pageerror', e => p.errores.push(e.message));
    await p.goto(base + '/index.html?appcheck=1'); await p.waitForTimeout(2500);
    const ac = await p.evaluate(() => (window.__ac || []).join(' '));
    check('App Check usa Fraud Defense con la clave del proyecto', /\[DEFAULT\]\|enterprise\|6LcaDhguAAAAAEuRH9ah74jx2wRLAY4UY6xvUf18\|true/.test(ac), ac);
    const t0 = Date.now(), tok = await p.evaluate(() => rcToken('rc-login'));
    check('Con App Check el inicio de sesión no espera reCAPTCHA', tok === 'appcheck' && Date.now() - t0 < 1000, tok + ' en ' + (Date.now() - t0) + ' ms');
    await p.evaluate(() => { firebase.app = n => { if (n) throw new Error('no existe'); return { options: {} } }; return authB() }); await p.waitForTimeout(200);
    check('La conexión de inicio de sesión también queda protegida', /sms\|enterprise/.test(await p.evaluate(() => (window.__ac || []).join(' '))));
    sinErrores(p, 'App Check'); await ctx.close();
  },
  async guias() { // v366/v387 las guías abren «Hazlo conmigo» (sin visor de fotos)
    const p = await abrir(); await conCuenta(p);
    await p.evaluate(() => helpOpen()); await p.waitForTimeout(400);
    const items = await p.evaluate(() => [...document.querySelectorAll('#ov .qhl [data-guide]')].map(b => b.dataset.guide).join(','));
    check('Ayuda y guías muestra las guías', items.split(',').length >= 7, items);
    await p.evaluate(() => document.querySelector('#ov .qhl [data-guide="cla"]').click()); await p.waitForTimeout(1200);
    check('Una guía abre «Hazlo conmigo» y no el visor de fotos', await p.evaluate(() => !!document.getElementById('qco') && !document.querySelector('.qtour')));
    sinErrores(p, 'Guías'); await p.cerrar();
  },
  async avisos() { // v318 aviso emergente y v321 notificaciones, ahora como ganchos de toast (v389)
    const p = await abrir({ user: { uid: 'uA', isAnonymous: false, email: 'ana@x.co' } }); await conCuenta(p); await p.waitForTimeout(800);
    const n0 = await p.evaluate(() => nfUnread());
    await p.evaluate(() => toast('Tu pedido fue enviado a la tienda')); await p.waitForTimeout(400);
    check('Un aviso sale en la ventanita de arriba', /pedido fue enviado/.test(await p.evaluate(() => (document.getElementById('qpop') || {}).textContent || '')));
    check('Y queda guardado en Notificaciones', (await p.evaluate(() => nfUnread())) === n0 + 1);
    await p.evaluate(() => toast('Copiado')); await p.waitForTimeout(300);
    check('Un aviso sin importancia no se guarda', (await p.evaluate(() => nfUnread())) === n0 + 1);
    sinErrores(p, 'Avisos'); await p.cerrar();
  },
  async letrero() { // v411 letrero Abierto / Cerrado de la tienda (reemplaza la pausa de v310)
    const tienda = (id, x) => Object.assign({ id, name: 'Tienda ' + id, ownerKey: 'kOtro', cat: 'Otros', wa: '3001234567', products: [{ id: 'p1', name: 'Arroz', price: 4000 }] }, x);
    const p = await abrir({ seed: { 'stores/s1': tienda('s1', { _o: 1, shut: 1, shutN: 'Hoy no hay atención' }), 'stores/s2': tienda('s2', { _o: 2 }), 'stores/s3': tienda('s3', { _o: 3, pause: Date.now() + 864e5 }) } });
    const ver = async id => { await p.evaluate(i => { closeModal(1); view = 'store'; cur = i; render() }, id); await p.waitForTimeout(300); return p.evaluate(() => { const l = document.querySelector('#app .ltr'); return l ? (l.classList.contains('off') ? 'CERRADO ' : 'ABIERTO ') + l.innerText : '' }) };
    const c = await ver('s1');
    check('Con el letrero de cerrado, el cliente ve «cerrada» y la nota', /^CERRADO/.test(c) && /Hoy no hay atención/.test(c), c);
    check('El cliente sigue viendo la sección de productos', await p.evaluate(() => { const h = [...document.querySelectorAll('#app h3.ptitle')].find(x => /Productos/.test(x.textContent)); return !!h && getComputedStyle(h).display !== 'none' }));
    check('La insignia del horario dice cerrado', await p.evaluate(() => /Cerrado ahora/.test(openBadge(S.stores.find(x => x.id === 's1')))));
    check('El cliente no ve el botón «Cambiar letrero»', await p.evaluate(() => !document.querySelector('[data-ltr="menu"]')));
    check('Sin letrero de cerrado, se ve abierto', /^ABIERTO/.test(await ver('s2')));
    check('Una tienda con la pausa vieja ya no se ve en pausa', /^ABIERTO/.test(await ver('s3')) && await p.evaluate(() => !/en pausa/i.test(document.getElementById('app').innerText)));
    await conCuenta(p); await p.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<i class="qtour" hidden></i>')); // así no se abre sola «Tu dirección principal» (v322) en medio de la prueba
    await p.evaluate(() => { S.mine.push('s2') }); await ver('s2');
    check('El dueño ve «Cambiar letrero» y ya no «Pausar tienda»', await p.evaluate(() => !!document.querySelector('[data-ltr="menu"]') && !/Pausar tienda/.test(document.getElementById('app').innerText)));
    await p.click('[data-ltr="menu"]'); await p.waitForTimeout(300);
    await p.click('[data-ltr="pick"][data-v="1"]'); await p.click('[data-ltr="nota"][data-k="otro"]'); await p.fill('#ltr-o', 'Volvemos a las 3'); await p.waitForTimeout(200);
    await p.click('[data-ltr="ok"]'); await p.waitForTimeout(400);
    check('El dueño pone cerrado con su propia nota', await p.evaluate(() => { const s = S.stores.find(x => x.id === 's2'); return s.shut === 1 && s.shutN === 'Volvemos a las 3' && /Volvemos a las 3/.test(document.querySelector('#app .ltr.off').innerText) }));
    await p.click('[data-ltr="menu"]'); await p.click('[data-ltr="nota"][data-k="none"]'); await p.click('[data-ltr="ok"]'); await p.waitForTimeout(400);
    check('Puede dejar solo el letrero, sin nota', await p.evaluate(() => { const s = S.stores.find(x => x.id === 's2'); return s.shut === 1 && s.shutN === '' }));
    await p.click('[data-ltr="menu"]'); await p.click('[data-ltr="pick"][data-v="0"]'); await p.click('[data-ltr="ok"]'); await p.waitForTimeout(400);
    check('El dueño vuelve a poner abierto', await p.evaluate(() => { const s = S.stores.find(x => x.id === 's2'); return !s.shut && !!document.querySelector('#app .ltr.on') }));
    // v421: abrir fuera del horario
    await p.evaluate(() => { const hoy = (new Date().getDay() + 6) % 7; S.stores.push({ id: 's4', name: 'Tienda s4', ownerKey: 'kA', cat: 'Otros', wa: '3001234567', products: [], days: [(hoy + 1) % 7], open: '08:00', close: '18:00' }); S.mine.push('s4') });
    check('Una tienda cerrada por horario se ve cerrada', /^CERRADO/.test(await ver('s4')) && await p.evaluate(() => /horario dice cerrado/.test(document.querySelector('#app .ltr').innerText)));
    await p.click('[data-ltr="menu"]'); await p.waitForTimeout(300);
    check('Al elegir «Abierto» con el horario cerrado, el menú lo explica y ofrece «Abrir ahora (vale por hoy)» ya marcado', await p.evaluate(() => { const b = [...document.querySelectorAll('[data-ltr="forz"]')]; return b.length === 2 && b[0].getAttribute('aria-pressed') === 'true' && /Abrir ahora \(vale por hoy\)/.test(b[0].textContent) && /Tu horario dice cerrado/.test(document.getElementById('ltr-b').innerText) }));
    await p.click('[data-ltr="ok"]'); await p.waitForTimeout(400);
    check('Guardar el letrero de abierto abre la tienda aunque el horario diga cerrado', await p.evaluate(() => { const x = S.stores.find(y => y.id === 's4'); return !x.shut && x.opn > Date.now() && x.opn < Date.now() + 25 * 36e5 && !!document.querySelector('#app .ltr.on') && /Abierto ahora/.test(openBadge(x)) && /Vale por hoy/.test(document.querySelector('#app .ltr').innerText) }));
    await p.evaluate(() => { S.stores.find(y => y.id === 's4').opn = Date.now() - 1000 });
    check('Cuando pasa el día, vuelve sola al horario (cerrada)', /^CERRADO/.test(await ver('s4')));
    await p.click('[data-ltr="menu"]'); await p.waitForTimeout(200); await p.click('[data-ltr="forz"][data-v="0"]'); await p.click('[data-ltr="ok"]'); await p.waitForTimeout(400);
    check('Con «Seguir mi horario» la tienda sigue cerrada', await p.evaluate(() => { const x = S.stores.find(y => y.id === 's4'); return !x.opn && !!document.querySelector('#app .ltr.off') }));
    await p.evaluate(() => { const x = S.stores.find(y => y.id === 's4'); x.opn = Date.now() + 36e5; x.shut = 1 });
    check('El letrero de cerrado sigue mandando sobre todo', /^CERRADO/.test(await ver('s4')) && await p.evaluate(() => /Cerrado ahora/.test(openBadge(S.stores.find(y => y.id === 's4')))));
    await ver('s2'); await p.click('[data-ltr="menu"]'); await p.waitForTimeout(200);
    check('Si el horario no dice cerrado, el menú no ofrece abrir por hoy', await p.evaluate(() => !document.querySelector('[data-ltr="forz"]')));
    await p.evaluate(() => closeModal(1));
    sinErrores(p, 'Letrero'); await p.cerrar();
  },
  async carrusel() { // v391 el carrusel avanza solo en celulares táctiles y con «reducir movimiento»
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await ctx.route(/gstatic\.com\/firebasejs\//, r => r.fulfill({ body: /app-compat/.test(r.request().url()) ? FB : '', contentType: 'application/javascript' }));
    await ctx.route(/google\.com\/recaptcha|workers\.dev|googleapis|firebaseio|accounts\.google|cdnjs|ytimg|fonts\.|maps\./, r => r.fulfill({ status: 500, body: '' }));
    await ctx.addInitScript(() => localStorage.setItem('qh_cookies', '1'));
    const p = await ctx.newPage(); p.errores = []; p.on('pageerror', e => p.errores.push(e.message));
    await p.goto(base + '/index.html'); await p.waitForTimeout(3000);
    await p.evaluate(() => document.querySelectorAll('.qtour,.qhb').forEach(x => x.remove()));
    await p.evaluate(() => document.querySelector('.bzcs').scrollIntoView({ block: 'center' }));
    const pos = () => p.evaluate(() => Math.round(document.querySelector('.bzcs').scrollLeft));
    const a0 = await pos(); await p.waitForTimeout(7600); const a1 = await pos();
    check('El carrusel avanza solo (táctil y con «reducir movimiento»)', a1 > a0, a0 + ' → ' + a1);
    sinErrores(p, 'Carrusel'); await ctx.close();
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
  async codigoPlus() { // v394 el código plus del negocio solo lo pone el administrador
    const tienda = { id: 's1', name: 'Panadería', cat: 'Otros', wa: '3112223344', ownerKey: 'kA', addr: 'Calle 5 # 3-20', zone: 'Centro', products: [] };
    const p = await abrir({ seed: { 'stores/s1': tienda } }); await conCuenta(p);
    await p.evaluate(() => { closeModal(1); view = 'store'; cur = 's1'; render(); editShop() }); await p.waitForTimeout(500);
    check('El dueño no ve el campo del código plus ni el video', await p.evaluate(() => !document.querySelector('#x-plus:not([type=hidden]),#ov [data-act="plusVid"]')));
    check('Debajo de la dirección se ve el mapa de Google Maps', await p.evaluate(() => /maps\.google\.com\/maps\?q=Calle%205/.test((document.querySelector('#x-map iframe') || {}).src || '')));
    await p.waitForTimeout(300); await p.evaluate(() => qhPasos.ver('.mq')); await p.click('.mq [data-v="0"]'); // v417: la pregunta está en «Ubicación»; v402: botones «Sí, está bien» / «No, no aparece bien»
    check('Si Google Maps no lo ubica, queda pendiente', await p.evaluate(() => readHours().mapfix === true));
    sinErrores(p, 'Formulario del negocio'); await p.cerrar();
    const q = await abrir({ admin: true, seed: { 'stores/s1': Object.assign({}, tienda, { mapfix: true }) } });
    await q.evaluate(() => { closeModal(1); at = 'usr'; view = 'admin'; render() }); await q.waitForTimeout(500);
    check('El administrador ve el negocio por ubicar', await q.evaluate(() => /Panadería/.test((document.querySelector('.aadp') || {}).textContent || '')));
    sinErrores(q, 'Negocios por ubicar'); await q.cerrar();
  },
  async inmuebleUbicacion() { // v396 dirección del inmueble, mapa y aviso al administrador
    const p = await abrir(); await conCuenta(p);
    await p.evaluate(() => { closeModal(1); adForm('arr') }); await p.waitForTimeout(400);
    check('El inmueble pide su dirección (vacía, no la personal)', await p.evaluate(() => document.getElementById('af-addr').value === ''));
    await p.fill('#af-addr', 'Carrera 10 # 7-45'); await p.waitForTimeout(1300);
    check('Debajo de la dirección del inmueble se ve el mapa', await p.evaluate(() => /Carrera%2010/.test((document.querySelector('#af-map iframe') || {}).src || '')));
    check('Tiene la pregunta de Google Maps', await p.evaluate(() => !!document.getElementById('af-mapok')));
    sinErrores(p, 'Formulario del inmueble'); await p.cerrar();
    const q = await abrir({ admin: true, seed: { 'ads/i1': { id: 'i1', type: 'arr', title: 'Casa en arriendo', price: 900000, zone: 'Centro', desc: '', imgs: [], f: { addr: 'Carrera 10 # 7-45', mapok: 'No lo ubica bien' }, ts: Date.now(), ownerKey: 'kA' } } });
    await q.evaluate(() => { closeModal(1); at = 'usr'; view = 'admin'; render() }); await q.waitForTimeout(500);
    check('El administrador ve el inmueble por ubicar', await q.evaluate(() => !!document.querySelector('[data-adplus="i1"]')));
    sinErrores(q, 'Inmuebles por ubicar'); await q.cerrar();
  },
  async mapaInmueble() { // v409 el visitante ve el mapa del inmueble en el anuncio
    const ad = (id, x) => Object.assign({ id, type: 'arr', title: 'Casa en arriendo', price: 900000, zone: 'Centro', desc: '', imgs: [], ts: Date.now(), ownerKey: 'kA' }, x);
    const p = await abrir({ seed: { 'ads/i1': ad('i1', { f: { addr: 'Carrera 10 # 7-45', mapok: 'Sí, lo ubica bien' } }), 'ads/i2': ad('i2', { f: { addr: 'Calle 1 # 2-3', mapok: 'No lo ubica bien' } }), 'ads/i3': ad('i3', { type: 'casa', lat: 3.42, lng: -76.24, plus: 'CQ94+H47', f: { addr: 'Calle 9 # 1-1', mapok: 'Sí, lo ubica bien' } }) } });
    const ver = async id => { await p.evaluate(i => { closeModal(1); curAd = i; view = 'ad'; render() }, id); await p.waitForTimeout(400); return p.evaluate(() => (document.querySelector('.adview .advmap iframe') || {}).src || '') };
    check('El anuncio del inmueble muestra el mapa de su dirección', /Carrera%2010.*Centro/.test(await ver('i1')));
    check('Tiene el enlace «Abrir en Google Maps»', await p.evaluate(() => /google\.com\/maps\/search/.test((document.querySelector('.advmap a') || {}).href || '')));
    check('Si el dueño dijo que no lo ubica bien, no se muestra el mapa', await ver('i2') === '');
    check('Con el punto del administrador, el mapa usa ese punto', /q=3\.42(%2C|,)-76\.24/.test(await ver('i3')));
    await p.evaluate(() => render()); await p.waitForTimeout(400);
    check('El mapa no se repite al volver a dibujar', await p.evaluate(() => document.querySelectorAll('.advmap').length === 1));
    sinErrores(p, 'Mapa del inmueble'); await p.cerrar();
  },
  async sistecredito() { // v410 medio de pago Sistecrédito
    const p = await abrir();
    check('Sistecrédito está entre los medios de pago', await p.evaluate(() => paysTxt({ pays: ['cash', 'siste'] }) === 'Efectivo · Sistecrédito'));
    check('El logo de Sistecrédito existe como archivo', await p.evaluate(async () => (await fetch(PAYIMG.siste)).ok));
    check('El formulario de la tienda lo ofrece con su logo', await p.evaluate(() => { const d = document.createElement('div'); d.innerHTML = extraFields({ pays: ['siste'] }, 1); const i = d.querySelector('#x-pays input[value=siste]'); return !!i && i.checked && !!i.parentNode.querySelector('img[alt="Sistecrédito"]') }));
    sinErrores(p, 'Sistecrédito'); await p.cerrar();
  },
  async borradores() { // v399 borradores solo para emergencias; v412 al salir se pregunta si guardar
    const p = await abrir(); await conCuenta(p);
    await p.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<i class="qtour" hidden></i>')); // así no se abre sola «Tu dirección principal» (v322, cada 2,5 s si no hay ventana abierta) en medio de la prueba
    const abre = async () => { await p.evaluate(() => { closeModal(1); adForm('arr') }); await p.waitForTimeout(400) };
    const hay = sel => p.evaluate(s => !!document.querySelector(s), sel);
    await abre(); await p.evaluate(() => document.querySelector('#ov [data-act=close]').click()); await p.waitForTimeout(300);
    check('Sin cambios, la ventana se cierra sin preguntar', !(await hay('#sgq')) && !(await hay('#ov')));
    await abre(); await p.mouse.click(5, 5); await p.waitForTimeout(300);
    check('Sin cambios, un toque afuera tampoco cierra el formulario', await hay('#ov [data-act="saveAd"]'));
    await p.evaluate(() => { closeModal(1); modal('<h2>Aviso</h2><button class="btn" data-act="close">Cerrar</button>') }); await p.waitForTimeout(200); await p.mouse.click(5, 5); await p.waitForTimeout(300);
    check('Las ventanas que no son formularios se siguen cerrando al tocar afuera', !(await hay('#ov')));
    await abre(); await p.fill('#af-title', 'Casa con patio'); await p.waitForTimeout(700);
    await p.evaluate(() => document.querySelector('#ov [data-act=close]').click()); await p.waitForTimeout(300);
    check('Con cambios, al cerrar pregunta si guardar', await p.evaluate(() => /Guardar los cambios/.test((document.getElementById('sgq') || {}).textContent || '') && document.querySelectorAll('#sgq [data-sgq]').length === 3));
    await p.click('#sgq [data-sgq="x"]'); await p.waitForTimeout(200);
    check('«Seguir editando» deja el formulario con lo escrito', !(await hay('#sgq')) && await p.evaluate(() => ($('#af-title') || {}).value === 'Casa con patio'));
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    check('La tecla Escape también pregunta', await hay('#sgq'));
    await p.click('#sgq [data-sgq="si"]'); await p.waitForTimeout(500);
    check('«Guardar cambios» usa el botón de guardar del formulario (avisa lo que falta)', !(await hay('#sgq')) && await p.evaluate(() => !!document.querySelector('#ov [data-act="saveAd"]') && ((document.querySelector('#ov #err') || {}).textContent || '').trim().length > 0));
    await p.mouse.click(5, 5); await p.waitForTimeout(300);
    check('Un toque afuera no cierra el formulario ni pregunta', !(await hay('#sgq')) && await p.evaluate(() => ($('#af-title') || {}).value === 'Casa con patio'));
    await p.evaluate(() => document.querySelector('#ov [data-act=close]').click()); await p.waitForTimeout(300);
    await p.click('#sgq [data-sgq="no"]'); await p.waitForTimeout(500);
    check('«No guardar» cierra y no deja «Continuar»', !(await hay('#ov')) && !(await hay('#brbar')) && await p.evaluate(() => !/Casa con patio/.test(localStorage.getItem('qh_borr') || '')));
    await abre(); await p.fill('#af-title', 'Lote esquinero'); await p.waitForTimeout(700);
    await p.evaluate(() => closeModal(1)); await p.waitForTimeout(500); // la ventana desaparece sin que la persona la cierre (emergencia)
    check('En una emergencia queda «Continuar»', await p.evaluate(() => /sin terminar/.test((document.getElementById('brbar') || {}).textContent || '')));
    await p.click('#brbar [data-brk]'); await p.waitForTimeout(500);
    check('«Continuar» abre el formulario con lo escrito', await p.evaluate(() => ($('#af-title') || {}).value === 'Lote esquinero'));
    await p.evaluate(() => document.querySelector('#ov [data-act=close]').click()); await p.waitForTimeout(300);
    check('Después de «Continuar», al cerrar también pregunta', await hay('#sgq'));
    await p.click('#sgq [data-sgq="no"]'); await p.waitForTimeout(300);
    await p.evaluate(() => regForm()); await p.waitForTimeout(400); await p.fill('#r-pw', 'secreta123'); await p.fill('#r-name', 'Julia'); await p.waitForTimeout(700);
    check('Nunca guarda contraseñas', await p.evaluate(() => !/secreta/.test(localStorage.getItem('qh_borr') || '')));
    sinErrores(p, 'Borradores'); await p.cerrar();
  },
  async horarioYPregunta() { // v401 solo horario por día con listas; v402 pregunta del mapa con botones
    const p = await abrir({ seed: { 'stores/s1': { id: 's1', name: 'Panadería', cat: 'Otros', wa: '3112223344', ownerKey: 'kA', addr: 'Calle 5', products: [] } } }); await conCuenta(p);
    await p.evaluate(() => { closeModal(1); view = 'store'; cur = 's1'; render(); editShop() }); await p.waitForTimeout(600);
    check('Ya no está la casilla «El horario cambia según el día» ni las horas del navegador', await p.evaluate(() => !document.querySelector('label.chk #x-hpd') && ![...document.querySelectorAll('#ov input[type=time]')].some(i => i.offsetParent) && document.querySelectorAll('#x-hrs select.ho').length === 14));
    await p.evaluate(() => qhPasos.ver('#x-hrs')); // v417: el horario está en su propia sección
    check('Sin el botón grande del final y con «Aplicar este horario…» solo en el primer día marcado', await p.evaluate(() => !document.querySelector('.hcopy') && [...document.querySelectorAll('#x-hrs .hcp')].filter(b => b.offsetParent).length === 1));
    await p.evaluate(() => { const r = document.querySelector('#x-hrs .hrow.first'); const s = r.querySelector('select.ho'); s.value = '09:30'; s.dispatchEvent(new Event('change', { bubbles: true })); r.querySelector('.hcp').click() }); await p.waitForTimeout(200);
    check('«Aplicar este horario…» lo copia a los días marcados', await p.evaluate(() => Object.values(readHrs() || {}).every(v => v.startsWith('09:30'))));
    await p.evaluate(() => qhPasos.ver('.mq')); await p.click('.mq [data-v="1"]');
    check('La pregunta del mapa tiene botones y guarda la respuesta', await p.evaluate(() => $('#x-mapok').value === '1' && readHours().mapfix === false && getComputedStyle(document.querySelector('label[for=x-mapok]')).display === 'none'));
    sinErrores(p, 'Horario y pregunta'); await p.cerrar();
  },
  async conoceElLugar() { // v403 sin portada; «Conoce el lugar»: gratis 3 fotos, con el rol 10 y video
    const R2 = i => 'https://pub-419ea53b95de40199910716cc66fd035.r2.dev/u/a/' + i + '-abcdef12.webp';
    const base = { name: 'Acabados', cat: 'Ferreterías', wa: '3112223344', products: [] };
    const p = await abrir({ seed: { 'stores/s1': { id: 's1', ...base, ownerKey: 'kO', gal: [0, 1, 2, 3, 4].map(R2), vid: 'MQ6c-4SBo9Y', pexp: Date.now() + 9e9 }, 'stores/s2': { id: 's2', ...base, ownerKey: 'kO', gal: [0, 1, 2, 3, 4].map(R2), vid: 'MQ6c-4SBo9Y', pexp: 1 } } });
    await p.evaluate(() => { closeModal(1); view = 'store'; cur = 's1'; render() }); await p.waitForTimeout(300);
    check('Ya no hay espacio de portada', await p.evaluate(() => !document.querySelector('#app .cover')));
    check('Tienda al día: se ven el video y las 5 fotos', await p.evaluate(() => document.querySelectorAll('.clug .clz').length === 6 && !!document.querySelector('.clug .clt.v')));
    await p.click('[data-clopen="1"]'); await p.waitForTimeout(300);
    check('Tocar una foto la abre en grande', await p.evaluate(() => !!document.getElementById('lb')));
    await p.evaluate(() => { lbClose(); cur = 's2'; render() }); await p.waitForTimeout(300);
    check('Con el pago vencido se ven solo 3 fotos y sin video', await p.evaluate(() => document.querySelectorAll('.clug .clz').length === 3 && !document.querySelector('.clug .clt.v')));
    sinErrores(p, 'Conoce el lugar'); await p.cerrar();
    const q = await abrir({ seed: { 'stores/s3': { id: 's3', ...base, ownerKey: 'kA' } } }); await conCuenta(q);
    await q.evaluate(() => { closeModal(1); if (!S.mine.includes('s3')) S.mine.push('s3'); view = 'store'; cur = 's3'; render() }); await q.waitForTimeout(300);
    check('El dueño gratis ve «Agregar fotos 0 de 3» y el candado de más fotos y video', await q.evaluate(() => /0 de 3/.test(document.querySelector('.clug').textContent) && !!document.querySelector('.clug .cla.lock') && !document.querySelector('[data-clvid]')));
    sinErrores(q, 'Conoce el lugar (dueño)'); await q.cerrar();
  },
  async rolesPorRecuperar() { // v406 el administrador devuelve los roles a una ficha que quedó sin ellos
    const fin = Date.now() + 300 * 864e5, cod = (c, o) => Object.assign({ c, use: 'merc', months: 12, days: 365, used: true, usedBy: 'kA', usedAt: Date.now() - 65 * 864e5, end: fin, ts: 1 }, o);
    const seed = { 'plans/kA': { k: 'kA', name: 'Ana Pérez', email: 'ana@x.co', plan: 'free' }, 'plans/kB': { k: 'kB', name: 'Beto', email: 'beto@x.co', plan: 'free', acc: { news: fin } },
      'codes/AAAABBBBCCCC': cod('AAAABBBBCCCC'), 'codes/DDDDEEEEFFFF': cod('DDDDEEEEFFFF', { use: 'news', months: 0 }), 'codes/GGGGHHHHJJJJ': cod('GGGGHHHHJJJJ', { use: 'news', months: 0, usedBy: 'kB' }),
      'codes/KKKKLLLLMMMM': cod('KKKKLLLLMMMM', { use: 'serv', end: Date.now() - 864e5 }), 'codes/NNNNPPPPQQQQ': cod('NNNNPPPPQQQQ', { use: 'car', used: false, usedBy: '' }),
      'codes/RRRRSSSSTTTT': cod('RRRRSSSSTTTT', { use: 'comu', months: 12, why: 'gratis', end: Date.now() + 5000 * 864e5 }) }; // fecha inflada a mano
    const p = await abrir({ admin: true, seed });
    await p.evaluate(() => { closeModal(1); at = 'usr'; view = 'admin'; render() }); await p.waitForTimeout(500);
    const caja = () => p.evaluate(() => { const h = [...document.querySelectorAll('.aadp')].find(x => /Roles por recuperar/.test(x.textContent)); return h ? h.textContent : '' });
    const t = await caja();
    check('El administrador ve la cuenta con roles por recuperar', /Ana Pérez/.test(t) && /Redactor|Noticias/i.test(t), t.slice(0, 200));
    check('No aparecen la cuenta que ya tiene su rol ni los códigos vencidos o sin usar', !/Beto/.test(t) && (t.match(/hasta el/g) || []).length === 3, t.slice(0, 300));
    await p.click('[data-rolesfix]'); await p.waitForTimeout(900);
    const acc = await p.evaluate(() => (QH.plans().find(x => x.k === 'kA') || {}).acc || {});
    check('Al tocar «Recuperar» la ficha queda con los roles y sus fechas', acc.merc === fin && acc.mercF === fin && acc.news === fin && !acc.serv && !acc.car, JSON.stringify(acc));
    check('Una fecha inflada en el código no sube el rol más allá de sus días', acc.comu > Date.now() + 299 * 864e5 && acc.comu < Date.now() + 301 * 864e5, String((acc.comu - Date.now()) / 864e5));
    check('Después ya no hay roles por recuperar', (await caja()) === '');
    sinErrores(p, 'Roles por recuperar'); await p.cerrar();
  },
  async datosRaros() { // v413 una publicación con campos de tipo equivocado (escrita por fuera de la página) no tumba la página
    const raro = { desc: { a: 1 }, cat: 123, wa: ['x'], zone: { z: 1 }, addr: 5, products: 'x', hours: 'x', rates: 'zz', gal: 'x', vid: 9, pay: 'x', imgs: 'x', img: {}, price: 'caro', f: 'x', title: ['t'], text: ['a', 'b'], owner: { o: 1 }, link: { l: 1 }, type: 7, sub: 3, op: {}, cond: [], tags: 'x', cover: 4, logo: [], ts: 'ayer', exp: Date.now() + 864e5 };
    const seed = { 'stores/s1': Object.assign({ id: 's1', name: 'Tienda rara', ownerKey: 'kZ', _o: 1 }, raro), 'stores/s2': { id: 's2', name: 'Panadería buena', cat: 'Otros', wa: '3112223344', ownerKey: 'kA', addr: 'Calle 5', products: [], _o: 2 },
      'products/s2__p1': Object.assign({ id: 'p1', name: 'Producto raro', sid: 's2', ownerKey: 'kZ' }, raro), 'products/s2__p2': { id: 'p2', sid: 's2' }, 'stores/s3': { id: 's3', _o: 3 }, 'services/v2': { id: 'v2' }, 'ads/a2': { id: 'a2' }, 'community/c3': { id: 'c3', exp: Date.now() + 864e5 }, 'services/v1': Object.assign({ id: 'v1', name: 'Servicio raro', ownerKey: 'kZ' }, raro),
      'ads/a1': Object.assign({ id: 'a1', name: 'Anuncio raro', ownerKey: 'kZ' }, raro), 'community/c1': Object.assign({ id: 'c1', ownerKey: 'kZ', pl: 'free' }, raro),
      'community/c2': { id: 'c2', ownerKey: 'kA', pl: 'free', title: 'Vendo bicicleta', text: 'Casi nueva', img: '', cat: 'var', ts: Date.now(), exp: Date.now() + 864e5 } };
    const p = await abrir({ seed }); p.raros = true;
    const ir = async (v, c, c2) => { await p.evaluate(([v, c, c2]) => { closeModal(1); view = v; if (v === 'ad') curAd = c; else { cur = c || null; curP = c2 || null } render() }, [v, c, c2]); await p.waitForTimeout(400) };
    check('El inicio se dibuja', await p.evaluate(() => !!document.querySelector('.hub .hubhero h2')));
    for (const [v, c, c2] of [['cats'], ['store', 's1'], ['store', 's2'], ['store', 's3'], ['prod', 's2', 'p1'], ['prod', 's2', 'p2'], ['serv'], ['ad', 'a1'], ['ad', 'a2'], ['map'], ['com'], ['home']]) { let e = ''; try { await ir(v, c, c2) } catch (x) { e = String(x.message).split('\n')[0] } if (e) check('Pantalla ' + v + ' ' + (c || '') + ' ' + (c2 || ''), false, e) }
    check('Las publicaciones dañadas quedan anotadas', await p.evaluate(() => (window.docFixLog || []).length >= 8 && !window.docFixLog.some(x => /s2$|c2$/.test(x))), await p.evaluate(() => (window.docFixLog || []).join(',')));
    await ir('com'); check('Clasificados sigue mostrando el anuncio bueno', await p.evaluate(() => /Vendo bicicleta/.test(document.getElementById('app').textContent)));
    await ir('cats'); check('Las categorías se dibujan', await p.evaluate(() => /Categorías/.test(document.getElementById('app').textContent)));
    await ir('store', 's2'); check('La tienda buena se abre con sus productos', await p.evaluate(() => /Panadería buena/.test(document.getElementById('app').textContent)));
    await p.evaluate(() => { const i = document.querySelector('#q,input[type=search]'); if (i) { i.value = 'raro'; i.dispatchEvent(new Event('input', { bubbles: true })) } }); await p.waitForTimeout(600);
    sinErrores(p, 'Datos raros'); await p.cerrar();
  },
  async salirMisDatos() { // v415 «Mis datos» y «Mis direcciones» también preguntan al salir con cambios
    const p = await abrir(); await conCuenta(p);
    await p.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<i class="qtour" hidden></i>')); // igual que en «borradores»
    const hay = sel => p.evaluate(s => !!document.querySelector(s), sel);
    await p.evaluate(() => { closeModal(1); pfForm() }); await p.waitForTimeout(400);
    await p.evaluate(() => document.querySelector('#ov [data-act=close]').click()); await p.waitForTimeout(300);
    check('«Mis datos» sin cambios se cierra sin preguntar', !(await hay('#sgq')) && !(await hay('#ov')));
    await p.evaluate(() => { closeModal(1); pfForm() }); await p.waitForTimeout(400);
    await p.fill('#pf-n', 'Ana María Pérez'); await p.evaluate(() => document.querySelector('#ov [data-act=close]').click()); await p.waitForTimeout(300);
    check('«Mis datos» con cambios pregunta si guardar', await hay('#sgq'));
    await p.click('#sgq [data-sgq="si"]'); await p.waitForTimeout(600);
    check('«Guardar cambios» guarda el nombre nuevo', await p.evaluate(() => S.user.name === 'Ana María Pérez'), await p.evaluate(() => S.user.name + ' / ' + (($('#err') || {}).textContent || '')));
    await p.evaluate(() => { closeModal(1); adrForm('new') }); await p.waitForTimeout(500);
    check('Se abre el formulario de dirección', await hay('#ov [data-adsave]'));
    await p.fill('#ad-dir', 'Calle 5 # 3-20'); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
    check('La dirección con cambios pregunta si guardar', await hay('#sgq'));
    await p.click('#sgq [data-sgq="no"]'); await p.waitForTimeout(300);
    check('«No guardar» cierra el formulario de dirección', !(await hay('#sgq')) && !(await hay('#ov [data-adsave]')));
    sinErrores(p, 'Salir de Mis datos'); await p.cerrar();
  },
  async sinRegistro() { // v416 pedir y preguntar por WhatsApp sin crear cuenta
    const p = await abrir();
    await p.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<i class="qtour" hidden></i>'));
    const txt = sel => p.evaluate(s => (document.querySelector(s) || {}).textContent || '', sel);
    await p.evaluate(() => { QH.push = () => {}; window.open = u => { window.__wa = decodeURIComponent(u) };
      S.stores.push({ id: 'sw', name: 'Tienda WA', wa: '3001234567', pays: ['cash'], products: [{ id: 'p2', name: 'Arroz', price: 4000, imgs: [] }] });
      S.stores.push({ id: 'sa', name: 'Tienda App', wa: '3007654321', pays: ['cash'], om: 'app', ownerUid: 'uT', pexp: Date.now() + 30 * 864e5, products: [{ id: 'p3', name: 'Pan', price: 500, imgs: [] }] });
      S.services.push({ id: 'v1', name: 'Luis Plomero', job: 'Plomería', wa: '3009998877' });
      S.cart = { 'sw|p2||': 2, 'sa|p3||': 1 }; save(); openCart() }); await p.waitForTimeout(400);
    check('Sin cuenta, la tienda que recibe por la aplicación ofrece «Pedir por WhatsApp»', /Pedir por WhatsApp/.test(await txt('[data-act="order"][data-id="sa"]')));
    await p.evaluate(() => document.querySelector('[data-act="order"][data-id="sw"]').click()); await p.waitForTimeout(500);
    check('Se abre «Tus datos para el pedido» con nombre, WhatsApp, barrio, dirección y mensaje', await p.evaluate(() => ['iv-n', 'iv-w', 'iv-zone', 'iv-d', 'iv-r', 'iv-m'].every(i => document.getElementById(i)) && !!document.querySelector('#ov .znsel')));
    await p.click('[data-ivgo="ped"]'); await p.waitForTimeout(200);
    check('Sin nombre no se envía y lo dice', /nombre/i.test(await txt('#iv-err')) && !(await p.evaluate(() => window.__wa)));
    await p.fill('#iv-n', 'Ana Pérez'); await p.fill('#iv-w', '300 111 22'); await p.click('[data-ivgo="ped"]'); await p.waitForTimeout(200);
    check('Con el WhatsApp incompleto no se envía', /WhatsApp/.test(await txt('#iv-err')) && !(await p.evaluate(() => window.__wa)));
    await p.fill('#iv-w', '300 111 2233'); await p.selectOption('#ov .znsel', { index: 1 }); await p.fill('#iv-d', 'Calle 5 # 3-20'); await p.fill('#iv-r', 'Casa azul'); await p.fill('#iv-m', 'Sin cebolla');
    const barrio = await p.evaluate(() => document.getElementById('iv-zone').value);
    await p.click('[data-ivgo="ped"]'); await p.waitForTimeout(1200);
    const wa = await p.evaluate(() => window.__wa || '');
    check('El WhatsApp va a la tienda con el pedido y el total', /wa\.me\/573001234567/.test(wa) && /2 x Arroz/.test(wa) && /Total:/.test(wa), wa.slice(0, 160));
    check('Lleva cliente, teléfono, dirección, barrio, indicaciones y el mensaje', /Cliente: Ana Pérez/.test(wa) && /Teléfono: 3001112233/.test(wa) && wa.includes('Dirección de entrega: Calle 5 # 3-20, ' + barrio) && /Indicaciones: Casa azul/.test(wa) && /Nota: Sin cebolla/.test(wa) && barrio.length > 1, wa.slice(-260));
    check('No se creó ninguna cuenta y el carrito de esa tienda quedó vacío', await p.evaluate(() => !S.user && !Object.keys(S.cart).some(k => k.indexOf('sw|') === 0) && !localStorage.getItem('qh_pend_order')));
    check('Después de enviar se invita (sin obligar) a crear la cuenta', /Crear mi cuenta gratis/.test(await txt('#ov')) && /Ahora no/.test(await txt('#ov')));
    await p.evaluate(() => { closeModal(1); window.__wa = ''; document.querySelector('[data-act="order"][data-id="sa"]').click() }); await p.waitForTimeout(500);
    check('La próxima vez el formulario sale lleno', await p.evaluate(() => document.getElementById('iv-n').value === 'Ana Pérez' && document.getElementById('iv-w').value === '3001112233' && document.getElementById('iv-d').value === 'Calle 5 # 3-20'));
    await p.click('[data-ivgo="ped"]'); await p.waitForTimeout(1200);
    check('El pedido de la tienda «por la aplicación» también sale por WhatsApp, sin invitar otra vez', /wa\.me\/573007654321/.test(await p.evaluate(() => window.__wa || '')) && !(await p.evaluate(() => !!document.getElementById('ov'))));
    // información
    const preguntar = async () => { await p.evaluate(() => { window.__wa = ''; closeModal(1); document.querySelectorAll('#t-ct').forEach(x => x.remove()); document.body.insertAdjacentHTML('beforeend', '<button id="t-ct" class="btn" data-act="contact" data-id="v1">Contactar</button>'); document.getElementById('t-ct').click() }); await p.waitForTimeout(400) };
    await preguntar();
    let w2 = await p.evaluate(() => window.__wa || '');
    check('Preguntar con los datos ya guardados abre WhatsApp directo y agrega nombre y WhatsApp', /wa\.me\/573009998877/.test(w2) && /quisiera más información/.test(w2) && /Mi nombre: Ana Pérez/.test(w2) && /Mi WhatsApp: 3001112233/.test(w2) && !(await p.evaluate(() => !!document.getElementById('ov'))), w2.slice(0, 200));
    await p.evaluate(() => localStorage.removeItem('qh_invitado')); await preguntar();
    check('La primera vez, preguntar pide nombre y WhatsApp y muestra el mensaje', await p.evaluate(() => /Tus datos/.test(document.querySelector('#ov h2').textContent) && /Plomería/.test(document.getElementById('iv-m').value) && !document.getElementById('iv-d') && !window.__wa));
    await p.fill('#iv-n', 'Beto Ruiz'); await p.fill('#iv-w', '3105556677'); await p.fill('#iv-m', 'Hola, ¿trabaja los domingos?'); await p.click('[data-ivgo="info"]'); await p.waitForTimeout(400);
    w2 = await p.evaluate(() => window.__wa || '');
    check('Envía el mensaje cambiado con el nombre y el WhatsApp', /trabaja los domingos/.test(w2) && /Mi nombre: Beto Ruiz/.test(w2) && /Mi WhatsApp: 3105556677/.test(w2), w2.slice(0, 200));
    await p.evaluate(() => { S.cart = { 'sw|p2||': 1 }; save(); openCart() }); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('[data-act="order"][data-id="sw"]').click()); await p.waitForTimeout(400);
    await p.click('[data-ivdel]'); await p.waitForTimeout(200);
    check('«Borrar mis datos» vacía el formulario y el teléfono', await p.evaluate(() => !localStorage.getItem('qh_invitado') && document.getElementById('iv-n').value === '' && document.getElementById('iv-w').value === ''));
    await conCuenta(p); await preguntar();
    w2 = await p.evaluate(() => window.__wa || '');
    check('Con cuenta, preguntar sigue igual que antes (WhatsApp directo, sin datos agregados)', /quisiera más información/.test(w2) && !/Mi nombre/.test(w2));
    sinErrores(p, 'Sin registro'); await p.cerrar();
  },
  async sinDireccion() { // v424 la cuenta ya no pide dirección ni mapa: los datos personales son nombre, correo y teléfono
    const p = await abrir(); let mapas = 0; p.on('request', r => { if (/maps\.google|google\.com\/maps/.test(r.url())) mapas++ });
    const txt = sel => p.evaluate(s => (document.querySelector(s) || {}).textContent || '', sel);
    await conCuenta(p); await p.waitForTimeout(4000); // antes, a los 2,5 s se abría sola «Tu dirección principal»
    check('Con cuenta y sin dirección, ya no se abre sola la ventana de la dirección', await p.evaluate(() => !document.getElementById('ov')), await txt('#ov h2'));
    check('Mi cuenta ya no ofrece «Mis direcciones» y el carrito no pregunta a dónde enviar', await p.evaluate(() => adrMenu(() => 'X') === '' && adrFoot('sw') === ''));
    await p.evaluate(() => pfForm()); await p.waitForTimeout(400);
    const campos = await p.evaluate(() => [...document.querySelectorAll('#ov label[for]')].map(l => l.htmlFor).filter(i => /^pf-[nwe]$/.test(i)).join());
    check('«Mis datos» pide nombre, teléfono y correo, sin dirección ni mapa', campos === 'pf-n,pf-w,pf-e' && await p.evaluate(() => !document.querySelector('#ov iframe, #ov #ad-map, #ov .adq, #ov #ad-dir')), campos);
    await p.evaluate(() => { closeModal(1); QH.push = () => {}; window.open = u => { window.__wa = decodeURIComponent(u) };
      S.stores.push({ id: 'sw', name: 'Tienda WA', wa: '3001234567', pays: ['cash'], products: [{ id: 'p2', name: 'Arroz', price: 4000, imgs: [] }] });
      S.cart = { 'sw|p2||': 2 }; save(); openCart() }); await p.waitForTimeout(400);
    check('El carrito no muestra «¿A dónde lo enviamos?»', await p.evaluate(() => !/A dónde lo enviamos/.test(document.getElementById('drawer').innerText)));
    await p.evaluate(() => document.querySelector('[data-act="order"][data-id="sw"]').click()); await p.waitForTimeout(500);
    check('Al pedir con cuenta se abre «Tus datos para el pedido», no la dirección con mapa', /Tus datos para el pedido/.test(await txt('#ov h2')) && await p.evaluate(() => !document.querySelector('#ov iframe, #ov #ad-map, #ov .adq')), await txt('#ov h2'));
    check('El nombre y el teléfono de la cuenta ya vienen puestos', await p.evaluate(() => document.getElementById('iv-n').value === 'Ana Pérez' && document.getElementById('iv-w').value === '3155555233'));
    check('No le habla de crear cuenta ni de entrar: ya tiene cuenta', await p.evaluate(() => !/No necesitas crear una cuenta|Ya tienes cuenta/.test(document.getElementById('ov').innerText)));
    await p.click('[data-ivgo="ped"]'); await p.waitForTimeout(200);
    check('Sin barrio ni dirección no se envía y lo dice', /barrio/i.test(await txt('#iv-err')) && !(await p.evaluate(() => window.__wa)));
    await p.selectOption('#ov .znsel', { index: 1 }); await p.fill('#iv-d', 'Calle 5 # 3-20'); await p.fill('#iv-r', 'Casa azul');
    await p.click('[data-ivgo="ped"]'); await p.waitForTimeout(1200);
    const wa = await p.evaluate(() => window.__wa || '');
    check('El WhatsApp sale con el pedido, el cliente, el teléfono y la dirección escrita', /wa\.me\/573001234567/.test(wa) && /2 x Arroz/.test(wa) && /Cliente: Ana Pérez/.test(wa) && /Teléfono: 3155555233/.test(wa) && /Dirección de entrega: Calle 5 # 3-20, /.test(wa) && /Indicaciones: Casa azul/.test(wa), wa.slice(-260));
    check('El cliente y el teléfono salen una sola vez y no va ningún enlace de mapa', wa.split('Cliente:').length === 2 && wa.split('Teléfono:').length === 2 && !/Ubicación en el mapa|google\.com\/maps/.test(wa), wa.slice(-260));
    check('El carrito de esa tienda quedó vacío y no se invita a crear cuenta', await p.evaluate(() => !Object.keys(S.cart).some(k => k.indexOf('sw|') === 0) && !document.getElementById('ov')));
    await p.evaluate(() => { S.cart = { 'sw|p2||': 1 }; save(); openCart() }); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('[data-act="order"][data-id="sw"]').click()); await p.waitForTimeout(400);
    check('La próxima vez la dirección ya viene escrita (guardada en el teléfono)', await p.evaluate(() => document.getElementById('iv-d').value === 'Calle 5 # 3-20' && document.getElementById('iv-r').value === 'Casa azul'));
    check('En todo el recorrido no se cargó Google Maps', mapas === 0, String(mapas));
    sinErrores(p, 'Sin dirección'); await p.cerrar();
  },
  async porPasos() { // v417 «Crea tu tienda» y «Tus datos» por pasos, con Continuar, Omitir y Atrás
    const p = await abrir(); await conCuenta(p);
    await p.evaluate(() => { closeModal(1); shopForm() }); await p.waitForTimeout(700);
    const ve = sel => p.evaluate(s => { const e = document.querySelector(s); return !!e && !!e.offsetParent }, sel);
    const paso = () => p.evaluate(() => (document.querySelector('.wzk') || {}).textContent + ' · ' + (document.querySelector('.wzt') || {}).textContent);
    const bot = () => p.evaluate(() => [...document.querySelectorAll('.wzr button')].map(b => b.textContent).join(','));
    await p.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<div class="qtour" id="t-tour"></div>')); await p.waitForTimeout(300);
    check('Mientras corre «Hazlo conmigo» el formulario se muestra completo', await ve('#f-name') && await ve('#x-hrs') && await ve('[data-act="saveShop"]') && !(await p.evaluate(() => !!document.querySelector('.wzh'))));
    await p.evaluate(() => document.getElementById('t-tour').remove()); await p.waitForTimeout(300);
    check('La tienda empieza en «Paso 1 de 6 · Tu negocio»', (await paso()) === 'Paso 1 de 6 · Tu negocio', await paso());
    check('Solo se ven los campos de ese paso', await ve('#f-name') && !(await ve('#f-cats')) && !(await ve('#f-wa')) && !(await ve('#x-hrs')) && !(await ve('[data-act="saveShop"]')));
    check('En el primer paso hay «Cancelar» y «Continuar», sin «Omitir»', (await bot()) === 'Cancelar,Continuar', await bot());
    check('La ventana ya no mide varias pantallas', await p.evaluate(() => document.querySelector('#ov .modal').scrollHeight < 1300), String(await p.evaluate(() => document.querySelector('#ov .modal').scrollHeight)));
    await p.click('[data-wz="sigue"]'); await p.waitForTimeout(200);
    check('Sin nombre no deja continuar y dice qué falta', /nombre/i.test(await p.evaluate(() => document.querySelector('.wze').textContent)) && /Paso 1/.test(await paso()));
    await p.fill('#f-name', 'Dulces de la Abuela'); await p.fill('#f-desc', 'Postres caseros'); await p.click('[data-wz="sigue"]'); await p.waitForTimeout(250);
    check('Con los datos, «Continuar» pasa a «Categoría»', (await paso()) === 'Paso 2 de 6 · Categoría' && await ve('#f-cats') && !(await ve('#f-name')), await paso());
    await p.click('[data-wz="sigue"]'); await p.waitForTimeout(200);
    check('Sin categoría no deja continuar', /categor/i.test(await p.evaluate(() => document.querySelector('.wze').textContent)));
    await p.evaluate(() => { const d = document.querySelector('#f-cats details'); d.open = true; d.querySelector('.cgr button, .cgr .chip').click() }); await p.waitForTimeout(250);
    await p.click('[data-wz="sigue"]'); await p.waitForTimeout(250);
    check('Elegida la categoría, pasa a «Contacto»', /Paso 3 de 6 · Contacto/.test(await paso()), await paso());
    await p.click('[data-wz="atras"]'); await p.waitForTimeout(200);
    check('«Atrás» vuelve al paso anterior sin perder lo escrito', /Paso 2/.test(await paso()) && await p.evaluate(() => document.getElementById('f-name').value === 'Dulces de la Abuela'));
    await p.click('[data-wz="sigue"]'); await p.waitForTimeout(200); await p.evaluate(() => { const b = document.querySelector('.bizo button'); if (b) b.click() }); await p.fill('#f-wa', '3001234567'); await p.click('[data-wz="sigue"]'); await p.waitForTimeout(250);
    check('«Ubicación» es opcional: tiene «Omitir»', /Paso 4 de 6 · Ubicación/.test(await paso()) && (await bot()) === 'Atrás,Omitir,Continuar' && await ve('#x-addr') && !(await ve('#x-hrs')), (await paso()) + ' ' + (await bot()));
    await p.click('[data-wz="omitir"]'); await p.waitForTimeout(200);
    check('«Omitir» pasa a «Horario»', /Paso 5 de 6 · Horario/.test(await paso()) && await ve('#x-hrs') && !(await ve('#x-addr')));
    await p.click('[data-wz="omitir"]'); await p.waitForTimeout(200);
    const fila = () => p.evaluate(() => { const r = document.querySelector('#ov .modal > .row.wz-fin'); if (!r) return 'sin fila'; const B = [...r.querySelectorAll('.btn')].filter(x => x.offsetParent).map(x => ({ t: x.textContent, r: x.getBoundingClientRect() })).sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left); return B.map(x => x.t).join(',') + '|' + (B.length > 1 && B[0].r.bottom <= B[1].r.top && B[0].r.width >= B[1].r.width && B[0].r.width > r.getBoundingClientRect().width - 2 ? 'arriba' : 'no') });
    check('En el último paso ya no hay «Continuar» y «Abrir tienda» va arriba a todo el ancho, con «Atrás» y «Cancelar» debajo (v420)', /Paso 6 de 6/.test(await paso()) && (await bot()) === '' && (await fila()) === 'Abrir tienda,Atrás,Cancelar|arriba', (await paso()) + ' [' + (await bot()) + '] ' + (await fila()));
    await p.click('#ov .modal > .row [data-wz="atras"]'); await p.waitForTimeout(200);
    check('Ese «Atrás» vuelve al paso anterior y desaparece de la fila de guardar', /Paso 5 de 6/.test(await paso()) && !(await p.evaluate(() => !!document.querySelector('#ov .modal > .row [data-wz]'))));
    await p.evaluate(() => qhPasos.ir(5)); await p.waitForTimeout(200);
    await p.evaluate(() => { document.getElementById('f-wa').value = '' }); await p.click('[data-act="saveShop"]'); await p.waitForTimeout(400);
    check('Si al guardar falta un dato, vuelve solo al paso donde está', /Paso 3 de 6 · Contacto/.test(await paso()) && /tel[eé]fono|WhatsApp/i.test(await p.evaluate(() => document.getElementById('err').textContent)), await paso());
    await p.fill('#f-wa', '3001234567'); await p.evaluate(() => qhPasos.ir(5)); await p.click('[data-act="saveShop"]'); await p.waitForTimeout(900);
    check('Al terminar, la tienda se crea con lo escrito en los pasos', await p.evaluate(() => S.stores.some(s => s.name === 'Dulces de la Abuela' && s.desc === 'Postres caseros' && s.wa === '3001234567' && !!s.cat)), await p.evaluate(() => (document.getElementById('err') || {}).textContent || ''));
    // datos personales
    await p.evaluate(() => { closeModal(1); adrForm('main', null, true) }); await p.waitForTimeout(600);
    check('«Tus datos» va por pasos: primero la dirección, sin «Cancelar» cuando es obligatoria', /Paso 1 de 2 · Tu dirección/.test(await paso()) && (await bot()) === 'Continuar' && await ve('#ad-dir') && !(await ve('.adq')) && !(await ve('[data-adsave]')), (await paso()) + ' ' + (await bot()));
    await p.click('[data-wz="sigue"]'); await p.waitForTimeout(200);
    check('Sin barrio no deja continuar', /barrio/i.test(await p.evaluate(() => document.querySelector('.wze').textContent)));
    await p.evaluate(() => { const s = document.querySelector('#ov .znsel'); s.value = 'Centro'; s.dispatchEvent(new Event('change', { bubbles: true })) }); await p.fill('#ad-dir', 'Calle 5 # 3-20'); await p.click('[data-wz="sigue"]'); await p.waitForTimeout(250);
    check('El último paso es el mapa, con «Guardar mis datos»', /Paso 2 de 2 · Tu casa en el mapa/.test(await paso()) && await ve('.adq') && await ve('[data-adsave]') && !(await ve('#ad-dir')) && (await fila()) === 'Guardar mis datos,Atrás|arriba', await fila());
    // editar tienda: pestañas
    await p.evaluate(() => { closeModal(1); const s = S.stores.find(x => x.name === 'Dulces de la Abuela'); view = 'store'; cur = s.id; render(); editShop() }); await p.waitForTimeout(700);
    check('«Editar tienda» muestra las secciones como pestañas y «Guardar» siempre a la vista', await p.evaluate(() => [...document.querySelectorAll('.wztab [role=tab]')].map(b => b.textContent).join(',') === 'Tu negocio,Contacto,Ubicación,Horario,Entregas y pagos') && await ve('[data-act="saveEditShop"]') && await ve('#e-name') && !(await ve('#x-hrs')));
    await p.click('.wztab [data-wzir="3"]'); await p.waitForTimeout(200);
    check('Tocar «Horario» muestra solo el horario', await ve('#x-hrs') && !(await ve('#e-name')) && await ve('[data-act="saveEditShop"]') && await p.evaluate(() => document.querySelector('.wztab [aria-selected="true"]').textContent === 'Horario'));
    sinErrores(p, 'Por pasos'); await p.cerrar();
  },
  async listaProductos() { // v422 «Lista de productos» en vez de «Eliminar tienda»: editar o eliminar productos desde una lista
    const tienda = { id: 's1', name: 'Tienda s1', ownerKey: 'kOtro', cat: 'Otros', wa: '3001234567', pexp: Date.now() + 30 * 864e5, _o: 1, products: [] }, pr = (id, x) => Object.assign({ id, sid: 's1', imgs: [], ownerKey: 'kOtro' }, x);
    const p = await abrir({ seed: { 'stores/s1': tienda, 'products/s1__p1': pr('p1', { name: 'Arroz', price: 4000, c1: 'Granos', _o: 1 }), 'products/s1__p2': pr('p2', { name: 'Panela', price: 3500, out: 1, _o: 2 }), 'products/s1__p3': pr('p3', { name: 'Café', price: 12000, _o: 3 }) } });
    const ver = async () => { await p.evaluate(() => { closeModal(1); view = 'store'; cur = 's1'; render() }); await p.waitForTimeout(300) };
    await ver();
    check('El cliente no ve «Lista de productos» ni «Eliminar tienda»', await p.evaluate(() => !document.querySelector('[data-lpv]') && !document.querySelector('[data-act="delShop"]')));
    await conCuenta(p); await p.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<i class="qtour" hidden></i>')); // así no se abre sola «Tu dirección principal» (v322)
    await p.evaluate(() => { S.mine.push('s1') }); await ver();
    check('El dueño ve «Lista de productos» entre los botones y ya no el botón «Eliminar tienda»', await p.evaluate(() => { const g = document.querySelector('#app .acts-grid'); return !!g.querySelector('[data-lpv="open"]') && !g.querySelector('[data-act="delShop"]') && /Lista de productos/i.test(g.innerText) }));
    check('«Eliminar tienda» queda como enlace pequeño debajo de los botones', await p.evaluate(() => { const x = document.querySelector('#app .lpvx[data-act="delShop"]'); return !!x && !x.closest('.acts-grid') && x.getBoundingClientRect().height >= 44 }));
    await p.click('[data-lpv="open"]'); await p.waitForTimeout(300);
    const filas = () => p.evaluate(() => [...document.querySelectorAll('#ov .lpvr')].map(r => r.querySelector('.lpvt').innerText.replace(/\s+/g, ' ')).join(' | '));
    const f = await filas();
    check('La lista muestra los tres productos con precio, categoría y «Agotado»', /Arroz .*4\.000 Granos \| Panela .*3\.500 · Agotado \| Café .*12\.000/.test(f), f);
    check('Cada producto tiene «Editar» y «Eliminar»', await p.evaluate(() => [...document.querySelectorAll('#ov .lpvr')].every(r => r.querySelector('[data-act="editProd"]') && r.querySelector('[data-lpv="del"]'))));
    check('La lista cabe en el celular, sin desbordarse a los lados', await p.evaluate(() => { const m = document.querySelector('#ov .modal'); return m.scrollWidth <= m.clientWidth + 1 }));
    await p.click('#ov .lpvr:nth-child(3) [data-act="editProd"]'); await p.waitForTimeout(400);
    check('«Editar» abre el formulario del producto', await p.evaluate(() => { const i = document.querySelector('#ov input[id$="-name"]'); return !!i && i.value === 'Café' }));
    await p.evaluate(() => { closeModal(1); qhListaProductos() }); await p.waitForTimeout(300);
    await p.click('#ov .lpvr:nth-child(2) [data-lpv="del"]'); await p.waitForTimeout(300);
    check('«Eliminar» pregunta antes de borrar', await p.evaluate(() => /¿Eliminar «Panela»/.test((document.getElementById('cfm-t') || {}).textContent || '')));
    await p.click('#cfm-no'); await p.waitForTimeout(200);
    check('Si cancela, no se borra nada', await p.evaluate(() => S.stores.find(x => x.id === 's1').products.length === 3 && document.querySelectorAll('#ov .lpvr').length === 3));
    await p.click('#ov .lpvr:nth-child(2) [data-lpv="del"]'); await p.waitForTimeout(300); await p.click('#cfm-ok'); await p.waitForTimeout(400);
    const f2 = await filas();
    check('Al confirmar se borra el producto y la lista sigue abierta sin él', await p.evaluate(() => S.stores.find(x => x.id === 's1').products.map(x => x.id).join() === 'p1,p3') && /^Arroz[^|]*\| Café[^|]*$/.test(f2) && await p.evaluate(() => /Tienes 2 productos/.test(document.querySelector('#ov').innerText)), f2);
    await p.evaluate(() => closeModal(1)); await p.click('#app .lpvx'); await p.waitForTimeout(300);
    check('El enlace «Eliminar tienda» sigue preguntando antes de eliminar', await p.evaluate(() => /¿Eliminar tu tienda/.test((document.getElementById('cfm-t') || {}).textContent || '')));
    await p.click('#cfm-no'); await p.waitForTimeout(200);
    check('Si cancela, la tienda sigue', await p.evaluate(() => !!S.stores.find(x => x.id === 's1')));
    // v423: los botones que borraban sin preguntar ahora preguntan
    const preg = () => p.evaluate(() => (document.getElementById('cfm-t') || {}).textContent || '');
    await p.click('#app .prod .x[data-act="delProd"]'); await p.waitForTimeout(300);
    check('v423: la ✕ de un producto pregunta antes de borrar', /¿Eliminar «Arroz» de tu tienda/.test(await preg()), await preg());
    await p.click('#cfm-no'); await p.waitForTimeout(200);
    check('v423: si cancela, el producto sigue', await p.evaluate(() => S.stores.find(x => x.id === 's1').products.length === 2));
    await p.click('#app .prod .x[data-act="delProd"]'); await p.waitForTimeout(300); await p.click('#cfm-ok'); await p.waitForTimeout(400);
    check('v423: si acepta, el producto se borra', await p.evaluate(() => S.stores.find(x => x.id === 's1').products.map(x => x.id).join() === 'p3' && !document.getElementById('cfm-t')));
    await p.evaluate(() => { S.services.push({ id: 'vv1', name: 'Luis Plomero', job: 'Plomería', wa: '3009998877' }); S.myServ.push('vv1'); S.ideas.push({ id: 'ii1', txt: 'Más bancas en el parque', ts: 1 }); S.myIdeas.push('ii1');
      document.body.insertAdjacentHTML('beforeend', '<button id="t-serv" data-act="delServ" data-id="vv1">Quitar</button><button id="t-sug" data-act="delSug" data-id="ii1">Quitar la mía</button>') });
    await p.evaluate(() => document.getElementById('t-serv').click()); await p.waitForTimeout(300);
    check('v423: «Quitar» un servicio pregunta, con el nombre', /¿Quitar el servicio de «Luis Plomero»/.test(await preg()), await preg());
    await p.click('#cfm-no'); await p.waitForTimeout(200);
    check('v423: si cancela, el servicio sigue', await p.evaluate(() => S.services.some(x => x.id === 'vv1')));
    await p.evaluate(() => document.getElementById('t-serv').click()); await p.waitForTimeout(300); await p.click('#cfm-ok'); await p.waitForTimeout(300);
    check('v423: si acepta, el servicio se quita', await p.evaluate(() => !S.services.some(x => x.id === 'vv1')));
    await p.evaluate(() => document.getElementById('t-sug').click()); await p.waitForTimeout(300);
    check('v423: quitar una sugerencia pregunta', /¿Eliminar esta sugerencia/.test(await preg()), await preg());
    await p.click('#cfm-no'); await p.waitForTimeout(200);
    check('v423: si cancela, la sugerencia sigue', await p.evaluate(() => S.ideas.some(x => x.id === 'ii1')));
    await p.evaluate(() => document.getElementById('t-sug').click()); await p.waitForTimeout(300); await p.click('#cfm-ok'); await p.waitForTimeout(300);
    check('v423: si acepta, la sugerencia se quita', await p.evaluate(() => !S.ideas.some(x => x.id === 'ii1')));
    // la caja de opiniones (v225) se vuelve a dibujar sola: el botón se pone justo antes de cada toque
    const caja = () => { let c = document.getElementById('t-cm'); if (!c) { document.body.insertAdjacentHTML('beforeend', '<div class="cmfb" id="t-cm" data-ad="zz"></div>'); c = document.getElementById('t-cm') } c.innerHTML = '<button data-fbd="otro">Borrar comentario</button>'; return c.firstChild };
    await p.evaluate(c => { window.__fb = 0; addEventListener('click', e => { if (e.target.closest('[data-fbd]')) window.__fb++ }, true); eval('(' + c + ')')().click() }, caja.toString()); await p.waitForTimeout(300);
    check('v423: «Borrar comentario» pregunta y no borra todavía', /¿Borrar este comentario/.test(await preg()) && await p.evaluate(() => window.__fb === 0), await preg());
    await p.evaluate(c => { eval('(' + c + ')')(); document.getElementById('cfm-ok').click() }, caja.toString()); await p.waitForTimeout(300);
    check('v423: al aceptar, el toque llega al botón de borrar aunque la caja se haya vuelto a dibujar', await p.evaluate(() => window.__fb === 1 && !document.getElementById('cfm-t')), String(await p.evaluate(() => window.__fb)));
    sinErrores(p, 'Lista de productos'); await p.cerrar();
  },
  async soloWhatsapp() { // v418 sin pagos entre usuarios ni pedidos por la aplicación; los roles siguen igual
    const U = { uid: 'uA', isAnonymous: false, email: 'ana@x.co', emailVerified: true };
    const tienda = { id: 'sa', name: 'Tienda App', wa: '3007654321', pays: ['cash', 'bre'], om: 'app', ownerUid: 'uT', ownerKey: 'kT', pexp: Date.now() + 30 * 864e5, cat: 'Otros', products: [], _o: 1 };
    const base = { 'stores/sa': tienda, 'products/sa__p3': { id: 'p3', sid: 'sa', name: 'Pan', price: 500, imgs: [], ownerKey: 'kT' }, 'services/v1': { id: 'v1', name: 'Luis Plomero', job: 'Plomería', wa: '3009998877', ownerUid: 'uT', ownerKey: 'kT' },
      'breb/uT': { key: 'llave-tienda', name: 'Tienda', ts: 1 }, ['breb/' + ADMIN_UID]: { key: 'llave-mipradera', name: 'Mi Pradera', ts: 1 } };
    const p = await abrir({ user: U, seed: base }); await conCuenta(p);
    await p.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<i class="qtour" hidden></i>'));
    await p.evaluate(() => { S.cart = { 'sa|p3||': 1 }; save(); openCart() }); await p.waitForTimeout(500);
    check('La tienda que tenía «por la aplicación» ahora ofrece «Pedir por WhatsApp»', await p.evaluate(() => { const b = document.querySelector('[data-act="order"][data-id="sa"]'); return !!b && /Pedir por WhatsApp/.test(b.textContent) && b.dataset.om === 'wa' }));
    await p.evaluate(() => { document.getElementById('drawer').classList.remove('open'); closeModal(1); view = 'serv'; render() }); await p.waitForTimeout(900);
    check('Junto al WhatsApp de una publicación ya no sale «Pagar con Bre-B»', await p.evaluate(() => !!document.querySelector('[data-act="contact"]') && !document.querySelector('.qbb')));
    const menu = await p.evaluate(() => { const d = document.createElement('div'); d.innerHTML = pnlMenu(); return d.textContent });
    check('En Mi cuenta no están «Pagos Bre-B y Nequi», «Mis pedidos» ni «Pedidos de mi tienda»', menu.length > 50 && !/Pagos Bre-B y Nequi/.test(menu) && !/Mis pedidos/.test(menu) && !/Pedidos de mi tienda/.test(menu), menu.slice(0, 200));
    check('«Mis códigos» y «Mis roles» siguen en Mi cuenta', /Mis códigos/.test(menu) && /Mis roles/.test(menu));
    await p.evaluate(() => { closeModal(1); brebPay({ to: 'uT', toName: 'Tienda', amt: 5000, what: 'Pan', kind: 'item', item: 'store:sa' }) }); await p.waitForTimeout(300);
    check('Ya no se puede abrir un pago a otro usuario', await p.evaluate(() => !document.getElementById('ov')));
    await p.evaluate(a => brebPay({ to: a, toName: 'Mi Pradera', amt: 20000, what: 'Rol Comerciante', kind: 'rol', use: 'merc', m: 12 }), ADMIN_UID); await p.waitForTimeout(500);
    check('El pago de un rol a Mi Pradera se sigue abriendo', await p.evaluate(() => !!document.getElementById('ov') && /Rol Comerciante|Mi Pradera/.test(document.getElementById('ov').textContent)), await p.evaluate(() => JSON.stringify({ u: QH.authCur() && QH.authCur().uid, on: brebOn(), role: brebRoleOn(), t: (document.querySelector('.toast,#toast') || {}).textContent }) + ((document.getElementById('ov') || {}).textContent || 'sin ventana').slice(0, 120)));
    await p.evaluate(() => { closeModal(1); shopForm() }); await p.waitForTimeout(700);
    check('El formulario de la tienda ya no pregunta cómo recibir los pedidos', await p.evaluate(() => !!document.getElementById('x-pays') && !document.getElementById('x-om') && !/Por la aplicación/.test(document.querySelector('#ov').textContent)));
    check('«Tarjeta débito» está entre los medios de pago, después de la de crédito (v419)', await p.evaluate(() => [...document.querySelectorAll('#x-pays input')].map(i => i.value).join(',') === 'cash,bre,nequi,card,debit,siste' && paysTxt({ pays: ['card', 'debit'] }) === 'Tarjeta de crédito · Tarjeta débito'), await p.evaluate(() => [...document.querySelectorAll('#x-pays input')].map(i => i.value).join(',') + ' / ' + paysTxt({ pays: ['card', 'debit'] })));
    await p.evaluate(() => qhPasos.ver('#x-pays')); await p.waitForTimeout(200);
    check('Los medios de pago van en una sola columna, todos del mismo ancho', await p.evaluate(() => { const r = [...document.querySelectorAll('#x-pays .dchip.pay')].map(e => e.getBoundingClientRect()); return r.length === 6 && r.every((x, i) => Math.abs(x.left - r[0].left) < 1 && Math.abs(x.width - r[0].width) < 1 && (!i || x.top >= r[i - 1].bottom)) }));
    check('Cada medio de pago tiene su casilla: vacía sin elegir y azul con chulo al elegirlo (v419)', await p.evaluate(() => { const i = document.querySelector('#x-pays input'), sp = i.nextElementSibling, c = () => getComputedStyle(sp, '::before'); const a = c().width === '22px' && !/0, 113, 227/.test(c().backgroundColor); i.click(); return a && /0, 113, 227/.test(c().backgroundColor) && /svg/.test(c().backgroundImage) && i.checked }));
    sinErrores(p, 'Solo WhatsApp'); await p.cerrar();
    // quien ya tenía pagos o pedidos guardados los sigue viendo para cerrarlos
    const q = await abrir({ user: U, seed: Object.assign({}, base, { 'pagos/g1': { from: 'uA', fromName: 'Ana', to: 'uT', toName: 'Tienda', amt: 5000, ref: '1234', what: 'Pan', kind: 'item', via: 'breb', st: 'pend', ts: Date.now() },
      'pedidos/o1': { sid: 'sa', sname: 'Tienda App', to: 'uT', from: 'uA', fromName: 'Ana', items: [{ n: 'Pan', q: 1, p: 500 }], total: 500, pay: 'cash', st: 'nuevo', pst: 'pend', ts: Date.now() } }) }); await conCuenta(q);
    await q.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<i class="qtour" hidden></i>'));
    await q.waitForTimeout(800);
    const m2 = await q.evaluate(() => { const d = document.createElement('div'); d.innerHTML = pnlMenu(); return d.textContent });
    check('Con un pago y un pedido ya guardados, sí se ven «Pagos Bre-B y Nequi» y «Mis pedidos»', /Pagos Bre-B y Nequi/.test(m2) && /Mis pedidos/.test(m2), await q.evaluate(() => JSON.stringify({ u: QH.authCur() && QH.authCur().uid, items: brebItems(), pag: /Pagos Bre-B/.test(pnlMenu()), ped: /Mis pedidos/.test(pnlMenu()) })));
    await q.evaluate(() => { closeModal(1); brebMy('sent') }); await q.waitForTimeout(500);
    check('El historial de pagos ya no tiene la pestaña «Cobrar»', await q.evaluate(() => [...document.querySelectorAll('#qb-tabs [role=tab]')].map(b => b.textContent.replace(/\d+/g, '')).join(',') === 'Recibidos,Enviados'), await q.evaluate(() => (document.getElementById('qb-tabs') || {}).textContent || ''));
    sinErrores(q, 'Solo WhatsApp (historial)'); await q.cerrar();
  },
  async sesionYAvisos() { // v400 entrar solo con el botón, campana solo con sesión, «Escríbenos» visible
    const p = await abrir();
    check('Sin sesión no se ve la campana', await p.evaluate(() => { const b = document.getElementById('nfBtn'); return !b || b.offsetParent === null }));
    await p.evaluate(() => { window.__login = 0; const f = passLogin; passLogin = async () => { window.__login++ }; closeModal(1); loginForm() }); await p.waitForTimeout(300);
    await p.fill('#l-id', 'ana@x.co'); await p.fill('#l-pw', 'clave123'); await p.press('#l-pw', 'Enter'); await p.waitForTimeout(300);
    check('Enter en la clave no inicia sesión', await p.evaluate(() => window.__login === 0 && !!document.getElementById('l-pw')));
    await p.evaluate(() => closeModal(1)); await conCuenta(p); await p.waitForTimeout(2300);
    check('Con sesión se ve la campana', await p.evaluate(() => { const b = document.getElementById('nfBtn'); return !!b && b.offsetParent !== null }));
    await p.evaluate(() => document.querySelector('.qcl-ct').click()); await p.waitForTimeout(200);
    check('«Escríbenos» abre el formulario y conserva su ícono', await p.evaluate(() => { const b = document.querySelector('.qcl-ct'); return b.getAttribute('aria-expanded') === 'true' && !!b.querySelector('.qcl-i svg') }));
    sinErrores(p, 'Sesión y avisos'); await p.cerrar();
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
