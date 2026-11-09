
/* v308: desde el carrusel del inicio se puede llenar el registro del negocio, el inmueble o el vehículo SIN tener cuenta.
   Al tocar «Publicar» (o «Abrir tienda») se guarda todo en este dispositivo (qh_gdr, también las fotos) y se pide crear la cuenta.
   Apenas la persona entra, se abre el mismo formulario lleno y se publica solo. Si para publicar le falta un rol, el formulario
   queda lleno con el aviso y el botón para activarlo; el borrador espera 7 días. Si algo falla, borra este <script id="v308-publicar-sin-cuenta">. */
(function(){
var K='qh_gdr',GD=null,busy=0,DAYMS=864e5;
function ld(){if(!GD){try{GD=JSON.parse(localStorage.getItem(K)||'null')}catch(e){GD=null}}if(GD&&Date.now()-(GD.ts||0)>7*DAYMS)clr();return GD}
function sv(){try{localStorage.setItem(K,JSON.stringify(GD))}catch(e){}}
function clr(){GD=null;try{localStorage.removeItem(K)}catch(e){}}
var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
var LBL={arr:'tu inmueble',casa:'tu inmueble',veh:'tu vehículo',shop:'tu negocio'};
function note(k){var m=document.querySelector('#ov .modal'),h=m&&m.querySelector('h2');if(!h||S.user)return;
 h.insertAdjacentHTML('afterend','<p class="shpnote gdnote"><b>No necesitas cuenta para llenarlo.</b> Llena todos los datos; al tocar «'+(k==='shop'?'Abrir tienda':'Publicar')+'» te pediremos crear tu cuenta (toma un minuto) y '+(k==='shop'?'tu negocio se registra solo.':'se publica solo. Para publicar en '+(k==='veh'?'Vehículos':'Inmuebles')+' se necesita el rol '+(k==='veh'?'Vendedor de vehículos':'Vendedor de inmuebles')+' (para uno o para varios) o Comerciante: si no lo tienes, después de crear tu cuenta te mostramos cómo activarlo y tu anuncio te espera guardado.')+'</p>')}
/* abrir el formulario (sin cuenta) */
window.gdOpen=function(k){
 if(S.user){if(k==='shop')return shopForm();var t=document.createElement('button');t.hidden=true;t.dataset.act='pubAsk';t.dataset.v=k==='veh'?'veh':'arr';document.body.appendChild(t);t.click();t.remove();return}
 if(k==='shop'){shopForm();note('shop');return}
 if(k==='veh'){adForm('veh');return}
 modal('<h2>¿Quieres arrendar o vender?</h2><div class="pubmenu"><button type="button" class="pubopt" data-gdad="arr"><b>Arrendar</b><span>Apartamento, casa, habitación o local para arrendar</span></button><button type="button" class="pubopt" data-gdad="casa"><b>Vender</b><span>Casa, apartamento, lote o finca en venta</span></button></div><button class="btn ghost" data-act="close">Cancelar</button>')};
/* llenar el formulario abierto con el borrador */
async function fill(d){var m=document.querySelector('#ov .modal');if(!m)return false;
 var setV=function(){for(var id in d.v){var e=document.getElementById(id);if(!e||!m.contains(e)||e.type==='file')continue;var x=d.v[id];
  if(x&&typeof x==='object'){if(e.checked!==x.c){e.checked=x.c;e.dispatchEvent(new Event('change',{bubbles:true}))}}
  else if(e.value!==x){e.value=x;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))}}};
 setV();
 (d.pr||[]).forEach(function(p){var e=[].slice.call(m.querySelectorAll('[aria-pressed][data-act="'+p[0]+'"]')).find(function(x){return (x.dataset.v||'')===p[1]});if(e&&(e.getAttribute('aria-pressed')==='true')!==p[2])e.click()});
 setV();
 if(d.k==='shop'){if(d.pick)Object.assign(pick,d.pick);if(d.logo){try{var b=await(await fetch(d.logo)).blob(),dt=new DataTransfer();dt.items.add(new File([b],'logo.'+((b.type.split('/')[1])||'jpg'),{type:b.type}));document.getElementById('f-img').files=dt.files}catch(e){}}}
 else{var l=(d.imgs||[]).slice();if(S.user&&typeof r2up==='function'){l=await Promise.all(l.map(function(x){return /^data:/.test(x)?r2up(x):x}));d.imgs=l;if(GD===d)sv()}af.imgs=l;var w=document.getElementById('a-imgs');if(w)w.innerHTML=aImgs()}
 return true}
