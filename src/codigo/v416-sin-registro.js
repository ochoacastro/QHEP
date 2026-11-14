/* v416: PEDIR Y PREGUNTAR SIN REGISTRO. Un visitante sin cuenta ya no tiene que registrarse para escribirle al vendedor.
   - PEDIDO (botón «Pedir por WhatsApp» del carrito): se abre «Tus datos para el pedido» (nombre, WhatsApp, barrio o
     corregimiento, dirección, indicaciones y un mensaje para la tienda). Al enviar se abre WhatsApp con el pedido y esos datos.
     Las tiendas que reciben pedidos por la aplicación también reciben por WhatsApp el pedido de quien no tiene cuenta
     (guardar un pedido en la aplicación exige sesión).
   - INFORMACIÓN (preguntar por un producto, servicio, anuncio o clasificado): la primera vez pide nombre y WhatsApp y deja
     cambiar el mensaje; después abre WhatsApp directo y agrega el nombre y el WhatsApp al final del mensaje.
   Los datos se guardan SOLO en el teléfono del visitante (localStorage «qh_invitado») para no pedirlos otra vez; no van a
   Firebase. Quien ya tiene cuenta no ve nada de esto.
   Se engancha en: 15-norm.js (acción «order»: invPedido / invGo), 05-mlc.js (waOpen → waOpenExt), ordMode y ordWaLine de v320.
   De paso: cualquier ventana abierta con el carrito abierto (por ejemplo «Tu dirección principal» al pedir con cuenta) quedaba
   tapada por el carrito; ahora se muestra encima.
   Si algo falla, borra este <script>: sin él, pedir vuelve a exigir cuenta y preguntar abre WhatsApp directo. */
