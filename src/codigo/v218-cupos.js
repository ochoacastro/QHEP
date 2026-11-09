
/* v218: cuantas publicaciones te quedan, para el numero en la esquina de "Mi cuenta".
   com  = clasificados que puedes publicar ahora: 1 gratis cada 24 h + lo que te queda de cada plan activo; rol Comunidad = sin limite (∞).
   store/ad/serv = no tienen limite de cantidad: con el rol activo se muestran los dias que quedan (p. ej. 28d). Sin rol, no se muestra nada.
   Si algo falla, borra este <script id="v218-cupos"> y el <style id="v218-cupos-css"> y quita el ultimo parametro de it() en pnlMenu. */
function pnQuota(k){return typeof window.pnQuotaExt==='function'?window.pnQuotaExt.apply(this,arguments):pnQuota0.apply(this,arguments)}/* v389: pnQuota tiene una ampliación (pnQuotaExt) en v314-limites */
function pnQuota0(k){try{
 if(typeof S!=='object'||!S||!S.user)return null;
 var DAYMS=864e5,left=function(us){var e=0;us.forEach(function(u){e=Math.max(e,accEnd(u)||0)});return e>Date.now()?Math.ceil((e-Date.now())/DAYMS):0};
 if(k==='com'){
  if(accOn('comu'))return {n:'∞',t:'puedes publicar clasificados sin límite con el rol Comunidad'};
  var w=comFreeWait(),n=w?0:1;comTiers().forEach(function(u){var q=COM_DAYS[u]-comUsed(u);if(q>0)n+=q});
  return {n:String(n),z:!n,t:n?(n===1?'puedes publicar 1 clasificado ahora':'puedes publicar '+n+' clasificados ahora'):'ya usaste tu anuncio gratis; se renueva en unas '+w+' h'}}
 var us=k==='store'?['store','food','pelu','merc']:k==='ad'?['car','home','merc']:k==='serv'?['serv','merc']:[];
 var d=left(us);if(!d)return null;
 return {n:d+'d',t:'puedes publicar sin límite '+d+(d===1?' día más':' días más')};
}catch(e){return null}}
