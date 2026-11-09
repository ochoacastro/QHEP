/* v395: en el formulario del negocio, debajo de la dirección, se muestra el mapa de Google Maps (#x-map) para que el dueño
   vea si marca bien su negocio y responda la pregunta «¿Google Maps ubica bien tu negocio?». Se actualiza mientras escribe
   la dirección o cambia el barrio. Si la dirección no cambió y el administrador ya puso el código plus, muestra ese punto.
   Si algo falla, borra este bloque y el <div id="x-map"> de 09-rateform.js. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function v(id){var x=document.getElementById(id);return x?x.value.trim():''}
function draw(){var el=document.getElementById('x-map');if(!el)return;var dir=v('x-addr'),q='';
 if(dir===(el.dataset.a0||'').trim()){var la=v('x-lat'),ln=v('x-lng'),pl=v('x-plus');q=la&&ln?la+','+ln:pl?(/\s/.test(pl)?pl:pl+' Pradera, Valle del Cauca'):''}
 if(!q&&dir)q=[dir,v('x-zone'),'Pradera, Valle del Cauca'].filter(Boolean).join(', ');
 if(!q){el.innerHTML='<p class="adhint" style="padding:14px">Escribe la dirección del negocio y aquí verás el lugar en Google Maps.</p>';el.dataset.q='';return}
 if(el.dataset.q===q)return;el.dataset.q=q;
 el.innerHTML='<iframe title="Mapa de la dirección del negocio" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="'+E('https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=17&output=embed')+'"></iframe>'}
var T;function later(){clearTimeout(T);T=setTimeout(draw,900)}
function onEv(e){var t=e.target;if(!t||!document.getElementById('x-map'))return;if(t.id==='x-addr'||t.id==='x-zone'||(t.classList&&t.classList.contains('znsel')))later()}
document.addEventListener('input',onEv);document.addEventListener('change',onEv);
new MutationObserver(function(){var el=document.getElementById('x-map');if(el&&!el.firstChild)draw()}).observe(document.documentElement,{childList:true,subtree:true});
})();
