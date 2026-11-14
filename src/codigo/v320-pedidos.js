
/* v320: cada tienda elige cómo recibe los pedidos: por WhatsApp (como antes) o por la aplicación.
   - En el carrito el cliente elige cómo va a pagar (entre los medios que acepta la tienda) y puede dejar una nota.
   - Por WhatsApp: el mensaje lleva la forma de pago y la nota.
   - Por la aplicación: el pedido queda guardado (colección «pedidos», reglas v40). La tienda lo ve en Mi cuenta → Pedidos de mi
     tienda, con quién pidió, qué pidió, el total y el medio de pago, y lo marca aceptado, pagado, enviado y entregado.
     El cliente lo ve en Mi cuenta → Mis pedidos. Si paga con Bre-B o Nequi, sube el comprobante como los demás pagos.
   Campo de la tienda: om = 'wa' | 'app'. Si algo falla, borra este bloque. */
(function(){
var PAYN={cash:'Efectivo (contra entrega)',bre:'Bre-B',nequi:'Nequi',card:'Tarjeta (datáfono)',siste:'Sistecrédito'/* v410 */},PAYS_={cash:'Efectivo',bre:'Bre-B',nequi:'Nequi',card:'Tarjeta',siste:'Sistecrédito'};
var STN={nuevo:'Nuevo',acep:'Aceptado · preparando',env:'Enviado',ent:'Entregado',canc:'Cancelado'},PSN={pend:'Pago pendiente',ok:'Pagado',no:'No pagó'};
var ORD={},OT=[],OF=[],uidL='',subs=[],seen=null,FT='act',sf=0;
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var M=function(n){try{return money(Number(n)||0)}catch(e){return '$'+n}};
var D=function(t){try{return new Date(t).toLocaleString('es-CO',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})}catch(e){return ''}};
function me(){try{var u=firebase.auth().currentUser;return u&&!u.isAnonymous?u:null}catch(e){return null}}
function st(id){return S.stores.find(function(x){return x.id===id})}
/* v321: solo las tiendas que pagan (fecha de pago vigente + 3 días de gracia) reciben pedidos por la aplicación; la versión gratis va a WhatsApp */
function paid(s){return !!s&&(Number(s.pexp)||0)+3*864e5>Date.now()}window.ordPaid=paid;
window.ordMode=function(s){return s&&s.om==='app'&&s.ownerUid&&paid(s)?'app':'wa'};
function pays(s){var l=(s&&Array.isArray(s.pays)?s.pays:[]).filter(function(k){return PAYN[k]});return l.length?l:['cash']}
function sel(sid){var s=st(sid),o=ORD[sid]||(ORD[sid]={});var l=pays(s);if(l.indexOf(o.pay)<0)o.pay=l[0];return o}
/* ---- carrito ---- */
window.ordFoot=function(s,t){var o=sel(s.id),app=ordMode(s)==='app',l=pays(s);
 return (typeof adrFoot==='function'?adrFoot(s.id):'')/* v322 */+'<div class="opay" role="group" aria-label="Cómo vas a pagar"><b>¿Cómo vas a pagar?</b><div class="ops">'+l.map(function(k){return '<button type="button" data-opay="'+k+'" data-sid="'+E(s.id)+'" aria-pressed="'+(o.pay===k)+'">'+E(PAYN[k])+'</button>'}).join('')+'</div></div>'+
  '<label class="sr1" for="on-'+E(s.id)+'">Nota para la tienda</label><textarea class="onote" id="on-'+E(s.id)+'" data-onote="'+E(s.id)+'" maxlength="300" placeholder="Nota para la tienda (opcional)"/* v416: sin cuenta, la dirección se pide en «Tus datos para el pedido» */>'+E(o.note||'')+'</textarea>'+
  '<span class="omode">'+(app?'Tu pedido queda guardado en Mi cuenta → Mis pedidos y la tienda te confirma por aquí.':'Se abre WhatsApp con tu pedido listo para enviar.')+'</span>'+
  '<button class="btn pink" style="width:100%" data-act="order" data-om="'+(app?'app':'wa')+'" data-id="'+E(s.id)+'">'+(app?'Enviar pedido':'Pedir por WhatsApp')+'</button>'};
window.ordWaLine=function(sid){var o=sel(sid);return (S.user?'\n\nCliente: '+String(S.user.name||'').slice(0,60)+(S.user.wa?'\nTeléfono: '+String(S.user.wa).replace(/\D/g,'').slice(0,15):''):'')/* v356 */+'\nForma de pago: '+PAYN[o.pay]+(o.note?'\nNota: '+String(o.note).slice(0,300):'')+(S.user&&typeof adrWa==='function'?adrWa(adrPick(sid)):'')/* v322 */};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-opay]');if(!b)return;var o=sel(b.dataset.sid);o.pay=b.dataset.opay;
 b.parentNode.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))})});
