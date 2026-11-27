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
/* v471: mientras se guarda (BUSY) el grupo elegido manda aunque un aviso del servidor rehaga S.site con la copia vieja */
var BUSY=null;
function mapa(){var m={};try{var b=S&&S.site&&S.site.catGrp;if(b&&typeof b==='object')m=b}catch(e){}
 if(BUSY){m=Object.assign({},m);if(BUSY.old&&BUSY.old!==BUSY.n)delete m[BUSY.old];m[BUSY.n]=BUSY.g}return m}
/* el grupo de una categoría: primero el que eligió el administrador, después el de fábrica */
var g0=window.catGroupOf;
if(typeof g0==='function')window.catGroupOf=function(n){var g=mapa()[n];if(typeof g==='string'&&grps().indexOf(g)>=0)return g;return g0(n)};
function row(i){var c=CATS[i];
 return '<div class="catrow"><input type="color" id="ct-c-'+i+'" value="'+E(c[2])+'" aria-label="Color de '+E(c[0])+'"><input type="text" id="ct-n-'+i+'" maxlength="20" value="'+E(c[0])+'" aria-label="Nombre de la subcategoría '+E(c[0])+'"><span class="cico sm" style="--c:'+E(c[2])+'">'+catIcon(c)+'</span><label class="btn ghost cfile">🖼️ Imagen<input type="file" accept="image/*" id="ct-f-'+i+'" hidden></label><button class="btn" id="ct-s-'+i+'" data-act="catSave" data-i="'+i+'" hidden>Guardar</button><button class="btn ghost" data-act="catDel" data-i="'+i+'">Eliminar</button>'+
  /* v476: pasar la subcategoría a otro grupo */
  (c[0]==='Otros'?'':'<label class="stmv"><span>Mover a</span><select data-stmove="'+i+'" aria-label="Mover '+E(c[0])+' a otro grupo">'+(function(){var g=catGroupOf(c[0]),L=grps();if(L.indexOf(g)<0)L.push(g);return L.map(function(x){return '<option value="'+E(x)+'"'+(x===g?' selected':'')+'>'+E(x)+'</option>'}).join('')})()+'</select></label>')+'</div>'}
window.stcAdmin=function(){var G=grps().slice(),by={};G.forEach(function(g){by[g]=[]});
 CATS.forEach(function(c,i){var g=catGroupOf(c[0]);if(!by[g]){by[g]=[];G.push(g)}by[g].push(i)});
 return '<div class="cg stca'+(BUSY?' stbusy':'')+'"><h3>Categorías de tiendas</h3><p class="muted">Cada grupo (Comidas, Belleza, Salud…) tiene sus subcategorías. Toca un grupo para cambiar el nombre, el color o la imagen de una subcategoría, pasarla a otro grupo con «Mover a», eliminarla o agregar una nueva. Si eliminas una, sus tiendas pasan a «Otros».</p>'+
  (BUSY?'<p class="stbm" role="status">Guardando «'+E(BUSY.n)+'»… Espera a que termine antes de hacer otro cambio.</p>':'')/* v471 */+
  G.map(function(g){var L=by[g];return '<details class="cgd stg"'+(OPEN[g]?' open':'')+' data-stg="'+E(g)+'"><summary><span>'+E(g)+'</span><small>'+L.length+(L.length===1?' subcategoría':' subcategorías')+'</small><i aria-hidden="true"></i></summary><div class="cgr">'+
   (L.length?L.map(row).join(''):'<p class="muted">Este grupo todavía no tiene subcategorías.</p>')+
   '<div class="catrow stadd"><input type="text" maxlength="20" placeholder="Nueva subcategoría" aria-label="Nueva subcategoría de '+E(g)+'"><button type="button" class="btn pink" data-stadd="'+E(g)+'">+ Agregar</button></div></div></details>'}).join('')+
  '<div class="err" id="err" role="alert"></div></div>'};
