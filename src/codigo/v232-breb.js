
/* v232: PAGOS CON BRE-B (sin pasarela). El dinero va directo del banco del que paga al banco del que cobra; la página solo
   muestra la llave y guarda un registro del pago para que las dos personas lo vean y quien cobra confirme si le llegó.
   - Colección "breb": una ficha pública por persona (id = uid) con su llave, nombre y QR opcional.
   - Colección "pagos": un registro por pago (from, to, amt, ref, what, kind 'item' | 'rol', st 'pend' | 'ok' | 'no').
     Solo lo leen quien pagó, quien cobra y el administrador. Necesita las reglas de Firestore v24.
   - Roles: se pagan a la llave de Mi Pradera (ficha del administrador). El administrador confirma en Administrar → Mis datos;
     se crea un código y el rol se activa solo cuando la persona abre la página.
   - Administrar → Mis datos: apagar todo (meta/site.breb = false).
   Si algo falla, borra este <script id="v232-breb"> y el <style id="v232-breb-css">. */
(function(){
var PRO={},SENT=[],RECV=[],subs=[],uidL='',tab='recv',KM='',PAY=null,LAST=null,QRD='',RED={};
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function db(){return firebase.firestore()}
function me(){try{var u=QH.authCur&&QH.authCur();return u&&!u.isAnonymous?u:null}catch(e){return null}}
function site_(){try{return (typeof site==='function'?site():S.site)||{}}catch(e){return {}}}
function on(){return site_().breb!==false}
function adm(){try{return MODE==='admin'}catch(e){return false}}
function aid(){try{return ADMIN_UID}catch(e){return ''}}
function M(n){try{return money(Number(n)||0)}catch(e){return '$'+n}}
function D(t){try{return new Date(t).toLocaleString('es-CO',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})}catch(e){return ''}}
function T(m){try{toast(m)}catch(e){}}
function pend(){return RECV.filter(function(p){return p.st==='pend'}).length}
/* v233: Nequi además de Bre-B. La ficha "breb" puede tener key (llave Bre-B), nq (número de Nequi) o las dos;
   cada pago guarda por dónde se hizo (via 'breb' | 'nequi'). Necesita las reglas de Firestore v25. */
var VIA='breb',ADMK='0',PIMG='';
function hasP(p){return !!(p&&(p.key||p.nq))}
function vias(p){var v=[];if(p&&p.key)v.push('breb');if(p&&p.nq)v.push('nequi');return v}
function VN(v){return v==='nequi'?'Nequi':v==='gratis'?'Gratis':'Bre-B'}
/* v240: solicitudes de código gratis (valor 0): sin comprobante, el administrador aprueba igual que un pago */
function viaT(p){return p.via==='gratis'?'Solicitud gratis':'Por '+VN(p.via)}
function amtT(p){return p.via==='gratis'?'Gratis':M(p.amt)}
function roleAmt(g){try{if(g.id==='cm-go')return cmSel==='free'?-1:Number(comPrice(cmSel))||0;return Number(codePriceNow(g.dataset.u,+g.dataset.m))||0}catch(e){return -1}}
/* v234: titular y banco destino. Se guardan YA ENMASCARADOS (3 primeras letras de cada palabra), así el nombre completo
   nunca queda en la ficha pública. Enmascarar dos veces da lo mismo, por eso el formulario puede mostrar el valor guardado. */
function mask(t){return String(t||'').trim().replace(/\s+/g,' ').split(' ').map(function(w){var a=Array.from(w);return a.length<=3?w:a.slice(0,3).join('')+'*'.repeat(a.length-3)}).join(' ')}
var BANKS=['Bancolombia','Banco de Bogotá','Davivienda','BBVA','Banco de Occidente','Banco Popular','Banco AV Villas','Banco Caja Social','Scotiabank Colpatria','Banco Agrario','Itaú','Banco Falabella','Banco Pichincha','Bancamía','Banco W','Banco Finandina','Banco Serfinanza','Banco Coopcentral','Lulo Bank','Nu','Nequi','Daviplata','Movii','Dale','Ualá','RappiPay','Confiar','Otra entidad'];
function lbl(p){var v=vias(p);return v.length>1?'Bre-B o Nequi':v.length?VN(v[0]):'Bre-B'}
window.brebRoleOn=function(){return on()&&hasP(PRO[aid()])};
/* si cambia si se pueden pagar roles aquí, se vuelve a pintar el texto de "Mis roles" */
function roleTxt(){var rk=window.brebRoleOn()?'1':'0';if(rk===ADMK)return;ADMK=rk;try{var cb=document.getElementById('cdbox');if(cb&&typeof cdBox==='function')cb.innerHTML=cdBox();if(view==='comp'&&!document.querySelector('.overlay'))render(true)}catch(e){}}
window.brebOn=on;window.brebPay=function(o){payOpen(o)};window.brebHas=function(u){return hasP(PRO[u])};window.brebMy=function(t){myOpen(t)};/* v320 */
/* v233: texto de "Mis roles" y de los planes de Clasificados según se pueda pagar aquí o no */
window.payNote=function(c){var A=PRO[aid()];
 if(!window.brebRoleOn())return c?'Pagas por Nequi o transferencia y el administrador te entrega un código de 12 caracteres. Actívalo abajo y publica hasta el número de anuncios de tu plan.':'Pago único. No se renueva solo. Pagas por Nequi o transferencia y el administrador te entrega un código.';
 return c?'Paga aquí mismo con '+lbl(A)+' y tu plan se activa solo cuando el administrador confirme el pago. Si prefieres, pídele el código por WhatsApp y actívalo abajo.':'Pago único. No se renueva solo. Paga aquí mismo con '+lbl(A)+': el rol se activa solo cuando el administrador confirme el pago. También puedes pedir el código por WhatsApp.'};
window.brebBadge=function(){var n=pend();return n?{n:n,t:n+(n===1?' pago por confirmar':' pagos por confirmar')}:''};
/* ---- datos en vivo ---- */
function list(sn){var a=[];sn.forEach(function(d){var x=d.data();x.id=d.id;a.push(x)});return a.sort(function(x,y){return (y.ts||0)-(x.ts||0)})}
function mine(u){var id=u&&!u.isAnonymous?u.uid:'';if(id===uidL)return;uidL=id;subs.forEach(function(f){try{f()}catch(e){}});subs=[];SENT=[];RECV=[];paint();if(!id)return;
 var c=db().collection('pagos');
 subs.push(c.where('from','==',id).onSnapshot(function(sn){SENT=list(sn);paint();autoRole()},function(){}));
 subs.push(c.where('to','==',id).onSnapshot(function(sn){RECV=list(sn);paint()},function(){}));myCodesListen()}
function start(){try{if(!window.firebase||!firebase.apps||!firebase.apps.length||typeof QH==='undefined')return setTimeout(start,500);
 db().collection('breb').onSnapshot(function(sn){var m={};sn.forEach(function(d){m[d.id]=d.data()});PRO=m;paint();roleTxt()},function(){PRO={};paint()});
 firebase.auth().onAuthStateChanged(mine)}catch(e){setTimeout(start,1000)}}
/* ---- el rol pagado se activa solo cuando el administrador confirma ---- */
function autoRole(){if(adm()||!S.user)return;SENT.forEach(function(p){if(p.kind!=='rol'||p.st!=='ok'||!p.code||p.red||RED[p.id])return;RED[p.id]=1;
 QH.codeRedeem(p.code).then(function(r){var n=(USES[r.use]||COMU[r.use]||{}).n||'';T((p.via==='gratis'?'Código activado':'Pago confirmado')+'. Rol activado'+(n?': '+n:'')+' hasta el '+new Date(r.end).toLocaleDateString('es-CO'));red(p.id);try{if(!document.querySelector('.overlay'))render(true)}catch(e){}
  /* v256: aviso con botón para ir directo a crear (si no hay otra ventana abierta, o si la abierta es la del código gratis) */try{if(!document.querySelector('#ov'))roleReady(r.use,r.end)}catch(e){}})
  .catch(function(e){if(e&&/usado/.test(e.m||''))red(p.id);else setTimeout(function(){RED[p.id]=0},30000)})})}
function red(id){db().collection('pagos').doc(id).update({red:true}).catch(function(){})}
/* ---- botón "Pagar con Bre-B" junto al WhatsApp de cada publicación ---- */
var SEL='[data-act="cmxWa"],[data-act="contactAd"],.btn[data-act="contact"],[data-act="order"],[data-act="ask"]';
function info(b){var a=b.dataset.act,id=b.dataset.id,x;try{
 if(a==='cmxWa'){x=(QH.COM||[]).find(function(o){return o.id===id});return x&&{o:x.ownerUid,n:x.owner,amt:+x.price||0,what:'Clasificado: '+x.title,wa:x.wa,item:'com:'+id}}
 if(a==='contactAd'){x=S.ads.find(function(o){return o.id===id});return x&&{o:x.ownerUid,n:x.owner,amt:+x.price||0,what:x.title,wa:x.wa,item:'ad:'+id}}
 if(a==='contact'){x=S.services.find(function(o){return o.id===id});return x&&{o:x.ownerUid,n:x.name,amt:0,what:'Servicio: '+(x.job||x.name),wa:x.wa,item:'serv:'+id}}
 if(a==='order'){x=S.stores.find(function(o){return o.id===id});if(!x)return null;var cg=b.closest('.cg'),t=0,bs=cg?cg.querySelectorAll('.ci b'):[];if(bs.length)t=+String(bs[bs.length-1].textContent).replace(/\D/g,'')||0;return {o:x.ownerUid,n:x.name,amt:t,what:'Pedido en '+x.name,wa:x.wa,item:'store:'+id}}
 if(a==='ask'){x=S.stores.find(function(o){return o.id===cur});var p=x&&(x.products||[]).find(function(o){return o.id===id});return p&&{o:x.ownerUid,n:x.name,amt:+p.price||0,what:p.name+' ('+x.name+')',wa:x.wa,item:'prod:'+x.id+'/'+id}}
}catch(e){}return null}
function inject(){var u=me(),l=document.querySelectorAll(SEL);for(var k=0;k<l.length;k++){var b=l[k];if(b.classList.contains('hscw')||b.closest('.overlay'))continue;
  var nx=b.nextElementSibling,has=!!(nx&&nx.classList.contains('qbb')),i=on()&&info(b),ok=!!(i&&i.o&&hasP(PRO[i.o])&&!(u&&u.uid===i.o)),tx=ok?'💳 Pagar con '+lbl(PRO[i.o]):'';
  if(ok&&!has){var q=document.createElement('button');q.type='button';q.className='btn ghost qbb';q.dataset.tx=tx;q.textContent=tx;if(b.style.width)q.style.cssText='width:100%;margin-top:8px';b.insertAdjacentElement('afterend',q)}
  else if(!ok&&has)nx.remove();else if(ok&&has&&nx.dataset.tx!==tx){nx.dataset.tx=tx;nx.textContent=tx}}
 /* pagar un rol: debajo de COMPRAR ACCESO / CONTINUAR en "Mis roles" */
 var A=PRO[aid()],r=document.querySelectorAll('.plgo[data-act="codeBuy"],#cm-go');for(var j=0;j<r.length;j++){var g=r[j],n2=g.nextElementSibling,h2=!!(n2&&n2.classList.contains('qbr')),
  am=roleAmt(g),fr=am===0,ok2=on()&&!(u&&u.uid===aid())&&am>=0&&(fr||hasP(A)),t2=ok2?(fr?'SOLICITAR CÓDIGO GRATIS':'PAGAR CON '+lbl(A).toUpperCase()):'';/* v240: valor 0 → solicitud gratis */
  /* v268: un solo botón principal. Con Bre-B/Nequi, el botón original se oculta y queda «COMPRAR ACCESO» (o RENOVAR / OBTENER
     CÓDIGO GRATIS) que abre el pago aquí mismo; debajo, un enlace pequeño para pedir el código por WhatsApp (el botón original). */
  var gt=(g.dataset.lbl=g.dataset.lbl||g.textContent.trim());if(ok2)t2=fr?'OBTENER CÓDIGO GRATIS':gt;
  if(ok2&&!h2){var q2=document.createElement('button');q2.type='button';q2.className='plgo qbr qbr1';q2.style.marginTop='10px';q2.textContent=t2;g.insertAdjacentElement('afterend',q2);
   var lk=g.cloneNode(false);lk.removeAttribute('id');lk.className='qbwl';lk.textContent=fr?'Prefiero pedirlo por WhatsApp':'Prefiero pedir el código por WhatsApp';q2.insertAdjacentElement('afterend',lk);g.hidden=true}
  else if(!ok2&&h2){var lk2=n2.nextElementSibling;if(lk2&&lk2.classList.contains('qbwl'))lk2.remove();n2.remove();g.hidden=false}
  else if(ok2&&h2&&n2.textContent!==t2)n2.textContent=t2}}
/* ---- ventana para pagar ---- */
/* v233: la parte que cambia según se pague por Bre-B o por Nequi */
function viaH(){var o=PAY,p=(o&&PRO[o.to])||{},n=VIA==='nequi',bk=n?'Nequi':(p.bk||'');
 return '<div class="qbk qbd"><div class="qbr2"><span>Enviar a</span><b class="qbtn">'+E(p.tn||'Sin registrar')+'</b></div>'+
  '<div class="qbr2"><span>'+(n?'Número Nequi':'Llave')+'</span><b>'+E(n?p.nq:p.key)+'</b></div>'+
  '<div class="qbr2"><span>Banco destino</span><b>'+E(bk||'Sin registrar')+'</b></div>'+
  '<button type="button" class="btn ghost" data-qbcp="1">'+(n?'Copiar número':'Copiar llave')+'</button></div>'+
  (!n&&p.qr?'<img class="qbq" src="'+E(p.qr)+'" alt="Código QR de Bre-B de '+E(o.toName)+'">':'')+
  '<ol class="qbst">'+(n?'<li>Copia el número de Nequi.</li><li>En la app <b>Nequi</b> toca «Envía» y envía el valor a ese número.</li><li>Toma una captura del comprobante, adjúntala aquí y toca «Ya pagué».</li>'
   :'<li>Copia la llave o escanea el QR.</li><li>En la app de tu banco o billetera entra a <b>Bre-B</b> (o «Enviar con llave»), pega la llave y paga el valor.</li><li>Toma una captura del comprobante, adjúntala aquí y toca «Ya pagué».</li>')+'</ol>'}
function payOpen(o){if(!S.user){try{need(function(){payOpen(o)})}catch(e){}return}
 if(!me())return T('Para registrar pagos entra con tu correo y tu clave.');
 if(me().uid===o.to)return T('Esta cuenta es la que recibe el pago: no puedes pagarte a ti mismo. Para probar, entra con otra cuenta.');/* v235 */
 var p=PRO[o.to];if(!hasP(p))return T('Aún no hay datos de pago para este pago.');PAY=o;PIMG='';var vs=vias(p);VIA=vs[0];
 modal('<h2>Pagar con '+E(lbl(p))+'</h2><p class="muted" style="margin:0">Para: <b>'+E(o.toName)+'</b><br>'+E(o.what)+'</p>'+
  (vs.length>1?'<div class="qbt" role="tablist" aria-label="Cómo quieres pagar" style="margin-top:12px">'+vs.map(function(v){return '<button type="button" role="tab" data-qbvia="'+v+'" aria-selected="'+(v===VIA)+'">'+VN(v)+'</button>'}).join('')+'</div>':'')+
  '<div id="qb-via">'+viaH()+'</div>'+
  '<label for="qb-amt">Valor a pagar</label><input type="text" id="qb-amt" inputmode="numeric" autocomplete="off" value="'+(o.amt?E(moneyFmt(o.amt)):'')+'"'+(o.kind==='rol'?' readonly':'')+' placeholder="Ej: 25.000">'+
  '<label for="qb-img">Comprobante del pago (foto o captura)</label><input type="file" id="qb-img" accept="image/*">'+
  '<label for="qb-ref">Número de la transacción (opcional si adjuntas el comprobante)</label><input type="text" id="qb-ref" maxlength="40" autocomplete="off" placeholder="Ej: M1234567">'+
  '<p class="qbw">Antes de confirmar el envío, tu banco o Nequi te muestra el nombre y el banco de quien recibe. Revisa que coincidan con «Enviar a» y «Banco destino». Si no coinciden, no pagues.</p>'+
  '<p class="err" id="qb-err" role="alert"></p><div class="row"><button type="button" class="btn pink" id="qb-go">Ya pagué</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>')}
/* v240: solicitar código gratis (valor 0): sin datos de pago ni comprobante */
function freeOpen(o){if(!S.user){try{need(function(){freeOpen(o)})}catch(e){}return}var u=me();
 if(!u)return T('Para solicitar códigos entra con tu correo y tu clave.');if(u.uid===o.to)return T('Esta es la cuenta del administrador: no necesitas solicitar códigos.');
 if(SENT.some(function(p){return p.kind==='rol'&&p.st==='pend'&&p.use===o.use}))return T('Ya tienes una solicitud de este rol esperando aprobación. Mírala en Mi cuenta → Mis códigos.');
 /* v251: los roles gratis (Redactor de noticias, Entidad comunitaria) dan el código al instante, sin esperar al administrador */
 var had=SENT.filter(function(p){return p.kind==='rol'&&p.via==='gratis'&&p.st==='ok'&&p.code&&p.use===o.use&&(Date.now()-(p.ts||0))<330*864e5})[0];
 /* v264: los códigos gratis no se acumulan: solo se pide otro cuando al rol le queda menos de 1 mes (reglas v35) */
 try{var ae=accEnd(o.use);if(ae>Date.now()+31*864e5){var nx=new Date(ae-30*864e5).toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'});return modal('<h2>Tu rol ya está activo</h2><p>Tienes <b>'+E(o.what.split(' · ')[0])+'</b> hasta el <b>'+E(new Date(ae).toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'}))+'</b>. Podrás pedir otro código gratis desde el '+E(nx)+' (un mes antes de que venza).</p><div class="row" style="margin-top:10px">'+(typeof roleBtnTxt==='function'?'<button type="button" class="btn pink" data-act="roleGo" data-v="'+E(o.use)+'">'+roleBtnTxt(o.use)+'</button>':'')+'<button type="button" class="btn ghost" data-act="close">Cerrar</button></div>')}}catch(x){}
 if(had)return freeDone(had.code,o,1);
 PAY=o;modal('<h2>Obtener código gratis</h2><p class="muted" style="margin:0">'+E(o.what)+'</p><div class="qbk qbd"><div class="qbr2"><span>Valor</span><b class="qbtn">Gratis</b></div><div class="qbr2"><span>Comprobante</span><b>No hace falta</b></div></div>'+
  '<ol class="qbst"><li>Toca «Obtener mi código». No tienes que pagar ni adjuntar nada.</li><li>Tu código aparece <b>al instante</b> y queda guardado en <b>Mi cuenta → Mis códigos</b>.</li><li>El rol se activa solo, por 1 año.</li></ol>'+
  '<p class="err" id="qb-err" role="alert"></p><div class="row"><button type="button" class="btn pink" id="qb-free">Obtener mi código</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>')}
