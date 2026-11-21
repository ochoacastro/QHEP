/* v455: en la página principal, la sección de pestañas (hubSwipe, 06-cattitle.js) queda solo con «Lo más reciente».
   Se quitan las pestañas de categorías (Clasificados, Tiendas, Comidas, Peluquerías, Vehículos, Inmuebles, Servicios) y su
   contenido, las flechas y el aviso «Desliza para ver más categorías». Al lado de «Lo más reciente» va el botón «Ver el muro»,
   que abre el Muro igual que el botón Muro de la barra de abajo. Pedido por la dueña.
   Para quitarlo: borrar este archivo y v455-inicio-solo-reciente.css de src/orden.json (vuelven todas las pestañas). */
(function(){
 var MURO='<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>';
 function arreglar(sec){if(sec.dataset.v455)return;sec.dataset.v455='1';
  var tabs=sec.querySelectorAll('.hswt [data-act="hsw"]'),panes=sec.querySelectorAll('.hswp>.hswc'),i;
  for(i=1;i<tabs.length;i++)tabs[i].remove();
  for(i=1;i<panes.length;i++)panes[i].remove();
  var l=sec.querySelectorAll('.hswtw .plar,.hswc .hswh,.hswc .hswm');/* v456: también el botón «Ver por categorías →» */for(i=0;i<l.length;i++)l[i].remove();
  var w=sec.querySelector('.hswtw');if(w)w.classList.remove('fl');
  var t=sec.querySelector('.hswt');if(t&&!t.querySelector('.v455m')){t.insertAdjacentHTML('beforeend','<button type="button" class="v455m">'+MURO+' Ver el muro</button>')}
  sec.setAttribute('aria-label','Lo más reciente')}
 function todo(){if(window.qhInicioCompleto)return;/* con window.qhInicioCompleto=true vuelven todas las pestañas (lo usan las pruebas) */var l=document.querySelectorAll('#app section.hsw:not([data-v455])');for(var i=0;i<l.length;i++)arreglar(l[i])}
 document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.v455m');if(!b)return;e.preventDefault();e.stopPropagation();
  var m=document.querySelector('#bnav [data-v="com"]');if(m){m.click();return}
  try{view='com';render();scrollTo(0,0)}catch(x){location.hash='#/clasificados'}},true);
 function arrancar(){var a=document.getElementById('app');if(!a)return;new MutationObserver(todo).observe(a,{childList:true,subtree:true});todo()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrancar);else arrancar();
})();
