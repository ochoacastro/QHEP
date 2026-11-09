
/* v257: EMERGENCIAS.
   - Administrador → Emergencias: lista de líneas (nombre, número, tipo, WhatsApp, activa). Se guarda en S.site.emer (ficha del sitio).
     Si aún no se ha guardado nada, se muestran las líneas nacionales de Colombia.
   - Mi cuenta → Datos de emergencia (opcional): hasta 2 contactos (nombre, parentesco, teléfono), tipo de sangre y nota médica.
     Por ser datos personales y de salud se guardan SOLO en este celular (localStorage), no en Firebase.
   - Globo flotante «SOS» en la página: abre la ventana con las líneas (llamar / WhatsApp) y el contacto personal
     (llamar / WhatsApp con un mensaje de ayuda y la ubicación, si la persona la permite).
   Si algo falla, borra este <script id="v257-emergencias"> y su <style>. */
(function(){
var SV=function(d){return '<svg class="qi" viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>'};
var IC={siren:SV('<path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"/><path d="M21 12h1"/><path d="M18.5 4.5 18 5"/><path d="M2 12h1"/><path d="M12 2v1"/><path d="m4.93 4.93.71.71"/><path d="M12 12v6"/>'),
 phone:SV('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'),
 shield:SV('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'),
 flame:SV('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'),
 health:SV('<path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/>'),
 heart:SV('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'),
 users:SV('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
 wa:SV('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>')};
var TYPES=[['gen','Emergencias','#d70015','siren'],['pol','Policía','#1d4ed8','shield'],['bom','Bomberos','#c2410c','flame'],['sal','Salud y ambulancias','#047857','health'],['soc','Ayuda social','#7c3aed','heart'],['otr','Otro','#374151','phone']];
/* líneas nacionales de Colombia (el administrador las puede cambiar y agregar las de Pradera) */
var DEF=[{n:'Línea de emergencias',t:'123',k:'gen',d:'Policía, ambulancias y bomberos'},{n:'Policía',t:'112',k:'pol'},{n:'Bomberos',t:'119',k:'bom'},{n:'Cruz Roja',t:'132',k:'sal'},{n:'Defensa Civil',t:'144',k:'sal'},{n:'Gaula',t:'165',k:'pol',d:'Secuestro y extorsión'},{n:'ICBF',t:'141',k:'soc',d:'Niños, niñas y adolescentes'},{n:'Línea de la mujer',t:'155',k:'soc',d:'Orientación a mujeres víctimas de violencia'}];
var BLOOD=['A+','A-','B+','B-','AB+','AB-','O+','O-'],REL=['Mamá','Papá','Esposo(a) o pareja','Hijo(a)','Hermano(a)','Abuelo(a)','Tío(a)','Amigo(a)','Vecino(a)','Otro'];
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function T(k){for(var i=0;i<TYPES.length;i++)if(TYPES[i][0]===k)return TYPES[i];return TYPES[TYPES.length-1]}
function lines(){var l=(S&&S.site&&Array.isArray(S.site.emer))?S.site.emer:DEF;return l.filter(function(x){return x&&x.t&&!x.off})}
function telH(t){return 'tel:'+String(t).replace(/[^\d#*+]/g,'').replace(/#/g,'%23')}
function cel(t){var d=String(t||'').replace(/\D/g,'');if(d.length===12&&d.slice(0,2)==='57')d=d.slice(2);return d.length===10&&d[0]==='3'?d:''}
function isAdm(){try{return MODE==='admin'&&adm}catch(e){return false}}
/* datos personales: solo en este celular */
function myKey(){var k='';try{k=QH.key()||''}catch(e){}return 'qh_emg_'+(k||'anon')}
/* v260: 1) al registrarse o entrar, los datos que llenó como visitante pasan solos a su cuenta (en este celular);
   2) sin sesión, el SOS muestra los últimos datos guardados en este celular (qh_emg_last apunta a ellos) */
function rd(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function mine(){var k=myKey(),v=rd(k);
 if(!v&&k!=='qh_emg_anon'){var a=rd('qh_emg_anon');if(a){try{localStorage.setItem(k,JSON.stringify(a));localStorage.removeItem('qh_emg_anon');localStorage.setItem('qh_emg_last',k)}catch(e){}v=a}}
 if(!v&&k==='qh_emg_anon'){var l=null;try{l=localStorage.getItem('qh_emg_last')}catch(e){}if(l)v=rd(l)}
 return v||{}}
function setMine(o){var k=myKey();try{localStorage.setItem(k,JSON.stringify(o));localStorage.setItem('qh_emg_last',k)}catch(e){toast('No se pudo guardar en este celular')}}
/* ---------- ventana de emergencias ---------- */
function age(d){if(!d)return '';var b=new Date(d+'T00:00:00'),n=new Date(),a=n.getFullYear()-b.getFullYear();if(n.getMonth()<b.getMonth()||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate()))a--;return a>=0&&a<130?a+' años':''}
/* v258: ficha personal arriba: nombre y datos a la vista, «Mi tipo de sangre» grande en la esquina superior derecha */
function card(m){var nm=m.nm||((S&&S.user&&S.user.name)||''),ed=age(m.fn),info=[m.cc?'C.C. '+m.cc:'',ed,m.eps?'EPS '+m.eps:''].filter(Boolean);
 if(!nm&&!m.b&&!m.nt)return '<button type="button" class="emg-id emg-id0" data-emgedit="1"><b>Agrega tu nombre y tu tipo de sangre</b><small>Para que quien te ayude los vea aquí en grande.</small></button>';
 return '<div class="emg-id"><div class="emg-idt"><small>Mis datos</small><b class="emg-nm">'+E(nm||'Sin nombre')+'</b>'+(info.length?'<span>'+E(info.join(' · '))+'</span>':'')+'</div><div class="emg-bl" aria-label="Mi tipo de sangre: '+E(m.b||'sin dato')+'"><small>Mi tipo de sangre</small><b>'+E(m.b||'—')+'</b></div>'+(m.nt?'<p class="emg-nt"><small>Nota médica</small>'+E(m.nt)+'</p>':'')+'</div>'}
function open(){var L=lines(),m=mine(),cs=(m.c||[]).filter(function(c){return c&&cel(c.t)}),h='<div class="emg"><h2>'+IC.siren+'Emergencias</h2>'+card(m)+'<p class="emg-tip">Si hay riesgo para la vida, llama primero a la <b>Línea 123</b>. Toca un botón para llamar.</p><div class="emg-g">';
 L.forEach(function(x){var t=T(x.k),w=x.wa&&cel(x.t);h+='<div class="emg-b" style="--emc:'+t[2]+'"><a class="emg-call" href="'+telH(x.t)+'" aria-label="Llamar a '+E(x.n)+', '+E(x.t)+'">'+IC[t[3]]+'<b>'+E(x.n)+'</b><span>'+E(x.t)+'</span>'+(x.d?'<small>'+E(x.d)+'</small>':'')+'</a>'+(w?'<a class="emg-w" href="https://wa.me/57'+w+'" target="_blank" rel="noopener" aria-label="WhatsApp a '+E(x.n)+'">'+IC.wa+'WhatsApp</a>':'')+'</div>'});
 h+='</div><h3 class="emg-s">Mi contacto de emergencia</h3>';
 if(cs.length)cs.forEach(function(c,i){h+='<div class="emg-c"><div><b>'+E(c.n||'Contacto')+'</b>'+(c.r?' <small>· '+E(c.r)+'</small>':'')+'<br><small>'+E(c.t)+'</small></div><div class="row"><a class="btn pink" href="tel:'+cel(c.t)+'">'+IC.phone+'Llamar</a><button type="button" class="btn wa" data-emgwa="'+i+'">'+IC.wa+'WhatsApp</button></div></div>'});
 else h+='<p class="muted">Aún no tienes un contacto de emergencia. Agrega a un familiar o conocido para llamarle o escribirle desde aquí con un toque.</p>';
 h+='<button type="button" class="emg-lk" data-emgedit="1">'+(cs.length||m.b||m.nt||m.nm?'Editar mis datos de emergencia':'Agregar mis datos y mi contacto')+'</button><div class="row" style="margin-top:10px"><button type="button" class="btn ghost" data-act="close">Cerrar</button></div></div>';
 modal(h);/* v258: abrir arriba (ficha y tipo de sangre a la vista), no en el primer botón de abajo */var o=document.getElementById('ov'),d=o&&o.querySelector('.modal'),c=d&&d.querySelector('.emg-call');if(c)c.focus({preventScroll:true});if(d)d.scrollTop=0;if(o)o.scrollTop=0}
function sendWa(i){var m=mine(),c=(m.c||[]).filter(function(x){return x&&cel(x.t)})[i];if(!c)return;var who=m.nm||((S&&S.user&&S.user.name)?S.user.name:'');
 var win=null;try{win=window.open('','_blank')}catch(x){}/* v263: se abre ya, en el toque; luego se le pone la dirección */
 var go=function(loc){var t='Hola'+(c.n?' '+c.n:'')+', soy '+(who||'yo')+'. Necesito ayuda, es una emergencia.'+(loc?' Mi ubicación: '+loc:'')+(m.b?' Mi tipo de sangre: '+m.b+'.':'')+(m.nt?' Nota médica: '+m.nt+'.':''),url='https://wa.me/57'+cel(c.t)+'?text='+encodeURIComponent(t);
  try{if(win&&!win.closed){win.location.href=url;return}}catch(x){}location.href=url};
 if(!navigator.geolocation)return go('');var done=false;toast('Buscando tu ubicación…');
 setTimeout(function(){if(!done){done=true;go('')}},6000);
 navigator.geolocation.getCurrentPosition(function(p){if(done)return;done=true;go('https://maps.google.com/?q='+p.coords.latitude.toFixed(6)+','+p.coords.longitude.toFixed(6))},function(){if(done)return;done=true;go('')},{enableHighAccuracy:true,timeout:5500,maximumAge:60000})}
/* ---------- mis datos de emergencia ---------- */
function form(){var m=mine(),c=m.c||[],ci=function(i){var x=c[i]||{};return (i?'<details class="obi-ex emg-c2"'+(x.n||x.t?' open':'')+'><summary><span><b>Agregar un segundo contacto</b><small>Opcional · toca aquí para poner otra persona a quien avisar</small></span><i aria-hidden="true"></i></summary>':'')/* v282 */+'<fieldset class="emf"><legend>Contacto '+(i+1)+(i?' (opcional)':'')+'</legend><label for="em-n'+i+'">Nombre</label><input id="em-n'+i+'" type="text" maxlength="40" value="'+E(x.n||'')+'" placeholder="Ej: María Gómez"><label for="em-r'+i+'">Parentesco</label><select id="em-r'+i+'"><option value="">Elige…</option>'+REL.map(function(r){return '<option'+(x.r===r?' selected':'')+'>'+r+'</option>'}).join('')+'</select><label for="em-t'+i+'">Celular</label><input id="em-t'+i+'" type="tel" inputmode="numeric" maxlength="14" value="'+E(x.t||'')+'" placeholder="3001234567"></fieldset>'+(i?'</details>':'')};
 var un=(S&&S.user&&S.user.name)||'';
 modal('<h2>Datos de emergencia</h2><p class="muted">Todo es opcional. Se guarda <b>solo en este celular</b> (no se sube a internet) y aparece en el botón SOS, a la vista de quien te ayude.</p>'+
  '<fieldset class="emf"><legend>Mis datos personales</legend><label for="em-nm">Nombre completo</label><input id="em-nm" type="text" maxlength="60" value="'+E(m.nm||un)+'" placeholder="Ej: Ana María López"><label for="em-cc">Cédula (opcional)</label><input id="em-cc" type="text" inputmode="numeric" maxlength="15" value="'+E(m.cc||'')+'"><label for="em-fn">Fecha de nacimiento (opcional)</label><input id="em-fn" type="date" value="'+E(m.fn||'')+'"><label for="em-eps">EPS (opcional)</label><input id="em-eps" type="text" maxlength="40" value="'+E(m.eps||'')+'" placeholder="Ej: Nueva EPS, Emssanar, SOS"></fieldset>'+ci(0)+ci(1)+
  '<label for="em-b">Mi tipo de sangre</label><select id="em-b"><option value="">No sé / prefiero no decirlo</option>'+BLOOD.map(function(b){return '<option'+(m.b===b?' selected':'')+'>'+b+'</option>'}).join('')+'</select>'+
  '<label for="em-nt">Nota médica (opcional)</label><textarea id="em-nt" rows="3" maxlength="200" placeholder="Ej: alérgico a la penicilina, diabetes, uso marcapasos">'+E(m.nt||'')+'</textarea>'+
  '<p class="err" id="em-err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-emgsave="1">Guardar</button>'+(m.c||m.b||m.nt||m.nm?'<button type="button" class="btn ghost" data-emgdel="1">Borrar mis datos</button>':'')+'<button type="button" class="btn ghost" data-act="close">Cancelar</button></div>')}
function saveForm(){var c=[],er=document.getElementById('em-err');for(var i=0;i<2;i++){var n=document.getElementById('em-n'+i).value.trim(),r=document.getElementById('em-r'+i).value,t=document.getElementById('em-t'+i).value.trim();
  if(!n&&!t)continue;if(!cel(t)){var dd=document.getElementById('em-t'+i).closest('details');if(dd)dd.open=true;/* v282 */er.textContent='El celular del contacto '+(i+1)+' debe tener 10 dígitos y empezar por 3.';return}c.push({n:n.slice(0,40),r:r,t:cel(t)})}
 var g=function(id){return document.getElementById(id).value.trim()};
 setMine({nm:g('em-nm').slice(0,60),cc:g('em-cc').replace(/[^\d.]/g,'').slice(0,15),fn:g('em-fn'),eps:g('em-eps').slice(0,40),c:c,b:g('em-b'),nt:g('em-nt').slice(0,200)});closeModal(1);toast('Datos de emergencia guardados en este celular');open()}
/* ---------- administración ---------- */
var AL=null;
function admRows(){return AL.map(function(x,i){return '<div class="emr" data-i="'+i+'"><input type="text" maxlength="40" data-f="n" value="'+E(x.n||'')+'" placeholder="Nombre (ej: Policía Pradera)" aria-label="Nombre de la línea '+(i+1)+'"><input type="tel" maxlength="16" data-f="t" value="'+E(x.t||'')+'" placeholder="Número" aria-label="Número de la línea '+(i+1)+'"><input type="text" maxlength="60" data-f="d" value="'+E(x.d||'')+'" placeholder="Descripción corta (opcional)" aria-label="Descripción de la línea '+(i+1)+'" style="grid-column:1/-1"><div class="emx"><select data-f="k" aria-label="Tipo de la línea '+(i+1)+'">'+TYPES.map(function(t){return '<option value="'+t[0]+'"'+(x.k===t[0]?' selected':'')+'>'+t[1]+'</option>'}).join('')+'</select><label><input type="checkbox" data-f="wa"'+(x.wa?' checked':'')+'> Tiene WhatsApp</label><label><input type="checkbox" data-f="on"'+(x.off?'':' checked')+'> Visible</label><button type="button" class="btn ghost" data-emgup="'+i+'"'+(i?'':' disabled')+' aria-label="Subir">Subir</button><button type="button" class="btn ghost" data-emgrm="'+i+'">Quitar</button></div></div>'}).join('')}
function admRead(){var l=document.querySelectorAll('.emga .emr');AL=[].map.call(l,function(r){var g=function(f){return r.querySelector('[data-f="'+f+'"]')};return {n:g('n').value.trim().slice(0,40),t:g('t').value.trim().replace(/[^\d#*+ ]/g,'').slice(0,16),d:g('d').value.trim().slice(0,60),k:g('k').value,wa:g('wa').checked,off:!g('on').checked}})}
function admPaint(){var w=document.getElementById('emg-rows');if(w)w.innerHTML=admRows()}
window.emgAdmin=function(){if(!AL)AL=JSON.parse(JSON.stringify((S.site&&Array.isArray(S.site.emer))?S.site.emer:DEF));
 return '<div class="cg emga"><h3>Números de emergencia</h3><p class="muted">Aparecen en el botón SOS de la página para que cualquier persona llame con un toque. Agrega los números de Pradera (estación de Policía, Bomberos, hospital, ambulancias…). Marca «Tiene WhatsApp» solo si el número es un celular que responde por WhatsApp.</p>'+((S.site&&Array.isArray(S.site.emer))?'':'<p class="muted"><b>Aún no has guardado tu lista.</b> Estas son las líneas nacionales de Colombia; revísalas, agrega las locales y toca «Guardar».</p>')+
  '<div id="emg-rows">'+admRows()+'</div><div class="row" style="margin-top:12px"><button type="button" class="btn ghost" data-emgadd="1">+ Agregar número</button><button type="button" class="btn ghost" data-emgdef="1">Volver a las líneas nacionales</button></div><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-emgsadm="1">Guardar números</button><button type="button" class="btn ghost" data-emgprev="1">Ver como lo ven los usuarios</button></div></div>'};
/* ---------- globo flotante ---------- */
function fab(){var b=document.getElementById('emgfab'),show=true;try{show=MODE!=='admin'}catch(e){}
 if(!b){b=document.createElement('button');b.type='button';b.id='emgfab';b.className='emgfab';b.setAttribute('aria-label','Emergencias: llamar a Policía, Bomberos o a tu contacto');b.innerHTML=IC.siren+'<span>SOS</span>';b.setAttribute('data-emgopen','1');document.body.appendChild(b)}
 b.hidden=!show}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-emgopen],[data-emgwa],[data-emgedit],[data-emgsave],[data-emgdel],[data-emgadd],[data-emgdef],[data-emgsadm],[data-emgrm],[data-emgup],[data-emgprev],[data-act="emgMine"]');if(!b)return;
 var d=b.dataset;e.preventDefault();e.stopPropagation();
 if(d.emgopen||d.emgprev)return open();
 if(d.emgwa!=null)return sendWa(+d.emgwa);
 if(d.emgedit||d.act==='emgMine'){closeModal(1);return form()}
 if(d.emgsave)return saveForm();
 if(d.emgdel){(async function(){if(await askC('¿Borrar tus datos de emergencia de este celular?')){try{var k0=myKey(),l0=localStorage.getItem('qh_emg_last');localStorage.removeItem(k0);if(l0){localStorage.removeItem(l0);localStorage.removeItem('qh_emg_last')}}catch(x){}closeModal(1);toast('Datos borrados')}})();return}
 if(!isAdm())return;
 if(d.emgadd){admRead();AL.push({n:'',t:'',k:'otr'});admPaint();var l=document.querySelectorAll('.emga .emr');if(l.length)l[l.length-1].querySelector('input').focus();return}
 if(d.emgdef){(async function(){if(await askC('¿Reemplazar la lista por las líneas nacionales? Los cambios no guardados se pierden.')){AL=JSON.parse(JSON.stringify(DEF));admPaint()}})();return}
 if(d.emgrm!=null){admRead();AL.splice(+d.emgrm,1);admPaint();return}
 if(d.emgup!=null){admRead();var i=+d.emgup;if(i>0){var x=AL[i];AL[i]=AL[i-1];AL[i-1]=x}admPaint();return}
 if(d.emgsadm){admRead();var bad=AL.filter(function(x){return (x.n||x.t)&&!(x.n&&x.t.replace(/\D/g,'').length>=3)});if(bad.length)return toast('Cada número necesita nombre y al menos 3 dígitos');
  var n=Object.assign({},S.site);n.emer=AL.filter(function(x){return x.n&&x.t});S.site=n;save();AL=null;render(true);toast('Números de emergencia guardados');return}
},true);
function start(){try{fab()}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
