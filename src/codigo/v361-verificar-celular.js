
/* v361: «Verificar mi celular» en Mis datos. Firebase envía un SMS con un código de 6 números al celular de la cuenta;
   al escribirlo, el número queda unido a la cuenta (Firebase Authentication: currentUser.phoneNumber) y se muestra «Verificado».
   Necesita en la consola de Firebase: Authentication → Método de acceso → «Teléfono» activado, y mipradera.com.co en
   «Dominios autorizados». Para probar sin SMS reales, se pueden agregar «números de teléfono para pruebas» con su código fijo.
   Si algo falla, borra este bloque. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var CK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
var V={id:null,rc:null,num:'',t:0};
function au(){try{return firebase.auth()}catch(e){return null}}
function cu(){var a=au();return a&&a.currentUser&&!a.currentUser.isAnonymous?a.currentUser:null}
function num(){var w='';try{w=telCO((document.getElementById('pf-w')||{}).value||(S.user&&S.user.wa)||'')}catch(e){}return w}
window.celVerif=function(w){try{if(w&&S.plan&&S.plan.waV&&String(S.plan.waV).replace(/\D/g,'').slice(-10)===String(w).replace(/\D/g,'').slice(-10))return true}catch(e){}/* v365: verificado por WhatsApp */var u=cu();if(!u||!u.phoneNumber)return false;var d=String(u.phoneNumber).replace(/\D/g,'');return !!w&&d.slice(-10)===String(w).replace(/\D/g,'').slice(-10)};
function row(){var w=num(),ok=celVerif(w);return '<div class="cvr" id="cvr">'+(ok?'<span class="cvok">'+CK+'Celular verificado</span>':(w.length===10?'<button type="button" class="btn ghost" data-celv="1">Verificar mi celular</button><small>'+(window.celWaOn&&celWaOn()?'Envías un WhatsApp con un código, gratis.':'Te enviamos un SMS con un código de 6 números.')+'</small>':'<small>Escribe tu celular de 10 dígitos para poder verificarlo.</small>'))+'</div>'}
function paint(){var i=document.getElementById('pf-w');if(!i||i.readOnly&&!i.value)return;var r=document.getElementById('cvr'),h=row();if(!r){var anchor=i.nextElementSibling&&i.nextElementSibling.classList&&i.nextElementSibling.classList.contains('muted')?i.nextElementSibling:i;anchor.insertAdjacentHTML('afterend',h)}else if(r.outerHTML!==h)r.outerHTML=h}
document.addEventListener('input',function(e){if(e.target&&e.target.id==='pf-w')paint()});
var t=0;new MutationObserver(function(){if(t)return;t=1;requestAnimationFrame(function(){t=0;if(document.getElementById('pf-w')&&!document.getElementById('cvr'))paint()})}).observe(document.documentElement,{childList:true,subtree:true});
var MSG={'auth/invalid-phone-number':'El número de celular no es válido.','auth/too-many-requests':'Demasiados intentos. Espera unos minutos e intenta de nuevo.','auth/quota-exceeded':'Se agotó el cupo de SMS por hoy. Intenta mañana.',
 'auth/operation-not-allowed':'La verificación por SMS aún no está activada en Mi Pradera. Avisa al administrador.','auth/billing-not-enabled':'La verificación por SMS aún no está activada en Mi Pradera. Avisa al administrador.',
 'auth/unauthorized-domain':'Este dominio aún no está autorizado para enviar SMS. Avisa al administrador.','auth/captcha-check-failed':'No se pudo comprobar que no eres un robot. Recarga la página e intenta de nuevo.',
 'auth/invalid-verification-code':'El código no es correcto. Revísalo e intenta de nuevo.','auth/code-expired':'El código venció. Pide uno nuevo.','auth/credential-already-in-use':'Ese celular ya está verificado en otra cuenta de Mi Pradera.',
 'auth/account-exists-with-different-credential':'Ese celular ya está verificado en otra cuenta de Mi Pradera.','auth/requires-recent-login':'Por seguridad, cierra sesión y vuelve a entrar para verificar tu celular.','auth/network-request-failed':'Sin conexión. Revisa tu internet.'};
