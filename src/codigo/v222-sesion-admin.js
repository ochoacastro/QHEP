
/* v222: el panel de administrador cierra la sesion tras 30 minutos sin uso, tambien con la pagina abierta.
   Antes solo se revisaba al abrir la pagina y el plazo era de 24 horas. Las cuentas de los vecinos no cambian (30 dias).
   La ultima actividad se guarda en la misma clave que ya usaba la pagina (pradereando_last_admin).
   Si algo falla, borra SOLO este <script id="v222-sesion-admin"> (y vuelve a poner 864e5 en lugar de 18e5 si quieres las 24 h). */
(function(){var LIM=18e5,K='pradereando_last_admin',t=0;
 function adm(){try{return MODE==='admin'}catch(e){return false}}
 function touch(){var n=Date.now();if(n-t<15e3)return;t=n;try{localStorage.setItem(K,n)}catch(e){}}
 ['pointerdown','keydown','touchstart','wheel'].forEach(function(ev){addEventListener(ev,function(){if(adm())touch()},{passive:true,capture:true})});
 function check(){if(!adm())return;var l=0;try{l=+localStorage.getItem(K)||0}catch(e){}if(!l||Date.now()-l<=LIM)return;
  try{var u=QH.authCur&&QH.authCur();if(u&&!u.isAnonymous){QH.authOut();try{localStorage.setItem(K,Date.now())}catch(e){}setTimeout(function(){try{toast('Por seguridad cerramos el panel tras 30 minutos sin uso. Vuelve a entrar.')}catch(e){}},600)}}catch(e){}}
 setInterval(check,30e3);document.addEventListener('visibilitychange',function(){if(!document.hidden)check()});
})();
