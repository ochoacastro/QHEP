
/* v248: TUTORIAL INTERACTIVO «HAZLO CONMIGO». En vez de mostrar imágenes, abre el formulario real, ilumina el campo o botón
   que toca usar, explica qué hacer y espera a que la persona lo haga para pasar al siguiente paso.
   - Ayuda y guías: arriba se elige «Hazlo conmigo» (por defecto) o «Con imágenes» (las guías de antes).
   - El botón «¿Cómo se hace?» de cada formulario arranca el tutorial ahí mismo, sin cerrar el formulario.
   - Guía nueva «Publicar con video» y, debajo del campo del enlace de video, la lista de redes que sirven.
   Si algo falla, borra este <script id="v248-hazlo-conmigo"> y el <style id="v248-hazlo-conmigo-css">: vuelven las guías con imágenes. */
(function(){
var MODE_IMG=false,R=null; /* R = tutorial en curso */
function $1(s){return document.querySelector(s)}
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function vis(el){if(!el||!el.getClientRects().length||getComputedStyle(el).visibility==='hidden')return false;var r=el.getBoundingClientRect();return r.width>6&&r.height>6}
/* el elemento que se ve en pantalla: las listas tienen un botón propio y los archivos un botón «Elegir…» */
function shown(el){if(!el)return null;var q=el.nextElementSibling;if(el.tagName==='SELECT'&&q&&q.classList.contains('qs-btn')&&vis(q))return q;if(vis(el))return el;var n=el.nextElementSibling;if(n&&vis(n))return n;var l=el.id&&document.querySelector('label[for="'+el.id+'"]');if(l&&vis(l))return l;return vis(el.parentNode)?el.parentNode:null}
function digits(v){return String(v||'').replace(/\D/g,'')}
function len(n){return function(el){return String(el.value||'').trim().length>=n}}
function tel(el){return digits(el.value).length>=10}
/* redes de video que acepta la página */
function net(u){u=String(u||'').trim();if(!u)return null;if(!/^https?:\/\//i.test(u))u='https://'+u;var h='';try{h=new URL(u).hostname.replace(/^www\./,'')}catch(e){return {ok:false,t:'Eso no parece un enlace. Pégalo completo.'}}
 var ok=typeof cmVid==='function'&&cmVid(u);
 if(ok&&/youtu/.test(h))return {ok:true,n:'YouTube',t:'✓ YouTube: se verá dentro de la página.'};
 if(ok){var n=/tiktok/.test(h)?'TikTok':/facebook|fb\./.test(h)?'Facebook':/instagram/.test(h)?'Instagram':/drive\.google/.test(h)?'Google Drive':'Video';return {ok:true,n:n,t:'✓ '+n+': al tocarlo se abrirá en su app.'}}
 return {ok:false,t:'✗ Ese enlace no sirve. Usa YouTube, TikTok, Facebook, Instagram o Google Drive.'}}
var NETS='<div class="qco-nets"><span>▶ <b>YouTube</b>: se ve dentro de la página</span><span>↗ <b>TikTok, Facebook, Instagram, Google Drive</b>: se abren en su app</span><span>✗ No sirven: Kwai, Likee, Vimeo, X (Twitter) ni otras</span></div>';
/* tipos de paso */
function T(sel,msg,o){return Object.assign({k:'tap',sel:sel,msg:msg},o||{})}
function F(sel,msg,ok,o){return Object.assign({k:'fill',sel:sel,msg:msg,ok:ok||len(1)},o||{})}
function P(sel,msg,o){return Object.assign({k:'pick',sel:sel,msg:msg},o||{})}
function U(sel,msg,o){return Object.assign({k:'file',sel:sel,msg:msg},o||{})}
function I(sel,msg,o){return Object.assign({k:'info',sel:sel,msg:msg},o||{})}
function mode(){try{return cmf.mode}catch(e){return ''}}
function claSteps(v){return [
 P('#cm-op','Elige <b>qué vas a hacer</b>: vender, arrendar, regalar, buscar…'),
 P('#cm-cat','Elige la <b>categoría</b> de tu anuncio.'),
 P('#cm-sub','Elige la <b>subcategoría</b>. Si no estás seguro, la más parecida.',{opt:1,when:function(){var s=$1('#cm-sub');return s&&s.options.length>1}}),
 v?T('.cwz-ty[data-v="vid"]','Toca <b>«Video»</b>.'):T('.cwz-types','Elige <b>cómo se verá</b> tu anuncio: con foto, solo con texto o con un video.',{match:'.cwz-ty'}),
 U('#cm-img','Toca <b>«Elegir fotos»</b> y escoge hasta 3 fotos. La primera es la principal.',{when:function(){return mode()==='img'},done:function(){try{return !!cmf.img}catch(e){return false}}}),
 F('#cm-it','Escribe el <b>texto</b> que irá en la imagen. Ej.: «Vendo nevera $500.000».',len(3),{when:function(){return mode()==='txt'}}),
 I(null,'Primero <b>copia el enlace</b> de tu video: en TikTok, YouTube, Facebook o Instagram toca <b>«Compartir»</b> → <b>«Copiar enlace»</b>. Luego vuelve aquí.'+NETS,{when:function(){return mode()==='vid'}}),
 F('#cm-v','<b>Pega el enlace</b>: mantén presionado el cuadro y toca «Pegar».',function(el){return net(el.value)&&net(el.value).ok},{when:function(){return mode()==='vid'},net:1}),
 U('#cm-vcov','Sube una <b>captura del video</b> como portada, para que se vea bonito (opcional).',{opt:1,when:function(){var l=$1('#cm-v');return mode()==='vid'&&!(typeof ytId==='function'&&ytId(l&&l.value))}}),
 F('#cm-t','Escribe un <b>título claro</b>. Ej.: «Vendo bicicleta en buen estado».',len(3)),
 F('#cm-x','Cuenta los <b>detalles</b>: cómo es, dónde estás, horario… (opcional)',null,{opt:1}),
 F('#cm-pr','Si vendes algo, escribe el <b>precio</b> (opcional).',null,{opt:1}),
 T('#cm-next','Toca <b>«Siguiente →»</b>.'),
 F('#cm-o','Escribe <b>tu nombre</b>.',len(2)),
 F('#cm-w','Tu <b>WhatsApp</b> (10 números): ahí te escribirán los interesados.',tel),
 F('#cm-z','Tu <b>barrio o vereda</b>.',len(2)),
 I('.cwz-pls','Elige <b>cuánto tiempo</b> durará tu anuncio.'),
 T('#cm-save','¡Ya casi! Revisa la vista previa y toca <b>«Publicar»</b>.',{final:1})]}
var G={
 cla:{t:'Publicar un clasificado',open:function(){comForm()},first:'#cm-op',steps:claSteps(false)},
 vid:{t:'Publicar con video',open:function(){comForm()},first:'#cm-op',steps:claSteps(true)},
 cod:{t:'Activar un rol con código',open:function(){codesModal()},first:'#cd-in',steps:[
  T('#cdbox .plsub','Elige el <b>rol</b> que necesitas: Comerciante (tienda, servicios, inmuebles, vehículos), Clasificados, Comunidad o Redactor de noticias.',{match:'.plsb'}),
  I('#cdbox [role="radiogroup"]','Elige <b>cuánto tiempo</b> lo quieres. Puedes pagarlo aquí con Bre-B o Nequi, o pedirle el código al administrador.'),
  F('#cd-in','¿Ya tienes el código? <b>Escríbelo aquí</b> (12 letras y números).',function(el){return el.value.replace(/[^A-Za-z0-9]/g,'').length===12}),
  T('[data-act="codeUse"]','Toca <b>«Canjear código»</b>.',{final:1})]},
 tie:{t:'Crear tu tienda',open:function(){shopForm()},first:'[data-act="pkind"]',steps:[
  T('[data-act="pkind"]','¿Tu negocio <b>tiene nombre propio</b> o es <b>casero</b>? Toca una opción.',{box:'parent'}),
  F('#f-name','Escribe el <b>nombre</b> de tu negocio.',len(2)),
  F('#f-desc','Una <b>descripción corta</b>: qué vendes o qué haces.',len(3)),
  U('#f-img','Sube tu <b>logo</b> o una foto de tu negocio (opcional).',{opt:1}),
  T('#f-cats','Toca la <b>categoría</b> de tu negocio.',{match:'[data-act="pcat"],[data-act="pcatnew"]'}),
  F('#f-owner','Escribe <b>tu nombre</b>.',len(2)),
  F('#f-wa','El <b>teléfono o WhatsApp</b> del negocio: ahí te contactarán.',tel),
  F('#x-zone','Tu <b>barrio o zona</b> (opcional).',null,{opt:1}),
  I('#x-hrs','Pon tu <b>horario de atención</b>: marca los días que abres y elige la hora. Si abres igual varios días, toca «Aplicar este horario a los días marcados».',{box:'up2'}),
  F('#x-addr','La <b>dirección</b> de tu negocio (opcional).',null,{opt:1}),
  T('[data-act="saveShop"]','¡Listo! Toca <b>«Abrir tienda»</b>.',{final:1})]},
 pro:{t:'Agregar productos',open:function(){var id=(S.mine||[]).find(function(i){return S.stores.some(function(s){return s.id===i})});if(!id)return 'nostore';cur=id;prodForm()},first:'#p-name',steps:[
  F('#p-name','Escribe el <b>nombre</b> del producto.',len(2)),
  F('#p-price','Escribe el <b>precio</b> en pesos.',function(el){return digits(el.value).length>0}),
  F('#p-d','Una <b>descripción corta</b> (opcional).',null,{opt:1}),
  U('#p-img','Sube hasta 6 <b>fotos</b> (opcional).',{opt:1}),
  T('[data-act="saveProd"]','Toca <b>«Guardar»</b>.',{final:1})]},
 ser:{t:'Ofrecer un servicio',open:function(){servForm()},first:'#v-name',steps:[
  F('#v-name','Escribe <b>tu nombre</b>.',len(2)),
  P('#v-job','Elige tu <b>oficio</b>.'),
  F('#v-other','Escribe <b>cuál es tu oficio</b>.',len(3),{when:function(){var j=$1('#v-job');return j&&j.value==='Otro'}}),
  F('#v-desc','Cuenta tu <b>experiencia</b> en pocas palabras.',len(5)),
  F('#v-zone','El <b>barrio o zona</b> donde trabajas.',null,{opt:1}),
  F('#v-rate','Tu <b>tarifa</b> (opcional).',null,{opt:1}),
  F('#v-wa','Tu <b>WhatsApp</b> (10 números).',tel),
  T('[data-act="saveServ"]','Toca <b>«Publicar servicio»</b>.',{final:1})]},
 inm:{t:'Publicar inmueble o vehículo',choose:[['Inmueble','arr'],['Vehículo','veh']],chooseMsg:'¿Qué vas a publicar?',open:function(b){adForm(b)},first:'#a-owner',steps:[
  F('#af-title','Escribe un <b>título</b>. Ej.: «Arriendo casa de 3 habitaciones».',len(3),{when:function(b){return b==='arr'}}),
  P('#af-ptype','Elige el <b>tipo de inmueble</b>.',{when:function(b){return b==='arr'}}),
  P('#af-vtype','Elige el <b>tipo de vehículo</b>.',{when:function(b){return b==='veh'}}),
  F('#af-brand','La <b>marca</b>.',len(2),{when:function(b){return b==='veh'}}),
  F('#af-line','La <b>línea o modelo</b>.',len(1),{when:function(b){return b==='veh'}}),
  F('#af-year','El <b>año</b> del modelo.',function(el){return digits(el.value).length===4},{when:function(b){return b==='veh'}}),
  F('#af-price','El <b>precio</b> en pesos.',function(el){return digits(el.value).length>0}),
  F('#af-zone','El <b>barrio o zona</b>.',null,{opt:1}),
  U('#a-img','Sube <b>fotos</b> (hasta 5).',{opt:1}),
  F('#a-owner','Escribe <b>tu nombre</b>.',len(2)),
  F('#a-wa','Tu <b>WhatsApp</b> (10 números).',tel),
  T('[data-act="saveAd"]','Toca <b>«Publicar»</b>.',{final:1})]},
 not:{t:'Redactar una noticia',open:function(){nwForm()},first:'#nw-t',steps:[
  F('#nw-t','Escribe un <b>título corto y claro</b>.',len(5)),
  P('#nw-cat','Elige la <b>categoría</b>: Comunidad, Clima, Empleo, Eventos…'),
  F('#nw-x','Cuenta <b>qué pasó, cuándo y dónde</b> (mínimo 20 letras). Con los botones de arriba puedes poner <b>negrilla</b>, subtítulos, listas y enlaces.',len(20)),
  U('#nw-img','Sube una <b>imagen de portada</b> (opcional).',{opt:1}),
  U('#nw-imgs','Si quieres, agrega <b>más fotos</b> (hasta 4).',{opt:1}),
  F('#nw-v','¿Tienes un <b>video</b>? Pega aquí el enlace (opcional).'+NETS,function(el){return !el.value.trim()||(net(el.value)&&net(el.value).ok)},{opt:1,net:1}),
  F('#nw-a','La <b>firma</b>: tu nombre o el del medio.',len(2)),
  T('[data-act="nwSave"]','Toca <b>«Publicar»</b>.',{final:1})]}
};
/* ------- motor ------- */
function ui(){var o=$1('#qco');if(!o){o=document.createElement('div');o.id='qco';o.innerHTML='<div class="qco-spot"></div><div class="qco-b" role="dialog" aria-live="polite"></div>';document.body.appendChild(o)}return o}
function stop(msg){if(R){R.off&&R.off();R=null}var o=$1('#qco');if(o)o.remove();if(msg)try{toast(msg)}catch(e){}}
function bubble(html,btns,box){var o=ui(),b=o.querySelector('.qco-b');b.innerHTML='<div class="qco-n"><span>'+E(R.g.t)+(R.n?' · Paso '+R.n:'')+'</span><button type="button" class="qco-x" data-qco="x">Salir ✕</button></div><div class="qco-t">'+html+'</div><div class="qco-st"></div>'+(btns&&btns.length?'<div class="qco-bt">'+btns.map(function(x){return '<button type="button" data-qco="'+x[0]+'"'+(x[2]?' class="pri"':'')+'>'+x[1]+'</button>'}).join('')+'</div>':'');
 o.classList.toggle('nospot',!box);R.box=box||null;place()}
function place(){if(!R)return;var o=$1('#qco');if(!o)return;var s=o.querySelector('.qco-spot'),b=o.querySelector('.qco-b'),vh=(window.visualViewport?visualViewport.height:innerHeight),bh=b.offsetHeight;
 o.classList.toggle('free',!!$1('.qs-ov,.qtour'));
 if(R.box&&R.box.tagName==='SELECT'){var qb=R.box.nextElementSibling;if(qb&&qb.classList.contains('qs-btn')&&vis(qb))R.box=qb}
 if(R.box&&R.box.isConnected){var r=R.box.getBoundingClientRect(),p=6;s.style.top=(r.top-p)+'px';s.style.left=(r.left-p)+'px';s.style.width=(r.width+2*p)+'px';s.style.height=(r.height+2*p)+'px';
  var below=r.bottom+18,above=r.top-18-bh;b.style.top=Math.max(10,Math.min(vh-bh-10,(r.top+r.height/2>vh/2&&above>10)?above:(below+bh<vh-10?below:Math.max(10,above))))+'px'}
 else{b.style.top=Math.max(10,(vh-bh)/2)+'px'}}
(function loop(){if(R)place();requestAnimationFrame(loop)})();
function boxOf(st,el){if(st.box==='parent')return el.parentNode;if(st.box==='up2')return el.parentNode&&el.parentNode.parentNode||el;return shown(el)||el}
function wait(sel,ms){return new Promise(function(res){var t0=Date.now();(function chk(){if(!R)return res(null);var el=sel&&document.querySelector(sel);if(el&&shown(el))return res(el);if(Date.now()-t0>ms)return res(null);setTimeout(chk,120)})()})}
function errText(){var e=$1('#ov #err');return e&&e.textContent.trim()}
function gates(){if($1('#l-id'))return 'login';if($1('#cd-in')&&R.id!=='cod')return 'role';return ''}
async function run(){var me=R;
 if(R.g.choose&&!R.inPlace){R.n=0;bubble(E(R.g.chooseMsg),R.g.choose.map(function(c){return ['ch:'+c[1],c[0],1]}).concat([['x','Salir']]),null);return}
 if(!R.inPlace){try{closeModal(1)}catch(e){}var r=R.g.open(R.branch);if(r==='nostore'){R.n=0;bubble('Para agregar productos primero necesitas <b>crear tu tienda</b>.',[['go:tie','Crear mi tienda',1],['x','Salir']]);return}}
 var f=await wait(R.g.first,2500);if(me!==R)return;
 if(!f){var g=gates();R.n=0;
  if(g==='login'){bubble('Primero <b>entra a tu cuenta</b> (o regístrate). Cuando entres, vuelve a abrir esta guía.',[['x','Entendido',1]]);return}
  if(g==='role'){bubble('Para esto necesitas un <b>rol activo</b>. ¿Te muestro cómo activarlo?',[['go:cod','Sí, muéstrame',1],['x','Ahora no']]);return}
  bubble('No pude abrir el formulario. Cierra esta guía e inténtalo de nuevo.',[['x','Cerrar',1]]);return}
 R.i=0;R.n=0;next()}
async function next(){var me=R;if(!R)return;
 while(R.i<R.g.steps.length){var st=R.g.steps[R.i];if(st.when&&!st.when(R.branch)){R.i++;continue}break}
 if(R.i>=R.g.steps.length){finish();return}
 var st=R.g.steps[R.i];R.n++;
 if(st.k==='info'&&!st.sel){bubble(st.msg,[['ok','Siguiente →',1]],null);return}
 var el=await wait(st.sel,st.k==='tap'&&st.final?1500:4000);if(me!==R)return;
 if(!el){if(!$1('#ov')){stop('Tutorial cerrado');return}var er=errText();
  if(er){R.n--;bubble('Falta algo: <b>'+E(er)+'</b> Corrígelo y sigue.',[['retry','Ya lo corregí',1]],$1('#ov #err'));return}
  if(st.opt||st.k==='info'){R.i++;R.n--;next();return}
  R.n--;bubble('No encuentro este paso en pantalla. Desliza el formulario o toca «Reintentar».',[['retry','Reintentar',1],['x','Salir']],null);return}
 var box=boxOf(st,el);try{box.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}
 var btns=[];
 if(st.k==='fill')btns.push(['ok','Listo ✓',1]);
 if(st.k==='info')btns.push(['ok','Siguiente →',1]);
 if(st.opt&&st.k!=='info')btns.push(['skip','Saltar']);
 bubble(st.msg,btns,box);
 var b=$1('#qco [data-qco="ok"]');
 if(st.k==='fill'){var upd=function(){var ok=st.ok?st.ok(el):true;if(b)b.disabled=!ok;if(st.net){var s=$1('#qco .qco-st'),n=net(el.value);if(s){s.textContent=n?n.t:'';s.className='qco-st'+(n?(n.ok?' ok':' bad'):'')}}};el.addEventListener('input',upd);R.off=function(){el.removeEventListener('input',upd)};upd();setTimeout(function(){try{if(me===R)el.focus({preventScroll:true})}catch(e){}},350)}
 else if(st.k==='pick'){var ch=function(){R.off();R.i++;setTimeout(next,250)};el.addEventListener('change',ch);R.off=function(){el.removeEventListener('change',ch)}}
 else if(st.k==='file'){var fc=function(){R.off();var t0=Date.now();(function w(){if(me!==R)return;if(!st.done||st.done()||Date.now()-t0>15000){R.i++;next()}else setTimeout(w,300)})()};el.addEventListener('change',fc);R.off=function(){el.removeEventListener('change',fc)}}
 else if(st.k==='tap'){var m=st.match||st.sel;var tc=function(e){var t=e.target.closest&&e.target.closest(m);if(!t||(st.match&&!box.contains(t)))return;R.off();if(st.final){var o=$1('#qco');if(o)o.classList.add('nospot');setTimeout(function(){if(me!==R)return;var er=errText();if($1('#ov')&&er){R.n--;var rl=/\brol\b|c[oó]digo/i.test(er)&&R.id!=='cod';bubble('Falta algo: <b>'+E(er)+'</b> '+(rl?'Primero activa el rol; después vuelves a publicar.':'Corrígelo y vuelve a intentarlo.'),rl?[['go:cod','Cómo activar el rol',1],['retry','Ya lo corregí']]:[['retry','Ya lo corregí',1]],$1('#ov #err'))}else finish()},1800)}else{R.i++;setTimeout(next,300)}};document.addEventListener('click',tc,true);R.off=function(){document.removeEventListener('click',tc,true)}}
 else R.off=function(){}}
function finish(){if(!R)return;R.n=0;var gst=typeof CMG!=='undefined'&&CMG&&!S.user/* v255: anuncio sin cuenta: falta crear la cuenta */;bubble(gst?'<b>Ya casi.</b> Ahora crea tu cuenta (o entra si ya tienes una) y tu anuncio se publica solo.':'<b>¡Lo lograste!</b> Ya sabes cómo hacerlo.',[['x',gst?'Entendido':'Terminar',1]],null);setTimeout(function(){if(R&&R.n===0&&$1('#qco .qco-t')&&/Lo lograste/.test($1('#qco .qco-t').textContent))stop()},6000)}
function start(id,inPlace,branch){stop();var g=G[id];if(!g)return false;R={id:id,g:g,inPlace:!!inPlace,branch:branch||'',i:0,n:0,off:function(){}};
 if(inPlace&&g.choose&&!branch){var a=$1('#af-vtype')?'veh':'arr';R.branch=a}
 run();return true}
window.coachStart=start;
/* botones del globo */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#qco [data-qco]');if(!b||!R)return;e.preventDefault();e.stopPropagation();var a=b.dataset.qco;
 if(a==='x')return stop();
 if(a==='ok'){R.off&&R.off();R.i++;return next()}
 if(a==='skip'){R.off&&R.off();R.i++;return next()}
 if(a==='retry'){R.off&&R.off();return next()}
 if(a.indexOf('ch:')===0){R.branch=a.slice(3);R.choose=0;var g=R.g;R.g=Object.assign({},g,{choose:null});return run()}
 if(a.indexOf('go:')===0){var id=a.slice(3),inP=id==='cod'&&!!$1('#cd-in');return start(id,inP)}},true);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&R&&!$1('.qs-ov'))stop()});
