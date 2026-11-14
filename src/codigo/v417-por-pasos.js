/* v417: FORMULARIOS POR PASOS. «Crea tu tienda» era una sola ventana con todas las preguntas seguidas (más de seis pantallas
   de alto en un celular). Ahora se muestra por partes, una sección a la vez, con «Continuar», «Omitir» (en las secciones
   opcionales) y «Atrás», una barra de avance y «Paso 2 de 6».
   - Crear tienda: Tu negocio → Categoría → Contacto → Ubicación → Horario → Entregas y pagos.
   - Tus datos personales / Tu dirección principal: Tu teléfono (solo si falta) → Tu dirección → Tu casa en el mapa.
   - Editar tienda: las mismas secciones como pestañas (se entra directo a la que se quiere cambiar) y «Guardar» siempre a la vista.
   NO cambia los campos ni cómo se guarda: los formularios siguen siendo los mismos (mismos id, mismos botones de guardar,
   borradores v399 y pregunta al salir v412); aquí solo se oculta lo que no es del paso actual (clase wz-off).
   Si al guardar falta un dato, se vuelve solo al paso donde está. Mientras corre el tutorial «Hazlo conmigo» (v248) el
   formulario se muestra completo, como antes.
   Para las pruebas y otros bloques: qhPasos.ver(selector) muestra el paso donde está ese campo.
   Si algo falla, borra este <script>: los formularios vuelven a salir completos en una sola ventana. */
