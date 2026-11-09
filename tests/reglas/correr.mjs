// Corre todas las pruebas de reglas (v24 … v48) contra reglas/firestore.rules en el emulador de Firestore.
// Cada archivo deja sus resultados en un JSON: [nombre, pasó, se esperaba]. Si alguno no coincide, termina con error.
import { execFileSync } from 'child_process'; import fs from 'fs'; import path from 'path'; import os from 'os';
const DIR = path.dirname(new URL(import.meta.url).pathname), RULES = path.join(DIR, 'firestore.rules');
const files = fs.readdirSync(DIR).filter(f => /^v\d+\.test\.mjs$/.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
let total = 0, malas = [];
for (const f of files) {
  const out = path.join(os.tmpdir(), 'reglas-' + f + '.json');
  try { fs.unlinkSync(out) } catch (e) {}
  try { execFileSync(process.execPath, [path.join(DIR, f)], { env: { ...process.env, RULES, OUT: out }, stdio: ['ignore', 'ignore', 'pipe'], timeout: 180000 }) }
  catch (e) { malas.push(f + ': no terminó (' + String(e.message).slice(0, 120) + ')'); continue }
  const r = JSON.parse(fs.readFileSync(out, 'utf8')); total += r.length;
  const bad = r.filter(([n, ok, want]) => ok !== want);
  console.log((bad.length ? '✘ ' : '✔ ') + f + '  ' + (r.length - bad.length) + '/' + r.length);
  bad.forEach(([n, ok, want]) => malas.push(f + ': «' + n + '» ' + (want ? 'debía permitirse' : 'debía rechazarse')));
}
console.log('\nCasos: ' + total + ' · fallas: ' + malas.length);
if (malas.length) { console.log(malas.join('\n')); process.exit(1) }
