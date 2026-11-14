/* v409: en el anuncio de un inmueble (arriendo o venta) el visitante ve «Ubicación»: el mapa de Google Maps de la dirección
   que puso el dueño (v396) y el enlace «Abrir en Google Maps». Usa el punto que guardó el administrador (a.lat, a.lng o a.plus)
   y, si no hay, la dirección con el barrio. Si el dueño respondió «No lo ubica bien» y el administrador aún no lo ha ubicado,
   no se muestra el mapa (marcaría otro lugar). Si algo falla, borra este bloque. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var NO='No lo ubica bien',PR='Pradera, Valle del Cauca';
function gq(a){var f=a.f||{},dir=String(f.addr||'').trim();
 if(a.lat!=null&&a.lng!=null)return a.lat+','+a.lng;
 if(a.plus)return /\s/.test(a.plus)?a.plus:a.plus+' '+PR;
 if(!dir||f.mapok===NO)return '';
 return [dir,a.zone,PR].filter(Boolean).join(', ')}
function mount(){var w=document.querySelector('#app article.adview');if(!w||w.querySelector('.advmap'))return;
 var a=null;try{a=view==='ad'?S.ads.find(function(x){return x.id===curAd}):null}catch(e){}
 if(!a||(a.type!=='arr'&&a.type!=='casa'))return;var q=gq(a);if(!q)return;
 var h='<div class="advmap"><h3>Ubicación</h3><div class="admap"><iframe title="Mapa de la ubicación del inmueble" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="'+E('https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=17&output=embed')+'"></iframe></div>'+
  '<a class="btn ghost" href="'+E('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q))+'" target="_blank" rel="noopener">Abrir en Google Maps</a></div>';
 var by=null;[].forEach.call(w.children,function(c){if(!by&&c.classList.contains('cg'))by=c});
 if(by)by.insertAdjacentHTML('beforebegin',h);else w.insertAdjacentHTML('beforeend',h)}
var t=0;new MutationObserver(function(){if(t)return;t=1;requestAnimationFrame(function(){t=0;mount()})}).observe(document.documentElement,{childList:true,subtree:true});
document.head.insertAdjacentHTML('beforeend','<style id="v409-css">.advmap h3{margin:0 0 4px}.advmap .admap{margin:6px 0 8px}.advmap .btn{display:inline-block;text-decoration:none}html.dark .advmap .admap{border-color:#3a3a3c;background:#1c1c1e}</style>');
})();
