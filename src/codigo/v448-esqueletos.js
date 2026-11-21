/* v448: ESQUELETOS DE CARGA (parte 2). Solo cuando la página se abrió en el inicio (clase «qh-esq», ver
   v448-esqueletos-inicio.js) y mientras llegan los datos:
   - antes del primer dibujo, en lugar de «Cargando…» sale la forma del inicio (título, botones, categorías y banner);
   - en el inicio, «Todavía no hay publicaciones», «Aún no hay tiendas»… se cambian por filas grises (todavía no se sabe
     si hay o no) y se agrega el lugar de «Negocios»;
   - si la persona entra a otra sección antes de que lleguen los datos, ve una lista gris en vez de «no hay…».
   Al llegar los datos (cuando la página llama hideSplash) se deja de tocar y se dibuja la sección con los datos.
   No cambia cómo se cargan ni se guardan los datos. Para quitarlo: ver v448-esqueletos-inicio.js. */
(function(){
 var H=document.documentElement;if(!H.classList.contains('qh-esq'))return;
 var listo=false,tapado=false,mo=null;
 function rep(n,f){var s='';for(var i=0;i<n;i++)s+=f(i);return s}
 function filas(n){return rep(n,function(){return '<div class="esq-fila"><i class="esq-b esq-cu"></i><span><i class="esq-b esq-l1"></i><i class="esq-b esq-l2"></i></span></div>'})}
 var NEG='<section class="esq esq-neg" aria-hidden="true"><i class="esq-b esq-tit"></i><div class="esq-negs"><i class="esq-b esq-card"></i><i class="esq-b esq-card"></i></div></section>';
 var INICIO='<div class="esq esq-ini" role="status" aria-label="Cargando"><i class="esq-b esq-h1"></i><i class="esq-b esq-h2"></i><i class="esq-b esq-sub"></i><div class="esq-chips">'+rep(3,function(){return '<i class="esq-b"></i>'})+'</div><div class="esq-cats">'+rep(12,function(){return '<i class="esq-b"></i>'})+'</div><i class="esq-b esq-ban"></i><div class="esq-filas">'+filas(3)+'</div></div>';
 var VISTA='<div class="esq esq-vista" role="status" aria-label="Cargando"><i class="esq-b esq-vt"></i><div class="esq-filas">'+filas(6)+'</div></div>';
 function vista(){try{return view}catch(e){return 'home'}}
 function aplicar(){
  if(listo)return;var a=document.getElementById('app');if(!a)return;
  try{
   var e=a.firstElementChild;
   if(a.children.length===1&&e&&e.classList.contains('empty')&&!e.closest('.hswc')){a.innerHTML=INICIO}/* «Cargando…» antes del primer dibujo */
   else if(vista()==='home'){
    var l=a.querySelectorAll('.hswc>.empty');for(var i=0;i<l.length;i++){var d=document.createElement('div');d.className='esq esq-filas';d.setAttribute('role','status');d.setAttribute('aria-label','Cargando');d.innerHTML=filas(3);l[i].parentNode.replaceChild(d,l[i])}
    var hs=a.querySelector('section.hsw');if(hs&&!a.querySelector('.hneg,.esq-neg'))hs.insertAdjacentHTML('beforebegin',NEG);
   }
   else if(!a.querySelector('.esq-vista')){a.innerHTML=VISTA;tapado=true}
  }catch(x){}
  if(mo)mo.takeRecords()/* lo que cambia aquí no vuelve a llamar a aplicar */}
 function fin(){if(listo)return;listo=true;if(mo)mo.disconnect();H.classList.remove('qh-esq-wait');
  var a=document.getElementById('app');if(tapado||(a&&a.querySelector('.esq'))){try{render(true)}catch(e){}}}
 function arrancar(){
  /* hideSplash lo define splash.js, que va después de este archivo: se engancha aquí, cuando ya existe */
  var h0=window.hideSplash;window.hideSplash=function(){fin();if(typeof h0==='function')return h0.apply(this,arguments)};
  var sp=document.getElementById('splash');if(!sp||sp.classList.contains('off')){listo=true;H.classList.remove('qh-esq-wait');return}/* los datos ya llegaron */
  var a=document.getElementById('app');if(!a||listo)return;mo=new MutationObserver(aplicar);mo.observe(a,{childList:true,subtree:true});aplicar()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrancar);else arrancar();
})();
