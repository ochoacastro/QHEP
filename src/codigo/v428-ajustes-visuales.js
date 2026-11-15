
/* v428: pestañas del inicio (.hswp) — la caja toma la altura de la pestaña que se está viendo. Antes tomaba la de la pestaña
   más larga y bajo las cortas quedaba un hueco en blanco (hasta 1.000 px) antes de «Escríbenos».
   Se recalcula al dibujar la pantalla, al pasar de pestaña, al girar el teléfono y cuando una pestaña crece (fotos que cargan).
   El resto de la v428 es solo CSS (v428-ajustes-visuales-css.css). Para quitarlo: borra los dos archivos de src/orden.json. */
(function(){
var ro=null,visto=null,t=0;
function caja(){return document.querySelector('#app .hswp')}
function ajusta(){var w=caja();if(!w||!w.children.length)return;var c0=w.children[0],paso=Math.max(1,c0.offsetWidth+14),i=Math.max(0,Math.min(w.children.length-1,Math.round(w.scrollLeft/paso))),c=w.children[i],h=c?c.offsetHeight:0;
 if(h>0&&w.style.height!==h+'px')w.style.height=h+'px';
 if(ro&&visto!==w){ro.disconnect();[].forEach.call(w.children,function(x){ro.observe(x)});visto=w}}
function pronto(){cancelAnimationFrame(t);t=requestAnimationFrame(ajusta)}
window.qhHswFit=ajusta;
function inicia(){if(inicia.ya)return;inicia.ya=1;try{if(window.ResizeObserver)ro=new ResizeObserver(pronto)}catch(e){}
 var a=document.getElementById('app');if(a)new MutationObserver(pronto).observe(a,{childList:true,subtree:true});
 document.addEventListener('scroll',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('hswp'))pronto()},true);
 addEventListener('resize',pronto);pronto()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inicia);else inicia();
})();
