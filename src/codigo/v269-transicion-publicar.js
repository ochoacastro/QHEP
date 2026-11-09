
/* v269: transición «PUBLICANDO ●●●» → «¡LISTO!» al tocar Publicar (anuncio, obituario, noticia, tienda, producto, servicio,
   inmueble o vehículo). No cambia cómo se guarda nada: escucha el botón y el aviso (toast) que la página ya muestra.
   Si aparece un error en el formulario o un aviso de error, se cierra al instante. Si algo falla, borra este <script> y su <style>. */
(function(){
var SEL='[data-act="saveShop"],[data-act="saveProd"],[data-act="saveServ"],[data-act="saveAd"],[data-act="cmxSave"],[data-act="nwSave"],[data-obpub],[data-act="cmGuestRetry"]';
var OKRE=/publicad|abierta|registrad|actualizad|guardad|renovad|agregad/i,BADRE=/no se pudo|error|permiso|espera|revisa|falta|demasiad|no est/i;
var el=null,st=0,timer=0,poll=0,h0='';
function ui(){if(el)return el;el=document.createElement('div');el.className='pfx';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.innerHTML='<div class="pfx-t">Publicando</div><div class="pfx-d" aria-hidden="true"><i></i><i></i><i></i></div><div class="pfx-s"></div>';document.body.appendChild(el);return el}
function errTxt(){var e=document.querySelector('#ov #err,#ov #ob-err,#ov .err'),t=e?e.textContent.trim():'';return /^(preparando|publicando|guardando|cargando|subiendo|entrando|procesando)/i.test(t)?'':t/* los mensajes de avance no son errores */}
function stop(){st=0;clearTimeout(timer);clearInterval(poll);if(el){el.classList.remove('on');setTimeout(function(){if(el&&!st){el.classList.remove('ok')}},300)}}
function start(){var o=ui();o.classList.remove('ok');o.querySelector('.pfx-t').textContent='Publicando';o.querySelector('.pfx-s').textContent='';st=1;
 requestAnimationFrame(function(){o.classList.add('on')});clearTimeout(timer);timer=setTimeout(stop,15000);
 var ov=document.querySelector('#ov h2');h0=ov?ov.textContent:'';clearInterval(poll);
 poll=setInterval(function(){if(!st)return clearInterval(poll);if(errTxt())return stop();var h=document.querySelector('#ov h2');if(h&&h.textContent!==h0&&!OKRE.test(h.textContent))return stop()},250)}
function done(m){if(!st)return;st=2;clearInterval(poll);clearTimeout(timer);var o=ui();o.querySelector('.pfx-t').textContent='¡Listo!';o.querySelector('.pfx-s').textContent=line(m);o.classList.add('ok');timer=setTimeout(stop,1700)}
function line(m){m=String(m||'');if(/obituario/i.test(m))return 'El obituario ya está en línea.';if(/noticia/i.test(m))return 'Tu noticia ya está en línea.';if(/tienda|negocio/i.test(m))return 'Tu negocio ya está en línea.';if(/agregad/i.test(m))return 'Tu producto ya está en línea.';if(/actualiz|guardad/i.test(m))return 'Los cambios ya están en línea.';return 'Tu publicación ya está en línea.'}
/* al tocar Publicar: se espera un instante; si el formulario muestra un error, no se anima */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest(SEL);if(!b||st)return;var e0=errTxt();/* el propio botón se desactiva al tocarlo: no se revisa «disabled» */
 setTimeout(function(){var e1=errTxt();if(e1&&e1!==e0)return;if(!document.contains(b)&&!document.querySelector('#ov'))return;start()},120)},true);
/* el aviso de la página dice si salió bien o mal */
function hook(){if(typeof window.toast!=='function'||window.toast.__pfx)return;var t0=window.toast;var w=function(m){try{if(st===1){if(BADRE.test(m))stop();else if(OKRE.test(m))done(m)}}catch(x){}return t0.apply(this,arguments)};w.__pfx=1;window.toast=w}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else setTimeout(hook,0);
window.addEventListener('load',hook);
window.pubFx={start:start,done:done,stop:stop};
})();
