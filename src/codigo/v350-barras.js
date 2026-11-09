
/* v350: tocar una barra lleva a ese anuncio (el carrusel sigue avanzando solo cada 5 segundos, como antes) */
document.addEventListener('click',function(e){var i=e.target.closest&&e.target.closest('#bnd i');if(!i)return;var d=i.parentNode,t=document.getElementById('bnt');if(!t||t.children.length<2)return;
 var k=[].indexOf.call(d.children,i),st=t.children[1].offsetLeft-t.children[0].offsetLeft;try{bnLast=Date.now()}catch(x){}t.scrollTo({left:k*st,behavior:'smooth'})});
