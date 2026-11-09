
/* v283: el botón del horario dice de qué día copia («Usar el horario del Lunes en todos los días marcados»). Si algo falla, borra este <script>. */
(function(){function upd(){var w=document.getElementById('x-hrs');if(!w)return;var b=w.querySelector('.hcopy');if(!b)return;
 var r=[].filter.call(w.querySelectorAll('.hrow'),function(x){var c=x.querySelector('.hon');return c&&c.checked})[0],d=r&&r.querySelector('.hd');
 var n=d?d.textContent.trim():'';var t=n?'Usar el horario del '+n+' en todos los días marcados':'Usar el mismo horario en todos los días marcados';if(b.textContent!==t)b.textContent=t}
 document.addEventListener('change',function(e){if(e.target&&e.target.closest&&e.target.closest('#x-hrs,#x-hpd'))upd()},true);
 new MutationObserver(function(){if(document.getElementById('x-hrs'))upd()}).observe(document.documentElement,{childList:true,subtree:true});
})();
