/* v480: SELECTOR DE MEDIDA EN LA MUEBLERÍA. En el inventario cada medida es un producto aparte, con su precio y sus existencias
   («Colchón Orthopack (Doble 140 x 190)»). «Publicar tienda» manda a Mi Pradera ferM (la medida) y ferG (el modelo) de cada uno.
   En la tienda de una mueblería, las medidas del mismo modelo se ven como UNA tarjeta con el selector «140 x 190 | Doble»: al
   cambiarlo se muestra la tarjeta de esa medida (su precio, su descuento, «Agotado» y su «Agregar al carrito»). El carrito y el
   mensaje de WhatsApp llevan el nombre con la medida, sin cambiar el carrito de Mi Pradera.
   La llama la v479 (window.qhMueTallas) antes de filtrar. Solo mira la página y oculta tarjetas; no guarda nada. */
(function(){
var ORD=['Sencillo','Semidoble','Doble','Queen','King'],sel={};
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var rot=function(m){var p=String(m||'').match(/^(\S+) (.+)$/);return p?p[2]+' | '+p[1]:String(m||'')};/* «Doble 140 x 190» → «140 x 190 | Doble» */
var pos=function(m){var i=ORD.indexOf(String(m||'').split(' ')[0]);return i<0?99:i};
var base=function(n){return String(n||'').replace(/\s*\((?:Sencillo|Semidoble|Doble|Queen|King) \d+ x \d+\)$/,'')};
window.qhMueTallas=function(byId){
 var cards=[].slice.call(document.querySelectorAll('#app .pgrid .prod')),grupos={};
 cards.forEach(function(card){var b=card.querySelector('[data-act="prod"][data-id],[data-act="add"][data-id]'),p=b&&byId[b.getAttribute('data-id')];
  card.classList.remove('qmu-sz');if(!p||!p.ferG||!p.ferM)return;(grupos[p.ferG]=grupos[p.ferG]||[]).push({card:card,p:p})});
 Object.keys(grupos).forEach(function(g){var L=grupos[g];if(L.length<2)return;
  L.sort(function(a,b){return pos(a.p.ferM)-pos(b.p.ferM)});
  var elegido=L.filter(function(x){return x.p.id===sel[g]})[0]||L.filter(function(x){return !x.p.out})[0]||L[0];
  L.forEach(function(x){if(x!==elegido)x.card.classList.add('qmu-sz')});
  var c=elegido.card,t=c.querySelector('h3 .plink')||c.querySelector('h3');if(t&&t.textContent!==base(elegido.p.name))t.textContent=base(elegido.p.name);
  var opts=L.map(function(x){return '<option value="'+E(x.p.id)+'"'+(x===elegido?' selected':'')+'>'+E(rot(x.p.ferM))+(x.p.out?' (agotado)':'')+'</option>'}).join('');
  var w=c.querySelector('.qmu-med'),h='<span class="qmu-mt">Medida</span><select data-qmu-g="'+E(g)+'" aria-label="Medida de '+E(base(elegido.p.name))+'">'+opts+'</select>';
  if(!w){w=document.createElement('label');w.className='qmu-med';var pr=c.querySelector('.price');if(pr)pr.parentNode.insertBefore(w,pr);else c.appendChild(w)}
  if(w.getAttribute('data-h')!==h){w.innerHTML=h;w.setAttribute('data-h',h)}});
 /* tarjetas que ya no están agrupadas (otro producto en ese lugar) pierden el selector */
 cards.forEach(function(c){var w=c.querySelector('.qmu-med');if(!w)return;if(c.classList.contains('qmu-sz')){w.remove();return}/* la tarjeta oculta no guarda su selector */var s=w.querySelector('select'),g=s&&s.getAttribute('data-qmu-g');if(!g||!grupos[g]||grupos[g].length<2)w.remove()})};
document.addEventListener('change',function(e){var s=e.target.closest&&e.target.closest('select[data-qmu-g]');if(!s)return;sel[s.getAttribute('data-qmu-g')]=s.value;
 if(typeof window.qhMueAplicar==='function')window.qhMueAplicar();var c=document.querySelector('select[data-qmu-g="'+s.getAttribute('data-qmu-g').replace(/"/g,'\\"')+'"]');if(c)c.focus()});
})();