function freeDone(cd,o,old){modal('<h2>'+(old?'Ya tienes tu código':'¡Listo! Este es tu código')+'</h2><p class="muted" style="margin:0">'+E(o.what)+'</p><div class="qfc"><code>'+E(fmtC(cd))+'</code><button type="button" class="btn ghost" data-qfcp="'+E(cd)+'">Copiar</button></div>'+
 '<p>'+(old?'Lo pediste antes y sigue guardado en <b>Mi cuenta → Mis códigos</b>.':'Tu rol se está activando solo. También lo ves en <b>Mi cuenta → Mis códigos</b>.')+'</p><div class="row"><button type="button" class="btn pink" data-act="roleGo" data-v="'+E(o.use)+'">'+(typeof roleBtnTxt==='function'?roleBtnTxt(o.use):'Continuar')/* v256 */+'</button><button type="button" class="btn ghost" data-qbtrack="1">Ver mis códigos</button><button type="button" class="btn ghost" data-act="close">Listo</button></div>')}
function freeSave(b){var o=PAY,u=me();if(!o||!u)return;var er=document.getElementById('qb-err');
 var pv=(u.providerData||[]).map(function(x){return x.providerId});if(pv.length&&pv.every(function(x){return x==='password'})&&!u.emailVerified)return er.textContent='Primero confirma tu correo con el enlace que te enviamos y vuelve a entrar.';
 b.disabled=true;er.textContent='';
 /* v251: solicitud ya aprobada + su código en un solo paso (reglas v32). Si las reglas aún no lo permiten, queda como antes: pendiente de aprobar */
 var pr=db().collection('pagos').doc(),AL='ABCDEFGHJKMNPQRSTUVWXYZ23456789',cd=Array.from(crypto.getRandomValues(new Uint32Array(12)),function(x){return AL[x%AL.length]}).join(''),now=Date.now(),bt=db().batch();
 bt.set(pr,{from:u.uid,fromName:String(S.user&&S.user.name||'Vecino').slice(0,60),to:o.to,toName:String(o.toName||'').slice(0,60),amt:0,ref:'',what:String(o.what||'').slice(0,120),
  kind:'rol',item:String(o.item||'').slice(0,80),use:String(o.use||''),m:Number(o.m)||0,via:'gratis',img:'',st:'ok',sts:now,code:cd,ts:now});
 bt.set(db().collection('codes').doc(cd),{c:cd,use:String(o.use||''),months:12,days:365,used:false,ts:now,uid:u.uid,pago:pr.id,why:'gratis'});
 bt.commit().then(function(){PAY=null;freeDone(cd,o);tgNotify(pr.id)},function(){freeAsk(o,u,b,er)})}
