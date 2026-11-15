
/* v422: LISTA DE PRODUCTOS de la tienda. En la ficha de su tienda, el dueño ya no ve el botón grande «Eliminar tienda»:
   en su lugar está «Lista de productos», que abre una ventana con todos sus productos en una lista (foto, nombre, precio y
   categoría) y dos botones por producto: «Editar» (abre el mismo formulario de siempre) y «Eliminar» (pregunta antes de borrar).
   «Eliminar tienda» no se perdió: quedó como un enlace pequeño debajo de los botones (07-cardov.js).
   No guarda nada nuevo: editar y eliminar usan las mismas acciones de siempre (editProd y delProd, 14-servform.js).
   Para quitarlo: borra este archivo y su CSS (v422-lista-productos-css.css) de src/orden.json, y en 07-cardov.js vuelve a poner
   el botón <button class="btn ghost" data-act="delShop">Eliminar tienda</button> donde está el de data-lpv="open". */
(function(){
var st=function(){return S.stores.find(function(x){return x.id===cur})};
var mineOf=function(s){try{return !!s&&shopsMine().some(function(x){return x.id===s.id})}catch(e){return false}};
var IC={ed:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>',
 del:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>'};
function foto(p){var g=[];try{g=pimgs(p)}catch(e){}var f=g[0]||(p.cimgs&&p.cimgs[0]&&p.cimgs[0].g&&p.cimgs[0].g[0])||'';
 return typeof f==='string'&&f&&!/^yt:/.test(f)?f:''}
function fila(p){var f=foto(p),n=esc(p.name||'Sin nombre');
 return '<li class="lpvr"><span class="lpvf">'+(f?'<img src="'+esc(f)+'" alt="" loading="lazy">':'<small>Sin foto</small>')+'</span>'+
  '<span class="lpvt"><b>'+n+'</b><span>'+money(p.price)+(p.out?' · <i>Agotado</i>':'')+'</span>'+(p.c1?'<small>'+esc(p.c1)+(p.c2?' › '+esc(p.c2):'')+'</small>':'')+'</span>'+
  '<span class="lpvb"><button type="button" class="btn ghost" data-act="editProd" data-id="'+esc(p.id)+'" aria-label="Editar '+n+'">'+IC.ed+'<span>Editar</span></button>'+
  '<button type="button" class="btn ghost lpvd" data-lpv="del" data-id="'+esc(p.id)+'" aria-label="Eliminar '+n+'">'+IC.del+'<span>Eliminar</span></button></span></li>'}
function lista(){var s=st();if(!s||!mineOf(s))return;var l=s.products||[];
 modal('<h2>Lista de productos</h2><p class="muted">'+(l.length?(l.length===1?'Tienes 1 producto':'Tienes '+l.length+' productos')+' en <b>'+esc(s.name)+'</b>. Toca «Editar» para cambiarlo o «Eliminar» para quitarlo.':'Tu tienda aún no tiene productos.')+'</p>'+
  (l.length?'<ul class="lpvl">'+l.map(fila).join('')+'</ul>':'')+
  '<div class="row" style="margin-top:12px"><button type="button" class="btn pink" data-act="addProd">+ Producto</button><button type="button" class="btn ghost" data-act="close">Cerrar</button></div>')}
window.qhListaProductos=lista;
/* borra con la acción de siempre (delProd), para no repetir aquí cómo se borra un producto */
function borrar(id){var b=document.createElement('button');b.hidden=true;b.dataset.act='delProd';b.dataset.id=id;document.body.appendChild(b);b.click();b.remove()}
addEventListener('click',async function(e){var q=e.target.closest&&e.target.closest('[data-lpv]');if(!q)return;e.preventDefault();e.stopImmediatePropagation();var a=q.dataset.lpv,s=st();
 if(a==='open')return lista();
 if(a==='del'){if(!s||!mineOf(s))return;var id=q.dataset.id,p=(s.products||[]).find(function(x){return x.id===id});if(!p)return lista();
  if(!(await askC('¿Eliminar «'+(p.name||'este producto')+'» de tu tienda?\nNo se puede deshacer.','Eliminar')))return;
  borrar(id);lista();toast('Producto eliminado')}},true);
})();
