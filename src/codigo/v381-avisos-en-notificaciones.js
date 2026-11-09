
/* v381: los avisos de Mi Pradera (registra tu negocio, publica tu anuncio gratis, tu plan vence…) ya no van arriba en
   Mi cuenta: salen dentro de «Notificaciones», encima de las notificaciones de la persona. Un aviso que la persona no ha
   visto cuenta como «sin leer» (campana y número rojo en la pestaña «Mi cuenta» de abajo); al abrir Notificaciones queda
   visto. Si el aviso cambia (por ejemplo «Tu plan vence pronto»), vuelve a contar. Si algo falla, borra este bloque. */
(function(){
var K='qh_promo_seen';
function cards(){if(!S.user||(typeof MODE!=='undefined'&&MODE==='admin'))return [];var L=[];
 try{var a=typeof bizCta==='function'?bizCta():'';if(a)L.push(a)}catch(e){}
 try{var b=typeof pubCta==='function'?pubCta():'';if(b)L.push(b)}catch(e){}
 try{L=expCards().concat(L)}catch(e){}/* v383 */return L}
/* v383: ANUNCIO VENCIDO. Si un anuncio de la persona (clasificado, vehículo o inmueble) venció hace menos de 3 días, sale un
   aviso «Tu anuncio … venció» con «Renovar ahora». Cuenta en rojo hasta que lo renueve o pasen los 3 días. */
var EXPW=3*864e5,WARN='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
function Es(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fd(t){try{return typeof fdl==='function'?fdl(t):new Date(t).toLocaleDateString('es-CO',{day:'numeric',month:'long'})}catch(e){return ''}}
function expCards(){var now=Date.now(),L=[],k='';try{k=QH.key()}catch(e){}if(!k)return L;
 try{if(QH.comListen)QH.comListen()}catch(e){}
 try{var mine=(QH.COM||[]).filter(function(a){return a.ownerKey===k});var act=mine.some(function(a){return (a.exp||0)>now});
  var ex=mine.filter(function(a){var e=a.exp||0;return e&&e<=now&&now-e<EXPW}).sort(function(x,y){return (y.exp||0)-(x.exp||0)})[0];
  if(ex&&!act)L.push(card(ex.title,ex.exp,'cmxRenew',ex.id,'<button type="button" class="btn ghost bzb2" data-act="cmxMine">Ver mis anuncios</button>'))}catch(e){}
 try{var MS=typeof AD_MS==='number'?AD_MS:(typeof AD_DAYS==='number'?AD_DAYS:60)*864e5;(S.ads||[]).filter(function(a){return (S.myAds||[]).indexOf(a.id)>=0&&!a.closed}).forEach(function(a){var e=(a.renewed||a.ts||0)+MS;if(a.ts&&e<=now&&now-e<EXPW)L.push(card(a.title,e,'renewAd',a.id,''))})}catch(e){}
 return L}
function card(t,e,act,id,extra){return '<section class="bzc bzw" aria-label="Tu anuncio venció"><div class="bzi" aria-hidden="true">'+WARN+'</div><div class="bzt"><em>VENCIÓ</em><h3>Tu anuncio «'+Es(String(t||'').slice(0,50))+'» venció</h3><p>Dejó de verse el '+Es(fd(e))+'. Renuévalo para que tus vecinos lo vuelvan a ver.</p><button type="button" class="btn bzb" data-act="'+act+'" data-id="'+Es(id)+'">Renovar ahora</button>'+extra+'</div></section>'}
function keyOf(h){var m=/<h3>([\s\S]*?)<\/h3>/.exec(h);return (m?m[1]:h).replace(/<[^>]*>/g,'').trim().slice(0,80)}
function seen(){try{var o=JSON.parse(localStorage.getItem(K)||'[]');return Array.isArray(o)?o:[]}catch(e){return []}}
window.nfPromos=function(){var L=cards();if(!L.length)return '';return '<div class="nfpr">'+L.join('')+'</div><h3 class="nfh">Tus notificaciones</h3>'};
/* v382: el aviso «Publica tu anuncio gratis» no se apaga al abrir Notificaciones: sigue en rojo mientras la persona
   tenga su anuncio gratis sin usar; al publicarlo se apaga (y vuelve cuando tenga otro gratis disponible, a las 24 horas) */
function freeOn(){try{if(QH.comListen)QH.comListen()}catch(e){}try{return typeof comFreeWait==='function'&&!comFreeWait()}catch(e){return false}}
window.nfPromoNew=function(){var s=seen(),fr=null;var L=cards(),xp=L.some(function(h){return /^Tu anuncio «/.test(keyOf(h))});return L.filter(function(h){var k=keyOf(h);if(/^Tu anuncio «/.test(k))return true/* v383: vencido: cuenta hasta renovarlo */;if(k==='Publica tu anuncio gratis'){if(xp)return false;if(fr===null)fr=freeOn();return fr}return s.indexOf(k)<0}).length};
window.nfPromoSeen=function(){var s=seen();cards().forEach(function(h){var k=keyOf(h);if(s.indexOf(k)<0)s.push(k)});try{localStorage.setItem(K,JSON.stringify(s.slice(-30)))}catch(e){}};
/* número rojo en la pestaña «Mi cuenta» de la barra de abajo */
function tab(){var n=0;try{n=typeof nfUnread==='function'?nfUnread():0}catch(e){}var b=[].find.call(document.querySelectorAll('#bnav button'),function(x){return /Mi cuenta/.test(x.textContent)});if(!b)return;
 var em=b.querySelector('.bnb');if(!em){em=document.createElement('em');em.className='bnb';b.appendChild(em)}em.hidden=!n;em.textContent=n>9?'9+':String(n);
 b.setAttribute('aria-label',n?'Mi cuenta, '+n+(n===1?' notificación sin leer':' notificaciones sin leer'):'Mi cuenta')}
setInterval(tab,1500);setTimeout(tab,800);
document.head.insertAdjacentHTML('beforeend','<style id="v381-css">#bnav button{position:relative}.bnb{position:absolute;top:2px;left:calc(50% + 6px);min-width:18px;height:18px;padding:0 4px;background:#d70015;color:#fff;font-style:normal;font-size:11px;font-weight:800;line-height:18px;text-align:center;border-radius:0;box-shadow:0 0 0 2px #fff}.bnb[hidden]{display:none}html.dark .bnb{box-shadow:0 0 0 2px #1c1c1e}.nfpr .bzc{margin:0 0 12px}.bzc .bzb2{margin:8px 0 0;background:transparent!important;color:#fff!important;border:2px solid #fff!important;box-shadow:none!important}.nfh{margin:18px 0 8px;font-size:17px}</style>');
})();
