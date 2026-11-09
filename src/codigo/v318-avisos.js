
/* v318: todos los avisos de la página (toast) salen como una ventana con un botón X para cerrarla.
   Los avisos de error o largos se quedan hasta que la persona los cierre; los cortos de «listo» se cierran solos a los 5 s.
   Si algo falla, borra este bloque: vuelven los avisos de antes. */
(function(){
var BAD=/no se pudo|no pudimos|error|falt|revisa|int[eé]nta|necesitas|no tienes|no puedes|venci|expir|se cerr|demasiad|incorrect|no es v[aá]lid|primero|ya usaste|en pausa|marca qu[eé]|escribe (la|desde|el cargo|las funciones|qu[eé] sabes)|debe ser despu|elige si/i;
var OK='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';
var WARN='<svg class="qi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';
var t=0,prev=null;
function el(){var p=document.getElementById('qpop');if(p)return p;p=document.createElement('div');p.id='qpop';p.innerHTML='<span></span><p></p><button type="button" aria-label="Cerrar aviso">✕</button>';document.body.appendChild(p);
 p.querySelector('button').addEventListener('click',function(){hide(true)});return p}
function hide(f){var p=document.getElementById('qpop');clearTimeout(t);if(!p)return;p.classList.remove('on');p.removeAttribute('role');if(f&&prev&&prev.isConnected&&prev.focus)try{prev.focus({preventScroll:true})}catch(e){}prev=null}
function show(m){m=String(m==null?'':m).trim();if(!m)return;var p=el(),bad=BAD.test(m);
 p.classList.toggle('bad',bad);p.querySelector('span').innerHTML=bad?WARN:OK;p.querySelector('p').textContent=m;
 p.setAttribute('role',bad?'alert':'status');p.classList.add('on');clearTimeout(t);
 if(!bad&&m.length<=70)t=setTimeout(function(){hide(false)},5000)}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var p=document.getElementById('qpop');if(p&&p.classList.contains('on')&&!document.getElementById('ov')){hide(true)}}});
function wrap(){if(typeof window.toast!=='function'||window.toast.__qpop)return;var t0=window.toast;var w=function(m){try{show(m)}catch(x){}return t0.apply(this,arguments)};w.__qpop=1;
 for(var k in t0)if(Object.prototype.hasOwnProperty.call(t0,k))w[k]=t0[k];window.toast=w}
/* el aviso de «Publicando…» (pubFx) envuelve toast cuando carga la página; este va por fuera de ese */
window.addEventListener('load',function(){setTimeout(wrap,50)});setTimeout(wrap,3000);
window.qpopHide=hide;
})();
