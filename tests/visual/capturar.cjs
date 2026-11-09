// Comparación visual: toma ~30 pantallas en modo claro y oscuro y guarda, por pantalla, la foto y los estilos
// calculados de cada elemento (también ::before y ::after). Sirve para reorganizar estilos sin cambiar el diseño:
//   node tests/visual/capturar.cjs <carpeta> [pantalla1,pantalla2]  → guarda las capturas en <carpeta> (todas, o solo esas)
//   node tests/visual/comparar.cjs <antes> <después>  → dice qué pantallas, elementos y propiedades cambiaron
// Usa el mismo Firebase falso de las pruebas (tests/pagina/firebase-falso.js), con datos de ejemplo fijos y el reloj fijo.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..', '..'), FB = fs.readFileSync(path.join(__dirname, '..', 'pagina', 'firebase-falso.js'), 'utf8');
const OUT = path.resolve(process.argv[2] || 'capturas'); fs.mkdirSync(OUT, { recursive: true });
const ADMIN_UID = 'KUowZZ25CePVc9IXGmhCLVbbSIB3', T0 = Date.UTC(2026, 10, 9, 15, 0, 0);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.png': 'image/png', '.webp': 'image/webp', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const IMG = c => 'data:image/svg+xml;base64,' + Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="${c}"/></svg>`).toString('base64');
const SEED = {
  'meta/site': { wa: '3001112233' },
  'stores/s1': { id: 's1', name: 'Panadería La Espiga', cat: 'Panaderías', zone: 'Centro', desc: 'Pan caliente todos los días', wa: '3001234567', ownerKey: 'k1', _o: 1, ts: T0 - 7200e3, cover: IMG('#f59e0b'), logo: IMG('#0b4fa8'), pexp: T0 + 30 * 864e5, pays: ['cash'], products: [{ id: 'p1', name: 'Pan francés', price: 500, imgs: [IMG('#d97706')] }, { id: 'p2', name: 'Torta de chocolate', price: 25000, imgs: [] }] },
  'stores/s2': { id: 's2', name: 'Acabados Pradera', cat: 'Ferreterías', zone: 'San José', desc: 'Almacén de acabados', wa: '3001234568', ownerKey: 'k2', _o: 2, logo: IMG('#16a34a'), products: [] },
  'services/v1': { id: 'v1', name: 'Jorge Plomero', job: 'Plomería', zone: 'Centro', wa: '3001234569', desc: 'Arreglos de tubería', ownerKey: 'k3', _o: 1, ts: T0 - 26 * 36e5 },
  'ads/a1': { id: 'a1', type: 'veh', title: 'Moto AKT 125 2020', price: 3500000, zone: 'Lomitas', imgs: [IMG('#16a34a')], f: { year: '2020', km: '12000' }, ownerKey: 'k4', _o: 1, ts: T0 - 300e3 },
  'ads/a2': { id: 'a2', type: 'arr', title: 'Apartamento 2 habitaciones', price: 800000, zone: 'Centro', imgs: [], f: {}, ownerKey: 'k5', _o: 2, ts: T0 - 4 * 864e5 },
  'community/c1': { id: 'c1', title: 'Vendo nevera usada', cat: 'hog', op: 'venta', price: 450000, zone: 'La Libertad', exp: T0 + 5 * 864e5, ts: T0 - 1800e3, ownerKey: 'k6', owner: 'Luis', wa: '3001234570' },
  'news/n1': { id: 'n1', title: 'Feria de emprendedores este sábado', text: 'Habrá música y comida.', author: 'Mi Pradera', ts: T0 - 50 * 36e5, cat: 'eventos' },
};
const USER = { id: 'd', name: 'Ana Pérez', email: 'ana@x.co', wa: '3155555233', pw: 1, k: 'kA' };
// pantallas: [nombre, ¿admin?, función que prepara la pantalla dentro de la página]
const PANTALLAS = [
  ['inicio', 0, () => {}],
  ['inicio-con-cuenta', 0, u => { roleShown = true; S.user = u; save(); syncUI(); render() }],
  ['tienda', 0, () => { view = 'store'; cur = 's1'; render() }],
  ['producto', 0, () => { location.hash = '#/p/s1__p1' }],
  ['clasificados', 0, () => { document.querySelector('[data-act="tab"][data-v="com"]') ? document.querySelector('[data-act="tab"][data-v="com"]').click() : (view = 'com', render()) }],
  ['mi-cuenta', 0, u => { roleShown = true; S.user = u; save(); syncUI(); [...document.querySelectorAll('#bnav button')].find(x => /Mi cuenta/.test(x.textContent)).click() }],
  ['notificaciones', 0, u => { roleShown = true; S.user = u; save(); syncUI(); nfOpen() }],
  ['registro', 0, () => regForm()],
  ['inicio-sesion', 0, () => loginForm()],
  ['direccion', 0, u => { roleShown = true; S.user = u; save(); adrForm('main') }],
  ['carrito', 0, () => { S.cart = { 's1|p1||': 2, 's1|p2||': 1 }; save(); openCart() }],
  ['anuncio', 0, u => { roleShown = true; S.user = u; save(); comForm() }],
  ['ayuda', 0, u => { roleShown = true; S.user = u; save(); helpOpen() }],
];
['pag', 'rep', 'cod', 'usr', 'sug', 'ver', 'cfg', 'cat', 'srv', 'pub', 'alm', 'emg'].forEach(t => PANTALLAS.push(['admin-' + t, 1, t => { const e = document.querySelector('[data-act="at"][data-v="' + t + '"]'); e && e.click() }, t]));

