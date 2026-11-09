
/* v312: en «Mi cuenta», «Mis anuncios» se divide en dos tablas como la de «Mis tiendas»:
   «Mis inmuebles» (arriendo y venta) y «Mis vehículos», con foto, precio, estado y Ver, Compartir, Editar,
   Vendido/Arrendado, Renovar y Eliminar. Si algo falla, borra este bloque y vuelve a poner el renglón «Mis anuncios» en pnlMenu. */
(function(){
function E(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var KV={inmuebles:['arr','casa'],vehiculos:['veh']};
window.adMine=function(v){return S.ads.filter(function(a){return S.myAds.includes(a.id)&&KV[v].indexOf(a.type)>=0})};
function stat(a){if(a.hidden)return '<span class="msts adm">Oculto por el administrador</span>';
 if(a.closed)return '<span class="msts off">'+(a.type==='arr'?'Arrendado':'Vendido')+' · no se muestra</span>';
 var d=daysLeft(a);if(d<=0)return '<span class="msts off">Vencido · no se muestra</span>';
 return '<span class="msts '+(d<=7?'wait':'ok')+'">Visible · '+(d===1?'vence mañana':'vence en '+d+' días')+'</span>'}
window.adTableHTML=function(v){var l=adMine(v),veh=v==='vehiculos';
 var h='<h2>'+(veh?'Mis vehículos':'Mis inmuebles')+' ('+l.length+')</h2><button type="button" class="btn pink msnew" data-pn="1" data-act="pubAsk" data-v="'+(veh?'veh':'arr')+'">'+(veh?'+ Nuevo vehículo':'+ Nuevo inmueble')+'</button>';
 if(!l.length)return h+'<p class="muted">'+(veh?'Aún no tienes vehículos publicados.':'Aún no tienes inmuebles publicados.')+'</p>';
 return h+'<div class="mstw"><table class="mst"><thead><tr><th scope="col">'+(veh?'Vehículo':'Inmueble')+'</th><th scope="col">Precio</th><th scope="col">Acciones</th></tr></thead><tbody>'+
  l.map(function(a){var im=pimgs(a)[0],u='';try{u=adUrl(a.id)}catch(e){}var d=daysLeft(a);
   var ph=im&&/^(https:|data:image\/)/.test(im)?'<img src="'+E(im)+'" alt="" loading="lazy">':'<b>'+E(String(a.title||'?').charAt(0).toUpperCase())+'</b>';
   var kind=a.type==='arr'?'Arriendo':a.type==='casa'?'Venta':'Venta de vehículo';
   return '<tr><td><span class="msti ph" aria-hidden="true">'+ph+'</span><b>'+E(a.title||'Sin título')+'</b><small>'+E(kind+(a.zone?' · '+a.zone:''))+'</small>'+stat(a)+'</td>'+
    '<td class="mstp">'+(Number(a.price)>0?E(money(a.price))+(a.type==='arr'?'<small>al mes</small>':''):'—')+'</td>'+
    '<td><div class="msta"><button type="button" class="btn ghost" data-pn="1" data-act="openAd" data-id="'+E(a.id)+'">Ver</button>'+
    '<button type="button" class="btn ghost" data-pn="1" data-act="share" data-k="ad" data-id="'+E(a.id)+'">Compartir</button>'+
    '<button type="button" class="btn" data-pn="1" data-act="editAd" data-id="'+E(a.id)+'">Editar</button>'+
    (d<=7?'<button type="button" class="btn ghost" data-adt="renew" data-id="'+E(a.id)+'" data-v="'+v+'">Renovar '+AD_DAYS+' días</button>':'')+
    '<button type="button" class="btn ghost" data-adt="close" data-id="'+E(a.id)+'" data-v="'+v+'">'+(a.closed?'Publicar de nuevo':(a.type==='arr'?'Ya lo arrendé':'Ya lo vendí'))+'</button>'+
    '<button type="button" class="btn ghost mstd" data-adt="del" data-id="'+E(a.id)+'" data-v="'+v+'">Eliminar</button></div></td></tr>'}).join('')+
  '</tbody></table></div><p class="muted mstx">Cada anuncio dura '+AD_DAYS+' días; renuévalo para que siga a la vista. Al eliminarlo no se puede deshacer.</p>'};
document.addEventListener('click',async function(e){var b=e.target.closest&&e.target.closest('[data-adt]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 var id=b.dataset.id,v=b.dataset.v,k=b.dataset.adt,a=S.ads.find(function(x){return x.id===id});if(!a||!S.myAds.includes(id))return;
 try{
  if(k==='del'){if(!(await askC('¿Eliminar «'+(a.title||'este anuncio')+'»?\nNo se puede deshacer.','Eliminar')))return pnlModal(v);
   S.ads=S.ads.filter(function(x){return x.id!==id});S.myAds=S.myAds.filter(function(x){return x!==id});S.favs=S.favs.filter(function(f){return f!=='ad:'+id});save();if(view==='ad'&&curAd===id)view='home';render(true);pnlModal(v);return toast('Anuncio eliminado')}
  if(k==='close'){a.closed=!a.closed;save();render(true);pnlModal(v);return toast(a.closed?(a.type==='arr'?'Marcado como arrendado':'Marcado como vendido'):'Anuncio publicado de nuevo')}
  if(k==='renew'){a.renewed=Date.now();save();render(true);pnlModal(v);return toast('Anuncio renovado por '+AD_DAYS+' días')}
 }catch(x){try{toast('No se pudo guardar. Intenta de nuevo.')}catch(y){}}},true);
})();
