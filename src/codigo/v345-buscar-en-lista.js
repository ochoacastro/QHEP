
/* v345: buscador dentro de la hoja de opciones (v221) cuando la lista tiene más de 8 opciones (barrios, categorías…).
   Filtra mientras se escribe, sin importar tildes ni mayúsculas; Enter elige la primera que coincide.
   «Otro lugar (escribirlo)» siempre queda visible. Si algo falla, borra este bloque y la llamada qsFind en v221. */
window.qsFind=function(ov,ls){var os=ls.querySelectorAll('.qs-o');if(os.length<=8)return;
 var nm=function(t){return String(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim()};
 var w=document.createElement('div');w.className='qs-fw';
 w.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="search" class="qs-f" placeholder="Buscar…" aria-label="Buscar en la lista" autocomplete="off" enterkeyhint="search"><p class="qs-no" hidden>No hay coincidencias.</p>';
 var hd=ov.querySelector('.qs-hd');hd.insertAdjacentElement('afterend',w);var inp=w.querySelector('input'),no=w.querySelector('.qs-no');
 inp.placeholder='Buscar '+(hd.querySelector('b').textContent.toLowerCase().indexOf('barrio')>=0?'barrio o corregimiento…':'…');
 function f(){var q=nm(inp.value),vis=0;[].forEach.call(ls.children,function(n){if(n.classList.contains('qs-o')){var t=nm(n.textContent),keep=/^otro\b/.test(t);var on=!q||t.indexOf(q)>=0||keep;n.hidden=!on;n.dataset.k=keep?'1':'';if(on&&!keep)vis++}});
  [].forEach.call(ls.querySelectorAll('.qs-g'),function(g){var n=g.nextElementSibling,any=false;while(n&&!n.classList.contains('qs-g')){if(!n.hidden&&!n.dataset.k)any=true;n=n.nextElementSibling}g.hidden=!any});
  no.hidden=vis>0||!q;ls.scrollTop=0}
 inp.addEventListener('input',f);
 inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();var o=ls.querySelector('.qs-o:not([hidden]):not(:disabled)');if(o)o.click()}});
 if(!(window.matchMedia&&matchMedia('(pointer:coarse)').matches))setTimeout(function(){try{inp.focus({preventScroll:true})}catch(e){}},60)};