/* revisar lo básico antes de pedir la cuenta, para que no tenga que volver a corregir */
function check(k){var g=function(id){var e=document.getElementById(id);return e?String(e.value||'').trim():''};
 if(k==='shop'){if(!g('f-name'))return 'Ponle un nombre a tu tienda.';if(g('f-desc').length<3)return 'Escribe una descripción corta de tu negocio.';if(g('f-wa').replace(/\D/g,'').length<7)return 'Escribe el teléfono o WhatsApp de tu negocio.';if(!pick.cat)return 'Elige una categoría para tu tienda.';if(pick.cat==='__new'&&!g('f-newcat'))return 'Escribe el nombre de tu categoría.';return ''}
 var T=ADT[k],vty=g('af-vtype');for(var i=0;i<T.F.length;i++){var sp=T.F[i];if(sp.v&&sp.v.indexOf(vty)<0)continue;if(sp.k==='visT'&&typeof visOn==='function'&&!visOn())continue;if(!sp.r||sp.t==='multi')continue;var x=g('af-'+sp.k);if(sp.m)x=x.replace(/\D/g,'');if(x===''||(sp.t==='num'&&!(Number(x)>0)))return 'Completa: '+sp.l+'.'}
 if(g('a-wa').replace(/\D/g,'').length<10)return 'Escribe un WhatsApp válido de 10 dígitos.';
 if((af.imgs||[]).length+((document.getElementById('a-img')||{}).files||[]).length>5)return 'Máximo 5 fotos.';return ''}
async function snap(k){var m=document.querySelector('#ov .modal'),v={};
 [].forEach.call(m.querySelectorAll('input[id],select[id],textarea[id]'),function(e){if(e.type==='file')return;v[e.id]=(e.type==='checkbox'||e.type==='radio')?{c:e.checked}:e.value});
 var pr=[].map.call(m.querySelectorAll('[aria-pressed][data-act]'),function(e){return [e.dataset.act,e.dataset.v||'',e.getAttribute('aria-pressed')==='true']});
 var d={k:k,ts:Date.now(),v:v,pr:pr,pick:k==='shop'?Object.assign({},pick):null,imgs:[],logo:''};
 if(k==='shop'){var f=document.getElementById('f-img');f=f&&f.files[0];if(f)d.logo=await resize(f,480,.8,1)}
 else{var fs=[].slice.call((document.getElementById('a-img')||{}).files||[]);var add=(await Promise.all(fs.map(function(x){return resize(x,900,.72,1)}))).filter(Boolean);d.imgs=(af.imgs||[]).concat(add).slice(0,5)}
 GD=d;sv()}
