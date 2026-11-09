// Compara dos carpetas de capturas (ver capturar.cjs): estilos calculados elemento por elemento y fotos píxel por píxel.
//   node tests/visual/comparar.cjs <antes> <después>
// Termina con error si alguna pantalla cambió, y dice qué elementos y qué propiedades.
const fs = require('fs'), path = require('path');
const [A, B] = process.argv.slice(2).map(x => path.resolve(x));
const pngs = fs.readdirSync(A).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort();
let cambios = 0, faltan = 0;
for (const t of pngs) {
  const fb = path.join(B, t + '.json'); if (!fs.existsSync(fb)) { faltan++; continue } // solo se comparan las pantallas que están en las dos carpetas
  const a = JSON.parse(fs.readFileSync(path.join(A, t + '.json'))), b = JSON.parse(fs.readFileSync(fb));
  const difs = [];
  if (a.length !== b.length) difs.push('cantidad de elementos visibles: ' + a.length + ' → ' + b.length);
  for (let i = 0; i < Math.min(a.length, b.length) && difs.length < 8; i++) {
    const ord = x => x.split(';').filter(Boolean).sort().join(';'); // el navegador puede listar las propiedades en otro orden
    for (let k = 1; k <= 3; k++) if (a[i][k] !== b[i][k] && ord(a[i][k]) !== ord(b[i][k])) {
      const pa = Object.fromEntries(a[i][k].split(';').filter(Boolean).map(x => [x.slice(0, x.indexOf(':')), x.slice(x.indexOf(':') + 1)]));
      const pb = Object.fromEntries(b[i][k].split(';').filter(Boolean).map(x => [x.slice(0, x.indexOf(':')), x.slice(x.indexOf(':') + 1)]));
      const ps = [...new Set([...Object.keys(pa), ...Object.keys(pb)])].filter(p => pa[p] !== pb[p]).slice(0, 4).map(p => p + ': ' + pa[p] + ' → ' + pb[p]);
      difs.push(b[i][0] + (k === 2 ? '::before' : k === 3 ? '::after' : '') + '  ' + ps.join(' | '));
    }
  }
  const imgA = fs.readFileSync(path.join(A, t + '.png')), imgB = fs.existsSync(path.join(B, t + '.png')) ? fs.readFileSync(path.join(B, t + '.png')) : null;
  const foto = imgB && imgA.equals(imgB) ? 'foto igual' : 'FOTO DISTINTA';
  if (difs.length || foto !== 'foto igual') { cambios++; console.log('✘ ' + t + ' (' + foto + ')'); difs.forEach(d => console.log('    ' + d)) }
}
console.log(cambios ? '\n' + cambios + ' pantallas con cambios' : '✔ ' + (pngs.length - faltan) + ' pantallas idénticas (estilos y fotos)' + (faltan ? ' · ' + faltan + ' sin comparar (no están en las dos carpetas)' : ''));
process.exit(cambios ? 1 : 0);
