/* v483: CATEGORÍA EN «EDITAR TIENDA». La categoría (subcategoría) de una tienda solo se elegía al crearla. Ahora «Editar tienda»
   (editShop, también cuando el administrador edita la tienda de otra persona, v441) tiene «Categoría» en el paso «Tu negocio»,
   debajo de «¿Qué vendes?»: un selector con las subcategorías agrupadas como en el panel (grupo de cada una con catGroupOf, v215/v464).
   Al tocar «Guardar» se cambia s.cat antes de que la página guarde la tienda (mismo camino que el nombre o la descripción).
   Con esto el administrador pasa una tienda a «Mueblerías» u otra subcategoría de «Hogar y decoración» y la tienda toma el diseño
   y el inventario de mueblería. No cambia editShop: la envuelve. Si algo falla, quita este archivo de src/orden.json. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function actual(s){var c=String(s&&s.cat||'');try{if(typeof CAT_MAP!=='undefined'&&CAT_MAP[c])c=CAT_MAP[c]}catch(e){}return c}
function html(s){var by={},G=[],c0=actual(s),hay=false;
 CATS.forEach(function(c){var g=catGroupOf(c[0]);if(!by[g]){by[g]=[];G.push(g)}by[g].push(c[0]);if(c[0]===c0)hay=true});
 var ord=function(g){var i=-1;try{i=CAT_GRP.findIndex(function(x){return x[0]===g})}catch(e){}return i<0?99:i};
 G.sort(function(a,b){return ord(a)-ord(b)});
 return '<label for="e-cat">Categoría (para que te encuentren)</label><select id="e-cat">'+(hay||!c0?'':'<option value="'+E(c0)+'" selected>'+E(c0)+'</option>')+
  G.map(function(g){return '<optgroup label="'+E(g)+'">'+by[g].map(function(n){return '<option value="'+E(n)+'"'+(n===c0?' selected':'')+'>'+E(n)+'</option>'}).join('')+'</optgroup>'}).join('')+'</select>'}
function poner(){if(document.getElementById('e-cat'))return;var d=document.getElementById('e-desc'),s=S.stores.find(function(x){return x.id===cur});
 if(!d||!s||!document.querySelector('[data-act="saveEditShop"]'))return;d.insertAdjacentHTML('afterend',html(s))}
function inst(){if(typeof window.editShop!=='function'||window.editShop.__v483)return typeof window.editShop==='function';var o=window.editShop;
 window.editShop=function(){var r=o.apply(this,arguments);try{poner()}catch(e){}return r};window.editShop.__v483=1;return true}
if(!inst()){document.addEventListener('DOMContentLoaded',inst)}
/* antes que el guardado de siempre (fase de captura): la categoría elegida pasa a la tienda */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-act="saveEditShop"]');if(!b)return;
 var sel=document.getElementById('e-cat'),n=document.getElementById('e-name'),s=S.stores.find(function(x){return x.id===cur});
 if(sel&&s&&sel.value&&n&&n.value.trim())s.cat=sel.value},true);
})();
