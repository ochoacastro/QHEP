
/* v430: DISEÑO DE TIENDA EN LÍNEA PARA COMPUTADOR (estilo de los grandes marketplaces, con la marca de Mi Pradera).
   El diseño está en v430-diseno-escritorio-css.css; este archivo solo mueve tres piezas que ya existen, sin cambiar qué hacen:
   1. El buscador (.qw y sus sugerencias #sr): queda siempre en el encabezado, también en el inicio (antes, en el inicio bajaba
      al centro de la página: 15-norm.js, srSlot). v431: también en celular y tableta, como en las tiendas grandes.
   2. La barra de abajo (#bnav: Inicio, Buscar, Publicar, Clasificados, Mi cuenta): en computador se muestra dentro del
      encabezado como una segunda fila de enlaces. En celular y tableta vuelve a su lugar, abajo.
   3. La ficha de producto (article.pv): agrupa sus piezas en dos cajas, .pvmain (fotos, medios de pago, preguntas, opiniones)
      y .pvbuy (título, precio, cantidad, botones de comprar y la tienda). En computador van en dos columnas; en celular y
      tableta las cajas no existen para el diseño (display:contents) y todo se ve igual que antes.
   También deja en --hdh la altura del encabezado, para que la caja de compra se quede quieta debajo de él al bajar.
   Para quitarlo: borra este archivo y su CSS de src/orden.json. */
(function(){
var MQ=matchMedia('(min-width:1024px)'),$=function(s){return document.querySelector(s)};
var bnavSitio=null;/* dónde estaba #bnav antes de subirlo al encabezado */
function buscador(){var qw=$('.qw'),sr=$('#sr'),hd=$('header'),u=$('#userBtn');if(!qw||!hd)return;
 if(qw.parentNode!==hd){hd.insertBefore(qw,u&&u.parentNode===hd?u:null);if(sr)hd.insertBefore(sr,qw.nextSibling)}document.body.classList.remove('qinhub')}
function barra(){var b=$('#bnav'),hd=$('header');if(!b||!hd)return;
 if(MQ.matches){if(b.parentNode!==hd){bnavSitio={p:b.parentNode,n:b.nextSibling};hd.appendChild(b)}}
 else if(b.parentNode===hd){var s=bnavSitio;if(s&&s.p&&s.p.isConnected)s.p.insertBefore(b,s.n&&s.n.parentNode===s.p?s.n:null);else document.body.appendChild(b)}}
/* ficha de producto: lo de comprar va en .pvbuy; lo demás en .pvmain */
function ficha(){var pv=$('#app article.pv');if(!pv||pv.querySelector(':scope>.pvbuy'))return;
 var hijos=[].slice.call(pv.children),ini=hijos.findIndex(function(e){return e.matches('.pvm,.pvt')}),fin=-1;
 hijos.forEach(function(e,i){if(e.matches('.pvs'))fin=i});
 if(fin<0)hijos.forEach(function(e,i){if(e.matches('.pvbtn'))fin=i});
 if(ini<0||fin<ini)return;
 var main=document.createElement('div'),buy=document.createElement('div');main.className='pvmain';buy.className='pvbuy';
 /* cada pieza guarda su lugar (order): en celular las cajas no cuentan y todo se ve en el orden de siempre */
 hijos.forEach(function(e,i){e.style.order=i;(i>=ini&&i<=fin&&!e.matches('.pvg')?buy:main).appendChild(e)});
 pv.appendChild(main);pv.appendChild(buy)}
function alto(){var hd=$('header');if(hd)document.documentElement.style.setProperty('--hdh',hd.offsetHeight+'px')}
function todo(){try{buscador();barra();ficha();alto()}catch(e){}}
window.qhDisenoEscritorio=todo;
/* después de srSlot (15-norm.js), que en el inicio baja el buscador: este archivo carga antes y su observador correría primero */
function luego(){Promise.resolve().then(todo)}
function inicia(){if(inicia.ya)return;inicia.ya=1;var a=$('#app');if(a)new MutationObserver(luego).observe(a,{childList:true});
 if(MQ.addEventListener)MQ.addEventListener('change',todo);else if(MQ.addListener)MQ.addListener(todo);
 addEventListener('resize',alto);todo()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inicia);else inicia();
})();
