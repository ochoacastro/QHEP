
/* v368: REGISTRO EN UN SOLO PASO. Antes: código al correo → «Registro exitoso» → abrir otro enlace del correo → volver a entrar con
   correo y clave. Ahora: al tocar «Registrarme» se crea la cuenta y llega UN enlace al correo; la página se queda esperando y,
   apenas la persona abre el enlace (en este u otro celular), entra sola, sin volver a escribir la clave.
   La seguridad no cambia: la confirmación la hace Firebase con su enlace (las reglas exigen el correo verificado).
   Este bloque es el registro: no se puede borrar (v387: el registro viejo con código ya no existe). */
(function(){
var W=null,E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var MAXW=30*60000,GAP=60000;
function stop(){if(!W)return;clearInterval(W.iv);try{W.a.signOut()}catch(e){}W=null}
window.regWaitShow=function(){if(!W)return false;show();return true};
function show(t){if(!W)return;modal('<div id="rw"><h2>Confirma tu correo</h2><p>Te enviamos un enlace a <b>'+E(W.em)+'</b>. Ábrelo (revisa también spam o promociones) y vuelve aquí: <b>entrarás solo</b>, sin escribir tu clave otra vez.</p>'+
 '<p class="cwst" role="status"><span class="cwdot"></span>Esperando que abras el enlace…</p><p class="err" id="err" role="alert">'+E(t||'')+'</p>'+
 '<div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-rw="chk">Ya lo abrí</button><button type="button" class="btn ghost" data-rw="re">Reenviar enlace</button></div>'+
 '<p class="muted" style="margin-top:12px;font-size:13px">¿Escribiste mal el correo? <a href="#" data-rw="bad">Corregirlo</a></p></div>')}
async function check(manual){if(!W||W.busy)return;W.busy=1;try{var u=W.a.currentUser;if(!u){stop();return}await u.reload();u=W.a.currentUser;
 if(u&&u.emailVerified)return await done(u);if(manual){var er=document.getElementById('err');if(er)er.textContent='Todavía no aparece confirmado. Abre el enlace que te llegó al correo y vuelve a tocar «Ya lo abrí».'}}
 catch(e){if(manual){var er2=document.getElementById('err');if(er2)er2.textContent='Sin conexión. Revisa tu internet e intenta de nuevo.'}}finally{if(W)W.busy=0}}
async function done(u){var em=W.em,pw=W.pw,d=dnRead(u);clearInterval(W.iv);try{await W.a.signOut()}catch(e){}W=null;
 try{await firebase.auth().signInWithEmailAndPassword(em,pw)}catch(x){toast('Entraste, pero no se pudo abrir la sesión segura. Si no puedes publicar, cierra sesión y vuelve a entrar.')}
 S.user={id:DEV,name:String(d.n||em.split('@')[0]).slice(0,30),wa:d.w||'',email:em,pw:1,consent:Date.now()};PEND=null;REG=null;QH.derive();save();
 if(document.getElementById('rw'))closeModal();syncUI();toast('¡Listo! Tu correo quedó confirmado y ya entraste.');var f=after;after=null;f&&f();if(MODE==='panel')render()}
window.regDirect=async function(R){var err=document.getElementById('err'),b=document.getElementById('reg-go');
 try{await rcToken('rc-login')}catch(e){if(err)err.textContent='No se pudo verificar reCAPTCHA. Recarga la página e inténtalo de nuevo.';return}
 if(b)b.disabled=true;if(typeof telFree==='function'&&!(await telFree(R.phone))){if(b)b.disabled=false;if(err)err.textContent='Ese celular ya está registrado en otra cuenta. Entra con tu correo o usa otro número.';return}/* v371 */if(err)err.textContent='Creando tu cuenta…';stop();var a,c=null;
 try{a=await authB();c=await a.createUserWithEmailAndPassword(R.email,R.pw);await c.user.updateProfile({displayName:JSON.stringify({n:R.name,e:R.email,w:R.phone})});a.languageCode='es';try{await c.user.sendEmailVerification()}catch(x){}}
 catch(e){if(c){try{await c.user.delete()}catch(x){}}try{a&&a.signOut()}catch(x){}try{rcReset('rc-login')}catch(x){}if(b)b.disabled=false;var m=regErr(e);
  if(e&&e.code==='auth/email-already-in-use'){REG=null;closeModal();loginForm();toast(m);return}if(err)err.textContent=m;return}
 REG=null;W={a:a,em:R.email,pw:R.pw,t0:Date.now(),last:Date.now(),busy:0};W.iv=setInterval(function(){if(!W)return;if(Date.now()-W.t0>MAXW){stop();return}check(false)},3000);show()};
document.addEventListener('visibilitychange',function(){if(W&&document.visibilityState==='visible')check(false)});
addEventListener('click',async function(e){var b=e.target.closest&&e.target.closest('[data-rw]');if(!b||!W)return;e.preventDefault();var k=b.dataset.rw,er=document.getElementById('err');
 if(k==='chk')return check(true);
 if(k==='re'){var w=GAP-(Date.now()-W.last);if(w>0){if(er)er.textContent='Espera '+Math.ceil(w/1000)+' segundos para pedir otro enlace.';return}
  try{await W.a.currentUser.sendEmailVerification();W.last=Date.now();if(er)er.textContent='Te enviamos otro enlace. Revisa también spam.'}catch(x){if(er)er.textContent='No se pudo reenviar. Espera un momento e intenta de nuevo.'}return}
 if(k==='bad'){try{await W.a.currentUser.delete()}catch(x){}stop();closeModal();regForm();toast('Escribe tu correo correcto y vuelve a registrarte.')}});
})();
