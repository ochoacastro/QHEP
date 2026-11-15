
/* v426: PÁGINA «ROLES Y PRECIOS» (#/roles). Cualquier visitante, tenga cuenta o no, puede ver qué ofrece cada rol y cuánto
   cuesta, sin registrarse: lo que es gratis con la cuenta, Comerciante, Vendedor de inmuebles, Vendedor de vehículos,
   Clasificados, Comunidad y Redactor de noticias. Antes los precios solo se veían después de entrar (ventana «Roles»).
   Se ve un rol a la vez, con una barra de roles, flechas y botones «Anterior» / «Siguiente» para pasar de uno a otro.
   Es solo para mirar: no vende nada. Abajo ofrece «Crear mi cuenta gratis» (o «Activar un rol» a quien ya tiene cuenta).
   Los precios salen de los mismos datos que la ventana «Roles» (codePrice, comPrice, promoción): si el administrador los
   cambia en el panel, aquí cambian solos.
   Se llega desde: el pie de la página («Roles y precios»), el aviso de «Para publicar necesitas una cuenta» (v425) y el
   enlace mipradera.com.co/#/roles.
   Enganches fuera de este archivo: la ruta y el dibujo de la vista «roles» (12-s.js y 13-af.js) y el enlace del pie (html/04.html).
   Para quitarla: borra este archivo y su CSS de src/orden.json y el enlace del pie. */