/* v267: aviso por Telegram al administrador (Worker v11, POST /notify). Solo se manda el número del pago:
   el Worker lo lee con la sesión de quien pagó y arma el mensaje. Si el Worker aún no tiene Telegram, no pasa nada. */
function tgNotify(id){try{if(!id||typeof R2_WORKER==='undefined')return;QH.token().then(function(t){if(!t)return;fetch(R2_WORKER+'/notify',{method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify({id:id})}).catch(function(){})}).catch(function(){})}catch(e){}}
function freeAsk(o,u,b,er){
 db().collection('pagos').add({from:u.uid,fromName:String(S.user&&S.user.name||'Vecino').slice(0,60),to:o.to,toName:String(o.toName||'').slice(0,60),amt:0,ref:'',what:String(o.what||'').slice(0,120),
  kind:'rol',item:String(o.item||'').slice(0,80),use:String(o.use||''),m:Number(o.m)||0,via:'gratis',img:'',st:'pend',ts:Date.now()})
 .then(function(r){PAY=null;tgNotify(r&&r.id);modal('<h2>Solicitud enviada</h2><p>El administrador revisará tu solicitud. Cuando la apruebe, el código te llega a <b>Mi cuenta → Mis códigos</b> y el rol se activa solo.</p><div class="row"><button type="button" class="btn pink" data-qbtrack="1">Ver seguimiento</button><button type="button" class="btn ghost" data-act="close">Listo</button></div>')})
 .catch(function(e){b.disabled=false;er.textContent=e&&e.code==='permission-denied'?'No se pudo enviar la solicitud. Cierra sesión, vuelve a entrar e inténtalo de nuevo.':'No se pudo enviar la solicitud. Revisa tu conexión.'})}
async function paySave(b){var o=PAY,u=me();if(!o||!u)return;var er=document.getElementById('qb-err'),amt=+String(document.getElementById('qb-amt').value).replace(/\D/g,'')||0,ref=String(document.getElementById('qb-ref').value||'').trim();
 if(amt<100)return er.textContent='Escribe el valor que pagaste.';
 if(!PIMG&&ref.length<4)return er.textContent='Adjunta la captura del comprobante o escribe el número de la transacción.';
 if(ref&&ref.length<4)return er.textContent='El número de la transacción es muy corto (mínimo 4 letras o números).';
 /* v235: avisos claros en vez de "no se pudo" */
 if(u.uid===o.to)return er.textContent='Esta cuenta es la que recibe el pago: no puedes pagarte a ti mismo. Para probar, entra con otra cuenta.';
 var pv=(u.providerData||[]).map(function(x){return x.providerId});if(pv.length&&pv.every(function(x){return x==='password'})&&!u.emailVerified)return er.textContent='Primero confirma tu correo con el enlace que te enviamos y vuelve a entrar.';
 b.disabled=true;er.textContent='Guardando…';var img='';
 if(PIMG){try{img=typeof r2up==='function'?await r2up(PIMG):PIMG}catch(x){img=PIMG}if(String(img).length>300000){b.disabled=false;return er.textContent='La imagen del comprobante es muy pesada. Prueba con otra captura.'}}
 var d={from:u.uid,fromName:String(S.user&&S.user.name||'Vecino').slice(0,60),to:o.to,toName:String(o.toName||'').slice(0,60),amt:amt,ref:ref.slice(0,40),what:String(o.what||'').slice(0,120),
  kind:o.kind,item:String(o.item||'').slice(0,80),use:String(o.use||''),m:Number(o.m)||0,via:VIA,img:String(img||''),st:'pend',ts:Date.now()};
 db().collection('pagos').add(d).then(function(r){PAY=null;if(d.kind==='rol')tgNotify(r&&r.id);LAST=o.wa&&o.kind!=='rol'?{wa:o.wa,t:'Hola '+o.toName+', te pagué '+M(amt)+' por '+VN(d.via)+' ('+o.what+'). '+(d.ref?'Número de transacción: '+d.ref+'. ':'')+(d.img?'Te dejé el comprobante en Mi Pradera':'Lo registré en Mi Pradera')+' para que lo confirmes cuando te llegue.'}:null;
  modal('<h2>Pago registrado</h2><p>'+(o.kind==='rol'?'El administrador revisará el pago en su banco. Cuando lo confirme, tu rol se activa solo.':E(o.toName)+' verá tu pago en su perfil y confirmará cuando le llegue.')+' Puedes ver cómo va en <b>Mi cuenta → Pagos Bre-B y Nequi</b>.</p><div class="row">'+(LAST?'<button type="button" class="btn wa" data-qbwa="1">Avisar por WhatsApp</button>':'')+(o.kind==='rol'?'<button type="button" class="btn pink" data-qbtrack="1">Ver seguimiento</button>':'')+'<button type="button" class="btn ghost" data-act="close">Listo</button></div>')})
 .catch(function(e){b.disabled=false;er.textContent=e&&e.code==='permission-denied'?'No se pudo registrar el pago. Cierra sesión, vuelve a entrar e inténtalo de nuevo.':'No se pudo registrar el pago. Revisa tu conexión.'})}
/* ---- Mi cuenta → Pagos Bre-B ---- */
function stH(p,rc){var r=p.kind==='rol';
 if(p.st==='ok')return '<span class="qbs ok">'+(rc?'Confirmaste que llegó':r?(p.red?'Confirmado · rol activado':'Confirmado · activando el rol…'):'Confirmado: le llegó')+'</span>';
 if(p.st==='no')return '<span class="qbs no">'+(rc?'Marcaste que no llegó':'Dice que no le llegó')+'</span>';
 return '<span class="qbs p">'+(rc?'Por confirmar':'Esperando confirmación')+'</span>'}