document.addEventListener('input',function(e){var t=e.target;if(t&&t.dataset&&t.dataset.onote){sel(t.dataset.onote).note=t.value}});
/* ---- enviar pedido por la aplicación ---- */
function lines(s){var L=[],t=0;Object.entries(S.cart).forEach(function(kv){var k=kv[0],q=kv[1];if(k.indexOf(s.id+'|')!==0)return;var p=(s.products||[]).find(function(x){return x.id===k.split('|')[1]});if(!p)return;
  var c=k.split('|')[3]||'',code='';try{code=c?vId(p,c):pCode(p)}catch(e){}var v='';try{v=vTx(k)}catch(e){}t+=(Number(p.price)||0)*q;L.push({pid:p.id,n:String(p.name).slice(0,80),q:q,p:Number(p.price)||0,v:String(v||'').slice(0,60),c:String(code||'').slice(0,20)})});return {L:L,t:t}}
async function send(s){var u=me();if(!S.user||!u){try{need(function(){setTimeout(function(){send(s)},400)})}catch(e){}return}
 if(u.uid===s.ownerUid)return toast('Esta es tu tienda: para probar un pedido entra con otra cuenta.');
 var x=lines(s);if(!x.L.length)return;var o=sel(s.id);
 var ad=typeof adrPick==='function'?adrPick(s.id):null;if(typeof adrForm==='function'&&!ad){return adrForm('main',function(){setTimeout(function(){send(s)},300)},true)}/* v322: la dirección es obligatoria para pedir */
 var d={sid:s.id,sname:String(s.name).slice(0,80),to:s.ownerUid,from:u.uid,fromName:String(S.user.name||'Vecino').slice(0,60),fromWa:String(S.user.wa||'').replace(/\D/g,'').slice(0,15),items:x.L.slice(0,50),total:x.t,pay:o.pay,note:String(o.note||'').slice(0,300),st:'nuevo',pst:'pend',ts:Date.now()};if(ad&&typeof adrClean==='function')d.addr=adrClean(ad);
 try{var r=await firebase.firestore().collection('pedidos').add(d);
  Object.keys(S.cart).forEach(function(k){if(k.indexOf(s.id+'|')===0)delete S.cart[k]});delete ORD[s.id];try{refreshCart()}catch(e){}
  try{document.getElementById('drawer').classList.remove('open')}catch(e){}done(s,d,r.id)}
 catch(e){toast(e&&e.code==='permission-denied'?'No se pudo enviar el pedido: faltan publicar las reglas de Firestore v40. Avisa al administrador.':'No se pudo enviar el pedido. Revisa tu internet e inténtalo de nuevo.')}}