(function(){
var I=function(d){return '<svg class="rlpi" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};
var IC={free:I('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
 merc:I('<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M9 20v-6h6v6"/>'),
 home:I('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
 car:I('<path d="M5 16l1.5-6h11L19 16"/><rect x="3" y="12" width="18" height="6"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/>'),
 com:I('<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>'),
 comu:I('<circle cx="8" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M2 20a6 6 0 0 1 12 0M14 20a5 5 0 0 1 8 0"/>'),
 news:I('<rect x="3" y="4" width="15" height="16"/><path d="M18 8h3v10a2 2 0 0 1-2 2H6"/><path d="M7 8h7M7 12h7M7 16h4"/>')};
var ok='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
function li(l){return '<ul class="rlpl">'+l.map(function(x){return '<li>'+ok+'<span>'+x+'</span></li>'}).join('')+'</ul>'}
function precio(u,m){try{return cpHTML(u,m)}catch(e){return ''}}
/* tabla de un rol con dos tamaños (uno / varios) */
function tabla(u,a,b){var ms=[];try{ms=codeMs(u)}catch(e){}
 return '<div class="rlpw"><table class="rlpt"><thead><tr><th scope="col">Duración</th><th scope="col">'+a+'</th><th scope="col">'+b+'</th></tr></thead><tbody>'+
  ms.map(function(m){return '<tr><th scope="row">'+codeMn(m)+'</th><td>'+precio(u+'1',m)+'</td><td>'+precio(u,m)+'</td></tr>'}).join('')+'</tbody></table></div>'}
/* NAVEGACIÓN: se ve un rol a la vez. Arriba, una barra con todos los roles (con flechas para correrla); debajo de cada rol,
   «Anterior» y «Siguiente». Así la página no mide siete pantallas. */
var ORD=['free','merc','home','car','com','comu','news'],NOM={free:'Gratis',merc:'Comerciante',home:'Inmuebles',car:'Vehículos',com:'Clasificados',comu:'Comunidad',news:'Noticias'},cur=0;
var FL={l:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
 r:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>'};
function barra(){return '<div class="rlpb"><button type="button" class="rlpf" data-rlp="izq" aria-label="Ver los roles anteriores">'+FL.l+'</button><div class="rlps" role="tablist" aria-label="Roles">'+
 ORD.map(function(k,i){return '<button type="button" role="tab" class="rlpk" data-rlp="'+i+'" aria-selected="'+(i===cur)+'">'+NOM[k]+'</button>'}).join('')+'</div><button type="button" class="rlpf" data-rlp="der" aria-label="Ver más roles">'+FL.r+'</button></div>'}
function pasos(i){var a=i>0,b=i<ORD.length-1;
 return '<div class="rlpv"><button type="button" class="btn ghost" data-rlp="'+(i-1)+'"'+(a?'':' disabled')+'>'+FL.l+'<span>'+(a?NOM[ORD[i-1]]:'Anterior')+'</span></button><span class="rlpx">'+(i+1)+' de '+ORD.length+'</span><button type="button" class="btn ghost" data-rlp="'+(i+1)+'"'+(b?'':' disabled')+'><span>'+(b?NOM[ORD[i+1]]:'Siguiente')+'</span>'+FL.r+'</button></div>'}
function flechas(){var s=document.querySelector('.rlps');if(!s)return;var f=document.querySelectorAll('.rlpb .rlpf');if(f[0])f[0].disabled=s.scrollLeft<=2;if(f[1])f[1].disabled=s.scrollLeft+s.clientWidth>=s.scrollWidth-2}
function ir(i,sube){i=Math.max(0,Math.min(ORD.length-1,i));cur=i;
 [].forEach.call(document.querySelectorAll('.rlp .rlpc'),function(c){c.hidden=c.dataset.rol!==ORD[i]});
 [].forEach.call(document.querySelectorAll('.rlps .rlpk'),function(b,j){b.setAttribute('aria-selected',String(j===i));if(j===i){var s=b.parentNode;s.scrollLeft=b.offsetLeft-(s.clientWidth-b.offsetWidth)/2}});
 flechas();if(sube){var p=document.querySelector('.rlp .rlpb');if(p)p.scrollIntoView({block:'start',behavior:'smooth'})}}
window.qhRolIr=function(k){var i=typeof k==='number'?k:ORD.indexOf(k);if(i>=0)ir(i)};
document.addEventListener('scroll',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('rlps'))flechas()},true);
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-rlp]');if(!b)return;e.preventDefault();var v=b.dataset.rlp,s=document.querySelector('.rlps');
 if(v==='izq'||v==='der'){if(s)s.scrollBy({left:(v==='izq'?-1:1)*s.clientWidth*.7,behavior:'smooth'});return}
 ir(+v,!b.classList.contains('rlpk'))},true);
function card(k,t,d,body){var i=ORD.indexOf(k);return '<section class="rlpc" data-rol="'+k+'"'+(i===cur?'':' hidden')+'><h3>'+IC[k]+'<span>'+t+'</span></h3><p class="rlpd">'+d+'</p>'+body+pasos(i)+'</section>'}
window.rolesPubView=function(){setTimeout(flechas,0);var u=null,pr=null,nota='';try{u=S.user}catch(e){}try{pr=promoOn()}catch(e){}try{nota=payNote(0)}catch(e){nota='Pago único. No se renueva solo.'}
 var cta=u?'<button type="button" class="btn pink" data-act="codesModal">Activar un rol</button>'
  :'<button type="button" class="btn pink" data-act="regForm">Crear mi cuenta gratis</button><button type="button" class="btn ghost" data-act="loginForm">Ya tengo cuenta</button>';
 var cl='';try{cl='<div class="rlpw"><table class="rlpt"><thead><tr><th scope="col">Plan</th><th scope="col">Qué incluye</th><th scope="col">Precio</th></tr></thead><tbody><tr><th scope="row">Gratis</th><td>1 anuncio al día, dura 24 horas</td><td>Gratis</td></tr>'+
  COM_USES.map(function(c){return '<tr><th scope="row">'+esc(COMU[c].n)+'</th><td>'+COM_DAYS[c]+' anuncios al día durante '+COM_DAYS[c]+' días</td><td>'+money(comPrice(c))+'</td></tr>'}).join('')+'</tbody></table></div>'}catch(e){}
 return '<div class="rlp"><div class="hubbar"><button class="btn ghost" data-act="hubHome">← Inicio</button></div>'+
  '<div class="shead"><div><h2>Roles y precios</h2><p class="muted">Mira qué puedes publicar en Mi Pradera, qué ofrece cada rol y cuánto cuesta. Para publicar necesitas una cuenta; crearla es gratis.</p></div></div>'+
  barra()+(pr?'<p class="rlpp"><b>Promoción:</b> '+pr.pct+'% de descuento en los roles pagados hasta el '+new Date(pr.until).toLocaleDateString('es-CO')+'.</p>':'')+
  card('free','Gratis con tu cuenta','No necesitas ningún rol para esto.',li(['Registrar tu negocio: nombre, logo, dirección, teléfono, descripción y 3 fotos del lugar','Publicar 1 clasificado al día, que dura 24 horas','Calificar tiendas, productos y servicios']))+
  card('merc','Comerciante','Para vender con tu tienda: productos con fotos y precios, y más.',li(['Tienda con productos, fotos y precios','Comidas, peluquería y servicios','Inmuebles y vehículos incluidos','Hasta 10 fotos del lugar y un video','Con «Varios negocios» por 6 meses o más: tu tienda sale destacada'])+tabla('merc','Un negocio','Varios negocios')+'<p class="rlpn">Un negocio: 1 tienda con productos, 1 servicio, 1 inmueble y 1 vehículo. Varios negocios: sin límite.</p>')+
  card('home','Vendedor de inmuebles','Para arrendar o vender casa, apartamento, habitación, local o lote.',li(['Anuncio con fotos, precio y ubicación en el mapa','Un inmueble: para el dueño de una sola propiedad (uno a la vez)','Varios inmuebles: inmobiliarias y dueños de varias propiedades, sin límite'])+tabla('home','Un inmueble','Varios inmuebles'))+
  card('car','Vendedor de vehículos','Para vender carro, moto, bicicleta u otro vehículo.',li(['Anuncio con fotos y precio','Un vehículo: para quien vende su carro o su moto (uno a la vez)','Varios vehículos: concesionarios y negocios de vehículos, sin límite'])+tabla('car','Un vehículo','Varios vehículos'))+
  card('com','Clasificados','Anuncios de vecinos: ventas, empleos, servicios y más.',li(['Con foto, texto o video','Tu WhatsApp para que te escriban'])+cl)+
  card('comu','Comunidad','Para juntas de acción comunal, iglesias, fundaciones, bomberos y otras organizaciones.',li(['Avisos comunitarios sin límite en Clasificados','Dura 1 año'])+'<p class="rlpg">Gratis</p>')+
  card('news','Redactor de noticias','Para quienes escriben las noticias de Pradera.',li(['Publica noticias con foto y video','Dura 1 año'])+'<p class="rlpg">Gratis</p>')+
  '<p class="rlpn">'+esc(nota)+' Los precios están en pesos colombianos.</p>'+
  '<div class="rlpa"><b>'+(u?'Ya tienes cuenta: activa el rol que necesites.':'¿Listo para publicar?')+'</b><div class="row">'+cta+'</div></div></div>'};
window.qhRoles=function(){try{closeModal(1)}catch(e){}cur=0;view='roles';render();scrollTo(0,0)};
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-rolv]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();qhRoles()},true);
})();
