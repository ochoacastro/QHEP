
/* v344: «Escríbenos» en el pie de página: nombre, correo, teléfono, asunto (lista; «Otro» habilita escribirlo) y mensaje.
   Al enviar: pantalla «ENVIANDO ••» → «¡ENVIADO!» → agradecimiento. El mensaje se guarda en Firebase (colección mensajes,
   reglas v44) y el administrador lo ve en Administrador → Sugerencias → «Mensajes de Escríbenos», con botones para responder.
   Contra robots: campo trampa invisible, un mensaje por minuto por dispositivo y límites en las reglas (no hace falta la casilla).
   Si algo falla, borra este bloque y su <style>. */
(function(){
var MAIL='contacto@mipradera.com.co',AS=['Comentario','Sugerencia','Reporte de error','Otro'];
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function html(){return '<form class="qct" id="qct" novalidate><h2>Escríbenos</h2><p class="qct-s">Comentarios, sugerencias o errores que encuentres. Te respondemos a tu correo.</p><div class="qct-g">'+
 '<div><label for="qct-n">Nombre</label><input id="qct-n" type="text" maxlength="60" autocomplete="name"></div>'+
 '<div><label for="qct-c">Correo electrónico</label><input id="qct-c" type="email" maxlength="100" autocomplete="email" inputmode="email" placeholder="tucorreo@ejemplo.com"></div>'+
 '<div><label for="qct-t">Teléfono <small>(opcional)</small></label><input id="qct-t" type="tel" maxlength="20" autocomplete="tel" inputmode="tel" placeholder="3001234567"></div>'+
 '<div><label for="qct-a">Asunto</label><select id="qct-a"><option value="">Elige el asunto…</option>'+AS.map(function(a){return '<option>'+a+'</option>'}).join('')+'</select></div>'+
 '<div class="qct-w"><label for="qct-o">Otro asunto</label><input id="qct-o" type="text" maxlength="80" disabled placeholder="Elige «Otro» en Asunto para escribirlo"></div>'+
 '<div class="qct-w"><label for="qct-m">Mensaje</label><textarea id="qct-m" rows="5" maxlength="1500" placeholder="Escribe aquí tu mensaje"></textarea></div></div>'+
 '<input type="text" id="qct-hp" class="qct-hp" tabindex="-1" autocomplete="off" aria-hidden="true">'+
 '<p class="err" id="qct-e" role="alert"></p><button type="submit" class="btn pink qct-b">Enviar</button></form>'}
function paint(){var f=document.querySelector('footer');if(!f||f.querySelector('#qct'))return;var d=document.createElement('div');d.className='qctw';d.innerHTML=html();f.insertBefore(d,f.firstChild)}
document.addEventListener('change',function(e){if(e.target&&e.target.id==='qct-a'){var o=document.getElementById('qct-o');if(o){o.disabled=e.target.value!=='Otro';o.placeholder=o.disabled?'Elige «Otro» en Asunto para escribirlo':'Escribe el asunto';if(!o.disabled)o.focus();else o.value=''}}});
/* pantalla de envío */
function fx(st,d){var w=document.getElementById('qct-fx');if(!w){w=document.createElement('div');w.id='qct-fx';w.className='qfx';w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');w.setAttribute('aria-live','assertive');document.body.appendChild(w)}
 if(st==='off'){w.classList.remove('on');setTimeout(function(){w.remove()},250);document.documentElement.classList.remove('qfx-lock');return}
 document.documentElement.classList.add('qfx-lock');w.classList.add('on');
 if(st==='send')w.innerHTML='<div class="qfx-in"><p class="qfx-t" data-t="ENVIANDO">ENVIANDO</p><p class="qfx-d" aria-hidden="true"><i></i><i></i><i></i></p><span class="qfx-sr">Enviando tu mensaje…</span></div>';
 else if(st==='ok')w.innerHTML='<div class="qfx-in"><p class="qfx-t ok" data-t="¡ENVIADO!">¡ENVIADO!</p><p class="qfx-sub">Tu mensaje ya está en Mi Pradera</p></div>';
 else if(st==='gracias')w.innerHTML='<div class="qfx-in qfx-g"><p class="qfx-t ok sm" data-t="¡GRACIAS!">¡GRACIAS!</p><p class="qfx-sub">Gracias por tu mensaje'+(d.nombre?', '+E(d.nombre.split(' ')[0]):'')+'.</p><p class="qfx-p">Lo leeremos pronto y te responderemos a <b>'+E(d.correo)+'</b>.</p><button type="button" class="qfx-x" data-qfx="close">Cerrar</button></div>';
 else if(st==='err')w.innerHTML='<div class="qfx-in"><p class="qfx-t bad" data-t="NO SE ENVIÓ">NO SE ENVIÓ</p><p class="qfx-p">Revisa tu conexión e inténtalo de nuevo. También puedes escribir a <a href="mailto:'+MAIL+'">'+MAIL+'</a>.</p><button type="button" class="qfx-x" data-qfx="close">Volver</button></div>';
 var b=w.querySelector('.qfx-x');if(b)setTimeout(function(){b.focus()},50)}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-qfx]');if(b)fx('off')});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.querySelector('#qct-fx .qfx-x'))fx('off')});
var wait=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
async function store(d){var a=null;for(var i=0;i<40&&!a;i++){try{a=QH.authCur()}catch(x){}if(!a)await wait(200)}if(!a)throw new Error('sin sesión');
 d.id='m'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);d.uid=a.uid;d.ts=Date.now();d.leido=false;
 await firebase.firestore().collection('mensajes').doc(d.id).set(d)}
document.addEventListener('submit',async function(e){if(!e.target||e.target.id!=='qct')return;e.preventDefault();
 var g=function(id){var x=document.getElementById(id);return x?x.value.trim().replace(/[ \t]+/g,' '):''},er=document.getElementById('qct-e'),bad=function(t,id){er.textContent=t;var x=document.getElementById(id);if(x)x.focus()};
 var d={nombre:g('qct-n'),correo:g('qct-c').toLowerCase(),tel:g('qct-t').replace(/[^\d+ ]/g,'').slice(0,20),asunto:g('qct-a'),msg:document.getElementById('qct-m').value.trim().slice(0,1500),pag:location.href.slice(0,300)};
 if(d.nombre.length<2)return bad('Escribe tu nombre.','qct-n');
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.correo))return bad('Escribe un correo válido para poder responderte.','qct-c');
 if(d.tel&&d.tel.replace(/\D/g,'').length<7)return bad('El teléfono está incompleto (o déjalo vacío).','qct-t');
 if(!d.asunto)return bad('Elige el asunto.','qct-a');
 if(d.asunto==='Otro'){var o=g('qct-o');if(o.length<3)return bad('Escribe el asunto.','qct-o');d.asunto='Otro: '+o}
 if(d.msg.length<5)return bad('Escribe tu mensaje.','qct-m');er.textContent='';
 if(g('qct-hp'))return;/* robot */
 var last=0;try{last=+localStorage.getItem('qh_ct_last')||0}catch(x){}if(Date.now()-last<60000)return bad('Ya enviaste un mensaje. Espera un minuto para enviar otro.','qct-m');
 if(!d.tel)delete d.tel;
 fx('send');var t0=Date.now();
 try{await store(d);try{localStorage.setItem('qh_ct_last',String(Date.now()))}catch(x){}
  await wait(Math.max(0,1800-(Date.now()-t0)));fx('ok');await wait(1700);fx('gracias',d);document.getElementById('qct').reset();var oo=document.getElementById('qct-o');if(oo)oo.disabled=true}
 catch(x){await wait(Math.max(0,1200-(Date.now()-t0)));fx('err')}});
