/* v441: el administrador edita la tienda completa de un usuario (para ayudar a quien no sabe hacerlo): en Usuarios → tarjeta de la persona,
   «Editar tienda y productos» abre la tienda como la ve su dueño, con «Editar tienda», «Nuevo producto», «Lista de productos»,
   «Categorías», «Conoce el lugar» y editar o borrar cada producto. Usa los mismos formularios del dueño.
   Cómo: mientras se edita, el id de la tienda entra en S.mine (solo en la memoria del panel, no se guarda) y planMsg no pide rol.
   Al guardar, la tienda y sus productos conservan su dueño (ownerKey y ownerUid salen de la tienda, ver want() en 01-cats), y las
   reglas ya dejan escribir al administrador. Una barra abajo dice qué tienda se edita y tiene «Terminar».
   Si algo falla, borra este bloque y el botón data-admedit en v335-admin-tienda. */
(function(){
var ED='',E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function isAdm(){return typeof MODE!=='undefined'&&MODE==='admin'&&typeof adm!=='undefined'&&adm}
function st(){try{return S.stores.find(function(s){return s.id===ED})}catch(e){return null}}
/* con la tienda en edición, el administrador no necesita rol para agregar o editar productos. Se envuelve al abrir la tienda (no al cargar):
   v313 define planMsgExt más abajo en la página */
function sinRol(){var prev=window.planMsgExt;if(prev&&prev.v441)return;var f=function(){if(ED&&isAdm())return '';return typeof prev==='function'?prev.apply(this,arguments):planMsg0.apply(this,arguments)};f.v441=1;window.planMsgExt=f}
function bar(){var s=st(),b=document.getElementById('aed');if(!s){if(b)b.remove();return}
 if(!b){b=document.createElement('div');b.id='aed';b.setAttribute('role','status');document.body.appendChild(b)}
 var h='<span>Editando como administrador: <b>'+E(s.name||'(sin nombre)')+'</b>. Los cambios se guardan en la tienda de su dueño.</span><button type="button" class="btn" data-admedit-fin="1">Terminar</button>';if(b.innerHTML!==h)b.innerHTML=h}
function fin(){var id=ED;ED='';try{S.mine=S.mine.filter(function(x){return x!==id})}catch(e){}bar()}
function abrir(id){if(!isAdm())return;if(ED&&ED!==id)fin();var s=S.stores.find(function(x){return x.id===id});if(!s)return toast('La tienda ya no existe');sinRol();ED=id;if(S.mine.indexOf(id)<0)S.mine.push(id);
 try{closeModal(1)}catch(e){}view='store';cur=id;try{sc1='';sc2=''}catch(e){}render();scrollTo(0,0);bar()}
window.admEditShop=abrir;
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-admedit],[data-admedit-fin]');if(!b||!isAdm())return;ev.preventDefault();ev.stopImmediatePropagation();
 if(b.hasAttribute('data-admedit-fin')){fin();view='admin';at='usr';render();scrollTo(0,0);return}abrir(b.getAttribute('data-admedit'))},true);
/* al salir de la tienda (Inicio, otra tienda, el panel) termina la edición */
setInterval(function(){if(!ED)return;var ok=false;try{ok=(view==='store'||view==='prod')&&cur===ED&&!!st()}catch(e){}if(!ok)fin();else bar()},800);
document.head.insertAdjacentHTML('beforeend','<style>#aed{position:fixed;left:0;right:0;bottom:0;z-index:60;display:flex;gap:12px;align-items:center;justify-content:space-between;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:#1d1d1f;color:#fff;font-size:14px;line-height:1.35}#aed .btn{flex:none;background:#fff;color:#1d1d1f}#aed b{color:#fff}body:has(#aed){padding-bottom:64px}.admsr:has([data-admedit]){flex-wrap:wrap}.admsr:has([data-admedit])>span:first-child{flex:1 1 100%}.admsr>span.row{display:flex;flex-wrap:wrap;gap:8px}</style>');
})();
