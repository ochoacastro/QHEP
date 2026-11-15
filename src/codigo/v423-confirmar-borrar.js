
/* v423: PREGUNTAR ANTES DE BORRAR. Cuatro botones borraban de inmediato, sin preguntar, y un toque por error bastaba:
   la ✕ de un producto en la tienda (delProd), «Quitar» en un servicio propio (delServ), «Quitar la mía» / «Eliminar» en una
   sugerencia (delSug) y «Borrar comentario» en las opiniones de un clasificado (data-fbd, v225).
   Este bloque detiene ese toque, pregunta con la misma ventana de «¿Eliminar tu tienda…?» (askC) y, solo si la persona
   acepta, deja pasar el toque a la acción de siempre. No cambia cómo se borra nada.
   La lista de productos (v422) ya pregunta por su cuenta: marca su toque con data-cfok para que no se pregunte dos veces.
   Para quitarlo: borra este archivo de src/orden.json. */
(function(){
var SEL='[data-act="delProd"],[data-act="delServ"],[data-act="delSug"],.cmfb [data-fbd]';
function msg(b){var a=b.dataset.act,id=b.dataset.id,x;
 if(a==='delProd'){try{x=(S.stores.find(function(s){return s.id===cur}).products||[]).find(function(p){return p.id===id})}catch(e){}
  return '¿Eliminar «'+((x&&x.name)||'este producto')+'» de tu tienda?\nNo se puede deshacer.'}
 if(a==='delServ'){try{x=S.services.find(function(s){return s.id===id})}catch(e){}
  return '¿Quitar el servicio'+(x&&x.name?' de «'+x.name+'»':'')+'?\nNo se puede deshacer.'}
 if(a==='delSug')return '¿Eliminar esta sugerencia?\nNo se puede deshacer.';
 return '¿Borrar este comentario?'}
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest(SEL);if(!b||b.dataset.cfok)return;
 var cb=b.closest('.cmfb'),ad=cb?cb.dataset.ad:'';
 e.preventDefault();e.stopImmediatePropagation();
 askC(msg(b),b.dataset.act==='delServ'?'Quitar':b.dataset.act?'Eliminar':'Borrar').then(function(ok){if(!ok)return;
  var t=b;
  /* si la pantalla se volvió a dibujar mientras se preguntaba, el botón ya no está: se busca el mismo botón de nuevo
     (comentarios) o se usa uno igual, oculto (las demás acciones) */
  if(!t.isConnected&&!b.dataset.act){t=[].slice.call(document.querySelectorAll('.cmfb [data-fbd]')).find(function(x){return x.dataset.fbd===b.dataset.fbd&&x.closest('.cmfb').dataset.ad===ad});if(!t)return toast('Vuelve a tocar «Borrar comentario».')}
  if(!t.isConnected){t=document.createElement('button');t.hidden=true;t.dataset.act=b.dataset.act;t.dataset.id=b.dataset.id||'';document.body.appendChild(t)}
  t.dataset.cfok='1';try{t.click()}finally{delete t.dataset.cfok;if(t!==b)t.remove()}})},true);
})();
