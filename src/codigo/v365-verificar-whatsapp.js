
/* v365: verificar el celular por WhatsApp, gratis. La persona toca «Verificar mi celular», se crea un código de 6 números
   (Firestore: celcod/{código} con su uid, plan y celular) y se abre su WhatsApp con un mensaje listo para el número de
   WhatsApp Business de Mi Pradera. Ella solo lo envía. El trabajador de Cloudflare (tools/whatsapp-verificar-worker.js) recibe
   el mensaje, comprueba que salió del mismo celular y escribe plans/{k}.waV; la página lo ve y muestra «Celular verificado».
   Se activa cuando el administrador guarda el número en Administrar → Configuración → «Verificación por WhatsApp»;
   sin número sigue funcionando el SMS de v361. Necesita las reglas v46. Si algo falla, borra este bloque. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var WA='<svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" d="M3.6 20.4l1.2-4.1a8.6 8.6 0 1 1 3.3 3.1z"/></svg>';
function biz(){try{var n=String((S.site||{}).waV||'').replace(/\D/g,'');if(n.length===10)n='57'+n;return n.length>=11?n:''}catch(e){return ''}}
window.celWaOn=function(){return !!biz()};
var W={num:'',code:'',t:0,tm:0};
function fs(){return firebase.firestore()}
async function mk(num){var u=firebase.auth().currentUser,k=QH.key();if(!u||!k)throw {code:'no-user'};
 for(var i=0;i<4;i++){var c=String(Math.floor(100000+Math.random()*900000));
  try{await fs().collection('celcod').doc(c).set({k:k,uid:u.uid,wa:num,ts:firebase.firestore.FieldValue.serverTimestamp()/* v367: hora del servidor (el celular puede tener la hora mal) */});return c}catch(e){if(i===3)throw e}}}
function view(st,txt){var link='https://wa.me/'+biz()+'?text='+encodeURIComponent('Hola Mi Pradera. Mi código para verificar mi celular es: '+W.code);
 modal('<div id="cw"><h2>Verificar mi celular</h2>'+
  (st==='prep'?'<p>Preparando tu código…</p>':
  '<p>Toca el botón: se abre WhatsApp con un mensaje listo para Mi Pradera. <b>Solo envíalo, sin cambiar nada</b>, desde el WhatsApp del <b>'+E(W.num)+'</b>.</p>'+
  '<a class="btn cwgo" id="cw-go" href="'+E(link)+'" target="_blank" rel="noopener">'+WA+'Abrir WhatsApp y enviar</a>'+
  '<p class="cwst" id="cw-st" role="status">'+(st==='wait'?'<span class="cwdot"></span>Esperando tu mensaje… cuando llegue, esto se actualiza solo.':'Es gratis. El código <b>'+E(W.code)+'</b> vence en 30 minutos.')+'</p>')+
  '<p class="err" id="err" role="alert">'+E(txt||'')+'</p><div class="row" style="margin-top:8px"><button type="button" class="btn ghost" data-cwx="1">Cerrar</button></div></div>')}
window.celWa=async function(num){if(!S.user||!S.plan)return toast('Tu cuenta aún se está cargando. Intenta en unos segundos.');
 W.num=num;if(W.code&&Date.now()-W.t<25*60000&&W.n===num)return view('go');
 view('prep');try{try{QH.planProf(S.user.name,num)}catch(x){}W.code=await mk(num);W.t=Date.now();W.n=num;view('go')}
 catch(e){var er=document.getElementById('err');if(er)er.textContent=e&&e.code==='permission-denied'?'No se pudo preparar tu código. Revisa que tu correo esté verificado o avisa al administrador.':'No se pudo preparar tu código. Revisa tu internet e intenta de nuevo.'}};
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#cw-go,[data-cwx]');if(!b)return;
 if(b.id==='cw-go'){var s=document.getElementById('cw-st');if(s)s.innerHTML='<span class="cwdot"></span>Esperando tu mensaje… cuando llegue, esto se actualiza solo.';return}
 e.preventDefault();closeModal(1)});
