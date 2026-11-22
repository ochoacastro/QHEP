/* v470: PUBLICACIONES PLEGABLES. En Administrador → Publicaciones, cada tienda, anuncio y clasificado muestra solo su nombre
   con un botón «+» al lado; al tocarlo aparecen sus botones (Destacar, Verificar, Bloquear, Editar, Corregir dirección,
   Eliminar) y el signo pasa a «−», que los vuelve a ocultar. La página recuerda cuáles quedaron abiertos mientras el panel se
   vuelve a dibujar (por ejemplo, después de tocar «Destacar»). No cambia lo que hace ningún botón.
   Si algo falla, quita este archivo de src/orden.json: los botones vuelven a verse siempre. */
(function(){
var OPEN={};
function isAdm(){return typeof MODE!=='undefined'&&MODE==='admin'}
function key(r){var b=r.querySelector('.row [data-id]');return b?(b.dataset.k||'c')+':'+b.dataset.id:''}
function name(r){var s=r.querySelector(':scope>span');return s?s.textContent.replace(/\s*·.*$/,'').trim():''}
function paint(r,open){r.classList.toggle('v470o',open);var t=r.querySelector(':scope>.v470t');if(t){t.setAttribute('aria-expanded',String(open));t.setAttribute('aria-label',(open?'Ocultar':'Mostrar')+' los botones de '+name(r))}}
function scan(){if(!isAdm())return;[].forEach.call(document.querySelectorAll('#app .ci.adm:not(.v470)'),function(r){var row=r.querySelector(':scope>.row');if(!row)return;
 r.classList.add('v470');var t=document.createElement('button');t.type='button';t.className='v470t';row.insertAdjacentElement('beforebegin',t);paint(r,!!OPEN[key(r)])})}
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.v470t');if(!t)return;e.preventDefault();var r=t.closest('.ci.adm'),k=key(r),o=!r.classList.contains('v470o');if(k)OPEN[k]=o;paint(r,o)});
var w=0;new MutationObserver(function(){if(w)return;w=1;requestAnimationFrame(function(){w=0;scan()})}).observe(document.documentElement,{childList:true,subtree:true});
document.head.insertAdjacentHTML('beforeend','<style id="v470-css">'+
 '.ci.adm.v470{flex-direction:row;flex-wrap:wrap;align-items:center;gap:8px}.ci.adm.v470>span{flex:1 1 0;min-width:0}'+
 '.ci.adm.v470>.row{flex-basis:100%;display:none}.ci.adm.v470.v470o>.row{display:flex}'+
 /* «+» muestra los botones y «−» los oculta (como los grupos de categorías, v464) */
 '.v470t{flex:none;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;padding:0;border:0;border-radius:999px;background:var(--rio,#0071e3);color:#fff;font:inherit;font-size:22px;font-weight:700;line-height:1;cursor:pointer}'+
 '.v470t::before{content:"+"}.v470o>.v470t::before{content:"\\2212"}.v470t:focus-visible{outline:3px solid var(--rio,#0071e3);outline-offset:2px}'+
 'html.dark .v470t{background:#0a84ff!important;color:#fff!important}</style>');
})();
