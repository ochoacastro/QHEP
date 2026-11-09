
/* v230: GUÍAS PASO A PASO. Centro de ayuda (Mi cuenta → "Ayuda y guías") y botón "¿Cómo se hace?" dentro de cada formulario.
   Las guías se abren con «Hazlo conmigo» (v248); las imágenes y su visor se quitaron (v366, v387). El administrador apaga todo el centro de ayuda
   (meta/site.help = false) o guías sueltas (meta/site.helpOff = ['id', ...]) en Administrar → Mis datos.
   Si algo falla, borra este <script id="v230-guias"> y el <style id="v230-guias-css">. */
var GUIDES=[
 {id:'cla',ic:'📢',t:'Publicar un clasificado',d:'Vender, arrendar, buscar o regalar algo',f:'#cm-op',s:[
  ['cla1','Elige qué vas a publicar','Toca «Publicar» y luego «Clasificado». Primero elige el tipo (Vendo, Arriendo, Busco…) y la categoría.'],
  ['cla2','Elige cómo se verá','Con foto (la que más llama la atención), solo texto con un color de fondo, o un video de YouTube o TikTok.'],
  ['cla3','Escribe tu anuncio','Pon un título claro, la descripción, el precio y el estado. Puedes subir varias fotos.'],
  ['cla4','Tus datos y cuánto dura','Revisa tu nombre y tu WhatsApp. El anuncio gratis dura 24 horas; con un plan dura 3, 7, 15 o 30 días.']]},
 {id:'cod',ic:'🔓',t:'Activar un rol con código',d:'Para publicar tiendas, servicios, inmuebles o noticias',f:'#cd-in',s:[
  ['cod1','Abre «Mis roles»','En «Mi cuenta» toca «Mis roles». Ahí ves los roles, cuánto cuestan y cómo pagarlos.'],
  ['cod2','Escribe tu código','Pega el código de 12 caracteres que te entregó el administrador y toca «Canjear código».'],
  ['cod3','Listo para publicar','El rol queda activo hasta la fecha que ves. En «¿Qué quieres publicar?» aparece lo que ya puedes publicar.']]},
 {id:'tie',ic:'🏪',t:'Crear tu tienda',d:'Tu negocio con catálogo, horario y ubicación',f:'#f-cats',s:[
  ['tie1','Nombre y tipo de negocio','Con el rol Tienda o Comerciante, toca «Publicar» y luego «Tienda». Elige si tiene nombre propio o es casero, y escribe el nombre.'],
  ['tie2','Elige tu categoría','Así te encuentran los vecinos. Están agrupadas: Comidas, Belleza, Moda, Tecnología y más.'],
  ['tie3','Tu horario','Elige los días y las horas. Si cambia según el día o cierras al mediodía, marca «El horario cambia según el día».'],
  ['tie4','Dirección y mapa','Escribe la dirección y, si quieres, el código de Google Maps para aparecer en el mapa de tiendas.']]},
 {id:'pro',ic:'🛍️',t:'Agregar productos',d:'Fotos, precio y descripción de lo que vendes',f:'#p-name',s:[
  ['pro1','Nuevo producto','Dentro de tu tienda toca «Agregar producto» y escribe el nombre.'],
  ['pro2','Precio, descripción y fotos','Pon el precio, una descripción corta y hasta 6 fotos. Los vecinos te piden por WhatsApp desde tu tienda.']]},
 {id:'ser',ic:'🛠️',t:'Ofrecer un servicio',d:'Plomería, electricidad, aseo, cuidado de personas…',f:'#v-job',s:[
  ['ser1','Elige tu oficio','Con el rol Servicios o Comerciante, toca «Publicar» y luego «Servicio». Elige tu oficio de la lista.'],
  ['ser2','Cuenta tu experiencia','Describe qué haces, tus años de experiencia, tu tarifa y tus horarios.'],
  ['ser3','Tu WhatsApp','Escribe tu número para que te contacten y toca «Publicar servicio».']]},
 {id:'inm',ic:'🏠',t:'Publicar inmueble o vehículo',d:'Arriendo, venta de casa, carro o moto',f:'#a-owner',s:[
  ['inm1','Título del anuncio','Con el rol Casa, Automóvil o Comerciante, toca «Publicar» y elige Inmuebles o Vehículos. Escribe un título claro.'],
  ['inm2','Los detalles y las fotos','Completa los datos (precio, habitaciones, estrato o kilometraje) y sube hasta 5 fotos.'],
  ['inm3','Publica','Revisa tu nombre y tu WhatsApp y toca «Publicar».']]},
 {id:'not',ic:'📰',t:'Redactar una noticia',d:'Para quienes tienen el rol Redactor de noticias',f:'#nw-t',s:[
  ['not1','El título','Con el rol Redactor de noticias, toca «Publicar» y luego «Noticia». Escribe un título corto y claro.'],
  ['not2','El texto','Cuenta qué pasó, cuándo y dónde. Usa frases cortas.'],
  ['not3','Foto o video','Agrega una imagen de portada o el enlace de un video y publica.']]},
 {id:'ins',ic:'📱',t:'Instalar la app en el celular',d:'Un acceso directo en tu pantalla de inicio',f:'',s:[
  ['ins1','En Android','Cuando aparezca «Instala Mi Pradera», toca «Instalar». También puedes hacerlo desde el menú de Chrome → «Instalar app».'],
  ['ins2','En iPhone','Abre la página en Safari, toca el botón Compartir y luego «Agregar a inicio».']]}];
