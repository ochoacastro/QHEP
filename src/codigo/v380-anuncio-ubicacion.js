
/* v380: 1) UBICACIÓN DEL ANUNCIO. En «Publicar anuncio» ya no se pide el barrio de cero: si la persona tiene su dirección
   principal, se ofrece «Mi barrio: X» (marcado), «Otro barrio o lugar» o «No mostrar ubicación (solo WhatsApp)».
   Solo se muestra el barrio, nunca la dirección completa.
   2) En Mi cuenta, junto al aviso verde del negocio, sale el aviso «Publica tu anuncio gratis».
   Si algo falla, borra este bloque y ${typeof pubCta...} de la vista de Mi cuenta. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function myZone(){var z='';try{var a=typeof adrGet==='function'?adrGet('main'):null;z=a&&a.zone||''}catch(e){}if(!z)try{z=S.plan&&S.plan.addr&&S.plan.addr.zone||''}catch(e){}return String(z).trim()}
function setZ(i,v){i.value=v;i.dispatchEvent(new Event('change',{bubbles:true}));i.dispatchEvent(new Event('input',{bubbles:true}))}
function deco(){var i=document.getElementById('cm-z');if(!i||i.dataset.cml||!i.dataset.zn)return;var w=i.closest('.znw')||i,lb=w.previousElementSibling;if(!lb||lb.tagName!=='LABEL')return;i.dataset.cml='1';
 var mz=myZone(),v=i.value.trim(),edit=!!document.querySelector('#ov h2')&&/Editar/.test(document.querySelector('#ov h2').textContent);
 var m=edit?(v?(mz&&v.toLowerCase()===mz.toLowerCase()?'mine':'otro'):'none'):(mz?'mine':'otro');
 var g=document.createElement('div');g.className='cml';g.setAttribute('role','radiogroup');g.setAttribute('aria-label','Ubicación del anuncio');
 g.innerHTML=(mz?'<label><input type="radio" name="cml" value="mine"'+(m==='mine'?' checked':'')+'><span><i>Mi barrio: <b>'+E(mz)+'</b></i><small>El de tu dirección registrada</small></span></label>':'')+
  '<label><input type="radio" name="cml" value="otro"'+(m==='otro'?' checked':'')+'><span>'+(mz?'Otro barrio o lugar':'Elegir el barrio o lugar')+'</span></label>'+
  '<label><input type="radio" name="cml" value="none"'+(m==='none'?' checked':'')+'><span>No mostrar ubicación<small>Solo te contactan por WhatsApp</small></span></label>';
 lb.textContent='¿Dónde está lo que publicas?';lb.insertAdjacentElement('afterend',g);
 function apply(k,first){w.style.display=k==='otro'?'':'none';if(k==='mine')setZ(i,mz);else if(k==='none')setZ(i,'');else if(!first&&(i.value===mz||!i.value)){setZ(i,'');var s=w.querySelector('select');if(s)s.value=''}}
 g.addEventListener('change',function(e){if(e.target.name==='cml')apply(e.target.value)});apply(m,true)}
var t=0;new MutationObserver(function(){if(t)return;t=1;requestAnimationFrame(function(){t=0;try{deco()}catch(e){}})}).observe(document.documentElement,{childList:true,subtree:true});
/* aviso en Mi cuenta */
var IC='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 8a5 5 0 0 1 0 8"/><path d="M18 5a9 9 0 0 1 0 14"/></svg>';
var CK='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
window.pubCta=function(){if(typeof MODE!=='undefined'&&MODE==='admin')return '';var li=function(x){return '<li>'+CK+'<span>'+x+'</span></li>'};
 return '<section class="bzc bzq" aria-label="Publica tu anuncio gratis"><div class="bzi" aria-hidden="true">'+IC+'</div><div class="bzt"><em>GRATIS</em><h3>Publica tu anuncio gratis</h3><p>Vende, arrienda, busca o regala algo. Tus vecinos te escriben directo a tu WhatsApp.</p><ul>'+li('Un anuncio gratis cada día')+li('Dura 24 horas a la vista de todos')+li('Con fotos o con video')+'</ul><button type="button" class="btn bzb" data-act="cmxNew">Publicar anuncio gratis</button></div></section>'};
document.head.insertAdjacentHTML('beforeend','<style id="v380-css">.bzq{background:linear-gradient(135deg,#0b4fa8 0%,#0071e3 55%,#38bdf8 100%)}.bzq .bzb,.bzq .btn.bzb,html.dark .bzq .btn.bzb{color:#0b4fa8!important}'+
 '.cml{display:flex;flex-direction:column;gap:8px;margin:6px 0 10px}.cml label{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border:1px solid #d2d2d7;cursor:pointer;font-weight:500}.cml input{width:20px;height:20px;margin:2px 0 0;flex:none;accent-color:#0071e3}.cml span{display:flex;flex-direction:column;gap:2px}.cml small{font-size:13px;color:#6e6e73;font-weight:400}.cml i{font-style:normal}.cml label:has(input:checked){border-color:#0071e3;background:#eef5ff}'+
 'html.dark .cml label{border-color:#3a3a3c}html.dark .cml small{color:#a1a1a6}html.dark .cml label:has(input:checked){border-color:#4da3ff;background:#0b2340}</style>');
})();
