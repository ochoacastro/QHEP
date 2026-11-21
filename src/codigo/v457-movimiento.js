/* v457: MOVIMIENTO AL HACER SCROLL (referencia: co.addi.com), solo en la parte de presentación del INICIO
   (título «¿Qué hay en Pradera?», íconos de categorías, carrusel de fotos de arriba, anuncios de colores y «Negocios»). Las listas de publicaciones,
   tiendas y productos no se mueven: se usan a diario y lo que se lee o se toca no debe moverse por adorno.
   1) Aparecer: cada pieza que está más abajo de la pantalla entra una sola vez al llegar a ella (sube 16 px y se aclara,
      600 ms). Lo que ya se ve al abrir la página no espera: sale de una vez.
   2) Parallax: la foto del carrusel de arriba (publicidad) se desplaza un poco más lento que la página (hasta 18 px) dentro de su marco.
   Con «reducir movimiento» en el teléfono no se hace nada. Solo usa transform y opacity.
   Para quitarlo: borrar este archivo de src/orden.json. */
(function(){
 var H=document.documentElement;
 try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return}catch(e){}
 if(!('IntersectionObserver' in window))return;
 var SEL='#app .hubhero,#app .hubg,#app section[aria-label="Publicidad"],#app .bzcar,#app .hneg',VISTO={},io,io2,vivos=new Set(),tick=false;
 function clave(el){return el.className.split(' ')[0]}
 io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);VISTO[clave(el)]=1;el.classList.add('rv-in')})},{rootMargin:'0px 0px -8% 0px'});
 function aparecer(){var l=document.querySelectorAll(SEL),vh=innerHeight;
  for(var i=0;i<l.length;i++){var el=l[i];if(el.dataset.rv)continue;el.dataset.rv='1';
   if(VISTO[clave(el)]||el.getBoundingClientRect().top<vh*0.92){VISTO[clave(el)]=1;continue}/* ya visto o ya en pantalla: sin animación */
   el.classList.add('rv');io.observe(el)}}
 /* parallax de las fotos del carrusel de banners */
 io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)vivos.add(e.target);else vivos.delete(e.target)});pedir()});
 function fotos(){var l=document.querySelectorAll('#app .bns img');for(var i=0;i<l.length;i++){var im=l[i];if(im.dataset.px)continue;im.dataset.px='1';im.classList.add('px');io2.observe(im)}}
 function mover(){tick=false;var vh=innerHeight;vivos.forEach(function(im){if(!im.isConnected){vivos.delete(im);return}var r=im.getBoundingClientRect(),c=(r.top+r.height/2-vh/2)/vh;/* -1 arriba … 1 abajo */
  var y=Math.max(-18,Math.min(18,c*-18));im.style.transform='translate3d(0,'+y.toFixed(1)+'px,0) scale(1.08)'})}
 function pedir(){if(!tick){tick=true;requestAnimationFrame(mover)}}
 addEventListener('scroll',pedir,{passive:true});addEventListener('resize',pedir);
 function todo(){if(typeof view!=='undefined'&&view!=='home')return;aparecer();fotos();pedir()}
 function arrancar(){var a=document.getElementById('app');if(!a)return;new MutationObserver(todo).observe(a,{childList:true,subtree:true});todo()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrancar);else arrancar();
})();
