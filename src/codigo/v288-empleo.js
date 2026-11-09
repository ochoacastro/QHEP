
/* v288: plantilla para anuncios de empleo en Clasificados, como en los portales de empleo:
   - «Ofrezco empleo»: cargo, empresa, tipo de contrato, jornada, horario, salario, vacantes y funciones (básica);
     y además estudios, título, experiencia, licencia, conocimientos, beneficios y fecha límite (completa).
   - «Busco empleo»: cargo u oficio, jornada, aspiración salarial, experiencia y lo que sabe hacer (básica); estudios, título, licencia y disponibilidad (completa).
   La plantilla llena sola el título, la descripción, el precio (salario) y el texto del aviso. No cambia cómo se guarda el anuncio
   (no hacen falta reglas nuevas). Si algo falla, borra este <script> y su <style>. */
(function(){
var CT=['Término indefinido','Término fijo','Obra o labor','Prestación de servicios','Aprendizaje (SENA)'],/* v325: formal */
 CTI=['Por días','Por horas','Por obra o trabajo','Temporal o por temporada','Prestación de servicios'],/* v325: informal */
 UN=['por día','por semana','por quincena','por mes','por obra'],
 DIAS=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],
 JO=['Tiempo completo','Medio tiempo','Por turnos','Fines de semana','Por días','Nocturna'],
 ED=['No se requieren estudios','Primaria','Bachiller','Técnico','Tecnólogo','Profesional','Especialización o posgrado'],
 EX=['Sin experiencia','6 meses','1 año','2 años','3 años o más','5 años o más'],
 LI=['No requiere','A2 (moto)','B1 (carro)','C1 (servicio público o camioneta)','C2 (camión)'],
 BE=['Prestaciones de ley','Auxilio de transporte','Alimentación','Bonificaciones','Dotación o uniforme','Horario flexible'];
var lvl='';/* v326: no hay tipo elegido hasta que la persona lo diga */
function $1(id){return document.getElementById(id)}
function E(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function sel(id,l,ph){return '<select id="'+id+'"><option value="">'+(ph||'Elige…')+'</option>'+l.map(function(x){return '<option>'+E(x)+'</option>'}).join('')+'</select>'}
function inp(id,ml,ph,t){return '<input id="'+id+'" type="'+(t||'text')+'" maxlength="'+ml+'" placeholder="'+E(ph||'')+'"'+(t==='date'?'':'')+'>'}
function html(k){var of=k==='oemp';
 return '<div class="jobt" id="jobt" data-k="'+k+'"><h3>'+(of?'Plantilla de oferta de empleo':'Plantilla para buscar empleo')+'</h3>'+
 '<p class="muted" style="margin:0;font-size:13.5px">'+(of?'Llena estos datos y el anuncio se escribe solo, ordenado como en los portales de empleo.':'Cuenta qué trabajo buscas y qué sabes hacer. El anuncio se escribe solo.')+'</p>'+
 '<p style="margin:12px 0 6px;font-weight:800">'+(of?'¿El empleo es formal o informal?':'¿Buscas empleo formal o informal?')+'</p>'+/* v326 */
 '<div class="jobl" role="group" aria-label="Tipo de empleo"><button type="button" data-jobl="b" aria-pressed="'+(lvl==='b')+'">Informal</button><button type="button" data-jobl="c" aria-pressed="'+(lvl==='c')+'">Formal</button></div>'+
 '<p class="muted" style="margin:6px 0 0;font-size:13.5px">'+(lvl==='c'?'Formal: con contrato laboral, salario mensual, prestaciones y estudios.':lvl==='b'?'Informal: oficios y trabajos por días, por horas o por obra, sin contrato laboral.':'Formal: con contrato laboral y prestaciones. Informal: por días, por horas o por obra.')+'</p>'+/* v325 */
 '<div class="jobf"'+(lvl?'':' hidden')+'>'+/* v326: los campos aparecen al elegir */
 (of?
  '<label for="jb-cg">Cargo o puesto *</label>'+inp('jb-cg',50,'Ej: Auxiliar de cocina, Vendedor de mostrador')+
  '<label for="jb-em">Empresa o negocio (opcional)</label>'+inp('jb-em',40,'Ej: Panadería La Espiga')+
  '<div class="jobr"><div><label for="jb-ct">'+(lvl==='c'?'Tipo de contrato':'Forma de trabajo')+'</label>'+sel('jb-ct',lvl==='c'?CT:CTI)+'</div><div><label for="jb-jo">Jornada</label>'+sel('jb-jo',JO)+'</div></div>'+
  '<div class="jobr"><div><label for="jb-ho">Horario</label>'+inp('jb-ho',40,'Ej: Lunes a sábado, 7 a.m. a 4 p.m.')+'</div><div><label for="jb-va">Vacantes</label>'+inp('jb-va',3,'1','number')+'</div></div>'+
  (lvl==='c'?'<label for="jb-sa">Salario mensual</label><input id="jb-sa" type="text" inputmode="numeric" data-money placeholder="Ej: 1.750.905"><div class="jobb"><label><input type="checkbox" id="jb-ac"> A convenir</label><label><input type="checkbox" id="jb-sm"> Salario mínimo</label></div>'
  :'<div class="jobr"><div><label for="jb-sa">Pago</label><input id="jb-sa" type="text" inputmode="numeric" data-money placeholder="Ej: 70.000"></div><div><label for="jb-un">Cada cuánto</label>'+sel('jb-un',UN,'Elige…')+'</div></div><div class="jobb"><label><input type="checkbox" id="jb-ac"> A convenir</label></div>')+/* v325 */
  '<label for="jb-fu">Funciones principales *</label><textarea id="jb-fu" rows="3" maxlength="160" placeholder="Ej: Preparar alimentos, mantener la cocina limpia y atender pedidos"></textarea>'+
  /* v327: requisitos mínimos */
  '<label for="jb-rq">Requisitos mínimos</label><textarea id="jb-rq" rows="2" maxlength="160" placeholder="'+(lvl==='c'?'Ej: Bachiller, 1 año de experiencia en ventas, manejo de Excel':'Ej: Saber manejar moto, experiencia en construcción, traer herramientas')+'"></textarea>'+
  /* v325: dónde se entregan las hojas de vida */
  '<p style="margin:14px 0 2px;font-weight:700">¿Cómo reciben las hojas de vida?</p><p class="muted" style="margin:0 0 4px;font-size:13.5px">Llena una o varias.</p>'+
  '<div class="jobb"><label><input type="checkbox" id="jb-hw"> Por WhatsApp</label></div>'+inp('jb-hwn',10,'Número, si es otro distinto al del anuncio','tel')+
  '<label for="jb-hce">Por correo</label>'+inp('jb-hce',60,'Ej: empleos@miempresa.com','email')+
  '<label for="jb-hpd">Personalmente en (dirección)</label>'+inp('jb-hpd',80,'Ej: Calle 5 # 3-20, oficina 2')+
  /* v326: en persona hay que decir qué días y en qué horario */
  '<p style="margin:8px 0 2px;font-weight:700;font-size:14.5px">Días para entregarla en persona</p><div class="jobb">'+DIAS.map(function(d,i){return '<label><input type="checkbox" data-jbd="'+i+'"> '+d+'</label>'}).join('')+'</div>'+
  '<div class="jobr"><div><label for="jb-hh1">Desde</label><input id="jb-hh1" type="time" value=""></div><div><label for="jb-hh2">Hasta</label><input id="jb-hh2" type="time" value=""></div></div>'+
  '<label for="jb-hpq">Preguntar por (opcional)</label>'+inp('jb-hpq',50,'Ej: Marta, la administradora')/* v328 */
 :
  '<label for="jb-cg">Cargo u oficio que buscas *</label>'+inp('jb-cg',50,'Ej: Mesero, conductor, auxiliar contable')+
  '<div class="jobr"><div><label for="jb-jo">Jornada que buscas</label>'+sel('jb-jo',JO)+'</div><div><label for="jb-xp">Experiencia</label>'+sel('jb-xp',EX)+'</div></div>'+
  '<label for="jb-sa">Aspiración salarial (opcional)</label><input id="jb-sa" type="text" inputmode="numeric" data-money placeholder="Ej: 1.500.000"><div class="jobb"><label><input type="checkbox" id="jb-ac"> A convenir</label></div>'+
  '<label for="jb-fu">¿Qué sabes hacer? *</label><textarea id="jb-fu" rows="3" maxlength="160" placeholder="Ej: Atención al cliente, manejo de caja, cocina básica"></textarea>')+
 '<div class="jobadv"'+(lvl==='c'?'':' hidden')+'>'+
  '<div class="jobr"><div><label for="jb-ed">'+(of?'Estudios mínimos':'Nivel de estudios')+'</label>'+sel('jb-ed',ED)+'</div><div><label for="jb-ti">Título o carrera</label>'+inp('jb-ti',40,'Ej: Técnico en cocina')+'</div></div>'+
  (of?'<div class="jobr"><div><label for="jb-xp">Experiencia</label>'+sel('jb-xp',EX)+'</div><div><label for="jb-li">Licencia de conducción</label>'+sel('jb-li',LI)+'</div></div>':'<label for="jb-li">Licencia de conducción</label>'+sel('jb-li',LI))+
  '<label for="jb-co">Conocimientos (opcional)</label>'+inp('jb-co',60,of?'Ej: Excel, manejo de caja, inglés básico':'Ej: Excel, cocina, manejo de moto')+
  (of?'<label>Beneficios</label><div class="jobb">'+BE.map(function(x,i){return '<label><input type="checkbox" data-jbb="'+i+'"> '+E(x)+'</label>'}).join('')+'</div><label for="jb-fl">Recibe hojas de vida hasta (opcional)</label>'+inp('jb-fl',10,'','date')
     :'<div class="jobb"><label><input type="checkbox" id="jb-di"> Disponibilidad inmediata</label></div>')+
 '</div>'+
 (of?'<p class="muted jobn">Consejo: no pidas edad, sexo, estado civil ni foto. Describe lo que la persona debe saber hacer.</p>':'')+
 '</div><p class="jobok" id="jb-ok" hidden></p></div>'}
function v(id){var e=$1(id);return e?String(e.value||'').trim():''}
/* v326: días y horario para entregar la hoja de vida en persona */
function pdDays(){return [].filter.call(document.querySelectorAll('#jobt [data-jbd]'),function(x){return x.checked}).map(function(x){return +x.dataset.jbd})}
function hh(t){var m=String(t||'').match(/^(\d{1,2}):(\d{2})/);if(!m)return '';var h=+m[1],mi=m[2];if(h===12&&mi==='00')return '12 m.';var am=h<12;h=h%12||12;return h+(mi==='00'?'':':'+mi)+(am?' a. m.':' p. m.')}
function pdTxt(){var d=pdDays(),t='';if(d.length){var run=d.every(function(x,i){return !i||x===d[i-1]+1});t=d.length>=3&&run?DIAS[d[0]].toLowerCase()+' a '+DIAS[d[d.length-1]].toLowerCase():d.map(function(x){return DIAS[x].toLowerCase()}).join(', ').replace(/, ([^,]*)$/,' y $1')}
 var h1=hh(v('jb-hh1')),h2=hh(v('jb-hh2')),hr=h1&&h2?'de '+h1+' a '+h2:'';return t||hr?' ('+[t,hr].filter(Boolean).join(', ')+')':''}
window.jobPdErr=function(){if(!$1('jobt'))return '';var a=v('jb-hpd'),d=pdDays().length,h1=v('jb-hh1'),h2=v('jb-hh2');if(!a&&!d&&!h1&&!h2)return '';
 if(!a)return 'Escribe la dirección donde reciben las hojas de vida en persona.';if(!d)return 'Marca qué días reciben hojas de vida en persona.';if(!h1||!h2)return 'Escribe desde qué hora y hasta qué hora reciben hojas de vida en persona.';if(h2<=h1)return 'La hora «Hasta» debe ser después de la hora «Desde».';return ''};
function ck(id){var e=$1(id);return !!(e&&e.checked)}
function fdate(s){try{var d=new Date(s+'T12:00:00');if(isNaN(d))return '';return d.toLocaleDateString('es-CO',{day:'numeric',month:'long'})}catch(e){return ''}}
function money(s){var n=Number(String(s).replace(/\D/g,''));return n?'$'+n.toLocaleString('es-CO'):''}
/* arma título, descripción y salario a partir de la plantilla */
function gen(){var w=$1('jobt');if(!w)return;var of=w.dataset.k==='oemp',adv=lvl==='c',cg=v('jb-cg');
 var L=[],sa=ck('jb-ac')?'a convenir':ck('jb-sm')?'salario mínimo':money(v('jb-sa'));if(sa&&!adv&&sa!=='a convenir'&&v('jb-un'))sa+=' '+v('jb-un');/* v325 */
 if(lvl)L.push(adv?'Empleo formal':'Trabajo informal');
 if(of){if(v('jb-em'))L.push('Empresa: '+v('jb-em'));var cj=[v('jb-ct')&&(adv?'Contrato: ':'Forma de trabajo: ')+v('jb-ct'),v('jb-jo')&&'Jornada: '+v('jb-jo')].filter(Boolean);if(cj.length)L.push(cj.join(' · '));
  if(v('jb-ho'))L.push('Horario: '+v('jb-ho'));if(sa)L.push((adv?'Salario: ':'Pago: ')+sa);var va=+v('jb-va');if(va>1)L.push('Vacantes: '+va);
  if(v('jb-rq'))L.push('Requisitos: '+v('jb-rq'))/* v327 */;
  var hv=[(ck('jb-hw')||v('jb-hwn'))?'por WhatsApp'+(v('jb-hwn').replace(/\D/g,'')?' al '+v('jb-hwn').replace(/\D/g,''):''):'',v('jb-hce')?'al correo '+v('jb-hce'):'',v('jb-hpd')?'personalmente en '+v('jb-hpd')+pdTxt()+(v('jb-hpq')?', preguntar por '+v('jb-hpq'):''):''].filter(Boolean);if(hv.length)L.push('Hojas de vida: '+hv.join(' · '))/* v325 */;}
 else{var bj=[v('jb-jo')&&'Jornada: '+v('jb-jo'),v('jb-xp')&&'Experiencia: '+v('jb-xp')].filter(Boolean);if(bj.length)L.push(bj.join(' · '));if(sa)L.push('Aspiración salarial: '+sa)}
 var fu=v('jb-fu');
 if(adv){var es=[v('jb-ed')&&v('jb-ed')!==ED[0]?v('jb-ed'):'',v('jb-ti')].filter(Boolean).join(' en ').replace(/^(Técnico|Tecnólogo|Profesional) en \1/,'$1');
  if(v('jb-ed')===ED[0])L.push('Estudios: no se requieren');else if(es)L.push('Estudios: '+es);
  if(of&&v('jb-xp'))L.push('Experiencia: '+v('jb-xp'));if(v('jb-li')&&v('jb-li')!=='No requiere')L.push('Licencia: '+v('jb-li'));if(v('jb-co'))L.push('Conocimientos: '+v('jb-co'));
  if(of){var be=[].filter.call(document.querySelectorAll('#jobt [data-jbb]'),function(x){return x.checked}).map(function(x){return BE[+x.dataset.jbb].toLowerCase()});if(be.length)L.push('Beneficios: '+be.join(', '));
   if(v('jb-fl')&&fdate(v('jb-fl')))L.push('Recibe hojas de vida hasta el '+fdate(v('jb-fl')))}
  else if(ck('jb-di'))L.push('Disponibilidad inmediata')}
 /* orden: datos del puesto, funciones y luego lo demás; si no cabe en 400, se acortan las funciones y se quitan primero los datos menos importantes */
 var lab=of?'Funciones: ':'Sé hacer: ',cut=of?(L.findIndex(function(x){return /^(Vacantes|Requisitos|Hojas de vida|Estudios|Experiencia|Licencia|Conocimientos|Beneficios|Recibe)/.test(x)})):(L.findIndex(function(x){return /^(Estudios|Licencia|Conocimientos|Disponibilidad)/.test(x)}));if(cut<0)cut=L.length;
 var drop=[],OPT=['Conocimientos','Recibe','Beneficios','Licencia','Vacantes','Horario','Empresa'];
 var avail=function(){return 400-L.join('\n').length-(L.length?1:0)-lab.length};
 for(var oi=0;fu&&avail()<Math.min(60,fu.length)&&oi<OPT.length;oi++){var ix=L.findIndex(function(x){return x.indexOf(OPT[oi])===0});if(ix>=0){drop.push(OPT[oi]==='Recibe'?'fecha límite':OPT[oi].toLowerCase());L.splice(ix,1);if(ix<cut)cut--}}
 if(fu){var av=avail();if(fu.length>av)fu=fu.slice(0,Math.max(0,av-1)).replace(/\s+\S*$/,'')+'…';L.splice(Math.min(cut,L.length),0,lab+fu)}
 var tx=L.join('\n').slice(0,400),ti=cg?((of?'Se busca: ':'Busco empleo: ')+cg).slice(0,60):'';
 var t=$1('cm-t'),x=$1('cm-x'),pr=$1('cm-pr'),it=$1('cm-it');
 if(t&&ti){t.value=ti;t.dispatchEvent(new Event('input',{bubbles:true}))}
 if(x){x.value=tx;x.dispatchEvent(new Event('input',{bubbles:true}))}
 if(pr){var n=ck('jb-ac')?0:Number(v('jb-sa').replace(/\D/g,''))||0;pr.value=n?n.toLocaleString('es-CO'):''}
 if(it&&cg){it.value=(of?'SE BUSCA\n':'BUSCO EMPLEO\n')+cg+(of&&sa&&sa!=='a convenir'?'\n'+sa:'');it.dispatchEvent(new Event('input',{bubbles:true}))}
 var ok=$1('jb-ok');if(ok){ok.hidden=!cg;ok.textContent=cg?'Listo: el título y la descripción de abajo se llenaron solos ('+tx.length+'/400). Puedes revisarlos.'+(drop.length?' Para que quepa se quitó: '+drop.join(', ')+'.':''):''}}
/* muestra u oculta la plantilla según el tipo y la categoría */
function sync(){var op=$1('cm-op'),cat=$1('cm-cat'),t=$1('cm-t');if(!op||!cat||!t)return;var k=op.value,on=cat.value==='emp'&&(k==='oemp'||k==='bemp'),w=$1('jobt');
 if(!on){if(w)w.remove();return}if(w&&w.dataset.k===k)return;if(w)w.remove();else lvl='';/* v326: cada formulario nuevo pregunta formal o informal */
 var lab=document.querySelector('label[for="cm-t"]');if(!lab)return;lab.insertAdjacentHTML('beforebegin',html(k))}
document.addEventListener('change',function(e){var t=e.target;if(!t)return;
 if(t.id==='cm-op'&&(t.value==='oemp'||t.value==='bemp'))setTimeout(function(){var c=$1('cm-cat');if(c&&c.value!=='emp'&&[].some.call(c.options,function(o){return o.value==='emp'})){c.value='emp';c.dispatchEvent(new Event('change',{bubbles:true}))}sync()},0);
 else if(t.id==='cm-op'||t.id==='cm-cat')setTimeout(sync,0);
 if(t.closest&&t.closest('#jobt')){if(t.id==='jb-ac'&&t.checked){var s=$1('jb-sm');if(s)s.checked=false}if(t.id==='jb-sm'&&t.checked){var a=$1('jb-ac');if(a)a.checked=false}gen()}},true);
document.addEventListener('input',function(e){if(e.target&&e.target.closest&&e.target.closest('#jobt'))gen()},true);
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-jobl]');if(!b)return;e.preventDefault();if(lvl===b.dataset.jobl)return;lvl=b.dataset.jobl;
 /* v325: informal y formal tienen campos distintos: se vuelve a armar la plantilla conservando lo escrito */
 var w=$1('jobt'),keep={};if(w){[].forEach.call(w.querySelectorAll('input[id],select[id],textarea[id]'),function(x){keep[x.id]=x.type==='checkbox'?x.checked:x.value});[].forEach.call(w.querySelectorAll('[data-jbb]'),function(x){keep['b'+x.dataset.jbb]=x.checked});[].forEach.call(w.querySelectorAll('[data-jbd]'),function(x){keep['d'+x.dataset.jbd]=x.checked})/* v328: también los días */;var k=w.dataset.k;w.insertAdjacentHTML('beforebegin',html(k));w.remove();
  var n=$1('jobt');Object.keys(keep).forEach(function(id){var x=/^b\d+$/.test(id)?n.querySelector('[data-jbb="'+id.slice(1)+'"]'):/^d\d+$/.test(id)?n.querySelector('[data-jbd="'+id.slice(1)+'"]'):$1(id);if(!x)return;if(x.type==='checkbox')x.checked=keep[id];else if(x.tagName!=='SELECT'||[].some.call(x.options,function(o){return o.value===keep[id]||o.text===keep[id]}))x.value=keep[id]});
  try{var f=$1(b.dataset.jobl==='c'?'jb-ed':'jb-cg');if(!f){}}catch(x){}var nb=n.querySelector('[data-jobl="'+lvl+'"]');if(nb)nb.focus()}gen()});
new MutationObserver(function(){if($1('cm-t')&&$1('cm-op'))sync()}).observe(document.documentElement,{childList:true,subtree:true});
window.jobGen=gen;
/* v326: no se publica la oferta si dice «en persona» sin días u horario */
addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-act="cmxSave"]');if(!b)return;var m=window.jobPdErr&&jobPdErr();if(!m)return;e.preventDefault();e.stopImmediatePropagation();
 try{if(typeof cmStep==='function')cmStep(2)}catch(x){}var er=$1('err');if(er)er.textContent=m;try{toast(m)}catch(x){}var f=$1(/dirección/.test(m)?'jb-hpd':/días/.test(m)?'jb-hpd':'jb-hh1');if(f)f.scrollIntoView({block:'center'})},true);
})();