function waBtn(num,txt,lab){if(!num)return '';var n=String(num).replace(/\D/g,'');n=n.length===10?'57'+n:n;return '<a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/'+n+'?text='+encodeURIComponent(txt)+'">'+lab+'</a>'}
function payBtn(p,id){var can=(p.pay==='bre'||p.pay==='nequi')&&p.pst==='pend'&&typeof brebHas==='function'&&brebHas(p.to);return can?'<button type="button" class="btn pink" data-opaynow="'+E(id)+'">Pagar con '+(p.pay==='nequi'?'Nequi':'Bre-B')+' y subir comprobante</button>':''}
function done(s,d,id){modal('<h2>¡Pedido enviado!</h2><p><b>'+E(s.name)+'</b> recibió tu pedido de <b>'+E(M(d.total))+'</b>. Forma de pago: <b>'+E(PAYN[d.pay])+'</b>.</p><p class="muted">Míralo en Mi cuenta → Mis pedidos. Ahí ves cuando la tienda lo acepte, lo envíe y lo entregue.</p>'+
 ((d.pay==='bre'||d.pay==='nequi')&&!(typeof brebHas==='function'&&brebHas(d.to))?'<p class="omw">La tienda aún no registró sus datos de '+(d.pay==='nequi'?'Nequi':'Bre-B')+'. Te los dará por WhatsApp.</p>':'')+
 '<div class="row" style="margin-top:10px">'+payBtn(d,id)+waBtn(s.wa,'Hola '+s.name+', te acabo de hacer un pedido por Mi Pradera ('+M(d.total)+', '+PAYS_[d.pay]+').','Avisar por WhatsApp')+'<button type="button" class="btn ghost" data-ordmy="1">Ver mis pedidos</button></div>')}
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-act="order"]');if(!b)return;var s=st(b.dataset.id);if(!s||ordMode(s)!=='app')return;e.preventDefault();e.stopImmediatePropagation();send(s)},true);
/* ---- datos en vivo ---- */
function list(sn){var a=[];sn.forEach(function(d){var x=d.data();x.id=d.id;a.push(x)});return a.sort(function(x,y){return (y.ts||0)-(x.ts||0)})}
function listen(u){var id=u&&!u.isAnonymous?u.uid:'';if(id===uidL)return;uidL=id;subs.forEach(function(f){try{f()}catch(e){}});subs=[];OT=[];OF=[];seen=null;sf=0;if(!id)return;var c=firebase.firestore().collection('pedidos');
 subs.push(c.where('to','==',id).onSnapshot(function(sn){OT=list(sn);var nw=OT.filter(function(p){return p.st==='nuevo'});
  if(seen){OT.forEach(function(p){if(seen[p.id]&&seen[p.id]!=='canc'&&p.st==='canc')toast(p.fromName+' canceló su pedido de '+M(p.total)+' en '+p.sname+'.')})}
  if(seen){var fresh=nw.filter(function(p){return !seen[p.id]});if(fresh.length)toast(fresh.length===1?'Nuevo pedido de '+fresh[0].fromName+' por '+M(fresh[0].total)+'. Míralo en Mi cuenta → Pedidos de mi tienda.':'Tienes '+fresh.length+' pedidos nuevos.')}
  seen={};OT.forEach(function(p){seen[p.id]=p.st||1});paint()},function(){}));
 subs.push(c.where('from','==',id).onSnapshot(function(sn){var old={};OF.forEach(function(p){old[p.id]=p});OF=list(sn);
  /* v321: avisos al cliente cuando la tienda cambia su pedido */if(sf)OF.forEach(function(p){var o=old[p.id];if(!o)return;
   if(o.st!==p.st&&p.st!=='nuevo'&&p.st!=='canc')toast('Tu pedido en '+p.sname+': '+({acep:'la tienda lo aceptó y lo está preparando',env:'ya va en camino',ent:'quedó entregado'}[p.st]||STN[p.st])+'.');
   if(o.st!==p.st&&p.st==='canc'&&o.st!=='canc')toast('La tienda '+p.sname+' canceló tu pedido de '+M(p.total)+'.');
   if(o.pst!==p.pst&&p.pst==='ok')toast(p.sname+' confirmó que recibió tu pago de '+M(p.total)+'.');
   if(o.pst!==p.pst&&p.pst==='no')toast(p.sname+' dice que no le llegó tu pago de '+M(p.total)+'. Escríbele.')});sf=1;paint()},function(){}))}
function start(){try{if(!window.firebase||!firebase.apps||!firebase.apps.length)return setTimeout(start,600);firebase.auth().onAuthStateChanged(listen)}catch(e){setTimeout(start,1000)}}
start();
function paint(){var o=document.getElementById('ordbox');if(o)o.innerHTML=o.dataset.k==='to'?toH():ofH();try{if(view==='home'&&MODE==='panel'&&!document.getElementById('ov'))render(true)}catch(e){}}
/* ---- Mi cuenta ---- */
window.ordMenu=function(it){var h='',ic='<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg>',ic2='<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
 var mine=[];try{mine=shopsMine()}catch(e){}var n=OT.filter(function(p){return p.st==='nuevo'}).length;
 if(mine.length||OT.length)h+=it(ic2,'Pedidos de mi tienda',(OT.length?OT.length+(OT.length===1?' pedido':' pedidos'):'Aún no tienes pedidos')+(mine.some(function(s){return ordMode(s)==='app'})?'':' · actívalos en Editar tienda'),'ordTo','',n?{n:n,t:n+(n===1?' pedido nuevo':' pedidos nuevos')}:null);
 if(OF.length)h+=it(ic,'Mis pedidos',OF.length+(OF.length===1?' pedido':' pedidos'),'ordFrom','');return h};
