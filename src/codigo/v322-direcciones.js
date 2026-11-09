
/* v322: DIRECCIONES DE ENTREGA.
   - Quien tiene cuenta registra su dirección principal (obligatoria): barrio o corregimiento, dirección, indicaciones,
     código plus (opcional, con el video de cómo sacarlo). Mientras la escribe ve el mapa de Google con el lugar
     (por el código plus, su ubicación actual o la dirección) y confirma que es su casa.
   - Puede guardar una segunda dirección y editar las dos cuando quiera (Mi cuenta → Mis direcciones).
   - Al pedir, va la principal; puede elegir la segunda u «Otra dirección» solo para ese pedido.
   - El vendedor la recibe con el pedido (por la aplicación o en el mensaje de WhatsApp) con enlaces a Google Maps.
   Las direcciones se guardan solo en este dispositivo (qh_dir_<cuenta>) y viajan únicamente dentro de cada pedido.
   Necesita las reglas v42 (campo addr del pedido). Si algo falla, borra este bloque. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function K(){var k='';try{k=QH.key()}catch(e){}return k?'qh_dir_'+k:''}
function ld(){var k=K();if(!k)return {};try{var o=JSON.parse(localStorage.getItem(k)||'{}');return o&&typeof o==='object'?o:{}}catch(e){return {}}}
function sv(o){var k=K();if(!k)return;try{localStorage.setItem(k,JSON.stringify(o))}catch(e){}}
window.adrGet=function(w){return ld()[w||'main']||null};
window.adrTelSet=function(w){var o=ld();if(!o.main||!w)return;o.tel=w;sv(o)};/* v348 */
window.adrTxt=function(a){if(!a)return '';return [a.dir,a.zone].filter(Boolean).join(', ')+(a.ref?' ('+a.ref+')':'')};
function gq(a){return a&&a.lat!=null?a.lat+','+a.lng:a&&a.plus?(/\s/.test(a.plus)?a.plus:a.plus+' Pradera, Valle del Cauca'):a&&a.dir?[a.dir,a.zone,'Pradera, Valle del Cauca'].filter(Boolean).join(', '):''}
window.adrMaps=function(a){var q=gq(a);return q?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q):''};
window.adrWa=function(a){if(!a)return '';var m=adrMaps(a);return '\nDirección de entrega: '+adrTxt(a)+(a.plus?'\nCódigo plus: '+a.plus:'')+(m?'\nUbicación en el mapa: '+m:'')};
window.adrClean=function(a){if(!a)return null;var o={lb:String(a.lb||'').slice(0,30),zone:String(a.zone||'').slice(0,40),dir:String(a.dir||'').slice(0,120),ref:String(a.ref||'').slice(0,160),plus:String(a.plus||'').slice(0,80)};if(isFinite(a.lat)&&isFinite(a.lng)&&a.lat!=null&&a.lng!=null){o.lat=Math.round(+a.lat*1e6)/1e6;o.lng=Math.round(+a.lng*1e6)/1e6}return o};
/* ---- formulario con mapa ---- */
var F=null,qT=0;
window.adrForm=function(w,done,req){var a=w==='tmp'?(F&&F.tmp)||{}:(ld()[w]||{}),main=w==='main',P=ld()/* v332 */;F={w:w,done:done,lat:a.lat,lng:a.lng,plus:a.plus||'',src:a.lat!=null||a.plus?'old':'',ok:(a.dir?(w==='main'?!P.fix:true):null),d0:a.dir||'',z0:a.zone||''}/* v358; v372: d0/z0 = dirección guardada */;
 modal('<h2>'+(main?((typeof telCO==='function'?telCO(P.tel||(S.user&&S.user.wa)||''):'').length>=10?'Tu dirección principal':'Tus datos personales')/* v333; v357 */:w==='alt'?'Segunda dirección de envío':'Otra dirección para este pedido')+'</h2>'+
  (req?'<p class="omw">Para hacer pedidos necesitas registrar tu dirección. La tienda la recibe con cada pedido para saber exactamente a dónde llevarlo.</p>':'')+
  (main?(function(){var kt=typeof telCO==='function'?telCO(P.tel||(S.user&&S.user.wa)||''):String(P.tel||'');var inp='<label for="ad-tel">Teléfono o WhatsApp</label><input id="ad-tel" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" value="'+E(kt)+'" placeholder="Ej: 3001234567"><p class="adhint">La tienda te escribe aquí si necesita algo de tu pedido.</p>';
   /* v357: si ya tenemos tu teléfono (del registro o de Mis datos) no se vuelve a pedir: solo se muestra, con «Cambiar» */
   return '<h3 class="adsh">Tu teléfono</h3>'+(kt.length>=10?'<p class="adtk" id="ad-telk"><b>'+E(kt)+'</b><button type="button" class="btn ghost" data-adtelc="1">Cambiar</button></p><div id="ad-telw" hidden>'+inp+'</div>':inp)+'<h3 class="adsh">Tu dirección principal</h3>'})():'')+/* v332: teléfono (dato personal); v333: separado por secciones */
  (w!=='main'?'<label for="ad-lb">Nombre de esta dirección</label><input id="ad-lb" type="text" maxlength="30" value="'+E(a.lb||(w==='alt'?'Trabajo':''))+'" placeholder="Ej: Trabajo, Casa de mi mamá">':'')+
  '<label for="ad-zone">Barrio o corregimiento</label><input id="ad-zone" type="text" maxlength="40" value="'+E(a.zone||'')+'" placeholder="Ej: Centro">'+
  '<label for="ad-dir">Dirección</label><input id="ad-dir" type="text" maxlength="120" autocomplete="street-address" value="'+E(a.dir||'')+'" placeholder="Ej: Calle 5 # 3-20">'+
  '<label for="ad-ref">Indicaciones (opcional)</label><input id="ad-ref" type="text" maxlength="160" value="'+E(a.ref||'')+'" placeholder="Ej: Casa azul de dos pisos, frente al parque">'+
  /* v358: sin código plus ni ubicación actual: la persona solo escribe su dirección y dice si Google Maps la muestra bien; si no, el administrador le pone el código plus */
  '<p style="margin:14px 0 0;font-weight:700">Tu casa en el mapa</p><p class="adhint">El mapa de Google busca tu dirección. Mira si marca bien tu casa.</p>'+
  '<div class="admap" id="ad-map"></div><p id="ad-st" class="adno"></p>'+
  /* v372: si ya respondió, la pregunta se oculta; vuelve si cambia el barrio o la dirección */'<p class="adhint" id="ad-okd"'+(F.ok==null?' style="display:none"':'')+'>'+(F.ok===false?'Ya nos dijiste que el mapa no muestra bien tu casa'+(main?': el administrador la ubicará.':'.'):'Ya confirmaste que el mapa muestra bien tu casa.')+' <a href="#" data-adokc="1">Cambiar respuesta</a></p>'+
  '<div class="adq" role="group" aria-label="¿Google Maps muestra bien tu casa?"'+(F.ok!=null?' style="display:none"':'')+'><b>¿Google Maps muestra bien tu casa?</b><div class="adqo"><button type="button" data-adok="1" aria-pressed="'+(F.ok===true)+'">Sí, está bien</button><button type="button" data-adok="0" aria-pressed="'+(F.ok===false)+'">No, no aparece bien</button></div><p class="adhint" id="ad-okh"'+(F.ok===false?'':' hidden')+'>No te preocupes: '+(main?'el administrador de Mi Pradera ubicará tu casa en el mapa y te avisaremos.':'la tienda te escribirá para ubicarte.')+'</p></div>'+
  /* v352: la pregunta por el negocio pasó al formulario de la tienda */
  (w==='tmp'&&S.user?'<label style="display:flex;gap:10px;align-items:center;margin-top:6px"><input type="checkbox" id="ad-keep" style="width:22px;height:22px"> Guardarla como mi segunda dirección</label>':'')+
  '<p class="err" id="ad-err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-adsave="1">'+(main?'Guardar mis datos':'Guardar dirección')/* v333 */+'</button>'+(req&&main?'':'<button type="button" class="btn ghost" data-act="close">Cancelar</button>')+'</div>');
 if(req&&main){var ov=document.getElementById('ov');if(ov)ov.dataset.lock='1'}
 window.__adrOk=function(v){if(F)F.ok=v};/* v358 */
 setTimeout(gmap,60)};
