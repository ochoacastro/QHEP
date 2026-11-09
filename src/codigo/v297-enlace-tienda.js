
/* v297: enlaces con el nombre de la tienda: #/t/<nombre>-<id> y #/p/<nombre>-<id>/<producto>.
   El id va al final para que dos tiendas con el mismo nombre no se confundan; los enlaces viejos (#/t/<id>) siguen funcionando.
   Además, «Compartir» de cada tienda en Mis tiendas. Si algo falla, borra este <script> (y vuelve storeUrl/prodUrl/route a usar el id). */
(function(){
function slug(t){return String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40).replace(/-+$/,'')}
function byId(id){try{return S.stores.find(function(x){return x.id===id})}catch(e){return null}}
window.stRefId=function(id){var s=byId(id),n=s?slug(s.name):'';return n?n+'-'+encodeURIComponent(id):encodeURIComponent(id)};
window.stFind=function(ref){ref=String(ref||'').split('?')[0];var s=byId(ref);if(s)return s;
 var i=ref.lastIndexOf('-');if(i>0){s=byId(ref.slice(i+1));if(s)return s}
 var l=S.stores.filter(function(x){return slug(x.name)===ref});return l.length===1?l[0]:null};
document.addEventListener('click',async function(e){var b=e.target.closest&&e.target.closest('[data-stshare]');if(!b)return;e.preventDefault();var id=b.getAttribute('data-stshare'),s=byId(id);if(!s)return;
 var u=storeUrl(id),tx='Visita '+s.name+' en Mi Pradera'+(s.cat?' ('+s.cat+')':'')+'. Mira sus productos y escríbenos por WhatsApp:';
 try{if(navigator.share){await navigator.share({title:s.name+' – Mi Pradera',text:tx,url:u});return}}catch(x){if(x&&x.name==='AbortError')return}
 try{await navigator.clipboard.writeText(tx+' '+u);toast('Enlace copiado: pégalo en tus redes')}catch(x){toast(u)}});
})();
