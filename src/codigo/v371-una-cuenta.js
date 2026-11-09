
/* v371: UN CORREO Y UN CELULAR POR PERSONA.
   - La ficha (plans/{k}) de quien tiene correo siempre usa la llave del correo (ver key()). Antes, quien se registraba con
     correo y clave y luego entraba con Google quedaba con dos fichas: una por el correo y otra por el celular.
   - Registro de celulares: tels/{celular} = {uid, k}. Al registrarse, al cambiar el celular (planProf) y al entrar se reserva
     el número; si ya es de otra cuenta, no se deja usar. Al eliminar la cuenta se libera. Necesita las reglas v48.
   - Al eliminar a una persona desde el panel, su celular también queda libre. Si algo falla, borra este bloque. */
(function(){
function fs(){return firebase.firestore()}
function me(){try{var u=firebase.auth().currentUser;return u&&!u.isAnonymous?u:null}catch(e){return null}}
function T(n){return fs().collection('tels').doc(String(n))}
function ok10(n){return /^3[0-9]{9}$/.test(String(n||''))}
window.telFree=async function(n){n=telCO(n||'');if(!ok10(n))return true;try{var d=await T(n).get();if(!d.exists)return true;var u=me();return !!u&&d.data().uid===u.uid}catch(e){return true}};
window.telRelease=async function(n){n=telCO(n||'');var u=me();if(!ok10(n)||!u)return;try{var d=await T(n).get();if(d.exists&&d.data().uid===u.uid)await T(n).delete()}catch(e){}};
window.telClaim=async function(n,old){n=telCO(n||'');var u=me();if(!ok10(n)||!u)return true;
 try{var d=await T(n).get();if(d.exists&&d.data().uid!==u.uid)return false;
  if(!d.exists)await T(n).set({uid:u.uid,k:QH.key()||'',ts:firebase.firestore.FieldValue.serverTimestamp()});
  if(old){old=telCO(old);if(ok10(old)&&old!==n)telRelease(old)}return true}catch(e){return true}};
/* al entrar: reserva el celular de las cuentas que ya existían */
var done={};setInterval(function(){try{if(!S.user||MODE==='admin')return;var n=telCO(S.user.wa||''),u=me();if(!ok10(n)||!u||done[u.uid+n])return;done[u.uid+n]=1;
 telClaim(n).then(function(ok){if(!ok)S.user.telDup=1})}catch(e){}},4000);
/* al eliminar a una persona desde el panel, también se libera su celular */
window.planDelExt=function(k){/* v389: la llama QH.planDel antes de borrar la ficha (antes la envolvía) */try{var p=(QH.plans()||[]).find(function(x){return x.k===k}),n=p&&telCO(p.wa||'');if(p&&ok10(n))T(n).get().then(function(d){if(d.exists&&(!p.uid||d.data().uid===p.uid||d.data().k===k))T(n).delete()}).catch(function(){})}catch(e){}};
})();
