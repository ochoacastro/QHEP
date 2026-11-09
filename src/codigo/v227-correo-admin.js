
/* v227: Administrar → Mis datos → "Correo de acceso al panel". Cambia el correo de la cuenta de Firebase del administrador
   con verifyBeforeUpdateEmail: llega un enlace al correo nuevo y, al abrirlo, la cuenta (el mismo UID) queda con ese correo.
   Como el administrador se reconoce por su UID (ADMIN_UID y las reglas), no hay que cambiar codigo ni reglas.
   Pide la contraseña actual porque Firebase exige haber iniciado sesion hace poco para cambiar el correo.
   Si algo falla, borra este <script id="v227-correo-admin"> y quita ${admMailHTML()} de la pestaña Mis datos. */
function admMailHTML(){var u=null;try{u=QH.authCur&&QH.authCur()}catch(e){}var em=u&&u.email?u.email:'';
 var E=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
 /* v228: el formulario va en una ventana (modal): el panel se redibuja solo cuando cambian datos (p. ej. planes) y,
    si el formulario estaba en la pestaña, se borraba lo escrito. Con una ventana abierta la pagina no redibuja el panel */
 return '<div class="cg"><h3>Correo de acceso al panel</h3><p class="muted">Es el correo con el que entras como administrador'+(em?': <b>'+E(em)+'</b>':'')+'. Si lo cambias, te enviamos un enlace al correo nuevo; el cambio se hace cuando lo abras. Sigues siendo la misma cuenta, con tus publicaciones y permisos.</p>'+
 '<div class="row" style="margin-top:8px"><button type="button" class="btn ghost" data-amail="open">Cambiar correo de acceso</button></div></div>'}
function admMailForm(){return '<h2>Cambiar correo de acceso</h2><p class="muted">Te enviaremos un enlace al correo nuevo. El cambio se hace cuando lo abras.</p>'+
 '<label for="am-new">Correo nuevo</label><input id="am-new" type="email" autocomplete="email" autocapitalize="none" maxlength="120" placeholder="nuevo@correo.com">'+
 '<label for="am-pw">Tu contraseña actual</label><input id="am-pw" type="password" autocomplete="current-password" maxlength="100">'+
 '<div class="err" id="am-err" role="alert"></div><div class="row" style="margin-top:8px"><button type="button" class="btn" data-amail="go">Enviar enlace de confirmación</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>'}
document.addEventListener('click',async function(e){var b=e.target.closest&&e.target.closest('[data-amail]');if(!b)return;e.preventDefault();
 if(b.dataset.amail==='open'){try{modal(admMailForm());var f=document.getElementById('am-new');if(f)f.focus()}catch(x){}return}
 var er=document.getElementById('am-err'),nv=((document.getElementById('am-new')||{}).value||'').trim().toLowerCase(),pw=(document.getElementById('am-pw')||{}).value||'';
 var say=function(t){if(er)er.textContent=t};var u=null;try{u=QH.authCur&&QH.authCur()}catch(x){}
 if(!u||u.isAnonymous||!u.email)return say('Entra con tu cuenta de administrador para cambiar el correo.');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nv))return say('Escribe un correo válido.');
 if(nv===String(u.email).toLowerCase())return say('Ese ya es tu correo de acceso.');
 if(!pw)return say('Escribe tu contraseña actual.');
 b.disabled=true;say('Enviando…');
 try{await u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email,pw));
  await u.verifyBeforeUpdateEmail(nv);
  say('');try{modal('<h2>Revisa tu correo nuevo</h2><p>Te enviamos un enlace a <b>'+String(nv).replace(/[&<>"]/g,'')+'</b>. Ábrelo para confirmar el cambio (revisa también la carpeta de spam).</p><p class="muted">Hasta que lo abras, sigues entrando con '+String(u.email).replace(/[&<>"]/g,'')+'. Después del cambio, entra al panel con el correo nuevo y la misma contraseña.</p><div class="row" style="margin-top:8px"><button class="btn" data-act="close">Entendido</button></div>')}catch(x){toast('Te enviamos un enlace al correo nuevo.')}
 }catch(x){var c=x&&x.code||'';say(c==='auth/wrong-password'||c==='auth/invalid-credential'||c==='auth/invalid-login-credentials'?'La contraseña no es correcta.':c==='auth/email-already-in-use'?'Ese correo ya está en uso en otra cuenta.':c==='auth/invalid-email'?'Escribe un correo válido.':c==='auth/too-many-requests'?'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.':c==='auth/network-request-failed'?'Sin conexión. Revisa tu internet.':c==='auth/operation-not-allowed'?'Firebase no permite este cambio: revisa en Authentication → Configuración que la verificación de correo esté activa.':'No se pudo enviar el enlace ('+(c||'error')+').')}
 b.disabled=false},true);
