/* v402: la pregunta «¿Google Maps muestra bien…?» del negocio (#x-mapok) y del inmueble (#af-mapok) tiene el mismo diseño
   que la de «Mis direcciones» (v358): recuadro azul con «Sí, está bien» y «No, no aparece bien». La lista original queda
   oculta y guarda la respuesta como antes (así el administrador sigue viendo lo pendiente). Si algo falla, borra este bloque. */
(function(){
var Q={'x-mapok':'¿Google Maps muestra bien tu negocio?','af-mapok':'¿Google Maps muestra bien el inmueble?'};
function mount(s){if(s._mq)return;s._mq=1;var id=s.id,lb=document.querySelector('label[for="'+id+'"]'),hint=id==='af-mapok'?document.getElementById('af-maph'):(s.nextElementSibling&&s.nextElementSibling.matches('.qs-btn')?s.nextElementSibling.nextElementSibling:s.nextElementSibling);
 var yes=s.options[1]?s.options[1].value:'1',no=s.options[2]?s.options[2].value:'0';
 var w=document.createElement('div');w.className='adq mq';w.setAttribute('role','group');w.setAttribute('aria-label',Q[id]);
 w.innerHTML='<b>'+Q[id]+'</b><div class="adqo"><button type="button" class="chip" data-act="mapq" data-v="1" aria-pressed="false">Sí, está bien</button><button type="button" class="chip" data-act="mapq" data-v="0" aria-pressed="false">No, no aparece bien</button></div><p class="adhint mqh" hidden>El administrador lo ubicará en el mapa con el código plus de Google.</p>';
 w._s=s;w._v={'1':yes,'0':no};
 var after=hint&&hint.matches&&hint.matches('p')?hint:(s._qs||s);after.insertAdjacentElement('afterend',w);
 var off=function(x){if(x){x.hidden=true;x.style.setProperty('display','none','important')}};off(lb);if(hint&&hint.matches&&hint.matches('p'))off(hint);s.hidden=true;off(s._qs);
 paint(w)}
function paint(w){var v=w._s.value,k=v===w._v['1']?'1':v===w._v['0']?'0':'';
 [].forEach.call(w.querySelectorAll('[data-v]'),function(b){b.setAttribute('aria-pressed',String(b.dataset.v===k))});w.querySelector('.mqh').hidden=k!=='0'}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.mq [data-act="mapq"]');if(!b)return;e.preventDefault();var w=b.closest('.mq'),s=w._s;
 s.value=w._v[b.dataset.v];s.dispatchEvent(new Event('change',{bubbles:true}));paint(w)},true);
document.addEventListener('change',function(e){var s=e.target;if(s&&Q[s.id]){var w=s.parentNode&&s.parentNode.querySelector('.mq');if(w&&w._s===s)paint(w)}});
function scan(){for(var id in Q){var s=document.getElementById(id);if(s&&s.tagName==='SELECT'){if(!s._mq)mount(s);else if(s._qs&&s._qs.style.display!=='none'){s._qs.hidden=true;s._qs.style.setProperty('display','none','important')}}}}
var t=0;new MutationObserver(function(){if(t)return;t=1;requestAnimationFrame(function(){t=0;scan()})}).observe(document.documentElement,{childList:true,subtree:true});
document.head.insertAdjacentHTML('beforeend','<style id="v402-css">.mq .adqo button.chip{border-radius:0}.mq .adqo button.chip[aria-pressed=false]{background:#fff!important;color:#0071e3!important;border-color:#0071e3!important}.mq .adqo button.chip[data-v="1"][aria-pressed=true]{background:#0071e3!important;border-color:#0071e3!important;color:#fff!important}.mq .adqo button[data-v="0"][aria-pressed=true]{background:#ea580c!important;border-color:#ea580c!important;color:#fff!important}html.dark .mq .adqo button.chip[aria-pressed=false]{background:#1c1c1e!important;color:#64a8ff!important;border-color:#0a84ff!important}html.dark .mq .adqo button.chip[data-v="1"][aria-pressed=true]{background:#0a84ff!important;border-color:#0a84ff!important;color:#fff!important}html.dark .mq .adqo button[data-v="0"][aria-pressed=true]{background:#ea580c!important;border-color:#ea580c!important;color:#fff!important}.mq .mqh{margin:8px 0 0}</style>');
})();
