/* v473: INVENTARIO DE FERRETERÍA dentro de «Mis tiendas». En la tabla de Mis tiendas (v284), cada tienda de la categoría
   «Ferreterías» (o el nombre viejo «Ferretería», o una subcategoría con esa palabra) tiene el botón «Inventario», que abre
   mipradera.com.co/ferreteria (página aparte, v472, con la misma sesión). Las tiendas que no son ferretería no lo tienen.
   La página de ferretería revisa además el rol Comerciante y que la tienda sea ferretería.
   No cambia shopTableHTML: la envuelve y agrega el botón al lado de «Editar». Si algo falla, borra este bloque. */
(function(){
var orig=null;
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var esFerr=function(s){return !!s&&/ferreter/i.test(s.cat||'')};
function tabla(ms){var h=orig.apply(this,arguments);if(typeof h!=='string'||!Array.isArray(ms))return h;
 ms.forEach(function(s){if(!esFerr(s))return;var ed='data-act="open" data-id="'+E(s.id)+'">Editar</button>',i=h.indexOf(ed);if(i<0)return;i+=ed.length;
  h=h.slice(0,i)+'<a class="btn v473-inv" href="/ferreteria?s='+encodeURIComponent(s.id)+'#inventario" data-v473="'+E(s.id)+'">Inventario</a>'+h.slice(i)});/* v474: ?s= dice a qué tienda publica el inventario */
 return h}
function inst(){if(orig)return true;if(typeof window.shopTableHTML!=='function')return false;orig=window.shopTableHTML;window.shopTableHTML0=orig;window.shopTableHTML=tabla;return true}
if(!inst()){document.addEventListener('DOMContentLoaded',inst);var k=0,iv=setInterval(function(){if(inst()||++k>200)clearInterval(iv)},50)}
})();
