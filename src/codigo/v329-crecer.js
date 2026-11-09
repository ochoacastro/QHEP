
/* v329: cada cuadro de texto de varias líneas crece mientras se escribe (y al abrir uno que ya tiene texto), así se ve todo
   sin desplazarse dentro del cuadro. Nunca queda más bajo que su tamaño original. Si algo falla, borra este bloque. */
(function(){
function grow(t){if(!t||t.tagName!=='TEXTAREA'||t.dataset.nogrow)return;if(!t.classList.contains('qgrow')){t.classList.add('qgrow');t.dataset.h0=t.offsetHeight||''}
 var min=+t.dataset.h0||0;if(!t.offsetParent)return;t.style.height='auto';var h;
 if(!t.value&&t.placeholder){t.value=t.placeholder;h=t.scrollHeight+2;t.value=''}else h=t.scrollHeight+2;/* vacío: que se vea el ejemplo completo */
 t.style.height=Math.max(h,min)+'px'}
document.addEventListener('input',function(e){if(e.target&&e.target.tagName==='TEXTAREA')grow(e.target)},true);
/* también cuando el texto lo pone la página (plantillas, borradores) */
var pend=0;function scan(){pend=0;document.querySelectorAll('textarea').forEach(function(t){if(t.offsetParent&&(t.value||t.placeholder))grow(t)})}
new MutationObserver(function(){if(!pend){pend=1;setTimeout(scan,120)}}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','style','class']});
document.addEventListener('change',function(){if(!pend){pend=1;setTimeout(scan,60)}},true);
window.qGrow=grow;
})();
