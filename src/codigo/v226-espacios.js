
/* v226: ESPACIOS PUBLICITARIOS.
   AD_SLOTS es la lista de todos los espacios con su tamaño. Los banners de cada espacio se guardan como siempre en "topAds",
   con k = clave del espacio (las claves nuevas: feed-com, feed-shop, foot). No requiere cambiar las reglas de Firestore.
   - Entre clasificados: una imagen cada 6 anuncios. - Entre tiendas: una cada 8 tiendas. - Antes del pie: en todas las paginas.
   - Con ?verads=1 en la direccion, la pagina marca dónde van los espacios (aunque esten vacios) y su tamaño.
   Si algo falla, borra este <script id="v226-espacios"> y el <style id="v226-espacios-css">; y en tbBlock / tb-file vuelve a
   "Medida ideal: 1200×400 px (proporción 3:1)" y a cropImg(fs[k],2,...); y quita ${adMapHTML()} de la pestaña Publicidad. */
var AD_SLOTS=[
 {k:'',n:'Banner superior del inicio',d:'Arriba de la página principal; pasa solo cada pocos segundos. Las secciones sin banner propio usan este.',w:1200,h:600,f:'Banner grande (en celular se ve como 360×180)'},
 {k:'super',n:'Banner superior de Tiendas y abarrotes',d:'Arriba de esa sección.',w:1200,h:600,f:'Banner grande'},
 {k:'tiendas',n:'Banner superior de Tiendas',d:'Arriba de esa sección.',w:1200,h:600,f:'Banner grande'},
 {k:'veh',n:'Banner superior de Vehículos',d:'Arriba de esa sección.',w:1200,h:600,f:'Banner grande'},
 {k:'arr',n:'Banner superior de Inmuebles',d:'Arriba de esa sección.',w:1200,h:600,f:'Banner grande'},
 {k:'serv',n:'Banner superior de Servicios',d:'Arriba de esa sección.',w:1200,h:600,f:'Banner grande'},
 {k:'#bn',n:'Carrusel del medio de la portada',d:'En la mitad de la página principal.',w:1000,h:1000,f:'Cuadrado (como una publicación de Instagram)'},
 {k:'feed-com',n:'Entre los clasificados',d:'Aparece cada 6 anuncios en Clasificados, con el mismo ancho de un anuncio.',w:1000,h:1000,f:'Anuncio nativo en la lista (in-feed)',every:6,nw:1},
 {k:'feed-shop',n:'Entre las tiendas',d:'Aparece cada 8 tiendas en las listas de tiendas, ocupando toda la fila.',w:1200,h:400,f:'Banner horizontal en la lista',every:8,nw:1},
 {k:'foot',n:'Antes del pie de página',d:'Al final de todas las páginas, justo antes de los enlaces legales.',w:1200,h:300,f:'Leaderboard (equivale a 728×90 en computador y 320×80 en celular)',nw:1},
 {k:'#pop',n:'Ventana emergente al entrar',d:'Se abre una vez por visita en la página principal.',w:1080,h:1350,f:'Intersticial (casi toda la pantalla del celular)'}];
function adSlot(k){for(var i=0;i<AD_SLOTS.length;i++)if(AD_SLOTS[i].k===(k||''))return AD_SLOTS[i];return AD_SLOTS[0]}
function adRatio(k){var s=adSlot(k);return s.w/s.h}
function adGcd(a,b){return b?adGcd(b,a%b):a}
function adSizeTxt(k){var s=adSlot(k),g=adGcd(s.w,s.h);return s.w+'×'+s.h+' px (proporción '+(s.w/g)+':'+(s.h/g)+')'}
function adList(k){try{return (S.topAds||[]).filter(function(b){return (b.k||'')===k&&b.img})}catch(e){return []}}
function adCount(k){try{if(k==='#bn')return (S.banners||[]).length;if(k==='#pop')return (S.site&&S.site.pop&&S.site.pop.img&&S.site.pop.on!==false)?1:0}catch(e){}return adList(k).length}
/* tarjeta "Mapa de espacios publicitarios" para Administrar → Publicidad */
function adMapHTML(){var E=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
 return '<div class="cg"><h3>Mapa de espacios publicitarios</h3><p class="muted">Estos son todos los lugares donde puedes vender publicidad, con el tamaño exacto que debe tener la imagen. Si la imagen no tiene esa proporción, al subirla podrás ajustar el recorte.</p><div class="adsmap">'+
 AD_SLOTS.map(function(s){var g=adGcd(s.w,s.h),c=adCount(s.k),max=s.k==='#pop'?1:s.k==='#bn'?6:5;
  return '<div class="ar"><div class="ab" style="aspect-ratio:'+s.w+'/'+s.h+'">'+(s.w/g)+':'+(s.h/g)+'</div><div><b>'+E(s.n)+(s.nw?' · nuevo':'')+'</b><small>'+E(s.d)+'</small><small><span class="an">'+s.w+'×'+s.h+' px</span> · '+E(s.f)+'</small><small>'+(c?c+' de '+max+' imágenes activas':'Disponible (sin publicidad)')+'</small></div></div>'}).join('')+
 '</div><p style="margin:12px 0 0"><a class="btn ghost" href="./?verads=1" target="_blank" rel="noopener">Ver dónde están en la página</a></p>'+
 '<h3 style="margin-top:16px">Cómo se maneja</h3><ol class="adhow"><li><b>Vende por tiempo:</b> en una página local lo más sencillo es cobrar una tarifa fija por semana o por mes en cada espacio (los espacios de arriba y la ventana emergente son los más vistos y los más caros).</li><li><b>Pide la imagen en el tamaño indicado</b> (o hazla tú en Canva con esa medida). Que el texto importante quede en el centro.</li><li><b>Súbela en el espacio que compraron</b> (más abajo en esta pestaña) y pon el enlace: su WhatsApp (https://wa.me/57…), su página o su tienda en Mi Pradera.</li><li><b>Quítala cuando venza</b> el tiempo pagado. Cada espacio admite varias imágenes que se turnan.</li><li>Toda la publicidad lleva la etiqueta <b>«Publicidad»</b>, para que los vecinos la distingan de los anuncios normales.</li></ol></div>'}
