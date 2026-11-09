
/* v321: lista de notificaciones. Los avisos importantes (pedidos, pagos, roles, códigos, publicaciones, sesión) se guardan
   en este dispositivo (qh_notif, máximo 60, 60 días). La campana del encabezado muestra cuántos no se han leído;
   cada aviso se cierra con su X y hay un botón para borrarlos todos. Si algo falla, borra este bloque. */
(function(){
var K='qh_notif',MAX=60,KEEP=60*864e5;
var IMP=/pedido|pago|rol |rol:|roles|código|aprob|confirm|venc|sesi[oó]n|publicad|entregad|enviad|acept|cancel|renovad|tienda en pausa|abierta otra vez|anuncio/i;
var BAD=/no se pudo|no pudimos|error|falt|revisa|int[eé]nta|necesitas|no tienes|no puedes|venci|expir|se cerr|cancel|no le lleg|no pag/i;
var BELL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';
var OK='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';
var WARN='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function ld(){try{var l=JSON.parse(localStorage.getItem(K)||'[]');return Array.isArray(l)?l.filter(function(n){return n&&n.m&&Date.now()-(n.t||0)<KEEP}):[]}catch(e){return []}}
function sv(l){try{localStorage.setItem(K,JSON.stringify(l.slice(0,MAX)))}catch(e){}}
function unread(){return ld().filter(function(n){return !n.r}).length+(typeof window.nfPromoNew==='function'?nfPromoNew():0)/* v381: avisos nuevos */}
window.nfUnread=function(){return unread()}/* v381 */;
window.nfAdd=function(m,bad){m=String(m||'').trim();if(!m)return;var l=ld();if(l[0]&&l[0].m===m&&Date.now()-l[0].t<8000)return;
 l.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),m:m.slice(0,300),t:Date.now(),b:bad==null?BAD.test(m):!!bad,r:false});sv(l);badge();box()};
function D(t){try{return new Date(t).toLocaleString('es-CO',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})}catch(e){return ''}}
function listH(){var l=ld();if(!l.length)return '<p class="muted">No tienes notificaciones. Aquí aparecen los avisos de pedidos, pagos, roles y publicaciones.</p>';
 return '<div class="nfl">'+l.map(function(n){return '<div class="nfi'+(n.b?' bad':'')+(n.r?'':' new')+'">'+(n.b?WARN:OK)+'<div><p>'+E(n.m)+'</p><small>'+E(D(n.t))+(n.r?'':' · nueva')+'</small></div><button type="button" data-nfdel="'+E(n.id)+'" aria-label="Cerrar esta notificación">✕</button></div>'}).join('')+'</div>'}
function box(){var b=document.getElementById('nfbox');if(b)b.innerHTML=listH();var c=document.getElementById('nfall');if(c)c.hidden=!ld().length}
window.nfOpen=function(){var l=ld(),had=l.some(function(n){return !n.r});
 modal('<h2>Notificaciones</h2>'+(typeof window.nfPromos==='function'?nfPromos():'')/* v381 */+'<div id="nfbox">'+listH()+'</div><div class="row" style="margin-top:10px"><button type="button" class="btn ghost" id="nfall" data-nfall="1"'+(l.length?'':' hidden')+'>Borrar todas</button><button type="button" class="btn ghost" data-act="close">Cerrar</button></div>');
 try{if(typeof window.nfPromoSeen==='function')nfPromoSeen()}catch(e){}/* v381 */
 if(had){sv(l.map(function(n){n.r=true;return n}))}badge()};
window.nfMenu=function(it){var n=unread(),c=ld().length;return it(BELL.replace('<svg','<svg class="qi"'),'Notificaciones',c?(n?n+(n===1?' sin leer':' sin leer')+' · ':'')+c+(c===1?' guardada':' guardadas'):(n?n+(n===1?' aviso nuevo':' avisos nuevos')/* v381 */:'Aún no tienes notificaciones'),'nfOpen','',n?{n:n,t:n+' sin leer'}:null)};
document.addEventListener('click',async function(e){var t=e.target;if(!t.closest)return;var b;
 if((b=t.closest('#nfBtn,[data-act="nfOpen"]'))){e.preventDefault();e.stopImmediatePropagation();closeModal(1);nfOpen();return}
 if((b=t.closest('[data-nfdel]'))){e.preventDefault();var id=b.dataset.nfdel;sv(ld().filter(function(n){return n.id!==id}));box();badge();return}
 if((b=t.closest('[data-nfall]'))){e.preventDefault();if(!(await askC('¿Borrar todas las notificaciones?','Borrar todas')))return;sv([]);box();badge()}},true);
/* campana en el encabezado, al lado del botón de modo oscuro */
function btn(){var b=document.getElementById('nfBtn');if(b)return b;var h=document.querySelector('header');if(!h)return null;b=document.createElement('button');b.type='button';b.id='nfBtn';b.setAttribute('aria-label','Notificaciones');b.innerHTML=BELL+'<em hidden></em>';h.appendChild(b);return b}
function place(){try{if(MODE==='admin')return;var b=btn(),h=document.querySelector('header'),r=document.getElementById('themeBtn');if(!b||!h)return;
 if(getComputedStyle(h).position==='static')h.style.position='relative';
 var hr=h.getBoundingClientRect(),tr=r&&r.offsetParent?r.getBoundingClientRect():null;
 if(tr&&tr.width){b.style.top=(tr.top-hr.top+(tr.height-44)/2)+'px';b.style.left=(tr.left-hr.left-52)+'px';b.style.right='auto'}else{b.style.top='12px';b.style.right='12px';b.style.left='auto'}}catch(e){}}
function badge(){var b=document.getElementById('nfBtn');if(!b)return;var n=unread(),em=b.querySelector('em');em.hidden=!n;em.textContent=n>99?'99+':String(n);b.setAttribute('aria-label',n?'Notificaciones, '+n+' sin leer':'Notificaciones')}
function onToast(m){var s=String(m==null?'':m);if(s&&IMP.test(s))nfAdd(s)}
function wrap(){var H=window.toastHooks=window.toastHooks||[];if(H.indexOf(onToast)<0)H.push(onToast)}/* v389: gancho de toast (antes envolvía la función) */
window.addEventListener('load',function(){setTimeout(function(){wrap();place();badge()},200)});setTimeout(function(){wrap();place();badge()},3500);
window.addEventListener('resize',place);setInterval(function(){place();badge()},2000);
})();
