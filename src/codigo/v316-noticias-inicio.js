
/* v316: en el inicio, carrusel con las noticias más recientes (foto, categoría, titular y fecha).
   Se desliza con el dedo o con las barritas y avanza solo cada 6 segundos. Si no hay noticias, muestra un aviso.
   Si algo falla, borra este bloque y quita ${typeof hubNwCar...} de hubView. */
(function(){
var MAX=8,lastN=-1;
window.hubNwCar=function(){try{QH.newsListen()}catch(e){}
 var l=(QH.NEWS||[]).slice(0,MAX);lastN=(QH.NEWS||[]).length;
 var head='<div class="hubph"><h2>Noticias de Pradera</h2><button class="btn ghost" data-act="miniTab" data-v="news">Ver todas ›</button></div>';
 if(!l.length)return '<section class="hubp" aria-label="Noticias de Pradera">'+head+'<div class="nwc0">'+QIC.news+'<p>Aquí aparecen las noticias de Pradera apenas se publiquen.</p></div></section>';
 var cards=l.map(function(n){var c=typeof nwCatOf==='function'?nwCatOf(n.cat):null,im=n.img||(Array.isArray(n.imgs)&&n.imgs[0])||'';
  return '<button type="button" class="nwcc" data-act="nwOpen" data-id="'+esc(n.id)+'"><span class="nwci">'+(im?'<img src="'+esc(im)+'" alt="" loading="lazy">':QIC.news)+(c?'<span class="nwct2">'+esc(c[2])+'</span>':'')+'</span><span class="nwcb"><b>'+esc(n.title||'Noticia')+'</b><small>'+esc(typeof nwDate==='function'?nwDate(n):'')+(n.author?' · '+esc(n.author):'')+'</small></span></button>'}).join('');
 var d='';if(l.length>1)for(var i=0;i<l.length;i++)d+='<button type="button" data-nwdot="'+i+'" aria-label="Noticia '+(i+1)+' de '+l.length+'"'+(i?'':' aria-current="true"')+'></button>';
 return '<section class="hubp" aria-label="Noticias de Pradera">'+head+'<div class="nwc" tabindex="0" aria-roledescription="carrusel">'+cards+'</div>'+(d?'<div class="nwcd">'+d+'</div>':'')+'</section>'};
function card(s){var c=s.querySelector('.nwcc');return c?c.offsetWidth+12:s.clientWidth}
function idx(s){return Math.round(s.scrollLeft/Math.max(1,card(s)))}
function dots(s){var w=s.parentNode.querySelector('.nwcd');if(!w)return;var k=idx(s);if(s.scrollLeft+s.clientWidth>=s.scrollWidth-4)k=w.children.length-1;[].forEach.call(w.children,function(b,i){b.setAttribute('aria-current',i===k?'true':'false')})}
function go(s,k){var n=s.children.length;if(!n)return;k=(k+n)%n;s.scrollTo({left:k*card(s),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
var hold=0;
document.addEventListener('scroll',function(e){var s=e.target;if(s&&s.classList&&s.classList.contains('nwc'))dots(s)},true);
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-nwdot]');if(!b)return;hold=Date.now()+20000;go(b.closest('section').querySelector('.nwc'),+b.dataset.nwdot)});
['pointerdown','touchstart','focusin'].forEach(function(t){document.addEventListener(t,function(e){if(e.target.closest&&e.target.closest('.nwc'))hold=Date.now()+20000},{passive:true})});
setInterval(function(){
 /* cuando llegan noticias nuevas, el inicio se actualiza solo */
 try{if(view==='home'&&!document.getElementById('ov')&&lastN>=0&&(QH.NEWS||[]).length!==lastN&&document.querySelector('[aria-label="Noticias de Pradera"]'))render(true)}catch(e){}
 if(Date.now()<hold||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var s=document.querySelector('.nwc');if(!s||s.matches(':hover')||s.children.length<2)return;var r=s.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
 var k=idx(s)+1;if(s.scrollLeft+s.clientWidth>=s.scrollWidth-4)k=0;go(s,k)},6000);
})();
