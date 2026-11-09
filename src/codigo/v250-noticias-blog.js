
/* v250: reacciones y comentarios de noticias (colección "nwFb", reglas de Firestore v31), cuántas noticias nuevas hay
   (globito rojo en «Noticias»), «Seguir noticias» (aviso en la esquina y notificación del celular mientras la página o la app
   está abierta) y los botones de formato del texto. Si algo falla, borra este <script id="v250-noticias-blog"> y su <style>:
   las noticias se siguen viendo y publicando. */
(function(){
var FB=null,busy=false,LAST=[],KNOWN=null,T0=Date.now();
var RE=[['like','<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>','Me gusta'],['love','<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>','Me encanta'],['wow','<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="15.5" r="2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>','Me sorprende'],['sad','<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>','Me entristece'],['clap','<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>','Aplausos']]/* v254: iconos de línea en vez de emojis */;
var BELL='<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',NEWS='<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>';
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function me(){try{var u=QH.authCur&&QH.authCur();return u&&!u.isAnonymous?u:null}catch(e){return null}}
function isAdm(){var u=me();try{return (typeof MODE!=='undefined'&&MODE==='admin')||(u&&typeof ADMIN_UID!=='undefined'&&u.uid===ADMIN_UID)}catch(e){return false}}
function nwOf(id){try{return (QH.NEWS||[]).find(function(x){return x.id===id})||null}catch(e){return null}}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,String(v))}catch(e){return null}}
function when(t){try{return new Date(t).toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'})}catch(e){return ''}}
function db(){return firebase.firestore().collection('nwFb')}
/* ---- reacciones y comentarios ---- */
function box(id){var d=FB&&FB[id]||{re:{},cm:[]},u=me(),n=nwOf(id),mine=u&&d.re[u.uid],h='<div class="nwre" role="group" aria-label="¿Qué te pareció esta noticia?">';
 RE.forEach(function(r){var c=0;for(var k in d.re)if(d.re[k]===r[0])c++;h+='<button type="button" data-nwre="'+r[0]+'" aria-pressed="'+(mine===r[0])+'" aria-label="'+r[2]+' ('+c+')" title="'+r[2]+'"><span aria-hidden="true">'+r[1]+'</span><b>'+(c||'')+'</b></button>'});
 h+='</div>';var L=d.cm.slice().sort(function(a,b){return (a.ts||0)-(b.ts||0)});
 h+='<h4>Comentarios ('+L.length+')</h4>';
 h+=L.length?L.map(function(c){var del=(u&&(c.uid===u.uid||(n&&n.ownerUid===u.uid)))||isAdm();
   return '<div class="nwcm"><b>'+E(c.name||'Vecino')+'</b>'+(n&&c.uid===n.ownerUid?'<span class="tg">Autor</span>':'')+'<small>'+E(when(c.ts))+'</small><p>'+E(c.txt)+'</p>'+(del?'<button type="button" class="del" data-nwcd="'+E(c.cid)+'" data-u="'+E(c.uid)+'">Borrar comentario</button>':'')+'</div>'}).join(''):'<p class="nwnote">Aún no hay comentarios. ¡Sé el primero!</p>';
 h+=u?'<div class="nwcf"><label class="qh-sr" for="nwc-'+E(id)+'">Tu comentario</label><textarea id="nwc-'+E(id)+'" maxlength="500" placeholder="Escribe tu comentario (máximo 500 letras). Sé respetuoso."></textarea><button type="button" class="btn" data-nwcs="1">Publicar comentario</button></div>'
   :'<p class="nwnote">Para reaccionar o comentar <button type="button" class="del" data-nwin="1" style="padding:0">entra a tu cuenta</button>.</p>';
 return h}
function cnt(id){var d=FB&&FB[id];if(!d)return '';var r=Object.keys(d.re).length,c=d.cm.length;if(!r&&!c)return '';
 return (r?r+(r===1?' reacción':' reacciones'):'')+(r&&c?' · ':'')+(c?c+(c===1?' comentario':' comentarios'):'')}
function paint(){if(!FB)return;var l=document.querySelectorAll('.nwfb[data-nw]');for(var i=0;i<l.length;i++){var b=l[i];if(document.activeElement&&b.contains(document.activeElement)&&document.activeElement.tagName==='TEXTAREA')continue;var h=box(b.dataset.nw);if(b._h!==h){b._h=h;b.innerHTML=h}}
 l=document.querySelectorAll('.nwcnt[data-nwc]');for(i=0;i<l.length;i++){h=cnt(l[i].dataset.nwc);if(l[i]._h!==h){l[i]._h=h;l[i].textContent=h}}}
function fail(e){busy=false;toast(e&&e.code==='permission-denied'?'No se pudo guardar. Entra con tu correo verificado para participar.':'No se pudo guardar. Revisa tu conexión.')}
/* ---- noticias nuevas, globito y «Seguir noticias» ---- */
function seen(){return Number(ls('qh_nw_seen'))||0}
function fol(){return ls('qh_nw_fol')==='1'}
function unread(){var s=seen();return LAST.filter(function(x){return (x.ts||0)>s}).length}
function badges(){var n=unread(),onList=typeof view!=='undefined'&&view==='news'&&!curN;if(onList&&LAST.length){var m=Math.max.apply(null,LAST.map(function(x){return x.ts||0}));if(m>seen())ls('qh_nw_seen',m);n=0}
 var l=document.querySelectorAll('[data-act][data-v="news"]');for(var i=0;i<l.length;i++){var b=l[i],g=b.querySelector(':scope>.nwbadge');if(n){if(!g){g=document.createElement('i');g.className='nwbadge';b.appendChild(g)}var t=n>9?'9+':String(n);if(g.textContent!==t)g.textContent=t;b.setAttribute('aria-description',n+(n===1?' noticia nueva':' noticias nuevas'))}else if(g){g.remove();b.removeAttribute('aria-description')}}
 l=document.querySelectorAll('.nwfol');for(i=0;i<l.length;i++){var on=fol(),tx=on?'Siguiendo':'Seguir noticias';if(l[i].dataset.st!==tx){l[i].dataset.st=tx;l[i].innerHTML=BELL+' '+tx}l[i].setAttribute('aria-pressed',on)}}
function openNw(id){try{var o=document.querySelector('.nwnot');if(o)o.remove();if(typeof closeModal==='function'&&document.querySelector('#ov'))closeModal(1);if(id){curN=id}else{curN=''}view='news';render();scrollTo(0,0)}catch(e){location.hash=id?'#/nw/'+id:'#/noticias'}}
function notice(t,s,id){var o=document.querySelector('.nwnot');if(o)o.remove();o=document.createElement('div');o.className='nwnot';o.setAttribute('role','status');
 o.innerHTML='<span class="nwnoti" aria-hidden="true">'+NEWS+'</span><div><b>'+E(t)+'</b>'+E(s)+'<br><button type="button" class="go" data-nwgo="'+E(id||'')+'">Leer</button></div><button type="button" class="x" data-nwx="1" aria-label="Cerrar aviso">✕</button>';document.body.appendChild(o);setTimeout(function(){if(o.isConnected)o.remove()},15000)}
function push(n){try{if(!fol()||!('Notification' in window)||Notification.permission!=='granted'||!document.hidden)return;var url=location.href.split('#')[0]+'#/nw/'+n.id,op={body:n.title,icon:'icon-192.png',tag:'nw-'+n.id,data:{url:url}};
 if(navigator.serviceWorker&&navigator.serviceWorker.controller)navigator.serviceWorker.ready.then(function(r){r.showNotification('Nueva noticia en Mi Pradera',op)});else{var x=new Notification('Nueva noticia en Mi Pradera',op);x.onclick=function(){window.focus();openNw(n.id)}}}catch(e){}}
function latest(sn){var L=[];sn.forEach(function(d){var x=d.data()||{};if((Number(x.pub)||0)>Date.now())return;/* v302: programada */L.push({id:d.id,title:x.title||'',ts:x.ts||0})});LAST=L;
 if(!ls('qh_nw_seen')&&L.length)ls('qh_nw_seen',Math.max.apply(null,L.map(function(x){return x.ts}))) /* primera visita: no hay nada "nuevo" */;
 if(KNOWN===null){KNOWN={};L.forEach(function(x){KNOWN[x.id]=1});var u=unread();if(fol()&&u&&!(view==='news'&&!curN))notice(u===1?'Hay 1 noticia nueva':'Hay '+u+' noticias nuevas','Desde tu última visita.',u===1?(L.find(function(x){return x.ts>seen()})||{}).id:'')}
 else{L.forEach(function(x){if(!KNOWN[x.id]){KNOWN[x.id]=1;if(fol()&&x.ts>T0){var k=QH.key&&QH.key(),n=nwOf(x.id);if(!(n&&k&&n.ownerKey===k)){notice('Nueva noticia',x.title,x.id);push(x)}}}})}
 badges()}
function folToggle(){if(fol()){ls('qh_nw_fol',null);badges();return toast('Ya no te avisaremos de noticias nuevas')}
 ls('qh_nw_fol','1');badges();var go=function(){var rss=(typeof nwBase==='function'?nwBase():'')+'noticias/feed.xml';
  modal('<h2>Sigues las noticias</h2><p>Cuando se publique una noticia nueva te avisamos en la esquina de la pantalla'+(('Notification' in window&&Notification.permission==='granted')?' y con una notificación del celular':'')+', mientras tengas Mi Pradera abierta o instalada como app. Además, el botón <b>Noticias</b> muestra un número rojo con las noticias que no has visto.</p><p class="muted">¿Usas un lector de noticias (RSS)? Copia esta dirección: <a href="'+E(rss)+'" target="_blank" rel="noopener">'+E(rss)+'</a></p><div class="row" style="margin-top:12px"><button type="button" class="btn" data-act="close">Entendido</button></div>')};
 try{if('Notification' in window&&Notification.permission==='default'){Notification.requestPermission().then(go,go);return}}catch(e){}go()}
/* ---- formato del texto (formulario de noticia) ---- */
function fx(k){var t=document.getElementById('nw-x');if(!t)return;var a=t.selectionStart||0,b=t.selectionEnd||0,v=t.value,sel=v.slice(a,b),ls0=v.lastIndexOf('\n',a-1)+1,ins,c0,c1;
 if(k==='b'){ins='**'+(sel||'texto en negrilla')+'**';t.value=v.slice(0,a)+ins+v.slice(b);c0=a+2;c1=a+ins.length-2}
 else if(k==='h'||k==='l'){var p=k==='h'?'## ':'• ',bl=v.slice(0,ls0),nl=(bl&&!/\n$/.test(bl))?'\n':'';var body=sel||(k==='h'?'Subtítulo':'Elemento de la lista');ins=(a===ls0?'':'\n')+p+body+'\n';t.value=v.slice(0,a)+ins+v.slice(b);c0=a+ins.indexOf(body);c1=c0+body.length}
 else{ins=(a&&!/\s$/.test(v.slice(0,a))?' ':'')+'https://';t.value=v.slice(0,a)+ins+v.slice(b);c0=c1=a+ins.length}
 t.focus();try{t.setSelectionRange(c0,c1)}catch(e){}t.dispatchEvent(new Event('input',{bubbles:true}))}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-nwre],[data-nwcs],[data-nwcd],[data-nwin],[data-nwfx],[data-qnwf],[data-nwgo],[data-nwx]');if(!b)return;e.preventDefault();e.stopPropagation();
 if(b.dataset.nwfx)return fx(b.dataset.nwfx);
 if(b.dataset.qnwf)return folToggle();
 if(b.dataset.nwx){var o=b.closest('.nwnot');if(o)o.remove();return}
 if(b.dataset.nwgo!=null)return openNw(b.dataset.nwgo);
 if(b.dataset.nwin){try{need(function(){paint()})}catch(x){}return}
 var bx=b.closest('.nwfb'),id=bx&&bx.dataset.nw,u=me();if(!id)return;
 if(!u){try{need(function(){paint()})}catch(x){toast('Entra a tu cuenta para participar.')}return}
 if(busy)return;
 if(b.dataset.nwre){var d=FB&&FB[id]||{re:{}},cur=d.re[u.uid],r=b.dataset.nwre,ref=db().doc(id+'_'+u.uid);busy=true;
  (cur===r?ref.delete():ref.set({nw:id,uid:u.uid,re:r,ts:Date.now()})).then(function(){busy=false},fail);return}
 if(b.dataset.nwcs){var ta=bx.querySelector('textarea'),t=(ta&&ta.value||'').trim().slice(0,500);if(t.length<2)return toast('Escribe tu comentario.');
  /* v264: mínimo 30 s entre comentarios (reglas v35: el comentario va con la marca nwRate/<uid> en el mismo paso) */
  var wait=30000-(Date.now()-(window.__nwLast||0));if(wait>0)return toast('Espera '+Math.ceil(wait/1000)+' segundos para comentar otra vez.');
  var cid='c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),T0=Date.now(),cd={nw:id,uid:u.uid,cid:cid,name:String((S.user&&S.user.name)||'Vecino').slice(0,40),txt:t,ts:T0},F=firebase.firestore(),ok=function(){busy=false;window.__nwLast=T0;if(ta)ta.value='';ta&&ta.blur();toast('Comentario publicado');paint()};busy=true;
  var bt=F.batch();bt.set(db().doc(id+'_'+u.uid+'_'+cid),cd);bt.set(F.collection('nwRate').doc(u.uid),{ts:T0});
  bt.commit().then(ok,function(e){if(e&&e.code==='permission-denied'){/* reglas anteriores (sin nwRate) o comentó hace menos de 30 s */db().doc(id+'_'+u.uid+'_'+cid).set(cd).then(ok,function(){busy=false;toast('Espera unos segundos para comentar otra vez.')})}else fail(e)});return}
 if(b.dataset.nwcd){(async function(){if(typeof askC==='function'&&!await askC('¿Borrar este comentario?'))return;db().doc(id+'_'+b.dataset.u+'_'+b.dataset.nwcd).delete().then(function(){toast('Comentario borrado')},function(){toast('No se pudo borrar.')})})();return}
},true);
function start(){try{if(!window.firebase||!firebase.apps||!firebase.apps.length||typeof QH==='undefined')return setTimeout(start,500);
 db().onSnapshot(function(sn){var m={};sn.forEach(function(d){var x=d.data();if(!x||!x.nw)return;var o=m[x.nw]=m[x.nw]||{re:{},cm:[]};if(x.re)o.re[x.uid]=x.re;else if(x.txt)o.cm.push(x)});FB=m;paint()},function(){FB=null;var l=document.querySelectorAll('.nwfb,.nwcnt');for(var i=0;i<l.length;i++){l[i].innerHTML='';l[i]._h=''}});
 firebase.firestore().collection('news').orderBy('ts','desc').limit(10).onSnapshot(latest,function(){})}catch(e){setTimeout(start,1000)}}
var pend=false;new MutationObserver(function(){if(!pend){pend=true;(window.requestAnimationFrame||setTimeout)(function(){pend=false;paint();badges()})}}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
