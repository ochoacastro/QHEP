
/* v363: si alguien se registra para pedir por WhatsApp, apenas tiene cuenta, teléfono y dirección se le abre el carrito
   con el botón «Pedir por WhatsApp» resaltado. El pendiente (qh_pend_order) dura 24 horas y sobrevive si sale a verificar el correo. */
(function(){
function pend(){try{return JSON.parse(localStorage.getItem('qh_pend_order')||'null')}catch(e){return null}}
function clr(){try{localStorage.removeItem('qh_pend_order')}catch(e){}}
setInterval(function(){try{var P=pend();if(!P)return;if(Date.now()-(P.ts||0)>864e5||MODE==='admin')return clr();
 if(!Object.keys(S.cart||{}).some(function(k){return k.indexOf(P.sid+'|')===0}))return clr();
 if(!S.user||document.getElementById('ov')||document.querySelector('.qtour'))return;
 var ad=typeof adrGet==='function'?adrGet('main'):null,tl=typeof telCO==='function'?telCO(S.user.wa||''):'';
 if(!ad||tl.length<7){if(typeof adrForm==='function')adrForm('main',null,true);return}
 clr();try{sessionStorage.setItem('qh_buying','1')}catch(e){}try{openCart()}catch(e){return}
 setTimeout(function(){var b=document.querySelector('#drawer [data-act="order"][data-id="'+P.sid+'"]');if(b){b.scrollIntoView({block:'center',behavior:'smooth'});b.classList.add('ordgo')}},450);
 try{toast('¡Listo, ya tienes tu cuenta! Toca «Pedir por WhatsApp» para enviar tu pedido.')}catch(e){}}catch(e){}},1500);
document.head.insertAdjacentHTML('beforeend','<style id="v363-css">.ordgo{animation:ordgo 1s ease-in-out 4;box-shadow:0 0 0 4px rgba(22,163,74,.55)}@keyframes ordgo{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}</style>');
})();
