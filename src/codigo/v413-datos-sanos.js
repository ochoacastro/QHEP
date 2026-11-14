/* v413: DATOS SANOS. Las reglas de Firestore dejan que el dueño de una publicación escriba en ella campos de cualquier tipo
   (por ejemplo, con la consola del navegador: «tags» como texto en vez de lista). Antes, UNA sola publicación así tumbaba el
   inicio para todos los visitantes. Ahora, al leer cada documento de tiendas, productos, servicios, anuncios y clasificados,
   los campos conocidos que lleguen con un tipo equivocado se corrigen en memoria (texto → '', lista → [], etc.).
   - Un documento bien hecho no cambia en nada.
   - En el panel, las publicaciones propias no se tocan (así nunca se guarda de vuelta algo corregido sin querer).
   - En el modo administrador sí se corrigen, para que pueda ver y borrar la publicación dañada.
   Se usa en rebuild() y comListen() de principal/01-cats.js (window.docFix). Si algo falla, borra este <script>:
   la página vuelve a leer los documentos tal como llegan. */
(function(){
var STR='name title desc d cat logo emoji kind owner wa wa2 zone age open close addr plus delivery dfee dcost cover vid video shutN type text link img sub op cond author sid id ownerKey ownerUid c1 c2 vtype fuel pl'.split(' '),
    ARR='days tags pays gal imgs rates rU cimgs'.split(' '),OBJ='hrs social f'.split(' '),NUM='lat lng ts exp pexp fexp pause _o'.split(' '),
    TXT={tags:1,pays:1,gal:1,imgs:1,rU:1},REQ={name:1,title:1},
    NEED={stores:'name',products:'name',services:'name',ads:'title',community:'title'};/* el campo que la página da por hecho en cada colección */
function po(v){return !!v&&typeof v==='object'&&!Array.isArray(v)}
function str(v,k){return typeof v==='string'?v:(typeof v==='number'&&isFinite(v)?String(v):(REQ[k]?'Sin nombre':''))}
function fix(c,o){if(!po(o))return o;var n=0,k,i,v;
 for(i=0;i<STR.length;i++){k=STR[i];if(k in o&&o[k]!=null&&typeof o[k]!=='string'){o[k]=str(o[k],k);n++}}
 for(i=0;i<ARR.length;i++){k=ARR[i];if(!(k in o)||o[k]==null)continue;
  if(!Array.isArray(o[k])){o[k]=[];n++;continue}
  v=o[k].filter(TXT[k]?function(x){return typeof x==='string'}:k==='days'?function(x){return typeof x==='number'}:po);
  if(v.length!==o[k].length){o[k]=v;n++}}
 for(i=0;i<OBJ.length;i++){k=OBJ[i];if(k in o&&o[k]!=null&&!po(o[k])){if(k==='hrs')delete o[k];else o[k]={};n++}}
 for(i=0;i<NUM.length;i++){k=NUM[i];if(k in o&&o[k]!=null&&!(typeof o[k]==='number'&&isFinite(o[k]))){if(k==='ts'||k==='_o')o[k]=0;else delete o[k];n++}}
 k=NEED[c];if(k&&typeof o[k]!=='string'){o[k]='Sin nombre';n++}
 if(c==='ads'&&!po(o.f)){o.f={};n++}
 /* un anuncio con un tipo que no existe no sale en ninguna lista, pero abrirlo por su enlace daba error: queda como arriendo oculto */
 if(c==='ads'&&typeof ADT==='object'&&!ADT[o.type]){o.type='arr';o.hidden=true;n++}
 if('price' in o&&o.price!=null&&typeof o.price!=='number'&&typeof o.price!=='string'){o.price=0;n++}
 if(po(o.f))for(k in o.f){v=o.f[k];if(v!=null&&typeof v==='object'&&!Array.isArray(v)){delete o.f[k];n++}}
 if(po(o.social))for(k in o.social)if(typeof o.social[k]!=='string'){delete o.social[k];n++}
 if(Array.isArray(o.rates))o.rates.forEach(function(r){['u','name','txt'].forEach(function(q){if(q in r&&typeof r[q]!=='string'){r[q]=str(r[q]);n++}});if(typeof r.n!=='number'||!(r.n>=1&&r.n<=5)){r.n=Math.min(5,Math.max(1,Math.round(Number(r.n))||1));n++}});
 if(n)try{(window.docFixLog=window.docFixLog||[]).push(c+'/'+(o.id||''));if(window.console&&console.warn&&docFixLog.length<=20)console.warn('v413: publicación con datos dañados: '+c+'/'+(o.id||''))}catch(e){}
 return o}
window.docFix=function(c,o){try{
  if(typeof MODE!=='undefined'&&MODE==='panel'&&o&&o.ownerKey){var k='';try{k=QH.key()}catch(e){}if(k&&o.ownerKey===k)return o}
  return fix(c,o)}catch(e){return o}};
})();
