
/* v310: el dueño puede poner su tienda EN PAUSA (botón «Pausar tienda» o sola mientras agrega o edita un producto).
   En pausa, los clientes ven los datos de la tienda (nombre, horario, ubicación, contacto, opiniones) pero no los productos,
   y no pueden agregar al carrito ni enviar el pedido, para que nadie compre con un precio que está cambiando.
   Campos de la tienda: pause = hasta cuándo (fecha en ms), pauseA = 1 si la puso la edición. Si algo falla, borra este bloque. */
(function(){
var IC='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/></svg>';
var MIN=6e4,AUTO=20*MIN;
var paused=function(s){return !!s&&Number(s.pause)>Date.now()};window.qpzOn=paused;
var mineOf=function(s){try{return !!s&&shopsMine().some(function(x){return x.id===s.id})}catch(e){return false}};
var st=function(id){return S.stores.find(function(x){return x.id===id})};
var hhmm=function(t){return new Date(t).toLocaleTimeString('es-CO',{hour:'numeric',minute:'2-digit'})};
var until=function(s){var t=Number(s.pause);return t-Date.now()>7*864e5?'hasta que el dueño la reanude':'hasta las '+hhmm(t)};
var autoOn=function(){try{return localStorage.getItem('qh_pauto')!=='0'}catch(e){return true}};
function setP(id,t,a){var s=st(id);if(!s)return;s.pause=t;s.pauseA=a?1:0;save();if(view==='store'||view==='prod')render(true)}
function banner(s,mine){
 if(mine)return '<div class="qpz" role="status">'+IC+'<div><b>Tu tienda está en pausa</b><p>'+(s.pauseA?'Se pausó mientras editas tus productos. ':'')+'Tus clientes ven los datos de tu tienda pero no tus productos, y no pueden hacer pedidos, '+until(s)+'.</p><div class="row"><button type="button" class="btn pink" data-qpz="off">Reanudar tienda</button></div></div></div>';
 return '<div class="qpz qpz-cli" role="status">'+IC+'<div><b>Tienda en pausa</b><p>'+esc(s.name)+' está actualizando sus productos y precios. Vuelve en unos minutos'+(Number(s.pause)-Date.now()>7*864e5?'':' (hasta las '+hhmm(Number(s.pause))+')')+'. Mientras tanto puedes ver sus datos y escribirle.</p></div></div>'}
function wrap(){if(window.__qpzW||typeof storeView!=='function'||typeof prodView!=='function')return;window.__qpzW=1;
 var o=storeView;storeView=function(){var h=o(),s=view==='store'?st(cur):null;if(!s)return h;var mine=mineOf(s);
  if(mine)h=h.replace('<button class="btn ghost" data-act="editShop">','<button class="btn ghost qpzb" data-qpz="'+(paused(s)?'off':'menu')+'">'+(paused(s)?'Reanudar tienda':'Pausar tienda')+'</button><button class="btn ghost" data-act="editShop">');
  if(!paused(s))return h;var i=h.indexOf('<div class="icard">');var bn=banner(s,mine);return i>0?h.slice(0,i)+bn+h.slice(i):bn+h};
 var op=prodView;prodView=function(){var s=st(cur);if(!s||!paused(s)||mineOf(s)||adm)return op();
  return '<div class="hubbar"><button class="btn ghost" data-act="open" data-id="'+esc(s.id)+'">← Ver la tienda</button></div>'+banner(s,false)}}
document.addEventListener('DOMContentLoaded',wrap);setTimeout(wrap,0);
function menu(id){var s=st(id);if(!s)return;var opts=[[15,'15 minutos'],[30,'30 minutos'],[60,'1 hora'],[180,'3 horas']];
 modal('<h2>Pausar tienda</h2><p>Mientras está en pausa, tus clientes ven los datos de <b>'+esc(s.name)+'</b> (horario, ubicación, contacto y opiniones) pero <b>no tus productos</b>, y no pueden enviar pedidos. Úsalo mientras cambias precios o productos.</p><p class="muted">¿Por cuánto tiempo?</p><div class="qpzo">'+opts.map(function(x){return '<button type="button" class="btn" data-qpz="set" data-m="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div><button type="button" class="btn ghost" data-qpz="set" data-m="0" style="width:100%">Hasta que yo la reanude</button><label class="qpzc"><input type="checkbox" id="qpz-auto"'+(autoOn()?' checked':'')+'><span>Pausar sola mientras agrego o edito un producto (se reanuda sola al terminar)</span></label><div class="row" style="margin-top:12px"><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>')}
document.addEventListener('change',function(e){if(e.target&&e.target.id==='qpz-auto'){try{localStorage.setItem('qh_pauto',e.target.checked?'1':'0')}catch(_){}}});
/* pausa automática mientras el dueño edita un producto; se reanuda 1 minuto después de cerrar el formulario */
var watch=null;
function autoWatch(id){clearInterval(watch);var gone=0;watch=setInterval(function(){var s=st(id);if(!s||!s.pauseA){clearInterval(watch);return}
 if(document.getElementById('ov')){gone=0;if(Number(s.pause)-Date.now()<5*MIN){s.pause=Date.now()+AUTO;save()}return}
 if(++gone>=12){clearInterval(watch);setP(id,0,0);toast('Tu tienda volvió a estar abierta')}},5000)}
addEventListener('click',function(e){var t=e.target;if(!t.closest)return;var q=t.closest('[data-qpz]');
 if(q){e.preventDefault();e.stopImmediatePropagation();var a=q.dataset.qpz;
  if(a==='menu')return menu(cur);
  if(a==='off'){clearInterval(watch);closeModal(1);setP(cur,0,0);return toast('Tu tienda está abierta otra vez')}
  if(a==='set'){var m=+q.dataset.m;closeModal(1);setP(cur,Date.now()+(m?m*MIN:365*864e5),0);return toast('Tu tienda está en pausa')}
  return}
 var b=t.closest('[data-act]');if(!b)return;var act=b.dataset.act;
 if((act==='addProd'||act==='editProd')&&view==='store'){var s=st(cur);if(s&&mineOf(s)&&autoOn()&&(!paused(s)||s.pauseA)){if(!paused(s)){s.pause=Date.now()+AUTO;s.pauseA=1;save();toast('Tu tienda quedó en pausa mientras editas')}autoWatch(s.id)}return}
 /* clientes: no agregar ni pedir en una tienda en pausa */
 if((act==='add'||act==='order')&&MODE!=='admin'/* v314: el «add» del administrador es de categorías */){var sid=act==='order'?b.dataset.id:(b.dataset.sid||cur),s2=st(sid);if(!s2||!paused(s2)||mineOf(s2))return;
  e.preventDefault();e.stopImmediatePropagation();
  modal('<h2>Tienda en pausa</h2><p><b>'+esc(s2.name)+'</b> está actualizando sus productos y precios, así que por ahora no recibe pedidos. Vuelve a intentarlo en unos minutos'+(Number(s2.pause)-Date.now()>7*864e5?'':' (hasta las '+hhmm(Number(s2.pause))+')')+'.</p>'+(act==='order'?'<p class="muted">Tu carrito queda guardado.</p>':'')+'<div class="row" style="margin-top:10px"><button type="button" class="btn pink" data-act="close">Entendido</button></div>')}},true);
/* cuando termina la pausa, la tienda abierta se actualiza sola */
var last='';setInterval(function(){if(view!=='store'&&view!=='prod')return;var s=st(cur),k=s?String(paused(s)):'';if(k!==last){if(last!=='')render(true);last=k}},15000);
})();