(function(){
var val=function(id){var x=document.getElementById(id);return x?String(x.value||'').trim():''};
var dig=function(id){return val(id).replace(/\D/g,'')};
var FORMS=[
 {id:'tienda',is:function(m){return !!m.querySelector('[data-act="saveShop"]')},
  steps:function(){return [
   {t:'Tu negocio',d:'El nombre y la imagen con que te van a reconocer.',need:function(){return !val('f-name')?'Ponle un nombre a tu tienda.':!val('f-desc')?'Escribe una descripción corta de tu negocio.':''}},
   {t:'Categoría',d:'Para que te encuentren quienes buscan lo que vendes.',need:function(){var c='';try{c=pick.cat}catch(e){c='x'}var w=document.getElementById('f-newcat-w');return c||(w&&!w.hidden&&val('f-newcat'))?'':'Elige una categoría para tu tienda.'}},
   {t:'Contacto',d:'A dónde te escriben tus clientes.',need:function(){return dig('f-wa').length<7?'Escribe el teléfono o WhatsApp de tu negocio.':''}},
   {t:'Ubicación',d:'Dónde queda tu negocio. Si no atiendes en un local, puedes omitirlo.',opt:1},
   {t:'Horario',d:'Los días y las horas en que atiendes.',opt:1},
   {t:'Entregas y pagos',d:'Cómo entregas y cómo te pagan. Es el último paso.'}]},
  anchors:function(){return [[/^Tipo de negocio/,0],[/^Categoría/,1],[/^Tu nombre/,2],[/^Barrio o corregimiento/,3],['#x-days-l',4],[/^Dirección del negocio/,3],[/^Domicilios/,5]]},
  errs:[[/nombre de tu categor|categor/i,1],[/nombre|descripci/i,0],[/tel[eé]fono|whatsapp/i,2]]},
 {id:'editar',libre:1,is:function(m){return !!m.querySelector('[data-act="saveEditShop"]')},
  steps:function(){return [{t:'Tu negocio'},{t:'Contacto'},{t:'Ubicación'},{t:'Horario'},{t:'Entregas y pagos'}]},
  anchors:function(){return [[/^Tipo de negocio/,0],[/^Barrio o corregimiento/,2],['#x-days-l',3],[/^Dirección del negocio/,2],[/^Domicilios/,4],[/^WhatsApp para recibir/,1]]},
  errs:[[/nombre/i,0],[/tel[eé]fono|whatsapp/i,1]]},
 {id:'datos',is:function(m){return !!m.querySelector('[data-adsave]')&&!!m.querySelector('h3.adsh')},
  /* si el teléfono ya se conoce, no tiene paso propio: se muestra arriba del paso de la dirección */
  tel:function(m){var w=m.querySelector('#ad-telw');return !m.querySelector('#ad-telk')||!w||!w.hidden?1:0},
  steps:function(m){var T={t:'Tu teléfono',d:'La tienda te escribe aquí si necesita algo de tu pedido.',need:function(){return dig('ad-tel').length<7?'Escribe tu teléfono o WhatsApp.':''}},
    D={t:'Tu dirección',d:'A dónde te llevan los pedidos.',need:function(){return val('ad-zone').length<2?'Elige tu barrio o corregimiento.':val('ad-dir').length<5?'Escribe tu dirección.':''}},
    M={t:'Tu casa en el mapa',d:'Mira si el mapa marca bien tu casa. Es el último paso.'};return this.tel(m)?[T,D,M]:[D,M]},
  anchors:function(m){var k=this.tel(m);return [[/^Tu teléfono/,0],[/^Tu dirección principal/,k?1:0],[/^Tu casa en el mapa/,k?2:1]]},
  errs0:function(m){var k=this.tel(m);return [[/tel[eé]fono/i,0],[/barrio|direcci/i,k?1:0],[/Google Maps|mapa/i,k?2:1]]}}];
var W=null;/* formulario por pasos abierto: {m, f, steps, cur, h, n, e, foot} */
function tour(){return !!document.querySelector('.qtour:not([hidden])')}
function quita(){if(!W)return;var m=W.m;[].forEach.call(m.querySelectorAll('.wz-off'),function(x){x.classList.remove('wz-off')});[].forEach.call(m.querySelectorAll('.wz'),function(x){x.remove()});if(W.ob)W.ob.disconnect();if(W.oe)W.oe.disconnect();W=null}
function paso(el,A){for(var i=0;i<A.length;i++){var a=A[i][0];if(typeof a==='string'){if(el.matches(a))return A[i][1]}else if(/^(LABEL|H3|P)$/.test(el.tagName)&&a.test((el.textContent||'').trim()))return A[i][1]}return -1}
/* reparte los hijos de la ventana entre los pasos y deja a la vista solo los del paso actual */
function reparte(){if(!W)return;var m=W.m,A=W.f.anchors(m),s=-2,foot=false,last=W.cur===W.steps.length-1;
 /* el botón «¿Cómo se hace?» se agrega después del título: la barra de avance va antes que él (se mueve una sola vez) */
 var t0=m.querySelector(':scope > h2');if(t0&&t0.nextElementSibling!==W.h&&!W.mv){W.mv=1;t0.insertAdjacentElement('afterend',W.h)}
 [].forEach.call(m.children,function(c){if(c.classList.contains('wz'))return;if(c.tagName==='H2'){c.classList.remove('wz-off');return}
  if(!foot&&c.classList.contains('err'))foot=true;
  if(foot){var fila=!c.classList.contains('err');c.classList.toggle('wz-off',fila&&!W.f.libre&&!last);return}
  var p=paso(c,A);if(p>=0)s=p;var k=s<0?0:s;c._wz=k;c.classList.toggle('wz-off',k!==W.cur)})}
function pinta(){if(!W)return;var S=W.steps,i=W.cur,st=S[i],n=S.length,last=i===n-1,lock=!!(document.getElementById('ov')||{dataset:{}}).dataset.lock;
 if(W.f.libre){W.h.innerHTML='<div class="wztab" role="tablist" aria-label="Secciones">'+S.map(function(x,j){return '<button type="button" role="tab" data-wzir="'+j+'" aria-selected="'+(j===i)+'">'+x.t+'</button>'}).join('')+'</div>';W.n.innerHTML='';return}
 W.h.innerHTML='<div class="wzb" role="progressbar" aria-valuemin="1" aria-valuemax="'+n+'" aria-valuenow="'+(i+1)+'" aria-label="Paso '+(i+1)+' de '+n+'">'+S.map(function(x,j){return '<i class="'+(j<i?'ok':j===i?'on':'')+'"></i>'}).join('')+'</div><p class="wzk">Paso '+(i+1)+' de '+n+'</p><h3 class="wzt" tabindex="-1">'+st.t+'</h3>'+(st.d?'<p class="wzd">'+st.d+'</p>':'');
 W.n.innerHTML='<p class="err wze" role="alert"></p><div class="wzr">'+(i>0?'<button type="button" class="btn ghost" data-wz="atras">Atrás</button>':lock?'':'<button type="button" class="btn ghost" data-act="close">Cancelar</button>')+'<span class="wzs"></span>'+
  (last?'':(st.opt?'<button type="button" class="btn ghost" data-wz="omitir">Omitir</button>':'')+'<button type="button" class="btn pink" data-wz="sigue">Continuar</button>')+'</div>'}
function ir(i,quieto){if(!W)return;i=Math.max(0,Math.min(W.steps.length-1,i));var cambio=i!==W.cur;W.cur=i;pinta();reparte();
 if(cambio&&!quieto){try{W.m.scrollTop=0;var o=document.getElementById('ov');if(o)o.scrollTop=0}catch(e){}var t=W.h.querySelector('.wzt,[aria-selected="true"]');if(t)try{t.focus({preventScroll:true})}catch(e){}}}
function monta(m){var f=null;for(var i=0;i<FORMS.length;i++)if(FORMS[i].is(m)){f=FORMS[i];break}if(!f)return;
 var h=document.createElement('div');h.className='wz wzh';var n=document.createElement('div');n.className='wz wzn';
 var t=m.querySelector(':scope > h2'),e=m.querySelector(':scope > .err');if(!t||!e)return;
 t.insertAdjacentElement('afterend',h);e.insertAdjacentElement('beforebegin',n);
 W={m:m,f:f,steps:f.steps(m),cur:0,h:h,n:n,e:e};pinta();reparte();
 /* campos que otros bloques agregan o envuelven después (lista de barrios, mapa…) caen en su paso */
 W.ob=new MutationObserver(function(){if(!W)return;var k=W.f.steps(W.m).length;if(k!==W.steps.length){W.steps=W.f.steps(W.m);W.cur=Math.min(W.cur,k-1);pinta()}reparte()});W.ob.observe(m,{childList:true});
 if(f.tel){var tw=m.querySelector('#ad-telw');if(tw)new MutationObserver(function(){if(W&&W.m===m){W.steps=W.f.steps(m);pinta();reparte()}}).observe(tw,{attributes:true,attributeFilter:['hidden']})}
 /* si al guardar falta un dato, el formulario lo dice en su línea de error: se va al paso donde está ese dato */
 W.oe=new MutationObserver(function(){if(!W)return;var x=(W.e.textContent||'').trim();if(!x)return;var L=W.f.errs0?W.f.errs0(W.m):W.f.errs||[];for(var j=0;j<L.length;j++)if(L[j][0].test(x)){if(L[j][1]!==W.cur)ir(L[j][1]);return}});
 W.oe.observe(e,{childList:true,characterData:true,subtree:true})}
function revisa(){var m=document.querySelector('#ov > .modal');
 if(W&&(W.m!==m||!document.body.contains(W.m)||tour()))quita();
 if(!W&&m&&!tour()&&!m.querySelector('.wz'))monta(m)}
new MutationObserver(revisa).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',function(e){if(!W)return;var t=e.target,b=t&&t.closest&&t.closest('[data-wz],[data-wzir]');if(!b||!W.m.contains(b))return;e.preventDefault();
 if(b.dataset.wzir!=null)return ir(+b.dataset.wzir);
 var a=b.dataset.wz;W.e.textContent='';
 if(a==='atras')return ir(W.cur-1);
 if(a==='sigue'){var st=W.steps[W.cur],x=st.need?st.need():'';if(x){var z=W.n.querySelector('.wze');if(z)z.textContent=x;return}}
 ir(W.cur+1)});