/* mapa de Google dentro del formulario (no se mueve el pin: muestra el lugar buscado) */
function cur(){var g=function(id){var x=document.getElementById(id);return x?x.value.trim():''};return {dir:g('ad-dir'),zone:g('ad-zone'),plus:F&&F.src==='old'?F.plus:'',lat:F&&F.lat,lng:F&&F.lng}}
function gmap(){var el=document.getElementById('ad-map');if(!el||!F)return;var c=cur(),q=gq(c),st=document.getElementById('ad-st');
 if(!q){el.innerHTML='<p class="adhint" style="padding:14px">Escribe tu barrio y tu dirección, y aquí verás el lugar.</p>';if(st){st.className='adno';st.textContent='Aún no hay ubicación para mostrar'}return}
 var src='https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=17&output=embed',f=el.querySelector('iframe');if(f&&f.dataset.q===q)return;
 el.innerHTML='<iframe title="Mapa de tu dirección" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-q="'+E(q)+'" src="'+E(src)+'"></iframe>';
 if(st){st.className='adok';st.textContent=F.src==='gps'?'Mostrando tu ubicación actual. Revisa que sea tu casa.':F.src==='plus'?'Mostrando tu código plus. Revisa que sea tu casa.':F.lat!=null?'Mostrando la ubicación guardada. Revisa que sea tu casa.':'Mostrando tu dirección. Mira si marca bien tu casa.'}}