/* ¿Cómo se hace? (dentro del formulario) y Ayuda y guías: arrancan el tutorial interactivo (window: va antes que las guías con imágenes) */
window.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-guide]');if(!b)return;var id=b.dataset.guide;
 var inForm=b.classList.contains('qhelp'),inHelp=!!b.closest('.qhl');if(!G[id]||(!inForm&&!inHelp))return;if(inHelp&&MODE_IMG&&id!=='vid')return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 if(inForm)start(id,true);else{try{closeModal(1)}catch(x){}setTimeout(function(){start(id,false)},150)}},true);
/* Guía nueva: Publicar con video (en Ayuda y guías) */
try{if(typeof GUIDES!=='undefined'&&!GUIDES.some(function(g){return g.id==='vid'})){var i=GUIDES.findIndex(function(g){return g.id==='cla'});GUIDES.splice(i+1,0,{id:'vid',ic:'🎬',t:'Publicar con video',d:'YouTube, TikTok, Facebook, Instagram o Drive',f:'',s:[]})}}catch(e){}
/* elegir modo en Ayuda y guías, y lista de redes debajo del campo del enlace */
var pend=false;new MutationObserver(function(){if(pend)return;pend=true;(window.requestAnimationFrame||setTimeout)(function(){pend=false;
 /* v366: se quitó el selector «Hazlo conmigo / Con imágenes»; las guías siempre son interactivas */
 ['#cm-v','#nw-v'].forEach(function(s){var el=$1(s);if(!el||el.dataset.qnet)return;el.dataset.qnet=1;var d=document.createElement('div');d.innerHTML='<p class="qnets">▶ <b>YouTube</b> se ve dentro de la página · ↗ <b>TikTok, Facebook, Instagram y Google Drive</b> se abren en su app. Para copiar el enlace: en la red social toca <b>Compartir → Copiar enlace</b>.</p><p class="qnet-st" aria-live="polite"></p>';el.insertAdjacentElement('afterend',d);
  var st=d.querySelector('.qnet-st'),u=function(){var n=net(el.value);st.textContent=n?n.t:'';st.className='qnet-st'+(n?(n.ok?' ok':' bad'):'')};el.addEventListener('input',u);u()})})}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-qcm]');if(!b)return;MODE_IMG=b.dataset.qcm==='1';b.parentNode.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)})});
})();
