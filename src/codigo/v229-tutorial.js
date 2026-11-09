
/* v229: TUTORIAL DE BIENVENIDA. Se muestra una vez la primera vez que alguien inicia sesion (por persona y por celular).
   Se puede volver a ver en Mi cuenta → "Ver tutorial". El administrador lo activa o lo apaga en Administrar → Mis datos
   (se guarda en meta/site como "tour": false para apagarlo). Las imagenes estan en la carpeta tour/ (paso1.webp ... paso6.webp).
   Si algo falla, borra este <script id="v229-tutorial">, el <style id="v229-tutorial-css">, ${tourAdmHTML()} de Mis datos y
   el renglon "Ver tutorial" de pnlMenu. */
var TOUR=[
 ['tour/paso1.webp','Busca lo que necesitas','Escribe lo que buscas, por ejemplo pan, plomero o arriendo, y encuentra a tus vecinos de Pradera.'],
 ['tour/paso2.webp','Explora por categorías','Tiendas, comidas, peluquerías, servicios, vehículos, inmuebles y más, a un toque.'],
 ['tour/paso3.webp','Clasificados de tus vecinos','Desliza las fotos con el dedo para verlas todas. Debajo puedes decir si el anuncio te sirvió y dejar un comentario.'],
 ['tour/paso4.webp','Habla directo con el vendedor','Escríbele por WhatsApp, sin intermediarios ni comisiones.'],
 ['tour/paso5.webp','Publica gratis','Toca «Publicar» para poner un clasificado (uno gratis cada día) o registrar tu negocio.'],
 ['tour/paso6.webp','Todo lo tuyo en Mi cuenta','Ahí ves tus publicaciones. El número azul te dice cuántas puedes publicar hoy o cuántos días te quedan.']];
function tourOn(){return false/* v366: se quitó el tutorial de bienvenida con fotos */}
function tourKey(){try{var k=(typeof QH==='object'&&QH.key&&QH.key())||(S&&S.user&&(S.user.email||S.user.wa))||'';return k?'qh_tour_'+k:''}catch(e){return ''}}
function tourOpen(L,title){if(document.querySelector('.qtour'))return;/* v230: tambien muestra las guias (L = lista de pasos) */L=Array.isArray(L)?L:TOUR;var isT=L===TOUR,i=0,n=L.length,last=document.activeElement;
 var ov=document.createElement('div');ov.className='qtour';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label',title||'Tutorial de Mi Pradera');
 ov.innerHTML='<div class="qtour-in"><div class="qtour-hd"><span class="qtour-n"></span><button type="button" class="qtour-skip">'+(isT?'Saltar':'Cerrar')+'</button></div><div style="overflow:hidden"><div class="qtour-tr">'+
  L.map(function(t,k){return '<div class="qtour-s" aria-hidden="'+(k?'true':'false')+'"><div class="im"><img src="'+t[0]+'" alt="" '+(k>1?'loading="lazy"':'')+'></div><h2>'+t[1]+'</h2><p>'+t[2]+'</p>'+(isT&&k===n-1&&typeof helpOn==='function'&&helpOn()?'<button type="button" class="qtour-more">Ver guías paso a paso</button>':'')+'</div>'}).join('')+
  '</div></div><div class="qtour-dots" aria-hidden="true">'+L.map(function(){return '<i></i>'}).join('')+'</div><div class="qtour-ft"><button type="button" class="btn ghost qtour-prev">Atrás</button><button type="button" class="btn qtour-next">'+(n>1?'Siguiente':'Entendido')+'</button></div></div>';
 document.body.appendChild(ov);var tr=ov.querySelector('.qtour-tr'),dots=ov.querySelectorAll('.qtour-dots i'),sl=ov.querySelectorAll('.qtour-s'),prev=ov.querySelector('.qtour-prev'),next=ov.querySelector('.qtour-next'),num=ov.querySelector('.qtour-n');
 function go(k){i=Math.max(0,Math.min(n-1,k));tr.style.transform='translateX('+(-100*i)+'%)';for(var j=0;j<n;j++){dots[j].classList.toggle('on',j===i);sl[j].setAttribute('aria-hidden',j===i?'false':'true')}
  num.textContent=(title&&!isT?title+' · ':'')+(i+1)+' de '+n;prev.style.visibility=i?'visible':'hidden';next.textContent=i===n-1?(isT?'Empezar':'Entendido'):'Siguiente'}
 function done(){var k=tourKey();try{if(k&&isT)localStorage.setItem(k,'1')}catch(e){}ov.remove();document.removeEventListener('keydown',kd,true);try{last&&last.focus&&last.focus()}catch(e){}}
 function kd(e){if(e.key==='Escape'){e.preventDefault();done()}else if(e.key==='ArrowRight')go(i+1);else if(e.key==='ArrowLeft')go(i-1)}
 var more=ov.querySelector('.qtour-more');if(more)more.onclick=function(){done();setTimeout(function(){try{helpOpen()}catch(e){}},150)};
 ov.querySelector('.qtour-skip').onclick=done;prev.onclick=function(){go(i-1)};next.onclick=function(){if(i===n-1)done();else go(i+1)};
 var x0=null;tr.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});tr.addEventListener('touchend',function(e){if(x0==null)return;var d=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(d)>45)go(i+(d<0?1:-1))},{passive:true});
 document.addEventListener('keydown',kd,true);go(0);try{next.focus()}catch(e){}}
/* tarjeta en Administrar → Mis datos */
function tourAdmHTML(){return typeof helpAdmHTML==='function'?helpAdmHTML():''/* v366: sin tarjeta del tutorial con fotos */}
function tourAdmOld(){return '<div class="cg" style="margin-top:14px"><h3>Tutorial de bienvenida</h3><p class="muted">Una guía corta de 6 pasos con imágenes que aparece la primera vez que alguien inicia sesión. También se puede volver a ver desde Mi cuenta → «Ayuda y guías».</p>'+
 '<label class="chk"><input type="checkbox" id="tour-on"'+(tourOn()?' checked':'')+'> Mostrar el tutorial a los usuarios la primera vez que inician sesión</label>'+
 '<div class="row" style="margin-top:10px"><button type="button" class="btn ghost" data-act="tourOpen">Ver el tutorial</button></div></div>'+(typeof helpAdmHTML==='function'?helpAdmHTML():'')}
document.addEventListener('change',function(e){if(!e.target||e.target.id!=='tour-on')return;try{S.site=Object.assign({},S.site,{tour:!!e.target.checked});save();toast(e.target.checked?'El tutorial se mostrará a los usuarios nuevos':'El tutorial ya no se mostrará automáticamente')}catch(x){}});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-act="tourOpen"]');if(!b)return;e.preventDefault();e.stopPropagation();try{if(document.querySelector('.overlay')&&typeof closeModal==='function')closeModal(1)}catch(x){}setTimeout(tourOpen,150)},true);
/* se abre solo una vez, cuando la persona ya inicio sesion y no hay otra ventana abierta */
(function(){var shown=false;setInterval(function(){try{if(shown||(typeof MODE!=='undefined'&&MODE==='admin')||!S||!S.user||!tourOn())return;try{if(localStorage.getItem('qh_pend_order')||sessionStorage.getItem('qh_buying'))return}catch(x){}/* v363: el recorrido no tapa una compra; sale en la próxima visita */var k=tourKey();if(!k)return;
 if(localStorage.getItem(k)){shown=true;return}if(document.querySelector('.overlay,.qtour,.qhb'))return;shown=true;setTimeout(tourOpen,800)}catch(e){}},2000)})();
