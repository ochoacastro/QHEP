/* v462: DIRECCIÓN SIN MAPA. Al escribir la dirección del negocio (crear o editar tienda) o del inmueble (arriendo o venta) ya no se
   muestra el mapa de Google Maps ni la pregunta «¿Google Maps muestra bien…?». Solo la dirección y, debajo, la referencia:
   «Referencia de la dirección» (#x-ref → s.ref en la tienda, en 09-rateform.js; f.ref en el inmueble, agregado aquí a ADT).
   El código plus lo pone solo el administrador: los negocios con dirección y sin punto salen en Usuarios → «Negocios por ubicar»
   (v335) y los inmuebles sin punto en «Inmuebles por ubicar» (v396, v445).
   Es un interruptor (window.qhSinMapa, que leen v335, v395, v396 y v402). La pregunta vieja no se borra: queda oculta y conserva la
   respuesta que ya tenía cada tienda o inmueble. El mapa que ve el visitante en el anuncio (v409) y en la tienda no cambia.
   Para volver a como estaba, quita este archivo de src/orden.json (el campo de referencia de la tienda sigue, vacío es opcional). */
(function(){
window.qhSinMapa=true;
/* referencia del inmueble, debajo de la dirección. ADT está en el programa principal, que carga después de este archivo */
var REF={k:'ref',l:'Referencia de la dirección',t:'text',max:120,ph:'Ej: frente al parque, casa de reja verde'};
function addRef(){try{['arr','casa'].forEach(function(t){var F=ADT[t]&&ADT[t].F;if(!F||F.some(function(x){return x.k==='ref'}))return;
 var i=F.findIndex(function(x){return x.k==='mapok'});if(i<0)i=F.findIndex(function(x){return x.k==='addr'});if(i>=0)F.splice(i+1,0,REF)})}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addRef);else addRef();
/* oculta la pregunta vieja y el lugar del mapa (la lista sigue en el formulario y guarda su respuesta como antes) */
function off(x){if(x&&x.style.display!=='none'){x.hidden=true;x.style.setProperty('display','none','important')}}
function scan(){if(!window.qhSinMapa)return;
 var s=document.getElementById('x-mapok');if(s){off(document.querySelector('label[for="x-mapok"]'));off(s);off(s._qs);var n=(s._qs||s).nextElementSibling;if(n&&n.tagName==='P')off(n);off(document.getElementById('x-map'))}
 var a=document.getElementById('af-mapok');if(a)off(a.closest('.fw')||a)}
var t=0;new MutationObserver(function(){if(t)return;t=1;requestAnimationFrame(function(){t=0;scan()})}).observe(document.documentElement,{childList:true,subtree:true});
})();
