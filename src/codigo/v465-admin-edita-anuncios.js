/* v465: EL ADMINISTRADOR EDITA LOS ANUNCIOS DE LOS USUARIOS (arriendos, casas en venta y vehículos), para corregir cualquier error.
   - En Administrador → Publicaciones, cada anuncio tiene «Editar» (data-admedad) y cada tienda «Editar», que abre la edición
     completa de la v441 (data-admedit).
   - En el anuncio abierto, el administrador ve «Editar anuncio (administrador)».
   Abre el mismo formulario del dueño (adForm) con todo: fotos, precio, habitaciones, servicios, dirección, referencia, WhatsApp…
   Al guardar se cambian solo esos datos: el anuncio conserva su dueño (ownerKey y ownerUid) y su fecha, y las reglas ya dejan
   escribir al administrador. Los servicios (oficios) y los clasificados no están incluidos.
   Si algo falla, quita este archivo de src/orden.json y los botones data-admedad / data-admedit de 11-profilemodal.js (línea 33). */
(function(){
function isAdm(){return typeof MODE!=='undefined'&&MODE==='admin'&&typeof adm!=='undefined'&&adm}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-admedad]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 if(!isAdm())return toast('Solo el administrador puede hacer esto.');
 var a=(S.ads||[]).find(function(x){return x.id===b.dataset.admedad});if(!a)return toast('El anuncio ya no existe.');
 try{closeModal(1)}catch(x){}adForm(a.type,a)},true);
/* botón dentro del anuncio abierto */
function mount(){if(!isAdm())return;var w=document.querySelector('#app article.adview');if(!w||w.querySelector('[data-admedad]'))return;
 var a=null;try{a=view==='ad'?S.ads.find(function(x){return x.id===curAd}):null}catch(e){}if(!a)return;
 if(w.querySelector('[data-act="editAd"]'))return;/* si el administrador es el dueño ya tiene su botón */
 var r=document.createElement('div');r.className='row adme';r.innerHTML='<button type="button" class="btn" data-admedad="'+String(a.id).replace(/[^\w-]/g,'')+'">Editar anuncio (administrador)</button>';w.appendChild(r)}
var t=0;new MutationObserver(function(){if(t)return;t=1;requestAnimationFrame(function(){t=0;mount()})}).observe(document.documentElement,{childList:true,subtree:true});
})();
