/* v480: SELECTOR DE MEDIDA EN LA MUEBLERÍA. En el inventario cada medida es un producto aparte, con su precio y sus existencias
   («Colchón Orthopack (Doble 140 x 190)»). «Publicar tienda» manda a Mi Pradera ferM (la medida) y ferG (el modelo) de cada uno.
   En la tienda de una mueblería, las medidas del mismo modelo se ven como UNA tarjeta con el selector «140 x 190 | Doble»: al
   cambiarlo se muestra la tarjeta de esa medida (su precio, su descuento, «Agotado» y su «Agregar al carrito»). El carrito y el
   mensaje de WhatsApp llevan el nombre con la medida, sin cambiar el carrito de Mi Pradera.
   La llama la v479 (window.qhMueTallas) antes de filtrar. Solo mira la página y oculta tarjetas; no guarda nada. */
(function(){
var ORD=['Sencillo','Semidoble','Doble','Queen','King'],sel={};
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var rot=function(m){var p=String(m||'').match(/^(.+?) (\d+ x \d+)$/);/* v486: también «Tapete Pequeño 80 x 150» */return p?p[2]+' | '+p[1]:String(m||'')};/* «Doble 140 x 190» → «140 x 190 | Doble»; v482: otras medidas («3 puestos») quedan igual */
var pos=function(m){if(m==='Medida única')return -1;/* v486 */var t=/^Tapete (Pequeño|Mediano|Grande) /.exec(m||'');if(t)return 10+['Pequeño','Mediano','Grande'].indexOf(t[1]);var k=/^(?:Unidad|Pack) \| (\d+) /.exec(m||'');if(k)return 20+(+k[1]);/* almohadas: unidad y paquetes */var i=ORD.indexOf(String(m||'').split(' ')[0]);return i<0?99:i};
var base=function(n,p){if(p&&p.ferN)return String(p.ferN);/* v482: el inventario de mueblería manda el nombre sin medida ni color */return String(n||'').replace(/\s*\((?:Sencillo|Semidoble|Doble|Queen|King) \d+ x \d+\)$/,'')};
var uniq=function(L){return L.filter(function(x,i){return x&&L.indexOf(x)===i})};
window.qhMueTallas=function(byId){
 var cards=[].slice.call(document.querySelectorAll('#app .pgrid .prod')),grupos={};
 cards.forEach(function(card){var b=card.querySelector('[data-act="prod"][data-id],[data-act="add"][data-id]'),p=b&&byId[b.getAttribute('data-id')];
  card.classList.remove('qmu-sz');if(p)enc(card,p);if(!p||!p.ferG||!(p.ferM||p.ferC))return;(grupos[p.ferG]=grupos[p.ferG]||[]).push({card:card,p:p})});
 Object.keys(grupos).forEach(function(g){var L=grupos[g];if(L.length<2)return;
  L.sort(function(a,b){return pos(a.p.ferM)-pos(b.p.ferM)});
  var elegido=L.filter(function(x){return x.p.id===sel[g]})[0]||L.filter(function(x){return !x.p.out})[0]||L[0];
  L.forEach(function(x){if(x!==elegido)x.card.classList.add('qmu-sz')});
  var c=elegido.card,t=c.querySelector('h3 .plink')||c.querySelector('h3');if(t&&t.textContent!==base(elegido.p.name,elegido.p))t.textContent=base(elegido.p.name,elegido.p);
  /* v482: un selector de medida y otro de color (el inventario de mueblería lleva existencias por medida y color) */
  var em=elegido.p.ferM||'',ec=elegido.p.ferC||'',M=uniq(L.map(function(x){return x.p.ferM||''})),C=uniq(L.map(function(x){return x.p.ferC||''}));
  var agot=function(m,c){var r=L.filter(function(x){return (x.p.ferM||'')===m&&(x.p.ferC||'')===c})[0];return !r||r.p.out};
  var sl=function(d,lab,V,act,ag){return '<label class="qmu-med"><span class="qmu-mt">'+lab+'</span><select data-qmu-g="'+E(g)+'" data-qmu-d="'+d+'" aria-label="'+lab+' de '+E(base(elegido.p.name,elegido.p))+'">'+V.map(function(v){return '<option value="'+E(v)+'"'+(v===act?' selected':'')+'>'+E(d==='m'?rot(v):v)+(ag(v)?' (agotado)':'')+'</option>'}).join('')+'</select></label>'};
  var h=(M.length>1||(M.length===1&&!C.length)?sl('m','Medida',M,em,function(v){return agot(v,ec)}):'')+(C.length>1||(C.length===1&&!M.length)?sl('c','Color',C,ec,function(v){return agot(em,v)}):'');
  var w=c.querySelector('.qmu-sel');
  if(!w){w=document.createElement('div');w.className='qmu-sel';var pr=c.querySelector('.price');if(pr)pr.parentNode.insertBefore(w,pr);else c.appendChild(w)}
  if(w.getAttribute('data-h')!==h){w.innerHTML=h;w.setAttribute('data-h',h)}
  grupos[g].tabla=L});
 GR=grupos;
 /* tarjetas que ya no están agrupadas (otro producto en ese lugar) pierden el selector */
 cards.forEach(function(c){var w=c.querySelector('.qmu-sel');if(!w)return;if(c.classList.contains('qmu-sz')){w.remove();return}/* la tarjeta oculta no guarda su selector */var s=w.querySelector('select'),g=s&&s.getAttribute('data-qmu-g');if(!g||!grupos[g]||grupos[g].length<2)w.remove()})};
/* v482: «Por encargo · entrega en N días» (ferE) debajo del nombre */
function enc(card,p){var e=card.querySelector('.qmu-enc'),n=+p.ferE||0,t=n?'Por encargo · entrega en '+n+(n===1?' día':' días'):'';
 if(!n){if(e)e.remove();return}if(!e){e=document.createElement('p');e.className='qmu-enc';var h=card.querySelector('h3');if(h)h.parentNode.insertBefore(e,h.nextSibling);else card.appendChild(e)}if(e.textContent!==t)e.textContent=t}
var GR={};
document.addEventListener('change',function(e){var s=e.target.closest&&e.target.closest('select[data-qmu-g]');if(!s)return;var g=s.getAttribute('data-qmu-g'),d=s.getAttribute('data-qmu-d'),L=(GR[g]&&GR[g].tabla)||[],v=s.value;
 var act=L.filter(function(x){return x.p.id===sel[g]})[0]||L.filter(function(x){return !x.card.classList.contains('qmu-sz')})[0]||L[0];if(!act)return;
 var otro=d==='m'?(act.p.ferC||''):(act.p.ferM||''),mismo=function(x){return (d==='m'?(x.p.ferM||''):(x.p.ferC||''))===v};
 /* la misma medida (o color) con el otro valor que ya estaba; si esa combinación no existe, la primera que tenga lo elegido */
 var r=L.filter(function(x){return mismo(x)&&(d==='m'?(x.p.ferC||''):(x.p.ferM||''))===otro})[0]||L.filter(function(x){return mismo(x)&&!x.p.out})[0]||L.filter(mismo)[0];
 if(r)sel[g]=r.p.id;
 if(typeof window.qhMueAplicar==='function')window.qhMueAplicar();var c=document.querySelector('select[data-qmu-g="'+g.replace(/"/g,'\\"')+'"][data-qmu-d="'+d+'"]');if(c)c.focus()});
})();