function tags(p){var c=p.st==='canc'?'no':p.st==='ent'?'ok':p.st==='nuevo'?'n':'w',pc=p.pst==='ok'?'ok':p.pst==='no'?'no':'w';return '<div class="ordtg"><span class="'+c+'">'+E(STN[p.st]||p.st)+'</span><span class="'+pc+'">'+E(PSN[p.pst]||'')+'</span><span>'+E(PAYN[p.pay]||p.pay)+'</span></div>'}
function items(p){return '<ul>'+(p.items||[]).map(function(i){return '<li>'+E(i.q)+' × '+E(i.n)+(i.v?' · '+E(i.v):'')+' — '+E(M(i.p*i.q))+(i.c?' <small style="display:inline">('+E(i.c)+')</small>':'')+'</li>'}).join('')+'</ul>'}
function act(id,s,p,l){return '<button type="button" class="btn '+(l[1]||'ghost')+'" data-ordset="'+E(id)+'|'+s+'|'+p+'">'+l[0]+'</button>'}
function toH(){if(!me())return '<p class="muted">Entra con tu correo y tu clave para ver los pedidos.</p>';
 var F={act:function(p){return p.st!=='ent'&&p.st!=='canc'},nuevo:function(p){return p.st==='nuevo'},ent:function(p){return p.st==='ent'},all:function(){return true}},L=OT.filter(F[FT]||F.act);
 var mine=[];try{mine=shopsMine()}catch(e){}var off=mine.length&&!mine.some(function(s){return ordMode(s)==='app'}),pd=mine.some(paid);
 return (off?'<p class="omw">'+(pd?'Tus tiendas reciben los pedidos por WhatsApp. Para recibirlos aquí, abre tu tienda → Editar tienda → «¿Cómo quieres recibir los pedidos?» y elige «Por la aplicación».':'Recibir y gestionar pedidos por la aplicación es para las tiendas con el rol Comerciante. Con la versión gratis, los pedidos te llegan directo a tu WhatsApp.')+'</p>':'')+
  '<p class="qbw">Si te pagan con Bre-B o Nequi, revisa en tu banco o en Nequi que el dinero llegó antes de marcar «Pago recibido». Los pantallazos pueden ser falsos.</p>'+
  '<div class="ordf" role="group" aria-label="Filtrar pedidos">'+[['act','En curso ('+OT.filter(F.act).length+')'],['nuevo','Nuevos ('+OT.filter(F.nuevo).length+')'],['ent','Entregados ('+OT.filter(F.ent).length+')'],['all','Todos ('+OT.length+')']].map(function(f){return '<button type="button" data-ordf="'+f[0]+'" aria-pressed="'+(FT===f[0])+'">'+f[1]+'</button>'}).join('')+'</div>'+
  (L.length?grp(L,function(p){var a='';
   if(p.st==='nuevo')a+=act(p.id,'acep',p.pst,['Aceptar pedido','pink'])+act(p.id,'canc',p.pst,['Cancelar']);
   else if(p.st==='acep')a+=act(p.id,'env',p.pst,['Marcar enviado'])+act(p.id,'ent',p.pst,['Marcar entregado','pink']);
   else if(p.st==='env')a+=act(p.id,'ent',p.pst,['Marcar entregado','pink']);
   if(p.st!=='canc'){if(p.pst!=='ok')a+=act(p.id,p.st,'ok',['Pago recibido','pink']);if(p.pst==='pend')a+=act(p.id,p.st,'no',['No pagó']);if(p.pst!=='pend')a+=act(p.id,p.st,'pend',['Volver a «pago pendiente»'])}
   if((p.pay==='bre'||p.pay==='nequi')&&typeof brebMy==='function')a+='<button type="button" class="btn ghost" data-ordrecv="1">Ver comprobantes</button>';
   a+=waBtn(p.fromWa,'Hola '+p.fromName+', te escribo de '+p.sname+' por tu pedido de Mi Pradera.','WhatsApp del cliente');
   return '<div class="ordc"><div class="ordh"><div><b>'+E(p.fromName)+'</b><small>'+E(D(p.ts))+' · '+E(p.sname)+'</small></div><strong>'+E(M(p.total))+'</strong></div>'+tags(p)+items(p)+(p.note?'<small><b>Nota:</b> '+E(p.note)+'</small>':'')+adrH(p,1)/* v351: el vendedor ve el mapa de la entrega */+'<div class="orda">'+a+'</div></div>'}):'<p class="muted">No hay pedidos en esta lista.</p>')}