function itH(p,rc,admL){var bt='';
 if(admL){if(p.st==='pend')bt='<button type="button" class="btn pink" data-qbact="'+E(p.id)+'">Aprobar y enviar código</button><button type="button" class="btn ghost" data-qbno="'+E(p.id)+'">No llegó</button>';
  else if(p.st==='no')bt='<button type="button" class="btn ghost" data-qbund="'+E(p.id)+'">Volver a revisar</button>';
  else if(p.st==='ok'&&p.code&&payerWa(p))bt='<button type="button" class="btn wa" data-qbwac="'+E(p.id)+'">'+(p.waAt?'Reenviar código por WhatsApp':'Enviar código por WhatsApp')+'</button>'}
 else if(rc){if(p.kind!=='rol'){bt=p.st==='pend'?'<button type="button" class="btn pink" data-qbok="'+E(p.id)+'">Sí me llegó</button><button type="button" class="btn ghost" data-qbno="'+E(p.id)+'">No me llegó</button>':'<button type="button" class="btn ghost" data-qbund="'+E(p.id)+'">Cambiar</button>'}}
 else if(p.st==='pend')bt='<button type="button" class="btn ghost" data-qbdel="'+E(p.id)+'">Borrar registro</button>';
 if(!rc&&!admL&&p.kind==='rol')bt='<button type="button" class="btn pink" data-qbtrack="1">Ver seguimiento</button>'+bt;
 return '<div class="qbi"><div class="qbh"><b>'+E(rc||admL?p.fromName:p.toName)+'</b><strong>'+E(amtT(p))+'</strong></div><small>'+E(p.what)+'</small><small>'+viaT(p)+(p.ref?' · Transacción: '+E(p.ref):'')+' · '+E(D(p.ts))+'</small>'+
  (admL&&p.code?'<small>Código enviado: '+E(fmtC(p.code))+' · '+(p.red||admUsed(p.code)?'ya lo activó':'aún sin activar')+(p.waAt?' · enviado por WhatsApp el '+E(D(p.waAt)):'')+'</small>'+(payerWa(p)?'':'<small>Esta persona no registró WhatsApp: el código solo le llega a su perfil.</small>'):'')+stH(p,rc||admL)+((bt||p.img)?'<div class="row">'+(p.img?'<button type="button" class="btn ghost" data-qbimg="'+E(p.id)+'">Ver comprobante</button>':'')+bt+'</div>':'')+'</div>'}
/* ---- v241: Recibidos y Enviados del vecino con resumen, filtros y tabla (igual que la pestaña Pagos del administrador) ---- */
var RF='',SF='';
function medH(p){return '<span class="qmd '+(p.via==='nequi'?'nq':p.via==='gratis'?'gr':'bb')+'">'+VN(p.via)+'</span>'+(p.ref?'<small>Ref. '+E(p.ref)+'</small>':'')+(p.img?'<small>Con comprobante</small>':'')}
function entH(p,rc){if(p.kind==='rol')return '';if(p.ent==='ent')return '<span class="qbs ok qbe">Entregado</span><small>'+E(D(p.ents||p.ts))+'</small>';
 if(p.ent==='env')return '<span class="qbs en qbe">'+(rc?'Enviado':'En camino')+'</span><small>'+E(D(p.ents||p.ts))+'</small>';
 return p.st==='ok'&&!rc?'<small>Aún no lo marcan como enviado</small>':''}
function vRow(p,rc){var ac=(p.img?'<button type="button" class="btn ghost" data-qbimg="'+E(p.id)+'">Comprobante</button>':'');
 if(rc)ac+=p.st==='pend'?'<button type="button" class="btn pink" data-qbok="'+E(p.id)+'">Sí me llegó</button><button type="button" class="btn ghost" data-qbno="'+E(p.id)+'">No me llegó</button>':'<button type="button" class="btn ghost" data-qbund="'+E(p.id)+'">Cambiar</button>';
 /* v242: quien vende marca si ya envió o entregó el pedido */
 if(rc&&p.kind!=='rol'&&p.st!=='no'){var en=p.ent||'';
  if(en!=='env'&&en!=='ent')ac+='<button type="button" class="btn ghost" data-qbent="'+E(p.id)+'|env">Marcar enviado</button>';
  if(en!=='ent')ac+='<button type="button" class="btn pink" data-qbent="'+E(p.id)+'|ent">Marcar entregado</button>';
  if(en)ac+='<button type="button" class="btn ghost" data-qbent="'+E(p.id)+'|">Quitar '+(en==='ent'?'entregado':'enviado')+'</button>'}
 else{if(p.kind==='rol')ac+='<button type="button" class="btn pink" data-qbtrack="1">Ver seguimiento</button>';if(p.st==='pend')ac+='<button type="button" class="btn ghost" data-qbdel="'+E(p.id)+'">Borrar registro</button>'}
 return '<tr><td class="qd" data-l="Fecha">'+E(D(p.ts))+'</td><td data-l="'+(rc?'Cliente':'Para')+'"><b>'+E(rc?p.fromName:p.toName)+'</b></td><td data-l="Concepto">'+E(p.what)+'</td><td class="qv" data-l="Valor">'+E(amtT(p))+'</td><td data-l="Medio"><span>'+medH(p)+'</span></td><td data-l="Estado"><span>'+stH(p,rc)+entH(p,rc)+'</span></td>'+
  (ac?'<td class="qx" data-l="Acciones"><div class="qac">'+ac+'</div></td>':'<td data-l="Acciones">—</td>')+'</tr>'}
function vTable(all,rc){var cnt=function(c){return all.filter(function(p){return p.st===c}).length},fv=rc?RF:SF,f=fv||(cnt('pend')?'pend':'all'),L=all.filter(function(p){return f==='all'||p.st===f}),
  m0=new Date();m0.setDate(1);m0.setHours(0,0,0,0);var pe=function(p){return p.kind!=='rol'&&p.st!=='no'&&p.ent!=='ent'};if(f==='ent0')L=all.filter(pe);var okm=all.filter(function(p){return p.st==='ok'&&(p.sts||p.ts)>=m0.getTime()}),sum=okm.reduce(function(a,p){return a+(Number(p.amt)||0)},0),k=rc?'qrf':'qsf';
 return '<div class="qps"><div><b>'+cnt('pend')+'</b><span>'+(rc?'Por confirmar':'Esperando confirmación')+'</span></div><div><b>'+E(M(sum))+'</b><span>'+(rc?'Recibido':'Pagado y confirmado')+' este mes ('+okm.length+(okm.length===1?' pago':' pagos')+')</span></div></div>'+
  '<div class="qbt qpf" role="tablist" aria-label="Filtrar pagos">'+[['pend',(rc?'Por confirmar':'Esperando')+' ('+cnt('pend')+')'],['ok','Confirmados ('+cnt('ok')+')']].concat(rc?[['ent0','Por entregar ('+all.filter(pe).length+')']]:[]).concat([['no','No llegaron ('+cnt('no')+')'],['all','Todos ('+all.length+')']]).map(function(t){return '<button type="button" role="tab" data-'+k+'="'+t[0]+'" aria-selected="'+(f===t[0])+'">'+t[1]+'</button>'}).join('')+'</div>'+
  (L.length?'<div class="qtw"><table class="qpt"><thead><tr><th>Fecha</th><th>'+(rc?'Cliente':'Para')+'</th><th>Concepto</th><th>Valor</th><th>Medio</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>'+L.map(function(p){return vRow(p,rc)}).join('')+'</tbody></table></div>'
   :'<p class="muted">No hay pagos en esta lista.</p>')}
function recvH(){var u=me();if(!u)return '<p class="muted">Para ver y confirmar pagos entra con tu correo y tu clave.</p>';var L=RECV.filter(function(p){return p.kind!=='rol'});
 return '<p class="qbw">Antes de tocar «Sí me llegó», abre la app de tu banco o de Nequi y revisa que el dinero sí llegó. Los pantallazos de pago pueden ser falsos.</p>'+
  (L.length?vTable(L,true):'<p class="muted">Aún no tienes pagos recibidos.</p>')+/* v241: tabla como la del administrador */
  (hasP(PRO[u.uid])?'':'<p class="muted">Para recibir pagos registra tu llave Bre-B o tu Nequi en la pestaña «Cobrar».</p>')}
function sentH(){if(!me())return '<p class="muted">Para ver tus pagos entra con tu correo y tu clave.</p>';
 return SENT.length?vTable(SENT,false)/* v241 */:'<p class="muted">Aún no has registrado pagos. Busca el botón «Pagar con Bre-B» o «Pagar con Nequi» en tiendas, servicios y anuncios.</p>'}
function admH(){var L=RECV.filter(function(p){return p.kind==='rol'});
 return '<p class="qbw">Antes de aprobar, revisa en tu banco o en Nequi que el dinero llegó. Al aprobar se crea un código: la persona lo ve en Mi cuenta → Mis códigos y el rol se activa solo. Si registró WhatsApp, también se lo puedes enviar por ahí.</p>'+
  (L.length?'<div class="qbl">'+L.map(function(p){return itH(p,false,true)}).join('')+'</div>':'<p class="muted">Aún no hay pagos de roles.</p>')}
function keyH(){var u=me();if(!u)return '<p class="muted">Para recibir pagos entra con tu correo y tu clave.</p>';var p=PRO[u.uid]||{},a=KM==='adm';QRD='';
 return '<p class="muted">'+(a?'Datos de pago de Mi Pradera: aquí pagan los roles.':'Tus datos aparecen con el botón «Pagar» en tus tiendas, servicios y anuncios. El dinero llega directo a tu banco o a tu Nequi: Mi Pradera no lo toca.')+'</p>'+
  '<label for="qb-tn">Nombre del titular de la cuenta</label><input type="text" id="qb-tn" maxlength="80" autocomplete="off" value="'+E(p.tn||'')+'" placeholder="Como aparece en tu banco o en Nequi">'+
  '<p class="muted" style="font-size:13px;margin:4px 0 0">Por seguridad se guarda y se muestra así: <b id="qb-tnv">'+E(p.tn||mask('Ana Elizabeth Meléndez'))+'</b></p>'+
  '<p class="muted" style="margin-top:12px">Llena al menos uno: la llave Bre-B o el número de Nequi.</p>'+
  '<label for="qb-key">Llave Bre-B (opcional)</label><input type="text" id="qb-key" maxlength="80" autocomplete="off" value="'+E(p.key||'')+'" placeholder="Celular, correo o @tullave">'+
  '<p class="qbw">No uses tu cédula como llave: la verían todos. Usa tu celular, tu correo o una llave alfanumérica (@…).</p>'+
  '<label for="qb-bk">Banco o billetera de esa llave</label><select id="qb-bk"><option value="">'+(p.bk?'Guardado: '+E(p.bk):'Elige…')+'</option>'+BANKS.map(function(x){return '<option>'+E(x)+'</option>'}).join('')+'</select>'+
  '<label for="qb-nq">Número de Nequi (opcional)</label><input type="tel" id="qb-nq" inputmode="numeric" maxlength="14" autocomplete="off" value="'+E(p.nq||'')+'" placeholder="3001234567">'+
  '<label for="qb-qr">Código QR de Bre-B (opcional)</label><img class="qbq" id="qb-qrv" src="'+E(p.qr||'')+'" alt="Código QR"'+(p.qr?'':' hidden')+'><input type="file" id="qb-qr" accept="image/*"><p class="muted" style="font-size:13px;margin:4px 0 0">Lo descargas desde la app de tu banco, en la opción Bre-B.</p>'+
  '<p class="err" id="qb-kerr" role="alert"></p><div class="row"><button type="button" class="btn pink" id="qb-ksave">Guardar</button>'+(hasP(p)?'<button type="button" class="btn ghost" id="qb-kdel">Quitar mis datos</button>':'')+'</div>'}