function later(){clearTimeout(qT);qT=setTimeout(gmap,900)}
function setPin(lat,lng,why){F.lat=lat;F.lng=lng;F.src=why;var er=document.getElementById('ad-err');if(er)er.textContent='';var cf=document.getElementById('ad-conf');if(cf)cf.checked=false;gmap()}
document.addEventListener('input',function(e){if(!F||!e.target)return;var id=e.target.id;
 if(id==='ad-plus'){var c=null;try{c=plusLL(e.target.value)}catch(x){}if(c){var ll=Array.isArray(c)?c:[c.lat,c.lng];if(isFinite(ll[0])&&isFinite(ll[1])){setPin(ll[0],ll[1],'plus');return}}if(F.src==='plus'){F.lat=null;F.lng=null;F.src=''}later();return}
 if(id==='ad-dir'||id==='ad-zone'){if(F.src==='old'){F.lat=null;F.lng=null;F.plus='';F.src=''}later();reask()}});
/* v372: si cambia el barrio o la dirección, hay que volver a responder la pregunta del mapa */
function reask(){setTimeout(function(){if(!F||F.ok==null)return;var v=function(i){return ((document.getElementById(i)||{}).value||'').trim().replace(/\s+/g,' ').toLowerCase()};if(v('ad-dir')===String(F.d0).trim().replace(/\s+/g,' ').toLowerCase()&&v('ad-zone')===String(F.z0).trim().replace(/\s+/g,' ').toLowerCase())return;
 F.ok=null;var q=document.querySelector('#ov .adq');if(q){q.style.display='';q.querySelectorAll('[data-adok]').forEach(function(b){b.setAttribute('aria-pressed','false')})}var h=document.getElementById('ad-okh');if(h)h.hidden=true;var k=document.getElementById('ad-okd');if(k)k.style.display='none'},0)}
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-adokc]');if(!b)return;e.preventDefault();var q=document.querySelector('#ov .adq');if(q)q.style.display='';var k=document.getElementById('ad-okd');if(k)k.style.display='none'},true);
document.addEventListener('change',function(e){if(F&&e.target&&(e.target.id==='ad-zone'||e.target.classList&&e.target.classList.contains('znsel')&&document.getElementById('ad-zone'))){if(F.src==='old'){F.lat=null;F.lng=null;F.plus='';F.src=''}later();reask()}});
addEventListener('click',async function(e){var t=e.target;if(!t.closest)return;var b;
 if((b=t.closest('[data-adgeo]'))){e.preventDefault();if(!navigator.geolocation)return toast('Tu teléfono no permite usar la ubicación.');b.disabled=true;b.textContent='Buscando tu ubicación…';
  navigator.geolocation.getCurrentPosition(function(p){b.disabled=false;b.textContent='Usar mi ubicación actual';setPin(Math.round(p.coords.latitude*1e6)/1e6,Math.round(p.coords.longitude*1e6)/1e6,'gps')},function(){b.disabled=false;b.textContent='Usar mi ubicación actual';toast('No se pudo obtener tu ubicación. Revisa que el permiso de ubicación esté activo, o escribe tu dirección o tu código plus.')},{enableHighAccuracy:true,timeout:15000});return}
 if((b=t.closest('[data-adsave]'))){e.preventDefault();var g=function(id){var x=document.getElementById(id);return x?x.value.trim().replace(/\s+/g,' '):''},er=document.getElementById('ad-err');
  var a={lb:g('ad-lb')||(F.w==='main'?'Principal':''),zone:g('ad-zone'),dir:g('ad-dir'),ref:g('ad-ref'),plus:F.src==='old'?F.plus:''};/* v358 */
  var tl='',bz=false,t2='';if(F.w==='main'){tl=telCO(g('ad-tel'))/* v346 */;if(tl.length<7)return er.textContent='Escribe tu teléfono o WhatsApp.';bz=!!(document.getElementById('ad-biz')||{}).checked;t2=bz?telCO(g('ad-tel2')):'';if(t2&&t2.length<7)return er.textContent='El otro teléfono del negocio está incompleto.'}/* v332 */
  if(a.zone.length<2)return er.textContent='Elige tu barrio o corregimiento.';if(a.dir.length<5&&!a.plus)return er.textContent='Escribe tu dirección.';
  if(F.ok==null)return er.textContent='Responde si Google Maps muestra bien tu casa.';/* v358 */
  if(F.lat!=null&&F.src!==''){a.lat=F.lat;a.lng=F.lng}a=adrClean(a);var w=F.w,dn=F.done;
  if(w==='tmp'){F.tmp=a;var kp=document.getElementById('ad-keep');if(kp&&kp.checked){var o=ld();o.alt=a;sv(o)}}else{var o2=ld();o2[w]=a;if(w==='main'){o2.tel=tl;o2.biz=bz;o2.tel2=t2;o2.fix=!F.ok;var aP=a,fP=!F.ok;setTimeout(function(){try{adrPush(aP,fP)}catch(e){}},0)/* v358: también en la cuenta */;setTimeout(function(){try{waSync(tl)}catch(e){}},0)/* v348: también en Mis datos */}/* v332 */sv(o2)}
  closeModal(1);toast(w==='tmp'?'Dirección lista para este pedido':'Dirección guardada');if(typeof dn==='function')dn(a);return}
 if((b=t.closest('[data-adtelc]'))){e.preventDefault();var tw=document.getElementById('ad-telw'),tk=document.getElementById('ad-telk');if(tw)tw.hidden=false;if(tk)tk.hidden=true;var ti=document.getElementById('ad-tel');if(ti){ti.focus();ti.select()}return}/* v357 */
 if((b=t.closest('[data-adedit]'))){e.preventDefault();closeModal(1);adrForm(b.dataset.adedit,function(){adrOpen()});return}
 if((b=t.closest('[data-addel]'))){e.preventDefault();if(!(await askC('¿Borrar tu segunda dirección?','Borrar')))return;var o3=ld();delete o3.alt;sv(o3);adrOpen();return}
 if((b=t.closest('[data-act="adrOpen"]'))){e.preventDefault();e.stopImmediatePropagation();closeModal(1);adrOpen();return}},true);
