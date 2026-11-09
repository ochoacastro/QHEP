// v387: arma index.html a partir de src/ (un archivo por función). La página publicada sigue siendo un solo index.html,
// idéntico al que se edita por partes: aquí solo se juntan los pedazos en el orden de src/orden.json.
//   node tools/armar.mjs            → escribe index.html
//   node tools/armar.mjs --revisar  → no escribe; falla si index.html no coincide con src/ (lo usa GitHub en cada pull request)
// Cada entrada de orden.json: {t:'txt',v:'…'} texto suelto · {t:'html',f} archivo HTML · {t:'js'|'css',tag,f} bloque <script>/<style>
// cuyo contenido está en f · {t:'js',tag,fs:[…]} un mismo <script> armado con varios archivos (el script principal).
import fs from 'fs'; import path from 'path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), SRC = path.join(ROOT, 'src');
const rd = f => fs.readFileSync(path.join(SRC, f), 'utf8');
const orden = JSON.parse(fs.readFileSync(path.join(SRC, 'orden.json'), 'utf8'));
const pieza = e => e.t === 'txt' ? e.v : e.t === 'html' ? rd(e.f) : e.tag + (e.fs ? e.fs.map(rd).join('') : rd(e.f)) + '</' + (e.t === 'js' ? 'script' : 'style') + '>';
/* v393: CARGA RÁPIDA. El código que estaba en la cabecera (Firebase y los módulos) se escribe DESPUÉS del HTML del cuerpo,
   en el mismo orden relativo; en la cabecera quedan los estilos y lo mínimo (tema claro/oscuro, enlaces, título).
   Así el navegador dibuja el encabezado y la pantalla de carga sin esperar a que baje todo el código.
   Las piezas de src/ no cambian; solo el orden en que se juntan. */
const EN_CABECERA = new Set(['codigo/enlaces-sin-numeral.js', 'codigo/canonical.js', 'codigo/tema-inicial.js', 'codigo/tema-inicial-2.js']);
const iCuerpo = orden.findIndex(e => e.t === 'html' && /<body[\s>]/.test(rd(e.f)));
let out = '', luego = '';
orden.forEach((e, i) => {
  if (i > iCuerpo) { out += pieza(e); return }
  if (i === iCuerpo) {
    // los scripts externos (Firebase…) se piden desde la cabecera para que empiecen a bajar de inmediato
    // (se ponen justo después de <meta charset> para que el navegador los vea antes de bajar los estilos)
    const ext = [...luego.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => '<link rel="preload" as="script" href="' + m[1] + '">').join('');
    out = out.replace(/(<meta charset[^>]*>)/i, '$1' + ext);
    out += pieza(e) + luego; return
  }
  const esCodigo = (e.t === 'js' && !EN_CABECERA.has(e.f)) || (e.t === 'txt' && /<script[\s>]/.test(e.v));
  if (esCodigo) luego += pieza(e) + '\n'; else out += pieza(e);
});
const destino = path.join(ROOT, 'index.html');
if (process.argv.includes('--revisar')) {
  const actual = fs.readFileSync(destino, 'utf8');
  if (actual === out) { console.log('✔ index.html coincide con src/'); process.exit(0) }
  let i = 0; while (i < out.length && out[i] === actual[i]) i++;
  const linea = actual.slice(0, i).split('\n').length;
  console.log('✘ index.html no coincide con src/ (primera diferencia en la línea ' + linea + '). Edita src/ y corre: node tools/armar.mjs');
  process.exit(1);
}
fs.writeFileSync(destino, out); console.log('index.html armado (' + Math.round(out.length / 1024) + ' KB, ' + orden.length + ' piezas)');
