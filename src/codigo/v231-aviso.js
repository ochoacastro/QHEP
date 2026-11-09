
/* v231: el aviso "Mi Pradera · ..." escribe y borra, una tras otra, las cosas que se hacen en la página.
   Con "reducir movimiento" activado en el celular, cambia la frase sin animación.
   Si algo falla, borra este <script id="v231-aviso"> y el <style id="v231-aviso-css">. */
(function(){var W=['Compra','Vende','Arrienda','Contrata servicios','Publica clasificados','Encuentra tiendas','Entérate de las noticias','Lo nuestro, en un solo lugar'];
 function go(){var a=document.getElementById('annc');if(!a||a.dataset.tw)return;a.dataset.tw='1';a.setAttribute('aria-label','Mi Pradera · Lo nuestro, en un solo lugar');
  a.innerHTML='<span aria-hidden="true">Mi Pradera · <span class="qtw"></span><i class="qtw-c"></i></span>';
  var t=a.querySelector('.qtw'),rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches,i=0,n=0,del=false;
  if(rm){t.textContent=W[0];setInterval(function(){i=(i+1)%W.length;t.textContent=W[i]},2500);return}
  (function step(){var w=W[i],d=90;if(!del){n++;t.textContent=w.slice(0,n);if(n>=w.length){del=true;d=w===W[W.length-1]?3200:1600}}
   else{n--;t.textContent=w.slice(0,n);d=40;if(n<=0){del=false;i=(i+1)%W.length;d=350}}setTimeout(step,d)})()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go()})();
