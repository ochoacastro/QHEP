/* v474: UNA SOLA TIENDA PARA LAS FERRETERÍAS. La tienda de una ferretería en Mi Pradera es su vitrina: muestra los productos que
   se publican desde el inventario (mipradera.com.co/ferreteria, v472-v473), con los colores de ferretería que el dueño eligió
   (stores/<id>.ferTema: amarillo, naranja, azul, rojo, acero o madera; sin elegir, amarillo y negro).
   - A la vista de la tienda (storeView) se le antepone una marca oculta <i class="qhfer-m" data-t="tema">; los estilos
     (v474-ferreteria-tienda.css) solo aplican si esa marca está en la página (body:has(.qhfer-m)). Las demás tiendas no cambian.
   - Para el dueño: se esconden «+ Producto», «Lista de productos», «Categorías» y editar o quitar productos, y sale un aviso con
     «Abrir inventario», porque los productos los manda el inventario (si los cambiara aquí, «Publicar tienda» los volvería a poner).
   No cambia storeView ni storeViewExt (v411): envuelve storeViewExt. Si algo falla, borra este bloque y su <style>. */
(function(){
var TEMAS=['amarillo','naranja','azul','rojo','acero','madera'],prev=null;
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function marca(h){try{if(typeof h!=='string'||view!=='store')return h;var s=S.stores.find(function(x){return x.id===cur});if(!s||!(window.qhFerCat?window.qhFerCat(s.cat):/ferreter/i.test(s.cat||'')))return h;/* v477: todo «Hogar y construcción» */
 var t=TEMAS.indexOf(s.ferTema)>=0?s.ferTema:'amarillo',mia=S.mine.includes(s.id),m='<i class="qhfer-m" hidden data-t="'+t+'"'+(mia?' data-mia="1"':'')+'></i>';
 if(mia){var av='<div class="qhfer-av" role="note"><p><b>Los productos de esta tienda se manejan en el Inventario.</b> Allí cambias precios, fotos, existencias y qué se muestra; luego tocas «Publicar tienda».</p><a class="btn" href="/ferreteria?s='+encodeURIComponent(s.id)+'#inventario">Abrir inventario</a></div>',
  i=h.indexOf('<div class="icard">');h=i>=0?h.slice(0,i)+av+h.slice(i):av+h}
 return m+h}catch(e){return h}}
function nueva(){var h=prev?prev.apply(this,arguments):storeView0.apply(this,arguments);return marca(h)}
/* se instala después de la v411 (que pone su storeViewExt al cargar la página); si otra la cambia después, se vuelve a envolver */
function inst(){if(typeof storeView0!=='function')return false;if(window.storeViewExt===nueva)return true;if(!window.__ltrW&&document.readyState==='loading')return false;
 prev=typeof window.storeViewExt==='function'?window.storeViewExt:null;window.storeViewExt=nueva;try{if(view==='store')render()}catch(e){}return true}
document.addEventListener('DOMContentLoaded',inst);var k=0,iv=setInterval(function(){inst();if(++k>100)clearInterval(iv)},100);
})();