(function(){
var K='qh_invitado',INFO='[data-act="ask"],[data-act="contact"],[data-act="contactAd"],[data-act="cmxWa"]',ctx=0,PEND=null;
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function get(){try{var o=JSON.parse(localStorage.getItem(K)||'null');return o&&typeof o==='object'?o:{}}catch(e){return {}}}
function put(o){try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}}
function tel(v){try{return telCO(v)}catch(e){return String(v||'').replace(/\D/g,'')}}
function val(id){var x=document.getElementById(id);return x?String(x.value||'').trim().replace(/[ \t]+/g,' '):''}
/* el carrito (z-index 50) queda por encima de las ventanas (40): una ventana abierta desde el carrito no se veía */
function arriba(){var o=document.getElementById('ov');if(o)o.style.zIndex=55}
function sinCuenta(){try{return !S.user}catch(e){return false}}
window.invGet=get;
/* pie común: privacidad, borrar los datos guardados y entrar si ya tiene cuenta */
function pie(quien){var g=get();return '<p class="adhint ivp">Tus datos solo se envían a '+quien+' por WhatsApp y quedan guardados en este teléfono para la próxima vez.'+(g.name?' <a href="#" data-ivdel="1">Borrar mis datos</a>':'')+'</p><p class="adhint ivp">¿Ya tienes cuenta? <a href="#" data-ivlog="1">Entrar</a></p>'}
function campos(g){return '<label for="iv-n">Tu nombre</label><input id="iv-n" type="text" maxlength="60" autocomplete="name" value="'+E(g.name||'')+'" placeholder="Ej: Ana Pérez">'+
 '<label for="iv-w">Tu WhatsApp</label><input id="iv-w" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" value="'+E(g.wa||'')+'" placeholder="Ej: 3001234567">'}
/* nombre y WhatsApp: devuelve null y escribe el error si falta algo */
function leeBase(er){var n=val('iv-n'),w=tel(val('iv-w'));
 if(n.length<3){er.textContent='Escribe tu nombre.';return null}
 if(w.length<10){er.textContent='Escribe tu número de WhatsApp completo (10 números).';return null}
 return {name:n.slice(0,60),wa:w}}
/* ---- PEDIDO ---- */
window.invPedido=function(id){var s=null;try{s=S.stores.find(function(x){return x.id===id})}catch(e){}if(!s)return;var g=get(),nt=document.querySelector('[data-onote="'+id+'"]');
 modal('<h2>Tus datos para el pedido</h2><p class="adhint">No necesitas crear una cuenta. '+E(s.name)+' recibe estos datos por WhatsApp para saber quién pide y a dónde llevarlo.</p>'+campos(g)+
  '<label for="iv-zone">Barrio o corregimiento</label><input id="iv-zone" type="text" maxlength="40" value="'+E(g.zone||'')+'" placeholder="Ej: Centro">'+
  '<label for="iv-d">Dirección de envío</label><input id="iv-d" type="text" maxlength="120" autocomplete="street-address" value="'+E(g.dir||'')+'" placeholder="Ej: Calle 5 # 3-20">'+
  '<label for="iv-r">Indicaciones para llegar (opcional)</label><input id="iv-r" type="text" maxlength="160" value="'+E(g.ref||'')+'" placeholder="Ej: Casa azul de dos pisos, frente al parque">'+
  '<label for="iv-m">Mensaje para la tienda (opcional)</label><textarea id="iv-m" maxlength="300" rows="3" placeholder="Ej: Sin cebolla, por favor">'+E(nt?nt.value:'')+'</textarea>'+
  '<p class="err" id="iv-err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-ivgo="ped" data-id="'+E(id)+'">Enviar pedido por WhatsApp</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>'+pie('esta tienda'));arriba()};
function enviaPedido(id){var er=document.getElementById('iv-err'),b=leeBase(er);if(!b)return;
 var z=val('iv-zone'),d=val('iv-d'),r=val('iv-r'),m=val('iv-m');
 if(z.length<2)return er.textContent='Elige tu barrio o corregimiento.';
 if(d.length<5)return er.textContent='Escribe la dirección de envío.';
 put({name:b.name,wa:b.wa,zone:z.slice(0,40),dir:d.slice(0,120),ref:r.slice(0,160)});
 closeModal(1);
 /* el mensaje va en la nota del carrito (así sale una sola vez en el WhatsApp) */
 var nt=document.querySelector('[data-onote="'+id+'"]');if(nt){nt.value=m.slice(0,300);nt.dispatchEvent(new Event('input',{bubbles:true}))}
 var go=function(){var bt=document.querySelector('[data-act="order"][data-id="'+id+'"]');if(!bt)return false;window.invGo=1;try{bt.click()}finally{window.invGo=0}return true};
 if(!go()){try{openCart()}catch(e){}setTimeout(go,350)}
 setTimeout(invita,700)}
/* después de enviar (no antes) se invita a crear la cuenta; una sola vez por teléfono */
function invita(){try{if(!sinCuenta()||document.getElementById('ov')||localStorage.getItem('qh_inv_ya'))return;localStorage.setItem('qh_inv_ya','1')}catch(e){return}
 modal('<h2>Tu pedido va por WhatsApp</h2><p>Envía el mensaje que quedó escrito en WhatsApp para que la tienda lo reciba.</p><p class="adhint">Si quieres guardar tus direcciones y ver tus pedidos, crea tu cuenta gratis. No es obligatorio.</p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-ivreg="1">Crear mi cuenta gratis</button><button type="button" class="btn ghost" data-act="close">Ahora no</button></div>');arriba()}
/* sin cuenta, el pedido siempre sale por WhatsApp, y el mensaje lleva los datos del formulario */
var om0=window.ordMode;if(typeof om0==='function')window.ordMode=function(s){return sinCuenta()?'wa':om0(s)};
var ow0=window.ordWaLine;window.ordWaLine=function(sid){var b=typeof ow0==='function'?ow0(sid):'';if(!sinCuenta())return b;var g=get();if(!g.name)return b;
 return '\n\nCliente: '+g.name+'\nTeléfono: '+g.wa+b+(g.dir?'\nDirección de entrega: '+g.dir+(g.zone?', '+g.zone:'')+(g.ref?'\nIndicaciones: '+g.ref:''):'')};
/* ---- INFORMACIÓN ---- */
function firma(g){return '\n\nMi nombre: '+g.name+'\nMi WhatsApp: '+g.wa}
document.addEventListener('click',function(e){var t=e.target;if(t&&t.closest&&t.closest(INFO))ctx=Date.now()},true);
window.waOpenExt=function(n,t){var info=Date.now()-ctx<1500;ctx=0;
 if(!info||!sinCuenta())return waOpen0(n,t);
 var g=get();if(g.name&&g.wa)return waOpen0(n,t+firma(g));
 PEND={n:n};
 modal('<h2>Tus datos</h2><p class="adhint">Para que el vendedor sepa quién le escribe. No necesitas crear una cuenta y solo te los pedimos esta vez.</p>'+campos(g)+
  '<label for="iv-m">Tu mensaje</label><textarea id="iv-m" maxlength="1000" rows="5">'+E(t)+'</textarea>'+
  '<p class="err" id="iv-err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-ivgo="info">Abrir WhatsApp</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>'+pie('este vendedor'));arriba()};
function enviaInfo(){var er=document.getElementById('iv-err'),b=leeBase(er);if(!b||!PEND)return;var m=val('iv-m');if(m.length<5)return er.textContent='Escribe tu mensaje.';
 var x=document.getElementById('iv-m');m=String(x.value||'').trim().slice(0,1000);
 var g=get();g.name=b.name;g.wa=b.wa;put(g);var n=PEND.n;PEND=null;closeModal(1);waOpen0(n,m+firma(g))}
/* ---- botones de los formularios ---- */
document.addEventListener('click',function(e){var t=e.target;if(!t||!t.closest)return;var b;
 if((b=t.closest('[data-ivgo]'))){e.preventDefault();return b.dataset.ivgo==='ped'?enviaPedido(b.dataset.id):enviaInfo()}
 if(t.closest('[data-ivdel]')){e.preventDefault();try{localStorage.removeItem(K)}catch(x){}['iv-n','iv-w','iv-zone','iv-d','iv-r'].forEach(function(id){var i=document.getElementById(id);if(i){i.value='';i.dispatchEvent(new Event('change',{bubbles:true}))}});var a=t.closest('[data-ivdel]');if(a)a.remove();try{toast('Se borraron tus datos de este teléfono.')}catch(x){}return}
 if(t.closest('[data-ivlog]')){e.preventDefault();closeModal(1);try{loginForm()}catch(x){}return}
 if(t.closest('[data-ivreg]')){e.preventDefault();closeModal(1);try{regForm()}catch(x){}}});
document.head.insertAdjacentHTML('beforeend','<style id="v416-css">body:has(#drawer.open) #ov{z-index:55}#ov #iv-m{width:100%;min-height:76px;resize:vertical}#ov .ivp{margin:10px 0 0}#ov .ivp a{text-decoration:underline}</style>');
})();
