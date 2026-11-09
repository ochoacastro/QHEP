
/* v313: roles para un solo bien o negocio («Uno») y para empresas con varios («Varios»):
   Comerciante: merc = varios negocios (como antes) · merc1 = un negocio (1 tienda con productos, 1 servicio, 1 inmueble y 1 vehículo).
   Vendedor de inmuebles: home = varios (inmobiliarias) · home1 = un inmueble a la vez.
   Vendedor de vehículos: car = varios (concesionarios) · car1 = un vehículo a la vez.
   Comerciante sigue incluyendo inmuebles y vehículos. Los precios se cambian en el administrador (Códigos > Precios de los roles).
   Necesita las reglas v39 (aceptan merc1, home1 y car1). Si algo falla, borra este bloque. */
(function(){
var BASES=['merc','home','car'],now=function(){return Date.now()};
var TXT={merc:['Un negocio','1 tienda con productos, 1 servicio, 1 inmueble y 1 vehículo','Varios negocios','Tiendas, servicios, inmuebles y vehículos sin límite'],
 home:['Un inmueble','Para el dueño de una sola propiedad','Varios inmuebles','Inmobiliarias y dueños de varias propiedades'],
 car:['Un vehículo','Para quien vende su carro o su moto','Varios vehículos','Concesionarios y negocios de vehículos']};
function raw(u){try{return Number(S.plan&&S.plan.acc&&S.plan.acc[u])||0}catch(e){return 0}}
window.cdRawEnd=function(u){return BASES.concat(['merc1','home1','car1']).indexOf(u)>=0?raw(u):accEnd(u)};
window.__cdSz=window.__cdSz||{};
window.cdSzDef=function(u){if(BASES.indexOf(u)<0)return u;if(u in __cdSz)return u+__cdSz[u];if(raw(u+'1')>now())return u+'1';if(raw(u)>now())return u;var many=false;try{many=u==='merc'&&shopsMine().length>1}catch(e){}return many?u:u+'1'};
window.cdSizeHTML=function(k){var b=String(k).replace(/1$/,'');if(BASES.indexOf(b)<0)return '';var t=TXT[b],one=k!==b;
 return '<div class="cdsz" role="group" aria-label="Tamaño del plan"><button type="button" data-cdsz="1" data-b="'+b+'" aria-pressed="'+one+'"><b>'+t[0]+'</b><small>'+t[1]+'</small></button><button type="button" data-cdsz="" data-b="'+b+'" aria-pressed="'+!one+'"><b>'+t[2]+'</b><small>'+t[3]+'</small></button></div>'};
window.cdOptTxt=function(u,x){var d=' durante '+codeMn(x);
 return u==='merc1'?'1 negocio: tienda con productos, 1 servicio, 1 inmueble y 1 vehículo'+d
  :u==='home'?'Inmuebles en arriendo y venta sin límite'+d:u==='home1'?'1 inmueble en arriendo o venta a la vez'+d
  :u==='car'?'Vehículos sin límite'+d:u==='car1'?'1 vehículo a la vez'+d
  :'Tienda, comidas, peluquería, servicios, inmuebles y vehículos sin límite'+d+(x>=6?' · ★ incluye destacado':'')};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-cdsz]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 __cdSz[b.dataset.b]=b.dataset.cdsz;cdU=b.dataset.b+b.dataset.cdsz;var x=document.getElementById('cdbox');if(x){x.innerHTML=cdBox();var f=x.querySelector('[data-cdsz="'+b.dataset.cdsz+'"]');if(f)f.focus({preventScroll:true})}},true);
/* ¿tiene solo el plan de «uno» (sin el de «varios» ni Comerciante)? */
function bigEnd(u){try{var p=S.plan;if(!p)return 0;var a=Object.assign({},p.acc||{});a.merc1=0;a.home1=0;a.car1=0;return pEnd(Object.assign({},p,{acc:a}),u)}catch(e){return 0}}
function smallOnly(u){return accOn(u)&&!(bigEnd(u)>now())}
function liveAd(a){return !a.closed&&!a.hidden&&!(typeof expired==='function'&&expired(a))}
function lim(k,kind){
 if(k==='ad'){var u=kind==='veh'?'car':'home';if(!smallOnly(u))return '';var n=S.ads.filter(function(a){return S.myAds.includes(a.id)&&liveAd(a)&&(u==='car'?a.type==='veh':(a.type==='arr'||a.type==='casa'))}).length;
  if(n>=1)return 'Tu plan incluye '+(u==='car'?'1 vehículo':'1 inmueble')+' a la vez y ya tienes 1 publicado. Para publicar otro, márcalo como '+(u==='car'?'vendido':'vendido o arrendado')+' en «Mi cuenta», o pásate al plan de '+(u==='car'?'varios vehículos':'varios inmuebles')+'.';return ''}
 if(k==='serv'){if(!smallOnly('serv'))return '';var m=S.services.filter(function(x){return S.myServ.includes(x.id)}).length;return m>=1?'Tu plan Comerciante de un negocio incluye 1 servicio y ya lo tienes. Para más, pásate a Comerciante de varios negocios.':''}
 return ''}