window.qhPasos={n:function(){return W?W.steps.length:0},cur:function(){return W?W.cur:-1},ir:function(i){ir(i,true)},
 ver:function(s){if(!W)return false;var el=typeof s==='string'?W.m.querySelector(s):s;while(el&&el.parentNode!==W.m)el=el.parentNode;if(!el||el._wz==null)return false;ir(el._wz,true);return true}};
document.head.insertAdjacentHTML('beforeend','<style id="v417-css">'+
 '#ov .modal > .wz-off{display:none!important}'+
 '.wzh{margin:4px 0 14px}.wzb{display:flex;gap:4px;margin:0 0 12px}.wzb i{flex:1;height:6px;background:var(--color-pale-mist,#d9dde5)}.wzb i.on{background:var(--color-sapphire,#0071e3)}.wzb i.ok{background:var(--color-sapphire,#0071e3);opacity:.45}'+
 '.wzk{margin:0;font-size:13px;font-weight:600;opacity:.7}.wzt{margin:2px 0 4px;font-size:21px;line-height:1.2;font-weight:800;outline:0}.wzd{margin:0;font-size:14.5px;line-height:1.4;opacity:.8}'+
 '.wzn{margin-top:20px}.wzn .wze{margin:0 0 8px}.wzn .wze:empty{display:none}.wzr{display:flex;gap:8px;align-items:stretch}.wzr .wzs{flex:1}.wzr .btn{min-height:48px;margin:0}.wzr .btn.pink{min-width:132px}'+
 '.wztab{display:flex;gap:6px;overflow-x:auto;margin:0 0 4px;padding:0 0 6px;scrollbar-width:thin}.wztab button{flex:0 0 auto;min-height:44px;padding:8px 14px;border:1px solid var(--color-pale-mist,#d9dde5);background:transparent;color:inherit;font:inherit;font-weight:700;cursor:pointer}'+
 '.wztab button[aria-selected="true"]{border-color:var(--color-sapphire,#0071e3);color:var(--color-sapphire,#0071e3);box-shadow:inset 0 -3px 0 var(--color-sapphire,#0071e3)}.wztab button:focus-visible{outline:2px solid var(--color-sapphire,#0071e3);outline-offset:2px}'+
 '.wzb i,.wztab button,.wzr .btn{border-radius:0!important}</style>');
})();