function ofH(){if(!me())return '<p class="muted">Entra con tu correo y tu clave para ver tus pedidos.</p>';
 return OF.length?grp(OF,function(p){var s=st(p.sid)||{},a=payBtn(p,p.id);if(p.st==='nuevo')a+='<button type="button" class="btn ghost" data-ordcanc="'+E(p.id)+'">Cancelar pedido</button>';a+=waBtn(s.wa,'Hola '+p.sname+', te escribo por mi pedido de Mi Pradera ('+M(p.total)+').','WhatsApp de la tienda');
  return '<div class="ordc"><div class="ordh"><div><b>'+E(p.sname)+'</b><small>'+E(D(p.ts))+'</small></div><strong>'+E(M(p.total))+'</strong></div>'+tags(p)+items(p)+(p.note?'<small><b>Tu nota:</b> '+E(p.note)+'</small>':'')+adrH(p)+(a?'<div class="orda">'+a+'</div>':'')+'</div>'}):'<p class="muted">Aún no has hecho pedidos por la aplicación.</p>'}
/* v322: dirección de entrega del pedido, con enlaces al mapa */
function adrH(p,sv){var a=p.addr;if(!a||!(a.dir||a.plus))return '';var m=typeof adrMaps==='function'?adrMaps(a):'';var so=sv?st(p.sid):null,og=so&&so.lat!=null&&so.lng!=null?'&origin='+so.lat+','+so.lng:'';/* v351: la ruta sale desde la tienda */var dq=a.lat!=null?a.lat+','+a.lng:[a.dir,a.zone,'Pradera, Valle del Cauca'].filter(Boolean).join(', ');var dr=m?'https://www.google.com/maps/dir/?api=1'+og+'&destination='+encodeURIComponent(dq)+'&travelmode=driving':'';
 return '<div class="oaddr"><b>Entregar en'+(a.lb&&a.lb!=='Principal'?' ('+E(a.lb)+')':'')+':</b>'+E([a.dir,a.zone].filter(Boolean).join(', '))+(a.ref?'<small>'+E(a.ref)+'</small>':'')+(a.plus?'<small>Código plus: '+E(a.plus)+'</small>':'')+((m||dr)?'<div class="orda">'+(m?'<a class="btn ghost" href="'+E(m)+'" target="_blank" rel="noopener">Ver en el mapa</a>':'')+(dr?'<a class="btn ghost" href="'+E(dr)+'" target="_blank" rel="noopener">'+(og?'Ruta desde mi tienda':'Cómo llegar')+'</a>':'')+'</div>':'')+(sv?'<details class="omap"'+(p.st==='ent'||p.st==='canc'?'':' open')+'><summary>Mapa de la entrega</summary><iframe title="Mapa de la dirección de entrega" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="'+E('https://maps.google.com/maps?q='+encodeURIComponent(dq)+'&z=17&output=embed')+'"></iframe><small>Solo tú ves esta dirección, porque es la de este pedido. No aparece en el mapa de tiendas.</small></details>':'')+'</div>'}
/* v321: pedidos agrupados por tienda */
function grp(L,f){var G={},o=[];L.forEach(function(p){if(!G[p.sid]){G[p.sid]=[];o.push(p.sid)}G[p.sid].push(p)});
 return o.map(function(k){var l=G[k],n=l.filter(function(p){return p.st==='nuevo'}).length;return '<section class="ordg"><h3>'+E(l[0].sname)+' <small>'+l.length+(l.length===1?' pedido':' pedidos')+(n?' · '+n+(n===1?' nuevo':' nuevos'):'')+'</small></h3><div class="ordl">'+l.map(f).join('')+'</div></section>'}).join('')}
