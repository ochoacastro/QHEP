
/* v208: si TODAS las imagenes de un banner de publicidad (arriba .tb o en medio .bn) fallan al cargar,
   el banner se oculta para no dejar un hueco vacio. Si al menos una carga, el banner se queda como esta.
   Si algo falla, borra SOLO este <script id="v208-ajustes"> y el <style id="v208-ajustes-css">. */
(function(){
function bad(i){return i.complete&&i.naturalWidth===0&&!!i.getAttribute('src')}
function check(sec){if(!sec)return;var ims=sec.querySelectorAll('img');if(!ims.length)return;
 for(var k=0;k<ims.length;k++)if(!bad(ims[k]))return;sec.classList.add('qh-off')}
document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.closest){var s=t.closest('section.tb,section.bn');if(s)setTimeout(function(){check(s)},0);
 /* logo de la cabecera: si el que se subio en el panel no carga, se usa el logo incrustado */
 if(t.closest('#home')&&!t.dataset.qhfb){try{t.dataset.qhfb=1;t.src=document.documentElement.classList.contains('dark')?LOGO_DARK:LOGO}catch(_){}}}},true);
document.addEventListener('load',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&t.closest){var s=t.closest('section.tb.qh-off,section.bn.qh-off');if(s)s.classList.remove('qh-off')}},true);
})();
