
/* v424: LA CUENTA YA NO PIDE DIRECCIÓN NI MAPA. Los datos personales de quien se registra son solo nombre, correo y teléfono
   («Mis datos»). Antes, a quien tenía cuenta se le abría sola la ventana «Tus datos personales / Tu dirección principal»,
   con el mapa de Google y la pregunta «¿Google Maps muestra bien tu casa?», y sin eso no podía pedir.
   Con este interruptor encendido (qhSinDir):
   - esa ventana ya no se abre sola ni al pedir (v322-direcciones.js, v363-pedido-pendiente.js y la acción «order» de 15-norm.js);
   - «Mis direcciones» sale de Mi cuenta y el carrito ya no pregunta «¿A dónde lo enviamos?»;
   - al tocar «Pedir por WhatsApp», quien tiene cuenta ve el mismo formulario corto de quien pide sin registro
     («Tus datos para el pedido», v416-sin-registro.js) con su nombre y su teléfono ya puestos, y escribe ahí barrio,
     dirección e indicaciones. No hay mapa ni confirmación. Eso queda guardado solo en su teléfono para la próxima vez.
   No se borró nada: el formulario de direcciones sigue en v322. Para volver a como estaba, quita este archivo de src/orden.json. */
(function(){
window.qhSinDir=true;
window.adrMenu=function(){return ''};   /* Mi cuenta: sin «Mis direcciones» */
window.adrFoot=function(){return ''};   /* carrito: sin «¿A dónde lo enviamos?» */
window.adrPick=function(){return null}; /* el pedido no lleva la dirección guardada en la cuenta: lleva la del formulario */
try{localStorage.removeItem('qh_pend_order')}catch(e){} /* v363: ya no hay pedidos esperando a que se registre una dirección */
})();
