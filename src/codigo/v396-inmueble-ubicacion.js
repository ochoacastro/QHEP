/* v396: dirección del inmueble (arriendo o venta). En el formulario, debajo de «Dirección del inmueble» (af-addr) se ve el mapa de
   Google Maps y el dueño responde «¿Google Maps ubica bien el inmueble?» (af-mapok). No se llena con la dirección personal.
   Si responde «No lo ubica bien», el administrador lo ve en Usuarios → «Inmuebles por ubicar en el mapa» y le pone el código plus
   (a.plus, a.lat, a.lng); al guardarlo la respuesta pasa a «Sí, lo ubica bien». Si algo falla, borra este bloque. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var NO='No lo ubica bien',SI='Sí, lo ubica bien',PR='Pradera, Valle del Cauca';
function v(id){var x=document.getElementById(id);return x?x.value.trim():''}
function cur(){try{return af&&af.id?S.ads.find(function(a){return a.id===af.id}):null}catch(e){return null}}
function gq(a,dir,zone){if(a&&dir===String((a.f||{}).addr||'').trim()){if(a.lat!=null&&a.lng!=null)return a.lat+','+a.lng;if(a.plus)return /\s/.test(a.plus)?a.plus:a.plus+' '+PR}
 return dir?[dir,zone,PR].filter(Boolean).join(', '):''}
function draw(){var el=document.getElementById('af-map');if(!el)return;var q=gq(cur(),v('af-addr'),v('af-zone'));
 if(!q){el.innerHTML='<p class="adhint" style="padding:14px">Escribe la dirección del inmueble y aquí verás el lugar en Google Maps.</p>';el.dataset.q='';return}
 if(el.dataset.q===q)return;el.dataset.q=q;
 el.innerHTML='<iframe title="Mapa de la dirección del inmueble" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="'+E('https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=17&output=embed')+'"></iframe>'}
function mount(){var i=document.getElementById('af-addr');if(!i||document.getElementById('af-map'))return;var w=i.closest('.fw')||i;
 w.insertAdjacentHTML('afterend','<div class="admap" id="af-map"></div>');
 var s=document.getElementById('af-mapok'),sw=s&&(s.closest('.fw')||s);if(sw&&!document.getElementById('af-maph'))sw.insertAdjacentHTML('beforeend','<p class="muted" id="af-maph">Mira el mapa: si no marca el inmueble en el lugar correcto, elige «No lo ubica bien»: el administrador lo ubicará en el mapa.</p>');
 draw()}
var T;function later(){clearTimeout(T);T=setTimeout(draw,900)}
function onEv(e){var t=e.target;if(!t||!document.getElementById('af-map'))return;if(t.id==='af-addr'||t.id==='af-zone'||(t.classList&&t.classList.contains('znsel')))later()}
document.addEventListener('input',onEv);document.addEventListener('change',onEv);
new MutationObserver(function(){if(document.getElementById('af-addr')&&!document.getElementById('af-map'))mount()}).observe(document.documentElement,{childList:true,subtree:true});
/* ---- administrador ---- */
function ll(t){var c=null;try{c=plusLL(t)}catch(e){}if(!c)return null;var a=Array.isArray(c)?c:[c.lat,c.lng];return isFinite(a[0])&&isFinite(a[1])?[Math.round(a[0]*1e6)/1e6,Math.round(a[1]*1e6)/1e6]:null}
function maps(a){var q=[(a.f||{}).addr,a.zone,PR].filter(Boolean).join(', ');return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q)}
function pend(){try{return (S.ads||[]).filter(function(a){return (a.type==='arr'||a.type==='casa')&&a.f&&a.f.mapok===NO})}catch(e){return []}}
window.admAdPend=function(){var L=pend();if(!L.length)return '';
 return '<div class="cg aadp"><h3>Inmuebles por ubicar en el mapa <em>'+L.length+'</em></h3><p class="muted">Sus dueños dicen que Google Maps no muestra bien el inmueble. Búscalo, copia el código plus y guárdalo en «Poner código plus».</p>'+
  L.map(function(a){return '<div class="aadr pend"><b>'+E(a.title||'(sin título)')+' · '+(a.type==='arr'?'Arriendo':'Venta')+(a.wa?' · '+E(a.wa):'')+'</b><p>'+E([(a.f||{}).addr,a.zone].filter(Boolean).join(', ')||'Sin dirección')+'</p><div class="row"><a class="btn ghost" href="'+E(maps(a))+'" target="_blank" rel="noopener">Buscar en Google Maps</a><button type="button" class="btn pink" data-adplus="'+E(a.id)+'">Poner código plus</button></div></div>'}).join('')+'</div>'};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-adplus],[data-adplusok]');if(!b||typeof MODE==='undefined'||MODE!=='admin')return;e.preventDefault();e.stopImmediatePropagation();
 var id=b.dataset.adplus||b.dataset.adplusok,a=(S.ads||[]).find(function(x){return x.id===id});if(!a)return toast('No se encontró el inmueble.');
 if(b.dataset.adplus){modal('<h2>Ubicar inmueble en el mapa</h2><p><b>'+E(a.title||'')+'</b>'+(a.wa?' · '+E(a.wa):'')+'</p><p class="muted">'+E([(a.f||{}).addr,a.zone].filter(Boolean).join(', '))+'</p><p><a class="btn ghost" href="'+E(maps(a))+'" target="_blank" rel="noopener">Buscar en Google Maps</a></p>'+
  '<label for="ip-plus">Código plus de Google Maps</label><input id="ip-plus" type="text" maxlength="80" value="'+E(a.plus||'')+'" placeholder="Ej: CQ94+H47 Pradera, Valle del Cauca"><p class="adhint">En Google Maps mantén presionado el inmueble y copia el código plus (por ejemplo CQ94+H47).</p>'+
  '<p class="err" id="err"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-adplusok="'+E(id)+'">Guardar ubicación</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>');return}
 var t=v('ip-plus').replace(/\s+/g,' '),c=ll(t),er=document.getElementById('err');if(!c){if(er)er.textContent='Ese no parece un código plus válido. Cópialo de Google Maps (ej: CQ94+H47 Pradera, Valle del Cauca).';return}
 a.plus=t.slice(0,80);a.lat=c[0];a.lng=c[1];a.f.mapok=SI;save();closeModal(1);toast('Ubicación del inmueble guardada');setTimeout(function(){try{render(true)}catch(x){}},300)},true);
})();
