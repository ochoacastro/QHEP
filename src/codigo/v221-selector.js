
/* v221: cada <select> de la pagina muestra un boton con el diseño de la pagina y, al tocarlo, una hoja con las opciones
   (en vez del menu propio del celular). El <select> original sigue ahi, oculto: al elegir se cambia su valor y se avisa
   con los eventos "input" y "change", asi que toda la logica de la pagina funciona igual. Los selectores multiples se dejan normales.
   Si algo falla, borra este <script id="v221-selector"> y el <style id="v221-selector-css">. */
(function(){
var CHEV='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',CHK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
function labelOf(s){var t='';if(s.id){var l=document.querySelector('label[for="'+(window.CSS&&CSS.escape?CSS.escape(s.id):s.id)+'"]');if(l)t=l.textContent}if(!t&&s.closest('label'))t=s.closest('label').textContent;return (t||s.getAttribute('aria-label')||s.title||'Elige una opción').replace(/\s+/g,' ').trim()}
function txt(o){return (o.label||o.text||'').replace(/\s+/g,' ').trim()}
function sync(s){var b=s._qs;if(!b)return;var o=s.options[s.selectedIndex],t=o?txt(o):'';b.querySelector('span').textContent=t||'Elige…';b.classList.toggle('ph',!o||(o.value===''&&/^(elige|selecciona|escoge|primero)/i.test(t)));b.disabled=s.disabled;b.hidden=s.hidden||s.style.display==='none'}
function enhance(s){if(s._qs||s.multiple||s.size>1||s.closest('[data-native]'))return;
 var b=document.createElement('button');b.type='button';b.className='qs-btn';b.setAttribute('aria-haspopup','listbox');b.setAttribute('aria-expanded','false');
 b.innerHTML='<span></span>'+CHEV;var p=s.parentNode;
 /* ancho: si el select ocupaba casi toda la fila, el boton tambien; si era pequeño, se ajusta al contenido */
 try{var w=s.getBoundingClientRect().width,pw=p.getBoundingClientRect().width;if(w&&pw&&w<pw*.85)b.classList.add('inl');var cs=getComputedStyle(s);if(cs.marginTop)b.style.marginTop=cs.marginTop;if(cs.marginBottom)b.style.marginBottom=cs.marginBottom}catch(e){}
 s.insertAdjacentElement('afterend',b);s.classList.add('qs-hide');s.tabIndex=-1;s.setAttribute('aria-hidden','true');s._qs=b;b._qs=s;
 b.setAttribute('aria-label',labelOf(s));sync(s);
 new MutationObserver(function(){sync(s)}).observe(s,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','hidden','style']});
 b.addEventListener('click',function(){open(s)})}
var cur=null;
function close(){if(!cur)return;var c=cur;cur=null;c.ov.remove();c.b.setAttribute('aria-expanded','false');document.removeEventListener('keydown',key,true);try{c.b.focus({preventScroll:true})}catch(e){}}
function key(e){if(!cur)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return}
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){var l=[].slice.call(cur.ov.querySelectorAll('.qs-o:not(:disabled)')),i=l.indexOf(document.activeElement);i=e.key==='ArrowDown'?Math.min(l.length-1,i+1):Math.max(0,i-1);if(l[i]){l[i].focus();e.preventDefault()}}}
function open(s){if(s.disabled)return;close();sync(s);var b=s._qs,ov=document.createElement('div');ov.className='qs-ov';
 var h='<div class="qs-sh" role="dialog" aria-modal="true" aria-label="'+labelOf(s).replace(/"/g,'&quot;')+'"><div class="qs-gr" aria-hidden="true"></div><div class="qs-hd"><b></b><button type="button" class="qs-x" aria-label="Cerrar">✕</button></div><div class="qs-ls" role="listbox"></div></div>';
 ov.innerHTML=h;ov.querySelector('.qs-hd b').textContent=labelOf(s);var ls=ov.querySelector('.qs-ls');
 [].forEach.call(s.children,function(n){
  if(n.tagName==='OPTGROUP'){var g=document.createElement('div');g.className='qs-g';g.textContent=n.label;ls.appendChild(g);[].forEach.call(n.children,add)}else if(n.tagName==='OPTION')add(n)});
 function add(o){if(o.hidden||(o.value===''&&/^(elige|selecciona|escoge)/i.test(txt(o))))return;var x=document.createElement('button');x.type='button';x.className='qs-o';x.setAttribute('role','option');var sel=o.index===s.selectedIndex;x.setAttribute('aria-selected',sel?'true':'false');x.disabled=o.disabled;
  x.innerHTML='<span></span>'+CHK;x.querySelector('span').textContent=txt(o)||'—';
  x.addEventListener('click',function(){var ch=s.selectedIndex!==o.index;s.selectedIndex=o.index;close();sync(s);if(ch){s.dispatchEvent(new Event('input',{bubbles:true}));s.dispatchEvent(new Event('change',{bubbles:true}))}});ls.appendChild(x)}
 if(typeof qsFind==='function')try{qsFind(ov,ls)}catch(e){}/* v345: buscador en listas largas */
 ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('.qs-x'))close()});
 document.body.appendChild(ov);cur={ov:ov,b:b,s:s};b.setAttribute('aria-expanded','true');document.addEventListener('keydown',key,true);
 var on=ls.querySelector('[aria-selected=true]')||ls.querySelector('.qs-o:not(:disabled)');if(on){on.scrollIntoView({block:'center'});try{on.focus({preventScroll:true})}catch(e){}}}
/* cuando la pagina cambia el valor por codigo con un evento, el boton se actualiza */
document.addEventListener('change',function(e){if(e.target&&e.target._qs)sync(e.target)},true);
document.addEventListener('input',function(e){if(e.target&&e.target._qs)sync(e.target)},true);
var pend=false;function scan(){pend=false;var l=document.querySelectorAll('select:not(.qs-hide)');for(var i=0;i<l.length;i++)enhance(l[i]);var e=document.querySelectorAll('select.qs-hide');for(var j=0;j<e.length;j++)sync(e[j])}
new MutationObserver(function(){if(!pend){pend=true;(window.requestAnimationFrame||setTimeout)(scan)}}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
})();
