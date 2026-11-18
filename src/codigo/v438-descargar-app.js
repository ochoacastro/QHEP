
/* v438: «DESCARGAR LA APP» EN EL MENÚ ☰ Y AL FINAL DE LA PÁGINA. Antes la tarjeta «Instala Mi Pradera» salía sola al entrar
   (v205); ahora no sale sola: quien quiera la app toca «Descargar la app» en el menú principal (☰) o en el pie de la página.
   - Si el navegador permite instalar (Chrome o Edge en Android y computador), se abre directo su ventana «Instalar».
   - Si ya está instalada (se abrió desde el ícono), lo dice.
   - Si no (iPhone, u otro navegador), muestra cómo agregarla a la pantalla de inicio.
   La app es la misma página con un acceso directo en el celular (no está en Play Store ni en App Store).
   ENLACE DIRECTO: mipradera.com.co/app (la página app/index.html lleva a /?app=1) abre la página con esta ventana ya abierta.
   Como el navegador solo deja instalar después de un toque, ahí no se abre su ventana sola: sale un botón grande «Instalar»
   (si el navegador lo permite; si el permiso llega unos segundos después, el botón aparece en ese momento) o los pasos.
   Enganches fuera de este archivo: qhInstalarApp en v205-avisos.js, ['app','Descargar la app'] en el menú (14-servform.js)
   y el botón data-qapp del pie (html/04.html).
   Para quitarlo: borra este archivo de src/orden.json, el elemento del menú y el botón del pie. */
(function(){
var shareIco='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/></svg>';
function pasos(r){
 var ios='<h3>En iPhone</h3><ol><li>Abre <b>mipradera.com.co</b> en Safari.</li><li>Toca '+shareIco+' <b>Compartir</b>, abajo.</li><li>Toca <b>Agregar a inicio</b>.</li></ol>';
 var and='<h3>En Android</h3><ol><li>Abre <b>mipradera.com.co</b> en Chrome.</li><li>Toca el menú <b>⋮</b>, arriba a la derecha.</li><li>Toca <b>Instalar app</b> o <b>Agregar a la pantalla de inicio</b>.</li></ol>';
 var pc='<h3>En computador</h3><p>En Chrome o Edge, toca el ícono de instalar al final de la barra de direcciones.</p>';
 return r==='ios'?ios:and+ios+pc}
function ventana(r){var intro='<p class="muted">Mi Pradera queda como un ícono en la pantalla de inicio de tu celular, como cualquier app. Ocupa muy poco espacio y no necesitas tienda de aplicaciones.</p>';
 modal('<div class="qapp"><h2>Descargar la app</h2>'+intro+(r==='puede'?'<button type="button" class="btn pink qapp-in" data-qapp-in="1">Instalar</button><button type="button" class="btn ghost" data-act="close">Ahora no</button>':pasos(r)+'<button type="button" class="btn ghost" data-act="close">Entendido</button>')+'</div>')}
window.qhDescargarApp=function(enlace){try{closeModal(1)}catch(e){}
 var puede=typeof qhPuedeInstalar==='function'&&qhPuedeInstalar();
 /* desde el enlace no hubo toque: se muestra el botón «Instalar» en vez de abrir el instalador */
 if(enlace&&puede)return ventana('puede');
 var r=typeof qhInstalarApp==='function'?qhInstalarApp():'otro';
 if(r==='prompt')return;
 if(r==='instalada'){try{toast('Ya tienes Mi Pradera instalada en este celular.')}catch(e){}return}
 ventana(r)};
/* el permiso de instalar llega unos segundos después de abrir la página: si la ventana está abierta con los pasos, pasa a «Instalar» */
addEventListener('qh-instalable',function(){if(document.querySelector('.qapp')&&!document.querySelector('[data-qapp-in]'))ventana('puede')});
/* el enlace directo mipradera.com.co/app → /?app=1 */
try{var q=new URLSearchParams(location.search);if(q.has('app')){q.delete('app');var rs=q.toString();history.replaceState(null,'',location.pathname+(rs?'?'+rs:'')+location.hash);
 var abre=function(){setTimeout(function(){try{qhDescargarApp(true)}catch(e){}},900)};if(document.readyState==='complete')abre();else addEventListener('load',abre)}}catch(e){}
/* el menú ☰ (data-v="app") y el pie (data-qapp) abren «Descargar la app» */
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-v="app"],[data-qapp]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();qhDescargarApp()},true);
/* el botón «Instalar» de la ventana: el toque permite abrir el instalador del navegador */
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-qapp-in]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();try{closeModal(1)}catch(x){}if(typeof qhInstalarApp==='function')qhInstalarApp()},true);
document.head.insertAdjacentHTML('beforeend','<style id="v438-css">.qapp h3{font-size:16px;margin:16px 0 6px}.qapp ol{margin:0;padding-left:22px;line-height:1.6}.qapp p{line-height:1.5}.qapp .btn{width:100%;margin-top:16px}</style>');
})();
