
/* v335: el administrador edita los datos de contacto de las tiendas de cada usuario (Usuarios → tarjeta de la persona):
   teléfono / WhatsApp, otro teléfono, barrio o corregimiento, dirección y código plus de Google Maps (con él se ubica en el mapa).
   La dirección personal de entrega no se puede editar desde aquí: se guarda solo en el teléfono de cada persona. Si algo falla, borra este bloque. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var IC='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
function isAdm(){return typeof MODE!=='undefined'&&MODE==='admin'&&typeof adm!=='undefined'&&adm}
window.admShops=function(k){var l=(S.stores||[]).filter(function(s){return s.ownerKey===k});if(!l.length)return '';
 return '<div class="admsh"><b>Tiendas</b>'+l.map(function(s){return '<div class="admsr"><span><b>'+E(s.name||'(sin nombre)')+'</b><small>'+E([s.wa,s.addr,s.zone].filter(Boolean).join(' · ')||'Sin teléfono ni dirección')+'</small></span><button type="button" class="btn ghost" data-admshop="'+E(s.id)+'">'+IC+'Editar datos</button></div>'}).join('')+'</div>'};
function form(s){modal('<h2>Datos de la tienda</h2><p class="muted"><b>'+E(s.name||'')+'</b><br>Cambia el teléfono, la dirección o el código plus. El dueño verá los cambios en su tienda.</p>'+
 '<h3 class="adsh" style="border-top:0;padding-top:0">Teléfonos</h3><label for="as-wa">Teléfono / WhatsApp del negocio</label><input id="as-wa" type="tel" inputmode="tel" maxlength="20" value="'+E(s.wa||'')+'">'+
 '<label for="as-wa2">Otro teléfono (opcional)</label><input id="as-wa2" type="tel" inputmode="tel" maxlength="20" value="'+E(s.wa2||'')+'">'+
 '<h3 class="adsh">Ubicación</h3><label for="x-zone">Barrio o corregimiento</label><input id="x-zone" type="text" maxlength="40" value="'+E(s.zone||'')+'">'+
 '<label for="as-addr">Dirección</label><input id="as-addr" type="text" maxlength="100" value="'+E(s.addr||'')+'" placeholder="Ej: Calle 5 #8-20">'+
 '<label for="as-plus">Código plus de Google Maps</label><input id="as-plus" type="text" maxlength="80" value="'+E(s.plus||'')+'" placeholder="Ej: CQ94+H47 Pradera, Valle del Cauca">'+
 '<p class="adhint" id="as-ll">'+(s.lat!=null?'Ubicación en el mapa guardada. <a href="https://www.google.com/maps/search/?api=1&amp;query='+s.lat+','+s.lng+'" target="_blank" rel="noopener">Ver en Google Maps</a>':'Sin ubicación en el mapa. Con el código plus queda ubicada.')+'</p>'+
 '<p class="err" id="err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-admshopsave="'+E(s.id)+'">Guardar</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>')}
function ll(t){var c=null;try{c=plusLL(t)}catch(e){}if(!c)return null;var a=Array.isArray(c)?c:[c.lat,c.lng];return isFinite(a[0])&&isFinite(a[1])?[Math.round(a[0]*1e6)/1e6,Math.round(a[1]*1e6)/1e6]:null}
document.addEventListener('input',function(e){if(!e.target||e.target.id!=='as-plus')return;var p=document.getElementById('as-ll'),v=e.target.value.trim(),c=ll(v),er=document.getElementById('err');if(er)er.textContent='';if(!p)return;
 p.innerHTML=!v?'Sin código plus: se mantiene la ubicación que ya tenía.':c?'Código válido. <a href="https://www.google.com/maps/search/?api=1&amp;query='+c[0]+','+c[1]+'" target="_blank" rel="noopener">Revisar en Google Maps</a>':'Aún no es un código plus válido (ej: CQ94+H47).'});
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-admshop],[data-admshopsave]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 if(!isAdm())return toast('Solo el administrador puede hacer esto.');
 var id=b.dataset.admshop||b.dataset.admshopsave,s=(S.stores||[]).find(function(x){return x.id===id});if(!s)return toast('No se encontró la tienda.');
 if(b.dataset.admshop)return form(s);
 var g=function(i){var x=document.getElementById(i);return x?x.value.trim().replace(/\s+/g,' '):''},er=document.getElementById('err');
 var wa=telCO(g('as-wa')),wa2=telCO(g('as-wa2'))/* v346 */,pl=g('as-plus');
 if(wa.length<7)return er.textContent='Escribe el teléfono o WhatsApp del negocio.';if(wa2&&wa2.length<7)return er.textContent='El otro teléfono está incompleto.';
 var c=pl?ll(pl):null;if(pl&&!c)return er.textContent='El código plus no es válido. Cópialo de Google Maps (ej: CQ94+H47 Pradera, Valle del Cauca).';
 s.wa=wa.slice(0,15);s.wa2=wa2.slice(0,15);s.zone=g('x-zone').slice(0,40);s.addr=g('as-addr').slice(0,100);s.plus=pl.slice(0,80);if(c){s.lat=c[0];s.lng=c[1]}
 save();closeModal(1);toast('Datos de la tienda guardados');try{render(true)}catch(x){}},true);
document.head.insertAdjacentHTML('beforeend','<style id="v335-css">.admsh{margin:4px 0 8px}.admsh>b{display:block;margin-bottom:6px}.admsr{display:flex;align-items:center;gap:10px;justify-content:space-between;padding:8px 0;border-top:1px solid var(--line2,#d2d2d7)}.admsr span{min-width:0}.admsr small{display:block;opacity:.75;overflow-wrap:anywhere}.admsr .btn{flex:none;min-height:40px;padding:6px 12px;font-size:14px;display:inline-flex;gap:6px;align-items:center}</style>');
})();
