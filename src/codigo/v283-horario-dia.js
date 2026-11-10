
/* v283: el botón del horario dice de qué día copia («Usar el horario del Lunes en todos los días marcados»). Si algo falla, borra este <script>. */
/* v401: ya no hay botón al final; el botón «Aplicar este horario a los días marcados» sale solo en el primer día marcado (clase .first) */
(function(){function upd(){var w=document.getElementById('x-hrs');if(!w)return;
 var r=[].filter.call(w.querySelectorAll('.hrow'),function(x){var c=x.querySelector('.hon');return c&&c.checked})[0];
 [].forEach.call(w.querySelectorAll('.hrow'),function(x){var f=x===r;if(x.classList.contains('first')!==f)x.classList.toggle('first',f)})}
 document.addEventListener('change',function(e){if(e.target&&e.target.closest&&e.target.closest('#x-hrs,#x-hpd'))upd()},true);
 new MutationObserver(function(){if(document.getElementById('x-hrs'))upd()}).observe(document.documentElement,{childList:true,subtree:true});
})();
