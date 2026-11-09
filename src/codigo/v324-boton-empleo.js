
/* v324: botón «Publicar empleo» al lado de «Publicar obituario» (Avisos de la comunidad y Clasificados); adentro pregunta formal o informal (v326).
   Abre el formulario de Clasificados con «Ofrezco empleo», la categoría Empleo y la plantilla de empleo (v288) ya elegidos.
   Desde la portada pasa al panel y allí se completa solo. Si algo falla, borra este bloque. */
(function(){
var IC='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="7"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';
var K='qh_emp_go';
function paint(){var l=document.querySelectorAll('[data-obi]');for(var i=0;i<l.length;i++){var b=l[i];if(b.closest('.modal'))continue;var nx=b.nextElementSibling;if(nx&&nx.hasAttribute&&nx.hasAttribute('data-empb'))continue;
 b.insertAdjacentHTML('afterend','<button type="button" class="btn ghost obi-b emp-b" data-empb="1">'+IC+'Publicar empleo</button>')}}/* v326: un solo botón; adentro se pregunta formal o informal */
var pt=0;new MutationObserver(function(){if(!pt){pt=1;requestAnimationFrame(function(){pt=0;paint();fill()})}}).observe(document.documentElement,{childList:true,subtree:true});
function want(){try{return sessionStorage.getItem(K)||''}catch(e){return ''}}
function done(){try{sessionStorage.removeItem(K)}catch(e){}}
function fill(){var lv=want();if(!lv)return;var op=document.getElementById('cm-op');if(!op)return;done();
 op.value='oemp';op.dispatchEvent(new Event('change',{bubbles:true}));
 setTimeout(function(){var c=document.getElementById('cm-cat');if(c&&c.value!=='emp'&&[].some.call(c.options,function(o){return o.value==='emp'})){c.value='emp';c.dispatchEvent(new Event('change',{bubbles:true}))}
  var t=document.querySelector('#ov [data-act="cmxPick"][data-v="txt"]');if(t)t.click();
  setTimeout(function(){try{if(typeof cmStep==='function')cmStep(2)}catch(x){}var j=document.getElementById('jobt');if(j)j.scrollIntoView({block:'start'})},120)},150)}
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-empb]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 try{sessionStorage.setItem(K,'1')}catch(x){}
 if(typeof MODE!=='undefined'&&MODE==='index'){location.href=PANEL_URL+'#/clasificado';return}
 if(typeof MODE!=='undefined'&&MODE==='admin'){done();return toast('Los anuncios se publican desde el panel de vendedores')}
 try{closeModal(1)}catch(x){}if(typeof comForm==='function')comForm();setTimeout(fill,80)},true);
})();