/* ---- Mi cuenta → Mis direcciones ---- */
function card(w,a){var m=adrMaps(a);return '<div class="adc"><h3>'+E(w==='main'?'Dirección principal':(a.lb||'Segunda dirección'))+(w==='main'?'<em>POR DEFECTO</em>':'')+'</h3><p>'+E(adrTxt(a))+'</p>'+(a.plus?'<small>Código plus: '+E(a.plus)+'</small>':'')+(a.lat!=null?'<small>Con ubicación exacta (código plus o ubicación actual)</small>':'')+(w==='main'?(function(P){return P.tel?'<small>Teléfono: '+E(P.tel)+(P.tel2?' · Negocio: '+E(P.tel2):'')+''+'</small>':'<small class="adno">Falta tu teléfono</small>'})(ld()):'')/* v332 */+
 '<div class="orda"><button type="button" class="btn" data-adedit="'+w+'">Editar</button>'+(m?'<a class="btn ghost" href="'+E(m)+'" target="_blank" rel="noopener">Ver en el mapa</a>':'')+(w==='alt'?'<button type="button" class="btn ghost" data-addel="1">Borrar</button>':'')+'</div></div>'}
window.adrOpen=function(){var o=ld();modal('<h2>Mis direcciones</h2><p class="muted">La tienda recibe tu dirección con cada pedido. Tu dirección principal se guarda en tu cuenta: solo tú y el administrador la ven, para ubicarla bien en el mapa.</p>'+
 (o.main?card('main',o.main):'<div class="adc"><h3>Dirección principal</h3><p class="adno">Aún no la has registrado.</p><div class="orda"><button type="button" class="btn pink" data-adedit="main">Agregar mi dirección</button></div></div>')+
 (o.alt?card('alt',o.alt):'<div class="adc"><h3>Segunda dirección (opcional)</h3><small>Por ejemplo tu trabajo, para no escribirla otra vez.</small><div class="orda"><button type="button" class="btn ghost" data-adedit="alt">Agregar segunda dirección</button></div></div>')+
 '<div class="row" style="margin-top:8px"><button type="button" class="btn ghost" data-act="close">Cerrar</button></div>')};
