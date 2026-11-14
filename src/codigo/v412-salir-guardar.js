/* v412: SALIR DE UN FORMULARIO. Si alguien cambió algo en una ventana de edición (tienda nueva, editar tienda, anuncio,
   servicio, producto, editar producto o registro) y la cierra por su cuenta (botón de cerrar o «Cancelar», un toque afuera
   o la tecla Escape), se le pregunta: «Guardar cambios», «No guardar» o «Seguir editando».
   «Guardar cambios» toca el botón de guardar del formulario (si falta un dato, el formulario lo dice y sigue abierto).
   «No guardar» cierra y borra el borrador (v399), así no queda el aviso «Continuar». El borrador y «Continuar» quedan solo
   para emergencias: se apagó el teléfono, se recargó o se cerró la página. Si algo falla, borra este bloque. */
(function(){
var ACTS=['saveShop','saveEditShop','saveAd','saveServ','saveProd','saveEdit','doReg'];
function M(){return document.querySelector('#ov .modal')}
function saveBtn(m){if(!m)return null;for(var i=0;i<ACTS.length;i++){var b=m.querySelector('[data-act="'+ACTS[i]+'"]');if(b)return b}return null}
function dirty(m){if(!m||!saveBtn(m))return false;if(m._sgq)return true;try{return !!(window.qhBorr&&qhBorr.dirty())}catch(e){return false}}
/* cualquier cosa que la persona escriba, elija o marque en el formulario cuenta como cambio (también las fotos) */
function touch(e){if(!e.isTrusted)return;var t=e.target,m=t&&t.closest&&t.closest('#ov .modal');if(m&&saveBtn(m))m._sgq=1}
document.addEventListener('input',touch,true);document.addEventListener('change',touch,true);
var Q=null;
function ask(m){if(Q)return;var prev=document.activeElement,o=document.createElement('div');o.className='overlay';o.id='sgq';o.style.zIndex=100001;
 o.innerHTML='<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="sgq-t" style="max-width:400px"><h2 id="sgq-t">¿Guardar los cambios?</h2><p>Hiciste cambios en esta ventana y todavía no están guardados.</p><div class="sgqb"><button type="button" class="btn pink" data-sgq="si">Guardar cambios</button><button type="button" class="btn ghost" data-sgq="no">No guardar</button><button type="button" class="btn ghost" data-sgq="x">Seguir editando</button></div></div>';
 function done(v){document.removeEventListener('keydown',kd,true);o.remove();Q=null;
  if(v==='si'){var b=saveBtn(M());if(b){try{b.scrollIntoView({block:'nearest'})}catch(e){}b.click()}return}
  if(v==='no'){try{window.qhBorr&&qhBorr.drop()}catch(e){}closeModal();return}
  try{prev&&prev.isConnected&&prev.focus&&prev.focus()}catch(e){}}
 function kd(e){if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();return done('x')}
  if(e.key==='Tab'){e.stopImmediatePropagation();var l=[].slice.call(o.querySelectorAll('button')),i=l.indexOf(document.activeElement);e.preventDefault();l[(i+(e.shiftKey?-1:1)+l.length)%l.length].focus()}}
 document.addEventListener('keydown',kd,true);
 o.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-sgq]');if(b)done(b.dataset.sgq)});
 document.body.appendChild(o);Q=o;o.querySelector('button').focus()}
/* las tres formas de salir por cuenta propia */
document.addEventListener('click',function(e){if(Q)return;var t=e.target,ov=document.getElementById('ov');if(!ov||!t||!t.closest)return;
 var out=t===ov&&!ov.dataset.lock,x=t.closest('#ov [data-act="close"]');if(!out&&!x)return;var m=M();if(!dirty(m))return;
 e.preventDefault();e.stopImmediatePropagation();ask(m)},true);
document.addEventListener('keydown',function(e){if(Q||e.key!=='Escape')return;var ov=document.getElementById('ov');if(!ov||ov.dataset.lock||document.getElementById('lb')||document.querySelector('.qs-ov'))return;
 var m=M();if(!dirty(m))return;e.preventDefault();e.stopImmediatePropagation();ask(m)},true);
document.head.insertAdjacentHTML('beforeend','<style id="v412-css">#sgq .sgqb{display:flex;flex-direction:column;gap:8px;margin-top:14px}#sgq .sgqb .btn{width:100%;min-height:46px}#sgq .modal,#sgq .btn{border-radius:0!important}</style>');
})();
