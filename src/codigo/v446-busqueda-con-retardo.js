/* v446: el buscador de arriba (#q) espera a que la persona deje de escribir (220 ms) antes de buscar,
   en vez de buscar en cada letra. En un celular lento la escritura ya no se traba.
   - Solo retrasa lo que escribe la persona (eventos de verdad); la lupa y los atajos que llenan el
     buscador desde el código buscan al instante, como antes.
   - Si toca Enter antes de que pase la espera, busca en ese momento, para que Enter abra el primer
     resultado de lo que escribió y no el de una letra antes.
   Para quitarlo: borrar este archivo de src/orden.json. */
(function(){
 var T=0,MS=220,campo=null;
 function ya(){if(!campo)return;var c=campo;campo=null;clearTimeout(T);c.dispatchEvent(new Event('input',{bubbles:true}))}
 document.addEventListener('input',function(e){
  var t=e.target;if(!t||t.id!=='q'||!e.isTrusted)return;
  e.stopImmediatePropagation();campo=t;clearTimeout(T);T=setTimeout(ya,MS)
 },true);
 document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target&&e.target.id==='q')ya()},true);
})();
