
/* v229 → v387: el tutorial de bienvenida con fotos se quitó (v366 lo apagó y sus imágenes ya no existen).
   Solo queda tourAdmHTML(), que Administrar → Configuración usa para mostrar la tarjeta de «Guías paso a paso». */
function tourAdmHTML(){return typeof helpAdmHTML==='function'?helpAdmHTML():''}