function init(){if(window.__v313||typeof USES!=='object'||typeof planMsg!=='function')return;window.__v313=1;
 Object.assign(USES,{merc1:{ico:'🏪',n:'Comerciante · Un negocio',d:'Para quien tiene un solo negocio: 1 tienda con productos, 1 servicio, 1 inmueble y 1 vehículo.'}});
 USES.merc.n='Comerciante · Varios negocios';USES.merc.d='Para empresas con varios negocios: tiendas, comidas, peluquerías, servicios, inmuebles y vehículos sin límite. 6 meses o más incluyen destacado.';
 USES.home.n='Vendedor de inmuebles · Varios';USES.home.d='Inmobiliarias y dueños de varias propiedades: arriendos y ventas sin límite.';
 USES.home1={ico:'🏠',n:'Vendedor de inmuebles · Uno',d:'Para el dueño de una sola propiedad: 1 inmueble en arriendo o venta a la vez.'};
 USES.car.n='Vendedor de vehículos · Varios';USES.car.d='Concesionarios y negocios de vehículos: carros, motos y más sin límite.';
 USES.car1={ico:'🚗',n:'Vendedor de vehículos · Uno',d:'Para quien vende su carro o su moto: 1 vehículo a la vez.'};
 CD_SH.home='Inmuebles';CD_SH.car='Vehículos';CD_SH.merc1='Comerciante (un negocio)';CD_SH.home1='Inmuebles (uno)';CD_SH.car1='Vehículos (uno)';
 /* precios provisionales: el administrador los cambia en Códigos > Precios de los roles */
 /* precios iniciales por 1, 3, 6, 9 meses y 1 año (comparados con Metrocuadrado, Fincaraíz y Mercado Libre, más bajos por ser Pradera) */
 CODE_DEF.merc1=[25000,60000,110000,155000,200000];CODE_DEF.merc=[45000,110000,200000,280000,360000];
 CODE_DEF.home1=[15000,35000,65000,90000,120000];CODE_DEF.home=[45000,110000,200000,280000,360000];
 CODE_DEF.car1=[10000,25000,45000,60000,80000];CODE_DEF.car=[40000,95000,175000,250000,320000];
 ['merc1','home','home1','car','car1'].forEach(function(u,i){if(CODE_USES.indexOf(u)<0)CODE_USES.splice(1+i,0,u)});
 ['merc1','home1','car1'].forEach(function(u){if(ACC_ALL.indexOf(u)<0)ACC_ALL.push(u)});
 try{var i=CATPL.findIndex(function(x){return x[0]==='merc'});if(i>=0){CATPL[i][3]='Para uno o varios negocios: tienda, comidas, peluquería, servicios, inmuebles y vehículos';CATPL.splice(i+1,0,['home','🏠','Vendedor de inmuebles','Para arrendar o vender: una propiedad o varias (inmobiliarias)'],['car','🚗','Vendedor de vehículos','Para vender: un vehículo o varios (concesionarios)'])}}catch(e){}
 var o=planMsg;planMsg=function(k,sid,kind){var m=o(k,sid,kind);
  if(m&&k==='ad'&&S.plan){var u=kind==='veh'?'car':'home',e=accEnd(u);return (e?'Tu rol para publicar en «'+CD_SH[u]+'» venció el '+new Date(e).toLocaleDateString('es-CO')+'.':'Para publicar en «'+CD_SH[u]+'» necesitas el rol '+(u==='car'?'Vendedor de vehículos':'Vendedor de inmuebles')+' (para uno o para varios) o Comerciante.')+' Actívalo con un código de 1, 3, 6, 9 meses o 1 año.'}
  return m||lim(k,kind)};
 var sf=shopForm;shopForm=function(only){try{if(S.user&&MODE!=='admin'&&smallOnly('store')&&shopsMine().length>=1)return modal('<h2>Tu plan es para un negocio</h2><p>Tu rol <b>Comerciante · Un negocio</b> incluye <b>1 tienda</b> y ya la tienes: <b>'+esc(shopsMine()[0].name)+'</b>.</p><p>Para tener más tiendas, pásate a <b>Comerciante · Varios negocios</b>.</p><div class="row" style="margin-top:10px"><button type="button" class="btn pink" data-act="cdOpen" data-v="merc">Ver Comerciante</button><button type="button" class="btn ghost" data-act="close">Cerrar</button></div>')}catch(e){}return sf(only)}}
document.addEventListener('DOMContentLoaded',init);setTimeout(init,0);
})();
