/* v478: DISEÑO DE MUEBLERÍA. En la tienda de una mueblería (marca .qhmue-m, la pone v474 con window.qhMuebleCat de v473), cada
   producto con precio anterior lleva sobre la foto una etiqueta negra con el descuento («-41%»), calculado con el precio y el
   precio anterior que ya muestra la tarjeta. Los colores y la letra están en v478-muebleria-tienda.css.
   Solo mira la página (no guarda nada). Si algo falla, borra este bloque y su <style>. */
(function(){
var num=function(t){var d=String(t||'').replace(/[^\d]/g,'');return d?+d:0};
function poner(){if(!document.querySelector('.qhmue-m'))return;
 document.querySelectorAll('.pgrid .prod').forEach(function(p){var pic=p.querySelector('.pic'),pr=p.querySelector('.price'),old=pr&&pr.querySelector('.pold');
  if(!pic||!old||pic.querySelector('.qhmue-off'))return;
  var o=num(old.textContent),v=num(pr.textContent.replace(old.textContent,'')),off=o>v&&v>0?Math.round((1-v/o)*100):0;if(off<1)return;
  var b=document.createElement('span');b.className='qhmue-off';b.textContent='-'+off+'%';b.setAttribute('aria-label',off+'% de descuento');pic.appendChild(b)})}
/* clases del <body> para los estilos (body.qhmue, body.qhmue-mia): se ponen en el mismo instante del cambio, antes de dibujar */
function clases(){var m=document.querySelector('.qhmue-m'),b=document.body;if(!b)return;b.classList.toggle('qhmue',!!m);b.classList.toggle('qhmue-mia',!!(m&&m.hasAttribute('data-mia')))}
var pend=false;function luego(){clases();if(pend)return;pend=true;requestAnimationFrame(function(){pend=false;poner()})}
function inst(){var a=document.getElementById('app');if(!a)return false;new MutationObserver(luego).observe(a,{childList:true,subtree:true});luego();return true}
if(!inst())document.addEventListener('DOMContentLoaded',inst);
})();