function tabsH(){var n=RECV.filter(function(p){return p.kind!=='rol'&&p.st==='pend'}).length;
 return '<div class="qbt" role="tablist">'+[['recv','Recibidos'+(n?'<em>'+n+'</em>':'')],['sent','Enviados'],['key','Cobrar']].map(function(t){return '<button type="button" role="tab" data-qbtab="'+t[0]+'" aria-selected="'+(tab===t[0])+'">'+t[1]+'</button>'}).join('')+'</div>'}
function myOpen(t){if(!S.user){try{need(function(){myOpen(t)})}catch(e){}return}KM='';tab=t||'recv';pseeAll();/* v244 */
 modal('<h2>Pagos Bre-B y Nequi</h2><div id="qb-tabs">'+tabsH()+'</div><div id="qb-list"></div><div class="row" style="margin-top:12px"><button type="button" class="btn ghost" data-act="close">Cerrar</button></div>');var md=document.querySelector('#ov .modal');if(md)md.classList.add('qwide')/* v241: más ancha para la tabla */;paintList(true)}
function paintList(force){var el=document.getElementById('qb-list');if(!el)return;
 if(tab==='key'){if(force){el._h='';el.innerHTML=keyH()}return}
 var h=tab==='adm'?admH():tab==='sent'?sentH():recvH();if(force||el._h!==h){el._h=h;el.innerHTML=h}
 var tb=document.getElementById('qb-tabs');if(tb){var th=tabsH();if(tb._h!==th){tb._h=th;tb.innerHTML=th}}}
function paint(){try{inject()}catch(e){}paintList(false);try{paintNews()}catch(e){}try{paintPag()}catch(e){}try{myCodesListen();paintCodes()}catch(e){}
 var n=pend(),l=document.querySelectorAll('.pnr[data-act="brebOpen"] i');for(var i=0;i<l.length;i++){var em=l[i].querySelector('.pnbd');if(n){if(!em){em=document.createElement('em');em.className='pnbd';l[i].appendChild(em)}em.textContent=n}else if(em)em.remove()}
 var a=document.getElementById('qb-admn');if(a){var k=RECV.filter(function(p){return p.kind==='rol'&&p.st==='pend'}).length;a.textContent=k?'('+k+' por revisar)':''}}
/* ---- guardar la llave ---- */
/* ---- v236: MIS CÓDIGOS. Seguimiento de cada pago de rol (pago → revisión → código → rol activado) y tabla con los códigos
   de la persona: código, rol, días que faltan y fecha de vencimiento. Lee "codes" donde usedBy = su ficha de plan o uid = su uid
   (reglas de Firestore v28). Cada código guarda su vencimiento (end) al canjearlo. ---- */
var QA=[],QB=[],csub=[],ckey='';
function docs(sn){var a=[];sn.forEach(function(d){var x=d.data();x.c=x.c||d.id;a.push(x)});return a}
function myCodesListen(){var u=me(),k='';try{k=S.user?QH.key():''}catch(e){}var id=u?u.uid+'|'+k:'';if(id===ckey)return;ckey=id;csub.forEach(function(f){try{f()}catch(e){}});csub=[];QA=[];QB=[];if(!u)return;
 var c=db().collection('codes');if(k)csub.push(c.where('usedBy','==',k).onSnapshot(function(sn){QA=docs(sn);paintCodes()},function(){}));
 csub.push(c.where('uid','==',u.uid).onSnapshot(function(sn){QB=docs(sn);paintCodes()},function(){}))}
