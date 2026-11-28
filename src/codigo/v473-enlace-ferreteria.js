/* v473: INVENTARIO DE FERRETERÍA dentro de «Mis tiendas». En la tabla de Mis tiendas (v284), cada tienda de la categoría
   «Ferreterías» (o el nombre viejo «Ferretería», o una subcategoría con esa palabra) tiene el botón «Inventario», que abre
   mipradera.com.co/ferreteria (página aparte, v472, con la misma sesión). Las tiendas que no son ferretería no lo tienen.
   La página de ferretería revisa además el rol Comerciante y que la tienda sea ferretería.
   No cambia shopTableHTML: la envuelve y agrega el botón al lado de «Editar». Si algo falla, borra este bloque. */
(function(){
var orig=null;
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
/* v477: el inventario y la tienda de ferretería son para todo el grupo «Hogar y construcción» (Ferreterías, Hogar y decoración,
   Cacharrerías y misceláneas y las subcategorías que el administrador cree o mueva a ese grupo, v464/v476). La usa también v474. */
window.qhFerCat=function(c){c=String(c||'');try{if(typeof CAT_MAP!=='undefined'&&CAT_MAP[c])c=CAT_MAP[c];var g=catGroupOf(c);return g==='Construcción'||g==='Hogar y decoración'/* v481: «Hogar y construcción» se dividió en estos dos grupos */}catch(e){return /ferreter/i.test(c)}};
/* v478: las mueblerías (subcategoría «Mueblerías» u otra con «mueble» o «colchón» en el nombre, dentro de Hogar y construcción)
   usan el mismo inventario, pero su tienda lleva el diseño de mueblería (v478) en vez del de ferretería.
   v483: ahora es mueblería toda tienda del grupo «Hogar y decoración» (v481), sea cual sea el nombre de su subcategoría. */
window.qhMuebleCat=function(c){c=String(c||'');try{if(typeof CAT_MAP!=='undefined'&&CAT_MAP[c])c=CAT_MAP[c];return catGroupOf(c)==='Hogar y decoración'/* v483: todo el grupo «Hogar y decoración» es mueblería */}catch(e){return /muebl|colch[oó]n/i.test(c)}};
var esFerr=function(s){return !!s&&window.qhFerCat(s.cat)};
function tabla(ms){var h=orig.apply(this,arguments);if(typeof h!=='string'||!Array.isArray(ms))return h;
 ms.forEach(function(s){if(!esFerr(s))return;var ed='data-act="open" data-id="'+E(s.id)+'">Editar</button>',i=h.indexOf(ed);if(i<0)return;i+=ed.length;
  h=h.slice(0,i)+'<a class="btn v473-inv" href="/'+(window.qhMuebleCat(s.cat)?'muebleria':'ferreteria')/* v482: las mueblerías tienen su propio inventario */+'?s='+encodeURIComponent(s.id)+'#inventario" data-v473="'+E(s.id)+'">Inventario</a>'+h.slice(i)});/* v474: ?s= dice a qué tienda publica el inventario */
 return h}
function inst(){if(orig)return true;if(typeof window.shopTableHTML!=='function')return false;orig=window.shopTableHTML;window.shopTableHTML0=orig;window.shopTableHTML=tabla;return true}
if(!inst()){document.addEventListener('DOMContentLoaded',inst);var k=0,iv=setInterval(function(){if(inst()||++k>200)clearInterval(iv)},50)}
})();
