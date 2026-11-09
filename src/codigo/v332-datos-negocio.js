
/* v332: el teléfono va con la dirección principal (datos personales, solo en este dispositivo). Si se marca
   «también son de mi negocio», al registrar la tienda el teléfono, el otro teléfono y la dirección aparecen ya llenos.
   Botón «+ Agregar otro teléfono» en la dirección, en la tienda nueva y al editarla. Si algo falla, borra este bloque. */
(function(){
function ld(){var k='';try{k=QH.key()}catch(e){}if(!k)return {};try{return JSON.parse(localStorage.getItem('qh_dir_'+k)||'{}')||{}}catch(e){return {}}}
document.addEventListener('change',function(e){if(e.target&&e.target.id==='ad-biz'){var x=document.getElementById('ad-bizx');if(x)x.hidden=!e.target.checked}});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-w2]');if(!b)return;e.preventDefault();var p=b.dataset.w2,w=document.getElementById(p==='ad'?'ad-t2w':p+'-w2w');
 if(w){w.hidden=false;b.hidden=true;var i=w.querySelector('input');if(i)i.focus()}});
function set(id,v){var i=document.getElementById(id);if(!i||!v||i.value.trim())return 0;i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}));return 1}
/* v352: al crear la tienda (o un servicio) los datos personales llegan solos y se pregunta si el teléfono y la dirección
   del negocio son los mismos. «No, es otro / es otra» vacía esos campos para escribir los del negocio. Todo sigue editable. */
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function setv(id,v){var i=document.getElementById(id);if(!i)return;i.value=v==null?'':String(v);i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}))}
function ask(k,txt,yes,no){return '<div class="bizq" data-bizk="'+k+'"><p>'+txt+'</p><div class="bizo" role="group"><button type="button" data-bizq="'+k+'" data-v="same" aria-pressed="true">'+yes+'</button><button type="button" data-bizq="'+k+'" data-v="new" aria-pressed="false">'+no+'</button></div></div>'}
var CUR={};
function addr(a){setv('x-addr',a?a.dir:'');setv('x-zone',a?a.zone:'');setv('x-plus',a?a.plus:'');setv('x-lat',a&&a.lat!=null?a.lat:'');setv('x-lng',a&&a.lng!=null?a.lng:'')}
function fill(){var w=document.getElementById('f-wa')||document.getElementById('v-wa');if(!w||w.dataset.qp)return;w.dataset.qp='1';var sv=w.id==='v-wa';
 try{set(sv?'v-name':'f-owner',String((S.user&&S.user.name)||(S.plan&&S.plan.name)||'').trim().slice(0,30))}catch(e){}/* v347: tu nombre de la cuenta */
 var o=ld(),tel=telCO(o.tel||(S.user&&S.user.wa)||''),a=o.main&&(o.main.dir||o.main.plus)?o.main:null;CUR={tel:tel,a:a,w:w.id};
 if(tel.length>=7&&!w.value.trim()){setv(w.id,tel);w.insertAdjacentHTML('beforebegin',ask('tel','¿El teléfono '+(sv?'de tu servicio':'del negocio')+' es el mismo de tus datos personales (<b>'+E(tel)+'</b>)?','Sí, el mismo','No, es otro'))}
 if(!sv&&a&&!(document.getElementById('x-addr')||{value:'x'}).value.trim()){var l1=document.querySelector('label[for="x-addr"]'),z=document.getElementById('x-zone'),l2=z&&(z.closest('.znw')||z);
  var first=l1;if(l2&&l1&&(l2.compareDocumentPosition(l1)&Node.DOCUMENT_POSITION_FOLLOWING)){var lz=l2.previousElementSibling;first=lz&&lz.tagName==='LABEL'?lz:l2}
  if(first){addr(a);first.insertAdjacentHTML('beforebegin',ask('dir','¿La dirección del negocio es la misma de tus datos personales (<b>'+E([a.dir,a.zone].filter(Boolean).join(', '))+'</b>)?','Sí, la misma','No, es otra'))}}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-bizq]');if(!b)return;e.preventDefault();var k=b.dataset.bizq,same=b.dataset.v==='same';
 b.parentNode.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
 if(k==='tel'){setv(CUR.w,same?CUR.tel:'');var i=document.getElementById(CUR.w);if(i){i.placeholder=same?'3001234567':'Teléfono / WhatsApp del negocio';if(!same)i.focus()}}
 else{addr(same?CUR.a:null);var x=document.getElementById('x-addr');if(x){x.placeholder=same?'Ej: Calle 5 #8-20':'Dirección del local o negocio';if(!same)x.focus()}}});
document.head.insertAdjacentHTML('beforeend','<style id="v352-css">.bizq{margin:12px 0 6px;padding:12px 14px;background:#eef4ff;border-left:5px solid #0071e3}.bizq p{margin:0 0 8px;font-size:15px;line-height:1.4}.bizo{display:flex;gap:8px;flex-wrap:wrap}.bizo button{flex:1 1 140px;min-height:44px;padding:8px 12px;border:2px solid #0071e3;background:#fff;color:#0071e3;font:inherit;font-weight:800;font-size:15px;cursor:pointer;border-radius:0}.bizo button[aria-pressed=true]{background:#0071e3;color:#fff}html.dark .bizq{background:#0a2540!important;color:#f5f5f7!important;border-left-color:#0a84ff!important}html.dark .bizo button{background:#1c1c1e!important;color:#64a8ff!important;border-color:#0a84ff!important}html.dark .bizo button[aria-pressed=true]{background:#0a84ff!important;color:#fff!important}</style>');
var t=0;new MutationObserver(function(){if(!t){t=1;requestAnimationFrame(function(){t=0;fill()})}}).observe(document.documentElement,{childList:true,subtree:true});
})();