function serve() { return new Promise(ok => { const s = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, u === '/' ? 'index.html' : u); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end() } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(b) }) }).listen(0, '127.0.0.1', () => ok(s)) }) }

// estilos calculados de todos los elementos visibles (y sus ::before/::after), en orden de documento
function estilos() {
  const out = [], all = document.querySelectorAll('body *');
  const props = n => { const c = getComputedStyle(n.el, n.ps); const o = []; for (let i = 0; i < c.length; i++) { const p = c[i]; if (/^(transition|animation)/.test(p)) continue; o.push(p + ':' + c.getPropertyValue(p)) } return o.join(';') };
  all.forEach((el, i) => {
    if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') return;
    const r = el.getBoundingClientRect(); if (!r.width && !r.height) return;
    const id = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '');
    out.push([i + ' ' + id, props({ el, ps: null }), props({ el, ps: '::before' }), props({ el, ps: '::after' })]);
  });
  return out;
}

(async () => {
  const s = await serve(), base = 'http://127.0.0.1:' + s.address().port, b = await chromium.launch();
  const solo = (process.argv[3] || '').split(',').filter(Boolean); // opcional: solo algunas pantallas, p. ej. inicio,tienda
  for (const dark of [false, true]) for (const [nombre, admin, prep, arg] of PANTALLAS) {
    if (solo.length && !solo.includes(nombre)) continue;
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, colorScheme: dark ? 'dark' : 'light', serviceWorkers: 'block', reducedMotion: 'reduce' });
    await ctx.route(/gstatic\.com\/firebasejs\//, r => r.fulfill({ body: /app-compat/.test(r.request().url()) ? FB : '', contentType: 'application/javascript' }));
    await ctx.route(/google\.com\/recaptcha|workers\.dev|googleapis|firebaseio|accounts\.google|cdnjs|ytimg|fonts\.|maps\./, r => r.fulfill({ status: 500, body: '' }));
    if (admin) await ctx.route(/\/index\.html/, async r => { const res = await r.fetch(); let t = await res.text(); t = t.replace("if(k&&sha256(k)===ADMIN_HASH)return'admin'", "if(k)return'admin'"); r.fulfill({ response: res, body: t }) });
    await ctx.addInitScript(([d, adm, seed, uid]) => { localStorage.setItem('qh_cookies', '1'); if (d) localStorage.setItem('qh_theme', 'dark'); window.__authUser = adm ? { uid, isAnonymous: false, email: 'admin@x.co' } : { uid: 'uA', isAnonymous: false, email: 'ana@x.co' }; window.__seed = seed; Math.random = (() => { let x = 7; return () => (x = (x * 9301 + 49297) % 233280) / 233280 })() }, [dark, admin, SEED, ADMIN_UID]);
    const p = await ctx.newPage(); await p.clock.install({ time: T0 });
    await p.goto(base + '/index.html' + (admin ? '?admin=x' : '')); await p.clock.runFor(3500);
    await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
    await p.evaluate(() => document.querySelectorAll('.qtour,.qhb,#qpop').forEach(x => x.remove()));
    try { await p.evaluate(prep, admin ? arg : USER) } catch (e) { console.log('  (no se pudo preparar ' + nombre + ': ' + e.message.split('\n')[0] + ')') }
    await p.clock.runFor(1500); await p.evaluate(() => { document.querySelectorAll('#qpop').forEach(x => x.remove()); window.scrollTo(0, 0) });
    const tag = nombre + (dark ? '-oscuro' : '-claro');
    await p.screenshot({ path: path.join(OUT, tag + '.png'), fullPage: true });
    fs.writeFileSync(path.join(OUT, tag + '.json'), JSON.stringify(await p.evaluate(estilos)));
    process.stdout.write('.'); await ctx.close();
  }
  await b.close(); s.close(); console.log('\n' + PANTALLAS.length * 2 + ' capturas en ' + OUT);
})();
