
/* v369: GOOGLE CON UN TOQUE (One Tap). Cuando se abre «Iniciar sesión» o «Registrarme», Google muestra su aviso
   «Continuar como …» con la cuenta que ya está en el celular: un toque y la persona entra (usa FedCM, el sistema nuevo del
   navegador que Google exige). El botón «Continuar con Google» quedó arriba en las dos pestañas.
   Se activa cuando el administrador pega el «ID de cliente web» en Administrar → Configuración → «Google con un toque».
   Sin ID, todo sigue igual con el botón. Si algo falla, borra este bloque. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function cid(){var v=String((S.site||{}).gId||'').trim();return /^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/.test(v)?v:''}
var L=0,ready='',shown=false;
function load(cb){if(window.google&&google.accounts&&google.accounts.id)return cb();if(L)return;L=1;var s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.onload=function(){L=0;cb()};s.onerror=function(){L=0};document.head.appendChild(s)}
function init(){var c=cid();if(ready===c)return;google.accounts.id.initialize({client_id:c,callback:onCred,use_fedcm_for_prompt:true,auto_select:false,cancel_on_tap_outside:true,context:'signin',itp_support:true});ready=c}
async function onCred(resp){var er=document.getElementById('err');if(er)er.textContent='Entrando con Google…';
 try{var cred=firebase.auth.GoogleAuthProvider.credential(resp&&resp.credential);
  if(!smsApp){try{smsApp=firebase.app('sms')}catch(e){smsApp=firebase.initializeApp(firebase.app().options,'sms')}}
  var a=smsApp.auth(),r=await a.signInWithCredential(cred),u=r.user,em=String(u.email||(u.providerData[0]||{}).email||'').toLowerCase();
  try{await firebase.auth().signInWithCredential(cred)}catch(x){}try{await a.signOut()}catch(x){}
  if(!em){if(er)er.textContent='No recibimos tu correo de Google. Usa otro método.';return}
  var dd=dnRead(u);S.user={id:DEV,name:String(dd.n||u.displayName&&!/^\{/.test(u.displayName)&&u.displayName||em.split('@')[0]).slice(0,30),wa:String(dd.w||''),email:em,consent:Date.now()};
  PEND=null;QH.derive();save();closeModal();syncUI();toast('¡Listo! Entraste con Google.');var f=after;after=null;f&&f();if(MODE==='panel')render()}
 catch(e){var c=e&&e.code||'';var m=c==='auth/operation-not-allowed'||c==='auth/unauthorized-domain'?'Este ingreso aún no está activado.':c==='auth/network-request-failed'?'Sin conexión. Revisa tu internet.':'No se pudo entrar con Google ('+(c||'error')+'). Usa el botón «Continuar con Google».';
  var er2=document.getElementById('err');if(er2)er2.textContent=m;else toast(m)}}
setInterval(function(){try{var open=!!document.querySelector('#ov .am .sob.gg');
 if(open&&!shown&&!S.user&&MODE!=='admin'&&cid()){shown=true;load(function(){try{init();google.accounts.id.prompt()}catch(e){}})}
 else if(!open&&shown){shown=false;try{google.accounts.id.cancel()}catch(e){}}}catch(e){}},700);
/* Administrar → Configuración */
window.gotAdmin=function(){var v=String((S.site||{}).gId||'');
 return '<div class="cg gotadm"><h3>Google con un toque</h3><p class="muted">Con el ID de cliente web, al abrir «Iniciar sesión» o «Registrarme» Google ofrece entrar con la cuenta que ya está en el celular, con un solo toque. Sin ID se usa solo el botón «Continuar con Google». Ahora: <b>'+(cid()?'activado':'solo el botón')+'</b>.</p>'+
 '<label for="got-id">ID de cliente web de Google</label><input id="got-id" type="text" maxlength="100" autocomplete="off" spellcheck="false" value="'+E(v)+'" placeholder="1234567890-abc123.apps.googleusercontent.com">'+
 '<details class="gmhow"><summary>Dónde encontrarlo (gratis)</summary><ol>'+
 '<li>En Firebase → <b>Authentication → Método de acceso → Google</b>, abre <b>Configuración del SDK web</b> y copia el <b>ID de cliente web</b> (termina en .apps.googleusercontent.com). No es una clave secreta.</li>'+
 '<li>En <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener">Google Cloud → APIs y servicios → Credenciales</a>, abre ese cliente (se llama «Web client (auto created by Google Service)»).</li>'+
 '<li>En <b>Orígenes autorizados de JavaScript</b> agrega <b>https://mipradera.com.co</b> y <b>https://www.mipradera.com.co</b>. Guarda (puede tardar unos minutos en funcionar).</li>'+
 '<li>En <b>Google Auth Platform → Desarrollo de la marca</b> revisa que el nombre sea <b>Mi Pradera</b> y sube el logo: es lo que la gente ve en el aviso.</li>'+
 '<li>Pega aquí el ID y guarda.</li></ol></details>'+
 '<p class="err" id="got-err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-gotsave="1">Guardar</button>'+(v?'<button type="button" class="btn ghost" data-gotsave="0">Quitar</button>':'')+'</div></div>'};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-gotsave]');if(!b)return;var er=document.getElementById('got-err'),v='';
 if(b.dataset.gotsave==='1'){v=(document.getElementById('got-id')||{value:''}).value.trim();if(!/^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/.test(v)){if(er)er.textContent='Ese no parece un ID de cliente web: termina en .apps.googleusercontent.com.';return}}
 try{S.site=Object.assign({},S.site,{gId:v});save();render(true);toast(v?'Listo: Google con un toque activado':'Se quitó: queda solo el botón de Google')}catch(x){if(er)er.textContent='No se pudo guardar. Intenta de nuevo.'}});
})();