/* recuerda qué grupos están abiertos (el panel se vuelve a dibujar al guardar) */
document.addEventListener('toggle',function(e){var d=e.target;if(d&&d.classList&&d.classList.contains('stg'))OPEN[d.dataset.stg]=d.open},true);
function guardaMapa(m){S.site=Object.assign({},S.site,{catGrp:m})}
/* v471: CAUSA DE «NO GUARDA LAS SUBCATEGORÍAS NUEVAS». La página guarda los cambios uno por uno, y cada aviso de Firebase que llega
   mientras tanto rehace CATS y S.site con la copia del servidor (rebuild en 01-cats.js): lo que se cambió en ese rato y aún no
   se había enviado se pierde. Antes la subcategoría nueva se metía en medio de la lista y había que reescribir el orden (_o) de
   unas 30 categorías: varios segundos en los que una segunda subcategoría, o el grupo de la primera, se perdían.
   Ahora: (1) la nueva va antes de «Otros», como el «Agregar» de siempre (solo se escriben ella, «Otros» y la ficha del sitio);
   (2) mientras se guarda, el panel no deja hacer otro cambio de categorías; (3) se pregunta al servidor hasta que confirme la
   subcategoría y su grupo, y si un aviso los borró de la memoria se vuelven a poner y a guardar. */
var slugL=function(n){return String(n).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'x'};/* igual que slug() de 01-cats.js */
function esperar(){var t0=Date.now();
 (function tick(){if(!BUSY)return;var b=BUSY,ch=false;
  if(b.row&&!CATS.some(function(c){return c[0]===b.n})){var k=CATS.findIndex(function(c){return c[0]==='Otros'});if(k>=0)CATS.splice(k,0,b.row.slice());else CATS.push(b.row.slice());ch=true}
  var cg=(S.site&&S.site.catGrp)||{};if(cg[b.n]!==b.g||(b.old&&b.old!==b.n&&(b.old in cg))){guardaMapa(mapa());ch=true}
  if(ch)saveCats();
  var db=firebase.firestore(),srv={source:'server'};
  Promise.all([db.collection('meta').doc('site').get(srv),db.collection('cats').doc(slugL(b.n)).get(srv)]).then(function(r){
   var m=(r[0].exists&&(r[0].data()||{}).catGrp)||{};
   if(r[1].exists&&m[b.n]===b.g&&!(b.old&&b.old!==b.n&&(b.old in m))){BUSY=null;guardaMapa(Object.assign({},m));render(true);toast(b.ok)}else otra()},otra);
  function otra(){if(BUSY!==b)return;if(Date.now()-t0>30000){BUSY=null;render(true);toast('No se pudo confirmar que «'+b.n+'» quedó guardada. Revisa tu internet y vuelve a abrir Categorías.');return}setTimeout(tick,700)}
 })()}
