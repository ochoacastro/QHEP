
/* v216: Inmuebles, Vehiculos y Servicios se publican solo en sus secciones de pago.
   En el asistente de Clasificados esas categorias solo aparecen para pedidos (Busco comprar, Busco arriendo, Solicito servicios, Busco empleo);
   para ofertas (Vendo, Arriendo, Ofrezco servicios...) se ocultan y un aviso lleva a la seccion de pago.
   Los anuncios ya publicados no se tocan. Si algo falla, borra este <script id="v216-secciones"> y el <style id="v216-secciones-css">
   y vuelve a poner CM_CATS en lugar de cmCatsFor(cmf.op), y quita ${cmPaidNote()} y ${cmPaidBanner(cmF.cat)}. */
var CM_PAID={inm:['arr','Inmuebles','Los inmuebles en venta o arriendo'],veh:['veh','Vehículos','Los vehículos en venta'],serv:['serv','Servicios','Los servicios que ofrecen los vecinos']};
var CM_REQ={bcompra:1,barriendo:1,sserv:1,bemp:1};
function cmCatsFor(op){return CM_CATS.filter(function(c){return !CM_PAID[c[0]]||CM_REQ[op]})}
function cmPaidNote(){return '<p class="muted cmpaid">¿Vas a vender o arrendar un inmueble, vender un vehículo u ofrecer tus servicios? Se publican en su sección: <button type="button" data-qgo="arr">Inmuebles</button> · <button type="button" data-qgo="veh">Vehículos</button> · <button type="button" data-qgo="serv">Servicios</button></p>'}
function cmPaidBanner(cat){var p=CM_PAID[cat];if(!p)return '';return '<p class="cmpaid box">'+p[2]+' están en la sección <b>'+p[1]+'</b>. Aquí ves lo que buscan los vecinos. <button type="button" data-qgo="'+p[0]+'">Ir a '+p[1]+' →</button></p>'}
document.addEventListener('change',function(e){if(!e.target||e.target.id!=='cm-op')return;var sel=document.getElementById('cm-cat');if(!sel||typeof CM_CATS==='undefined')return;
 var cur=sel.value,list=cmCatsFor(e.target.value),esc2=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
 sel.innerHTML='<option value="">Elige…</option>'+list.map(function(c){return '<option value="'+c[0]+'">'+c[1]+' '+esc2(c[2])+'</option>'}).join('');
 sel.value=list.some(function(c){return c[0]===cur})?cur:'';if(sel.value!==cur)sel.dispatchEvent(new Event('change',{bubbles:true}))});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-qgo]');if(!b)return;e.preventDefault();var v=b.dataset.qgo;
 try{if(document.querySelector('.overlay')&&typeof closeModal==='function')closeModal(1)}catch(_){}
 var t=document.createElement('button');t.hidden=true;t.dataset.act=v==='serv'?'serv':'miniTab';t.dataset.v=v;document.body.appendChild(t);t.click();t.remove();window.scrollTo(0,0)});
