
/* v330: anuncios de empleo más simples y ejemplos de descripción.
   - Con la plantilla de empleo se ocultan Título, Descripción, Horario, Precio, Estado y el aviso de fotos (los llena la plantilla);
     en su lugar se ve «Así se verá tu anuncio» y el botón «Escribir la descripción a mano» para mostrarlos.
   - El «Texto del anuncio» de arriba muestra un ejemplo de empleo.
   - Para los demás anuncios, el botón «Usar un ejemplo de descripción» pone un ejemplo según el tipo (vendo, arriendo, busco…).
   Si algo falla, borra este bloque. */
(function(){
var $1=function(id){return document.getElementById(id)};
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var PH0=null;
var EX={vendo:'Vendo [qué] en buen estado.\nDetalles: [marca, tamaño, color, tiempo de uso].\nPrecio: $[valor], negociable.\nEntrego en [barrio] o envío a domicilio.',
 arriendo:'Arriendo [casa, apartamento, local o habitación] en [barrio].\nIncluye: [habitaciones, baños, servicios].\nValor: $[valor] al mes.\nRequisitos: [depósito, fiador].',
 bcompra:'Busco comprar [qué].\nPreferiblemente [marca, tamaño o estado].\nPago hasta $[valor].',
 barriendo:'Busco en arriendo [casa, apartamento o habitación] en [barrio].\nPara [número] personas.\nPresupuesto: hasta $[valor] al mes.',
 oserv:'Ofrezco servicio de [qué haces].\nExperiencia: [años].\nAtiendo en [barrio] y a domicilio.\nPrecio: desde $[valor].',
 sserv:'Necesito a alguien que [qué necesitas].\nPara el [día] en [barrio].\nPago: $[valor] o a convenir.',
 permuto:'Cambio [qué tengo] por [qué busco].\nEstado: [cómo está].\nEn [barrio].',
 regalo:'Regalo [qué] en buen estado.\nPara recoger en [barrio].',
 comercial:'[Nombre del negocio]: [qué ofreces].\nPromoción: [descuento o novedad].\nDirección: [dónde]. Horario: [días y horas].'};
function op(){var o=$1('cm-op');return o?o.value:''}
function job(){return !!document.querySelector('#jobt:not(.jobman)')}
function pv(){var w=$1('jobt');if(!w)return;var t=w.querySelector('.jobpv');if(!t){w.insertAdjacentHTML('beforeend','<div class="jobpv"><b>Así se verá tu anuncio</b><h4 id="jpv-t"></h4><p id="jpv-x"></p><button type="button" class="btn ghost" data-jobman="1">Escribir la descripción a mano</button></div>');t=w.querySelector('.jobpv')}
 var a=$1('cm-t'),b=$1('cm-x');$1('jpv-t').textContent=a&&a.value?a.value:'Escribe el cargo o puesto para ver el título.';$1('jpv-x').textContent=b&&b.value?b.value:'';
 var it=$1('cm-it');if(it){if(PH0==null)PH0=it.placeholder;it.placeholder=op()==='bemp'?'BUSCO EMPLEO\nConductor con licencia C2\nDisponibilidad inmediata':'SE BUSCA\nAuxiliar de cocina\n$70.000 por día'}
 var bt=t.querySelector('[data-jobman]');if(bt)bt.textContent=w.classList.contains('jobman')?'Ocultar los campos de abajo':'Escribir la descripción a mano'}
function exBtn(){var x=$1('cm-x');if(!x)return;var b=document.querySelector('.cmex');if(!b){x.insertAdjacentHTML('afterend','<button type="button" class="btn ghost cmex" data-cmex="1">Usar un ejemplo de descripción</button>');b=document.querySelector('.cmex')}
 if(!$1('jobt')){var it=$1('cm-it');if(it&&PH0!=null){it.placeholder=PH0}}}
var pend=0;function tick(){pend=0;exBtn();if($1('jobt'))pv()}
new MutationObserver(function(){if(!pend){pend=1;setTimeout(tick,80)}}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('input',function(e){var id=e.target&&e.target.id;if(id==='cm-t'||id==='cm-x'||(e.target.closest&&e.target.closest('#jobt')))setTimeout(function(){if($1('jobt'))pv()},0)},true);
document.addEventListener('change',function(e){if(e.target&&(e.target.id==='cm-op'||e.target.id==='cm-cat'))setTimeout(tick,50)},true);
/* si falta algo de la plantilla, se dice qué (no «Escribe un título», que está oculto) */
function falta(){var w=$1('jobt');if(!w||!job())return '';if(!w.querySelector('[data-jobl][aria-pressed="true"]'))return op()==='bemp'?'Elige si buscas empleo formal o informal.':'Elige si el empleo es formal o informal.';
 var cg=$1('jb-cg');if(!cg||cg.value.trim().length<3)return op()==='bemp'?'Escribe el cargo u oficio que buscas.':'Escribe el cargo o puesto.';
 var fu=$1('jb-fu');if(fu&&!fu.value.trim())return op()==='bemp'?'Escribe qué sabes hacer.':'Escribe las funciones principales.';return ''}
addEventListener('click',async function(e){var t=e.target;if(!t.closest)return;var b;
 if((b=t.closest('[data-jobman]'))){e.preventDefault();var w=$1('jobt');if(w){w.classList.toggle('jobman');pv();if(w.classList.contains('jobman')){var l=document.querySelector('label[for="cm-t"]');if(l)l.scrollIntoView({block:'center'})}}return}
 if((b=t.closest('[data-cmex]'))){e.preventDefault();var x=$1('cm-x');if(!x)return;var ex=EX[op()]||EX.vendo;if(x.value.trim()&&!(await askC('¿Cambiar lo que escribiste por el ejemplo?','Cambiar')))return;
  x.value=ex.slice(0,x.maxLength||400);x.dispatchEvent(new Event('input',{bubbles:true}));x.focus();try{x.setSelectionRange(x.value.indexOf('['),x.value.indexOf(']')+1)}catch(z){}return}
 if((b=t.closest('[data-act="cmxNext"],[data-act="cmxSave"]'))){var m=falta();if(!m)return;e.preventDefault();e.stopImmediatePropagation();var er=$1('err');if(er)er.textContent=m;try{toast(m)}catch(z){}
  var f=$1(/formal/.test(m)?'jobt':/cargo|oficio/.test(m)?'jb-cg':'jb-fu');if(f)f.scrollIntoView({block:'center'})}},true);
})();