function helpSite(){try{return (typeof site==='function'?site():(S&&S.site))||{}}catch(e){return {}}}
function helpOn(){return helpSite().help!==false}
function guideOn(g){var off=helpSite().helpOff;return helpOn()&&!(Array.isArray(off)&&off.indexOf(g.id)>-1)}
function helpOpen(){var l=GUIDES.filter(function(g){return guideOn(g)&&g.id!=='ins'})/* v366: sin guías de fotos */;try{modal('<h2>Ayuda y guías</h2><p class="muted">Elige qué quieres aprender. Cada guía te acompaña paso a paso en la página.</p><div class="qhl">'+
 l.map(function(g){return '<button type="button" data-guide="'+g.id+'"><i>'+g.ic+'</i><span><b>'+g.t+'</b><small>'+g.d+'</small></span></button>'}).join('')+
 '</div><div class="row" style="margin-top:12px"><button class="btn ghost" data-act="close">Cerrar</button></div>')}catch(e){}}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-act="helpOpen"]');if(!b)return;e.preventDefault();e.stopPropagation();
 try{if(document.querySelector('.overlay')&&typeof closeModal==='function')closeModal(1)}catch(x){}setTimeout(helpOpen,150)},true);/* v387: cada guía la abre «Hazlo conmigo» (v248); se quitó el visor de guías con fotos */
/* botón "¿Cómo se hace?" arriba de cada formulario que tiene guía */
(function(){var pend=false;function put(){pend=false;if(!helpOn())return;GUIDES.forEach(function(g){if(!g.f||!guideOn(g))return;var f=document.querySelector(g.f);if(!f)return;
  var box=f.closest('.modal')||f.closest('.overlay')||f.closest('.cg')||f.parentNode;if(!box||box.querySelector('.qhelp[data-guide="'+g.id+'"]'))return;
  var h=box.querySelector('h2')||box.firstElementChild;var bt=document.createElement('button');bt.type='button';bt.className='qhelp';bt.dataset.guide=g.id;bt.innerHTML='<b aria-hidden="true">?</b>¿Cómo se hace?';
  if(h&&h.tagName==='H2')h.insertAdjacentElement('afterend',bt);else box.insertAdjacentElement('afterbegin',bt)})}
 new MutationObserver(function(){if(!pend){pend=true;(window.requestAnimationFrame||setTimeout)(put)}}).observe(document.documentElement,{childList:true,subtree:true})})();
/* tarjeta en Administrar → Mis datos (debajo del tutorial) */
function helpAdmHTML(){var s=helpSite(),off=Array.isArray(s.helpOff)?s.helpOff:[];
 return '<div class="cg" style="margin-top:14px"><h3>Guías paso a paso</h3><p class="muted">Guías que acompañan paso a paso en la página para publicar un clasificado, crear una tienda, redactar noticias y más. Se abren desde Mi cuenta → «Ayuda y guías» y desde el botón «¿Cómo se hace?» de cada formulario.</p>'+
 '<label class="chk"><input type="checkbox" id="help-on"'+(helpOn()?' checked':'')+'> Mostrar el centro de ayuda y los botones «¿Cómo se hace?»</label><div class="qhg">'+
 GUIDES.filter(function(g){return g.id!=='ins'}).map(function(g){return '<div class="catrow" style="align-items:center"><label class="chk" style="flex:1;margin:0"><input type="checkbox" data-helpg="'+g.id+'"'+(off.indexOf(g.id)<0?' checked':'')+'> '+g.t+'</label></div>'}).join('')/* v366: sin «Ver» (abría las fotos) */+'</div></div>'}
document.addEventListener('change',function(e){var t=e.target;if(!t)return;try{
 if(t.id==='help-on'){S.site=Object.assign({},S.site,{help:!!t.checked});save();toast(t.checked?'Centro de ayuda activado':'Centro de ayuda oculto')}
 else if(t.dataset&&t.dataset.helpg){var off=(Array.isArray((S.site||{}).helpOff)?S.site.helpOff:[]).filter(function(x){return x!==t.dataset.helpg});if(!t.checked)off.push(t.dataset.helpg);S.site=Object.assign({},S.site,{helpOff:off});save();toast(t.checked?'Guía visible':'Guía oculta')}}catch(x){}});
