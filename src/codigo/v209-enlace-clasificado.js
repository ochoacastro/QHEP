
/* v209: cada clasificado tiene su propio enlace: mipradera.com.co/#/c/ID
   Al abrirlo, muestra Clasificados y lleva la pantalla hasta ese anuncio (resaltado 2,5 s).
   Si algo falla, borra SOLO este <script id="v209-enlace-clasificado"> (y el enlace de "Compartir" vuelve a #/comunidad si cambias #/c/ por #/comunidad en la accion cmxShare). */
(function(){
var want=null;
function take(){var m=(location.hash||'').match(/^#\/c\/(.+)$/);if(!m)return false;
 try{want=decodeURIComponent(m[1])}catch(e){want=m[1]}
 history.replaceState(history.state,'',location.pathname+location.search+'#/comunidad');return true}
function find(n){if(!want)return;var id=want,el;try{el=document.querySelector('[data-cid="'+(window.CSS&&CSS.escape?CSS.escape(id):id)+'"]')}catch(e){el=null}
 if(el){want=null;el.scrollIntoView({block:'center',behavior:'smooth'});el.classList.add('cmhl');setTimeout(function(){el.classList.remove('cmhl')},2500);return}
 if(n<40)setTimeout(function(){find(n+1)},250);else want=null}
if(take())find(0);
window.addEventListener('hashchange',function(e){if(take()){e.stopImmediatePropagation();window.dispatchEvent(new HashChangeEvent('hashchange'));find(0)}},true);
})();
