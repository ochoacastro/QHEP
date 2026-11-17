
/* v437: TÉRMINOS CON GOOGLE A QUIEN NO LOS HAYA ACEPTADO (no solo a la cuenta «nueva»). La v436 preguntaba solo cuando Firebase
   decía que la cuenta de Google era nueva (isNewUser). Una cuenta de Google que ya había entrado antes (por ejemplo, en una prueba,
   o antes de la v436) no es nueva y entraba directo sin haber aceptado nunca. Ahora la aceptación queda guardada en la propia cuenta
   de Firebase (en su perfil, el mismo lugar donde la v261 guarda nombre, correo y teléfono: campo «t» = fecha en que aceptó), así
   que se pregunta a toda cuenta de Google que no la tenga, en cualquier teléfono, una sola vez.
   No pregunta a quien se registró con correo y clave (ya marcó la casilla del registro). No necesita reglas nuevas de Firestore.
   Para quitarlo: borra este archivo de src/orden.json; vuelve a preguntar solo a las cuentas nuevas (v436). */
(function(){
if(typeof qhTyC!=='object')return;
var T=qhTyC,falta0=T.falta,pedir0=T.pedir;
function dn(u){try{return dnRead(u)||{}}catch(e){return {}}}
function acepto(u){if(!u)return true;if(dn(u).t)return true;
 return (u.providerData||[]).some(function(p){return p&&p.providerId==='password'})}
/* guarda la fecha en el perfil de la cuenta que acaba de entrar (la conexión principal termina de entrar unos instantes después) */
function guardar(em,n){var cu=null;try{cu=firebase.auth().currentUser}catch(e){}
 if(!cu||cu.isAnonymous||String(cu.email||'').toLowerCase()!==em){if(n<10)setTimeout(function(){guardar(em,n+1)},1000);return}
 var o=dn(cu);if(o.t)return;o.t=Date.now();try{cu.updateProfile({displayName:JSON.stringify(o)}).catch(function(){})}catch(e){}}
T.falta=function(r,em){return falta0(r,em)||!acepto(r&&r.user)};
T.pedir=function(em,fin){pedir0(em,function(){guardar(em,0);if(typeof fin==='function')fin()})};
})();
