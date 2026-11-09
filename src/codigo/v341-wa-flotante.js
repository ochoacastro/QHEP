
/* v341: botón flotante de WhatsApp con el número del administrador (Administrador → Mis datos → WhatsApp).
   Abajo a la derecha; dentro de una tienda sube encima del carrito. No sale en el modo administrador ni si no hay número.
   Si algo falla, borra este bloque y su <style>. */
(function(){
var IC='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="#fff" stroke-width="1.9" stroke-linejoin="round" d="M3.6 20.4l1.2-4.1a8.6 8.6 0 1 1 3.3 3.1z"/><path fill="#fff" d="M9.1 7.6c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2.1.4 0 .6l-.5.7c-.1.2-.2.3 0 .6.5.8 1.1 1.4 1.8 1.9.3.2.5.2.7 0l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.2.4.4 0 .5-.2 1.4-.9 1.8-.6.4-1.5.6-3.4-.2a9.6 9.6 0 0 1-4.1-3.9c-.7-1.2-.8-2.2-.3-3.1z"/></svg>';
function num(){try{return String((S.site||{}).wa||'').replace(/\D/g,'')}catch(e){return ''}}
function el(){var b=document.getElementById('waAdm');if(!b){b=document.createElement('a');b.id='waAdm';b.className='wafab';b.target='_blank';b.rel='noopener';b.setAttribute('aria-label','Escríbele al administrador de Mi Pradera por WhatsApp');b.title='Escríbenos por WhatsApp';b.innerHTML=IC+'<span>WhatsApp</span>';document.body.appendChild(b)}return b}
function upd(){var n=num(),adm=typeof MODE!=='undefined'&&MODE==='admin';var b=document.getElementById('waAdm');
 if(adm||n.length<7){if(b)b.hidden=true;return}b=el();b.hidden=false;
 var h='https://wa.me/'+(n.length===10?'57'+n:n)+'?text='+encodeURIComponent('Hola, te escribo desde Mi Pradera: ');if(b.href!==h)b.href=h}
var t=0;new MutationObserver(function(){if(t)return;t=1;setTimeout(function(){t=0;upd()},300)}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(upd,4000);
})();