function ask(k){after=resume;modal('<h2>Crea tu cuenta para publicar</h2><p>Ya guardamos '+LBL[k]+' con todos sus datos'+(k==='shop'?'':' y fotos')+'. Crea tu cuenta gratis o entra si ya tienes una; apenas termines '+(k==='shop'?'lo registramos':'lo publicamos')+'.</p><p class="muted">La cuenta sirve para que solo tú puedas editarlo o borrarlo.</p><div class="row" style="margin-top:12px"><button type="button" class="btn pink" data-act="regForm">Crear cuenta gratis</button><button type="button" class="btn ghost" data-act="loginForm">Ya tengo cuenta</button></div><button type="button" class="btn ghost" data-gdback="1" style="margin-top:8px">← Volver a '+LBL[k]+'</button>')}
/* después de entrar: abrir el formulario lleno y publicarlo */
async function resume(){if(busy||!S.user||MODE!=='panel')return;var d=ld();if(!d||d.tried)return;d.tried=1;sv();/* v309: solo se abre solo una vez; después queda en «Mi cuenta» */busy=1;
 try{
  if(d.k==='shop'){shopForm();if(!document.getElementById('f-cats')){clr();return}/* ya tenía su tienda gratis: se muestra el aviso */
   await fill(d);await sleep(300);var b=document.querySelector('#ov [data-act="saveShop"]');if(b)b.click();await sleep(2000);if(!document.getElementById('f-cats'))clr();return}
  var n=0;while(!S.plan&&!S.planErr&&n++<40)await sleep(500);
  adForm(d.k);var ok=await (window.__gdF||Promise.resolve(false));if(!ok)return;
  var pm=planMsg('ad','',d.k),e=document.getElementById('err');
  if(pm){if(e)e.innerHTML=esc(pm)+' <button type="button" class="btn pink" data-act="cdOpen" data-v="'+(d.k==='veh'?'car':'home')+'" style="margin-top:8px">Activar el rol '+(d.k==='veh'?'Vendedor de vehículos':'Vendedor de inmuebles')+'</button><br><small>Tu anuncio queda guardado: cuando actives el rol, vuelve a publicar y aparece lleno.</small>';try{e.scrollIntoView({block:'center'})}catch(_){}return}
  await sleep(300);var s=document.querySelector('#ov [data-act="saveAd"]');if(s)s.click();await sleep(1500);if(!document.getElementById('adf'))clr()
 }finally{if(d.k==='shop'||!GD)busy=0}}
window.gdResume=resume;window.gdGet=ld;window.gdFill=fill;window.gdClear=clr;/* v309 */
/* cada vez que se abre un formulario nuevo de inmueble o vehículo con un borrador guardado, se llena solo */
function wrap(){if(window.__gdW||typeof adForm!=='function')return;window.__gdW=1;var o=adForm;
 adForm=function(t,a){o(t,a);if(a)return;var d=ld();if(d&&d.k===t){window.__gdF=fill(d);if(!S.user)note(t)}else{window.__gdF=Promise.resolve(false);if(!S.user)note(t)}}}
document.addEventListener('DOMContentLoaded',wrap);setTimeout(wrap,0);
/* Publicar / Abrir tienda sin cuenta: guardar y pedir la cuenta */
addEventListener('click',function(e){var t=e.target;if(!t.closest)return;
 var gp=t.closest('[data-act="gdPub"]');if(gp){e.preventDefault();e.stopImmediatePropagation();var k=gp.dataset.v==='veh'?'veh':'inm';if(MODE==='index'){location.href=PANEL_URL+'#/publicar-'+(k==='veh'?'vehiculo':'inmueble');return}gdOpen(k);return}
 var ga=t.closest('[data-gdad]');if(ga){wrap();adForm(ga.dataset.gdad);return}
 if(t.closest('[data-gdback]')){var d=ld();if(!d)return;if(d.k==='shop'){shopForm();note('shop');fill(d)}else{wrap();adForm(d.k)}return}
 var b=t.closest('[data-act="saveAd"],[data-act="saveShop"]');if(!b||S.user||MODE==='admin')return;
 var k2=b.dataset.act==='saveShop'?'shop':(typeof af!=='undefined'&&af&&af.type);if(!k2||(k2!=='shop'&&af.id))return;
 e.preventDefault();e.stopImmediatePropagation();
 var er=check(k2),el=document.getElementById('err');if(er){if(el)el.textContent=er;return}
 if(el)el.textContent='Guardando…';b.disabled=true;snap(k2).then(function(){ask(k2)},function(){b.disabled=false;if(el)el.textContent='No se pudo guardar. Inténtalo de nuevo.'})},true);
/* si la página se recarga al entrar (por ejemplo con Google), retomar el borrador */
setInterval(function(){if(!busy&&MODE==='panel'&&S.user&&!document.getElementById('ov')&&ld())resume()},2000);
})();
