
/* v287: categorías de Clasificados reorganizadas y editables por el administrador.
   - cmNorm(a): pasa los anuncios viejos (Tecnología, Hogar y muebles, Artículos varios…) a las categorías nuevas al leerlos; Firestore no se toca.
   - S.site.cmCats (ficha del sitio, la guarda el administrador): lista de {k,i,n,d,s:[subcategorías],off}. Si no existe, se usan las de fábrica.
     Las ocultas (off) no se ofrecen al publicar ni al filtrar, pero los anuncios viejos siguen mostrando su categoría (CM_HID).
   - S.site.qsug: «Lo más buscado» de la portada (si está vacío se arma solo con lo más publicado).
   Si algo falla, borra este <script> y su <style>, y quita las 4 líneas marcadas v287. */
(function(){
var MIG={tec:{'Celulares':['cel','Celulares'],'Computadores y tabletas':['comp','Otros'],'Televisores y sonido':['tva','Televisores'],'Consolas y videojuegos':['jue','Consolas'],'Electrodomésticos':['ele','Otros electrodomésticos'],'Cámaras':['tva','Cámaras y drones'],'Accesorios y repuestos':['cel','Accesorios'],'*':['comp','Otros']},
 hog:{'Camas y colchones':['mue','Camas y colchones'],'Comedores':['mue','Comedores'],'Salas y sofás':['mue','Salas y sofás'],'Clósets y organizadores':['mue','Clósets y organizadores']},
 moda:{'Ropa de niños y bebés':['nin','Ropa de niños y bebés']},
 cv:{'Deportes':['dep','Otros deportes'],'Bebés y niños':['nin','Otros artículos para bebés'],'Juguetes y juegos':['nin','Juguetes'],'Libros y papelería':['mus','Libros y papelería'],'Instrumentos musicales':['mus','Instrumentos musicales'],'Herramientas':['cons','Herramientas'],'Salud y belleza':['moda','Belleza y cuidado personal'],'Coleccionables':['mus','Coleccionables']}};
window.cmNorm=function(a){try{var m=a&&MIG[a.cat];if(!m)return a;var t=m[a.sub]||(a.cat==='tec'?m['*']:null);if(t){a._cat0=a.cat;a.cat=t[0];a.sub=t[1]}}catch(e){}return a};
var PROT={inm:1,veh:1,serv:1,emp:1,com:1},DEF=null,SIG='~';
var ICONS=[['🏠','Casa'],['🚗','Carro'],['🏍️','Moto'],['📱','Celular'],['💻','Computador'],['🎧','Audio'],['🎮','Videojuegos'],['🔌','Electrodomésticos'],['🛋️','Muebles'],['🍳','Cocina'],['👗','Moda'],['👟','Zapatos'],['💄','Belleza'],['⚽','Deportes'],['🍼','Bebés'],['🧸','Juguetes'],['🎸','Música'],['📚','Libros'],['🧱','Construcción'],['🔧','Herramientas'],['💼','Empleo'],['🐄','Agro'],['🌱','Plantas'],['🐶','Mascotas'],['🎓','Educación'],['🎉','Fiestas'],['🍽️','Comida'],['🎁','Regalos'],['📦','Caja'],['🛒','Carrito'],['🤝','Comunidad']];
function E(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function def(){if(!DEF&&typeof CM_CATS!=='undefined')DEF=CM_CATS.map(function(c){return {k:c[0],i:c[1],n:c[2],d:c[3],s:c[4].slice()}});return DEF||[]}
function cur(){var l=(typeof S==='object'&&S&&S.site&&Array.isArray(S.site.cmCats)&&S.site.cmCats.length)?S.site.cmCats:null;return l||def()}
/* aplica la lista guardada (o la de fábrica) a CM_CATS sin cambiar su referencia */
function apply(){try{if(typeof CM_CATS==='undefined'||typeof S!=='object')return;def();var raw=S.site&&S.site.cmCats,sig=JSON.stringify(raw||null);if(sig===SIG)return;SIG=sig;
 var l=cur().filter(function(c){return c&&typeof c.k==='string'&&c.k&&c.n&&Array.isArray(c.s)}),seen={};l=l.filter(function(c){if(seen[c.k])return false;seen[c.k]=1;return true});
 def().forEach(function(c){if(PROT[c.k]&&!seen[c.k])l.push(c)});/* las especiales siempre existen */
 l.forEach(function(c){if(c.k==='com'&&c.s.indexOf('Obituarios')<0)c.s=c.s.concat(['Obituarios'])});
 var vis=[],hid=[];l.forEach(function(c){var r=[c.k,c.i||'🛒',String(c.n),String(c.d||''),c.s.map(String).filter(Boolean)];if(!r[4].length)r[4]=['Otros'];(c.off&&!PROT[c.k]?hid:vis).push(r)});
 CM_CATS.length=0;vis.forEach(function(r){CM_CATS.push(r)});window.CM_HID=hid;
 if(typeof render==='function'&&!document.querySelector('#ov')&&typeof view!=='undefined'&&(view==='com'||view==='home'))render(true)}catch(e){}}
setInterval(apply,1000);setTimeout(apply,0);
/* ---------- administración ---------- */
var AL=null;
function rowHTML(c,i,n){var off=!!c.off,pr=!!PROT[c.k];
 return '<details class="cmcr'+(off?' off':'')+'" data-i="'+i+'"><summary><span>'+E(c.i)+' '+E(c.n)+(pr?'<em class="cmct">fija</em>':'')+(off?'<em class="cmct">oculta</em>':'')+'</span><small>'+c.s.length+' subcategorías</small></summary><div class="cmcb">'+
 '<label>Nombre</label><input type="text" maxlength="40" data-f="n" value="'+E(c.n)+'">'+
 '<label>Descripción corta</label><input type="text" maxlength="120" data-f="d" value="'+E(c.d||'')+'">'+
 '<label>Ícono</label><select data-f="i">'+ICONS.map(function(x){return '<option value="'+x[0]+'"'+(x[0]===c.i?' selected':'')+'>'+x[1]+'</option>'}).join('')+(ICONS.some(function(x){return x[0]===c.i})?'':'<option value="'+E(c.i)+'" selected>Actual</option>')+'</select>'+
 '<label>Subcategorías (una por línea)</label><textarea data-f="s" rows="6">'+E(c.s.join('\n'))+'</textarea>'+(c.k==='com'?'<p class="muted">«Obituarios» siempre se mantiene en esta categoría.</p>':'')+
 '<div class="row"><button type="button" class="btn ghost" data-cmc="up" data-i="'+i+'"'+(i?'':' disabled')+'>Subir</button><button type="button" class="btn ghost" data-cmc="down" data-i="'+i+'"'+(i<n-1?'':' disabled')+'>Bajar</button>'+(pr?'':'<button type="button" class="btn ghost" data-cmc="off" data-i="'+i+'">'+(off?'Mostrar':'Ocultar')+'</button>')+'</div></div></details>'}
function paint(){var w=document.getElementById('cmc-rows');if(w)w.innerHTML=AL.map(function(c,i){return rowHTML(c,i,AL.length)}).join('')}
function read(){var open={};[].forEach.call(document.querySelectorAll('#cmc-rows .cmcr'),function(d){var i=+d.dataset.i,c=AL[i];if(!c)return;open[i]=d.open;
 var g=function(f){var e=d.querySelector('[data-f="'+f+'"]');return e?e.value:''};c.n=g('n').trim().slice(0,40);c.d=g('d').trim().slice(0,120);c.i=g('i')||c.i;
 var sl=g('s').split('\n').map(function(x){return x.trim().slice(0,50)}).filter(Boolean),u={};c.s=sl.filter(function(x){var k=x.toLowerCase();if(u[k])return false;u[k]=1;return true}).slice(0,30)});return open}
function reopen(o){[].forEach.call(document.querySelectorAll('#cmc-rows .cmcr'),function(d){if(o[+d.dataset.i])d.open=true})}
window.cmcAdmin=function(){if(!AL)AL=JSON.parse(JSON.stringify(cur()));var q=(S.site&&Array.isArray(S.site.qsug))?S.site.qsug:[];
 return '<div class="cg cmca"><h3>Lo más buscado (portada)</h3><p class="muted">Búsquedas que aparecen bajo el buscador de la portada para tocar con un dedo. Una por línea, máximo 12. Si lo dejas vacío, se arman solas con lo más publicado.</p><textarea id="qsug-t" rows="5" placeholder="Ej:&#10;Arriendo&#10;Moto&#10;Celulares&#10;Domicilios">'+E(q.join('\n'))+'</textarea><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-cmc="qsave">Guardar «Lo más buscado»</button></div></div>'+
 '<div class="cg cmca" style="margin-top:14px"><h3>Categorías de Clasificados</h3><p class="muted">Toca una categoría para cambiar su nombre, ícono y subcategorías. Las marcadas «fija» se usan en otras partes de la página y no se pueden ocultar. Ocultar no borra los anuncios: solo deja de ofrecerse al publicar.</p><div id="cmc-rows">'+AL.map(function(c,i){return rowHTML(c,i,AL.length)}).join('')+'</div>'+
 '<div class="row" style="margin-top:10px"><button type="button" class="btn ghost" data-cmc="add">+ Agregar categoría</button><button type="button" class="btn ghost" data-cmc="reset">Volver a las de fábrica</button></div><p class="err" id="cmc-err" role="alert"></p><div class="row"><button type="button" class="btn pink" data-cmc="save">Guardar categorías</button></div></div>'};
document.addEventListener('click',async function(e){var b=e.target.closest&&e.target.closest('[data-cmc]');if(!b||!AL)return;e.preventDefault();var a=b.dataset.cmc,i=+b.dataset.i,o;
 if(a==='qsave'){var t=(document.getElementById('qsug-t')||{}).value||'',l=t.split('\n').map(function(x){return x.trim().slice(0,30)}).filter(Boolean).slice(0,12);S.site=Object.assign({},S.site,{qsug:l});save();toast(l.length?'«Lo más buscado» guardado':'«Lo más buscado» vuelve a ser automático');return}
 o=read();
 if(a==='up'&&i>0){var x=AL[i];AL[i]=AL[i-1];AL[i-1]=x;var t1=o[i];o[i]=o[i-1];o[i-1]=t1;paint();reopen(o)}
 else if(a==='down'&&i<AL.length-1){var y=AL[i];AL[i]=AL[i+1];AL[i+1]=y;var t2=o[i];o[i]=o[i+1];o[i+1]=t2;paint();reopen(o)}
 else if(a==='off'){AL[i].off=!AL[i].off;paint();o[i]=true;reopen(o)}
 else if(a==='add'){AL.push({k:'c'+Date.now().toString(36),i:'📦',n:'Nueva categoría',d:'',s:['Otros']});paint();var r=document.querySelectorAll('#cmc-rows .cmcr');reopen(o);if(r.length){var lr=r[r.length-1];lr.open=true;lr.scrollIntoView({block:'center'});var f=lr.querySelector('[data-f="n"]');if(f){f.focus();f.select()}}}
 else if(a==='reset'){if(await askC('¿Volver a las categorías de fábrica? Se pierden los cambios que hiciste.','Volver')){AL=JSON.parse(JSON.stringify(def()));paint()}}
 else if(a==='save'){var er=document.getElementById('cmc-err'),bad=AL.filter(function(c){return !c.n||!c.s.length});if(bad.length){if(er)er.textContent='Cada categoría necesita un nombre y al menos una subcategoría.';return}if(er)er.textContent='';
  var out=AL.map(function(c){var r={k:c.k,i:c.i,n:c.n,d:c.d||'',s:c.s.slice()};if(c.off&&!PROT[c.k])r.off=true;return r});S.site=Object.assign({},S.site,{cmCats:out});save();AL=null;render(true);toast('Categorías de Clasificados guardadas')}});
})();