var t=0;new MutationObserver(function(){if(t)return;t=1;requestAnimationFrame(function(){t=0;paint()})}).observe(document.documentElement,{childList:true,subtree:true});paint();
/* ---- administrador: bandeja «Mensajes de Escríbenos» (en Sugerencias) ---- */
var M=[],un=null,ok=false;
function listen(){if(un||!(typeof adm!=='undefined'&&adm))return;try{un=firebase.firestore().collection('mensajes').orderBy('ts','desc').limit(150).onSnapshot(function(s){M=[];s.forEach(function(x){M.push(Object.assign({},x.data(),{id:x.id}))});ok=true;try{if(view==='admin'&&at==='sug'&&!document.getElementById('ov'))render(true)}catch(e){}},function(){un=null;ok=true;M=[]})}catch(e){}}
window.msgAdmin=function(){listen();var n=M.filter(function(x){return !x.leido}).length,fd=function(t){return new Date(t).toLocaleString('es-CO',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})};
 var h='<div class="cg msgadm"><h3>Mensajes de «Escríbenos» <small>'+(n?n+' sin leer':'todos leídos')+'</small></h3>';
 if(!ok)h+='<p class="muted">Cargando…</p>';else if(!M.length)h+='<p class="muted">Aún no hay mensajes. Si no aparecen cuando alguien escribe, publica las reglas v44 de Firestore.</p>';
 h+=M.map(function(x){var re='mailto:'+encodeURIComponent(x.correo||'')+'?subject='+encodeURIComponent('Re: '+(x.asunto||'Tu mensaje a Mi Pradera'))+'&body='+encodeURIComponent('Hola '+(x.nombre||'')+',\n\n\n\n— Mi Pradera\n\n> '+String(x.msg||'').split('\n').join('\n> '));
  var wa=String(x.tel||'').replace(/\D/g,'');if(wa.length===10)wa='57'+wa;
  return '<article class="msgc'+(x.leido?'':' nuevo')+'"><header><b>'+E(x.asunto||'')+'</b><small>'+fd(x.ts)+'</small></header><p class="msgw">'+E(x.nombre||'')+' · <a href="mailto:'+E(x.correo||'')+'">'+E(x.correo||'')+'</a>'+(x.tel?' · '+E(x.tel):'')+'</p><p class="msgt">'+E(x.msg||'')+'</p>'+
   '<div class="row"><a class="btn" href="'+E(re)+'">Responder por correo</a>'+(wa.length>=11?'<a class="btn ghost" href="https://wa.me/'+wa+'" target="_blank" rel="noopener">WhatsApp</a>':'')+'<button type="button" class="btn ghost" data-msgl="'+E(x.id)+'" data-v="'+(x.leido?0:1)+'">'+(x.leido?'Marcar sin leer':'Marcar leído')+'</button><button type="button" class="btn ghost" data-msgd="'+E(x.id)+'">Eliminar</button></div></article>'}).join('');
 return h+'</div>'};
document.addEventListener('click',async function(e){var b=e.target.closest&&e.target.closest('[data-msgl],[data-msgd]');if(!b||!(typeof adm!=='undefined'&&adm))return;var c=firebase.firestore().collection('mensajes');
 try{if(b.dataset.msgl)await c.doc(b.dataset.msgl).update({leido:b.dataset.v==='1'});else{if(!(await askC('¿Eliminar este mensaje?','Eliminar')))return;await c.doc(b.dataset.msgd).delete();toast('Mensaje eliminado')}}catch(x){toast('No se pudo. Revisa que las reglas v44 estén publicadas.')}});
})();
