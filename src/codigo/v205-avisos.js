
/* v205: 1) aviso de cookies (se muestra una vez; se recuerda en este navegador) y
   2) invitacion para instalar la pagina como app (Android/Chrome: boton Instalar; iPhone: instrucciones).
   Si algo falla, borra SOLO este <script id="v205-avisos"> y el <style id="v205-avisos-css">. */
(function(){
var CK='qh_cookies',IK='qh_install_no';
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
function set(k,v){try{localStorage.setItem(k,v)}catch(e){}}
var deferred=null,shown=false;
var standalone=(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
var shareIco='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/></svg>';
function card(html,label){var d=document.createElement('div');d.className='qhb';d.setAttribute('role','dialog');d.setAttribute('aria-label',label);d.innerHTML=html;document.body.appendChild(d);return d}
function cookies(){
 if(get(CK))return false;
 var d=card('<p>Usamos cookies y el almacenamiento de tu navegador para mantener tu sesión, recordar tus preferencias y proteger el sitio. También mostramos mapas y videos de otros servicios. <a href="privacidad.html#cookies">Más información</a></p><div class="qhb-r"><button type="button" class="btn" data-qhb="ok">Aceptar</button></div>','Aviso de cookies');
 d.querySelector('[data-qhb=ok]').onclick=function(){set(CK,'ok:'+Date.now());d.remove();setTimeout(install,600)};
 return true}
function snoozed(){var v=+get(IK)||0;return v&&Date.now()-v<14*864e5}
function install(){
 if(shown||standalone||snoozed()||get(CK)===null)return;
 var ico='<img src="icon-192.png" alt="">';
 if(deferred){shown=true;
  var d=card('<div class="qhb-i">'+ico+'<div><b>Instala Mi Pradera</b><p>Ten un acceso directo en la pantalla de inicio de tu celular. Ocupa muy poco espacio.</p></div></div><div class="qhb-r"><button type="button" class="btn" data-qhb="in">Instalar</button><button type="button" class="btn ghost" data-qhb="no">Ahora no</button></div>','Instalar la app');
  d.querySelector('[data-qhb=in]').onclick=function(){var p=deferred;deferred=null;d.remove();if(p){p.prompt();p.userChoice.then(function(c){if(c&&c.outcome!=='accepted')set(IK,Date.now())}).catch(function(){})}};
  d.querySelector('[data-qhb=no]').onclick=function(){set(IK,Date.now());d.remove()};
 }else if(ios){shown=true;
  var e=card('<div class="qhb-i">'+ico+'<div><b>Instala Mi Pradera</b><p>Toca '+shareIco+' <b style="display:inline;font-size:inherit">Compartir</b> abajo en Safari y luego <b style="display:inline;font-size:inherit">Agregar a inicio</b>.</p></div></div><div class="qhb-r"><button type="button" class="btn ghost" data-qhb="no">Entendido</button></div>','Instalar la app');
  e.querySelector('[data-qhb=no]').onclick=function(){set(IK,Date.now());e.remove()};
 }}
window.addEventListener('beforeinstallprompt',function(ev){ev.preventDefault();deferred=ev;if(document.body&&!document.querySelector('.qhb'))setTimeout(install,1500)});
window.addEventListener('appinstalled',function(){deferred=null;var b=document.querySelector('.qhb');if(b)b.remove()});
function start(){if(!cookies())setTimeout(install,4000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
