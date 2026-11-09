
/* v272: al presionar un botón se marca con la clase «qpr» (mínimo 220 ms, para que se vea aunque el toque sea rápido)
   y se dibuja una onda desde el punto tocado. No cambia lo que hace ningún botón. Si algo falla, borra este <script> y su <style>. */
(function(){
var SEL='button,.btn,.chip,.nwchip,.pnr,.hhr,.hhr2,.plgo,.qbr1,a[data-act],[role="button"]';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
var cur=null,t0=0,rp=null;
function dark(el){try{var m=getComputedStyle(el).backgroundColor.match(/[\d.]+/g);if(!m||(m[3]!==undefined&&+m[3]<.5))return false;return (.2126*m[0]+.7152*m[1]+.0722*m[2])<40}catch(x){return false}}
function release(){var el=cur,r=rp;cur=null;rp=null;if(!el)return;var wait=Math.max(0,220-(Date.now()-t0));
 setTimeout(function(){el.classList.remove('qpr','qblk');if(r){r.classList.add('out');setTimeout(function(){var w=r.parentNode;if(w&&w.parentNode)w.parentNode.removeChild(w)},320)}},wait)}
document.addEventListener('pointerdown',function(e){if(e.button>0)return;var el=e.target.closest&&e.target.closest(SEL);if(!el||el.disabled||el.getAttribute('aria-disabled')==='true'||el.closest('.pfx'))return;
 release();cur=el;t0=Date.now();if(dark(el))el.classList.add('qblk');el.classList.add('qpr');if(RM)return;
 try{var b=el.getBoundingClientRect();if(b.width<8||b.height<8)return;if(getComputedStyle(el).position==='static')el.classList.add('qprel');
  var w=document.createElement('q-rp');w.className='qrw';w.setAttribute('aria-hidden','true');var s=document.createElement('q-rp');s.className='qrp';
  var x=e.clientX-b.left,y=e.clientY-b.top,R=Math.ceil(Math.hypot(Math.max(x,b.width-x),Math.max(y,b.height-y)));
  s.style.cssText='width:'+2*R+'px;height:'+2*R+'px;left:'+(x-R)+'px;top:'+(y-R)+'px';w.appendChild(s);el.appendChild(w)/* v275: al final y con etiqueta propia, para no tapar el texto que otros scripts buscan con querySelector('span') */;rp=s}catch(x){}},{passive:true,capture:true});
['pointerup','pointercancel','dragstart'].forEach(function(n){document.addEventListener(n,release,{passive:true,capture:true})});
document.addEventListener('scroll',function(){if(cur&&Date.now()-t0>80)release()},{passive:true,capture:true});
/* teclado: Enter o espacio también muestran el relleno */
document.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var el=e.target.closest&&e.target.closest(SEL);if(!el)return;if(dark(el))el.classList.add('qblk');el.classList.add('qpr');setTimeout(function(){el.classList.remove('qpr','qblk')},220)},true);
})();
