
/* v434: «SUGERENCIAS» SE UNE CON «ESCRÍBENOS». La ventana pública de Sugerencias deja de usarse: en los menús su lugar lo toma
   «Escríbenos», que lleva al formulario completo del pie de la página (v344: nombre, correo, teléfono, asunto —con «Sugerencia»
   entre las opciones— y mensaje) y lo abre ya desplegado (v370 lo pliega detrás de un botón).
   Quien llegue a la ventana vieja por un enlace guardado (#/sugerencias) o por otro botón también va a «Escríbenos».
   El administrador sigue viendo las sugerencias viejas y los mensajes de Escríbenos en Administrador → Sugerencias.
   Para quitarlo: borra este archivo de src/orden.json y vuelve a poner ['sug','Sugerencias'] en los menús (05-mlc.js y 14-servform.js). */
(function(){
var $=function(s){return document.querySelector(s)};
window.qhEscribenos=function(){try{closeModal(1)}catch(e){}
 var w=$('.qctw');if(!w)return;
 if(w.classList.contains('qcl-h')){var b=$('.qcl-ct');if(b)b.click();else w.classList.remove('qcl-h')}
 var dest=$('.qcl-ct')||w;dest.scrollIntoView({block:'start',behavior:'smooth'});
 setTimeout(function(){var f=w.querySelector('#qct-n');if(f)try{f.focus({preventScroll:true})}catch(e){f.focus()}},350)};
/* los menús: «Escríbenos» no es una pantalla, abre el formulario */
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-v="escribenos"]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();try{moreOpen=false}catch(x){}qhEscribenos()},true);
/* la ventana vieja: si algo la abre, se va al inicio y a «Escríbenos» */
function vieja(){try{if(view!=='sug')return;view='home';render();setTimeout(qhEscribenos,120)}catch(e){}}
function inicia(){if(inicia.ya)return;inicia.ya=1;var a=$('#app');if(a)new MutationObserver(vieja).observe(a,{childList:true});vieja()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inicia);else inicia();
})();