function em(e){var c=e&&e.code||'';return MSG[c]||'No se pudo verificar ('+(c||'error')+'). Intenta de nuevo.'}
function form(st,txt){modal('<h2>Verificar mi celular</h2>'+(st==='send'?'<p>Te enviaremos un SMS con un código de 6 números al <b>'+E(V.num)+'</b>.</p><p class="muted">El SMS es gratis para ti.</p><p class="err" id="err" role="alert">'+E(txt||'')+'</p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-celsend="1">Enviar código</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>':
 '<p>Escribe el código que llegó por SMS al <b>'+E(V.num)+'</b>.</p><label for="cv-code">Código de 6 números</label><input id="cv-code" type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><p class="err" id="err" role="alert">'+E(txt||'')+'</p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-celok="1">Verificar</button><button type="button" class="btn ghost" data-celsend="1">Enviar otro código</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>')+'<div id="cv-rc"></div>');
 var c=document.getElementById('cv-code');if(c)setTimeout(function(){c.focus()},60)}
addEventListener('click',async function(e){var b=e.target.closest&&e.target.closest('[data-celv],[data-celsend],[data-celok]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 var u=cu();if(!u){closeModal(1);return toast('Entra con tu cuenta para verificar tu celular.')}
 if(b.dataset.celv){V.num=num();if(V.num.length!==10)return toast('Escribe tu celular de 10 dígitos.');
  if(document.getElementById('pf-w')&&S.user&&telCO(S.user.wa||'')!==V.num){try{S.user.wa=V.num;save()}catch(x){}}
  if(window.celWaOn&&celWaOn())return celWa(V.num)/* v365: por WhatsApp, gratis */;
  return form('send')}
 var er=document.getElementById('err');
 if(b.dataset.celsend){if(Date.now()-V.t<30000){if(er)er.textContent='Espera unos segundos antes de pedir otro código.';return}b.disabled=true;if(er)er.textContent='Enviando SMS…';
  try{var a=au();a.languageCode='es';if(V.rc){try{V.rc.clear()}catch(x){}V.rc=null}var box=document.getElementById('cv-rc')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'cv-rc'}));
   V.rc=new firebase.auth.RecaptchaVerifier(box,{size:'invisible'});V.id=await new firebase.auth.PhoneAuthProvider(a).verifyPhoneNumber('+57'+V.num,V.rc);V.t=Date.now();form('code')}
  catch(x){b.disabled=false;try{V.rc&&V.rc.clear()}catch(y){}V.rc=null;if(er)er.textContent=em(x)}return}
 if(b.dataset.celok){var c=(document.getElementById('cv-code')||{value:''}).value.replace(/\D/g,'');if(c.length!==6){if(er)er.textContent='Escribe los 6 números del código.';return}b.disabled=true;if(er)er.textContent='Verificando…';
  try{var cr=firebase.auth.PhoneAuthProvider.credential(V.id,c);if(u.phoneNumber)await u.updatePhoneNumber(cr);else await u.linkWithCredential(cr);
   try{S.user.wa=V.num;S.user.waV=1;save();QH.planProf(S.user.name,V.num)}catch(x){}closeModal(1);toast('¡Listo! Tu celular '+V.num+' quedó verificado.');try{syncUI()}catch(x){}}
  catch(x){b.disabled=false;if(er)er.textContent=em(x)}}},true);
document.head.insertAdjacentHTML('beforeend','<style id="v361-css">.cvr{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:6px 0 10px}.cvr small{color:#6e6e73;font-size:13px}.cvr .btn{min-height:40px;padding:6px 14px;font-size:14px}.cvok{display:inline-flex;align-items:center;gap:6px;font-weight:800;color:#15803d;background:#dcfce7;padding:6px 12px}.cvok svg{width:18px;height:18px}html.dark .cvok{background:#052e1f!important;color:#4ade80!important}html.dark .cvr small{color:#a1a1a6!important}</style>');
})();