function open(k){modal('<h2>'+(k==='to'?'Pedidos de mi tienda':'Mis pedidos')+'</h2><div id="ordbox" data-k="'+k+'">'+(k==='to'?toH():ofH())+'</div><div class="row" style="margin-top:12px"><button type="button" class="btn ghost" data-act="close">Cerrar</button></div>')}
window.ordOpen=open;window.ordDebug=function(t,f){if(t)OT=t;if(f)OF=f;paint()};/* para las pruebas */
addEventListener('click',async function(e){var t=e.target;if(!t.closest)return;var b;
 if((b=t.closest('[data-act="ordTo"],[data-act="ordFrom"],[data-ordmy]'))){e.preventDefault();e.stopImmediatePropagation();closeModal(1);open(b.dataset.act==='ordTo'?'to':'from');return}
 if((b=t.closest('[data-ordf]'))){FT=b.dataset.ordf;paint();return}
 if((b=t.closest('[data-ordrecv]'))){closeModal(1);brebMy('recv');return}
 if((b=t.closest('[data-ordset]'))){var z=b.dataset.ordset.split('|');if(z[1]==='canc'&&!(await askC('¿Cancelar este pedido?','Cancelar pedido')))return;
  try{await firebase.firestore().collection('pedidos').doc(z[0]).update({st:z[1],pst:z[2],sts:Date.now()});toast(z[1]==='canc'?'Pedido cancelado':z[2]==='ok'&&b.textContent.indexOf('Pago')===0?'Pago marcado como recibido':'Pedido actualizado')}catch(x){toast('No se pudo guardar. Revisa tu internet e inténtalo de nuevo.')}return}
 if((b=t.closest('[data-ordcanc]'))){if(!(await askC('¿Cancelar tu pedido?','Cancelar pedido')))return;try{await firebase.firestore().collection('pedidos').doc(b.dataset.ordcanc).update({st:'canc',sts:Date.now()});toast('Pedido cancelado')}catch(x){toast('No se pudo cancelar. Puede que la tienda ya lo haya aceptado.')}return}
 if((b=t.closest('[data-opaynow]'))){var p=OF.concat(OT).find(function(x){return x.id===b.dataset.opaynow})||null;var s=p&&st(p.sid);if(!p)return;closeModal(1);brebPay({to:p.to,toName:(s&&s.name)||p.sname,amt:p.total,what:'Pedido en '+p.sname,kind:'item',item:'ped:'+p.id,wa:s&&s.wa});return}},true);
/* ---- formulario de la tienda: cómo recibe los pedidos ---- */
window.omRead=function(){var i=document.querySelector('input[name="x-om"]:checked');return i?{om:i.value==='app'&&!i.disabled?'app':'wa'}:{}};
function addOm(){var g=document.getElementById('x-pays');if(!g||document.getElementById('x-om'))return;var m=document.querySelector('#ov .modal');if(!m||!m.contains(g))return;
 var ed=!!m.querySelector('[data-act="saveEditShop"]'),s=ed?st(cur):null,can=false;try{can=MODE==='admin'||shopRole()}catch(e){}var v=can&&s&&s.om==='app'?'app':'wa';
 g.insertAdjacentHTML('afterend','<p class="omw" id="x-pw" hidden></p><label id="x-om-l" style="display:block;margin-top:14px">¿Cómo quieres recibir los pedidos?</label><div class="omg" id="x-om" role="radiogroup" aria-labelledby="x-om-l">'+
  '<label><input type="radio" name="x-om" value="wa"'+(v==='wa'?' checked':'')+'><span><b>Por WhatsApp</b><small>El cliente te escribe con su pedido y la forma de pago.</small></span></label>'+
  '<label'+(can?'':' class="off"')+'><input type="radio" name="x-om" value="app"'+(v==='app'?' checked':'')+(can?'':' disabled')+'><span><b>Por la aplicación'+(can?'':' · con el rol Comerciante')+'</b><small>'+(can?'':'Disponible para las tiendas que pagan. Con la versión gratis los pedidos van directo a tu WhatsApp. ')+'El pedido queda guardado en Mi cuenta → Pedidos de mi tienda: ves quién pidió, qué pidió, el total y cómo va a pagar, y lo marcas aceptado, pagado, enviado y entregado.</small></span></label></div>');
 warn()}
function warn(){var w=document.getElementById('x-pw');if(!w)return;var c=[].map.call(document.querySelectorAll('#x-pays input:checked'),function(i){return i.value}),u=me();
 var need=(c.indexOf('bre')>=0||c.indexOf('nequi')>=0)&&!(u&&typeof brebHas==='function'&&brebHas(u.uid));
 w.hidden=!need;if(need)w.textContent='Para que te paguen con Bre-B o Nequi, después de guardar llena tus datos en Mi cuenta → Pagos Bre-B y Nequi → Cobrar.'}
document.addEventListener('change',function(e){if(e.target&&e.target.closest&&e.target.closest('#x-pays'))warn()});
new MutationObserver(function(){addOm()}).observe(document.documentElement,{childList:true,subtree:true});
})();
