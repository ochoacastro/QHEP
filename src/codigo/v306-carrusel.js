
/* v306: en el inicio, el aviso de registro gratis pasa a un carrusel con dos anuncios más:
   arrendar o vender una casa (Inmuebles) y vender una moto o un carro (Vehículos). Se desliza con el dedo,
   con los puntos de abajo, y avanza solo cada 7 segundos (se detiene al tocarlo o si el teléfono pide menos movimiento). */
(function(){
var IH='<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
var IV='<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>';
var li=function(t){return typeof qli==='function'?qli(t):'<li>'+t+'</li>'};
function slide(cls,lbl,ic,tag,h,p,items,act,v,btn,tab,more){return '<section class="bzc '+cls+'" aria-roledescription="anuncio" aria-label="'+lbl+'"><div class="bzi" aria-hidden="true">'+ic+'</div><div class="bzt"><em>'+tag+'</em><h3>'+h+'</h3><p>'+p+'</p><ul>'+items.map(li).join('')+'</ul><div class="bzr"><button type="button" class="btn bzb" data-act="'+act+'" data-v="'+v+'">'+btn+'</button><button type="button" class="btn bzl" data-act="tab" data-v="'+tab+'">'+more+'</button></div></div></section>'}
window.hubCar=function(){
 var L=[];var b='',g='';try{b=bizCta()}catch(e){}
 /* v311: el aviso verde «Registra tu negocio gratis» va siempre (antes solo salía sin cuenta o sin tienda) */
 try{g=bizCta('none')}catch(e){}/* v389: antes reemplazaba bizSt un momento */
 if(g)L.push(g);if(b&&b!==g)L.push(b);
 var pc='';try{pc=typeof pubCta==='function'?pubCta():''}catch(e){}/* v386: el aviso azul «Publica tu anuncio gratis» (el mismo de Notificaciones) va de primero */
 if(pc)L.unshift(pc);else L.push(slide('bzk','Publica un anuncio en los clasificados',(typeof hubIc!=='undefined'&&hubIc.mega?'<svg class="qi" viewBox="0 0 24 24" aria-hidden="true">'+hubIc.mega+'</svg>':''),'GRATIS','¿Quieres publicar un anuncio en los clasificados?','Vende, compra o avisa algo a tus vecinos de Pradera.',['1 anuncio gratis al día que dura 24 horas','Con fotos, precio y tu WhatsApp','Celulares, muebles, ropa, empleo y más'],'cmxNew','','Publicar mi anuncio','com','Ver clasificados'));/* v307 */
 L.push(slide('bzh','Arrienda o vende tu casa',IH,'INMUEBLES','¿Quieres arrendar o vender tu casa?','Publícala en Mi Pradera y que tus vecinos la vean.',['Fotos, precio y ubicación en el mapa','Te escriben directo a tu WhatsApp','Casas, apartamentos, locales y lotes'],'gdPub','inm','Publicar mi inmueble','arr','Ver inmuebles'));
 L.push(slide('bzv','Vende tu moto o carro',IV,'VEHÍCULOS','¿Vendes tu moto o tu carro?','Publícalo y llega a los compradores de Pradera.',['Fotos, precio, modelo y kilometraje','Te escriben directo a tu WhatsApp','Motos, carros, camionetas y más'],'gdPub','veh','Publicar mi vehículo','veh','Ver vehículos'));
 var d='';for(var i=0;i<L.length;i++)d+='<button type="button" data-bzdot="'+i+'" aria-label="Anuncio '+(i+1)+' de '+L.length+'"'+(i?'':' aria-current="true"')+'></button>';
 return '<div class="bzcar" aria-roledescription="carrusel" aria-label="Anuncios de Mi Pradera"><div class="bzcs" tabindex="0">'+L.join('')+'</div>'+(L.length>1?'<div class="bzcd">'+d+'</div>':'')+'</div>'};
function idx(s){return Math.round(s.scrollLeft/Math.max(1,s.clientWidth))}
function dots(s){var c=s.parentNode.querySelector('.bzcd');if(!c)return;var k=idx(s),l=c.children;for(var i=0;i<l.length;i++)l[i].setAttribute('aria-current',i===k?'true':'false')}
function go(s,k){var n=s.children.length;if(!n)return;k=(k+n)%n;s.scrollTo({left:k*s.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
var hold=0;function stop(){hold=Date.now()+20000}
document.addEventListener('scroll',function(e){var s=e.target;if(s&&s.classList&&s.classList.contains('bzcs'))dots(s)},true);
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-bzdot]');if(!b)return;stop();var s=b.closest('.bzcar').querySelector('.bzcs');go(s,+b.dataset.bzdot)});
['pointerdown','touchstart','focusin'].forEach(function(t){document.addEventListener(t,function(e){if(e.target.closest&&e.target.closest('.bzcar'))stop()},{passive:true})});
setInterval(function(){if(Date.now()<hold||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var s=document.querySelector('.bzcs');if(!s||s.matches(':hover')||s.children.length<2)return;var r=s.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;go(s,idx(s)+1)},7000);
})();
