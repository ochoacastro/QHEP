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
let out = '';
for (const e of orden) {
  if (e.t === 'txt') out += e.v;
  else if (e.t === 'html') out += rd(e.f);
  else { const tipo = e.t === 'js' ? 'script' : 'style'; out += e.tag + (e.fs ? e.fs.map(rd).join('') : rd(e.f)) + '</' + tipo + '>' }
}
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
