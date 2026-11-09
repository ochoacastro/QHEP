
/* v299: al abrir un enlace de tienda o producto, si los datos todavía no han llegado (celular lento o datos guardados viejos),
   espera y vuelve a intentar durante 15 s en vez de mandar al inicio. Si algo falla, borra este <script>. */
(function(){var T0=Date.now(),pend='',tm=0,said=0;
window.rtWait=function(){if(Date.now()-T0>15000){pend='';return false}
 pend=location.hash;if(!said){said=1;try{toast('Abriendo…')}catch(e){}}
 clearTimeout(tm);tm=setTimeout(function(){if(!pend)return;try{if(location.hash!==pend)history.replaceState(null,'',pend);route()}catch(e){}},700);return true};
})();
