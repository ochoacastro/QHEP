// v250: crea una página propia por cada noticia (para Google y para que WhatsApp/Facebook muestren la vista previa),
// el archivo de noticias (noticias/index.html), el canal RSS (noticias/feed.xml) y el sitemap.xml.
// Lee las noticias públicas de Firestore (colección "news", lectura pública) sin claves. La ejecuta la acción
// .github/workflows/noticias.yml cada hora; también se puede correr a mano:  node tools/noticias.mjs
// Prueba sin internet: NEWS_JSON=archivo.json node tools/noticias.mjs  (lista de noticias como las guarda la página)
import fs from 'fs';import path from 'path';
const SITE = 'https://mipradera.com.co/', PROJECT = 'qhep-b812f', ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'noticias'), IMG = path.join(OUT, 'img');
const FIXED = [['', 'daily', '1.0'], ['noticias/', 'daily', '0.8'], ['privacidad.html', 'yearly', '0.3'], ['eliminar-datos.html', 'yearly', '0.2']];
const NWC = { comu: ['', 'Comunidad'], clima: ['', 'Clima y ambiente'], empleo: ['', 'Empleo'], eventos: ['', 'Eventos'], salud: ['', 'Salud'], seguridad: ['', 'Seguridad'], gobierno: ['', 'Gobierno'], negocios: ['', 'Negocios'], educacion: ['', 'Educación'], deportes: ['', 'Deportes'], cultura: ['', 'Cultura'] };

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// igual que nwSlug() de la página: el enlace que se comparte desde la página tiene que existir aquí
const slug = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '') || 'noticia';
const plain = t => String(t || '').replace(/\*\*/g, '').replace(/^#{1,3}\s+/gm, '').replace(/^[-*•]\s+/gm, '• ');
const inl = x => String(x).split(/(https?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]])/).map((y, i) => i % 2 ? `<a href="${esc(y)}" rel="noopener nofollow ugc">${esc(y.length > 48 ? y.slice(0, 45) + '…' : y)}</a>` : esc(y).replace(/\*\*([^*]+?)\*\*/g, '<b>$1</b>')).join('');
function fmt(t) { // igual que nwFmt() de la página
  const o = []; let P = [], U = []; const fl = () => { if (P.length) o.push('<p>' + P.map(inl).join('<br>') + '</p>'); if (U.length) o.push('<ul>' + U.map(x => '<li>' + inl(x) + '</li>').join('') + '</ul>'); P = []; U = [] };
  String(t || '').replace(/\r/g, '').split('\n').forEach(L => { const z = L.trim(); let m; if (!z) return fl(); if ((m = z.match(/^#{1,3}\s+(.+)$/))) { fl(); o.push('<h2>' + inl(m[1]) + '</h2>'); return } if ((m = z.match(/^[-*•]\s+(.+)$/))) { if (P.length) { o.push('<p>' + P.map(inl).join('<br>') + '</p>'); P = [] } U.push(m[1]); return } if (U.length) { o.push('<ul>' + U.map(x => '<li>' + inl(x) + '</li>').join('') + '</ul>'); U = [] } P.push(L) }); fl(); return o.join('')
}
const fdate = ts => new Date(ts).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' });
const month = ts => { const m = new Date(ts).toLocaleDateString('es-CO', { month: 'long', year: 'numeric', timeZone: 'America/Bogota' }); return m.charAt(0).toUpperCase() + m.slice(1) };
const desc = n => { const d = plain(n.text).replace(/\s+/g, ' ').trim(); return d.length > 158 ? d.slice(0, 155).trimEnd() + '…' : d };
const ytId = u => { const m = String(u || '').match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : '' };
const plat = u => /youtu/i.test(u) ? 'YouTube' : /tiktok/i.test(u) ? 'TikTok' : /instagram/i.test(u) ? 'Instagram' : /facebook|fb\.watch/i.test(u) ? 'Facebook' : /drive\.google/i.test(u) ? 'Google Drive' : 'el enlace';

function val(v) { // valor de la API REST de Firestore -> JS
  if (!v) return null; if ('stringValue' in v) return v.stringValue; if ('integerValue' in v) return Number(v.integerValue); if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue; if ('arrayValue' in v) return (v.arrayValue.values || []).map(val);
  if ('mapValue' in v) { const o = {}; for (const [k, x] of Object.entries(v.mapValue.fields || {})) o[k] = val(x); return o } return null
}
async function load() {
  if (process.env.NEWS_JSON) return JSON.parse(fs.readFileSync(process.env.NEWS_JSON, 'utf8'));
  const L = []; let tok = '';
  do {
    const u = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/news?pageSize=300${tok ? '&pageToken=' + encodeURIComponent(tok) : ''}`;
    const r = await fetch(u); if (!r.ok) throw new Error('Firestore respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
    const j = await r.json(); for (const d of j.documents || []) { const o = {}; for (const [k, x] of Object.entries(d.fields || {})) o[k] = val(x); o.id = d.name.split('/').pop(); L.push(o) }
    tok = j.nextPageToken || ''
  } while (tok);
  return L
}
const written = new Set();
function put(file, data) { fs.mkdirSync(path.dirname(file), { recursive: true }); written.add(path.resolve(file)); const old = fs.existsSync(file) ? fs.readFileSync(file) : null; const buf = Buffer.isBuffer(data) ? data : Buffer.from(data); if (!old || !old.equals(buf)) fs.writeFileSync(file, buf) }
// las fotos guardadas dentro del documento (data:image/...) se vuelven archivos, para que Google y WhatsApp las vean
function imgUrl(u, name) {
  if (!u || typeof u !== 'string') return '';
  const m = u.match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/);
  if (m) { const ext = m[1] === 'jpeg' ? 'jpg' : m[1], f = name + '.' + ext; put(path.join(IMG, f), Buffer.from(m[2], 'base64')); return SITE + 'noticias/img/' + f }
  if (/^https:\/\//.test(u)) return u;
  if (/^[\w./-]+$/.test(u)) return SITE + u.replace(/^\.?\//, '');
  return ''
}
const CSS = `:root{--bg:#f5f5f7;--card:#fff;--ink:#1d1d1f;--muted:#6e6e73;--link:#0066cc;--blue:#0071e3;--line:rgba(0,0,0,.08);color-scheme:light dark}
@media (prefers-color-scheme:dark){:root{--bg:#000;--card:#1c1c1e;--ink:#f5f5f7;--muted:#a1a1a6;--link:#2997ff;--line:rgba(255,255,255,.12)}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,'Inter',system-ui,'Segoe UI',Roboto,sans-serif;line-height:1.55;letter-spacing:-.01em}
a{color:var(--link)}header{display:flex;align-items:center;gap:12px;max-width:760px;margin:0 auto;padding:14px 16px}header img{width:44px;height:44px;border-radius:12px}header a{text-decoration:none;color:var(--ink);font-weight:700;font-size:18px}header nav{margin-left:auto;font-size:15px}
main{max-width:760px;margin:0 auto;padding:0 16px 32px}.card{background:var(--card);border-radius:20px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.in{padding:18px 20px 22px}.cat{display:inline-block;padding:3px 10px;border-radius:980px;background:rgba(0,113,227,.12);color:var(--link);font-size:13px;font-weight:600;text-decoration:none}
h1{font-size:30px;line-height:1.15;margin:10px 0 8px;letter-spacing:-.02em}.by{color:var(--muted);font-size:14px;margin:0 0 6px}
.cover{display:block;width:100%;max-height:70vh;object-fit:contain;background:#000}.tx p,.tx li{font-size:17px}.tx h2{font-size:21px;margin:22px 0 8px}.tx a{word-break:break-all}
.gal{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;padding:0 20px 18px}.gal img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:12px}
.vid{display:inline-block;margin:6px 0 12px;padding:10px 18px;border-radius:980px;background:#ff0033;color:#fff;font-weight:600;text-decoration:none}
.act{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.btn{display:inline-flex;align-items:center;min-height:44px;padding:10px 20px;border-radius:980px;background:var(--blue);color:#fff;font-weight:600;text-decoration:none}.btn.s{background:transparent;border:1px solid var(--link);color:var(--link)}.btn.wa{background:#25d366;color:#08391c}
h3{font-size:20px;margin:26px 4px 10px}.rel a,.ls a{display:flex;gap:12px;align-items:center;margin:0 0 8px;padding:10px;border-radius:16px;background:var(--card);color:var(--ink);text-decoration:none}
.rel img,.ls img{flex:none;width:84px;height:64px;border-radius:10px;object-fit:cover;background:var(--line)}.rel b,.ls b{display:block;font-size:16px;line-height:1.3}.rel small,.ls small{display:block;color:var(--muted);font-size:13px;margin-top:3px}
.ls h2{font-size:16px;color:var(--muted);margin:22px 4px 8px}footer{max-width:760px;margin:0 auto;padding:10px 16px 40px;color:var(--muted);font-size:13px;text-align:center}`;
const head = (title, d, url, img, extra = '') => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(d)}"><link rel="canonical" href="${esc(url)}">
<meta property="og:site_name" content="Mi Pradera"><meta property="og:locale" content="es_CO"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(d)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(img || SITE + 'og-image.png')}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icon-192.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="alternate" type="application/rss+xml" title="Noticias de Mi Pradera" href="${SITE}noticias/feed.xml">${extra}
<style>${CSS}</style></head><body><header><a href="/"><img src="/icon-192.png" alt="" width="44" height="44"></a><a href="/">Mi Pradera</a><nav><a href="/noticias/">Noticias</a></nav></header>`;
const foot = `<footer>Mi Pradera · Lo nuestro, en un solo lugar · <a href="/noticias/feed.xml">RSS</a> · <a href="/privacidad.html">Privacidad</a></footer></body></html>\n`;

const all = (await load()).filter(n => n && /^[A-Za-z0-9_]+$/.test(n.id || '') && n.title && n.ts).sort((a, b) => b.ts - a.ts);
const page = n => 'noticias/' + slug(n.title) + '-' + n.id + '.html';
for (const n of all) { n.url = SITE + page(n); n.cover = imgUrl(n.img, n.id); n.gal = (Array.isArray(n.imgs) ? n.imgs : []).map((u, i) => imgUrl(u, n.id + '-' + (i + 1))).filter(Boolean) }
for (const n of all) {
  const c = NWC[n.cat], y = ytId(n.link), d = desc(n), iso = new Date(n.ts).toISOString(), ed = n.ed ? new Date(n.ed).toISOString() : iso;
  const sm = all.filter(x => x.id !== n.id && n.cat && x.cat === n.cat), rel = sm.concat(all.filter(x => x.id !== n.id && !sm.includes(x))).slice(0, 3);
  const ld = { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: n.title.slice(0, 110), description: d, datePublished: iso, dateModified: ed, mainEntityOfPage: n.url, author: { '@type': 'Person', name: n.author || 'Redacción' }, publisher: { '@type': 'Organization', name: 'Mi Pradera', logo: { '@type': 'ImageObject', url: SITE + 'icon-512.png' } }, image: [n.cover, ...n.gal].filter(Boolean) };
  const app = SITE + '#/nw/' + n.id, wa = 'https://wa.me/?text=' + encodeURIComponent(n.title + ' — Noticias de Mi Pradera ' + n.url);
  const html = head(n.title + ' – Noticias de Mi Pradera', d, n.url, n.cover, `<meta property="og:type" content="article"><meta property="article:published_time" content="${iso}">${c ? `<meta property="article:section" content="${esc(c[1])}">` : ''}<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`)
    + `<main><article class="card">${n.cover ? `<img class="cover" src="${esc(n.cover)}" alt="${esc(n.title)}">` : ''}<div class="in">${c ? `<a class="cat" href="/noticias/#${esc(n.cat)}">${esc(c[1])}</a>` : ''}<h1>${esc(n.title)}</h1><p class="by">Por ${esc(n.author || 'Redacción')} · <time datetime="${iso}">${esc(fdate(n.ts))}</time>${n.ed ? ' · editada' : ''}</p>`
    + `${n.link ? `<a class="vid" href="${esc(y ? 'https://www.youtube.com/watch?v=' + y : n.link)}" rel="noopener nofollow">Ver el video en ${plat(n.link)}</a>` : ''}<div class="tx">${fmt(n.text)}</div>`
    + `<div class="act"><a class="btn" href="${esc(app)}">Comentar y reaccionar</a><a class="btn wa" href="${esc(wa)}">Compartir por WhatsApp</a></div></div>`
    + `${n.gal.length ? `<div class="gal">${n.gal.map((u, i) => `<img src="${esc(u)}" alt="Foto ${i + 1}: ${esc(n.title)}" loading="lazy">`).join('')}</div>` : ''}</article>`
    + `${rel.length ? `<section class="rel"><h3>Más noticias</h3>${rel.map(x => `<a href="/${esc(page(x))}">${x.cover ? `<img src="${esc(x.cover)}" alt="" loading="lazy">` : ''}<span><b>${esc(x.title)}</b><small>${esc(fdate(x.ts))}${NWC[x.cat] ? ' · ' + esc(NWC[x.cat][1]) : ''}</small></span></a>`).join('')}</section>` : ''}`
    + `<p style="text-align:center;margin-top:24px"><a class="btn s" href="/noticias/">Ver todas las noticias</a></p></main>` + foot;
  put(path.join(ROOT, page(n)), html)
}
// archivo de noticias por mes
let lm = '', ls = '';
for (const n of all) { const m = month(n.ts); if (m !== lm) { ls += `<h2>${esc(m)}</h2>`; lm = m } const c = NWC[n.cat]; ls += `<a href="/${esc(page(n))}" data-cat="${esc(n.cat || '')}">${n.cover ? `<img src="${esc(n.cover)}" alt="" loading="lazy">` : ''}<span><b>${esc(n.title)}</b><small>${esc(fdate(n.ts))}${c ? ' · ' + esc(c[1]) : ''}</small></span></a>` }
put(path.join(OUT, 'index.html'), head('Noticias de Pradera – Mi Pradera', 'Noticias, avisos y eventos de Pradera, Valle del Cauca, contados por la comunidad en Mi Pradera.', SITE + 'noticias/', '')
  + `<main><h1>Noticias de Pradera</h1><p class="by">Lo que pasa en Pradera, contado por la comunidad. <a href="/#/noticias">Ver en Mi Pradera</a> · <a href="/noticias/feed.xml">RSS</a></p><div class="ls">${ls || '<p>Todavía no hay noticias publicadas.</p>'}</div></main>`
  + `<script>(function(){var h=location.hash.slice(1);if(!h)return;var l=document.querySelectorAll('.ls a');for(var i=0;i<l.length;i++)if(l[i].dataset.cat!==h)l[i].style.display='none'})()</script>` + foot);
// RSS (últimas 30)
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Noticias de Mi Pradera</title><link>${SITE}noticias/</link><description>Noticias, avisos y eventos de Pradera, Valle del Cauca.</description><language>es-co</language><atom:link href="${SITE}noticias/feed.xml" rel="self" type="application/rss+xml"/>
${all.slice(0, 30).map(n => `<item><title>${esc(n.title)}</title><link>${esc(n.url)}</link><guid isPermaLink="true">${esc(n.url)}</guid><pubDate>${new Date(n.ts).toUTCString()}</pubDate>${NWC[n.cat] ? `<category>${esc(NWC[n.cat][1])}</category>` : ''}<description>${esc(desc(n))}</description>${n.cover ? `<enclosure url="${esc(n.cover)}" type="image/${/\.png$/.test(n.cover) ? 'png' : /\.webp$/.test(n.cover) ? 'webp' : 'jpeg'}" length="0"/>` : ''}</item>`).join('\n')}
</channel></rss>
`;
put(path.join(OUT, 'feed.xml'), rss);
// sitemap
const sm = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${FIXED.map(([u, f, p]) => `  <url><loc>${SITE}${u}</loc><changefreq>${f}</changefreq><priority>${p}</priority></url>`).join('\n')}
${all.map(n => `  <url><loc>${esc(n.url)}</loc><lastmod>${new Date(n.ed || n.ts).toISOString().slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>
`.replace(/\n\n/g, '\n');
put(path.join(ROOT, 'sitemap.xml'), sm);
// borra páginas y fotos de noticias que ya no existen
for (const dir of [OUT, IMG]) { if (!fs.existsSync(dir)) continue; for (const f of fs.readdirSync(dir)) { const fp = path.resolve(dir, f); if (fs.statSync(fp).isFile() && !written.has(fp) && /\.(html|jpg|png|webp)$/.test(f)) { fs.unlinkSync(fp); console.log('borrada', path.relative(ROOT, fp)) } } }
console.log(all.length + ' noticias → páginas, archivo, RSS y sitemap listos');
