
/* v314: correcciones de lógica de los planes «Uno» (v313) y de la pausa (v310):
   1) Si a alguien con plan «Uno» ya le llegó al límite, al tocar Publicar se le explica el límite (antes se abría la ventana de roles sin decir por qué).
   2) «Publicar de nuevo» un anuncio vendido o «Renovar» uno vencido también respetan el límite (antes servían para tener 2 activos).
   3) El número de «Mi cuenta» ya no dice «sin límite» con un plan «Uno».
   Si algo falla, borra este bloque. */
(function(){
var now=function(){return Date.now()};
function bigEnd(u){try{var p=S.plan;if(!p)return 0;var a=Object.assign({},p.acc||{});a.merc1=0;a.home1=0;a.car1=0;return pEnd(Object.assign({},p,{acc:a}),u)}catch(e){return 0}}
function smallOnly(u){try{return accOn(u)&&!(bigEnd(u)>now())}catch(e){return false}}
function live(a){return !a.closed&&!a.hidden&&!(typeof expired==='function'&&expired(a))}
function adsOf(u){return S.ads.filter(function(a){return S.myAds.includes(a.id)&&live(a)&&(u==='car'?a.type==='veh':(a.type==='arr'||a.type==='casa'))})}
function limAd(kind){var u=kind==='veh'?'car':'home';return smallOnly(u)&&adsOf(u).length>=1?u:''}
function limModal(u){var veh=u==='car',serv=u==='serv';
 modal('<h2>Ya tienes tu publicación</h2><p>'+(serv?'Tu plan <b>Comerciante · Un negocio</b> incluye <b>1 servicio</b> y ya lo tienes publicado.':'Tu plan incluye <b>'+(veh?'1 vehículo':'1 inmueble')+' a la vez</b> y ya tienes uno a la vista.')+'</p><p>'+(serv?'Para ofrecer más servicios, pásate a <b>Comerciante · Varios negocios</b>.':'Para publicar otro, marca el que tienes como '+(veh?'vendido':'vendido o arrendado')+', o pásate al plan de <b>'+(veh?'varios vehículos':'varios inmuebles')+'</b>.')+'</p><div class="row" style="margin-top:10px">'+(serv?'':'<button type="button" class="btn" data-act="pnl" data-v="'+(veh?'vehiculos':'inmuebles')+'">'+(veh?'Ver mis vehículos':'Ver mis inmuebles')+'</button>')+'<button type="button" class="btn pink" data-limv="'+(serv?'merc':u)+'">'+(serv?'Ver Comerciante':'Pasarme a «Varios»')+'</button><button type="button" class="btn ghost" data-act="close">Cerrar</button></div>')}
function init(){if(window.__v314||typeof codesModal!=='function'||typeof roleAsk!=='function'||typeof pnQuota!=='function')return;window.__v314=1;
 window.codesModalExt=function(u,pv,np){if(pv&&(u==='home'||u==='car')&&S.user&&S.plan&&limAd(pv)===u)return limModal(u);return codesModal0(u,pv,np)};
 window.roleAskExt=function(){try{if(S.user&&smallOnly('serv')&&S.services.some(function(x){return S.myServ.includes(x.id)}))return limModal('serv')}catch(e){}return roleAsk0()};
 window.pnQuotaExt=function(k){var r=pnQuota0(k);try{if(r&&k==='ad'&&(smallOnly('home')||smallOnly('car')))r={n:r.n,z:r.z,t:'tu plan permite 1 a la vez; le quedan '+String(r.n).replace('d','')+' días'}}catch(e){}return r}}
document.addEventListener('DOMContentLoaded',init);setTimeout(init,0);
addEventListener('click',function(e){var t=e.target;if(!t.closest)return;
 var lv=t.closest('[data-limv]');if(lv){e.preventDefault();e.stopImmediatePropagation();var b=lv.dataset.limv;try{window.__cdSz=window.__cdSz||{};__cdSz[b]=''}catch(_){}closeModal(1);codesModal(b);return}
 /* volver a mostrar o renovar un anuncio que no está a la vista */
 var x=t.closest('[data-act="closeAd"],[data-act="renewAd"],[data-adt="close"],[data-adt="renew"]');if(!x||!S.user)return;
 var a=S.ads.find(function(y){return y.id===x.dataset.id});if(!a||live(a))return;
 var k=x.dataset.act||x.dataset.adt,wake=(k==='closeAd'||k==='close')?a.closed:(!a.closed);if(!wake)return;
 var u=limAd(a.type);if(!u)return;e.preventDefault();e.stopImmediatePropagation();limModal(u)},true);
})();
