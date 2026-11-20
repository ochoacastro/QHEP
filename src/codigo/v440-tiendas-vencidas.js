/* v440: tiendas con el plan vencido hace más de 3 meses. Al vencer el plan (más 3 días de gracia) los productos, las fotos extra del
   lugar y el video se ocultan al público (v259) y se guardan 3 meses desde la fecha en que venció (shopKeep en 02-news).
   Después, en Usuarios → «Tiendas por limpiar», el administrador ve la lista y con un botón borra lo pagado: los productos (y sus
   fotos en R2), las fotos del lugar que pasan de las 3 gratis y el video. La tienda sigue como registro básico gratis.
   El fin del plan se calcula con la ficha del dueño (plans/<k>) y la fecha de pago de la tienda (pexp): se usa la mayor, para no
   borrar nunca a quien ya renovó. Si la ficha del dueño no está cargada, la tienda no sale en la lista.
   Si algo falla, borra este bloque y la llamada admLimpiar en 11-profilemodal. */
(function(){
var FREE=3,E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function fd(t){return new Date(t).toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'})}
function isAdm(){return typeof MODE!=='undefined'&&MODE==='admin'&&typeof adm!=='undefined'&&adm}
/* lo que se borraría de una tienda: [productos, fotos extra, video] */
function extra(s){return [(s.products||[]).length,Math.max(0,(s.gal||[]).length-FREE),s.vid?1:0]}
function lista(){var P={},now=Date.now(),out=[];try{QH.plans().forEach(function(p){if(p&&p.k)P[p.k]=p})}catch(e){return []}
 (S.stores||[]).forEach(function(s){var p=P[s.ownerKey];if(!p)return;var e=0;try{e=Math.max(Number(s.pexp)||0,pEnd(p,shopNeed(s)))}catch(x){return}
  if(!(e>0))return;var lim=shopKeep(e);if(now<lim)return;var x=extra(s);if(!x[0]&&!x[1]&&!x[2])return;out.push({s:s,p:p,e:e,lim:lim,x:x})});
 return out.sort(function(a,b){return a.e-b.e})}
function qu(x){var l=[];if(x[0])l.push(x[0]+(x[0]===1?' producto':' productos'));if(x[1])l.push(x[1]+(x[1]===1?' foto extra':' fotos extra'));if(x[2])l.push('el video');return l.join(', ')}
window.admLimpiar=function(){if(!isAdm())return '';var L=lista();if(!L.length)return '';
 return '<div class="cg aadp"><h3>Tiendas por limpiar <em>'+L.length+'</em></h3><p class="muted">Su plan venció hace más de 3 meses y no lo renovaron. Al borrar se quitan sus productos, las fotos del lugar que pasan de 3 y el video; la tienda sigue a la vista como registro básico gratis. Esto no se puede deshacer.</p>'+
  L.map(function(g){return '<div class="aadr pend"><b>'+E(g.s.name||'(sin nombre)')+(g.p.email?' · '+E(g.p.email):g.s.wa?' · '+E(g.s.wa):'')+'</b><p>Venció el '+fd(g.e)+' · guardado hasta el '+fd(g.lim)+' · '+E(qu(g.x))+'</p><div class="row"><button type="button" class="btn ghost" data-limpiar="'+E(g.s.id)+'">Borrar esta tienda</button></div></div>'}).join('')+
  (L.length>1?'<div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-limpiar="*">Borrar las '+L.length+' tiendas</button></div>':'')+'</div>'};
function limpiar(s){s.products=[];if((s.gal||[]).length>FREE)s.gal=s.gal.slice(0,FREE);delete s.vid;delete s.vv;try{Object.keys(S.cart).forEach(function(k){if(k.indexOf(s.id+'|')===0)delete S.cart[k]})}catch(e){}}
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-limpiar]');if(!b||!isAdm())return;ev.preventDefault();ev.stopImmediatePropagation();
 var id=b.getAttribute('data-limpiar'),L=lista().filter(function(g){return id==='*'||g.s.id===id});if(!L.length)return toast('No hay tiendas por limpiar.');
 var n=L.reduce(function(a,g){return a+g.x[0]},0),msg=L.length===1?'¿Borrar '+qu(L[0].x)+' de «'+(L[0].s.name||'la tienda')+'»?':'¿Borrar los productos, las fotos extra y los videos de '+L.length+' tiendas ('+n+' productos)?';
 askC(msg+' No se puede deshacer.','Borrar').then(function(ok){if(!ok)return;L.forEach(function(g){limpiar(g.s)});save();toast(L.length===1?'Tienda limpiada':L.length+' tiendas limpiadas');setTimeout(function(){try{render(true)}catch(x){}},400)})},true);
})();
