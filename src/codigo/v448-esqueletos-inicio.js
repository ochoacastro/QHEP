/* v448: ESQUELETOS DE CARGA (parte 1, en el <head>). Si la página se abre en el inicio (sin #/… y sin ?panel ni ?admin),
   marca <html> con «qh-esq» para que no salga la pantalla del logo: se ve la página enseguida y las partes que esperan
   datos muestran cajas grises (v448-esqueletos.js). Con otra dirección (una tienda, un producto, el panel) sigue la
   pantalla del logo, como antes. Para quitarlo: borrar este archivo, v448-esqueletos.js y v448-esqueletos.css de src/orden.json. */
(function(){try{var q=new URLSearchParams(location.search),h=location.hash||'';if(q.has('admin')||q.has('panel'))return;if(h&&h!=='#'&&h!=='#/')return;document.documentElement.classList.add('qh-esq','qh-esq-wait')}catch(e){}})();
