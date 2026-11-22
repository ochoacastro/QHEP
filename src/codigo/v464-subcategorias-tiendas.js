/* v464: SUBCATEGORÍAS DE TIENDAS EN EL PANEL. En Administrador → Categorías, «Categorías de tiendas» se muestra por grupos
   (Comidas, Belleza, Salud…, los de CAT_GRP en v215). Cada grupo se abre y tiene sus subcategorías (las categorías de CATS),
   cada una con nombre, color, imagen, «Guardar» y «Eliminar» como antes (mismos ids ct-* y acciones catSave / catDel), y abajo
   «+ Agregar» para crear una subcategoría dentro de ese grupo.
   El grupo de una subcategoría creada aquí se guarda en la ficha del sitio: S.site.catGrp = {nombre: grupo} (meta/site, que solo
   escribe el administrador; las reglas no cambian). catGroupOf() mira primero esa lista y después la de fábrica (CAT_GRP).
   Al cambiar el nombre de una subcategoría, conserva su grupo. Eliminar una pasa sus tiendas a «Otros» (catDel de siempre).
   Si algo falla, quita este archivo de src/orden.json: el panel vuelve a la lista sin grupos y lo creado aquí pasa al grupo «Otros». */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var OPEN={};
function grps(){try{return CAT_GRP.map(function(g){return g[0]})}catch(e){return []}}
function mapa(){try{var m=S&&S.site&&S.site.catGrp;return m&&typeof m==='object'?m:{}}catch(e){return {}}}
/* el grupo de una categoría: primero el que eligió el administrador, después el de fábrica */
var g0=window.catGroupOf;
if(typeof g0==='function')window.catGroupOf=function(n){var g=mapa()[n];if(typeof g==='string'&&grps().indexOf(g)>=0)return g;return g0(n)};
function row(i){var c=CATS[i];
 return '<div class="catrow"><input type="color" id="ct-c-'+i+'" value="'+E(c[2])+'" aria-label="Color de '+E(c[0])+'"><input type="text" id="ct-n-'+i+'" maxlength="20" value="'+E(c[0])+'" aria-label="Nombre de la subcategoría '+E(c[0])+'"><span class="cico sm" style="--c:'+E(c[2])+'">'+catIcon(c)+'</span><label class="btn ghost cfile">🖼️ Imagen<input type="file" accept="image/*" id="ct-f-'+i+'" hidden></label><button class="btn" id="ct-s-'+i+'" data-act="catSave" data-i="'+i+'" hidden>Guardar</button><button class="btn ghost" data-act="catDel" data-i="'+i+'">Eliminar</button></div>'}
window.stcAdmin=function(){var G=grps().slice(),by={};G.forEach(function(g){by[g]=[]});
 CATS.forEach(function(c,i){var g=catGroupOf(c[0]);if(!by[g]){by[g]=[];G.push(g)}by[g].push(i)});
 return '<div class="cg stca"><h3>Categorías de tiendas</h3><p class="muted">Cada grupo (Comidas, Belleza, Salud…) tiene sus subcategorías. Toca un grupo para cambiar el nombre, el color o la imagen de una subcategoría, eliminarla o agregar una nueva. Si eliminas una, sus tiendas pasan a «Otros».</p>'+
  G.map(function(g){var L=by[g];return '<details class="cgd stg"'+(OPEN[g]?' open':'')+' data-stg="'+E(g)+'"><summary><span>'+E(g)+'</span><small>'+L.length+(L.length===1?' subcategoría':' subcategorías')+'</small><i aria-hidden="true"></i></summary><div class="cgr">'+
   (L.length?L.map(row).join(''):'<p class="muted">Este grupo todavía no tiene subcategorías.</p>')+
   '<div class="catrow stadd"><input type="text" maxlength="20" placeholder="Nueva subcategoría" aria-label="Nueva subcategoría de '+E(g)+'"><button type="button" class="btn pink" data-stadd="'+E(g)+'">+ Agregar</button></div></div></details>'}).join('')+
  '<div class="err" id="err" role="alert"></div></div>'};