function codesRows(){var m={};QB.concat(QA).forEach(function(c){m[c.c]=c});return Object.keys(m).map(function(k){return m[k]}).sort(function(a,b){return (b.usedAt||b.ts||0)-(a.usedAt||a.ts||0)})}
function cEnd(c){return c.used?(Number(c.end)||((Number(c.usedAt)||0)+(Number(c.days)||0)*864e5)):0}
function dLeft(e){return Math.ceil((e-Date.now())/864e5)}
function fd(t){try{return new Date(t).toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'})}catch(e){return ''}}
function roleN(u){try{return (USES[u]||COMU[u]||{}).n||u}catch(e){return u}}
function fmtC(c){try{return codeFmt(c)}catch(e){return c}}
/* v237: WhatsApp de quien pagó (de su ficha de plan) y mensaje con el código */
function payerWa(p){try{var pl=QH.plans().find(function(x){return x.uid===p.from});return pl&&pl.wa?String(pl.wa).replace(/\D/g,''):''}catch(e){return ''}}
function sendCodeWa(p){var w=payerWa(p);if(!w||!p.code)return T('Esta persona no registró WhatsApp.');
 waOpen(w,'Hola '+(p.fromName||'')+', '+(p.via==='gratis'?'tu solicitud de «'+p.what+'» fue aprobada.':'tu pago de '+M(p.amt)+' por '+VN(p.via)+' para «'+p.what+'» fue aprobado.')+' Tu código es: '+fmtC(p.code)+'. Se activa solo cuando abras Mi Pradera y también lo ves en Mi cuenta → Mis códigos. https://mipradera.com.co');
 db().collection('pagos').doc(p.id).update({waAt:Date.now()}).catch(function(){})}
function admUsed(c){try{var x=QH.codes().find(function(y){return y.c===c});return !!(x&&x.used)}catch(e){return false}}
function stp(c,t,d){return '<li class="'+c+'"><i aria-hidden="true">'+(c==='ok'?'✓':c==='no'?'✕':'')+'</i><span><b>'+t+'</b>'+d+'</span></li>'}
function trackH(){var L=SENT.filter(function(p){return p.kind==='rol'});if(!L.length)return '';
 return '<h3 class="qch">Cómo van tus pagos y solicitudes</h3><div class="qbl">'+L.map(function(p){var c=p.code?codesRows().find(function(x){return x.c===p.code}):null,e=c?cEnd(c):0,act=!!(p.red||(c&&c.used)),no=p.st==='no';
  var gr=p.via==='gratis';
  return '<div class="qbi"><div class="qbh"><b>'+E(p.what)+'</b><strong>'+E(amtT(p))+'</strong></div><small>'+viaT(p)+' · '+E(D(p.ts))+'</small><ol class="qst">'+
   stp('ok',gr?'Solicitud enviada':'Pago enviado',(gr?'La enviaste el ':'Lo registraste el ')+E(D(p.ts)))+
   stp(p.st==='ok'?'ok':no?'no':'now',no?(gr?'Solicitud no aprobada':'Pago no aprobado'):'Revisión del administrador',p.st==='ok'?'Aprobado el '+E(D(p.sts||p.ts)):no?(gr?'El administrador no aprobó la solicitud.':'El administrador no encontró el pago en su cuenta.'):(gr?'El administrador está revisando tu solicitud.':'El administrador está revisando el pago en su banco.'))+
   (no?'':stp(p.code?'ok':p.st==='ok'?'now':'off','Código entregado',p.code?'Tu código: <code>'+E(fmtC(p.code))+'</code> <button type="button" class="btn ghost qcp" data-qbccp="'+E(p.code)+'" aria-label="Copiar el código '+E(fmtC(p.code))+'">Copiar</button>':(gr?'Llega cuando la solicitud sea aprobada.':'Llega cuando el pago sea aprobado.'))+
    stp(act?'ok':p.code?'now':'off','Rol activado',act?(e?'Vence el '+E(fd(e))+(dLeft(e)>0?' · faltan '+dLeft(e)+(dLeft(e)===1?' día':' días'):' · ya venció')+'.':'Listo.'):p.code?'Se activa solo al abrir la página.':'Se activa cuando llegue el código.'))+'</ol>'+
   (no?'<div class="row"><button type="button" class="btn wa" data-qbadmwa="'+E(p.id)+'">Escribir al administrador</button></div>':'')+'</div>'}).join('')+'</div>'}
function tableH(){var L=codesRows();
 if(!L.length)return '<p class="muted">Aún no tienes códigos. Cuando el administrador apruebe tu pago o canjees un código, aparece aquí.</p>';
 return '<table class="qct"><thead><tr><th>Código</th><th>Rol</th><th>Faltan</th></tr></thead><tbody>'+L.map(function(c){var e=cEnd(c),d=e?dLeft(e):0,f;
  if(!c.used)f='<b class="qcs p">Sin activar</b><button type="button" class="btn ghost" data-qbuse="'+E(c.c)+'">Activar</button>';
  else if(d>0)f='<b class="qcs ok">'+d+(d===1?' día':' días')+'</b><small>Vence el '+E(fd(e))+'</small>';
  else f='<b class="qcs no">Vencido</b><small>El '+E(fd(e))+'</small>';
  var mo='';try{mo=COMU[c.use]?(COM_DAYS[c.use]+' días'):codeMn(c.months)}catch(x){}
  return '<tr><td><code>'+E(fmtC(c.c))+'</code><button type="button" class="btn ghost qcp" data-qbccp="'+E(c.c)+'" aria-label="Copiar el código '+E(fmtC(c.c))+'">Copiar</button></td><td>'+E(roleN(c.use))+'<small>'+E(mo)+'</small></td><td>'+f+'</td></tr>'}).join('')+'</tbody></table>'+
  '<p class="muted" style="font-size:13px;margin-top:8px">Si tienes varios códigos del mismo rol, cada uno empieza a contar cuando termina el anterior.</p>'}
function codesH(){var u=me();
 if(!u)return '<div class="qbw"><b>Tu sesión segura se cerró.</b> Por eso no se ven tus pagos ni tus códigos. Vuelve a entrar con tu correo (o tu celular) y tu clave.</div><div class="row"><button type="button" class="btn pink" data-qbrelog="1">Volver a entrar</button></div>';/* v243 */
 return '<p class="muted" style="font-size:13px;margin:6px 0 0">Cuenta: '+E(u.email||u.phoneNumber||(S.user&&S.user.name)||'')+'</p>'+trackH()+'<h3 class="qch">Mis códigos</h3>'+tableH()}
function paintCodes(){var el=document.getElementById('qc-body');if(!el)return;var h=codesH();if(el._h!==h){el._h=h;el.innerHTML=h}}
/* ---- v243: avisos de "Mis códigos": número en el botón y aviso en la esquina superior derecha cuando el administrador
   aprueba (o no aprueba) un pago o una solicitud de código. Se marcan como vistos al abrir "Mis códigos". ---- */
function seenK(){var u=me();return u?'qh_cseen_'+u.uid:''}
function seen(){try{return JSON.parse(localStorage.getItem(seenK())||'[]')}catch(e){return []}}
function news(){var v=seen();return SENT.filter(function(p){return p.kind==='rol'&&(p.st==='ok'&&p.code||p.st==='no')&&v.indexOf(p.id+':'+p.st)<0})}
function seeAll(){var k=seenK();if(!k)return;var v=seen();SENT.forEach(function(p){if(p.kind==='rol'&&p.st!=='pend'&&v.indexOf(p.id+':'+p.st)<0)v.push(p.id+':'+p.st)});try{localStorage.setItem(k,JSON.stringify(v.slice(-200)))}catch(e){}paintNews()}
window.codesBadge=function(){var n=news().length;return n?{n:n,t:n===1?'1 novedad':n+' novedades'}:''};
/* v244: también avisa de pagos nuevos por confirmar (Recibidos); se marcan vistos al abrir "Pagos Bre-B y Nequi" */
function pseenK(){var u=me();return u?'qh_pseen_'+u.uid:''}
function pseen(){try{return JSON.parse(localStorage.getItem(pseenK())||'[]')}catch(e){return []}}
function pnews(){var v=pseen();return RECV.filter(function(p){return p.kind!=='rol'&&p.st==='pend'&&v.indexOf(p.id)<0})}
function pseeAll(){var k=pseenK();if(!k)return;var v=pseen();RECV.forEach(function(p){if(p.kind!=='rol'&&v.indexOf(p.id)<0)v.push(p.id)});try{localStorage.setItem(k,JSON.stringify(v.slice(-300)))}catch(e){}paintNews()}
function paintNews(){var L=adm()?[]:news(),n=L.length,l=document.querySelectorAll('.pnr[data-act="myCodes"] i');
 for(var i=0;i<l.length;i++){var em=l[i].querySelector('.pnbd');if(n){if(!em){em=document.createElement('em');em.className='pnbd';l[i].appendChild(em)}if(em.textContent!==String(n))em.textContent=n}else if(em)em.remove()}
 var P=adm()?[]:pnews(),b=document.getElementById('qnot');if((!n&&!P.length)||document.querySelector('.overlay')){if(b)b.remove();return}
 var ok=L.filter(function(p){return p.st==='ok'}).length,t=ok?(ok===1?'Tu código ya llegó':'Te llegaron '+ok+' códigos'):'Hay novedades en tu pago',h='';
 if(n)h+='<div class="qnot"><button type="button" class="qnot-go" data-act="myCodes"><i aria-hidden="true">🔑</i><span><b>'+E(t)+'</b><small>Toca para verlo en Mis códigos</small></span></button><button type="button" class="qnot-x" data-qnotx="c" aria-label="Cerrar aviso">×</button></div>';
 if(P.length)h+='<div class="qnot"><button type="button" class="qnot-go" data-act="brebOpen"><i aria-hidden="true">💳</i><span><b>'+(P.length===1?'Tienes un pago nuevo por confirmar':'Tienes '+P.length+' pagos nuevos por confirmar')+'</b><small>'+E(P[0].fromName)+' · '+E(amtT(P[0]))+' · toca para verlo</small></span></button><button type="button" class="qnot-x" data-qnotx="p" aria-label="Cerrar aviso">×</button></div>';
 if(!b){b=document.createElement('div');b.id='qnot';b.className='qnots';b.setAttribute('role','status');document.body.appendChild(b)}
 if(b._h!==h){b._h=h;b.innerHTML=h}}
function myCodesOpen(){if(!S.user){try{need(myCodesOpen)}catch(e){}return}myCodesListen();seeAll();
 modal('<h2>Mis códigos</h2><p class="muted" style="margin:0">Aquí ves cómo va el pago de tus roles y todos tus códigos.</p><div id="qc-body"></div><div class="row" style="margin-top:12px"><button type="button" class="btn ghost" data-act="close">Cerrar</button></div>');paintCodes()}
window.myCodesOpen=myCodesOpen;
function useCode(c,b){if(b)b.disabled=true;QH.codeRedeem(c).then(function(r){T('Rol activado: '+roleN(r.use)+' hasta el '+fd(r.end));var p=SENT.find(function(x){return x.code===c});if(p)red(p.id);try{render(true)}catch(e){}try{roleGo(r.use)}catch(e){}/* v256 */})
 .catch(function(e){if(b)b.disabled=false;T((e&&e.m)||'No se pudo activar el código.')})}
/* ---- v238: PESTAÑA "PAGOS" DEL ADMINISTRADOR: resumen, filtros y tabla de los pagos de roles ---- */
var PF='';
window.brebAdmPend=function(){return RECV.filter(function(p){return p.kind==='rol'&&p.st==='pend'}).length};
function rowP(p){var med='<span class="qmd '+(p.via==='nequi'?'nq':p.via==='gratis'?'gr':'bb')+'">'+VN(p.via)+'</span>'+(p.ref?'<small>Ref. '+E(p.ref)+'</small>':'')+(p.img?'<small>Con comprobante</small>':''),
  est=p.st==='ok'?'<span class="qbs ok">Aprobado</span><small>Código <code>'+E(fmtC(p.code||''))+'</code></small><small>'+(p.red||admUsed(p.code)?'Ya lo activó':'Aún sin activar')+(p.waAt?' · enviado por WhatsApp':'')+'</small>'
   :p.st==='no'?'<span class="qbs no">No aprobado</span>':'<span class="qbs p">Por revisar</span>',
  ac=(p.img?'<button type="button" class="btn ghost" data-qbimg="'+E(p.id)+'">Comprobante</button>':'')+
   (p.st==='pend'?'<button type="button" class="btn pink" data-qbact="'+E(p.id)+'">Aprobar</button><button type="button" class="btn ghost" data-qbno="'+E(p.id)+'">'+(p.via==='gratis'?'No aprobar':'No llegó')+'</button>'
   :p.st==='no'?'<button type="button" class="btn ghost" data-qbund="'+E(p.id)+'">Volver a revisar</button>'
   :(p.code&&payerWa(p)?'<button type="button" class="btn wa" data-qbwac="'+E(p.id)+'">'+(p.waAt?'Reenviar':'Enviar')+' por WhatsApp</button>':''))+
   '<button type="button" class="btn ghost qdel" data-qbadel="'+E(p.id)+'">Eliminar</button>';/* v247: el administrador borra cualquier registro */
 return '<tr><td class="qd" data-l="Fecha">'+E(D(p.ts))+'</td><td data-l="Persona"><b>'+E(p.fromName)+'</b></td><td data-l="Rol">'+E(String(p.what||'').replace(/^Rol /,''))+'</td><td class="qv" data-l="Valor">'+E(amtT(p))+'</td><td data-l="Medio"><span>'+med+'</span></td><td data-l="Estado"><span>'+est+'</span></td>'+(ac?'<td class="qx" data-l="Acciones"><div class="qac">'+ac+'</div></td>':'<td data-l="Acciones">—</td>')+'</tr>'}
function pagBody(){var all=RECV.filter(function(p){return p.kind==='rol'}),cnt=function(c){return all.filter(function(p){return p.st===c}).length},f=PF||(cnt('pend')?'pend':'all'),
  L=all.filter(function(p){return f==='all'||p.st===f}),m0=new Date();m0.setDate(1);m0.setHours(0,0,0,0);
 var okm=all.filter(function(p){return p.st==='ok'&&(p.sts||p.ts)>=m0.getTime()}),sum=okm.reduce(function(a,p){return a+(Number(p.amt)||0)},0);
 return '<div class="qps"><div><b>'+cnt('pend')+'</b><span>Por revisar</span></div><div><b>'+E(M(sum))+'</b><span>Aprobado este mes ('+okm.length+(okm.length===1?' pago':' pagos')+')</span></div></div>'+
  '<p class="qbw">Antes de aprobar, revisa en tu banco o en Nequi que el dinero llegó. Al aprobar se crea el código: la persona lo ve en Mi cuenta → Mis códigos y el rol se activa solo.</p>'+
  '<div class="qbt qpf" role="tablist" aria-label="Filtrar pagos">'+[['pend','Por revisar ('+cnt('pend')+')'],['ok','Aprobados ('+cnt('ok')+')'],['no','No aprobados ('+cnt('no')+')'],['all','Todos ('+all.length+')']].map(function(t){return '<button type="button" role="tab" data-qpf="'+t[0]+'" aria-selected="'+(f===t[0])+'">'+t[1]+'</button>'}).join('')+'</div>'+
  (L.length?'<div class="qdall"><button type="button" class="btn ghost qdel" data-qbadelall="'+f+'">Eliminar '+(L.length===1?'este registro':'los '+L.length+' registros de esta lista')+'</button></div>':'')+/* v247 */
  (L.length?'<div class="qtw"><table class="qpt"><thead><tr><th>Fecha</th><th>Persona</th><th>Rol</th><th>Valor</th><th>Medio</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>'+L.map(rowP).join('')+'</tbody></table></div>'
   :'<p class="muted">No hay pagos en esta lista.</p>')}
function paintPag(){var el=document.getElementById('qp-body');if(el){var h=pagBody();if(el._h!==h){el._h=h;el.innerHTML=h}}
 var tb=document.querySelector('.tabs [data-act="at"][data-v="pag"]');if(tb){var n=window.brebAdmPend(),em=tb.querySelector('.admn');/* v246: el número va en la esquina del cuadro */if(n){if(!em){em=document.createElement('em');em.className='admn';tb.appendChild(em)}if(em.textContent!==String(n))em.textContent=n}else if(em)em.remove()}}
window.brebPagHTML=function(){return '<div class="cg"><h3>Pagos de roles (Bre-B y Nequi)</h3><div id="qp-body">'+pagBody()+'</div></div>'+brebAdmHTML()};
/* v235: achica la foto del comprobante (máx. 1100 px y ~280 KB) y la muestra en grande */
function shrink(f,max,lim,cb){var rd=new FileReader();rd.onload=function(){var im=new Image();im.onload=function(){var w=im.width,h=im.height,sc=Math.min(1,max/Math.max(w,h)),q=.82,du='';
  for(var k=0;k<7;k++){var c=document.createElement('canvas');c.width=Math.round(w*sc);c.height=Math.round(h*sc);var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
   du=c.toDataURL('image/webp',q);if(du.slice(0,15)!=='data:image/webp')du=c.toDataURL('image/jpeg',q);if(du.length<=lim)break;sc*=.82;q=Math.max(.5,q-.08)}cb(du)};im.src=rd.result};rd.readAsDataURL(f)}
function imgView(src){var o=document.createElement('div');o.className='qbiv';o.setAttribute('role','dialog');o.setAttribute('aria-label','Comprobante del pago');o.innerHTML='<img alt="Comprobante del pago"><button type="button" class="btn ghost">Cerrar</button>';o.querySelector('img').src=src;
 var k=function(e){if(e.key==='Escape'){e.stopPropagation();cl()}},cl=function(){document.removeEventListener('keydown',k,true);o.remove()};o.addEventListener('click',cl);document.addEventListener('keydown',k,true);document.body.appendChild(o);o.querySelector('button').focus()}
function qrPick(f){if(!f)return;var rd=new FileReader();rd.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,520/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);var du=c.toDataURL('image/webp',.85);if(du.slice(0,15)!=='data:image/webp')du=c.toDataURL('image/jpeg',.85);QRD=du;var v=document.getElementById('qb-qrv');if(v){v.src=du;v.hidden=false}};im.src=rd.result};rd.readAsDataURL(f)}
async function keySave(b){var u=me(),er=document.getElementById('qb-kerr');if(!u)return;var k=String(document.getElementById('qb-key').value||'').trim(),nq=String(document.getElementById('qb-nq').value||'').replace(/\D/g,''),
  tn=mask(document.getElementById('qb-tn').value),bs=document.getElementById('qb-bk').value,bk=bs?mask(bs):((PRO[u.uid]||{}).bk||'');
 if(tn.replace(/[\s*]/g,'').length<3||tn.indexOf(' ')<0)return er.textContent='Escribe el nombre completo del titular, como aparece en tu banco.';
 if(k&&!bk)return er.textContent='Elige el banco o la billetera de tu llave Bre-B.';
 if(!k&&!nq)return er.textContent='Escribe tu llave Bre-B, tu número de Nequi o los dos.';
 if(k&&k.length<3)return er.textContent='La llave Bre-B es muy corta.';
 if(nq&&!/^3\d{9}$/.test(nq))return er.textContent='El número de Nequi debe tener 10 dígitos y empezar por 3.';
 if(/^\d{6,10}$/.test(k)&&!/^3\d{9}$/.test(k)){var go=true;try{go=await askC('Ese número parece una cédula. Todos los vecinos la verían. ¿Quieres usarla igual?','Usarla igual')}catch(e){}if(!go)return}
 b.disabled=true;er.textContent='';var p=PRO[u.uid]||{},qr=p.qr||'';
 try{if(QRD){qr=typeof r2up==='function'?await r2up(QRD):QRD;if(String(qr).length>380000)throw{m:'La imagen del QR es muy pesada. Prueba con otra.'}}
  await db().collection('breb').doc(u.uid).set({key:k.slice(0,80),nq:nq,tn:tn.slice(0,80),bk:k?bk.slice(0,40):'',name:String(KM==='adm'?'Mi Pradera':(S.user&&S.user.name)||'Vecino').slice(0,60),qr:String(qr||''),ts:Date.now()});QRD='';
  T('Datos de pago guardados');if(KM==='adm')closeModal(1);else{tab='recv';paintList(true)}}
 catch(e){er.textContent=(e&&e.m)||(e&&e.code==='permission-denied'?'No se pudo guardar. Entra con tu correo y tu clave.':'No se pudo guardar. Revisa tu conexión.')}b.disabled=false}
