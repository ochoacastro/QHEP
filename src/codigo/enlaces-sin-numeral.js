/* v300: enlaces sin «#» (?producto=, ?tienda=, ?noticia=): algunas apps y la app instalada pierden lo que va después de «#»
   o no recargan la página. Aquí se pasan al formato interno (#/p/…, #/t/…, #/nw/…) antes de que arranque la página. */
(function(){try{var q=new URLSearchParams(location.search),h='',pr=q.get('producto'),ti=q.get('tienda'),no=q.get('noticia');
 if(pr){var v=q.get('v'),t=q.get('talla');h='#/p/'+pr+(v||t?'?'+[v?'v='+v:'',t?'t='+encodeURIComponent(t):''].filter(Boolean).join('&'):'')}
 else if(ti)h='#/t/'+ti;else if(no)h='#/nw/'+no;
 if(h){['producto','tienda','noticia','v','talla'].forEach(function(k){q.delete(k)});var r=q.toString();history.replaceState(null,'',location.pathname+(r?'?'+r:'')+h)}}catch(e){}window.QH_H00=location.hash;/* v303: dirección original, antes de que nada la cambie */})();