/* recuerda qué grupos están abiertos (el panel se vuelve a dibujar al guardar) */
document.addEventListener('toggle',function(e){var d=e.target;if(d&&d.classList&&d.classList.contains('stg'))OPEN[d.dataset.stg]=d.open},true);
function guardaMapa(m){S.site=Object.assign({},S.site,{catGrp:m})}
/* agregar una subcategoría al grupo */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-stadd]');if(!b)return;e.preventDefault();
 if(typeof adm==='undefined'||!adm)return toast('Solo el administrador puede hacer esto.');
 var g=b.dataset.stadd,inp=b.parentNode.querySelector('input'),nn=(inp?inp.value:'').trim().replace(/\s+/g,' '),er=document.getElementById('err'),fail=function(t){if(er)er.textContent=t;if(inp)inp.focus()};
 if(!nn)return fail('Escribe el nombre de la subcategoría.');
 if(/[<>"`]/.test(nn))return fail('El nombre no puede llevar los signos < > " `.');
 if(CATS.some(function(c){return c[0].toLowerCase()===nn.toLowerCase()}))return fail('Ya existe una categoría con ese nombre.');
 if(typeof CAT_MAP!=='undefined'&&CAT_MAP.hasOwnProperty(nn))return fail('Ese nombre se usaba antes y la página lo cambia solo a «'+CAT_MAP[nn]+'». Elige otro.');
 var ix=[];CATS.forEach(function(c,i){if(catGroupOf(c[0])===g)ix.push(i)});
 var r=[nn,'',ix.length?CATS[ix[0]][2]:'#64748B'];
 if(ix.length)CATS.splice(ix[ix.length-1]+1,0,r);else{var k=CATS.findIndex(function(c){return c[0]==='Otros'});if(k>=0)CATS.splice(k,0,r);else CATS.push(r)}
 var m=Object.assign({},mapa());Object.keys(m).forEach(function(x){if(!CATS.some(function(c){return c[0]===x}))delete m[x]});m[nn]=g;guardaMapa(m);
 OPEN[g]=true;saveCats();render(true);toast('Subcategoría «'+nn+'» agregada a '+g)},true);
/* cambiar el nombre: la subcategoría se queda en su grupo */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-act="catSave"]');if(!b||!document.querySelector('.stca'))return;
 var i=+b.dataset.i,c=CATS[i];if(!c)return;var old=c[0],g=catGroupOf(old);
 setTimeout(function(){var n=CATS[i]&&CATS[i][0];if(!n||n===old)return;var m=Object.assign({},mapa());delete m[old];m[n]=g;guardaMapa(m);save();render(true)},60)},true);
document.head.insertAdjacentHTML('beforeend','<style id="v464-css">'+
 /* mismo diseño que los grupos del formulario de la tienda (v283, que solo aplica dentro de #f-cats), con las esquinas de la v457 */
 '.stca .stg{width:100%;margin:0 0 8px;border:1px solid #d3d9e3;background:#fff;border-radius:var(--r-m,18px);overflow:hidden}'+
 '.stca .stg summary{list-style:none;display:flex;align-items:center;gap:10px;min-height:52px;padding:10px 12px 10px 14px;cursor:pointer;font-weight:700;font-size:16px}'+
 '.stca .stg summary::-webkit-details-marker{display:none}.stca .stg summary span{flex:1;min-width:0}'+
 '.stca .stg summary small{font-weight:400;font-size:13px;opacity:.7;white-space:nowrap}'+
 /* «+» muestra las subcategorías y «−» las oculta (como el botón «Escríbenos», v435) */
 '.stca .stg summary i{display:inline-flex;align-items:center;justify-content:center;flex:none;width:30px;height:30px;background:var(--rio,#0071e3);color:#fff;border-radius:999px;font-style:normal;font-weight:700;font-size:22px;line-height:1}'+
 '.stca .stg summary i::before{content:"+"}.stca .stg[open] summary i::before{content:"\\2212"}'+
 '.stca .stg summary:focus-visible{outline:3px solid var(--rio,#0071e3);outline-offset:2px}'+
 /* escalonado: las subcategorías van debajo del grupo, con sangría y una línea que las une a su grupo */
 '.stca .stg .cgr{padding:0 12px 12px 26px;position:relative}'+
 '.stca .stg .cgr::before{content:"";position:absolute;left:27px;top:0;bottom:30px;width:2px;background:#c9d8f5}'+
 '.stca .stg .catrow{position:relative;margin:10px 0 0;padding:8px 0 8px 22px}'+
 '.stca .stg .catrow::before{content:"";position:absolute;left:1px;top:30px;width:16px;height:2px;background:#c9d8f5}'+
 '.stca .stg .cgr>.muted{margin:10px 0 0 22px}.stca .stg .stadd{margin-top:12px}'+
 'html.dark .stca .stg{background:#1e2026!important;border-color:#3b404b!important;color:#fff!important}html.dark .stca .stg summary i{background:#0a84ff!important}html.dark .stca .stg .cgr::before,html.dark .stca .stg .catrow::before{background:#3b4a66!important}</style>');
})();
