
/* v427: MOVIMIENTO. Transiciones entre ventanas y pantallas (el diseño está en v427-movimiento-css.css).
   Este archivo solo mira lo que la página ya hace y le pone la clase que corresponde; no cambia cómo se abre ni se cierra nada:
   - ventana que reemplaza a otra → «mv-swap» (el fondo no vuelve a aparecer, solo cambia el contenido);
   - ventana que se cierra → deja 170 ms una copia que se desvanece («mvg»). La copia no tiene id ni data-*, no se puede
     tocar y los lectores de pantalla no la ven;
   - cambio de pantalla (view, tienda, producto, anuncio o noticia distintos) → «mv-go» (o «mv-back» al volver al inicio);
   - cambio de paso en un formulario por pasos (v417) → «mv-next» / «mv-prev».
   Con «reducir movimiento» activado no hace nada. Para quitarlo: borra este archivo y su CSS de src/orden.json. */
(function(){
var quieto=function(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
function esVentana(n){return n&&n.nodeType===1&&n.classList&&(n.classList.contains('overlay')||n.classList.contains('lb'))&&!n.classList.contains('mvg')}
function copia(o){var g=o.cloneNode(true),lb=o.classList.contains('lb');g.className='mvg'+(lb?' mvg-lb':'');g.removeAttribute('id');g.removeAttribute('style');g.setAttribute('aria-hidden','true');g.setAttribute('inert','');
 [].forEach.call(g.querySelectorAll('*'),function(x){[].slice.call(x.attributes).forEach(function(a){if(a.name==='id'||a.name==='name'||a.name==='for'||a.name==='role'||a.name==='autofocus'||a.name.indexOf('data-')===0||a.name.indexOf('aria-')===0)x.removeAttribute(a.name)})});
 [].forEach.call(g.querySelectorAll('iframe,video,audio,script'),function(x){x.remove()});
 document.body.appendChild(g);setTimeout(function(){g.remove()},190)}
function cuerpo(){new MutationObserver(function(L){if(quieto())return;var sale=[],entra=[];
  L.forEach(function(m){[].forEach.call(m.removedNodes,function(n){if(esVentana(n))sale.push(n)});[].forEach.call(m.addedNodes,function(n){if(esVentana(n))entra.push(n)})});
  sale=sale.filter(function(n){return !n.isConnected});if(!sale.length)return;
  var nueva=entra.filter(function(n){return n.isConnected&&n.id==='ov'})[0],vieja=sale.filter(function(n){return n.id==='ov'})[0];
  if(nueva&&vieja){nueva.classList.add('mv-swap');return}
  if(entra.some(function(n){return n.isConnected}))return;
  copia(sale[sale.length-1])}).observe(document.body,{childList:true})}
/* pantallas */
var antes='';
function llave(){try{return [view,cur,curP,curAd,curN].join('|')}catch(e){return ''}}
function app(){var a=document.getElementById('app');if(!a)return;antes=llave();
 new MutationObserver(function(){var k=llave();if(k===antes)return;var v0=antes.split('|')[0];antes=k;if(quieto()||!v0)return;
  var c=k.split('|')[0]==='home'?'mv-back':'mv-go';a.classList.remove('mv-go','mv-back');void a.offsetWidth;a.classList.add(c);
  clearTimeout(app.t);app.t=setTimeout(function(){a.classList.remove('mv-go','mv-back')},320)}).observe(a,{childList:true})}
/* formularios por pasos: el rótulo «Paso N de M» cambia → se sabe hacia dónde va */
var paso={};
function pasos(){new MutationObserver(function(){if(quieto())return;var k=document.querySelector('#ov .wzk'),m=k&&k.closest('.modal');if(!m)return;
  var n=parseInt((k.textContent.match(/\d+/)||[0])[0],10)||0;if(paso.m!==m){paso={m:m,n:n};return}if(n===paso.n)return;
  var c=n>paso.n?'mv-next':'mv-prev';paso.n=n;m.classList.remove('mv-next','mv-prev');void m.offsetWidth;m.classList.add(c);
  setTimeout(function(){m.classList.remove('mv-next','mv-prev')},280)}).observe(document.body,{childList:true,subtree:true,characterData:true})}
function inicia(){if(inicia.ya)return;inicia.ya=1;try{cuerpo();app();pasos()}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inicia);else inicia();
})();
