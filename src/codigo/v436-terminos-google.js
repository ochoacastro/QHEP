
/* v436: TÉRMINOS Y CONDICIONES AL ENTRAR POR PRIMERA VEZ CON GOOGLE (o Apple o Facebook). Quien se registra a mano marca la casilla
   «Acepto los Términos…» (10-ed.js); quien entraba con Google por primera vez quedaba registrado sin marcar nada (solo una nota
   «Al continuar con Google aceptas…»). Ahora, la primera vez, antes de quedar adentro, sale la ventana «Términos y condiciones»
   con dos casillas (los Términos de uso; el tratamiento de datos personales y la Política de privacidad, Ley 1581 de 2012) y
   «Aceptar», que solo se activa con las dos marcadas. Se pueden leer los textos completos ahí mismo.
   «Primera vez» = Firebase dice que la cuenta es nueva (additionalUserInfo.isNewUser). Quien se registró a mano y luego entra con
   Google ya aceptó, y no se le pregunta. Si la persona cancela, no entra; y como la cuenta de Google ya quedó creada, este teléfono
   recuerda (qh_tyc_pend) que falta aceptar, para preguntar otra vez la próxima vez que entre.
   Se usa desde 10-ed.js (botón «Continuar con Google», Apple y Facebook) y v369-google-un-toque.js (Google One Tap).
   Para quitarlo: borra este archivo de src/orden.json; los dos lugares vuelven solos a entrar sin preguntar (miran si existe qhTyC). */
(function(){
var K='qh_tyc_pend';
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function pend(em){try{return localStorage.getItem(K)===em}catch(e){return false}}
window.qhTyC={
 falta:function(r,em){return !!(r&&r.additionalUserInfo&&r.additionalUserInfo.isNewUser)||pend(em)},
 pedir:function(em,fin){try{localStorage.setItem(K,em)}catch(e){}
  var leer=function(k){try{return legalHTML(k)}catch(e){return ''}};
  modal('<div class="tyc"><h2>Términos y condiciones</h2><p class="muted">Es la primera vez que entras con <b>'+E(em)+'</b>. Para crear tu cuenta en Mi Pradera, acepta:</p>'+
   '<label class="tyc-r" for="tyc-1"><input type="checkbox" id="tyc-1"><span>Acepto los <b>Términos de uso</b> de Mi Pradera.</span></label>'+
   '<label class="tyc-r" for="tyc-2"><input type="checkbox" id="tyc-2"><span>Autorizo el <b>tratamiento de mis datos personales</b> según la <b>Política de privacidad</b> (Ley 1581 de 2012).</span></label>'+
   '<details class="legal"><summary>Leer los Términos y la Política</summary><p><b>Términos de uso</b></p>'+leer('terms')+'<p><b>Política de privacidad</b></p>'+leer('priv')+'</details>'+
   '<button type="button" class="btn pink tyc-ok" data-tyc="ok" disabled>Aceptar</button><button type="button" class="btn ghost tyc-no" data-tyc="no">Cancelar</button></div>');
  var ov=document.getElementById('ov');if(ov)ov.dataset.lock='1';/* un toque afuera no la cierra */
  qhTyC._fin=fin;qhTyC._em=em}
};
document.addEventListener('change',function(e){if(!e.target||!/^tyc-[12]$/.test(e.target.id))return;var a=document.getElementById('tyc-1'),b=document.getElementById('tyc-2'),ok=document.querySelector('[data-tyc="ok"]');if(ok)ok.disabled=!(a&&a.checked&&b&&b.checked)});
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-tyc]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 if(b.dataset.tyc==='ok'){var a=document.getElementById('tyc-1'),c=document.getElementById('tyc-2');if(!(a&&a.checked&&c&&c.checked))return;
  try{localStorage.removeItem(K)}catch(x){}var f=qhTyC._fin;qhTyC._fin=null;if(typeof f==='function')f();return}
 /* cancelar: no entra (la sesión de Google se cierra) y la próxima vez se vuelve a preguntar */
 qhTyC._fin=null;try{firebase.auth().signOut()}catch(x){}try{closeModal(1)}catch(x){}
 try{toast('No entraste. Para crear tu cuenta hay que aceptar los Términos y la Política de privacidad.')}catch(x){}},true);
document.head.insertAdjacentHTML('beforeend','<style id="v436-css">.tyc h2{margin:0 0 6px}.tyc .muted{margin:0 0 10px}'+
 '.tyc-r{display:grid;grid-template-columns:28px 1fr;gap:12px;align-items:start;padding:14px 0;border-bottom:1px solid var(--line,#e2e5ea);font-size:16px;line-height:1.45;font-weight:400;cursor:pointer}'+
 '.tyc-r input{width:24px;height:24px;margin:1px 0 0;accent-color:#0071e3}.tyc .legal{margin:12px 0 4px}'+
 '.tyc-ok{width:100%;margin:14px 0 0;min-height:48px}.tyc-ok:disabled{opacity:.45;cursor:not-allowed}.tyc-no{width:100%;margin:8px 0 0;min-height:44px}</style>');
})();