window.adrMenu=function(it){var a=adrGet('main');var ic='<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>';
 return it(ic,'Mis direcciones',a?E(adrTxt(a)):'Falta registrar tu dirección','adrOpen','',a?null:{n:'!',t:'falta tu dirección'})};
/* ---- en el carrito: a dónde se envía ---- */
var PICK={};
window.adrPick=function(sid){var p=PICK[sid]||'main';if(p==='tmp')return F&&F.tmp||null;return adrGet(p)||adrGet('main')};
window.adrFoot=function(sid){if(!S.user)return '';var m=adrGet('main'),a2=adrGet('alt'),p=PICK[sid]||'main',tmp=F&&F.tmp;if(!m)return '<div class="adsel"><b>¿A dónde lo enviamos?</b><button type="button" class="btn ghost" data-adedit="main" style="width:100%">Agregar mi dirección</button></div>';
 var op=function(k,a,t){return '<button type="button" data-adpick="'+k+'" data-sid="'+E(sid)+'" aria-pressed="'+(p===k)+'"><b>'+E(t)+'</b><small>'+E(adrTxt(a))+'</small></button>'};
 return '<div class="adsel" role="group" aria-label="Dirección de entrega"><b>¿A dónde lo enviamos?</b><div class="ops">'+op('main',m,'Mi dirección principal')+(a2?op('alt',a2,a2.lb||'Segunda dirección'):'')+(tmp?op('tmp',tmp,'Otra dirección (solo este pedido)'):'')+
  '<button type="button" data-adother="'+E(sid)+'"><b>'+(tmp?'Cambiar la otra dirección':'Otra dirección…')+'</b><small>Solo para este pedido</small></button></div></div>'};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-adpick],[data-adother]');if(!b)return;var sid=b.dataset.sid||b.dataset.adother;
 if(b.dataset.adother){adrForm('tmp',function(){PICK[sid]='tmp';try{openCart()}catch(x){}});return}
 PICK[sid]=b.dataset.adpick;b.parentNode.querySelectorAll('[data-adpick]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))})});
/* ---- obligatoria: se pide al entrar si no hay dirección ---- */
var asked=0;setInterval(function(){try{if(asked||MODE==='admin'||!S.user||document.getElementById('ov')||document.querySelector('.qtour'))return;var k=K();if(!k||adrGet('main')&&ld().tel)return;/* v332: también si falta el teléfono */
 asked=1;adrForm('main',function(){toast('¡Listo! Tu dirección quedó guardada. Puedes cambiarla en Mi cuenta → Mis direcciones.')},true)}catch(e){}},2500);
/* el campo de barrio usa la lista de barrios y corregimientos (v317) */
})();