async function keyDel(){var u=me();if(!u)return;var go=true;try{go=await askC('¿Quitar tus datos de pago? El botón «Pagar» deja de salir en tus publicaciones.','Quitar')}catch(e){}if(!go)return;
 db().collection('breb').doc(u.uid).delete().then(function(){T('Datos de pago quitados');paintList(true)}).catch(function(){T('No se pudo quitar.')})}
/* ---- confirmar o no un pago ---- */
function setSt(id,st,msg){db().collection('pagos').doc(id).update({st:st,sts:Date.now()}).then(function(){T(msg)}).catch(function(){T('No se pudo guardar. Revisa tu conexión.')})}
async function admAct(id){var p=RECV.find(function(x){return x.id===id});if(!p)return;var go=true;
 try{go=await askC(p.via==='gratis'?'¿Aprobar la solicitud gratis de '+p.fromName+' para «'+p.what+'»? Se crea el código y lo verá en su perfil.':'¿Ya revisaste en tu banco o en Nequi que llegaron '+M(p.amt)+' de '+p.fromName+'? Se crea el código y '+p.fromName+' lo verá en su perfil.','Aprobar y enviar código')}catch(e){}if(!go)return;
 try{/* v236: el código queda ligado a la persona (uid) y al pago, así aparece en su tabla "Mis códigos" */
  var isC=typeof COMU==='object'&&COMU[p.use],mo=isC?0:(Number(p.m)||0),dy=(isC?COM_DAYS[p.use]:CODE_DAYS[mo])||0;if(!dy)throw 0;
  var AL='ABCDEFGHJKMNPQRSTUVWXYZ23456789',cd=Array.from(crypto.getRandomValues(new Uint32Array(12)),function(x){return AL[x%AL.length]}).join('');
  await db().collection('codes').doc(cd).set({c:cd,use:p.use,months:mo,days:dy,used:false,ts:Date.now(),uid:p.from,pago:id,pref:String(p.ref||'').slice(0,40)});
  await db().collection('pagos').doc(id).update({st:'ok',sts:Date.now(),code:cd});T('Pago aprobado. El código ya está en el perfil de '+p.fromName+'.');
  /* v237: si la persona registró WhatsApp, ofrecer enviarle el código también por ahí */
  if(payerWa(p)){var go2=false;try{go2=await askC('El código ya está en el perfil de '+p.fromName+'. ¿También se lo envías por WhatsApp?','Enviar por WhatsApp')}catch(x){}if(go2)sendCodeWa(Object.assign({},p,{id:id,code:cd}))}}
 catch(e){T('No se pudo activar el rol.')}}
/* ---- tarjeta en Administrar → Mis datos ---- */
window.brebAdmHTML=function(){var p=PRO[aid()]||{},n=RECV.filter(function(x){return x.kind==='rol'&&x.st==='pend'}).length;
 return '<div class="cg" style="margin-top:14px"><h3>Configuración de pagos</h3><p class="muted">Cada vecino registra su llave Bre-B o su Nequi y recibe los pagos directo. Los roles se pagan a los datos de Mi Pradera; tú confirmas el pago aquí y el rol se activa solo.</p>'+
  '<label class="chk"><input type="checkbox" id="breb-on"'+(on()?' checked':'')+'> Mostrar los botones «Pagar con Bre-B / Nequi» en la página</label>'+
  '<p class="muted" style="margin-top:8px">Mi Pradera · Bre-B: <b>'+(p.key?E(p.key):'sin configurar')+'</b> · Nequi: <b>'+(p.nq?E(p.nq):'sin configurar')+'</b></p>'+
  '<div class="row"><button type="button" class="btn ghost" data-qbadm="key">'+(hasP(p)?'Cambiar datos de pago':'Configurar datos de pago')+'</button></div></div>'};
