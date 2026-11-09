
/* v284: tabla de «Mis tiendas» (Ver, Editar, Eliminar) y orientación automática del video de YouTube de los productos.
   Si algo falla, borra este <script> y su <style>, y quita la línea «v284» de pnlModal. */
(function(){
function E(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function st(s){if(s.hidden)return '<span class="msts adm">Oculta por el administrador</span>';try{if(typeof shopLive==='function'&&!shopLive(s))return '<span class="msts off">Plan vencido: productos ocultos</span>'}catch(e){}return '<span class="msts ok">Visible</span>'}
window.shopTableHTML=function(ms){var h='<h2>Mis tiendas ('+ms.length+')</h2><button type="button" class="btn pink msnew" data-pn="1" data-act="pub" data-v="shop">+ Nueva tienda</button>'/* v292 */;
 if(!ms.length)return h+'<p class="muted">Aún no tienes tienda.</p>';
 return h+'<div class="mstw"><table class="mst"><thead><tr><th scope="col">Tienda</th><th scope="col">Productos</th><th scope="col">Acciones</th></tr></thead><tbody>'+
  ms.map(function(s){var n=(s.products||[]).length,u='';try{u=storeUrl(s.id)}catch(e){u='#'}
   var lg=s.logo&&/^(https:|data:image\/)/.test(s.logo)?'<img src="'+E(s.logo)+'" alt="" loading="lazy">':'<b>'+E(String(s.name||'?').charAt(0).toUpperCase())+'</b>';/* v292: logo de la tienda */
   return '<tr><td><span class="msti" aria-hidden="true">'+lg+'</span><b>'+E(s.name)+'</b><small>'+E(s.cat||'')+'</small>'+st(s)+'<small class="mstu">'+E(u)+'</small></td><td class="mstn">'+n+'</td><td><div class="msta"><a class="btn ghost" href="'+E(u)+'" target="_blank" rel="noopener">Ver</a><button type="button" class="btn ghost" data-stshare="'+E(s.id)+'">Compartir</button><button type="button" class="btn" data-pn="1" data-act="open" data-id="'+E(s.id)+'">Editar</button><button type="button" class="btn ghost mstd" data-shopdel="'+E(s.id)+'">Eliminar</button></div></td></tr>'}).join('')+
  '</tbody></table></div><p class="muted mstx">Al eliminar una tienda se borran también todos sus productos. No se puede deshacer.</p>'};
document.addEventListener('click',async function(e){var b=e.target.closest&&e.target.closest('[data-shopdel]');if(!b)return;e.preventDefault();var id=b.getAttribute('data-shopdel');
 try{var s=S.stores.find(function(x){return x.id===id});if(!s||!S.mine.includes(id))return;
  if(!(await askC('¿Eliminar la tienda «'+s.name+'» y todos sus productos?\nNo se puede deshacer.','Eliminar')))return;
  S.stores=S.stores.filter(function(x){return x.id!==id});S.mine=S.mine.filter(function(x){return x!==id});Object.keys(S.cart).forEach(function(k){if(k.indexOf(id+'|')===0)delete S.cart[k]});
  save();if(view==='store'&&cur===id)view='home';render();pnlModal('tiendas');toast('Tienda eliminada')}catch(x){try{toast('No se pudo eliminar. Intenta de nuevo.')}catch(y){}}});
/* video: si el enlace no es de Shorts, se preguntan las medidas a YouTube y, si es más alto que ancho, se muestra vertical */
window.ytVert=function(y){try{if(!/^https?:$/.test(location.protocol)||!/^[\w-]{6,20}$/.test(y))return;var done=0,set=function(){if(done)return;done=1;if(document.getElementById('lb')&&lb&&lb.l&&lb.l.indexOf('yt:'+y)>=0&&!lb.v){lb.v=1;lbRender()}};
 /* v289: 1) la miniatura vertical que YouTube crea para los Shorts (oardefault) — no depende de permisos de otros sitios */
 var im=new Image();im.onload=function(){if(im.naturalHeight>im.naturalWidth)set()};im.src='https://i.ytimg.com/vi/'+y+'/oardefault.jpg';
 /* 2) las medidas que da YouTube preguntando con el enlace de Shorts (con el enlace normal responde horizontal aunque sea un Short) */
 ['https://www.youtube.com/shorts/','https://www.youtube.com/watch?v='].forEach(function(u){fetch('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent(u+y)).then(function(r){return r.json()}).then(function(j){if(j&&j.height>j.width)set()}).catch(function(){})})}catch(e){}};
})();
