
/* v354: botón X visible arriba a la derecha en las ventanas de «Iniciar sesión» y «Registrarme» (y las demás con el mismo diseño) */
(function(){
var X='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
function paint(){var l=document.querySelectorAll('#ov .am');for(var i=0;i<l.length;i++){var m=l[i];if(m.parentElement.closest('.am')||m.querySelector(':scope>.am-top'))continue;
 m.insertAdjacentHTML('afterbegin','<div class="am-top"><button type="button" class="am-cx" data-act="close" aria-label="Cerrar">'+X+'</button></div>')}}
var t=0;new MutationObserver(function(){if(t)return;t=1;requestAnimationFrame(function(){t=0;paint()})}).observe(document.documentElement,{childList:true,subtree:true});
})();