document.addEventListener('change',function(e){var t=e.target;if(!t)return;
 if(t.id==='qb-qr')qrPick(t.files&&t.files[0]);
 else if(t.id==='qb-img'&&t.files&&t.files[0])shrink(t.files[0],1100,280000,function(du){PIMG=du;var er=document.getElementById('qb-err');if(er)er.textContent=''});
 else if(t.id==='breb-on'){try{S.site=Object.assign({},S.site,{breb:!!t.checked});save();T(t.checked?'Pagos con Bre-B y Nequi activados':'Pagos con Bre-B y Nequi ocultos')}catch(x){}}});
document.addEventListener('input',function(e){if(e.target&&e.target.id==='qb-tn'){var v=document.getElementById('qb-tnv');if(v)v.textContent=mask(e.target.value)||mask('Ana Elizabeth Meléndez');return}if(e.target&&e.target.id==='qb-amt'&&!e.target.readOnly){var v=e.target.value,f=moneyFmt(v);if(v!==f)e.target.value=f}});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-act="brebOpen"],.qbb,.qbr,[data-qbcp],[data-qbvia],[data-qbimg],[data-act="myCodes"],[data-qbtrack],[data-qfcp],[data-qbuse],[data-qbadmwa],[data-qbwac],[data-qpf],[data-qrf],[data-qsf],[data-qbent],[data-qbadel],[data-qbadelall],[data-qbrelog],[data-qnotx],[data-qbccp],#qb-free,#qb-go,[data-qbwa],[data-qbtab],[data-qbok],[data-qbno],[data-qbund],[data-qbdel],[data-qbact],[data-qbadm],#qb-ksave,#qb-kdel');if(!b)return;
 e.preventDefault();e.stopPropagation();var d=b.dataset;
 if(d.act==='brebOpen')return myOpen();
 if(b.classList.contains('qbb')){var i=info(b.previousElementSibling);if(i)payOpen({to:i.o,toName:(PRO[i.o]&&PRO[i.o].name)||i.n,amt:i.amt,what:i.what,kind:'item',item:i.item,wa:i.wa});return}
 if(b.classList.contains('qbr')){var g=b.previousElementSibling,o={to:aid(),toName:'Mi Pradera',kind:'rol'};
  try{if(g.id==='cm-go'){if(cmSel==='free')return T('Primero elige un plan.');o.use=cmSel;o.m=0;o.amt=comPrice(cmSel);o.what='Plan de Clasificados: '+COMU[cmSel].n}
   else{o.use=g.dataset.u;o.m=+g.dataset.m;o.amt=codePriceNow(o.use,o.m);o.what='Rol '+USES[o.use].n+' por '+codeMn(o.m)}}catch(x){return}
  o.item='rol:'+o.use+':'+o.m;if(!(Number(o.amt)>0)){o.amt=0;return freeOpen(o)}/* v240 */return payOpen(o)}
 if(d.qbcp!=null){var p=PAY&&PRO[PAY.to];if(p)cpTxt(VIA==='nequi'?p.nq:p.key,VIA==='nequi'?'Número copiado':'Llave copiada');return}
 if(d.qbvia){VIA=d.qbvia;var vl=b.parentNode.querySelectorAll('[data-qbvia]');for(var z=0;z<vl.length;z++)vl[z].setAttribute('aria-selected',vl[z]===b);var vb=document.getElementById('qb-via');if(vb)vb.innerHTML=viaH();return}
 if(d.qfcp){try{cpTxt(fmtC(d.qfcp),'Código copiado')}catch(x){}return}
 if(d.act==='myCodes'||d.qbtrack)return myCodesOpen();
 if(d.qbuse)return useCode(d.qbuse,b);
 if(d.qbccp){cpTxt(fmtC(d.qbccp),'Código copiado');return}
 if(d.qbrelog){closeModal(1);try{loginForm()}catch(x){}return}
 if(d.qnotx){if(d.qnotx==='p')pseeAll();else seeAll();return}
 if(d.qbadel){var pd=RECV.find(function(y){return y.id===d.qbadel});askC('¿Eliminar el registro de '+(pd?pd.fromName+' ('+amtT(pd)+')':'este pago')+'? No se puede deshacer. El dinero no se mueve: solo se borra el registro.'+(pd&&pd.code?' El código ya entregado sigue sirviendo.':''),'Eliminar').then(function(ok){if(ok)db().collection('pagos').doc(d.qbadel).delete().then(function(){T('Registro eliminado')}).catch(function(){T('No se pudo eliminar.')})});return}
 if(d.qbadelall){var fv=d.qbadelall,LL=RECV.filter(function(p){return p.kind==='rol'&&(fv==='all'||p.st===fv)});askC('¿Eliminar '+LL.length+(LL.length===1?' registro':' registros')+' de pagos? No se puede deshacer. Los códigos ya entregados siguen sirviendo.','Eliminar todo').then(function(ok){if(!ok)return;var bt=db().batch();LL.slice(0,450).forEach(function(p){bt.delete(db().collection('pagos').doc(p.id))});bt.commit().then(function(){T(LL.length+(LL.length===1?' registro eliminado':' registros eliminados'))}).catch(function(){T('No se pudieron eliminar.')})});return}
 if(d.qbent!=null){var pq=d.qbent.split('|'),nv=pq[1]||'';db().collection('pagos').doc(pq[0]).update({ent:nv,ents:Date.now()}).then(function(){T(nv==='ent'?'Marcado como entregado':nv==='env'?'Marcado como enviado':'Marca quitada')}).catch(function(e){T(e&&e.code==='permission-denied'?'No se pudo guardar. Actualiza la página e inténtalo de nuevo.':'No se pudo guardar. Revisa tu conexión.')});return}
 if(d.qrf||d.qsf){if(d.qrf)RF=d.qrf;else SF=d.qsf;paintList(true);return}
 if(d.qpf){PF=d.qpf;var qb=document.getElementById('qp-body');if(qb)qb._h='';paintPag();return}
 if(d.qbwac){var pc=RECV.find(function(y){return y.id===d.qbwac});if(pc)sendCodeWa(pc);return}
 if(d.qbadmwa){var pw=SENT.find(function(y){return y.id===d.qbadmwa}),w=site_().wa;if(!w)return T('El administrador aún no configuró su WhatsApp.');if(pw)waOpen(w,'Hola, soy '+(S.user&&S.user.name||'')+'. '+(pw.via==='gratis'?'Solicité el código gratis de «'+pw.what+'» el '+D(pw.ts):'Pagué '+M(pw.amt)+' por '+VN(pw.via)+' ('+pw.what+') el '+D(pw.ts)+(pw.ref?'. Número de transacción: '+pw.ref:''))+'. En Mi Pradera aparece como no aprobado, ¿me ayudas a revisarlo?');return}
 if(d.qbimg){var pi=SENT.concat(RECV).find(function(y){return y.id===d.qbimg});if(pi&&pi.img)imgView(pi.img);return}
 if(b.id==='qb-free')return freeSave(b);
 if(b.id==='qb-go')return paySave(b);
 if(d.qbwa){if(LAST)waOpen(LAST.wa,LAST.t);closeModal(1);return}
 if(d.qbtab){tab=d.qbtab;var tb=document.getElementById('qb-tabs');if(tb){tb._h='';tb.innerHTML=tabsH()}paintList(true);return}
 if(d.qbok){var x=RECV.find(function(y){return y.id===d.qbok});askC('¿Ya revisaste en la app de tu banco o de Nequi que te llegaron '+(x?M(x.amt):'')+'? El comprobante solo es una ayuda: lo que vale es que el dinero esté en tu cuenta.','Sí, ya llegó').then(function(ok){if(ok)setSt(d.qbok,'ok','Pago confirmado')});return}
 if(d.qbno)return setSt(d.qbno,'no','Marcado como no recibido');
 if(d.qbund)return setSt(d.qbund,'pend','El pago vuelve a quedar por confirmar');
 if(d.qbdel){askC('¿Borrar este registro de pago? El dinero no se devuelve: solo se borra el registro.','Borrar').then(function(ok){if(ok)db().collection('pagos').doc(d.qbdel).delete().then(function(){T('Registro borrado')}).catch(function(){T('No se pudo borrar.')})});return}
 if(d.qbact)return admAct(d.qbact);
 if(d.qbadm){if(d.qbadm==='key'){KM='adm';tab='key';modal('<h2>Datos de pago de Mi Pradera</h2><div id="qb-list"></div><div class="row" style="margin-top:12px"><button type="button" class="btn ghost" data-act="close">Cerrar</button></div>')}
  else{KM='';tab='adm';modal('<h2>Pagos de roles (Bre-B y Nequi)</h2><div id="qb-list"></div><div class="row" style="margin-top:12px"><button type="button" class="btn ghost" data-act="close">Cerrar</button></div>')}paintList(true);return}
 if(b.id==='qb-ksave')return keySave(b);
 if(b.id==='qb-kdel')return keyDel()},true);
var pq=false;new MutationObserver(function(){if(!pq){pq=true;(window.requestAnimationFrame||setTimeout)(function(){pq=false;try{inject()}catch(e){}try{paintNews()}catch(e){}})}}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
