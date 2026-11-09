
/* v207: deslizar con el dedo (izquierda = siguiente, derecha = anterior):
   1) sobre la foto grande de un clasificado que tiene varias fotos;
   2) sobre la foto ampliada (cuando no esta con zoom).
   Tocar la foto la sigue ampliando en la foto que se esta viendo. Si algo falla, borra SOLO este
   <script id="v207-deslizar"> y el <style id="v207-deslizar-css">. */
(function(){
var x0=null,y0=null,el=null;
document.addEventListener('touchstart',function(e){var t=e.target;if(e.touches.length!==1||!t.closest){el=null;return}
 el=t.closest('article.cmc img.cmi')||t.closest('#stage');if(!el)return;x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
document.addEventListener('touchend',function(e){if(!el)return;var c=e.changedTouches[0],dx=c.clientX-x0,dy=c.clientY-y0,t=el;el=null;
 if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.5)return;var dir=dx<0?1:-1;
 if(t.id==='stage'){try{if(typeof lb!=='undefined'&&lb&&lb.l&&lb.l.length>1&&lb.z<=1&&typeof lbGo==='function')lbGo(dir)}catch(_){}return}
 var th=t.parentNode&&t.parentNode.querySelector('.cmths');if(!th)return;var ims=th.querySelectorAll('img'),n=ims.length;if(n<2)return;
 var i=((+t.dataset.i||0)+dir+n)%n,src=ims[i].getAttribute('src');
 t.dataset.i=i;for(var k=0;k<n;k++)ims[k].classList.toggle('on',k===i);
 var go=function(){t.src=src;t.alt=ims[i].alt||t.alt};
 if(t.animate&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){
  t.animate([{transform:'translateX(0)',opacity:1},{transform:'translateX('+(-dir*40)+'px)',opacity:0}],{duration:120,easing:'ease-in'}).onfinish=function(){go();t.animate([{transform:'translateX('+(dir*40)+'px)',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:160,easing:'ease-out'})};
 }else go();
},{passive:true});
document.addEventListener('touchcancel',function(){el=null},{passive:true});
})();
