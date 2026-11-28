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
async function abrir({ dark = false, admin = false, user = null, seed = {}, ruta = '', ancho = 390, alto = 844 } = {}) { // ancho/alto: tamaño de pantalla (v430) // ruta: por ejemplo '?panel#/clasificado' (v429)
  const ctx = await browser.newContext({ viewport: { width: ancho, height: alto }, colorScheme: dark ? 'dark' : 'light', serviceWorkers: 'block' });
  await ctx.route(/gstatic\.com\/firebasejs\//, r => r.fulfill({ body: /app-compat/.test(r.request().url()) ? FB : '', contentType: 'application/javascript' }));
  const pedidos = { recaptcha: 0 };
  await ctx.route(/google\.com\/recaptcha/, r => { pedidos.recaptcha++; r.fulfill({ contentType: 'application/javascript', body: 'window.grecaptcha={ready:f=>f(),execute:async()=>"TOKEN"}' }) });
  await ctx.route(/workers\.dev|googleapis|firebaseio|accounts\.google|cdnjs|ytimg|fonts\.|maps\./, r => r.fulfill({ status: 500, body: '' }));
  if (admin) await ctx.route(/\/index\.html/, async r => { const res = await r.fetch(); let t = await res.text(); t = t.replace("if(k&&sha256(k)===ADMIN_HASH)return'admin'", "if(k)return'admin'"); r.fulfill({ response: res, body: t }) });
  await ctx.addInitScript(([d, u, s]) => { localStorage.setItem('qh_cookies', '1'); if (d) localStorage.setItem('qh_theme', 'dark'); window.__authUser = u; window.__seed = s }, [dark, admin ? { uid: ADMIN_UID, isAnonymous: false, email: 'admin@x.co' } : user, seed]);
  const p = await ctx.newPage(); p.errores = []; p.danados = [];
  p.on('pageerror', e => p.errores.push(e.message));
  p.on('console', m => { if (/Content Security Policy|Refused to/.test(m.text())) p.errores.push(m.text().slice(0, 160)); if (/^v413:/.test(m.text())) p.danados.push(m.text().slice(0, 160)) }); // v413: ninguna publicación bien hecha debe ser corregida
  await p.goto(base + '/index.html' + (admin ? '?admin=x' : ruta)); await p.waitForTimeout(3000);
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
    await p.evaluate(() => { window.qhSinMapa = false }); // v462 apaga el mapa y la pregunta; aquí se prueban encendidos
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
    await p.evaluate(() => { window.qhSinMapa = false }); // v462 apaga el mapa y la pregunta; aquí se prueban encendidos
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
    await p.evaluate(() => { window.qhSinMapa = false }); // v462 apaga la pregunta; aquí se prueba encendida
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
  async registroParaPublicar() { // v425 sin cuenta no se puede publicar nada: primero «Registrarme»
    const p = await abrir();
    const ov = () => p.evaluate(() => { const o = document.getElementById('ov'); return o ? (o.querySelector('h2') || {}).textContent + ' | ' + ((o.querySelector('.rgpn') || {}).textContent || '') : '' });
    const pide = async (nombre, abre, campo) => { await p.evaluate(a => { closeModal(1); after = null; eval(a) }, abre); await p.waitForTimeout(400); const x = await ov();
      check('Sin cuenta, ' + nombre + ' pide registrarse y dice por qué', /Registrarme/.test(x) && /Para publicar necesitas una cuenta/.test(x) && await p.evaluate(c => !document.querySelector(c), campo), x) };
    await pide('publicar un clasificado', 'comForm()', '#cm-t');
    await pide('registrar una tienda', "gdOpen('shop')", '#f-name');
    await pide('publicar un vehículo', "gdOpen('veh')", '#a-wa');
    await pide('publicar un inmueble', "gdOpen('arr')", '[data-gdad]');
    check('El aviso sale una sola vez y la pestaña «Iniciar sesión» sigue ahí', await p.evaluate(() => document.querySelectorAll('#ov .rgpn').length === 1 && !!document.querySelector('#ov [data-act="loginForm"]')));
    await p.evaluate(() => { closeModal(1); after = null }); await conCuenta(p); // v434: la ventana de sugerencias ya no existe (se unió con «Escríbenos»)
    await p.evaluate(() => { closeModal(1); comForm() }); await p.waitForTimeout(400);
    check('Con cuenta, el clasificado abre su formulario directo, sin aviso', await p.evaluate(() => !!document.querySelector('#ov #cm-t') && !document.querySelector('#ov .rgpn')), await ov());
    await p.evaluate(() => { closeModal(1); gdOpen('shop') }); await p.waitForTimeout(700);
    check('Con cuenta, la tienda abre su formulario directo', await p.evaluate(() => !!document.querySelector('#ov #f-name') && !document.querySelector('#ov .rgpn')), await ov());
    await p.evaluate(() => { closeModal(1); S.user = null; save(); try { syncUI() } catch (e) {} comForm() }); await p.waitForTimeout(400);
    await conCuenta(p); await p.evaluate(() => { closeModal(1); const f = after; after = null; f() }); await p.waitForTimeout(500);
    check('Después de registrarse se abre solo el formulario del clasificado', await p.evaluate(() => !!document.querySelector('#ov #cm-t')), await ov());
    sinErrores(p, 'Registro para publicar'); await p.cerrar();
  },
  async rolesYPrecios() { // v426 página pública «Roles y precios» (#/roles), sin necesidad de cuenta
    const p = await abrir();
    check('El pie de la página tiene el enlace «Planes y precios» (v432)', await p.evaluate(() => /Planes y precios/.test((document.querySelector('footer [data-rolv]') || {}).textContent || '')));
    await p.evaluate(() => document.querySelector('footer [data-rolv]').click()); await p.waitForTimeout(400);
    const txt = () => p.evaluate(() => document.getElementById('app').innerText);
    let t = await txt();
    check('Sin cuenta se abre la página, con su dirección #/roles', /Planes y precios/.test(t) && await p.evaluate(() => location.hash === '#/roles' && !document.getElementById('ov')), await p.evaluate(() => location.hash));
    const roles = await p.evaluate(() => [...document.querySelectorAll('.rlpc')].map(c => c.dataset.rol).join());
    check('Muestra lo gratis y los seis roles', roles === 'free,merc,home,car,com,comu,news', roles);
    const visto = () => p.evaluate(() => [...document.querySelectorAll('.rlpc')].filter(c => c.offsetParent).map(c => c.dataset.rol).join() + ' | ' + (document.querySelector('.rlpk[aria-selected="true"]') || {}).textContent);
    check('Se ve un rol a la vez y empieza por «Gratis»; la página ya no mide varias pantallas', (await visto()) === 'free | Gratis' && await p.evaluate(() => document.querySelector('.rlp').scrollHeight < 1500), await visto());
    check('La barra tiene los siete roles y dos flechas; la de la izquierda empieza apagada', await p.evaluate(() => document.querySelectorAll('.rlps .rlpk').length === 7 && document.querySelectorAll('.rlpb .rlpf').length === 2 && document.querySelector('.rlpb .rlpf').disabled && !document.querySelectorAll('.rlpb .rlpf')[1].disabled));
    check('En el primer rol «Anterior» está apagado y «Siguiente» dice a dónde va', await p.evaluate(() => { const b = document.querySelectorAll('.rlpc[data-rol="free"] .rlpv button'); return b[0].disabled && /Comerciante/.test(b[1].textContent) && /1 de 7/.test(document.querySelector('.rlpc[data-rol="free"] .rlpx').textContent) }));
    await p.click('.rlpc[data-rol="free"] .rlpv button:last-child'); await p.waitForTimeout(500);
    check('«Siguiente» pasa a Comerciante y lo marca en la barra', (await visto()) === 'merc | Comerciante', await visto());
    await p.click('.rlpb .rlpf:last-child'); await p.waitForTimeout(700);
    check('La flecha de la derecha corre la barra de roles', await p.evaluate(() => document.querySelector('.rlps').scrollLeft > 20 && !document.querySelector('.rlpb .rlpf').disabled));
    await p.evaluate(() => [...document.querySelectorAll('.rlps .rlpk')].find(b => /Noticias/.test(b.textContent)).click()); await p.waitForTimeout(400);
    check('Tocar un rol de la barra lo abre; en el último «Siguiente» está apagado', (await visto()) === 'news | Noticias' && await p.evaluate(() => document.querySelector('.rlpc[data-rol="news"] .rlpv button:last-child').disabled), await visto());
    await p.click('.rlpc[data-rol="news"] .rlpv button:first-child'); await p.waitForTimeout(400);
    check('«Anterior» vuelve al rol de antes', (await visto()) === 'comu | Comunidad', await visto());
    await p.evaluate(() => qhRolIr('merc')); await p.waitForTimeout(200);
    check('Comerciante trae los precios de «Un negocio» y «Varios negocios» por duración', await p.evaluate(() => { const r = [...document.querySelectorAll('.rlpc[data-rol="merc"] tbody tr')]; return r.length === 5 && /1 mes/.test(r[0].innerText) && /1 año/.test(r[4].innerText) && r.every(x => [...x.querySelectorAll('td')].length === 2 && [...x.querySelectorAll('td')].every(d => /\$\s?[\d.]+/.test(d.innerText))) }));
    check('El precio es el mismo de la ventana «Roles»', await p.evaluate(() => document.querySelector('.rlpc[data-rol="merc"] tbody tr td:last-child').innerText.replace(/\s+/g, ' ') === money(codePriceNow('merc', 1)).replace(/\s+/g, ' ')));
    check('Clasificados muestra el plan gratis y los pagados; Comunidad y Redactor dicen «Gratis»', await p.evaluate(() => document.querySelectorAll('.rlpc[data-rol="com"] tbody tr').length === 5 && /Gratis/.test(document.querySelector('.rlpc[data-rol="comu"] .rlpg').textContent) && /Gratis/.test(document.querySelector('.rlpc[data-rol="news"] .rlpg').textContent)));
    check('Sin cuenta ofrece «Crear mi cuenta gratis» y «Ya tengo cuenta», y nada para comprar', await p.evaluate(() => !!document.querySelector('.rlpa [data-act="regForm"]') && !!document.querySelector('.rlpa [data-act="loginForm"]') && !document.querySelector('.rlp [data-act="codeBuy"], .rlp [data-act="cmxGo"]')));
    check('La página cabe en el celular, sin desbordarse a los lados', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), String(await p.evaluate(() => document.documentElement.scrollWidth)));
    await p.evaluate(() => { S.site = Object.assign({}, S.site, { accPrices: { merc_1: 33000 } }); render(true) }); await p.waitForTimeout(300);
    check('Si el administrador cambia un precio, la página lo muestra', /33\.000/.test(await p.evaluate(() => document.querySelector('.rlpc[data-rol="merc"] tbody tr td:last-child').innerText)));
    await p.evaluate(() => document.querySelector('.rlp [data-act="hubHome"]').click()); await p.waitForTimeout(300);
    check('«← Inicio» vuelve a la página principal', await p.evaluate(() => view === 'home' && !document.querySelector('.rlp')));
    await p.evaluate(() => { closeModal(1); comForm() }); await p.waitForTimeout(400);
    await p.click('#ov [data-rolv]'); await p.waitForTimeout(400);
    check('El aviso de «Para publicar necesitas una cuenta» lleva a la página de roles', await p.evaluate(() => view === 'roles' && !document.getElementById('ov') && !!document.querySelector('.rlp')));
    await conCuenta(p); await p.evaluate(() => render(true)); await p.waitForTimeout(300);
    check('Con cuenta, la página ofrece «Activar un rol»', await p.evaluate(() => !!document.querySelector('.rlpa [data-act="codesModal"]') && !document.querySelector('.rlpa [data-act="regForm"]')));
    sinErrores(p, 'Roles y precios'); await p.cerrar();
    // v432: «Planes» en el menú principal, también sin cuenta
    const m = await abrir();
    await m.click('#hmb'); await m.waitForTimeout(300);
    const menu = await m.evaluate(() => [...document.querySelectorAll('#ov [data-act="hmtab"]')].map(b => b.textContent.trim()));
    check('El menú principal dice «Planes» y ya no «Roles»', menu.includes('Planes') && !menu.includes('Roles'), menu.join(', '));
    await m.evaluate(() => [...document.querySelectorAll('#ov [data-act="hmtab"]')].find(b => b.textContent.trim() === 'Planes').click()); await m.waitForTimeout(400);
    check('Sin cuenta, «Planes» abre la página de planes y precios sin pedir registro', await m.evaluate(() => view === 'roles' && !!document.querySelector('.rlp') && !document.getElementById('ov') && /Planes y precios/.test(document.getElementById('app').innerText)));
    await m.evaluate(() => { moreOpen = true; view = 'home'; render() }); await m.waitForTimeout(200);
    const b2 = await m.evaluate(() => { const b = document.querySelector('[data-act="menuPlanes"]'); return b ? b.textContent.trim() : '(no se muestra)' });
    check('La barra de secciones tampoco dice «Roles»', b2 !== 'Roles', b2);
    if (b2 === 'Planes') { await m.evaluate(() => document.querySelector('[data-act="menuPlanes"]').click()); await m.waitForTimeout(400);
      check('«Planes» de la barra de secciones abre la misma página', await m.evaluate(() => view === 'roles' && !document.getElementById('ov'))) }
    sinErrores(m, 'Menú: Planes'); await m.cerrar();
  },
  async movimiento() { // v427 transiciones entre ventanas, pantallas y pasos
    const p = await abrir(); await conCuenta(p);
    await p.evaluate(() => { S.stores.push({ id: 'sm', name: 'Tienda M', wa: '3001234567', pays: ['cash'], products: [{ id: 'p2', name: 'Arroz', price: 4000, imgs: [] }] }); modal('<h2 id="t-h">Uno</h2><button data-act="close" id="t-b" data-x="1">Cerrar</button>') });
    check('Al abrir una ventana, el fondo se funde', await p.evaluate(() => /mv-fade/.test(getComputedStyle(document.getElementById('ov')).animationName) && !document.getElementById('ov').classList.contains('mv-swap')));
    await p.evaluate(() => modal('<h2>Dos</h2><p>Otra ventana</p>')); await p.waitForTimeout(60);
    check('De una ventana a otra, el fondo se queda y solo cambia el contenido', await p.evaluate(() => { const o = document.getElementById('ov'); return o.classList.contains('mv-swap') && getComputedStyle(o).animationName === 'none' && /mv-swap/.test(getComputedStyle(o.querySelector('.modal')).animationName) && !document.querySelector('.mvg') }));
    await p.evaluate(() => closeModal(1)); await p.waitForTimeout(40);
    check('Al cerrar, queda un instante una copia que se desvanece y no se puede tocar', await p.evaluate(() => { const g = document.querySelector('.mvg'); return !document.getElementById('ov') && !!g && g.hasAttribute('inert') && g.getAttribute('aria-hidden') === 'true' && /Dos/.test(g.textContent) && getComputedStyle(g).pointerEvents === 'none' && !g.classList.contains('overlay') }));
    await p.evaluate(() => { closeModal(1); modal('<h2 id="t-h">Uno</h2><button data-act="close" id="t-b" data-x="1">Cerrar</button>'); closeModal(1) }); await p.waitForTimeout(40);
    check('La copia no lleva id ni data-*, para que nada de la página la confunda con una ventana', await p.evaluate(() => !!document.querySelector('.mvg') && !document.querySelector('.mvg [id], .mvg [data-act], .mvg [data-x], [id="t-h"]')));
    await p.waitForTimeout(350);
    check('La copia se quita sola', await p.evaluate(() => !document.querySelector('.mvg')));
    const app = () => p.evaluate(() => document.getElementById('app').className);
    await p.evaluate(() => { view = 'store'; cur = 'sm'; render() }); await p.waitForTimeout(60);
    check('Al entrar a una tienda, la pantalla entra suave', /mv-go/.test(await app()), await app());
    await p.waitForTimeout(400); await p.evaluate(() => render(true)); await p.waitForTimeout(60);
    check('Volver a dibujar la misma pantalla no la anima otra vez', !/mv-/.test(await app()), await app());
    await p.evaluate(() => { view = 'home'; render() }); await p.waitForTimeout(60);
    check('Al volver al inicio, entra desde el otro lado', /mv-back/.test(await app()), await app());
    await p.waitForTimeout(400);
    check('La clase se quita al terminar', !/mv-/.test(await app()), await app());
    await p.evaluate(() => { closeModal(1); shopForm() }); await p.waitForTimeout(700);
    await p.fill('#f-name', 'Dulces'); await p.fill('#f-desc', 'Dulces caseros'); await p.click('[data-wz="sigue"]'); await p.waitForTimeout(80);
    const m = () => p.evaluate(() => document.querySelector('#ov .modal').className + ' | ' + (document.querySelector('.wzk') || {}).textContent);
    check('«Continuar» en un formulario por pasos trae el paso nuevo desde la derecha', /mv-next/.test(await m()) && /Paso 2/.test(await m()), await m());
    await p.waitForTimeout(350); await p.evaluate(() => [...document.querySelectorAll('.wzr button')].find(b => /Atrás/.test(b.textContent)).click()); await p.waitForTimeout(80);
    check('«Atrás» lo trae desde la izquierda', /mv-prev/.test(await m()) && /Paso 1/.test(await m()), await m());
    await p.emulateMedia({ reducedMotion: 'reduce' }); await p.evaluate(() => { closeModal(1); modal('<h2>Tres</h2>'); modal('<h2>Cuatro</h2>') }); await p.waitForTimeout(60);
    const sw = await p.evaluate(() => document.getElementById('ov').classList.contains('mv-swap'));
    await p.evaluate(() => { closeModal(1); view = 'store'; cur = 'sm'; render() }); await p.waitForTimeout(60);
    check('Con «reducir movimiento» no hay copia ni animaciones', !sw && await p.evaluate(() => !document.querySelector('.mvg')) && !/mv-/.test(await app()), await app());
    sinErrores(p, 'Movimiento'); await p.cerrar();
  },
  async ajustesVisuales() { // v428 inicio sin hueco bajo las pestañas, nombre del negocio completo, marco en producto sin foto, carrusel
    const st = (id, n, o) => ({ id, name: n, desc: 'x', ownerKey: 'k' + id, cat: 'Otros', wa: '3001234567', pexp: Date.now() + 30 * 864e5, _o: o, pays: ['cash'], products: [] });
    const p = await abrir({ seed: { 'stores/s1': st('s1', 'Ferretería La Tuerca de Oro', 1), 'stores/s2': st('s2', 'Panadería El Trigal', 2), 'stores/s3': st('s3', 'Dulces de la Abuela', 3), 'products/s1__p1': { id: 'p1', sid: 's1', name: 'Martillo', price: 28000, imgs: [], ownerKey: 'ks1', _o: 1 } } });
    await p.evaluate(() => { window.qhInicioCompleto = true; render() }); /* v455: vuelven las pestañas para medirlas */ await p.waitForTimeout(500);
    const m = () => p.evaluate(() => { const w = document.querySelector('#app .hswp'), c = [...w.children].map(x => x.offsetHeight), i = Math.round(w.scrollLeft / (w.children[0].offsetWidth + 14)); return { h: w.offsetHeight, c, i, max: Math.max(...c) } });
    let x = await m();
    check('Las pestañas del inicio miden lo que mide la pestaña abierta, no la más larga', x.i === 0 && Math.abs(x.h - x.c[0]) <= 2 && x.max > x.c[0] + 100, JSON.stringify(x));
    check('Ya no queda un hueco grande antes del pie de la página', await p.evaluate(() => { const w = document.querySelector('#app .hsw'), f = document.querySelector('footer'); return f.getBoundingClientRect().top - w.getBoundingClientRect().bottom < 200 }));
    await p.evaluate(() => { const w = document.querySelector('#app .hswp'); w.scrollLeft = (w.children[0].offsetWidth + 14) * (w.children.length - 1) }); await p.waitForTimeout(500);
    x = await m();
    check('Al pasar a otra pestaña, la caja toma la altura de esa pestaña', x.i === x.c.length - 1 && Math.abs(x.h - x.c[x.i]) <= 2, JSON.stringify(x));
    check('El nombre del negocio sale completo, en dos líneas, sin «…»', await p.evaluate(() => { const s = [...document.querySelectorAll('.hnegc .hnegt>strong')].find(e => /Tuerca de Oro/.test(e.textContent)); return !!s && s.scrollWidth <= s.clientWidth + 1 && s.offsetHeight > 30 && s.scrollHeight <= s.clientHeight + 1 }));
    check('En el carrusel, el botón queda al fondo de cada tarjeta', await p.evaluate(() => [...document.querySelectorAll('.bzc')].every(c => { const t = c.querySelector('.bzt'), b = t.lastElementChild; return !!b.querySelector('button, a') || b.matches('button, a') ? t.getBoundingClientRect().bottom - b.getBoundingClientRect().bottom < 6 : true }) && document.querySelectorAll('.bzc').length >= 2));
    await p.evaluate(() => { view = 'store'; cur = 's1'; render() }); await p.waitForTimeout(500);
    check('Un producto sin foto tiene marco e ícono', await p.evaluate(() => { const c = document.querySelector('.prod .pic'), n = c.querySelector('.nop'); return parseFloat(getComputedStyle(c).borderTopWidth) >= 1 && getComputedStyle(n, '::before').width === '44px' && /Sin foto/.test(n.textContent) }));
    sinErrores(p, 'Ajustes visuales'); await p.cerrar();
  },
  async auditoria() { // v429 errores encontrados en la revisión del 15 de noviembre de 2026
    // 1. «Categorías» en una tienda que nunca tuvo categorías (toda tienda recién creada)
    let p = await abrir({ seed: { 'stores/s1': { id: 's1', name: 'Tienda nueva', ownerKey: 'kOtro', cat: 'Otros', wa: '3001234567', pexp: Date.now() + 30 * 864e5, _o: 1, products: [] } } });
    await conCuenta(p); await p.evaluate(() => { S.mine.push('s1'); closeModal(1); view = 'store'; cur = 's1'; render() }); await p.waitForTimeout(300);
    await p.click('[data-act="mcats"]'); await p.waitForTimeout(400);
    check('«Categorías» abre en una tienda sin categorías guardadas', await p.evaluate(() => /Categorías del menú/.test((document.querySelector('#ov h2') || {}).textContent || '') && /Aún no tienes categorías/.test(document.getElementById('ov').innerText)), p.errores.join(' | '));
    await p.fill('#mc-new', 'Dulces'); await p.evaluate(() => document.querySelector('[data-act="mcAdd"]').click()); await p.waitForTimeout(400);
    check('Se puede crear la primera categoría', await p.evaluate(() => { const s = S.stores.find(x => x.id === 's1'); return Array.isArray(s.mc) && s.mc.length === 1 && s.mc[0].n === 'Dulces' }));
    sinErrores(p, 'Categorías'); await p.cerrar();
    // 2. llegar al panel por el enlace del botón «Publicar» sin cuenta: debe pedir la cuenta (v425), no abrir el formulario
    for (const ruta of ['?panel#/clasificado', '?panel#/negocio', '?panel&reg=1#/negocio', '?panel#/publicar-inmueble']) {
      p = await abrir({ ruta }); const x = await p.evaluate(() => { const o = document.getElementById('ov'); return o ? (o.querySelector('h2') || {}).textContent + (o.querySelector('.rgpn') ? ' +aviso' : '') + (o.querySelector('#cm-t,#f-name,#a-wa') ? ' +FORMULARIO' : '') : '(sin ventana)' });
      check('Sin cuenta, ' + ruta + ' pide registrarse', x === 'Registrarme +aviso', x);
      if (ruta === '?panel#/clasificado') { await conCuenta(p); await p.evaluate(() => { closeModal(1); const f = after; after = null; f && f() }); await p.waitForTimeout(500);
        check('Al entrar, se abre el formulario del clasificado', await p.evaluate(() => !!document.querySelector('#ov #cm-t'))) }
      sinErrores(p, 'Panel ' + ruta); await p.cerrar();
    }
  },
  async disenoEscritorio() { // v430 diseño de tienda en línea en computador y sin desbordes en ningún tamaño
    const now = Date.now();
    const seed = { 'stores/s1': { id: 's1', name: 'Dulces de la Abuela', desc: 'Dulces', cat: 'Otros', wa: '3001234567', ownerKey: 'kO', pexp: now + 30 * 864e5, pays: ['cash'], products: [], _o: 1 },
      'products/s1__p1': { id: 'p1', sid: 's1', name: 'Arequipe casero', price: 9000, imgs: [], ownerKey: 'kO', _o: 1 }, 'products/s1__p2': { id: 'p2', sid: 's1', name: 'Torta de la casa', price: 28000, old: 32000, imgs: [], ownerKey: 'kO', _o: 2 } };
    let p = await abrir({ seed, ancho: 1280, alto: 800 });
    const caja = s => p.evaluate(x => { const e = document.querySelector(x); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } }, s);
    const lg = await caja('#home'), qw = await caja('header .qw'), us = await caja('#userBtn'), ct = await caja('#cartBtn');
    check('Computador: logo, buscador, cuenta y carrito en una sola fila del encabezado', !!lg && !!qw && Math.abs(lg.y + lg.h / 2 - (qw.y + qw.h / 2)) < 12 && qw.x > lg.x && us.x > qw.x && ct.x > us.x && qw.w > 400, JSON.stringify({ lg, qw, us, ct }));
    check('Computador: en el inicio el buscador sigue arriba, no baja al centro', await p.evaluate(() => document.querySelector('.qw').parentNode.tagName === 'HEADER' && !document.body.classList.contains('qinhub')));
    check('Computador: los enlaces van en el encabezado, sin «Buscar» y con «Publicar» al final', await p.evaluate(() => { const b = document.getElementById('bnav'); const v = [...b.querySelectorAll('button')].filter(x => x.offsetParent).map(x => x.dataset.v); return b.parentNode.tagName === 'HEADER' && v.join() === 'home,com,me,pub' || v.join() === 'home,pub,com,me' && getComputedStyle(b.querySelector('.bnp')).order === '9' }));
    await p.fill('header #q', 'torta'); await p.press('header #q', 'Enter'); await p.waitForTimeout(500);
    check('Computador: buscar desde el encabezado funciona', await p.evaluate(() => /Torta de la casa/.test(document.getElementById('app').innerText)));
    await p.evaluate(() => { view = 'prod'; cur = 's1'; curP = 'p2'; render(); scrollTo(0, 0) }); await p.waitForTimeout(400);
    const gal = await caja('.pvg'), buy = await caja('.pvbuy');
    check('Computador: la ficha de producto va en dos columnas, fotos a la izquierda y caja de compra a la derecha', !!gal && !!buy && buy.x > gal.x + gal.w && buy.w >= 300 && Math.abs(buy.y - gal.y) < 80, JSON.stringify({ gal, buy }));
    check('Computador: la caja de compra tiene título, precio y «Comprar ahora»', await p.evaluate(() => { const b = document.querySelector('.pvbuy'); return !!b.querySelector('.pvt') && /28\.000/.test(b.querySelector('.pvp').innerText) && /Comprar ahora/i.test(b.innerText) }));
    await p.evaluate(() => { view = 'store'; cur = 's1'; render() }); await p.waitForTimeout(300);
    check('Computador: dentro de una tienda no aparecen los enlaces del encabezado', await p.evaluate(() => !document.getElementById('bnav').offsetParent));
    await p.setViewportSize({ width: 390, height: 844 }); await p.evaluate(() => { view = 'home'; render() }); await p.waitForTimeout(500);
    check('Al pasar a celular, la barra vuelve abajo y el buscador sigue arriba (v431)', await p.evaluate(() => document.getElementById('bnav').parentNode.tagName !== 'HEADER' && document.querySelector('.qw').parentNode.tagName === 'HEADER'));
    sinErrores(p, 'Diseño computador'); await p.cerrar();
    // tableta: categorías del inicio en 6 columnas
    p = await abrir({ seed, ancho: 768, alto: 1024 });
    check('Tableta: las categorías del inicio van en 6 columnas', await p.evaluate(() => getComputedStyle(document.querySelector('.hubg.hubg2')).gridTemplateColumns.split(' ').length === 6));
    await p.cerrar();
    // v431 celular: encabezado compacto y productos en filas, como las tiendas grandes
    for (const w of [320, 360, 390]) {
      p = await abrir({ seed, ancho: w, alto: 780 });
      const c = await p.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(); const lg = r('#home'), ct = r('#cartBtn'), q = r('header .qw'), u = document.getElementById('ut');
        return { fila: Math.abs((lg.top + lg.bottom) / 2 - (ct.top + ct.bottom) / 2) < 10, debajo: q.top > lg.bottom - 2, enHeader: document.querySelector('.qw').parentNode.tagName === 'HEADER', corta: u.offsetParent ? (u.scrollWidth > u.clientWidth + 1 || u.scrollHeight > u.clientHeight + 1) : false, alto: document.querySelector('header').offsetHeight } });
      check(`Celular ${w}px: logo y carrito en una fila, buscador debajo y «Iniciar sesión» sin cortarse`, c.fila && c.debajo && c.enHeader && !c.corta && c.alto < 150, JSON.stringify(c));
      await p.evaluate(() => { view = 'store'; cur = 's1'; render(); scrollTo(0, 0) }); await p.waitForTimeout(300);
      const f = await p.evaluate(() => { const pr = document.querySelector('.pgrid .prod'); const r = s => pr.querySelector(s).getBoundingClientRect(); const pic = r('.pic'), h = r('h3'), b = r('.plus');
        return { lado: h.left > pic.right - 1 && b.left > pic.right - 1, boton: getComputedStyle(pr.querySelector('.plus'), '::before').content, ancho: Math.round(b.width), cols: getComputedStyle(document.querySelector('.pgrid')).gridTemplateColumns.split(' ').length } });
      check(`Celular ${w}px: productos en filas con la foto a la izquierda y «Agregar al carrito»`, f.lado && /Agregar al carrito/.test(f.boton) && f.ancho > 100 && f.cols === 1, JSON.stringify(f));
      if (w === 360) { await p.click('.pgrid .prod .plus'); await p.waitForTimeout(300); check('Celular: «Agregar al carrito» agrega el producto', await p.evaluate(() => Object.values(S.cart).reduce((a, b) => a + b, 0) === 1)) }
      sinErrores(p, `Celular ${w}px`); await p.cerrar();
    }
    // la revisión de GitHub no tiene la letra Inter: con una letra más ancha «Iniciar sesión» tampoco debe cortarse
    for (const w of [360, 390]) {
      p = await abrir({ seed, ancho: w, alto: 780 });
      await p.addStyleTag({ content: ':root,html,body{--font-rubik:"DejaVu Sans",sans-serif!important}' }); await p.waitForTimeout(200);
      const u = await p.evaluate(() => { const e = document.getElementById('ut'); return { corta: e.offsetParent ? (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1) : false, letra: getComputedStyle(e).fontFamily } });
      check(`Celular ${w}px con una letra más ancha: «Iniciar sesión» no se corta`, !u.corta && /DejaVu/.test(u.letra), JSON.stringify(u));
      await p.cerrar();
    }
    // v433: el cuadro rojo de avisos va sobre la esquina de la campana (en la v431 se iba a la esquina del encabezado)
    for (const [w, h] of [[390, 844], [1280, 800]]) {
      p = await abrir({ seed, ancho: w, alto: h }); await conCuenta(p);
      await p.evaluate(() => { const b = document.getElementById('nfBtn'); b.style.display = ''; const e = b.querySelector('em'); e.hidden = false; e.textContent = '1' }); await p.waitForTimeout(200);
      const r = await p.evaluate(() => { const b = document.getElementById('nfBtn').getBoundingClientRect(), e = document.querySelector('#nfBtn em').getBoundingClientRect();
        return { campana: [Math.round(b.right), Math.round(b.top)], cuadro: [Math.round(e.right), Math.round(e.top)], visible: b.width > 0 } });
      check(`${w}px: el cuadro rojo de avisos queda sobre la esquina de la campana`, r.visible && Math.abs(r.cuadro[0] - r.campana[0]) <= 12 && Math.abs(r.cuadro[1] - r.campana[1]) <= 12, JSON.stringify(r));
      await p.cerrar();
    }
    // v431: el botón de emergencias es solo la sirena, más pequeño, y conserva su nombre
    p = await abrir({ seed });
    const sos = await p.evaluate(() => { const b = document.getElementById('emgfab'); if (!b) return null; const r = b.getBoundingClientRect(), s = b.querySelector('span');
      return { w: Math.round(r.width), h: Math.round(r.height), letras: s ? s.getBoundingClientRect().width > 2 : false, nombre: b.getAttribute('aria-label') || '' } });
    check('El botón de emergencias se ve sin las letras «SOS», de 44 px, y sigue diciendo para qué es', !!sos && sos.w <= 46 && sos.h <= 46 && !sos.letras && /Emergencias/.test(sos.nombre), JSON.stringify(sos));
    await p.cerrar();
    // celular: la ficha conserva su orden de siempre
    p = await abrir({ seed });
    await p.evaluate(() => { view = 'prod'; cur = 's1'; curP = 'p2'; render(); scrollTo(0, 0) }); await p.waitForTimeout(400);
    check('Celular: la ficha conserva el orden de siempre (título, foto, precio, comprar, tienda, preguntar)', await p.evaluate(() => { const y = s => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top : -1 }; const a = [y('.pvt'), y('.pvg'), y('.pvp'), y('.pvbuy .pvbtn'), y('.pvs'), y('.pvmain .pvbtn')]; return a.every(v => v >= 0) && a.every((v, i) => !i || v > a[i - 1]) }));
    sinErrores(p, 'Ficha celular'); await p.cerrar();
    // ningún tamaño se desborda a los lados, en claro y en oscuro
    const malos = [];
    for (const dark of [false, true]) for (const [w, h] of [[320, 640], [360, 780], [768, 1024], [1024, 768], [1280, 800], [1920, 1080]]) {
      p = await abrir({ seed, dark, ancho: w, alto: h });
      for (const v of ['home', 'store', 'prod', 'com']) { await p.evaluate(v => { closeModal(1); view = v; cur = 's1'; curP = 'p2'; render() }, v); await p.waitForTimeout(150);
        const sw = await p.evaluate(() => document.documentElement.scrollWidth); if (sw > w + 1) malos.push(`${dark ? 'oscuro' : 'claro'} ${w}px ${v}: ${sw}`) }
      await p.cerrar();
    }
    check('Ninguna pantalla se desborda a los lados, de 320 px a 1920 px, en claro y oscuro', !malos.length, malos.join(' | '));
  },
  async escribenosMenu() { // v434 «Sugerencias» se une con «Escríbenos», el formulario del pie de la página
    const p = await abrir();
    const abierto = () => p.evaluate(() => { const w = document.querySelector('.qctw'), n = document.getElementById('qct-n'); return !!w && !w.classList.contains('qcl-h') && !!n && n.offsetParent !== null && !document.getElementById('ov') });
    await p.click('#hmb'); await p.waitForTimeout(300);
    const menu = await p.evaluate(() => [...document.querySelectorAll('#ov [data-act="hmtab"]')].map(b => b.textContent.trim()));
    check('El menú principal tiene «Escríbenos» y ya no «Sugerencias»', menu.includes('Escríbenos') && !menu.includes('Sugerencias'), menu.join(', '));
    await p.evaluate(() => [...document.querySelectorAll('#ov [data-act="hmtab"]')].find(b => b.textContent.trim() === 'Escríbenos').click()); await p.waitForTimeout(700);
    check('«Escríbenos» del menú abre el formulario del pie, ya desplegado', await abierto());
    check('El formulario trae nombre, correo, teléfono, asunto (con «Sugerencia») y mensaje', await p.evaluate(() => ['qct-n', 'qct-c', 'qct-t', 'qct-a', 'qct-m'].every(i => document.getElementById(i)) && [...document.querySelectorAll('#qct-a option')].some(o => /Sugerencia/.test(o.textContent))));
    await p.evaluate(() => { const b = document.querySelector('.qcl-ct'); if (b && b.getAttribute('aria-expanded') === 'true') b.click(); location.hash = '#/sugerencias' }); await p.waitForTimeout(900);
    check('Un enlace viejo a #/sugerencias lleva al inicio y abre «Escríbenos»', await p.evaluate(() => view === 'home') && await abierto());
    await p.evaluate(() => { const b = document.querySelector('.qcl-ct'); if (b && b.getAttribute('aria-expanded') === 'true') b.click(); view = 'sug'; render() }); await p.waitForTimeout(600);
    check('Ningún botón puede abrir la ventana vieja de sugerencias', await p.evaluate(() => view === 'home' && !document.getElementById('g-txt')) && await abierto());
    await p.evaluate(() => { const b = document.querySelector('.qcl-ct'); if (b && b.getAttribute('aria-expanded') === 'true') b.click(); document.body.insertAdjacentHTML('beforeend', '<button id="t-mn" data-act="menu">m</button>'); document.getElementById('t-mn').click() }); await p.waitForTimeout(300);
    const m2 = await p.evaluate(() => [...document.querySelectorAll('#ov [data-v]')].map(b => b.dataset.v).join());
    check('El otro menú (Inicio, Tiendas…) también tiene «Escríbenos» en vez de «Sugerencias»', /escribenos/.test(m2) && !/\bsug\b/.test(m2), m2);
    // v435: el signo del botón cambia de «+» a «−» y de vuelta (antes se trababa en «+» al primer toque)
    await p.evaluate(() => closeModal(1));
    const signo = () => p.evaluate(() => { const b = document.querySelector('.qcl-ct'), s = b.querySelector('.qcl-s'), w = document.querySelector('.qctw');
      return (s ? s.textContent : '?') + ' ' + b.getAttribute('aria-expanded') + ' ' + (getComputedStyle(w).display !== 'none' ? 'abierto' : 'cerrado') + ' ' + (s ? getComputedStyle(s).color : '') });
    await p.evaluate(() => { const b = document.querySelector('.qcl-ct'); if (b.getAttribute('aria-expanded') === 'true') b.click() }); await p.waitForTimeout(200);
    const s0 = await signo();
    await p.click('.qcl-ct'); await p.waitForTimeout(250); const s1 = await signo();
    await p.click('.qcl-ct'); await p.waitForTimeout(250); const s2 = await signo();
    await p.evaluate(() => qhEscribenos()); await p.waitForTimeout(500); const s3 = await signo();
    check('El botón de «Escríbenos» cambia de «+» a «−» al abrir y de «−» a «+» al cerrar, también desde el menú',
      /^\+ false cerrado/.test(s0) && /^− true abierto/.test(s1) && /^\+ false cerrado/.test(s2) && /^− true abierto/.test(s3), [s0, s1, s2, s3].join(' | '));
    check('El signo conserva su color blanco después de tocarlo', /rgb\(255, 255, 255\)/.test(s1) && /rgb\(255, 255, 255\)/.test(s2), [s1, s2].join(' | '));
    sinErrores(p, 'Escríbenos en el menú'); await p.cerrar();
    // v435: los indicadores del carrusel de banners de arriba son rayas debajo de la imagen, como los demás carruseles
    const q = await abrir();
    const im = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300"><rect width="800" height="300" fill="#0071e3"/></svg>');
    await q.evaluate(im => { S.topAds = [{ img: im }, { img: im }, { img: im }]; render() }, im); await q.waitForTimeout(500);
    const ind = await q.evaluate(() => { const d = document.querySelector('.tbd'); if (!d) return null; const t = document.querySelector('.tbt').getBoundingClientRect(), r = d.getBoundingClientRect(), is = [...d.children].map(i => { const k = i.getBoundingClientRect(); return [Math.round(k.width), Math.round(k.height), getComputedStyle(i).borderRadius, getComputedStyle(i).backgroundColor] });
      return { debajo: r.top >= t.bottom - 1, fondo: getComputedStyle(d).backgroundColor, is } });
    check('Los indicadores del carrusel de banners son rayas (verde la que se ve, grises las demás) debajo de la imagen',
      !!ind && ind.debajo && /rgba\(0, 0, 0, 0\)|transparent/.test(ind.fondo) && ind.is.length === 3 && ind.is[0][0] === 40 && ind.is[0][1] === 6 && ind.is[0][2] === '0px' && /22, 163, 74/.test(ind.is[0][3]) && ind.is.slice(1).every(i => i[0] === 26 && i[1] === 6), JSON.stringify(ind));
    sinErrores(q, 'Rayas del carrusel'); await q.cerrar();
  },
  async terminosGoogle() { // v436 la primera vez que se entra con Google salen los Términos y condiciones con sus casillas
    const p = await abrir();
    // Google falso: la ventana de Google responde con una cuenta nueva o una que ya existía
    const google = (nuevo, dn) => p.evaluate(([nv, dn]) => { firebase.auth.GoogleAuthProvider = function () { this.addScope = () => {}; this.setCustomParameters = () => {} };
      smsApp = { auth: () => ({ languageCode: '', signOut: async () => {}, signInWithPopup: async () => ({ user: { email: 'nuevo@gmail.com', providerData: [], displayName: dn || 'Ana Nueva' }, additionalUserInfo: { isNewUser: nv }, credential: null }) }) } }, [nuevo, dn]);
    const entrar = async () => { await p.evaluate(() => { closeModal(1); S.user = null; save(); loginForm() }); await p.waitForTimeout(300);
      await p.evaluate(() => { const b = [...document.querySelectorAll('#ov button')].find(x => /Continuar con Google/.test(x.textContent)); b.click() }); await p.waitForTimeout(600) };
    const est = () => p.evaluate(() => { const ov = document.getElementById('ov'), ok = document.querySelector('[data-tyc="ok"]');
      return { titulo: ov ? (ov.querySelector('h2') || {}).textContent : '', casillas: document.querySelectorAll('.tyc input[type=checkbox]').length, aceptar: ok ? (ok.disabled ? 'apagado' : 'encendido') : 'no', dentro: !!S.user } });
    await google(true); await entrar();
    let e = await est();
    check('La primera vez con Google sale «Términos y condiciones» con dos casillas y «Aceptar» apagado, y todavía no entra', e.titulo === 'Términos y condiciones' && e.casillas === 2 && e.aceptar === 'apagado' && !e.dentro, JSON.stringify(e));
    check('Un toque afuera no la cierra', await p.evaluate(() => document.getElementById('ov').dataset.lock === '1'));
    await p.check('#tyc-1'); await p.waitForTimeout(100); e = await est();
    check('Con una sola casilla, «Aceptar» sigue apagado', e.aceptar === 'apagado', JSON.stringify(e));
    await p.check('#tyc-2'); await p.waitForTimeout(100); e = await est();
    check('Con las dos casillas, «Aceptar» se enciende', e.aceptar === 'encendido', JSON.stringify(e));
    await p.click('[data-tyc="ok"]'); await p.waitForTimeout(400);
    check('Al aceptar entra, con su nombre y la fecha en que aceptó', await p.evaluate(() => !!S.user && S.user.email === 'nuevo@gmail.com' && S.user.consent > Date.now() - 60000 && !document.getElementById('ov')));
    // cuenta que ya existía y ya había aceptado (v437: la fecha «t» en su perfil): entra directo
    await google(false, JSON.stringify({ n: 'Ana Nueva', t: 1 })); await entrar(); e = await est();
    check('Si la cuenta ya existía, entra directo sin preguntar', e.dentro && e.titulo !== 'Términos y condiciones', JSON.stringify(e));
    // cancelar: no entra, y en este teléfono se vuelve a preguntar la próxima vez aunque la cuenta ya no sea nueva
    await google(true); await entrar(); await p.click('[data-tyc="no"]'); await p.waitForTimeout(300); e = await est();
    check('Si cancela, no entra', !e.dentro && !await p.evaluate(() => !!document.querySelector('.tyc')), JSON.stringify(e));
    await google(false); await entrar(); e = await est();
    check('Después de cancelar, la próxima vez vuelve a preguntar', e.titulo === 'Términos y condiciones' && !e.dentro, JSON.stringify(e));
    sinErrores(p, 'Términos con Google'); await p.cerrar();
  },
  async terminosCuenta() { // v437 los términos salen a toda cuenta de Google que no los haya aceptado, no solo a la nueva
    const p = await abrir();
    const google = (user) => p.evaluate(u => { firebase.auth.GoogleAuthProvider = function () { this.addScope = () => {}; this.setCustomParameters = () => {} };
      smsApp = { auth: () => ({ languageCode: '', signOut: async () => {}, signInWithPopup: async () => ({ user: u, additionalUserInfo: { isNewUser: false }, credential: null }) }) };
      // la conexión principal ya entró con esa cuenta de Google: guarda lo que se escribe en su perfil
      window.__perfil = null; const fa = firebase.auth(); fa.currentUser = { uid: 'g1', isAnonymous: false, email: u.email, displayName: u.displayName, updateProfile: async o => { window.__perfil = o.displayName } } }, user);
    const entrar = async () => { await p.evaluate(() => { closeModal(1); S.user = null; save(); loginForm() }); await p.waitForTimeout(300);
      await p.evaluate(() => { const b = [...document.querySelectorAll('#ov button')].find(x => /Continuar con Google/.test(x.textContent)); b.click() }); await p.waitForTimeout(600) };
    const pide = () => p.evaluate(() => !!document.querySelector('.tyc') && !S.user);
    await google({ email: 'vieja@gmail.com', providerData: [{ providerId: 'google.com' }], displayName: 'Ana Vieja' }); await entrar();
    check('Una cuenta de Google que ya existía pero nunca aceptó ve «Términos y condiciones»', await pide());
    await p.check('#tyc-1'); await p.check('#tyc-2'); await p.click('[data-tyc="ok"]'); await p.waitForTimeout(400);
    const pf = await p.evaluate(() => { try { return JSON.parse(window.__perfil) } catch (e) { return null } });
    check('Al aceptar entra y la fecha queda guardada en el perfil de la cuenta, sin perder el nombre', await p.evaluate(() => !!S.user) && !!pf && pf.n === 'Ana Vieja' && pf.t > Date.now() - 60000, JSON.stringify(pf));
    await google({ email: 'vieja@gmail.com', providerData: [{ providerId: 'google.com' }], displayName: JSON.stringify(pf) }); await entrar();
    check('Con la fecha guardada en la cuenta entra directo (también en otro teléfono)', await p.evaluate(() => !!S.user && !document.querySelector('.tyc')));
    await google({ email: 'clave@gmail.com', providerData: [{ providerId: 'password' }, { providerId: 'google.com' }], displayName: JSON.stringify({ n: 'Ana Clave', e: 'clave@gmail.com', w: '3001234567' }) }); await entrar();
    check('Quien se registró con correo y clave (ya marcó la casilla) entra directo con Google', await p.evaluate(() => !!S.user && !document.querySelector('.tyc')));
    const src = await p.evaluate(() => [...document.querySelectorAll('script')].map(s => s && s.textContent || '').join(''));
    check('«Mis datos» y el cambio de teléfono conservan la fecha al reescribir el perfil', (src.match(/t:o\.t\/\* v437/g) || []).length === 2);
    sinErrores(p, 'Términos por cuenta'); await p.cerrar();
  },
  async descargarApp() { // v438 «Descargar la app» en el menú ☰ y en el pie; la tarjeta de instalar ya no sale sola
    const p = await abrir();
    // el navegador ofrece instalar (Chrome): antes salía sola la tarjeta «Instala Mi Pradera»
    await p.evaluate(() => { const ev = new Event('beforeinstallprompt'); ev.prompt = () => { window.__instalo = (window.__instalo || 0) + 1 }; ev.userChoice = Promise.resolve({ outcome: 'accepted' }); dispatchEvent(ev) });
    await p.waitForTimeout(5000);
    check('La tarjeta «Instala Mi Pradera» ya no sale sola al entrar', await p.evaluate(() => !document.querySelector('.qhb[aria-label="Instalar la app"]')));
    const pie = await p.evaluate(() => { const b = document.querySelector('footer [data-qapp]'); return b ? b.textContent.trim() : '' });
    check('El pie de la página tiene «Descargar la app»', pie === 'Descargar la app', pie);
    await p.click('footer [data-qapp]'); await p.waitForTimeout(300);
    check('Si el navegador permite instalar, «Descargar la app» abre su ventana «Instalar»', await p.evaluate(() => window.__instalo === 1 && !document.querySelector('.qapp')));
    // sin la ventana del navegador (ya se usó, o iPhone): salen las instrucciones
    await p.evaluate(() => { const b = document.querySelector('[data-act="hmenu"]'); b.click() }); await p.waitForTimeout(300);
    const fila = await p.evaluate(() => [...document.querySelectorAll('#ov .mrow')].map(x => x.textContent.trim()));
    check('El menú principal (☰) tiene «Descargar la app»', fila.includes('Descargar la app'), JSON.stringify(fila));
    await p.evaluate(() => [...document.querySelectorAll('#ov .mrow')].find(x => /Descargar la app/.test(x.textContent)).click()); await p.waitForTimeout(400);
    const v = await p.evaluate(() => { const m = document.querySelector('.qapp'); return m ? { t: m.querySelector('h2').textContent, h: [...m.querySelectorAll('h3')].map(h => h.textContent) } : null });
    check('Sin instalador del navegador, el menú abre «Descargar la app» con los pasos para Android, iPhone y computador', !!v && v.t === 'Descargar la app' && v.h.join() === 'En Android,En iPhone,En computador', JSON.stringify(v));
    await p.evaluate(() => document.querySelector('.qapp [data-act="close"]').click()); await p.waitForTimeout(300);
    check('«Entendido» cierra la ventana', await p.evaluate(() => !document.querySelector('.qapp')));
    sinErrores(p, 'Descargar la app'); await p.cerrar();
  },
  async enlaceApp() { // v438 enlace directo mipradera.com.co/app → /?app=1: abre «Descargar la app»
    let p = await abrir({ ruta: '?app=1' }); await p.waitForTimeout(1500);
    let v = await p.evaluate(() => ({ abierta: !!document.querySelector('.qapp'), pasos: document.querySelectorAll('.qapp h3').length, url: location.search }));
    check('Con ?app=1 se abre sola «Descargar la app» (sin instalador del navegador: con los pasos) y la dirección queda limpia', v.abierta && v.pasos === 3 && !/app/.test(v.url), JSON.stringify(v));
    // el permiso de instalar llega después: la ventana pasa a mostrar «Instalar», y el toque abre el instalador
    await p.evaluate(() => { const ev = new Event('beforeinstallprompt'); ev.prompt = () => { window.__instalo = (window.__instalo || 0) + 1 }; ev.userChoice = Promise.resolve({ outcome: 'accepted' }); dispatchEvent(ev) }); await p.waitForTimeout(400);
    check('Cuando el navegador permite instalar, la ventana muestra el botón «Instalar»', await p.evaluate(() => { const b = document.querySelector('[data-qapp-in]'); return !!b && b.textContent === 'Instalar' && !window.__instalo }));
    await p.click('[data-qapp-in]'); await p.waitForTimeout(300);
    check('El botón «Instalar» abre el instalador del navegador y cierra la ventana', await p.evaluate(() => window.__instalo === 1 && !document.querySelector('.qapp')));
    sinErrores(p, 'Enlace de la app'); await p.cerrar();
    check('La página del enlace corto (app/index.html) lleva a /?app=1', /location\.replace\('\/\?app=1'\)/.test(require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'app', 'index.html'), 'utf8')));
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
  async sinPrecio() { // v439 productos sin precio: «Consultar precio» en tarjetas, ficha, carrito y WhatsApp; el formulario no lo exige
    const tienda = { id: 's1', name: 'Tienda s1', ownerKey: 'kOtro', cat: 'Otros', wa: '3001234567', pays: ['cash'], pexp: Date.now() + 30 * 864e5, _o: 1, products: [] }, pr = (id, x) => Object.assign({ id, sid: 's1', imgs: [], ownerKey: 'kOtro' }, x);
    const p = await abrir({ seed: { 'stores/s1': tienda, 'products/s1__p1': pr('p1', { name: 'Arroz', price: 4000, _o: 1 }), 'products/s1__p2': pr('p2', { name: 'Torta por encargo', price: 0, _o: 2 }), 'products/s1__p3': pr('p3', { name: 'Ramo', price: 0, old: 9000, _o: 3 }) } });
    await p.evaluate(() => { closeModal(1); view = 'store'; cur = 's1'; render() }); await p.waitForTimeout(400);
    const app = await p.evaluate(() => document.getElementById('app').innerText);
    check('En la tienda, el producto sin precio dice «Consultar precio» y no «$ 0»', /Torta por encargo[\s\S]{0,80}Consultar precio/.test(app) && !/\$\s?0(?![\d.])/.test(app), app.slice(0, 300));
    check('Sin precio no sale descuento ni precio tachado', !/% OFF/.test(app) && !/9\.000/.test(app));
    await p.evaluate(() => { view = 'prod'; curP = 'p2'; pI = 0; pQ = 1; render() }); await p.waitForTimeout(400);
    check('La ficha del producto dice «Consultar precio»', await p.evaluate(() => /Consultar precio/.test((document.querySelector('.pvpr') || {}).textContent || '')));
    await p.evaluate(() => { QH.push = () => {}; window.open = u => { window.__wa = decodeURIComponent(u) }; S.cart = { 's1|p1||': 1, 's1|p2||': 2 }; save(); openCart() }); await p.waitForTimeout(300);
    const car = await p.evaluate(() => document.getElementById('drawer').innerText);
    check('El carrito muestra «Consultar precio» y el total «+ precios por consultar»', /Consultar precio/.test(car) && /4\.000 \+ precios por consultar/.test(car), car);
    await p.evaluate(() => { S.user = { id: 'u9', name: 'Ana Pérez', email: 'a@x.co', wa: '3112223344', pw: 1, k: 'kN' }; save(); syncUI(); openCart(); document.querySelector('[data-act="order"][data-id="s1"]').click() }); await p.waitForTimeout(600);
    await p.evaluate(() => { const z = document.querySelector('#ov .znsel'); z.value = 'Centro'; z.dispatchEvent(new Event('change', { bubbles: true })); document.getElementById('iv-d').value = 'Calle 5 # 3-20'; document.querySelector('[data-ivgo="ped"]').click() }); await p.waitForTimeout(1200);
    const wa = await p.evaluate(() => window.__wa || '');
    check('El WhatsApp dice «precio por consultar» y el total lo aclara', /Torta por encargo \(precio por consultar\)/.test(wa) && /Total: \$\s?4\.000 \+ precios por consultar/.test(wa), wa.slice(0, 300));
    await conCuenta(p); await p.evaluate(() => { document.body.insertAdjacentHTML('beforeend', '<i class="qtour" hidden></i>'); S.mine.push('s1'); planMsgExt = () => ''; closeModal(1); view = 'store'; cur = 's1'; render(); prodForm() }); await p.waitForTimeout(400);
    check('El formulario dice que el precio es opcional', /Precio \(COP, opcional\)/.test(await p.evaluate(() => document.querySelector('label[for="p-price"]').textContent)));
    await p.evaluate(() => { if (window.qhPasos) qhPasos.ver('#p-name'); document.getElementById('p-name').value = 'Arreglo floral'; document.querySelector('[data-act="saveProd"]').click() }); await p.waitForTimeout(600);
    check('Se guarda un producto sin precio', await p.evaluate(() => { const x = S.stores.find(s => s.id === 's1').products.find(q => q.name === 'Arreglo floral'); return !!x && !(x.price > 0) }), await p.evaluate(() => (document.getElementById('err') || {}).textContent || ''));
    sinErrores(p, 'Sin precio'); await p.cerrar();
  },
  async tiendasPorLimpiar() { // v440 tiendas vencidas: se guarda 3 meses; después el administrador borra lo pagado
    const D = 864e5, now = Date.now(), pr = (sid, id) => ({ id, sid, name: 'Producto ' + id, price: 1000, imgs: [], ownerKey: sid === 's1' ? 'kA' : sid === 's2' ? 'kB' : 'kC', _o: 1 });
    const tienda = (id, k, pexp, x) => Object.assign({ id, name: 'Tienda ' + id, ownerKey: k, cat: 'Otros', wa: '3001234567', pexp, _o: 1, gal: ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg'], vid: 'dQw4w9WgXcQ' }, x);
    const seed = { 'plans/kA': { k: 'kA', name: 'Ana', email: 'ana@x.co', plan: 'free', acc: { merc: now - 100 * D } }, 'plans/kB': { k: 'kB', name: 'Beto', email: 'beto@x.co', plan: 'free', acc: { merc: now - 40 * D } }, 'plans/kC': { k: 'kC', name: 'Caro', email: 'caro@x.co', plan: 'free', acc: { merc: now + 20 * D } },
      'stores/s1': tienda('s1', 'kA', now - 100 * D), 'stores/s2': tienda('s2', 'kB', now - 40 * D), 'stores/s3': tienda('s3', 'kC', now - 100 * D), // s3: la fecha de la tienda está vieja, pero su dueño ya renovó
      'products/s1__p1': pr('s1', 'p1'), 'products/s1__p2': pr('s1', 'p2'), 'products/s2__p3': pr('s2', 'p3'), 'products/s3__p4': pr('s3', 'p4') };
    const p = await abrir({ admin: true, seed });
    await p.evaluate(() => { closeModal(1); at = 'usr'; view = 'admin'; render() }); await p.waitForTimeout(500);
    const caja = () => p.evaluate(() => { const h = [...document.querySelectorAll('.aadp')].find(x => /Tiendas por limpiar/.test(x.textContent)); return h ? h.textContent : '' });
    const t = await caja();
    check('Sale la tienda vencida hace más de 3 meses, con lo que se borraría', /Tienda s1/.test(t) && /2 productos, 2 fotos extra, el video/.test(t), t.slice(0, 300));
    check('No salen la tienda vencida hace 40 días ni la de quien ya renovó', !/Tienda s2/.test(t) && !/Tienda s3/.test(t));
    await p.click('[data-limpiar="s1"]'); await p.waitForTimeout(300);
    check('Pregunta antes de borrar', /¿Borrar 2 productos/.test(await p.evaluate(() => (document.getElementById('cfm-t') || {}).textContent || '')));
    await p.click('#cfm-ok'); await p.waitForTimeout(800);
    const s1 = await p.evaluate(() => { const s = S.stores.find(x => x.id === 's1'); return { n: s.products.length, g: (s.gal || []).length, v: s.vid || '' } });
    check('Se borran los productos, las fotos que pasan de 3 y el video; la tienda sigue', s1.n === 0 && s1.g === 3 && !s1.v, JSON.stringify(s1));
    check('Las otras tiendas no se tocan', await p.evaluate(() => S.stores.find(x => x.id === 's2').products.length === 1 && S.stores.find(x => x.id === 's3').products.length === 1));
    check('Ya no hay tiendas por limpiar', !(await caja()));
    sinErrores(p, 'Tiendas por limpiar'); await p.cerrar();
    const q = await abrir({ seed: { 'stores/s2': tienda('s2', 'kB', now - 40 * D) } });
    await conCuenta(q); await q.evaluate(() => { S.user.k = 'kB'; S.mine.push('s2'); closeModal(1); view = 'store'; cur = 's2'; render() }); await q.waitForTimeout(400);
    const n = await q.evaluate(() => (document.querySelector('.shpn') || {}).textContent || '');
    check('El dueño ve hasta qué fecha se guardan sus productos', /guardad[oa]s? hasta el/.test(n) && /Después se borra/.test(n), n);
    sinErrores(q, 'Aviso de la tienda vencida'); await q.cerrar();
  },
  async adminEditaTienda() { // v441 el administrador edita la tienda completa y sus productos sin quitársela al dueño
    const tienda = { id: 's1', name: 'Panadería', cat: 'Otros', wa: '3112223344', ownerKey: 'kA', ownerUid: 'uA', desc: 'Pan de la casa', _o: 1, products: [] };
    const p = await abrir({ admin: true, seed: { 'plans/kA': { k: 'kA', name: 'Ana Pérez', email: 'ana@x.co', plan: 'free' }, 'stores/s1': tienda, 'products/s1__p1': { id: 'p1', sid: 's1', name: 'Pan', price: 500, imgs: [], ownerKey: 'kA', ownerUid: 'uA', _o: 1 } } });
    await p.evaluate(() => { closeModal(1); at = 'usr'; view = 'admin'; render() }); await p.waitForTimeout(500);
    const b = await p.evaluate(() => { const x = document.querySelector('[data-admedit="s1"]'); if (x) x.scrollIntoView(); return !!x });
    if (!b) await p.evaluate(() => document.querySelector('#app').insertAdjacentHTML('beforeend', admShops('kA')));
    check('En la tarjeta de la persona sale «Editar tienda y productos»', await p.evaluate(() => !!document.querySelector('[data-admedit="s1"]')));
    await p.evaluate(() => document.querySelector('[data-admedit="s1"]').click()); await p.waitForTimeout(500);
    check('Se abre la tienda con los botones del dueño y la barra de edición', await p.evaluate(() => view === 'store' && cur === 's1' && !!document.querySelector('[data-act="editShop"]') && !!document.querySelector('[data-act="newProd"],[data-act="prodForm"],[data-act="addProd"]') && /Editando como administrador/.test((document.getElementById('aed') || {}).textContent || '')));
    await p.evaluate(() => { document.querySelector('[data-act="editShop"]').click() }); await p.waitForTimeout(400);
    if (process.env.FOTO_V483) { await p.evaluate(() => document.getElementById('e-cat').scrollIntoView({ block: 'center' })); await p.waitForTimeout(300); await p.screenshot({ path: process.env.FOTO_V483 }) }
    check('v483: «Editar tienda» tiene «Categoría», con la de la tienda elegida y las subcategorías por grupo', await p.evaluate(() => { const s = document.getElementById('e-cat'); return !!s && s.value === 'Otros' && !!s.querySelector('optgroup[label="Hogar y decoración"] option[value="Hogar y decoración"]') && !!s.querySelector('optgroup[label="Construcción"] option[value="Ferreterías"]') }));
    await p.evaluate(() => { document.getElementById('e-name').value = 'Panadería Ana'; document.getElementById('e-cat').value = 'Hogar y decoración'; document.querySelector('[data-act="saveEditShop"]').click() }); await p.waitForTimeout(500);
    check('v483: al guardar, la tienda pasa a «Hogar y decoración» y toma el diseño de mueblería', await p.evaluate(() => S.stores.find(x => x.id === 's1').cat === 'Hogar y decoración' && view === 'store' && !!document.querySelector('.qhmue-m') && !document.querySelector('.qhfer-m')));
    await p.evaluate(() => prodForm()); await p.waitForTimeout(300);
    await p.evaluate(() => { if (window.qhPasos) qhPasos.ver('#p-name'); document.getElementById('p-name').value = 'Torta'; document.getElementById('p-price').value = '20.000'; document.querySelector('[data-act="saveProd"]').click() }); await p.waitForTimeout(1500);
    const g = await p.evaluate(() => { const s = S.stores.find(x => x.id === 's1'); return { n: s.name, ps: s.products.map(x => x.name + ':' + x.price).join(), err: (document.getElementById('err') || {}).textContent || '' } });
    check('El administrador cambia el nombre y agrega un producto', g.n === 'Panadería Ana' && g.ps === 'Pan:500,Torta:20000', JSON.stringify(g));
    const doc = await p.evaluate(async () => { const d = Object.values((QH.raw ? QH.raw() : {}).products || {}); const db = firebase.firestore(); const s = await db.collection('stores').doc('s1').get(), ps = await db.collection('products').get(); return { s: s.data(), ps: ps.docs.map(x => x.data()) } });
    check('En la base de datos la tienda y el producto nuevo siguen siendo del dueño', doc.s.name === 'Panadería Ana' && doc.s.ownerKey === 'kA' && doc.s.ownerUid === 'uA' && doc.ps.some(x => x.name === 'Torta' && x.ownerKey === 'kA' && x.ownerUid === 'uA'), JSON.stringify(doc).slice(0, 400));
    check('v483: en la base de datos la tienda quedó con la categoría nueva', doc.s.cat === 'Hogar y decoración', doc.s.cat);
    await p.evaluate(() => document.querySelector('[data-admedit-fin]').click()); await p.waitForTimeout(500);
    check('«Terminar» vuelve al panel y quita la tienda de «mías»', await p.evaluate(() => view === 'admin' && !S.mine.includes('s1') && !document.getElementById('aed')));
    sinErrores(p, 'Admin edita tienda'); await p.cerrar();
  },
  async muro() { // v442 «Muro» estilo Facebook: pestañas de categorías que se cambian deslizando, ventana «¿Qué quieres publicar?» y filtros en ventana
    const now = Date.now(), H = 36e5;
    const seed = { 'community/c1': { id: 'c1', ownerKey: 'kB', owner: 'Ana Pérez', pl: 'free', op: 'vendo', title: 'Vendo nevera', text: 'Poco uso', price: 450000, img: '', cat: 'var', ts: now - 2 * H, exp: now + 20 * H },
      'community/c2': { id: 'c2', ownerKey: 'kC', owner: 'Luis', pl: 'free', op: 'regalo', title: 'Regalo gatitos', text: '', img: '', cat: 'com', ts: now - 5 * H, exp: now + 18 * H },
      'stores/s1': { id: 's1', name: 'Canela Gastrobar', cat: 'Restaurantes', ownerKey: 'kD', wa: '3001234567', desc: 'Menú del día', ts: now - H, _o: 1, products: [] },
      'stores/s2': { id: 's2', name: 'Tienda Tomaticos', cat: 'Otros', ownerKey: 'kE', wa: '3001234568', desc: 'Frutas', ts: now - 3 * H, _o: 2, products: [] } };
    const p = await abrir({ seed });
    const sel = () => p.evaluate(() => (document.querySelector('.mutabs [aria-selected="true"]') || {}).textContent || '');
    await p.evaluate(() => { closeModal(1); document.querySelector('#bnav [data-v="com"]').click() }); await p.waitForTimeout(500);
    check('El botón de abajo se llama «Muro» y abre en «Todo»', await p.evaluate(() => document.querySelector('#bnav [data-v="com"]').innerText.trim() === 'Muro') && await sel() === 'Todo');
    check('v466: el ícono del Muro es la lista (cuadros y líneas), no el megáfono', await p.evaluate(() => { const g = document.querySelector('#bnav [data-v="com"] svg'); return !!g && g.querySelectorAll('rect').length === 2 && g.querySelectorAll('path').length === 4 }));
    const app = await p.evaluate(() => document.getElementById('app').innerText);
    check('«Todo» junta clasificados y tiendas en tarjetas, lo más nuevo arriba', /Canela Gastrobar[\s\S]*Vendo nevera[\s\S]*Tienda Tomaticos[\s\S]*Regalo gatitos/.test(app), app.slice(0, 300));
    check('Ya no están el título con «Gratis: 1 anuncio…», Obituario, Empleo ni los tipos (Vendo, Arriendo…)', await p.evaluate(() => !document.querySelector('#app .shead, #app .cmops, #app [data-obi], #app [data-empb], #app .cmct')));
    check('«¿Deseas publicar un anuncio?» va arriba, antes del buscador', await p.evaluate(() => { const a = document.querySelector('.mucomp'), b = document.querySelector('.mu #cq'); return !!a && !!b && (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) > 0 }));
    const sw = dx => p.evaluate(dx => { const el = document.querySelector('#mufeed'), y = Math.min(el.getBoundingClientRect().top + 150, 700); const T = (k, X) => { const t = new Touch({ identifier: 1, target: el, clientX: X, clientY: y }); el.dispatchEvent(new TouchEvent(k, { touches: k === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true })) }; T('touchstart', 220); T('touchend', 220 + dx) }, dx);
    await sw(-150); await p.waitForTimeout(400);
    check('Deslizar a la izquierda pasa a «Clasificados»', await sel() === 'Clasificados');
    check('En «Clasificados» solo salen los clasificados', await p.evaluate(() => document.querySelectorAll('#mufeed article.cmc[data-cid]').length === 2 && !/Canela/.test(document.getElementById('mufeed').innerText)));
    await sw(-150); await p.waitForTimeout(300); await sw(-150); await p.waitForTimeout(400);
    check('Dos veces más: «Comidas», con solo el restaurante', await sel() === 'Comidas' && await p.evaluate(() => { const t = document.getElementById('mufeed').innerText; return /Canela Gastrobar/.test(t) && !/Tomaticos/.test(t) }));
    await sw(150); await p.waitForTimeout(400);
    check('Deslizar a la derecha vuelve a «Tiendas»', await sel() === 'Tiendas');
    await sw(20); await p.waitForTimeout(300);
    check('Un movimiento corto no cambia de pestaña', await sel() === 'Tiendas');
    await p.evaluate(() => document.querySelector('[data-mutab="cm"]').click()); await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelector('[data-mu="flt"]').click()); await p.waitForTimeout(300);
    await p.evaluate(() => { const s = document.getElementById('muf-op'); s.value = 'regalo'; document.querySelector('[data-mu="fok"]').click() }); await p.waitForTimeout(400);
    check('«Filtros» abre una ventana y filtra por tipo', await p.evaluate(() => { const l = [...document.querySelectorAll('#mufeed article.cmc[data-cid]')].map(x => x.dataset.cid); return l.join() === 'c2' && /Filtros \(1\)/.test(document.querySelector('[data-mu="flt"]').textContent) }));
    await p.evaluate(() => document.querySelector('[data-mu="clr"]').click()); await p.waitForTimeout(300);
    check('«Limpiar» quita los filtros', await p.evaluate(() => document.querySelectorAll('#mufeed article.cmc[data-cid]').length === 2));
    await p.evaluate(() => document.querySelector('#bnav [data-v="pub"]').click()); await p.waitForTimeout(400);
    const op = await p.evaluate(() => [...document.querySelectorAll('#ov .muop b')].map(b => b.textContent).join(','));
    check('«+ Publicar» abre «¿Qué quieres publicar?» con todas las opciones y «Otro tipo de anuncio»', op === 'Anuncio clasificado,Mi negocio o tienda,Inmueble,Vehículo,Servicio,Empleo,Obituario,Otro tipo de anuncio,Planes y precios', op);
    await p.evaluate(() => closeModal(1)); await p.waitForTimeout(250);
    await p.evaluate(() => document.querySelector('.mucomp').click()); await p.waitForTimeout(400);
    check('La barra «¿Deseas publicar un anuncio?» abre la misma ventana', await p.evaluate(() => /¿Qué quieres publicar\?/.test((document.querySelector('#ov h2') || {}).textContent || '')));
    sinErrores(p, 'Muro'); await p.cerrar();
  },
  async registroYaEntro() { // v443 si se llenó «Registrarme» por error y se entró por «Iniciar sesión», no queda el aviso «Tienes tu registro sin terminar»
    const p = await abrir();
    await p.evaluate(() => { closeModal(1); document.body.insertAdjacentHTML('beforeend', '<i class="qtour" hidden></i>'); regForm() }); await p.waitForTimeout(400);
    const campo = await p.evaluate(() => { const i = [...document.querySelectorAll('#ov input[type="text"],#ov input[type="email"],#ov input:not([type])')].find(x => x.offsetParent); return i ? i.id : '' });
    await p.fill('#' + campo, 'Ana Pérez'); await p.waitForTimeout(700);
    await p.evaluate(() => closeModal(1)); await p.waitForTimeout(600);
    check('Sin sesión, el aviso del registro sin terminar sí sale', await p.evaluate(() => /registro sin terminar/.test((document.getElementById('brbar') || {}).textContent || '')), campo);
    await conCuenta(p); await p.evaluate(() => { try { render(true) } catch (e) {} }); await p.waitForTimeout(800);
    check('Al entrar con la cuenta, el aviso desaparece y el borrador se borra', await p.evaluate(() => !document.getElementById('brbar') && !/doReg/.test(localStorage.getItem('qh_borr') || '')));
    sinErrores(p, 'Registro y ya entró'); await p.cerrar();
  },
  async productosAmazon() { // v444 tiendas con categorías: productos en filas como Amazon en celular (antes, tarjetas de dos columnas)
    const pr = (id, x) => Object.assign({ id, sid: 's1', imgs: [], ownerKey: 'kD', _o: 1 }, x);
    const seed = { 'stores/s1': { id: 's1', name: 'Heladería', cat: 'Otros', ownerKey: 'kD', wa: '3001234567', verified: true, pexp: Date.now() + 30 * 864e5, mc: [{ n: 'Helados', subs: [] }], _o: 1, products: [] },
      'products/s1__p1': pr('p1', { name: 'Helado', d: 'Dos bolas', price: 5000, c1: 'Helados', _o: 1 }), 'products/s1__p2': pr('p2', { name: 'Ensalada de frutas', price: 20000, old: 24000, c1: 'Helados', _o: 2 }), 'products/s1__p3': pr('p3', { name: 'Malteada', price: 12000, _o: 3 }) };
    const p = await abrir({ seed });
    await p.evaluate(() => { closeModal(1); view = 'store'; cur = 's1'; render() }); await p.waitForTimeout(500);
    const r = await p.evaluate(() => [...document.querySelectorAll('#app .psec .prod')].map(c => { const a = c.getBoundingClientRect(), f = c.querySelector('.pic').getBoundingClientRect(), h = c.querySelector('h3').getBoundingClientRect(), b = c.querySelector('.plus').getBoundingClientRect(); return { w: a.width, fotoIzq: f.right <= h.left, boton: b.left >= f.right && getComputedStyle(c.querySelector('.plus'), '::before').content.includes('Agregar al carrito') } }));
    check('En una tienda con categorías cada producto ocupa una fila entera', r.length >= 3 && r.every(x => x.w > 330), JSON.stringify(r));
    check('Foto a la izquierda; nombre y «Agregar al carrito» a la derecha', r.every(x => x.fotoIzq && x.boton), JSON.stringify(r));
    check('Las filas no se desbordan a los lados', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    sinErrores(p, 'Productos como Amazon'); await p.cerrar();
  },
  async mapaInmuebles() { // v445 «Mostrar» en el Mapa: tiendas o arriendos e inmuebles en venta; los sin punto, al administrador
    const PR = [3.4189, -76.2433], ad = (id, type, title, dl, x) => Object.assign({ id, type, title, price: 900000, zone: 'Centro', desc: '', imgs: [], f: { addr: 'Calle ' + id }, ts: Date.now(), ownerKey: 'kZ', lat: dl ? PR[0] + dl : null, lng: dl ? PR[1] + dl : null }, x);
    const seed = { 'ads/i1': ad('i1', 'arr', 'Casa de 3 habitaciones', 0.002), 'ads/i2': ad('i2', 'casa', 'Casa en venta con patio', -0.003), 'ads/i3': ad('i3', 'arr', 'Local comercial', null), 'ads/v1': ad('v1', 'veh', 'Moto', 0.001) };
    const p = await abrir({ seed });
    await p.evaluate(() => { closeModal(1); view = 'map'; render() }); await p.waitForTimeout(500);
    check('El mapa tiene «Mostrar» y sigue con las tiendas', await p.evaluate(() => !!document.getElementById('m-que') && /Mapa de tiendas/.test(document.getElementById('app').innerText) && !!document.getElementById('m-cat')));
    await p.selectOption('#m-que', 'inm'); await p.waitForTimeout(500);
    const t = await p.evaluate(() => document.getElementById('app').innerText);
    check('«Arriendos e inmuebles en venta» muestra los dos con punto y cuenta el que no lo tiene', /Mapa de arriendos e inmuebles en venta/.test(t) && /2 inmuebles ubicados/.test(t) && /1 aún no tiene su punto/.test(t) && /Casa de 3 habitaciones/.test(t) && /Casa en venta con patio/.test(t) && !/Moto/.test(t), t.slice(0, 400));
    await p.selectOption('#m-que', 'casa'); await p.waitForTimeout(400);
    check('«Solo ventas» deja solo la casa en venta', await p.evaluate(() => { const t = document.getElementById('app').innerText; return /1 inmueble ubicado/.test(t) && /Casa en venta/.test(t) && !/Casa de 3 habitaciones/.test(t) }));
    await p.evaluate(() => document.querySelector('.mlist [data-act="openAd"]').click()); await p.waitForTimeout(400);
    check('«Ver» de la lista abre el anuncio', await p.evaluate(() => view === 'ad' && curAd === 'i2'));
    sinErrores(p, 'Mapa de inmuebles'); await p.cerrar();
    const q = await abrir({ admin: true, seed });
    await q.evaluate(() => { closeModal(1); at = 'usr'; view = 'admin'; render() }); await q.waitForTimeout(500);
    check('El administrador ve el inmueble sin punto para ponerle el código plus', await q.evaluate(() => !!document.querySelector('[data-adplus="i3"]') && !document.querySelector('[data-adplus="i1"]') && /Aún no tiene su punto/.test(document.getElementById('app').innerText)));
    sinErrores(q, 'Mapa de inmuebles (administrador)'); await q.cerrar();
  },
  async busquedaRetardo() { // v446 el buscador de arriba espera a que se deje de escribir; Enter busca en el momento
    const seed = { 'stores/s1': { id: 's1', name: 'Dulces de la Abuela', desc: 'Dulces', cat: 'Otros', wa: '3001234567', ownerKey: 'kO', pexp: Date.now() + 30 * 864e5, products: [], _o: 1 },
      'products/s1__p1': { id: 'p1', sid: 's1', name: 'Arequipe casero', price: 9000, imgs: [], ownerKey: 'kO', _o: 1 } };
    const p = await abrir({ seed });
    // se anota cuándo se escribe cada letra y cuándo se busca: cada búsqueda debe llegar al menos 200 ms después de la última letra
    // (así no depende de lo rápida que sea la máquina: si una pausa entre letras pasa de 220 ms, buscar ahí también es correcto)
    await p.evaluate(() => { closeModal(1); window.__k = []; window.__b = []; window.addEventListener('input', e => { if (e.target.id === 'q' && e.isTrusted) __k.push(performance.now()) }, true); document.getElementById('q').addEventListener('input', () => __b.push(performance.now())) });
    await p.click('header #q'); await p.keyboard.type('arequipe', { delay: 30 }); await p.waitForTimeout(450);
    const t = await p.evaluate(() => { const last = x => Math.max(...__k.filter(k => k <= x)); return { letras: __k.length, busquedas: __b.length, esperas: __b.map(x => Math.round(x - last(x))) } });
    check('Mientras se escribe no busca en cada letra; busca al terminar', t.letras === 8 && t.busquedas >= 1 && t.busquedas < t.letras && t.esperas.every(w => w >= 200), JSON.stringify(t));
    check('La lista de resultados muestra lo escrito', await p.evaluate(() => { const b = document.getElementById('sr'); return !!b && !b.hidden && /Arequipe casero/.test(b.innerText) }));
    await p.fill('header #q', ''); await p.waitForTimeout(400);
    await p.click('header #q'); await p.keyboard.type('arequ', { delay: 10 }); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
    check('Enter antes de la espera busca en el momento y abre el resultado', await p.evaluate(() => /Arequipe casero/.test(document.getElementById('app').innerText)));
    sinErrores(p, 'Búsqueda con retardo'); await p.cerrar();
  },
  async fuentesPropias() { // v447 la letra Rubik sale de fuentes/ y no de Google Fonts
    const p = await abrir();
    const r = await p.evaluate(async () => { await document.fonts.load('400 16px Outfit'); await document.fonts.load('700 16px Onest'); return { cargada: document.fonts.check('400 16px Outfit') && document.fonts.check('700 16px Onest'), google: !!document.querySelector('link[href*="fonts.googleapis"],link[href*="fonts.gstatic"]'), letra: getComputedStyle(document.body).fontFamily } });
    check('Las letras (Outfit y Onest desde la v457) cargan desde la propia página', r.cargada && /Outfit/.test(r.letra), JSON.stringify(r));
    check('No hay enlaces a Google Fonts al abrir la página', !r.google, JSON.stringify(r));
    const res = await p.evaluate(async () => { const x = await fetch('fuentes/outfit-latin.woff2'); return { ok: x.ok, n: (await x.arrayBuffer()).byteLength } });
    check('El archivo de la letra existe y pesa menos de 40 KB', res.ok && res.n > 10000 && res.n < 40000, JSON.stringify(res));
    sinErrores(p, 'Fuentes propias'); await p.cerrar();
  },
  async esqueletos() { // v448 en el inicio no sale la pantalla del logo: la página aparece y lo que espera datos sale en gris
    const seed = { 'stores/s1': { id: 's1', name: 'Dulces de la Abuela', desc: 'Dulces', cat: 'Otros', wa: '3001234567', ownerKey: 'kO', pexp: Date.now() + 30 * 864e5, products: [], _o: 1 } };
    const p = await abrir({ seed });
    await p.context().addInitScript(() => { window.__fbDemora = 2500 });
    await p.goto(base + '/index.html'); await p.waitForTimeout(150);
    const a = await p.evaluate(() => ({ splash: !!document.getElementById('splash') && getComputedStyle(document.getElementById('splash')).display !== 'none', esq: !!document.querySelector('#app .esq'), header: !!document.querySelector('header #q') }));
    check('Al abrir el inicio no tapa la pantalla del logo: se ve el encabezado y la forma de la página en gris', !a.splash && a.esq && a.header, JSON.stringify(a));
    await p.waitForTimeout(1000);
    const b = await p.evaluate(() => ({ vacio: [...document.querySelectorAll('#app .hswc>.empty')].length, filas: document.querySelectorAll('#app .hswc .esq-fila').length, neg: !!document.querySelector('#app .esq-neg'), cats: !!document.querySelector('#app .hubg') }));
    check('Mientras llegan los datos no dice «no hay publicaciones»: salen filas grises y el lugar de «Negocios»', b.vacio === 0 && b.filas >= 3 && b.neg && b.cats, JSON.stringify(b));
    await p.waitForTimeout(2500);
    const c = await p.evaluate(() => ({ esq: document.querySelectorAll('#app .esq').length, neg: !!document.querySelector('#app .hneg'), txt: /Dulces de la Abuela/.test(document.getElementById('app').innerText) }));
    check('Al llegar los datos se quitan los esqueletos y salen las tiendas', c.esq === 0 && c.neg && c.txt, JSON.stringify(c));
    // entrar a otra sección antes de que lleguen los datos
    await p.goto(base + '/index.html?r=1'); await p.waitForTimeout(1300);
    await p.evaluate(() => { location.hash = '#/servicios' }); await p.waitForTimeout(300);
    const d = await p.evaluate(() => ({ vista: !!document.querySelector('#app .esq-vista'), no: /Aún no hay|no hay/i.test(document.getElementById('app').innerText) }));
    check('En otra sección antes de los datos sale una lista gris, no «no hay…»', d.vista && !d.no, JSON.stringify(d));
    await p.waitForTimeout(2500);
    check('Al llegar los datos esa sección se dibuja con los datos', await p.evaluate(() => !document.querySelector('#app .esq') && view === 'serv'));
    // un enlace directo (una tienda) sigue con la pantalla del logo hasta que llegan los datos
    await p.goto(base + '/index.html?r=2#/t/s1'); await p.waitForTimeout(300);
    check('Con un enlace directo sigue la pantalla del logo', await p.evaluate(() => { const s = document.getElementById('splash'); return !!s && getComputedStyle(s).display !== 'none' && !document.documentElement.classList.contains('qh-esq') }));
    await p.waitForTimeout(3500);
    check('…y abre la tienda al llegar los datos', await p.evaluate(() => view === 'store' && /Dulces de la Abuela/.test(document.getElementById('app').innerText)));
    sinErrores(p, 'Esqueletos de carga'); await p.cerrar();
  },
  async oscuroBajoDemanda() { // v450 el generador del modo oscuro solo trabaja con el modo oscuro encendido
    const seed = { 'stores/s1': { id: 's1', name: 'Dulces de la Abuela', desc: 'Dulces', cat: 'Otros', wa: '3001234567', ownerKey: 'kO', pexp: Date.now() + 30 * 864e5, products: [], _o: 1 } };
    const colores = pg => pg.evaluate(() => ['body', 'header', '#app', '.hubg .hubt, .hubg button, .hubg a', '#bnav', 'header #q', '.hsw'].map(s => { const e = document.querySelector(s); if (!e) return s + ': -'; const c = getComputedStyle(e); return s + ': ' + c.backgroundColor + ' / ' + c.color + ' / ' + c.borderTopColor }));
    const p = await abrir({ seed });
    check('En modo claro no se genera la hoja oscura', await p.evaluate(() => !document.getElementById('v219-oscuro-generado')));
    await p.click('#themeBtn'); await p.waitForTimeout(300);
    check('Al pasar a oscuro se genera la hoja oscura', await p.evaluate(() => document.documentElement.classList.contains('dark') && !!document.getElementById('v219-oscuro-generado') && document.getElementById('v219-oscuro-generado').textContent.length > 10000));
    const a = await colores(p);
    const q = await abrir({ seed, dark: true });
    const b = await colores(q);
    check('Pasar a oscuro se ve igual que abrir la página ya en oscuro', JSON.stringify(a) === JSON.stringify(b), JSON.stringify({ a, b }));
    await p.click('#themeBtn'); await p.waitForTimeout(300);
    check('Al volver a claro el fondo vuelve a ser claro', await p.evaluate(() => !document.documentElement.classList.contains('dark') && getComputedStyle(document.body).backgroundColor !== 'rgb(0, 0, 0)' && /255|24\d|25\d/.test(getComputedStyle(document.querySelector('header')).backgroundColor)));
    sinErrores(p, 'Oscuro bajo demanda'); sinErrores(q, 'Oscuro desde el inicio'); await p.cerrar(); await q.cerrar();
  },
  async noticiasLivianas() { // v451 comentarios y reacciones solo de las noticias en pantalla; la lista de noticias se pide con una sola consulta
    const t = Date.now() - 3600e3, nw = (id, title, ts) => ({ id, title, txt: 'Texto de ' + title, ts, ownerKey: 'kR', ownerUid: 'uR', imgs: [] });
    const fb = (nwId, uid, x) => Object.assign({ nw: nwId, uid, ts: t }, x);
    const seed = { 'news/n1': nw('n1', 'Feria del pueblo', t), 'news/n2': nw('n2', 'Arreglo de la vía', t - 1000),
      'nwFb/n1_u1_c1': fb('n1', 'u1', { cid: 'c1', name: 'Ana', txt: 'Qué bien' }), 'nwFb/n1_u2_c2': fb('n1', 'u2', { cid: 'c2', name: 'Beto', txt: 'Allá estaré' }),
      'nwFb/n1_u3': fb('n1', 'u3', { re: 'like' }), 'nwFb/n2_u1_c3': fb('n2', 'u1', { cid: 'c3', name: 'Ana', txt: 'Por fin' }) };
    const p = await abrir({ seed });
    const enPantalla = () => p.evaluate(() => new Set([...document.querySelectorAll('.nwfb[data-nw],.nwcnt[data-nwc]')].map(e => e.dataset.nw || e.dataset.nwc)).size);
    const a = await p.evaluate(() => ({ oy: __fbOyentes('nwFb'), q: (window.__fbQ || []).filter(x => x[0] === 'news' && x[1] === 'limit').map(x => x[2]) }));
    check('Al abrir, solo escucha comentarios de las noticias que están en pantalla', a.oy === await enPantalla(), JSON.stringify(a) + ' en pantalla: ' + await enPantalla());
    check('La lista de noticias se pide con la misma consulta (60), no con dos distintas', a.q.length >= 1 && a.q.every(n => n === 60), JSON.stringify(a.q));
    await p.evaluate(() => { closeModal(1); curN = ''; view = 'news'; render() }); await p.waitForTimeout(600);
    const b = await p.evaluate(() => ({ oy: __fbOyentes('nwFb'), c1: (document.querySelector('.nwcnt[data-nwc="n1"]') || {}).textContent, c2: (document.querySelector('.nwcnt[data-nwc="n2"]') || {}).textContent }));
    check('En la lista de noticias cada tarjeta muestra sus reacciones y comentarios', b.c1 === '1 reacción · 2 comentarios' && b.c2 === '1 comentario' && b.oy === 2, JSON.stringify(b));
    await p.evaluate(() => { curN = 'n1'; view = 'news'; render() }); await p.waitForTimeout(600);
    const c = await p.evaluate(() => { const x = document.querySelector('.nwfb[data-nw="n1"]'); return { oy: __fbOyentes('nwFb'), en: x && x.querySelectorAll('.nwcm').length, txt: x && x.innerText } });
    check('La noticia abierta muestra sus 2 comentarios y deja de escuchar las que ya no están en pantalla', c.en === 2 && /Comentarios \(2\)/.test(c.txt) && /Allá estaré/.test(c.txt) && !/Por fin/.test(c.txt) && c.oy === await enPantalla(), JSON.stringify(c));
    await p.evaluate(() => { view = 'home'; render() }); await p.waitForTimeout(600);
    check('Al volver al inicio se quitan las escuchas de las noticias que salieron de la pantalla', await p.evaluate(() => __fbOyentes('nwFb')) === await enPantalla());
    sinErrores(p, 'Noticias livianas'); await p.cerrar();
  },
  async opinionesLivianas() { // v452 opiniones de la comunidad (cmFb) solo de los anuncios en pantalla
    const now = Date.now(), ad = (id, title) => ({ id, ownerKey: 'kZ', pl: 'free', title, text: 'Texto de ' + title, img: '', cat: 'var', ts: now, exp: now + 864e5 });
    const seed = { 'community/c1': ad('c1', 'Vendo bicicleta'), 'community/c2': ad('c2', 'Regalo gatitos'),
      'cmFb/c1_u1': { ad: 'c1', uid: 'u1', name: 'Ana', util: true, txt: 'Muy amable', ts: now }, 'cmFb/c1_u2': { ad: 'c1', uid: 'u2', name: 'Beto', util: false, ts: now },
      'cmFb/c2_u1': { ad: 'c2', uid: 'u1', name: 'Ana', util: true, ts: now } };
    const p = await abrir({ seed });
    const enPantalla = () => p.evaluate(() => new Set([...document.querySelectorAll('.cmfb[data-ad]')].filter(e => !e.closest('.cwz-card')).map(e => e.dataset.ad)).size);
    check('Al abrir, solo escucha opiniones de los anuncios que están en pantalla', await p.evaluate(() => __fbOyentes('cmFb')) === await enPantalla(), (await p.evaluate(() => __fbOyentes('cmFb'))) + ' / ' + await enPantalla());
    await p.evaluate(() => { closeModal(1); view = 'com'; render() }); await p.waitForTimeout(800);
    const a = await p.evaluate(() => { const x = document.querySelector('.cmfb[data-ad="c1"]'); return { oy: __fbOyentes('cmFb'), txt: x && x.innerText } });
    check('El anuncio muestra sus votos y comentarios', !!a.txt && /Sí\s*1/.test(a.txt) && /No\s*1/.test(a.txt) && /Comentarios \(1\)/.test(a.txt) && a.oy === await enPantalla(), JSON.stringify(a));
    await p.evaluate(() => document.querySelector('.cmfb[data-ad="c1"] [data-fbt]').click()); await p.waitForTimeout(300);
    check('Al abrir los comentarios se ve el de Ana', await p.evaluate(() => /Muy amable/.test(document.querySelector('.cmfb[data-ad="c1"]').innerText)));
    await p.evaluate(() => { view = 'home'; render() }); await p.waitForTimeout(800);
    check('Al salir se quitan las escuchas de los anuncios que ya no están en pantalla', await p.evaluate(() => __fbOyentes('cmFb')) === await enPantalla());
    sinErrores(p, 'Opiniones livianas'); await p.cerrar();
  },
  async negociosEnFila() { // v453 en celular, los negocios del inicio van en fila: logo a la izquierda y datos a la derecha
    const now = Date.now(), LG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    const st = (id, name, x) => Object.assign({ id, name, desc: 'Descripción de ' + name, cat: 'Otros', zone: 'Centro', wa: '3001234567', ownerKey: 'k' + id, pexp: now + 30 * 864e5, products: [], _o: 1 }, x);
    const seed = { 'stores/s1': st('s1', 'Heladería Artesanal Gelatier', { logo: LG, cover: 'img/cat-hogar.webp', _o: 3 }), 'stores/s2': st('s2', 'Ferretería El Tornillo', { logo: LG, _o: 2 }), 'stores/s3': st('s3', 'Panadería del Parque', { _o: 1 }) };
    const medir = pg => pg.evaluate(() => [...document.querySelectorAll('.hsc')].filter(c => c.querySelector('.hsci') && c.offsetParent).map(c => { const r = e => e.getBoundingClientRect(), a = r(c.querySelector('.hsci')), b = r(c.querySelector('.hscbd')), w = c.querySelector('.hscw'), v = c.querySelector('.hscv');
      const vis = [...c.querySelectorAll('.hsci img')].filter(i => getComputedStyle(i).display !== 'none').map(i => (i.className || '').replace(/\bld\b/, '').trim() || 'portada');
      return { n: c.querySelector('.hsct').textContent, lado: b.left >= a.right - 1 && Math.abs(a.top - b.top) < 30, ancho: Math.round(a.width), vis, botones: !!v && v.getBoundingClientRect().right <= c.getBoundingClientRect().right + 1 && (!w || w.offsetHeight > 30) } }));
    let p = await abrir({ seed });
    await p.evaluate(() => { closeModal(1); window.qhInicioCompleto = true; render(); /* v455: vuelven las pestañas */ const t = [...document.querySelectorAll('.hswt button,.hswt [role=tab]')].find(x => /Tiendas/.test(x.textContent)); if (t) t.click() }); await p.waitForTimeout(600);
    const r = await medir(p);
    check('Celular: cada negocio en una fila, con el cuadro del logo a la izquierda y los datos a la derecha', r.length >= 3 && r.every(x => x.lado && x.ancho >= 100 && x.ancho <= 125 && x.botones), JSON.stringify(r));
    const g = r.find(x => /Gelatier/.test(x.n)), f = r.find(x => /Tornillo/.test(x.n));
    check('Con logo y portada se ve solo el logo; con solo logo, el logo', !!g && g.vis.join() === 'hscLb' && !!f && f.vis.join() === 'hscL', JSON.stringify({ g, f }));
    check('Celular: nada se sale de la pantalla a los lados', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    sinErrores(p, 'Negocios en fila'); await p.cerrar();
    p = await abrir({ seed, ancho: 1280, alto: 800 });
    await p.evaluate(() => { closeModal(1); window.qhInicioCompleto = true; render(); /* v455: vuelven las pestañas */ const t = [...document.querySelectorAll('.hswt button,.hswt [role=tab]')].find(x => /Tiendas/.test(x.textContent)); if (t) t.click() }); await p.waitForTimeout(600);
    check('Computador: las tarjetas de negocio del inicio no cambian (foto arriba)', await p.evaluate(() => { const c = [...document.querySelectorAll('.hsc')].find(x => x.querySelector('.hsci') && x.offsetParent); return !!c && getComputedStyle(c).display !== 'grid' && c.querySelector('.hscbd').getBoundingClientRect().top >= c.querySelector('.hsci').getBoundingClientRect().bottom - 1 }));
    await p.cerrar();
  },
  async inicioSoloReciente() { // v455 la página principal queda solo con «Lo más reciente» y el botón «Ver el muro»
    const now = Date.now(), seed = { 'stores/s1': { id: 's1', name: 'Heladería Gelatier', desc: 'Helados', cat: 'Otros', zone: 'Centro', wa: '3001234567', ownerKey: 'k1', pexp: now + 30 * 864e5, products: [], ts: now - 60e3, _o: 1 } };
    const p = await abrir({ seed });
    await p.evaluate(() => closeModal(1)); await p.waitForTimeout(200);
    const a = await p.evaluate(() => { const s = document.querySelector('#app section.hsw'); return { tabs: [...s.querySelectorAll('.hswt button')].map(b => b.textContent.trim()), panes: s.querySelectorAll('.hswp>.hswc').length, flechas: s.querySelectorAll('.plar').length, aviso: s.querySelectorAll('.hswh').length, categorias: s.querySelectorAll('.hswm').length /* v456 */, tienda: /Heladería Gelatier/.test(s.innerText) } });
    check('El inicio queda solo con «Lo más reciente» y al lado «Ver el muro» (sin «Ver por categorías»)', a.tabs.length === 2 && /Lo más reciente/.test(a.tabs[0]) && /Ver el muro/.test(a.tabs[1]) && a.panes === 1 && !a.flechas && !a.aviso && !a.categorias, JSON.stringify(a));
    check('«Lo más reciente» sigue mostrando las publicaciones', a.tienda, JSON.stringify(a));
    await p.evaluate(() => { view = 'serv'; render() }); await p.waitForTimeout(200); await p.evaluate(() => { view = 'home'; render() }); await p.waitForTimeout(300);
    check('Al volver al inicio sigue igual (sin las pestañas de categorías)', await p.evaluate(() => document.querySelectorAll('#app section.hsw .hswt button').length === 2));
    check('v467: «Ver el muro» tiene el mismo ícono del Muro de la barra de abajo', await p.evaluate(() => { const a = document.querySelector('.v455m svg'), b = document.querySelector('#bnav [data-v="com"] svg'); return !!a && !!b && a.querySelectorAll('rect').length === 2 && a.innerHTML.replace(/\s/g, '') === b.innerHTML.replace(/\s/g, '') }));
    await p.click('.v455m'); await p.waitForTimeout(600);
    check('«Ver el muro» abre el Muro en «Todo»', await p.evaluate(() => view === 'com' && !!document.querySelector('.mu') && /Todo/.test((document.querySelector('.mutabs [aria-selected="true"],.mutabs [aria-pressed="true"],.mutabs .on') || {}).textContent || '')), await p.evaluate(() => view + ' ' + ((document.querySelector('.mutabs [aria-selected="true"],.mutabs [aria-pressed="true"],.mutabs .on') || {}).textContent || '')));
    sinErrores(p, 'Inicio solo con lo más reciente'); await p.cerrar();
  },
  async estiloRedondeado() { // v457 estilo redondeado (referencia co.addi.com): letras Outfit y Onest, botones en píldora, tarjetas e imágenes redondeadas
    const now = Date.now(), seed = { 'stores/s1': { id: 's1', name: 'Heladería Gelatier', desc: 'Helados', cat: 'Otros', zone: 'Centro', wa: '3001234567', ownerKey: 'k1', pexp: now + 30 * 864e5, products: [], ts: now - 60e3, _o: 1, pays: ['cash'] },
      'products/s1__p1': { id: 'p1', sid: 's1', name: 'Malteada', price: 12000, imgs: [], ownerKey: 'k1', _o: 1 } };
    const p = await abrir({ seed });
    await p.evaluate(() => closeModal(1));
    const r = await p.evaluate(() => { const R = e => e ? parseFloat(getComputedStyle(e).borderTopLeftRadius) : -1, h = [...document.querySelectorAll('#app h2')].find(x => /Qué hay/.test(x.textContent));
      return { buscador: R(document.querySelector('.qw')), titulo: h && getComputedStyle(h).fontFamily, peso: h && getComputedStyle(h).fontWeight, cuerpo: getComputedStyle(document.body).fontFamily, chip: R(document.querySelector('.chip,.hhr')) } });
    check('Inicio: buscador y botones redondeados; título en Onest y texto en Outfit', r.buscador >= 20 && /Onest/.test(r.titulo) && +r.peso < 800 && /Outfit/.test(r.cuerpo), JSON.stringify(r));
    await p.evaluate(() => { view = 'store'; cur = 's1'; render(); scrollTo(0, 0) }); await p.waitForTimeout(400);
    const t = await p.evaluate(() => { const R = e => e ? parseFloat(getComputedStyle(e).borderTopLeftRadius) : -1, b = document.querySelector('#app .btn'); return { btn: R(b), mayus: b && getComputedStyle(b).textTransform, prod: R(document.querySelector('.pgrid .prod')), foto: R(document.querySelector('.pgrid .prod .pic')), ficha: R(document.querySelector('.banner.promo')) } });
    check('Tienda: botones en píldora sin mayúsculas forzadas; producto, foto y ficha redondeados', t.btn >= 20 && t.mayus !== 'uppercase' && t.prod >= 12 && t.foto >= 12 && t.ficha >= 12, JSON.stringify(t));
    sinErrores(p, 'Estilo redondeado'); await p.cerrar();
  },
  async movimientoScroll() { // v457 en el inicio: aparecer al llegar (una vez) y parallax de la foto de publicidad; nada con «reducir movimiento»
    const seed = { 'banners/b1': { id: 'b1', img: 'og-image.png' }, 'stores/s1': { id: 's1', name: 'Tienda', cat: 'Otros', wa: '3001234567', ownerKey: 'k', pexp: Date.now() + 9e9, products: [], _o: 1 } };
    const p = await abrir({ seed });
    await p.evaluate(() => { closeModal(1); scrollTo(0, 0) }); await p.waitForTimeout(300);
    const a = await p.evaluate(() => ({ ocultas: [...document.querySelectorAll('.rv:not(.rv-in)')].length, arriba: [...document.querySelectorAll('.hubhero.rv,.hubg.rv')].length }));
    check('Lo que está más abajo espera para aparecer; lo de arriba sale de una vez', a.ocultas >= 1 && a.arriba === 0, JSON.stringify(a));
    await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(500); await p.evaluate(() => scrollTo(0, 600)); await p.waitForTimeout(900);
    const b = await p.evaluate(() => ({ ocultas: [...document.querySelectorAll('.rv:not(.rv-in)')].length, foto: (document.querySelector('.bns img') || {}).style && document.querySelector('.bns img').style.transform }));
    check('Al bajar, todo aparece y la foto de publicidad se desplaza (parallax)', b.ocultas === 0 && /translate3d/.test(b.foto || ''), JSON.stringify(b));
    await p.evaluate(() => { view = 'serv'; render() }); await p.waitForTimeout(200); await p.evaluate(() => { view = 'home'; render(); scrollTo(0, 0) }); await p.waitForTimeout(400);
    check('Al volver al inicio no se repite la entrada', await p.evaluate(() => document.querySelectorAll('.rv:not(.rv-in)').length === 0));
    sinErrores(p, 'Movimiento al hacer scroll'); await p.cerrar();
    const q = await abrir({ seed });
    await q.emulateMedia({ reducedMotion: 'reduce' }); await q.reload(); await q.waitForTimeout(2500); await q.evaluate(() => { closeModal(1); scrollTo(0, 800) }); await q.waitForTimeout(600);
    check('Con «reducir movimiento» no se oculta ni se mueve nada', await q.evaluate(() => !document.querySelector('.rv') && !(document.querySelector('.bns img') || { style: {} }).style.transform));
    await q.cerrar();
  },
  async telefonoFicha() { // v458 la ficha de la tienda muestra el teléfono principal (el de WhatsApp), que se puede tocar para llamar
    const seed = { 'stores/s1': { id: 's1', name: 'Acabados Pradera', desc: 'Ferretería', cat: 'Otros', zone: 'San José', addr: 'Calle 9 Cra 11', wa: '3001234567', wa2: '6022671234', ownerKey: 'k1', pexp: Date.now() + 30 * 864e5, products: [], _o: 1, pays: ['cash'] } };
    const p = await abrir({ seed });
    await p.evaluate(() => { closeModal(1); view = 'store'; cur = 's1'; render() }); await p.waitForTimeout(400);
    const r = await p.evaluate(() => [...document.querySelectorAll('.sinfo .si-r')].map(x => { const a = x.querySelector('a.si-t'); return { l: x.querySelector('.si-l').textContent.trim(), v: a ? a.textContent : '', h: a ? a.getAttribute('href') : '' } }));
    const tel = r.find(x => x.l === 'Teléfono'), otro = r.findIndex(x => x.l === 'Otro teléfono');
    check('La ficha muestra «Teléfono» con el número del negocio, para llamar', !!tel && tel.v === '300 123 4567' && tel.h === 'tel:+573001234567', JSON.stringify(r));
    check('«Teléfono» va antes de «Otro teléfono»', r.findIndex(x => x.l === 'Teléfono') >= 0 && otro > r.findIndex(x => x.l === 'Teléfono'), JSON.stringify(r.map(x => x.l)));
    sinErrores(p, 'Teléfono en la ficha'); await p.cerrar();
  },
  async serviciosVivienda() { // v459 arriendo: servicios con los que cuenta la vivienda, aparte de los que ya están pagos en el arriendo
    const seed = { 'ads/a1': { id: 'a1', type: 'arr', title: 'Casa de 2 habitaciones', price: 450000, zone: 'Centro', desc: 'Cerca del parque', imgs: [], owner: 'Marta', ownerKey: 'kb', ts: Date.now(), f: { ptype: 'Casa', svc: ['Agua', 'Energía', 'Gas natural', 'Internet'], inc: ['Agua'] } } };
    const p = await abrir({ seed });
    const f = await p.evaluate(() => { const F = ADT.arr.F, i = F.findIndex(x => x.k === 'svc'), j = F.findIndex(x => x.k === 'inc'), d = document.createElement('div'); d.innerHTML = fieldHTML(F[i], []);
      return { i, j, op: [...d.querySelectorAll('input[type=checkbox]')].map(x => x.value), l: F[i].l, li: F[j].l } });
    check('El formulario de arriendo pregunta qué servicios tiene la vivienda (agua, energía, gas natural, internet)', f.i >= 0 && f.op.join() === 'Agua,Energía,Gas natural,Internet' && /cuenta la vivienda/.test(f.l), JSON.stringify(f));
    check('El campo de servicios pagos en el arriendo tiene un nombre que no se confunde y va después', f.j === f.i + 1 && /pagos en el valor del arriendo/.test(f.li) && /no los paga aparte/.test(f.li), JSON.stringify(f));
    await p.evaluate(() => { closeModal(1); view = 'ad'; curAd = 'a1'; render() }); await p.waitForTimeout(400);
    const t = await p.evaluate(() => document.getElementById('app').innerText);
    check('El anuncio muestra los servicios que tiene la vivienda y, aparte, los que ya están pagos', /cuenta la vivienda[\s\S]{0,20}Agua, Energía, Gas natural, Internet/.test(t) && /pagos en el valor del arriendo[\s\S]{0,80}Agua/.test(t), t.slice(0, 900));
    // v460: las opciones de «ya están pagos» usan las mismas palabras; un anuncio viejo con «Luz» y «Gas» se lee como «Energía» y «Gas natural»
    const o = await p.evaluate(() => ADT.arr.F.find(x => x.k === 'inc').o.join());
    check('Las dos preguntas usan las mismas palabras (Energía, Gas natural)', o === 'Agua,Energía,Gas natural,Internet,TV por cable', o);
    sinErrores(p, 'Servicios de la vivienda'); await p.cerrar();
    const viejo = { 'ads/a2': { id: 'a2', type: 'arr', title: 'Apartamento', price: 600000, zone: 'Centro', desc: '', imgs: [], owner: 'Luis', ownerKey: 'kc', ts: Date.now(), f: { inc: ['Agua', 'Luz', 'Gas'] } } };
    const q = await abrir({ seed: viejo });
    const r = await q.evaluate(() => { const a = S.ads.find(x => x.id === 'a2'), d = document.createElement('div'); d.innerHTML = fieldHTML(ADT.arr.F.find(x => x.k === 'inc'), a.f.inc); return { inc: a.f.inc.join(), marcadas: [...d.querySelectorAll('input:checked')].map(x => x.value).join() } });
    check('Un anuncio viejo con «Luz» y «Gas» se lee como «Energía» y «Gas natural» y sus casillas siguen marcadas', r.inc === 'Agua,Energía,Gas natural' && r.marcadas === 'Agua,Energía,Gas natural', JSON.stringify(r));
    sinErrores(q, 'Servicios de la vivienda (anuncio viejo)'); await q.cerrar();
  },
  async direccionSinMapa() { // v462 la dirección del negocio y del inmueble sin mapa ni pregunta, con referencia debajo; el código plus solo lo pone el administrador
    const tienda = { id: 's1', name: 'Panadería', cat: 'Otros', wa: '3112223344', ownerKey: 'kA', addr: 'Calle 5 # 3-20', zone: 'Centro', mapfix: true, products: [], _o: 1 };
    const casa = { id: 'a1', type: 'arr', title: 'Casa de 2 habitaciones', price: 450000, zone: 'Centro', desc: '', imgs: [], owner: 'Marta', wa: '3001234567', ownerKey: 'kA', ts: Date.now(), f: { ptype: 'Casa', price: 450000, addr: 'Carrera 10 # 7-45', mapok: 'No lo ubica bien' } };
    const p = await abrir({ seed: { 'stores/s1': tienda, 'ads/a1': casa } }); await conCuenta(p);
    await p.evaluate(() => { closeModal(1); view = 'store'; cur = 's1'; render(); editShop() }); await p.waitForTimeout(600);
    await p.evaluate(() => qhPasos.ver('#x-addr')); await p.waitForTimeout(300);
    const t = await p.evaluate(() => { const vis = x => !!x && !!x.offsetParent; const r = document.getElementById('x-ref'), lb = document.querySelector('label[for="x-ref"]');
      return { mapa: vis(document.getElementById('x-map')) || !!document.querySelector('#x-map iframe'), preg: vis(document.querySelector('label[for="x-mapok"]')) || vis(document.querySelector('.mq')) || [...document.querySelectorAll('#ov p')].some(x => vis(x) && /Mira el mapa/.test(x.textContent)),
        ref: vis(r) && vis(lb) && lb.textContent === 'Referencia de la dirección (opcional)', orden: !!r && document.getElementById('x-addr').compareDocumentPosition(r) & Node.DOCUMENT_POSITION_FOLLOWING } });
    check('Negocio: sin mapa ni pregunta de Google Maps', !t.mapa && !t.preg, JSON.stringify(t));
    check('Negocio: debajo de la dirección va «Referencia de la dirección (opcional)»', t.ref && !!t.orden, JSON.stringify(t));
    await p.fill('#x-ref', 'Frente al parque'); await p.evaluate(() => document.querySelector('[data-act="saveEditShop"]').click()); await p.waitForTimeout(600);
    const s = await p.evaluate(() => { const x = S.stores.find(y => y.id === 's1'); return { ref: x.ref, mapfix: x.mapfix } });
    check('Negocio: guarda la referencia y conserva la respuesta vieja del mapa', s.ref === 'Frente al parque' && s.mapfix === true, JSON.stringify(s));
    await p.evaluate(() => { closeModal(1); view = 'store'; cur = 's1'; render() }); await p.waitForTimeout(400);
    check('Negocio: la ficha muestra la referencia debajo de la dirección', await p.evaluate(() => /Calle 5 # 3-20[\s\S]*Frente al parque/.test((document.querySelector('.sinfo') || {}).innerText || '')));
    await p.evaluate(() => { closeModal(1); adForm('arr', S.ads.find(a => a.id === 'a1')) }); await p.waitForTimeout(600);
    const i = await p.evaluate(() => { const vis = x => !!x && !!x.offsetParent; const r = document.getElementById('af-ref'), w = [...document.querySelectorAll('#adf .fw')].filter(vis), k = w.findIndex(x => x.contains(document.getElementById('af-addr')));
      return { mapa: !!document.getElementById('af-map'), preg: vis(document.getElementById('af-mapok')) || vis(document.querySelector('.mq')), sig: k >= 0 && !!w[k + 1] && w[k + 1].contains(r), lb: ((r && r.closest('.fw').querySelector('label')) || {}).textContent || '' } });
    check('Inmueble: sin mapa ni pregunta de Google Maps', !i.mapa && !i.preg, JSON.stringify(i));
    check('Inmueble: justo debajo de la dirección va «Referencia de la dirección»', i.sig && /Referencia de la dirección/.test(i.lb), JSON.stringify(i));
    await p.fill('#af-ref', 'Casa de reja verde'); await p.evaluate(() => document.querySelector('#ov [data-act="saveAd"]').click()); await p.waitForTimeout(800);
    const a = await p.evaluate(() => { const x = S.ads.find(y => y.id === 'a1'); return { ref: x.f.ref, mapok: x.f.mapok, err: (document.getElementById('err') || {}).textContent || '' } });
    check('Inmueble: guarda la referencia y conserva la respuesta vieja del mapa', a.ref === 'Casa de reja verde' && a.mapok === 'No lo ubica bien', JSON.stringify(a));
    check('Inmueble: el anuncio muestra la referencia', await p.evaluate(() => /Referencia de la dirección[\s\S]{0,20}Casa de reja verde/.test(document.getElementById('app').innerText)));
    sinErrores(p, 'Dirección sin mapa'); await p.cerrar();
    const q = await abrir({ admin: true, seed: { 'stores/s1': Object.assign({}, tienda, { mapfix: false, ref: 'Frente al parque' }), 'stores/s2': { id: 's2', name: 'Droguería', cat: 'Otros', wa: '3112223345', ownerKey: 'kB', addr: 'Calle 7', plus: 'CQ94+H47', lat: 3.42, lng: -76.24, products: [], _o: 2 }, 'ads/a1': Object.assign({}, casa, { f: { addr: 'Carrera 10 # 7-45', ref: 'Casa de reja verde' } }) } });
    await q.evaluate(() => { closeModal(1); at = 'usr'; view = 'admin'; render() }); await q.waitForTimeout(500);
    const g = await q.evaluate(() => [...document.querySelectorAll('.aadp')].map(x => x.innerText).join('\n'));
    check('Administrador: el negocio con dirección y sin código plus sale por ubicar, con su referencia', /Panadería[\s\S]*Referencia: Frente al parque/.test(g) && !/Droguería/.test(g), g.slice(0, 500));
    check('Administrador: el inmueble sin punto sale por ubicar, con su referencia', /Casa de 2 habitaciones[\s\S]*Referencia: Casa de reja verde/.test(g), g.slice(0, 500));
    sinErrores(q, 'Por ubicar (administrador)'); await q.cerrar();
  },
  async adminCorrigeDireccion() { // v463 el administrador corrige la dirección del negocio y del inmueble (por si la escribieron mal)
    const seed = { 'stores/s1': { id: 's1', name: 'Panadería', cat: 'Otros', wa: '3112223344', ownerKey: 'kA', ownerUid: 'uA', addr: 'Calle 5 # 3-20', zone: 'Centro', plus: 'CQ94+H47', lat: 3.42, lng: -76.24, products: [], _o: 1 },
      'ads/a1': { id: 'a1', type: 'arr', title: 'Casa de 2 habitaciones', price: 450000, zone: 'Centro', desc: '', imgs: [], owner: 'Marta', wa: '3001234567', ownerKey: 'kB', ownerUid: 'uB', plus: 'CQ94+H47', lat: 3.42, lng: -76.24, ts: Date.now(), _o: 2, f: { ptype: 'Casa', addr: 'Carerra 10 # 7-45', mapok: 'Sí, lo ubica bien' } } };
    const p = await abrir({ admin: true, seed });
    await p.evaluate(() => { closeModal(1); at = 'ver'; view = 'admin'; render() }); await p.waitForTimeout(500);
    check('Publicaciones: la tienda y el inmueble tienen «Corregir dirección», aunque ya estén ubicados', await p.evaluate(() => /Corregir dirección/.test((document.querySelector('[data-admshop="s1"]') || {}).textContent || '') && /Corregir dirección/.test((document.querySelector('[data-adplus="a1"]') || {}).textContent || '')));
    await p.evaluate(() => document.querySelector('[data-adplus="a1"]').click()); await p.waitForTimeout(400);
    check('Inmueble: la ventana trae la dirección para corregirla', await p.evaluate(() => (document.getElementById('ip-addr') || {}).value === 'Carerra 10 # 7-45' && !!document.getElementById('ip-ref')));
    await p.fill('#ip-addr', 'Carrera 10 # 7-45'); await p.fill('#ip-ref', 'Casa de reja verde'); await p.fill('#ip-plus', '');
    await p.evaluate(() => document.querySelector('[data-adplusok="a1"]').click()); await p.waitForTimeout(600);
    const a = await p.evaluate(async () => { const d = (await firebase.firestore().collection('ads').doc('a1').get()).data(); return { addr: d.f.addr, ref: d.f.ref, plus: d.plus, lat: d.lat, own: d.ownerKey + '/' + d.ownerUid } });
    check('Inmueble: guarda la dirección y la referencia corregidas, conserva el punto y el dueño', a.addr === 'Carrera 10 # 7-45' && a.ref === 'Casa de reja verde' && a.plus === 'CQ94+H47' && a.lat === 3.42 && a.own === 'kB/uB', JSON.stringify(a));
    await p.evaluate(() => { closeModal(1); at = 'ver'; view = 'admin'; render() }); await p.waitForTimeout(400);
    await p.evaluate(() => document.querySelector('[data-admshop="s1"]').click()); await p.waitForTimeout(400);
    await p.fill('#as-addr', 'Calle 5 # 3-22'); await p.fill('#as-ref', 'Frente al parque');
    await p.evaluate(() => document.querySelector('[data-admshopsave="s1"]').click()); await p.waitForTimeout(600);
    const s = await p.evaluate(async () => { const d = (await firebase.firestore().collection('stores').doc('s1').get()).data(); return { addr: d.addr, ref: d.ref, plus: d.plus, own: d.ownerKey + '/' + d.ownerUid } });
    check('Negocio: guarda la dirección y la referencia corregidas y sigue siendo del dueño', s.addr === 'Calle 5 # 3-22' && s.ref === 'Frente al parque' && s.plus === 'CQ94+H47' && s.own === 'kA/uA', JSON.stringify(s));
    sinErrores(p, 'Administrador corrige dirección'); await p.cerrar();
  },
  async subcategoriasTiendas() { // v464 el administrador crea, renombra y elimina subcategorías de tiendas dentro de cada grupo
    const p = await abrir({ admin: true, seed: { 'stores/s1': { id: 's1', name: 'Helados Pradera', cat: 'Otros', wa: '3112223344', ownerKey: 'kA', products: [], _o: 1 } } });
    await p.evaluate(() => { closeModal(1); at = 'cat'; view = 'admin'; render() }); await p.waitForTimeout(500);
    const g = await p.evaluate(() => { const d = [...document.querySelectorAll('.stca details.stg')].find(x => x.dataset.stg === 'Comidas'); return { n: document.querySelectorAll('.stca details.stg').length, com: d ? [...d.querySelectorAll('input[id^="ct-n-"]')].map(i => i.value).join() : '' } });
    check('«Categorías de tiendas» va por grupos, cada uno con sus subcategorías', g.n >= 10 && g.com === 'Restaurantes,Comidas rápidas,Panaderías y pastelerías', JSON.stringify(g));
    const signo = () => p.evaluate(() => getComputedStyle(document.querySelector('.stca details.stg[data-stg="Comidas"] summary i'), '::before').content);
    const cerrado = await signo();
    await p.evaluate(() => { const d = document.querySelector('.stca details.stg[data-stg="Comidas"]'); d.open = true }); await p.waitForTimeout(200);
    const abierto = await signo();
    check('El grupo muestra «+» cerrado y «−» abierto', cerrado === '"+"' && abierto === '"−"', cerrado + ' / ' + abierto);
    await p.fill('.stca details.stg[data-stg="Comidas"] .stadd input', 'Restaurantes'); await p.click('.stca [data-stadd="Comidas"]'); await p.waitForTimeout(300);
    check('No deja crear una subcategoría repetida', await p.evaluate(() => /Ya existe/.test(document.getElementById('err').textContent)));
    check('v475: el aviso sale justo debajo del campo de ese grupo (no solo al final de la lista)', await p.evaluate(() => { const z = document.querySelector('.stca details.stg[data-stg="Comidas"] .stadd + .sterr'); return !!z && /Ya existe/.test(z.textContent) && z.offsetHeight > 0 }));
    await p.fill('.stca details.stg[data-stg="Comidas"] .stadd input', 'Heladerías'); await p.click('.stca [data-stadd="Comidas"]'); await p.waitForTimeout(50);
    // v471: mientras se guarda sale «Guardando…» y no deja hacer otro cambio; se quita cuando el servidor confirma
    const guardando = await p.evaluate(() => { const m = document.querySelector('.stca .stbm'); return !!m && /Guardando «Heladerías»/.test(m.textContent) && document.querySelector('.stca').classList.contains('stbusy') });
    await p.evaluate(() => { const i = document.querySelector('.stca details.stg[data-stg="Belleza"] .stadd input'); i.value = 'Spa' ; document.querySelector('.stca [data-stadd="Belleza"]').dispatchEvent(new MouseEvent('click', { bubbles: true })) }); await p.waitForTimeout(100);
    const bloqueado = await p.evaluate(() => !CATS.some(c => c[0] === 'Spa'));
    await p.waitForFunction(() => !document.querySelector('.stca .stbm'), null, { timeout: 8000 });
    check('v471: mientras se guarda sale «Guardando…», no deja otro cambio y luego se quita', guardando && bloqueado);
    check('v471: la nueva va antes de «Otros» (no mueve el orden de las demás)', await p.evaluate(() => { const i = CATS.findIndex(c => c[0] === 'Heladerías'); return i === CATS.length - 2 && CATS[CATS.length - 1][0] === 'Otros' }));
    const a = await p.evaluate(async () => { const d = document.querySelector('.stca details.stg[data-stg="Comidas"]'), site = (await firebase.firestore().collection('meta').doc('site').get()).data() || {}, cs = (await firebase.firestore().collection('cats').get()).docs.map(x => x.data().a[0]);
      return { grupo: catGroupOf('Heladerías'), abierto: !!d && d.open, enGrupo: !!d && [...d.querySelectorAll('input[id^="ct-n-"]')].some(i => i.value === 'Heladerías'), mapa: (site.catGrp || {})['Heladerías'], cats: cs.includes('Heladerías') } });
    check('«+ Agregar» crea la subcategoría dentro de su grupo y queda guardada', a.grupo === 'Comidas' && a.enGrupo && a.abierto && a.mapa === 'Comidas' && a.cats, JSON.stringify(a));
    const vis = await p.evaluate(() => { const h = document.createElement('div'); h.innerHTML = catGroupedHTML(CATS, c => '<b>' + c[0] + '</b>'); const t = h.innerText; return t.indexOf('Comidas') >= 0 && t.indexOf('Heladerías') > t.indexOf('Comidas') && t.indexOf('Heladerías') < t.indexOf('Belleza') });
    check('En el formulario de la tienda y en «Categorías», la nueva sale bajo «Comidas»', vis);
    await p.evaluate(() => { const i = CATS.findIndex(c => c[0] === 'Heladerías'), n = document.getElementById('ct-n-' + i); n.value = 'Heladerías y postres'; n.dispatchEvent(new Event('input', { bubbles: true })); document.getElementById('ct-s-' + i).click() }); await p.waitForTimeout(300);
    await p.waitForFunction(() => !document.querySelector('.stca .stbm'), null, { timeout: 8000 });
    check('Al cambiarle el nombre sigue en su grupo', await p.evaluate(() => catGroupOf('Heladerías y postres') === 'Comidas' && !CATS.some(c => c[0] === 'Heladerías') && S.site.catGrp['Heladerías y postres'] === 'Comidas' && !('Heladerías' in S.site.catGrp)));
    await p.evaluate(() => { S.stores.find(s => s.id === 's1').cat = 'Heladerías y postres'; const i = CATS.findIndex(c => c[0] === 'Heladerías y postres'); document.querySelector('.stca [data-act="catDel"][data-i="' + i + '"]').click() }); await p.waitForTimeout(300);
    check('«Eliminar» pregunta antes y avisa a dónde pasan sus tiendas', await p.evaluate(() => /¿Eliminar "Heladerías y postres"\?[\s\S]*pasarán a "Otros"/.test((document.getElementById('cfm-t') || {}).textContent || '')));
    await p.click('#cfm-ok'); await p.waitForTimeout(500);
    check('Eliminada: ya no está y su tienda pasa a «Otros»', await p.evaluate(() => !CATS.some(c => c[0] === 'Heladerías y postres') && S.stores.find(s => s.id === 's1').cat === 'Otros'));
    await p.evaluate(() => { const d = document.querySelector('.stca details.stg[data-stg="Belleza"]'); d.open = true }); await p.waitForTimeout(200);
    await p.fill('.stca details.stg[data-stg="Belleza"] .stadd input', 'Spa'); await p.press('.stca details.stg[data-stg="Belleza"] .stadd input', 'Enter');
    await p.waitForFunction(() => !document.querySelector('.stca .stbm'), null, { timeout: 8000 });
    check('v475: «Ir»/Enter del teclado también agrega la subcategoría', await p.evaluate(() => CATS.some(c => c[0] === 'Spa') && catGroupOf('Spa') === 'Belleza'));
    // v476: «Mover a» pasa una subcategoría a otro grupo (también una de fábrica)
    const mover = (n, g) => p.evaluate(([n, g]) => { const i = CATS.findIndex(c => c[0] === n), s = document.querySelector('.stca [data-stmove="' + i + '"]'); s.value = g; s.dispatchEvent(new Event('change', { bubbles: true })) }, [n, g]);
    await mover('Spa', 'Salud'); await p.waitForFunction(() => !document.querySelector('.stca .stbm'), null, { timeout: 8000 });
    const mv = await p.evaluate(async () => { const d = document.querySelector('.stca details.stg[data-stg="Salud"]'), site = (await firebase.firestore().collection('meta').doc('site').get()).data() || {};
      return { grupo: catGroupOf('Spa'), mapa: (site.catGrp || {}).Spa, enSalud: !!d && d.open && [...d.querySelectorAll('input[id^="ct-n-"]')].some(i => i.value === 'Spa'), enBelleza: [...document.querySelectorAll('.stca details.stg[data-stg="Belleza"] input[id^="ct-n-"]')].some(i => i.value === 'Spa') } });
    check('v476: «Mover a» pasa la subcategoría a otro grupo y queda guardado', mv.grupo === 'Salud' && mv.mapa === 'Salud' && mv.enSalud && !mv.enBelleza, JSON.stringify(mv));
    // v481: «Hogar y construcción» ahora se llama «Construcción» y «Hogar y decoración» es un grupo aparte
    const gr = await p.evaluate(() => [...document.querySelectorAll('.stca details.stg')].map(d => d.dataset.stg));
    check('v481: el panel tiene los grupos «Hogar y decoración» y «Construcción», y ya no «Hogar y construcción»', gr.includes('Hogar y decoración') && gr.includes('Construcción') && !gr.includes('Hogar y construcción'), JSON.stringify(gr));
    check('v481: Ferreterías y Cacharrerías están en Construcción; la subcategoría Hogar y decoración, en su grupo', await p.evaluate(() => catGroupOf('Ferreterías') === 'Construcción' && catGroupOf('Cacharrerías y misceláneas') === 'Construcción' && catGroupOf('Hogar y decoración') === 'Hogar y decoración'));
    await mover('Restaurantes', 'Construcción'); await p.waitForFunction(() => !document.querySelector('.stca .stbm'), null, { timeout: 8000 });
    check('v476: también mueve una de fábrica y sus tiendas la siguen', await p.evaluate(() => { S.stores.find(s => s.id === 's1').cat = 'Restaurantes'; return catGroupOf('Restaurantes') === 'Construcción' && S.site.catGrp.Restaurantes === 'Construcción' }));
    check('v476: «Otros» no tiene «Mover a»', await p.evaluate(() => { const i = CATS.findIndex(c => c[0] === 'Otros'); return i >= 0 && !document.querySelector('.stca [data-stmove="' + i + '"]') }));
    sinErrores(p, 'Subcategorías de tiendas'); await p.cerrar();
  },
  async adminEditaAnuncios() { // v465 el administrador edita los anuncios de los usuarios (arriendo, venta, vehículo) sin quitárselos al dueño
    const ts = Date.now() - 5 * 864e5;
    const seed = { 'ads/a1': { id: 'a1', type: 'arr', title: 'Casa de 2 habitaciones', price: 450000, zone: 'Centro', desc: 'Cerca del parque', imgs: [], owner: 'Marta', wa: '3001234567', ownerKey: 'kB', ownerUid: 'uB', ts, _o: 1, f: { ptype: 'Casa', price: 450000, beds: 2, addr: 'Carrera 10 # 7-45' } },
      'stores/s1': { id: 's1', name: 'Panadería', cat: 'Otros', wa: '3112223344', ownerKey: 'kA', ownerUid: 'uA', products: [], _o: 2 } };
    const p = await abrir({ admin: true, seed });
    await p.evaluate(() => { closeModal(1); at = 'ver'; view = 'admin'; render() }); await p.waitForTimeout(500);
    check('Publicaciones: el anuncio y la tienda tienen «Editar»', await p.evaluate(() => !!document.querySelector('[data-admedad="a1"]') && !!document.querySelector('.ci [data-admedit="s1"]')));
    await p.evaluate(() => document.querySelector('[data-admedad="a1"]').click()); await p.waitForTimeout(500);
    check('«Editar» abre el formulario del dueño con sus datos', await p.evaluate(() => /Editar anuncio/.test((document.querySelector('#ov h2') || {}).textContent || '') && (document.getElementById('af-addr') || {}).value === 'Carrera 10 # 7-45' && (document.getElementById('a-owner') || {}).value === 'Marta'));
    await p.evaluate(() => { const set = (id, v) => { const x = document.getElementById(id); x.value = v; x.dispatchEvent(new Event('input', { bubbles: true })) }; set('af-beds', '3'); set('af-desc', 'Cerca del parque, con patio') }); await p.waitForTimeout(100);
    await p.evaluate(() => document.querySelector('#ov [data-act="saveAd"]').click()); await p.waitForTimeout(800);
    const d = await p.evaluate(async () => { const x = (await firebase.firestore().collection('ads').doc('a1').get()).data(); return { beds: x.f.beds, desc: x.desc, own: x.ownerKey + '/' + x.ownerUid, owner: x.owner, wa: x.wa, ts: x.ts, err: (document.getElementById('err') || {}).textContent || '' } });
    check('Guarda el cambio y el anuncio sigue siendo del dueño, con su nombre, WhatsApp y fecha', Number(d.beds) === 3 && d.desc === 'Cerca del parque, con patio' && d.own === 'kB/uB' && d.owner === 'Marta' && d.wa === '3001234567' && d.ts === ts, JSON.stringify(d));
    await p.evaluate(() => { closeModal(1); curAd = 'a1'; view = 'ad'; render() }); await p.waitForTimeout(500);
    check('Dentro del anuncio sale «Editar anuncio (administrador)»', await p.evaluate(() => /administrador/.test((document.querySelector('#app article.adview [data-admedad="a1"]') || {}).textContent || '')));
    await p.evaluate(() => { closeModal(1); at = 'ver'; view = 'admin'; render() }); await p.waitForTimeout(400);
    await p.evaluate(() => document.querySelector('.ci [data-admedit="s1"]').click()); await p.waitForTimeout(500);
    check('«Editar» de la tienda abre la tienda para editarla como su dueño (v441)', await p.evaluate(() => view === 'store' && cur === 's1' && !!document.querySelector('[data-act="editShop"]')));
    sinErrores(p, 'Administrador edita anuncios'); await p.cerrar();
    const q = await abrir({ seed });
    await q.evaluate(() => { closeModal(1); curAd = 'a1'; view = 'ad'; render() }); await q.waitForTimeout(500);
    check('Un visitante no ve el botón del administrador', await q.evaluate(() => !document.querySelector('[data-admedad]')));
    sinErrores(q, 'Anuncio para visitantes'); await q.cerrar();
  },
  async documentacionArriendo() { // v468 «Documentación requerida» del arriendo en una caja de varias líneas, con más espacio
    const docs = 'Fiador con finca raíz\nCertificado laboral\nDepósito de un mes';
    const seed = { 'ads/a1': { id: 'a1', type: 'arr', title: 'Casa de 2 habitaciones', price: 450000, zone: 'Centro', desc: '', imgs: [], owner: 'Marta', wa: '3001234567', ownerKey: 'kA', ts: Date.now(), f: { ptype: 'Casa', docs } } };
    const p = await abrir({ seed }); await conCuenta(p);
    await p.evaluate(() => { closeModal(1); adForm('arr', S.ads.find(a => a.id === 'a1')) }); await p.waitForTimeout(500);
    const c = await p.evaluate(() => { const x = document.getElementById('af-docs'); return { tag: x.tagName, max: x.maxLength, rows: x.rows, val: x.value } });
    check('«Documentación requerida» es una caja de varias líneas de hasta 400 letras', c.tag === 'TEXTAREA' && c.max === 400 && c.rows >= 3 && c.val === docs, JSON.stringify(c));
    await p.evaluate(() => { closeModal(1); curAd = 'a1'; view = 'ad'; render() }); await p.waitForTimeout(400);
    const v = await p.evaluate(() => { const s = [...document.querySelectorAll('.adview .spec > div')].find(d => /Documentación requerida/.test(d.textContent)); const b = s && s.querySelector('b'); return b ? { t: b.innerText, ws: getComputedStyle(b).whiteSpace } : null });
    check('En el anuncio se ve con sus renglones', !!v && v.ws === 'pre-line' && v.t.split('\n').length === 3, JSON.stringify(v));
    sinErrores(p, 'Documentación del arriendo'); await p.cerrar();
  },
  async verificadoTienda() { // v469 «Verificado» sale en la tienda, no en cada producto
    const seed = { 'stores/s1': { id: 's1', name: 'Heladería Gelatier', desc: 'Helados', cat: 'Otros', wa: '3001234567', ownerKey: 'k1', verified: true, pexp: Date.now() + 30 * 864e5, _o: 1, products: [] },
      'products/s1__p1': { id: 'p1', sid: 's1', name: 'Ensalada de frutas', price: 12000, imgs: [], ownerKey: 'k1', _o: 1 }, 'products/s1__p2': { id: 'p2', sid: 's1', name: 'Malteada', price: 9000, imgs: [], ownerKey: 'k1', _o: 2 } };
    const p = await abrir({ seed });
    await p.evaluate(() => { closeModal(1); view = 'store'; cur = 's1'; render() }); await p.waitForTimeout(500);
    const r = await p.evaluate(() => ({ tienda: !!document.querySelector('#app .vfb') && /Vecino verificado/.test(document.querySelector('#app').innerText), prods: document.querySelectorAll('#app .prod').length, enProd: document.querySelectorAll('#app .prod .cver').length }));
    check('La tienda verificada muestra «Verificado» y sus productos no', r.tienda && r.prods === 2 && r.enProd === 0, JSON.stringify(r));
    sinErrores(p, 'Verificado de la tienda'); await p.cerrar();
  },
  async publicacionesPlegables() { // v470 en Publicaciones, «+» muestra los botones de cada tienda o anuncio y «−» los oculta
    const seed = { 'stores/s1': { id: 's1', name: 'Panadería', cat: 'Otros', wa: '3112223344', ownerKey: 'kA', products: [], _o: 1 }, 'stores/s2': { id: 's2', name: 'Droguería', cat: 'Otros', wa: '3112223345', ownerKey: 'kB', products: [], _o: 2 },
      'ads/a1': { id: 'a1', type: 'arr', title: 'Casa de 2 habitaciones', price: 450000, zone: 'Centro', desc: '', imgs: [], owner: 'Marta', wa: '3001234567', ownerKey: 'kC', ts: Date.now(), _o: 3, f: { ptype: 'Casa' } } };
    const p = await abrir({ admin: true, seed });
    await p.evaluate(() => { closeModal(1); at = 'ver'; view = 'admin'; render() }); await p.waitForTimeout(500);
    const fila = id => `#app .ci.adm:has([data-id="${id}"])`;
    const ver = id => p.evaluate(s => { const r = document.querySelector(s), t = r.querySelector('.v470t'); return { t: getComputedStyle(t, '::before').content, abierto: t.getAttribute('aria-expanded'), botones: !!r.querySelector('.row').offsetParent } }, fila(id));
    const a = await ver('s1');
    check('Cada publicación muestra solo su nombre y «+»; los botones están ocultos', a.t === '"+"' && a.abierto === 'false' && !a.botones && await p.evaluate(() => document.querySelectorAll('#app .ci.adm .v470t').length === 3), JSON.stringify(a));
    await p.click(fila('s1') + ' .v470t'); await p.waitForTimeout(200);
    const b = await ver('s1'), c = await ver('s2');
    check('«+» muestra los botones de esa tienda (no los de las demás) y pasa a «−»', b.t === '"−"' && b.abierto === 'true' && b.botones && !c.botones, JSON.stringify([b, c]));
    await p.click(fila('s1') + ' [data-act="admFeat"]'); await p.waitForTimeout(600);
    check('Sigue abierta después de tocar «Destacar»', (await ver('s1')).botones && await p.evaluate(() => !!S.stores.find(s => s.id === 's1').feat));
    await p.click(fila('s1') + ' .v470t'); await p.waitForTimeout(200);
    check('«−» los vuelve a ocultar', !(await ver('s1')).botones);
    sinErrores(p, 'Publicaciones plegables'); await p.cerrar();
  },
  async muroEnFila() { // v454 en el Muro, negocios, servicios, vehículos, inmuebles y noticias en fila; los clasificados no cambian
    const now = Date.now(), LG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    const seed = { 'stores/s1': { id: 's1', name: 'Heladería Gelatier', desc: 'Helados', cat: 'Otros', zone: 'Centro', wa: '3001234567', ownerKey: 'k1', pexp: now + 30 * 864e5, products: [], logo: LG, ts: now - 60e3, _o: 1 },
      'services/v1': { id: 'v1', name: 'Carlos Pérez', job: 'Plomero', zone: 'Centro', desc: 'Tuberías', wa: '3001112233', ownerKey: 'kv', ts: now - 120e3 },
      'ads/a1': { id: 'a1', type: 'veh', title: 'Moto Yamaha 2020', price: 6500000, zone: 'Centro', desc: 'Al día', imgs: [], owner: 'Luis', ownerKey: 'ka', ts: now - 180e3, f: {} },
      'community/c1': { id: 'c1', ownerKey: 'kZ', pl: 'free', title: 'Vendo bicicleta', text: 'Casi nueva', img: '', cat: 'var', ts: now - 30e3, exp: now + 864e5 } };
    const p = await abrir({ seed });
    await p.evaluate(() => { closeModal(1); view = 'com'; render() }); await p.waitForTimeout(500);
    await p.evaluate(() => { const t = [...document.querySelectorAll('.mutabs button')].find(x => /^\s*Todo\s*$/.test(x.textContent)); if (t) t.click() }); await p.waitForTimeout(600);
    const r = await p.evaluate(() => [...document.querySelectorAll('.mur')].map(c => { const a = c.querySelector('.murf').getBoundingClientRect(), b = c.querySelector('.murb').getBoundingClientRect();
      return { n: c.querySelector('.murn').textContent, lado: b.left >= a.right - 1 && Math.abs(a.top - b.top) < 30, logo: !!c.querySelector('.murf img.murlg'), wa: !!c.querySelector('.murw'), cta: (c.querySelector('.murv') || {}).textContent } }));
    const tienda = r.find(x => /Gelatier/.test(x.n)), serv = r.find(x => /Carlos/.test(x.n)), moto = r.find(x => /Moto Yamaha/.test(x.n));
    check('Muro: negocio, servicio y vehículo van en fila (cuadro a la izquierda, datos a la derecha)', r.length === 3 && r.every(x => x.lado), JSON.stringify(r));
    check('Muro: el negocio muestra su logo, WhatsApp y «Ver tienda»', !!tienda && tienda.logo && tienda.wa && tienda.cta === 'Ver tienda', JSON.stringify(tienda));
    check('Muro: el servicio y el vehículo tienen su botón («Ver servicio», «Ver anuncio») y sin WhatsApp de negocio', !!serv && serv.cta === 'Ver servicio' && !serv.wa && !!moto && moto.cta === 'Ver anuncio', JSON.stringify({ serv, moto }));
    check('Muro: el clasificado sigue como antes (encabezado con nombre arriba, no en fila)', await p.evaluate(() => { const c = [...document.querySelectorAll('article.cmc')].find(x => /Vendo bicicleta/.test(x.textContent)); return !!c && !c.classList.contains('mur') && !!c.querySelector('.cmh') }));
    check('Muro: nada se sale de la pantalla a los lados', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await p.evaluate(() => { const b = [...document.querySelectorAll('.mur .murv')].find(x => x.textContent === 'Ver tienda'); b.click() }); await p.waitForTimeout(500);
    check('Muro: «Ver tienda» abre la tienda', await p.evaluate(() => view === 'store' && cur === 's1'));
    sinErrores(p, 'Muro en fila'); await p.cerrar();
  },
  async enlaceFerreteria() { // v473: botón «Inventario» en Mis tiendas, solo en las tiendas de ferretería
    const p = await abrir({ user: { uid: 'uA', isAnonymous: false, email: 'ana@x.co', emailVerified: true }, ruta: '?panel' }); await conCuenta(p);
    await p.evaluate(() => { S.plan = { k: 'kA', uid: 'uA', plan: 'free', acc: { merc: Date.now() + 30 * 864e5 } };
      S.stores = S.stores.concat([{ id: 'fz', name: 'Ferretería Z', cat: 'Ferreterías', ownerUid: 'uA', ownerKey: 'kA', products: [] },
        { id: 'fv', name: 'Ferretería Vieja', cat: 'Ferretería', ownerUid: 'uA', ownerKey: 'kA', products: [] },
        { id: 'rz', name: 'Restaurante Z', cat: 'Restaurantes', ownerUid: 'uA', ownerKey: 'kA', products: [] },
        { id: 'hz', name: 'Hogar Z', cat: 'Hogar y decoración', ownerUid: 'uA', ownerKey: 'kA', products: [] },
        { id: 'dz', name: 'Droguería Z', cat: 'Droguerías', ownerUid: 'uA', ownerKey: 'kA', products: [] }]);
      S.site = Object.assign({}, S.site, { catGrp: { 'Droguerías': 'Hogar y construcción' } });
      S.mine = ['fz', 'fv', 'rz', 'hz', 'dz']; closeModal(1); render() }); await p.waitForTimeout(600);
    check('En Mi cuenta ya no hay una fila aparte de inventario', await p.evaluate(() => !/Inventario de ferretería/.test(document.body.textContent)));
    await p.evaluate(() => pnlModal('tiendas')); await p.waitForTimeout(500);
    const r = await p.evaluate(() => [...document.querySelectorAll('#ov table.mst tbody tr')].map(tr => { const a = tr.querySelector('.v473-inv'), b = [...tr.querySelectorAll('.msta > *')].map(x => x.textContent.trim());
      return { n: tr.querySelector('td > b').textContent, inv: !!a, href: a && a.getAttribute('href'), tras: a ? b[b.indexOf('Inventario') - 1] : '' } }));
    const z = r.find(x => /Ferretería Z/.test(x.n)), v = r.find(x => /Ferretería Vieja/.test(x.n)), rz = r.find(x => /Restaurante Z/.test(x.n));
    check('Mis tiendas: la ferretería tiene «Inventario», al lado de «Editar»', !!z && z.inv && z.tras === 'Editar', JSON.stringify(r));
    check('El botón abre el inventario de esa tienda (mipradera.com.co/ferreteria?s=…)', !!z && z.href === '/ferreteria?s=fz#inventario', JSON.stringify(z));
    check('Una tienda con el nombre viejo «Ferretería» también lo tiene', !!v && v.inv);
    check('Una tienda que no es de Construcción ni de Hogar y decoración no tiene «Inventario»', !!rz && !rz.inv);
    const hz = r.find(x => /Hogar Z/.test(x.n)), dz = r.find(x => /Droguería Z/.test(x.n));
    check('v481: el grupo Hogar y decoración también tiene «Inventario»', !!hz && hz.inv, JSON.stringify(hz));
    check('v477/v481: una subcategoría que el administrador movió al grupo viejo «Hogar y construcción» sigue con «Inventario» (pasa a Construcción)', !!dz && dz.inv && await p.evaluate(() => catGroupOf('Droguerías') === 'Construcción'), JSON.stringify(dz));
    check('Los demás botones de Mis tiendas siguen (Ver, Compartir, Editar, Eliminar)', await p.evaluate(() => { const tr = document.querySelector('#ov table.mst tbody tr'); return ['Ver', 'Compartir', 'Editar', 'Eliminar'].every(t => [...tr.querySelectorAll('.msta > *')].some(x => x.textContent.trim() === t)) }));
    if (process.env.FOTO_V473) { await p.evaluate(() => document.querySelector('.v473-inv').scrollIntoView({ block: 'center' })); await p.waitForTimeout(300); await p.screenshot({ path: process.env.FOTO_V473 }) }
    sinErrores(p, 'Inventario en Mis tiendas'); await p.cerrar();
  },
  async ferreteriaTienda() { // v474: la tienda de una ferretería en Mi Pradera lleva los colores de ferretería; los productos los manda el inventario
    const now = Date.now();
    const seed = { 'stores/fz': { id: 'fz', name: 'Ferretería Z', cat: 'Ferreterías', wa: '3001234567', ownerUid: 'uA', ownerKey: 'kA', pexp: now + 30 * 864e5, ferTema: 'azul', products: [], _o: 1 },
      'products/fz__p1': { id: 'p1', sid: 'fz', name: 'Martillo', price: 18000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 1 },
      'products/fz__p2': { id: 'p2', sid: 'fz', name: 'Cinta aislante', price: 3000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, out: true, _o: 2 },
      'stores/rz': { id: 'rz', name: 'Restaurante Z', cat: 'Restaurantes', wa: '3001234567', ownerUid: 'uB', ownerKey: 'kB', pexp: now + 30 * 864e5, products: [], _o: 2 },
      'products/rz__q1': { id: 'q1', sid: 'rz', name: 'Almuerzo', price: 15000, imgs: [], ownerKey: 'kB', _o: 1 },
      'stores/cz': { id: 'cz', name: 'Cacharrería Z', cat: 'Cacharrerías y misceláneas', wa: '3001234567', ownerUid: 'uC', ownerKey: 'kC', pexp: now + 30 * 864e5, products: [], _o: 3 },
      'products/cz__c1': { id: 'c1', sid: 'cz', name: 'Ollas', price: 20000, imgs: [], ownerKey: 'kC', _o: 1 } };
    const p = await abrir({ seed, ruta: '?tienda=ferreteria-z-fz' }); await p.waitForTimeout(500);
    const vis = await p.evaluate(() => { const m = document.querySelector('.qhfer-m'), pl = document.querySelector('.pgrid .prod .plus'); return { view, cur, t: m && m.dataset.t, mia: !!(m && m.dataset.mia), fondo: pl && getComputedStyle(pl).backgroundColor, tablero: getComputedStyle(document.querySelector('.sname')).backgroundColor, aviso: !!document.querySelector('.qhfer-av'), agotado: /Agotado/.test(document.querySelector('.pgrid').textContent) } });
    check('Visitante: la ferretería se ve con su color (azul) en el letrero y «Agregar al carrito»', vis.view === 'store' && vis.t === 'azul' && vis.tablero === 'rgb(37, 99, 176)' && vis.fondo === 'rgb(255, 176, 0)', JSON.stringify(vis));
    check('Visitante: no ve el aviso del inventario', !vis.aviso && !vis.mia);
    check('Un producto agotado en el inventario sale «Agotado»', vis.agotado);
    await p.evaluate(() => { cur = 'cz'; render() }); await p.waitForTimeout(300);
    check('v477: una tienda de Cacharrerías (Construcción) también lleva los colores', await p.evaluate(() => view === 'store' && !!document.querySelector('.qhfer-m')));
    await p.evaluate(() => { cur = 'rz'; render() }); await p.waitForTimeout(300);
    check('Una tienda que no es ferretería no cambia de colores', await p.evaluate(() => view === 'store' && !document.querySelector('.qhfer-m') && getComputedStyle(document.querySelector('.sname')).backgroundColor !== 'rgb(37, 99, 176)'));
    sinErrores(p, 'Ferretería: visitante'); await p.cerrar();
    const q = await abrir({ user: { uid: 'uA', isAnonymous: false, email: 'ana@x.co', emailVerified: true }, seed, ruta: '?tienda=ferreteria-z-fz' }); await conCuenta(q);
    await q.evaluate(() => { S.mine = ['fz']; render() }); await q.waitForTimeout(400);
    const due = await q.evaluate(() => { const v = s => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== 'none' }, a = document.querySelector('.qhfer-av a');
      return { mia: !!document.querySelector('.qhfer-m[data-mia]'), aviso: v('.qhfer-av'), href: a && a.getAttribute('href'), add: v('[data-act="addProd"]'), lista: v('[data-lpv="open"]'), cats: v('[data-act="mcats"]'), editar: v('.prod [data-act="editProd"]'), quitar: v('.prod [data-act="delProd"]'), habia: !!document.querySelector('[data-act="addProd"]') } });
    check('Dueño: sale el aviso con «Abrir inventario» de esa tienda', due.mia && due.aviso && due.href === '/ferreteria?s=fz#inventario', JSON.stringify(due));
    check('Dueño: se esconden «+ Producto», «Lista de productos», «Categorías» y editar o quitar productos', due.habia && !due.add && !due.lista && !due.cats && !due.editar && !due.quitar, JSON.stringify(due));
    if (process.env.FOTO_V474) { await q.evaluate(() => document.querySelector('.qhfer-av').scrollIntoView({ block: 'center' })); await q.waitForTimeout(300); await q.screenshot({ path: process.env.FOTO_V474 }) }
    sinErrores(q, 'Ferretería: dueño'); await q.cerrar();
  },
  async muebleriaTienda() { // v478: la tienda de una mueblería lleva su propio diseño (azul marino, Roboto, etiqueta de descuento) y el inventario
    const now = Date.now();
    const seed = { 'meta/site': { catGrp: { 'Mueblerías': 'Hogar y construcción' } }, 'cats/mueblerias': { id: 'mueblerias', a: ['Mueblerías', '', '#9A3412'], _o: 3.5 },
      'stores/mz': { id: 'mz', name: 'Muebles Z', cat: 'Mueblerías', wa: '3001234567', ownerUid: 'uA', ownerKey: 'kA', pexp: now + 30 * 864e5, ferTema: 'naranja', products: [], _o: 1 },
      'products/mz__p1': { id: 'p1', sid: 'mz', name: 'Sofá 3 puestos', price: 1290000, old: 2190000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 1, ferCat: 'Sofás' },
      'products/mz__p2': { id: 'p2', sid: 'mz', name: 'Colchón 140 x 190', price: 899000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 2, ferCat: 'Colchones de una cara' },
      'products/mz__p3': { id: 'p3', sid: 'mz', name: 'Sofá cama', price: 990000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 3, ferCat: 'Sofá camas' },
      'products/mz__m1': { id: 'm1', sid: 'mz', name: 'Colchón Orthopack (Sencillo 100 x 190)', price: 983000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 4, ferCat: 'Colchones de una cara', ferM: 'Sencillo 100 x 190', ferG: 'colchon-orthopack|colchones-de-una-cara' },
      'products/mz__m2': { id: 'm2', sid: 'mz', name: 'Colchón Orthopack (Doble 140 x 190)', price: 1311000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 5, ferCat: 'Colchones de una cara', ferM: 'Doble 140 x 190', ferG: 'colchon-orthopack|colchones-de-una-cara' },
      'products/mz__m3': { id: 'm3', sid: 'mz', name: 'Colchón Orthopack (King 200 x 200)', price: 1990000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, out: true, _o: 6, ferCat: 'Colchones de una cara', ferM: 'King 200 x 200', ferG: 'colchon-orthopack|colchones-de-una-cara' },
      'stores/fz': { id: 'fz', name: 'Ferretería Z', cat: 'Ferreterías', wa: '3001234567', ownerUid: 'uB', ownerKey: 'kB', pexp: now + 30 * 864e5, products: [], _o: 2 },
      'products/fz__q1': { id: 'q1', sid: 'fz', name: 'Martillo', price: 18000, imgs: [], ownerKey: 'kB', _o: 1 } };
    const p = await abrir({ seed, ruta: '?tienda=muebles-z-mz' }); await p.waitForTimeout(700);
    const v = await p.evaluate(() => { const pl = document.querySelector('.pgrid .prod .plus'), off = document.querySelector('.pgrid .prod .qhmue-off');
      return { view, mue: !!document.querySelector('.qhmue-m'), fer: !!document.querySelector('.qhfer-m'), boton: pl && getComputedStyle(pl).backgroundColor, letra: getComputedStyle(document.querySelector('.pgrid .prod h3')).fontFamily, off: off && off.textContent, offs: document.querySelectorAll('.qhmue-off').length } });
    check('Mueblería: lleva su diseño y no el de ferretería', v.view === 'store' && v.mue && !v.fer, JSON.stringify(v));
    check('v481: «Mueblerías» guardada en el grupo viejo «Hogar y construcción» queda en «Hogar y decoración»', await p.evaluate(() => catGroupOf('Mueblerías') === 'Hogar y decoración'));
    check('Mueblería: «Agregar al carrito» azul marino y letra Roboto', v.boton === 'rgb(16, 63, 141)' && /RobotoMP/.test(v.letra), JSON.stringify(v));
    check('Mueblería: el producto con precio anterior lleva la etiqueta «-41%» (solo ese)', v.off === '-41%' && v.offs === 1, JSON.stringify(v));
    // v479: menú de categorías de mueblería
    const m1 = await p.evaluate(() => [...document.querySelectorAll('.qmu-h .qmu-hn')].map(x => x.textContent));
    check('v479: el menú muestra solo las categorías con productos (Colchones y Salas)', m1.join() === 'Colchones,Salas', JSON.stringify(m1));
    await p.click('[data-qmu-cat="Salas"]'); await p.waitForTimeout(200);
    const subs = await p.evaluate(() => [...document.querySelectorAll('.qmu-s span')].map(x => x.textContent));
    check('v479: al abrir Salas salen sus subcategorías con productos y «Ver todo en Salas»', subs.join() === 'Sofás,Sofá camas' && await p.isVisible('[data-qmu-todo="Salas"]'), JSON.stringify(subs));
    await p.click('[data-qmu-sub="Sofás"]'); await p.waitForTimeout(300);
    const f1 = await p.evaluate(() => ({ vis: [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none').map(x => x.querySelector('h3').textContent.trim()), barra: (document.querySelector('.qmu-fx span') || {}).textContent }));
    check('v479: tocar «Sofás» muestra solo los sofás, con la barra «Sofás: 1 producto»', f1.vis.length === 1 && /Sofá 3 puestos/.test(f1.vis[0]) && f1.barra === 'Sofás: 1 producto', JSON.stringify(f1));
    await p.click('[data-qmu-todo="Salas"]'); await p.waitForTimeout(300);
    check('v479: «Ver todo en Salas» muestra los dos productos de Salas', await p.evaluate(() => [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none').length === 2));
    await p.click('[data-qmu-todos]'); await p.waitForTimeout(300);
    check('v479: «Ver todos los productos» quita el filtro', await p.evaluate(() => [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none').length === 4 && !document.querySelector('.qmu-fx')));
    // v480: las medidas del mismo modelo en una tarjeta con el selector
    const vis = () => p.evaluate(() => [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none'));
    const md = await p.evaluate(() => { const c = [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none' && x.querySelector('.qmu-med')); return { n: c.length, tit: c[0] && c[0].querySelector('h3').textContent.trim(), precio: c[0] && c[0].querySelector('.price').textContent.replace(/\s/g, ''), opts: c[0] ? [...c[0].querySelectorAll('.qmu-med option')].map(o => o.textContent) : [] } });
    check('v480: las 3 medidas del colchón salen en UNA tarjeta, con el nombre sin medida y la primera medida', md.n === 1 && md.tit === 'Colchón Orthopack' && md.precio === '$983.000', JSON.stringify(md));
    check('v480: el selector lista las medidas en orden y marca la agotada', md.opts.join('/') === '100 x 190 | Sencillo/140 x 190 | Doble/200 x 200 | King (agotado)', JSON.stringify(md.opts));
    await p.evaluate(() => { const s = document.querySelector('.qmu-med select'); s.value = 'Doble 140 x 190'; s.dispatchEvent(new Event('change', { bubbles: true })) }); await p.waitForTimeout(300);
    const md2 = await p.evaluate(() => { const c = [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none' && x.querySelector('.qmu-med'))[0]; c.querySelector('.plus').click(); return { precio: c.querySelector('.price').textContent.replace(/\s/g, ''), carrito: Object.keys(S.cart) } });
    check('v480: al elegir 140 x 190 cambia el precio y el carrito lleva esa medida', md2.precio === '$1.311.000' && md2.carrito.some(k => k.startsWith('mz|m2')), JSON.stringify(md2));
    check('v480: el filtro cuenta el colchón una sola vez', await p.evaluate(() => { document.querySelector('[data-qmu-cat="Colchones"]').click(); return true }) && await (async () => { await p.waitForTimeout(200); await p.click('[data-qmu-todo="Colchones"]'); await p.waitForTimeout(300); return p.evaluate(() => document.querySelector('.qmu-fx span').textContent === 'Colchones: 2 productos') })());
    await p.click('[data-qmu-todos]'); await p.waitForTimeout(200);
    await p.evaluate(() => { cur = 'fz'; render() }); await p.waitForTimeout(400);
    check('Una ferretería sigue con su diseño de ferretería y sin etiquetas de mueblería', await p.evaluate(() => !!document.querySelector('.qhfer-m') && !document.querySelector('.qhmue-m') && !document.querySelector('.qhmue-off')));
    sinErrores(p, 'Mueblería: visitante'); await p.cerrar();
    const q = await abrir({ user: { uid: 'uA', isAnonymous: false, email: 'ana@x.co', emailVerified: true }, seed, ruta: '?tienda=muebles-z-mz' }); await conCuenta(q);
    await q.evaluate(() => { S.mine = ['mz']; render() }); await q.waitForTimeout(500);
    const d = await q.evaluate(() => { const vis = s => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== 'none' };
      return { aviso: vis('.qhfer-av'), mia: !!document.querySelector('.qhmue-m[data-mia]'), add: vis('[data-act="addProd"]'), habia: !!document.querySelector('[data-act="addProd"]'), href: (document.querySelector('.qhfer-av a') || {}).getAttribute && document.querySelector('.qhfer-av a').getAttribute('href') } });
    check('Mueblería: el dueño ve «Abrir inventario» y no los botones de productos', d.aviso && d.mia && d.habia && !d.add && d.href === '/muebleria?s=mz#inventario', JSON.stringify(d));
    await q.evaluate(() => pnlModal('tiendas')); await q.waitForTimeout(400);
    check('Mueblería: en Mis tiendas tiene «Inventario» y lleva al inventario de mueblería (v482)', await q.evaluate(() => { const a = document.querySelector('#ov .v473-inv[data-v473="mz"]'); return !!a && a.getAttribute('href') === '/muebleria?s=mz#inventario' }));
    if (process.env.FOTO_V478) { await q.evaluate(() => { closeModal(1); render() }); await q.waitForTimeout(400); await q.screenshot({ path: process.env.FOTO_V478 }) }
    sinErrores(q, 'Mueblería: dueño'); await q.cerrar();
  },
  async muebleriaColores() { // v482: el inventario de mueblería publica cada medida y color; la tarjeta tiene selector de medida y de color, y «Por encargo»
    const now = Date.now(), P = (id, m, c, price, extra) => ({ id, sid: 'mz', name: 'Sofá Milán' + (m ? ' (' + m + ')' : '') + ' · ' + c, price, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 1, ferCat: 'Sofás', ferM: m, ferC: c, ferN: 'Sofá Milán', ferG: 'sm1', ...extra });
    const seed = { 'meta/site': { catGrp: { 'Mueblerías': 'Hogar y decoración' } }, 'cats/mueblerias': { id: 'mueblerias', a: ['Mueblerías', '', '#9A3412'], _o: 3.5 },
      'stores/mz': { id: 'mz', name: 'Muebles Z', cat: 'Mueblerías', wa: '3001234567', ownerUid: 'uA', ownerKey: 'kA', pexp: now + 30 * 864e5, products: [], _o: 1 },
      'products/mz__sm1-2-puestos-gris': P('sm1-2-puestos-gris', '2 puestos', 'Gris', 990000),
      'products/mz__sm1-2-puestos-beige': P('sm1-2-puestos-beige', '2 puestos', 'Beige', 990000, { out: true }),
      'products/mz__sm1-3-puestos-gris': P('sm1-3-puestos-gris', '3 puestos', 'Gris', 1290000),
      'products/mz__sm1-3-puestos-beige': P('sm1-3-puestos-beige', '3 puestos', 'Beige', 1350000),
      'products/mz__t1-m': { id: 't1-m', sid: 'mz', name: 'Tapete Nube (Tapete Mediano 120 x 170)', price: 390000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 3, ferCat: 'Tapetes', ferM: 'Tapete Mediano 120 x 170', ferN: 'Tapete Nube', ferG: 't1' },
      'products/mz__t1-p': { id: 't1-p', sid: 'mz', name: 'Tapete Nube (Tapete Pequeño 80 x 150)', price: 190000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 4, ferCat: 'Tapetes', ferM: 'Tapete Pequeño 80 x 150', ferN: 'Tapete Nube', ferG: 't1' },
      'products/mz__a1-4': { id: 'a1-4', sid: 'mz', name: 'Almohada Visco (Pack | 4 Unidades)', price: 150000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 5, ferCat: 'Almohadas', ferM: 'Pack | 4 Unidades', ferN: 'Almohada Visco', ferG: 'a1' },
      'products/mz__a1-1': { id: 'a1-1', sid: 'mz', name: 'Almohada Visco (Unidad | 1 Unidad)', price: 45000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 6, ferCat: 'Almohadas', ferM: 'Unidad | 1 Unidad', ferN: 'Almohada Visco', ferG: 'a1' },
      'products/mz__c1': { id: 'c1', sid: 'mz', name: 'Comedor Roble', price: 2100000, imgs: [], ownerKey: 'kA', ownerUid: 'uA', fer: 1, _o: 2, ferCat: 'Comedores de 4 puestos', ferN: 'Comedor Roble', ferE: 20 } };
    const p = await abrir({ seed, ruta: '?tienda=muebles-z-mz' }); await p.waitForTimeout(700);
    const tarj = () => p.evaluate(() => { const c = [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none' && x.querySelector('.qmu-sel'))[0];
      return c ? { n: [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none').length, tit: c.querySelector('h3').textContent.trim(), precio: c.querySelector('.price').textContent.replace(/\s/g, ''),
        med: [...c.querySelectorAll('select[data-qmu-d="m"] option')].map(o => o.textContent), col: [...c.querySelectorAll('select[data-qmu-d="c"] option')].map(o => o.textContent), cm: (c.querySelector('select[data-qmu-d="m"]') || {}).value, cc: (c.querySelector('select[data-qmu-d="c"]') || {}).value } : null });
    const t1 = await tarj();
    check('v482: las 4 combinaciones del sofá salen en UNA tarjeta, con el nombre sin medida ni color', !!t1 && t1.n === 4 && t1.tit === 'Sofá Milán' && t1.precio === '$990.000', JSON.stringify(t1));
    check('v482: selector de medida («3 puestos» sin voltear) y de color, con la combinación agotada marcada', !!t1 && t1.med.join('/') === '2 puestos/3 puestos' && t1.col.join('/') === 'Gris/Beige (agotado)' && t1.cm === '2 puestos' && t1.cc === 'Gris', JSON.stringify(t1));
    const pon = (d, v) => p.evaluate(([d, v]) => { const s = document.querySelector('select[data-qmu-d="' + d + '"]'); s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })) }, [d, v]);
    await pon('m', '3 puestos'); await p.waitForTimeout(300); const t2 = await tarj();
    check('v482: al elegir 3 puestos conserva el color (Gris) y cambia el precio', !!t2 && t2.cm === '3 puestos' && t2.cc === 'Gris' && t2.precio === '$1.290.000' && t2.col.join('/') === 'Gris/Beige', JSON.stringify(t2));
    await pon('c', 'Beige'); await p.waitForTimeout(300); const t3 = await tarj();
    check('v482: al elegir Beige muestra el precio de 3 puestos Beige', !!t3 && t3.cm === '3 puestos' && t3.cc === 'Beige' && t3.precio === '$1.350.000', JSON.stringify(t3));
    const car = await p.evaluate(() => { const c = [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none' && x.querySelector('.qmu-sel'))[0]; c.querySelector('.plus').click(); return Object.keys(S.cart) });
    check('v482: el carrito lleva la combinación elegida', car.some(k => k.startsWith('mz|sm1-3-puestos-beige')), JSON.stringify(car));
    const tp = await p.evaluate(() => { const c = [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none' && /Tapete Nube/.test(x.textContent))[0]; return c ? [...c.querySelectorAll('select[data-qmu-d="m"] option')].map(o => o.textContent) : [] });
    check('v486: el tapete muestra sus medidas como en la tienda de referencia, de la pequeña a la grande', tp.join('/') === '80 x 150 | Tapete Pequeño/120 x 170 | Tapete Mediano', JSON.stringify(tp));
    const al = await p.evaluate(() => { const c = [...document.querySelectorAll('.pgrid .prod')].filter(x => getComputedStyle(x).display !== 'none' && /Almohada Visco/.test(x.textContent))[0]; return c ? [...c.querySelectorAll('select[data-qmu-d="m"] option')].map(o => o.textContent) : [] });
    check('v486: la almohada muestra «Unidad | 1 Unidad» antes que los paquetes', al.join('/') === 'Unidad | 1 Unidad/Pack | 4 Unidades', JSON.stringify(al));
    const en = await p.evaluate(() => [...document.querySelectorAll('.qmu-enc')].map(x => x.textContent));
    check('v482: el comedor por encargo dice «Por encargo · entrega en 20 días»', en.length === 1 && en[0] === 'Por encargo · entrega en 20 días', JSON.stringify(en));
    check('v481: «Mueblerías» en el grupo «Hogar y decoración» sigue siendo mueblería', await p.evaluate(() => !!document.querySelector('.qhmue-m') && window.qhMuebleCat('Mueblerías')));
    if (process.env.FOTO_V482) { await p.evaluate(() => document.querySelector('.qmu-sel').closest('.prod').scrollIntoView({ block: 'center' })); await p.waitForTimeout(300); await p.screenshot({ path: process.env.FOTO_V482 }) }
    sinErrores(p, 'Mueblería: medida y color'); await p.cerrar();
  },
  async anuncioSinFoto() { // v485: los anuncios sin foto muestran un dibujo de muestra según el tipo, con «Imagen de referencia»
    const ad = (id, type, title, f, x) => Object.assign({ id, type, title, price: 450000, zone: 'Centro', desc: '', imgs: [], f, ts: Date.now(), ownerKey: 'kZ', owner: 'Ana' }, x);
    const seed = { 'ads/i1': ad('i1', 'arr', 'Casa de 2 habitaciones', { ptype: 'Casa', beds: 2, baths: 1 }), 'ads/i2': ad('i2', 'arr', 'Apartamento central', { ptype: 'Apartamento' }),
      'ads/i3': ad('i3', 'arr', 'Habitación amoblada', { ptype: 'Habitación' }), 'ads/i4': ad('i4', 'arr', 'Local en esquina', { ptype: 'Local' }),
      'ads/i5': ad('i5', 'arr', 'Con foto', { ptype: 'Casa' }, { imgs: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='] }),
      'ads/v1': ad('v1', 'veh', 'Moto 2020', { vtype: 'Moto' }) };
    const p = await abrir({ seed });
    await p.evaluate(() => { closeModal(1); view = 'arr'; render() }); await p.waitForTimeout(600);
    const L = await p.evaluate(() => [...document.querySelectorAll('[data-act="openAd"]')].map(b => { const n = b.querySelector('.adpic>.nop'), sv = n && n.querySelector('svg'); return { id: b.dataset.id, dib: !!sv, ref: n ? (n.querySelector('small') || {}).textContent : '', img: !!b.querySelector('.adpic>img'), h: sv ? sv.getBoundingClientRect().height : 0 } }));
    const g = id => L.find(x => x.id === id) || {};
    check('v485: los arriendos sin foto muestran un dibujo con «Imagen de referencia», no «Sin foto»', ['i1', 'i2', 'i3', 'i4'].every(id => g(id).dib && g(id).ref === 'Imagen de referencia' && g(id).h > 60) && !/Sin foto\b/.test(await p.evaluate(() => document.querySelector('.adpic').innerText)), JSON.stringify(L));
    check('v485: el anuncio con foto sigue con su foto', g('i5').img && !g('i5').dib);
    const dif = await p.evaluate(() => { const s = id => document.querySelector('[data-act="openAd"][data-id="' + id + '"] svg').innerHTML; return new Set(['i1', 'i2', 'i3', 'i4'].map(s)).size });
    check('v485: casa, apartamento, habitación y local tienen dibujos distintos', dif === 4, String(dif));
    if (process.env.FOTO_V485) { await p.evaluate(() => document.querySelector('[data-act="openAd"]').scrollIntoView({ block: 'start' })); await p.waitForTimeout(300); await p.screenshot({ path: process.env.FOTO_V485 }) }
    await p.evaluate(() => { curAd = 'i1'; view = 'ad'; render() }); await p.waitForTimeout(500);
    const v = await p.evaluate(() => { const n = document.querySelector('.adview .adpic>.nop'); return { dib: !!(n && n.querySelector('svg')), alt: n && n.getAttribute('aria-label') } });
    check('v485: el anuncio abierto también muestra el dibujo', v.dib && /imagen de referencia/.test(v.alt), JSON.stringify(v));
    if (process.env.FOTO_V485B) { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300); await p.screenshot({ path: process.env.FOTO_V485B }) }
    await p.evaluate(() => { view = 'veh'; render() }); await p.waitForTimeout(500);
    check('v485: un vehículo sin foto también tiene su dibujo', await p.evaluate(() => !!document.querySelector('[data-act="openAd"][data-id="v1"] .adpic>.nop svg')));
    sinErrores(p, 'Anuncio sin foto'); await p.cerrar();
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