setInterval(function(){try{if(!W.num||!document.getElementById('cw'))return;if(typeof celVerif==='function'&&celVerif(W.num)){
 try{S.user.wa=W.num;S.user.waV=1;save()}catch(x){}W.code='';var n=W.num;W.num='';closeModal(1);toast('¡Listo! Tu celular '+n+' quedó verificado.');
 var r=document.getElementById('cvr');if(r)r.remove();try{syncUI()}catch(x){}}}catch(e){}},1500);
/* Administrar → Configuración: número de WhatsApp Business que recibe los códigos */
window.waVAdmin=function(){var n=String((S.site||{}).waV||'');
 return '<div class="cg wvadm"><h3>Verificación por WhatsApp</h3><p class="muted">Con este número, «Verificar mi celular» funciona por WhatsApp y es gratis: la persona te envía un código desde su WhatsApp y el sistema la marca como verificada sola. Sin número se usa el SMS de Firebase (de pago). Ahora: <b>'+(biz()?'WhatsApp ('+E(n)+')':'SMS')+'</b>.</p>'+
 '<label for="wv-n">Número de WhatsApp Business conectado a Meta (con 57)</label><input id="wv-n" type="tel" maxlength="15" value="'+E(n)+'" placeholder="573001234567">'+
 '<details class="gmhow"><summary>Cómo dejarlo funcionando</summary><ol>'+
 '<li>Consigue un número que <b>no</b> tenga WhatsApp instalado (por ejemplo, una SIM prepago nueva). Ese número queda solo para Mi Pradera.</li>'+
 '<li>En <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener">developers.facebook.com</a> crea una app de tipo <b>Empresa</b> y agrégale <b>WhatsApp</b>. En <b>WhatsApp → Configuración de la API</b> agrega tu número y verifícalo.</li>'+
 '<li>En <a href="https://business.facebook.com/settings/system-users" target="_blank" rel="noopener">Configuración del negocio → Usuarios del sistema</a> crea un usuario administrador y genera un <b>token permanente</b> con el permiso <b>whatsapp_business_messaging</b>.</li>'+
 '<li>En Firebase → Configuración del proyecto → <b>Cuentas de servicio</b> → Generar nueva clave privada (descarga un archivo JSON).</li>'+
 '<li>En Cloudflare crea un trabajador nuevo con el código <b>tools/whatsapp-verificar-worker.js</b> y guarda como <b>secretos</b> (nunca en el chat): WA_TOKEN, WA_PHONE_ID, WA_APP_SECRET, WA_VERIFY y FB_SA (el JSON completo).</li>'+
 '<li>En Meta → WhatsApp → <b>Configuración → Webhook</b> pega la dirección del trabajador, el mismo texto de WA_VERIFY y suscríbete a <b>messages</b>.</li>'+
 '<li>Escribe aquí el número con 57 y guarda. Publica las reglas v46.</li></ol></details>'+
 '<p class="err" id="wv-err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-wvsave="1">Guardar número</button>'+(n?'<button type="button" class="btn ghost" data-wvsave="0">Quitar y usar SMS</button>':'')+'</div></div>'};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-wvsave]');if(!b)return;var er=document.getElementById('wv-err'),v='';
 if(b.dataset.wvsave==='1'){v=(document.getElementById('wv-n')||{value:''}).value.replace(/\D/g,'');if(v.length===10)v='57'+v;if(!/^57[0-9]{10}$/.test(v)){if(er)er.textContent='Escribe el número con 57 y 10 dígitos, por ejemplo 573001234567.';return}}
 try{S.site=Object.assign({},S.site,{waV:v});save();render(true);toast(v?'Listo: «Verificar mi celular» usará WhatsApp':'Se quitó el número: la verificación vuelve a SMS')}catch(x){if(er)er.textContent='No se pudo guardar. Intenta de nuevo.'}});
document.head.insertAdjacentHTML('beforeend','<style id="v365-css">.cwgo{display:inline-flex;align-items:center;gap:10px;background:#25d366!important;color:#fff!important;border-color:#25d366!important;text-decoration:none;margin-top:6px}.cwgo svg{color:#fff}.cwst{margin-top:12px;font-size:14px;color:#6e6e73}.cwdot{display:inline-block;vertical-align:middle;margin-right:8px;width:10px;height:10px;border-radius:50%;background:#25d366;animation:cwp 1s ease-in-out infinite alternate}@keyframes cwp{from{opacity:.25}to{opacity:1}}</style>');
})();
