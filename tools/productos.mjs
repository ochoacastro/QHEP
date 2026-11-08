// v291: crea una página pequeña por cada producto (p/<tienda>/<producto>.html) y por cada color con foto propia
// (p/<tienda>/<producto>-<código del color>.html), para que WhatsApp, Facebook y Google muestren la foto, el nombre
// y el precio al compartir el enlace. Al abrirla, la persona pasa al producto dentro de Mi Pradera.
// Lee las tiendas y productos públicos de Firestore (lectura pública) sin claves. La ejecuta la acción
// .github/workflows/noticias.yml cada hora; también se puede correr a mano:  node tools/productos.mjs
// Prueba sin internet: STORES_JSON=tiendas.json PRODUCTS_JSON=productos.json node tools/productos.mjs
import fs from 'fs'; import path from 'path';
import { authHeaders } from './fs-auth.mjs'; // v379: lectura identificada si existe el secreto FB_SA
const SITE = 'https://mipradera.com.co/', PROJECT = 'qhep-b812f', ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'p'), IMG = path.join(OUT, 'img'), GRACE = 3 * 864e5;
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const okId = s => /^[A-Za-z0-9_-]{1,80}$/.test(String(s || ''));
const money = n => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(n) || 0);
// igual que csv(), vId() y pimgs() de la página: el código de cada color tiene que coincidir con el que muestra la página
const csv = v => String(v || '').split(',').map(x => x.replace(/\|/g, '').trim()).filter(Boolean).slice(0, 12);
const vId = (p, c) => { let h = 0; for (const ch of String(p.id) + '|' + c) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return String(1000000 + h % 9000000) };
const pimgs = p => Array.isArray(p.imgs) && p.imgs.length ? p.imgs : (p.img ? [p.img] : []);
function val(v) {
  if (!v) return null; if ('stringValue' in v) return v.stringValue; if ('integerValue' in v) return Number(v.integerValue); if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue; if ('arrayValue' in v) return (v.arrayValue.values || []).map(val);
  if ('mapValue' in v) { const o = {}; for (const [k, x] of Object.entries(v.mapValue.fields || {})) o[k] = val(x); return o } return null
}
async function load(coll, env) {
  if (process.env[env]) return JSON.parse(fs.readFileSync(process.env[env], 'utf8'));
  const L = []; let tok = '';
  do {
    const u = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${coll}?pageSize=300${tok ? '&pageToken=' + encodeURIComponent(tok) : ''}`;
    const r = await fetch(u, { headers: await authHeaders() }); if (!r.ok) throw new Error('Firestore respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
    const j = await r.json(); for (const d of j.documents || []) { const o = {}; for (const [k, x] of Object.entries(d.fields || {})) o[k] = val(x); o._doc = d.name.split('/').pop(); L.push(o) }
    tok = j.nextPageToken || ''
  } while (tok);
  return L
}
const written = new Set();
function put(file, data) { fs.mkdirSync(path.dirname(file), { recursive: true }); written.add(path.resolve(file)); const old = fs.existsSync(file) ? fs.readFileSync(file) : null; const buf = Buffer.isBuffer(data) ? data : Buffer.from(data); if (!old || !old.equals(buf)) fs.writeFileSync(file, buf) }
// las fotos guardadas dentro del documento (data:image/...) se vuelven archivos, para que WhatsApp las pueda ver
function imgUrl(u, name) {
  if (!u || typeof u !== 'string') return '';
  const m = u.match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/);
  if (m) { const ext = m[1] === 'jpeg' ? 'jpg' : m[1], f = name + '.' + ext; put(path.join(IMG, f), Buffer.from(m[2], 'base64')); return SITE + 'p/img/' + f }
  if (/^https:\/\//.test(u)) return u;
  return ''
}
const CSS = `:root{--bg:#f5f5f7;--card:#fff;--ink:#1d1d1f;--muted:#6e6e73;--blue:#0071e3;color-scheme:light dark}
@media (prefers-color-scheme:dark){:root{--bg:#000;--card:#1c1c1e;--ink:#f5f5f7;--muted:#a1a1a6}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:'Rubik',-apple-system,BlinkMacSystemFont,system-ui,'Segoe UI',Roboto,sans-serif;line-height:1.5}
main{max-width:560px;margin:0 auto;padding:16px}.card{background:var(--card)}img{display:block;width:100%;max-height:70vh;object-fit:contain;background:#000}
.in{padding:18px 20px 22px}h1{font-size:26px;line-height:1.2;margin:0 0 6px}.pr{font-size:24px;font-weight:800;margin:0 0 6px}.by{color:var(--muted);margin:0 0 16px}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 22px;background:var(--blue);color:#fff;font-weight:800;text-decoration:none;text-transform:uppercase;letter-spacing:.03em}`;
function page({ title, desc, url, img, go, name, price, store, color }) {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${esc(url)}"><link rel="icon" href="/icon-192.png">
<meta property="og:type" content="product"><meta property="og:site_name" content="Mi Pradera"><meta property="og:locale" content="es_CO"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(img || SITE + 'og-image.png')}"><meta name="twitter:card" content="summary_large_image">
<style>${CSS}</style>
<script>(function(){var q=location.search.slice(1);location.replace(${JSON.stringify(go)}+(q?(${JSON.stringify(go)}.indexOf('?')<0?'?':'&')+q:''))})()</script>
</head><body><main><div class="card">${img ? `<img src="${esc(img)}" alt="${esc(name)}">` : ''}<div class="in"><h1>${esc(name)}${color ? ' · ' + esc(color) : ''}</h1><p class="pr">${esc(money(price))}</p><p class="by">Vendido por ${esc(store)} en Mi Pradera</p><a class="btn" href="${esc(go)}">Ver el producto</a></div></div></main></body></html>
`
}
const [stores, prods] = await Promise.all([load('stores', 'STORES_JSON'), load('products', 'PRODUCTS_JSON')]);
const now = Date.now(), live = s => !s.hidden && !s.age && (!('pexp' in s) || (Number(s.pexp) || 0) + GRACE > now);
const S = {}; for (const s of stores) { const id = s.id || s._doc; if (okId(id) && live(s)) S[id] = s }
let n = 0; const LIST = [];/* v305: lista de páginas creadas (la página la usa para el enlace del pedido) */
for (const p of prods) {
  const sid = p.sid, s = S[sid]; if (!s || !okId(p.id) || !p.name) continue;
  const base = SITE + 'p/' + sid + '/' + p.id, go = SITE + '?producto=' + encodeURIComponent(sid) + '/' + encodeURIComponent(p.id)/* v304: formato sin «#» */, main0 = pimgs(p)[0];
  const desc = (p.out ? 'Agotado. ' : '') + 'Vendido por ' + s.name + ' en Mi Pradera, Pradera (Valle del Cauca).';
  LIST.push(sid + '/' + p.id); put(path.join(OUT, sid, p.id + '.html'), page({ title: p.name + ' – ' + money(p.price), desc, url: base + '.html', img: imgUrl(main0, sid + '-' + p.id), go, name: p.name, price: p.price, store: s.name }));
  n++;
  // una página por color que tenga su propia foto
  for (const c of csv(p.color)) {
    const ci = (Array.isArray(p.cimgs) ? p.cimgs : []).find(x => x && x.c === c), im = ci && (ci.i || (Array.isArray(ci.g) && ci.g[0])); if (!im) continue;
    const v = vId(p, c);
    LIST.push(sid + '/' + p.id + '-' + v); put(path.join(OUT, sid, p.id + '-' + v + '.html'), page({ title: p.name + ' (' + c + ') – ' + money(p.price), desc, url: base + '-' + v + '.html', img: imgUrl(im, sid + '-' + p.id + '-' + v), go: go + '&v=' + v, name: p.name, price: p.price, store: s.name, color: c }));
    n++
  }
}
put(path.join(OUT, 'lista.json'), JSON.stringify(LIST.sort()));
// borra páginas y fotos de productos que ya no existen o que ya no están a la vista
function sweep(dir) { if (!fs.existsSync(dir)) return; for (const f of fs.readdirSync(dir)) { const fp = path.resolve(dir, f), st = fs.statSync(fp); if (st.isDirectory()) { sweep(fp); if (!fs.readdirSync(fp).length) fs.rmdirSync(fp) } else if (!written.has(fp) && /\.(html|jpg|png|webp)$/.test(f)) { fs.unlinkSync(fp); console.log('borrada', path.relative(ROOT, fp)) } } }
sweep(OUT);
console.log(n + ' páginas de productos listas');
