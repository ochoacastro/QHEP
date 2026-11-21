/* v445: el «Mapa» también muestra los arriendos y los inmuebles en venta. Arriba del mapa, «Mostrar»: Tiendas (como antes),
   Arriendos e inmuebles en venta, Solo arriendos o Solo ventas. Cada inmueble con punto (a.lat/a.lng o el código plus a.plus que pone
   el administrador, v396) sale con un pin de casa; al tocarlo: título, precio, barrio, distancia (con «Cerca de mí») y «Ver anuncio».
   Debajo del mapa, la lista; los que aún no tienen punto se cuentan aparte. El filtro de barrio y «Cerca de mí» siguen igual.
   Con inmuebles se usa siempre el mapa gratuito (OpenStreetMap); las tiendas siguen como estaban (también con Google Maps).
   El programa principal se carga al final de la página: se espera a que existan mapView y mapInit para ampliarlos.
   Si algo falla, borra este bloque: el mapa vuelve a ser solo de tiendas. */
(function(){
var modo='',mapView0=null,mapInit0=null,am2=null;
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var COL={arr:'#0f766e',casa:'#7c3aed'};
var CASA='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>';
var OPS=[['','Tiendas'],['inm','Arriendos e inmuebles en venta'],['arr','Solo arriendos'],['casa','Solo ventas']];
function ll(a){if(a.lat!=null&&a.lng!=null&&isFinite(a.lat)&&isFinite(a.lng))return [+a.lat,+a.lng];var c=null;try{c=a.plus&&plusLL(a.plus)}catch(e){}return c&&isFinite(c[0])&&isFinite(c[1])?[c[0],c[1]]:null}
function tipoOk(a){return modo==='inm'?(a.type==='arr'||a.type==='casa'):a.type===modo}
function todos(){try{return S.ads.filter(function(a){return tipoOk(a)&&vis(a)&&!a.closed&&!expired(a)&&znOk(a.zone,zoneF)})}catch(e){return []}}
function precio(a){try{return String(adPrice(a)||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()}catch(e){return ''}}
function km(p){try{return myLL?kmTo({lat:p[0],lng:p[1]}):0}catch(e){return 0}}
function conPunto(){var l=todos().map(function(a){return {a:a,p:ll(a)}}).filter(function(x){return x.p});
 return myLL?l.sort(function(x,y){return km(x.p)-km(y.p)}):l.sort(function(x,y){return String(x.a.title||'').localeCompare(String(y.a.title||''),'es')})}
function nombre(a){return a.type==='arr'?'Arriendo':'Venta'}
function sel(){return '<label for="m-que">Mostrar</label><select id="m-que">'+OPS.map(function(o){return '<option value="'+o[0]+'"'+(modo===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select>'}
function lista(l){if(!l.length)return '';return '<div class="mlist" role="list" aria-label="'+(myLL?'Inmuebles por cercanía':'Inmuebles en el mapa')+'">'+l.map(function(x){var a=x.a;
 return '<div class="mrow" role="listitem" style="--c:'+COL[a.type]+'"><span class="mav mih" style="background:'+COL[a.type]+'">'+CASA+'</span><span class="mi"><b>'+E(a.title||'(sin título)')+'</b><span class="muted">'+E([nombre(a),precio(a),a.zone,myLL?kmTxt(km(x.p)):''].filter(Boolean).join(' · '))+'</span></span><button class="chip" data-act="openAd" data-id="'+E(a.id)+'">Ver</button></div>'}).join('')+'</div>'}
function vista(){var l=conPunto(),n=l.length,sin=todos().length-n,t=modo==='arr'?'arriendos':modo==='casa'?'inmuebles en venta':'arriendos e inmuebles en venta';
 return (typeof tabs==='function'?tabs():'')+'<div class="shead"><div><h2>Mapa de '+t+'</h2><p class="muted">Encuentra casas, apartamentos, locales y lotes de Pradera según su ubicación. Toca un pin para ver el anuncio.</p></div></div>'+
  '<div class="mtool">'+sel()+'<label for="m-zone">Barrio</label><select id="m-zone" data-sel="zone"><option value="">Todos</option>'+znOpts(zonesOf(S.ads.filter(function(a){return (a.type==='arr'||a.type==='casa')&&vis(a)})),zoneF)+'</select><button class="chip" data-act="near" aria-pressed="'+(!!myLL)+'">📍 Cerca de mí</button></div>'+
  '<p class="muted" id="near-st" aria-live="polite"></p><div id="all-map" role="region" aria-label="Mapa con los '+t+' de Pradera"></div>'+
  '<p class="muted" aria-live="polite">'+n+' '+(n===1?'inmueble ubicado':'inmuebles ubicados')+' en el mapa.'+(sin>0?' '+sin+' aún no '+(sin===1?'tiene':'tienen')+' su punto en el mapa.':'')+'</p>'+lista(l)}
async function iniciar(){var el=document.getElementById('all-map');if(!el)return;try{await loadLeaflet()}catch(e){el.innerHTML='<div class="empty">No se pudo cargar el mapa. Revisa tu conexión e intenta de nuevo.</div>';return}
 if(document.getElementById('all-map')!==el||view!=='map'||!modo)return;var M=am2=L.map(el).setView(myLL||PRADERA,14);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(M);
 var lay=M;try{await loadCluster();if(am2!==M)return;lay=L.markerClusterGroup({maxClusterRadius:45,showCoverageOnHover:false}).addTo(M)}catch(e){if(am2!==M)return}
 if(myLL)L.circleMarker(myLL,{radius:8,color:'#fff',weight:3,fillColor:'#1a73e8',fillOpacity:1}).addTo(M).bindTooltip('Estás aquí');
 var pts=[];conPunto().forEach(function(x){var a=x.a,m=L.marker(x.p,{title:a.title||'',icon:L.divIcon({className:'mpw',html:'<span class="mp mph" style="--c:'+COL[a.type]+'">'+CASA+'</span>',iconSize:[40,48],iconAnchor:[20,46],popupAnchor:[0,-44]})}).addTo(lay);
  var im='';try{im=pimgs(a)[0]||''}catch(e){}
  m.bindPopup('<div class="mpop">'+(im?'<img src="'+E(im)+'" alt="" loading="lazy">':'')+'<b>'+E(a.title||'')+'</b><br>'+E([nombre(a),precio(a)].filter(Boolean).join(' · '))+'<br>'+E([a.zone,myLL?kmTxt(km(x.p)):''].filter(Boolean).join(' · '))+'<br><button type="button" class="btn" data-act="openAd" data-id="'+E(a.id)+'">Ver anuncio</button></div>');pts.push(x.p)});
 if(myLL)M.setView(myLL,15);else if(pts.length>1)M.fitBounds(pts,{padding:[30,30],maxZoom:17});else if(pts.length===1)M.setView(pts[0],16);M.invalidateSize()}
function inst(){if(mapView0)return true;if(typeof mapView!=='function'||typeof mapInit!=='function')return false;mapView0=mapView;mapInit0=mapInit;
 mapView=function(){if(modo)return vista();return mapView0.apply(this,arguments).replace('<div class="mtool">','<div class="mtool">'+sel())};
 mapInit=function(){if(modo)return iniciar();return mapInit0.apply(this,arguments)};
 try{if(view==='map')render()}catch(e){}return true}
if(!inst()){document.addEventListener('DOMContentLoaded',inst);var k0=0,iv=setInterval(function(){if(inst()||++k0>200)clearInterval(iv)},50)}
document.addEventListener('change',function(e){if(!e.target||e.target.id!=='m-que')return;modo=e.target.value;try{render()}catch(x){}var s=document.getElementById('m-que');if(s)s.focus()});
/* «Ver inmuebles» del mapa desde otras partes: window.qhMapaInmuebles('arr') abre el mapa ya filtrado */
window.qhMapaInmuebles=function(t){modo=t||'inm';view='map';try{render();scrollTo(0,0)}catch(e){}};
document.head.insertAdjacentHTML('beforeend','<style id="v445-css">.mp.mph{display:grid;place-items:center;background:var(--c)}.mp.mph svg{display:block}.mav.mih{display:grid;place-items:center}.mpop{max-width:220px}.mpop img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;margin-bottom:6px}.mpop .btn{margin-top:6px}</style>');
})();
