
/* v425: PARA PUBLICAR HAY QUE TENER CUENTA. Antes, sin cuenta se podía llenar el formulario de un clasificado (v255), de una
   tienda, de un inmueble o de un vehículo (v308) y la cuenta se pedía al final, al tocar «Publicar». También se podía enviar
   una sugerencia sin cuenta. Ahora, quien no tiene cuenta ve primero «Registrarme» (con la pestaña «Iniciar sesión» al lado) y
   un aviso que dice por qué; apenas entra, se abre solo lo que quería publicar.
   Activar o pagar un rol ya exigía cuenta (v232) y no cambia. Pedir y preguntar por WhatsApp sin cuenta (v416) tampoco cambia:
   eso es comprar, no publicar.
   Los borradores que alguien dejó guardados sin cuenta (v308, v255) siguen esperándolo: se publican cuando entre.
   Para volver a como estaba, quita este archivo de src/orden.json. */
(function(){
function sinCuenta(){try{return MODE!=='admin'&&!S.user}catch(e){return false}}
function aviso(){var m=document.querySelector('#ov .modal');if(!m||m.querySelector('.rgpn'))return;
 m.insertAdjacentHTML('afterbegin','<p class="shpnote rgpn" role="status"><b>Para publicar necesitas una cuenta.</b> Crea tu cuenta gratis (toma un minuto) o inicia sesión si ya tienes una. Al terminar seguimos con tu publicación.'+(typeof rolesPubView==='function'?' <a href="#/roles" data-rolv="1">Ver los roles y sus precios</a>':'')/* v426 */+'</p>')}
/* pide la cuenta y deja pendiente lo que se iba a hacer */
function pedir(f){after=f;regForm();aviso();setTimeout(aviso,80)}
window.qhPedirCuenta=pedir;
/* clasificado nuevo */
/* clasificado nuevo: lo pregunta el propio comForm (16-cmfeat.js) llamando a qhPedirCuenta. v429: antes se enganchaba desde
   aquí «cuando la página terminaba de cargar» y, al llegar por ?panel#/clasificado (el enlace del botón «Publicar»), el
   formulario alcanzaba a abrirse sin cuenta, porque el panel abre esa ruta durante el arranque. */
/* tienda, inmueble o vehículo desde el inicio */
var g0=window.gdOpen;if(typeof g0==='function')window.gdOpen=function(k){if(sinCuenta())return pedir(function(){gdOpen(k)});return g0.apply(this,arguments)};
/* sugerencia: se guarda lo escrito y se envía sola al entrar */
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-act="saveSug"]');if(!b||!sinCuenta())return;
 e.preventDefault();e.stopImmediatePropagation();var v=function(id){var x=document.getElementById(id);return x?x.value:''},t=v('g-txt'),n=v('g-name');
 pedir(function(){setTimeout(function(){var x=document.getElementById('g-txt'),y=document.getElementById('g-name'),s=document.querySelector('[data-act="saveSug"]');if(!x||!s)return;x.value=t;if(y)y.value=n;s.click()},300)})},true);
})();
