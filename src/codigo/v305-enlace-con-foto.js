
/* v305: la acción de GitHub deja en p/lista.json los productos que ya tienen su página con foto (p/<tienda>/<producto>(-<color>).html).
   La página la descarga al abrir y, en el pedido por WhatsApp y en «Preguntar al vendedor», usa ese enlace (WhatsApp muestra la foto);
   si el producto aún no tiene página, usa el enlace normal (logo del sitio). Si algo falla, borra este <script>: vuelve el enlace normal. */
(function(){var L=null;
function load(){if(!/^https?:$/.test(location.protocol))return;fetch('/p/lista.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():[]}).then(function(a){L=new Set(Array.isArray(a)?a:[])}).catch(function(){})}
load();setInterval(load,10*60000);
window.pLink=function(sid,p,co,sz){var v=co?vId(p,co):'',base=prodUrl(sid,p.id,v,sz);try{if(!L||!/^[A-Za-z0-9_-]+$/.test(sid+p.id))return base;
 var q=[],k=sid+'/'+p.id;if(v&&L.has(k+'-'+v)){if(sz)q.push('talla='+encodeURIComponent(sz));return location.origin+'/p/'+k+'-'+v+'.html'+(q.length?'?'+q.join('&'):'')}
 if(L.has(k)){if(v)q.push('v='+v);if(sz)q.push('talla='+encodeURIComponent(sz));return location.origin+'/p/'+k+'.html'+(q.length?'?'+q.join('&'):'')}}catch(e){}return base};
})();