/* v471: mientras se guarda, nada de otros cambios de categorías de tiendas */
document.addEventListener('click',function(e){if(!BUSY)return;var b=e.target.closest&&e.target.closest('.stca [data-stadd],.stca [data-act="catSave"],.stca [data-act="catDel"]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();toast('Espera un momento: se está guardando «'+BUSY.n+'».')},true);
/* agregar una subcategoría al grupo */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-stadd]');if(!b)return;e.preventDefault();
 if(typeof adm==='undefined'||!adm)return toast('Solo el administrador puede hacer esto.');
 var g=b.dataset.stadd,inp=b.parentNode.querySelector('input'),nn=(inp?inp.value:'').trim().replace(/\s+/g,' '),er=document.getElementById('err'),fail=function(t){if(er)er.textContent=t;/* v475: el aviso sale debajo del campo del grupo (antes solo al final de la lista, fuera de la pantalla) */var z=b.parentNode.nextElementSibling;if(!z||!z.classList.contains('sterr')){z=document.createElement('p');z.className='sterr';z.setAttribute('role','alert');b.parentNode.insertAdjacentElement('afterend',z)}z.textContent=t;if(inp)inp.focus()};
 if(!nn)return fail('Escribe el nombre de la subcategoría.');
 if(/[<>"`]/.test(nn))return fail('El nombre no puede llevar los signos < > " `.');
 if(CATS.some(function(c){return c[0].toLowerCase()===nn.toLowerCase()}))return fail('Ya existe una categoría con ese nombre.');
 if(typeof CAT_MAP!=='undefined'&&CAT_MAP.hasOwnProperty(nn))return fail('Ese nombre se usaba antes y la página lo cambia solo a «'+CAT_MAP[nn]+'». Elige otro.');
 var ix=[];CATS.forEach(function(c,i){if(catGroupOf(c[0])===g)ix.push(i)});
 var r=[nn,'',ix.length?CATS[ix[0]][2]:'#64748B'];
 /* v471: antes de «Otros» (en el panel sale igual al final de su grupo); antes iba en medio y movía el orden de casi todas */
 var k=CATS.findIndex(function(c){return c[0]==='Otros'});if(k>=0)CATS.splice(k,0,r);else CATS.push(r);
 var m=Object.assign({},mapa());Object.keys(m).forEach(function(x){if(!CATS.some(function(c){return c[0]===x}))delete m[x]});m[nn]=g;guardaMapa(m);
 BUSY={n:nn,g:g,row:r.slice(),ok:'Subcategoría «'+nn+'» guardada en '+g};
 OPEN[g]=true;saveCats();render(true);toast('Guardando «'+nn+'» en '+g+'…');esperar()},true);
/* v475: «Ir» o Enter en el teclado del celular también agrega la subcategoría (antes no hacía nada) */
document.addEventListener('keydown',function(e){if(e.key!=='Enter')return;var i=e.target.closest&&e.target.closest('.stca .stadd input');if(!i)return;e.preventDefault();var b=i.parentNode.querySelector('[data-stadd]');if(b)b.click()},true);
/* cambiar el nombre: la subcategoría se queda en su grupo */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-act="catSave"]');if(!b||!document.querySelector('.stca'))return;
 var i=+b.dataset.i,c=CATS[i];if(!c)return;var old=c[0],g=catGroupOf(old);
 setTimeout(function(){var n=CATS[i]&&CATS[i][0];if(!n||n===old)return;var m=Object.assign({},mapa());delete m[old];m[n]=g;guardaMapa(m);
  BUSY={n:n,g:g,old:old,ok:'«'+n+'» guardada en '+g}/* v471 */;save();render(true);esperar()},60)},true);
/* v476: mover una subcategoría a otro grupo. Sus tiendas se van con ella (el grupo sale del nombre de la categoría) */
document.addEventListener('change',function(e){var s=e.target.closest&&e.target.closest('.stca [data-stmove]');if(!s)return;
 var c=CATS[+s.dataset.stmove];if(!c)return;var n=c[0],de=catGroupOf(n),a=s.value;
 if(BUSY){s.value=de;return toast('Espera un momento: se está guardando «'+BUSY.n+'».')}
 if(typeof adm==='undefined'||!adm){s.value=de;return toast('Solo el administrador puede hacer esto.')}
 if(!a||a===de||grps().indexOf(a)<0)return;
 var m=Object.assign({},mapa());m[n]=a;guardaMapa(m);
 BUSY={n:n,g:a,ok:'«'+n+'» pasó a '+a};OPEN[a]=true;save();render(true);toast('Moviendo «'+n+'» a '+a+'…');esperar()},true);
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
 /* v471: aviso y botones en pausa mientras se guarda */
 '.stca .stbm{margin:8px 0 12px;padding:10px 12px;border-radius:var(--r-s,14px);background:#eef4ff;color:#1d3a6b;font-weight:600}html.dark .stca .stbm{background:#1d2a44!important;color:#cfe0ff!important}'+
 '.stca.stbusy [data-stadd],.stca.stbusy [data-act="catSave"],.stca.stbusy [data-act="catDel"]{opacity:.5;pointer-events:none}'+
 /* v475: aviso de error debajo del campo «Nueva subcategoría» */
 '.stca .sterr{margin:6px 0 0 22px;color:#c0392b;font-weight:600}html.dark .stca .sterr{color:#ff6b5e!important}'+
 /* v476: «Mover a» otro grupo */
 '.stca .stg .catrow{box-sizing:border-box;max-width:100%}.stca .stmv{display:flex;align-items:center;gap:8px;flex:1 1 100%;min-width:0;max-width:100%;margin-top:6px;font-size:14px;font-weight:600}.stca .stmv span{white-space:nowrap;flex:none}.stca .stmv select{flex:1 1 0;width:0;min-width:0;padding:8px 12px;border-radius:999px}'+
 '.stca.stbusy [data-stmove]{opacity:.5;pointer-events:none}'+
 'html.dark .stca .stg{background:#1e2026!important;border-color:#3b404b!important;color:#fff!important}html.dark .stca .stg summary i{background:#0a84ff!important}html.dark .stca .stg .cgr::before,html.dark .stca .stg .catrow::before{background:#3b4a66!important}</style>');
})();
