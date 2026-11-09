
/* v215: categorias de tiendas reorganizadas: nombres de Colombia, sin repetidas y agrupadas en 14 grupos.
   CAT_MAP pasa los nombres viejos a los nuevos (en la lista de categorias y en las tiendas). Solo actua si encuentra
   nombres viejos; las categorias que el administrador cree despues se respetan. En el modo administrador el cambio
   se guarda solo en Firestore. Si algo falla, borra este <script id="v215-categorias"> y el <style id="v215-categorias-css">
   y revierte COMIDAS, SUPER_RE, MAIN_X, MLC, la lista que se fuerza en CATS y catsView. */
var CAT_GRP=[
 ['Comidas',[['Restaurantes','🍽️','#B23A2E'],['Comidas rápidas','🍔','#C2410C'],['Panaderías y pastelerías','🥐','#B45309']]],
 ['Belleza',[['Barberías','💈','#0F766E'],['Salones de belleza','💇‍♀️','#DB2777'],['Peluquerías unisex','✂️','#7C3AED'],['Belleza y cosméticos','💄','#BE123C']]],
 ['Tiendas y supermercados',[['Tiendas y minimercados','🛒','#2E7D5B'],['Licoreras','🍷','#8A4B1A']]],
 ['Salud',[['Droguerías','💊','#1E6FBF']]],
 ['Moda',[['Ropa y calzado','👕','#4A4A6A'],['Joyas, relojes y accesorios','💍','#A16207']]],
 ['Tecnología',[['Celulares y computadores','📱','#C0392B'],['Electrodomésticos','🔌','#2B3A55']]],
 ['Hogar y construcción',[['Hogar y decoración','🛋️','#9A3412'],['Ferreterías','🔧','#B45309'],['Cacharrerías y misceláneas','🛍️','#475569']]],
 ['Papelería y libros',[['Papelerías y librerías','📚','#6D28D9']]],
 ['Mascotas y agro',[['Mascotas y veterinarias','🐶','#A0551A'],['Acuarios y peces','🐟','#0369A1'],['Agro y jardinería','🌱','#15803D']]],/* v283: Acuarios y peces */
 ['Niños',[['Bebés y niños','🍼','#DB2777'],['Juguetes y videojuegos','🧸','#C2410C']]],
 ['Fiestas y regalos',[['Fiestas y eventos','🎉','#9F1239'],['Flores y regalos','💐','#BE185D'],['Alquiler de artículos','🎪','#0E7490']]],
 ['Deportes',[['Productos deportivos','⚽','#15803D'],['Productos de gimnasio','🏋️','#0F766E'],['Ropa deportiva','👟','#1D4ED8']]],/* v283: Deportes con 3 subcategorías */
 ['Vehículos',[['Repuestos y accesorios para vehículos','🚗','#1E4FBF']]],
 ['Otros',[['Otros','🛍️','#64748B']]]];
var CAT_MAP={'Abarrotes':'Tiendas y minimercados','Farmacia':'Droguerías','Licores':'Licoreras','Comida':'Restaurantes','Panadería y pastelería':'Panaderías y pastelerías',
 'Ropa':'Ropa y calzado','Calzado':'Ropa y calzado','Moda y accesorios':'Ropa y calzado','Joyas y relojes':'Joyas, relojes y accesorios',
 'Celulares':'Celulares y computadores','Computación':'Celulares y computadores','Tecnología':'Celulares y computadores',
 'Hogar':'Hogar y decoración','Muebles y decoración':'Hogar y decoración','Ferretería':'Ferreterías','Cacharrerías':'Cacharrerías y misceláneas',
 'Oficina y papelería':'Papelerías y librerías','Libros y revistas':'Papelerías y librerías','Belleza y salud':'Belleza y cosméticos',
 'Mascotas':'Mascotas y veterinarias','Jardinería y agro':'Agro y jardinería','Bebés':'Bebés y niños','Juegos y juguetes':'Juguetes y videojuegos','Videojuegos':'Juguetes y videojuegos',
 'Deporte y fitness':'Productos deportivos','Deportes':'Productos deportivos',/* v283 */'Floristería y regalos':'Flores y regalos','Accesorios vehículos':'Repuestos y accesorios para vehículos','Instrumentos musicales':'Otros'};
var CAT_NEW=[];CAT_GRP.forEach(function(g){g[1].forEach(function(c){CAT_NEW.push(c)})});
function catGroupOf(n){for(var i=0;i<CAT_GRP.length;i++)for(var j=0;j<CAT_GRP[i][1].length;j++)if(CAT_GRP[i][1][j][0]===n)return CAT_GRP[i][0];return 'Otros'}
/* Pasa la lista de categorias y las tiendas a los nombres nuevos (solo si quedan nombres viejos) */
function catMigrate(){try{
 if(CATS.some(function(c){return CAT_MAP.hasOwnProperty(c[0])})){
  var known={};CAT_NEW.forEach(function(c){known[c[0]]=1});
  var custom=CATS.filter(function(c){var n=CAT_MAP.hasOwnProperty(c[0])?CAT_MAP[c[0]]:c[0];return !known[n]});
  var out=CAT_NEW.filter(function(c){return c[0]!=='Otros'}).map(function(c){return c.slice(0,3)}).concat(custom.map(function(c){return c.slice(0,3)})).concat([CAT_NEW[CAT_NEW.length-1].slice(0,3)]);
  CATS.length=0;out.forEach(function(c){CATS.push(c)});if(typeof S==='object'&&S)S.cats=CATS.map(function(c){return c.slice()});
 }
 if(typeof S==='object'&&S&&Array.isArray(S.stores))S.stores.forEach(function(s){if(s&&CAT_MAP.hasOwnProperty(s.cat))s.cat=CAT_MAP[s.cat]});
}catch(e){}}
/* Botones de categoria agrupados con un titulo por grupo. list = categorias a mostrar; btn(c) = HTML de cada boton */
function catGroupedHTML(list,btn,fold){var by={},order=[];list.forEach(function(c){var g=catGroupOf(c[0]);if(!by[g]){by[g]=[];order.push(g)}by[g].push(c)});
 order.sort(function(a,b){var ia=CAT_GRP.findIndex(function(x){return x[0]===a}),ib=CAT_GRP.findIndex(function(x){return x[0]===b});return ia-ib});
 return order.map(function(g){var h=by[g].map(btn).join('');if(fold){var on=/aria-pressed="true"/.test(h);return '<details class="cgd"'+(on?' open':'')+'><summary><span>'+g+'</span><small>'+by[g].length+(by[g].length===1?' opción':' opciones')+'</small><i aria-hidden="true"></i></summary><div class="cgr">'+h+'</div></details>'}/* v283: grupos plegables en el formulario de la tienda */return '<span class="cgh">'+g+'</span><div class="cgr">'+h+'</div>'}).join('')}