/* dibuja los espacios nuevos en la pagina */
(function(){
var SHOW=/[?&]verads=1/.test(location.search),cnt={};
function slotHTML(k,i,wide){var s=adSlot(k),l=adList(k);
 if(!l.length)return SHOW?'<div class="adslot ph'+(wide?' wide':'')+'" data-adk="'+k+'" style="aspect-ratio:'+s.w+'/'+s.h+'"><b>Espacio publicitario: '+s.n+'</b><span>'+adSizeTxt(k)+'</span></div>':'';
 var b=l[i%l.length],u=typeof bnUrl==='function'?bnUrl(b.url):'',im='<img src="'+b.img+'" alt="Publicidad" loading="lazy" style="aspect-ratio:'+s.w+'/'+s.h+';object-fit:cover"><span class="adl">Publicidad</span>';
 return u?'<a class="adslot'+(wide?' wide':'')+'" data-adk="'+k+'" href="'+u.replace(/"/g,'&quot;')+'" target="_blank" rel="noopener noreferrer sponsored">'+im+'</a>':'<div class="adslot'+(wide?' wide':'')+'" data-adk="'+k+'">'+im+'</div>'}
function put(after,html){if(!html)return;var t=document.createElement('template');t.innerHTML=html;var n=t.content.firstChild;n.dataset.adx='1';after.insertAdjacentElement('afterend',n)}
function feed(){
 /* clasificados: cada 6 tarjetas, en cada lista (no en la vista previa del asistente) */
 var seen=new Set();document.querySelectorAll('article.cmc[data-cid]').forEach(function(a){var p=a.parentNode;if(!p||seen.has(p)||a.closest('.cwz-card'))return;seen.add(p);
  if(p.querySelector(':scope>[data-adk="feed-com"]'))return;var l=[].slice.call(p.querySelectorAll(':scope>article.cmc[data-cid]')),ev=adSlot('feed-com').every,j=0;
  for(var i=ev-1;i<l.length;i+=ev){put(l[i],slotHTML('feed-com',j++))}
  if(SHOW&&l.length&&l.length<ev)put(l[l.length-1],slotHTML('feed-com',0))});
 /* tiendas: cada 8 en la cuadricula */
 var g=document.getElementById('grid');if(g&&!g.querySelector(':scope>[data-adk="feed-shop"]')){var sh=[].slice.call(g.querySelectorAll(':scope>.shop')),ev2=adSlot('feed-shop').every,j2=0;
  for(var x=ev2-1;x<sh.length;x+=ev2)put(sh[x],slotHTML('feed-shop',j2++,1));if(SHOW&&sh.length&&sh.length<ev2)put(sh[sh.length-1],slotHTML('feed-shop',0,1))}
 /* antes del pie: uno solo, se renueva si cambian los banners */
 var f=document.querySelector('body>footer'),old=document.getElementById('adfoot'),h=slotHTML('foot',(cnt.f=(cnt.f||0)),1),key=h?h.length+'|'+adList('foot').length:'';
 if(f&&(!old||old.dataset.key!==key)){if(old)old.remove();if(h){var t=document.createElement('div');t.id='adfoot';t.dataset.key=key;t.innerHTML=h;t.style.padding='0 16px';f.parentNode.insertBefore(t,f)}}}
var pend=false;new MutationObserver(function(){if(!pend){pend=true;(window.requestAnimationFrame||setTimeout)(function(){pend=false;try{feed()}catch(e){}})}}).observe(document.documentElement,{childList:true,subtree:true});
/* las claves nuevas aparecen en Administrar → Publicidad para subir sus imágenes */
function addTBP(){try{AD_SLOTS.forEach(function(s){if(s.nw&&!TBP.some(function(x){return x[0]===s.k}))TBP.push([s.k,'Espacio: '+s.n,s.d])})}catch(e){setTimeout(addTBP,500)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addTBP);else addTBP();
})();
