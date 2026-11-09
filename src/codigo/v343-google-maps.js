
/* v343: «Mapa de tiendas» con Google Maps cuando el administrador guarda la clave (Administrador → Configuración → Mapa de Google).
   Mismos marcadores con el logo de cada tienda, ventana con «Ver tienda» y cómo llegar, «Cerca de mí» y ajuste a todas las tiendas.
   Sin clave, o si Google rechaza la clave o no carga, se usa solo el mapa gratuito de siempre (OpenStreetMap).
   La clave de Google Maps para páginas web es pública por diseño: protégela restringiéndola a mipradera.com.co en Google Cloud.
   Si algo falla, borra este bloque: mapInit sigue con OpenStreetMap. */
(function(){
var bad=0,ld=null;
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function gkey(){try{return String((S.site||{}).gmKey||'').trim()}catch(e){return ''}}
function load(k){if(window.google&&google.maps&&google.maps.Map)return Promise.resolve();if(ld)return ld;
 ld=new Promise(function(ok,no){window.__gmOk=function(){ok()};window.gm_authFailure=function(){fallback()};
  var s=document.createElement('script');s.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(k)+'&v=weekly&loading=async&language=es&region=CO&callback=__gmOk';s.async=true;
  s.onerror=function(){ld=null;no(new Error('gm'))};document.head.appendChild(s);setTimeout(function(){if(!(window.google&&google.maps&&google.maps.Map))no(new Error('tiempo'))},15000)});return ld}
function fallback(){bad=1;try{if(view!=='map')return;var el=document.getElementById('all-map');if(!el)return;var n=el.cloneNode(false);n.removeAttribute('data-gm');el.parentNode.replaceChild(n,el);mapInit()}catch(e){}}
function draw(el){if(document.getElementById('all-map')!==el||view!=='map')return;var G=google.maps;
 var M=new G.Map(el,{center:{lat:(myLL||PRADERA)[0],lng:(myLL||PRADERA)[1]},zoom:14,clickableIcons:false,streetViewControl:false,mapTypeControl:false,fullscreenControl:false,gestureHandling:'greedy'});
 function HM(pos,html,cls,fn){this.p=new G.LatLng(pos[0],pos[1]);this.h=html;this.k=cls;this.f=fn}
 HM.prototype=new G.OverlayView();
 HM.prototype.onAdd=function(){var d=this.d=document.createElement('div'),me=this;d.className=this.k;d.innerHTML=this.h;if(this.f){d.setAttribute('role','button');d.tabIndex=0;d.addEventListener('click',function(e){e.stopPropagation();me.f()})}this.getPanes().overlayMouseTarget.appendChild(d)};
 HM.prototype.draw=function(){var pt=this.getProjection().fromLatLngToDivPixel(this.p);if(pt&&this.d){this.d.style.left=pt.x+'px';this.d.style.top=pt.y+'px'}};
 HM.prototype.onRemove=function(){if(this.d)this.d.remove()};
 var iw=new G.InfoWindow(),b=new G.LatLngBounds(),n=0;
 if(myLL)new HM(myLL,'<span title="Estás aquí"></span>','gme').setMap(M);
 mapStores().forEach(function(s){var d=document.createElement('div'),bt=document.createElement('button');
  d.className='gmiw';d.innerHTML='<b>'+E(s.name)+'</b><br>'+E(s.cat)+(s.zone?' · '+E(s.zone):'')+(myLL?' · '+kmTxt(kmTo(s)):'')+'<br>';
  bt.className='btn';bt.textContent='Ver tienda';bt.onclick=function(){view='store';cur=s.id;render()};d.appendChild(bt);d.insertAdjacentHTML('beforeend','<br>'+routeLinks(s));
  var pos=new G.LatLng(s.lat,s.lng);b.extend(pos);n++;
  new HM([s.lat,s.lng],'<span class="mp" style="--c:'+catOf(s.cat)[2]+'" title="'+E(s.name)+'">'+avatar(s)+'</span>','gmk',function(){iw.setContent(d);iw.setPosition(pos);iw.setOptions({pixelOffset:new G.Size(0,-46)});iw.open({map:M})}).setMap(M)});
 if(myLL){M.setCenter({lat:myLL[0],lng:myLL[1]});M.setZoom(15)}
 else if(n>1){M.fitBounds(b,40);G.event.addListenerOnce(M,'idle',function(){if(M.getZoom()>17)M.setZoom(17)})}
 else if(n===1){M.setCenter(b.getCenter());M.setZoom(16)}}
window.gmInit=function(el){var k=gkey();if(bad||!k||!el)return false;el.setAttribute('data-gm','1');
 load(k).then(function(){try{draw(el)}catch(e){fallback()}}).catch(function(){fallback()});return true};
/* administración: tarjeta en Configuración */
window.gmAdmin=function(){var k=gkey();return '<div class="cg gmadm"><h3>Mapa de Google</h3><p class="muted">Con la clave de Google Maps, el «Mapa de tiendas» se ve con Google Maps. Sin clave se usa el mapa gratuito de OpenStreetMap. Ahora se usa: <b>'+(k?(bad?'OpenStreetMap (Google rechazó la clave)':'Google Maps'):'OpenStreetMap')+'</b>.</p>'+
 '<label for="gm-k">Clave de Google Maps (Maps JavaScript API)</label><input id="gm-k" type="text" maxlength="60" autocomplete="off" spellcheck="false" value="'+E(k)+'" placeholder="AIza…">'+
 '<details class="gmhow"><summary>Cómo crear la clave gratis y sin sorpresas</summary><ol>'+
 '<li>Entra a <a href="https://console.cloud.google.com/" target="_blank" rel="noopener">console.cloud.google.com</a>, crea un proyecto y activa la facturación (Google pide una tarjeta, pero las primeras 10.000 cargas del mapa al mes son gratis).</li>'+
 '<li>En <b>APIs y servicios → Biblioteca</b>, busca <b>Maps JavaScript API</b> y tócala en <b>Habilitar</b>.</li>'+
 '<li>En <b>APIs y servicios → Credenciales</b>, toca <b>Crear credenciales → Clave de API</b>.</li>'+
 '<li>Edita la clave: en <b>Restricciones de aplicación</b> elige <b>Sitios web</b> y agrega <b>mipradera.com.co/*</b> y <b>*.mipradera.com.co/*</b>. En <b>Restricciones de API</b> deja solo <b>Maps JavaScript API</b>. Guarda.</li>'+
 '<li>Para no pasar de lo gratis: en <b>APIs y servicios → Maps JavaScript API → Cuotas</b>, pon <b>Map loads per day</b> en <b>300</b>.</li>'+
 '<li>Copia la clave (empieza por AIza) y pégala aquí.</li></ol></details>'+
 '<p class="err" id="gm-err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-gmsave="1">Guardar clave</button>'+(k?'<button type="button" class="btn ghost" data-gmsave="0">Quitar y usar OpenStreetMap</button>':'')+'</div></div>'};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-gmsave]');if(!b)return;var er=document.getElementById('gm-err'),v='';
 if(b.dataset.gmsave==='1'){v=(document.getElementById('gm-k')||{value:''}).value.trim();if(!/^AIza[0-9A-Za-z_-]{35}$/.test(v)){if(er)er.textContent='Esa no parece una clave de Google Maps: empieza por AIza y tiene 39 caracteres.';return}}
 try{S.site=Object.assign({},S.site,{gmKey:v});bad=0;save();render(true);toast(v?'Clave guardada: el mapa de tiendas usará Google Maps':'Se quitó la clave: el mapa usa OpenStreetMap')}catch(x){if(er)er.textContent='No se pudo guardar. Intenta de nuevo.'}});
})();
