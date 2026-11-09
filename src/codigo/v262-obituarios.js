
/* v262: OBITUARIOS. En Clasificados, botón «Publicar obituario». Formulario: plantilla (clara con velas / oscura con lazo),
   foto, nombre, fecha de nacimiento (opcional), fecha de fallecimiento, palabras y exequias (opcional). La página dibuja la imagen
   (1080×1920, sirve para el estado de WhatsApp), la sube como foto del anuncio y lo publica en «Comunidad y otros → Obituarios».
   Duración según el plan de la persona (Comunidad 30 días, plan de Clasificados o gratis 24 horas).
   Si algo falla, borra este <script id="v262-obituarios"> y su <style>. */
(function(){
var SV=function(d){return '<svg class="qi" viewBox="0 0 24 24" aria-hidden="true">'+d+'</svg>'};
var RIB=SV('<path d="M12 11.22C11 9.997 10 9 10 8a2 2 0 0 1 4 0c0 1-.998 2.002-2.01 3.22"/><path d="m12 18 2.57-3.5"/><path d="M6.243 9.016a7 7 0 0 1 11.507-.009"/><path d="M9.35 14.53 12 11.22"/><path d="M9.35 14.53C7.728 12.246 6 10.221 6 7a6 5 0 0 1 12 0c-.005 3.22-1.778 5.235-3.43 7.5l3.557 4.527a1 1 0 0 1-.203 1.43l-1.894 1.36a1 1 0 0 1-1.384-.215L12 18l-2.679 3.593a1 1 0 0 1-1.39.213l-1.865-1.353a1 1 0 0 1-.203-1.422z"/>');
var SUG=['Su recuerdo y enseñanza se quedarán por siempre en nuestros corazones. Que su alma encuentre paz y consuelo en compañía del Señor.','¡Oremos al Padre Celestial para que consuele a familiares y amigos!','Partiste de nuestro lado, pero nunca de nuestro corazón. Descansa en paz.','Gracias por tu amor, tu ejemplo y tu alegría. Siempre te recordaremos.'];
var O=null,PH=null,W=1080,H=1920;
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fonts(){if(document.getElementById('obi-fonts'))return;var l=document.createElement('link');l.id='obi-fonts';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,600;1,400;1,600;1,700&display=swap';document.head.appendChild(l)}
function fready(){try{return Promise.all(['italic 700 60px "Playfair Display"','italic 400 40px "Playfair Display"','60px "Great Vibes"'].map(function(f){return document.fonts.load(f)})).catch(function(){})}catch(e){return Promise.resolve()}}
function dmy(v){if(!v)return '';if(/^\d{4}$/.test(v))return v/* v266: solo el año */;var p=v.split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:v}
function exTxt(o){if(!o.exd&&!o.exh&&!o.exl)return null;var a='';if(o.exd){var d=new Date(o.exd+'T12:00:00');a=d.toLocaleDateString('es-CO',{month:'long',day:'numeric'});a=a.charAt(0).toUpperCase()+a.slice(1)}
 if(o.exh){var t=o.exh.split(':'),h=+t[0],m=t[1],ap=h>=12?'P.M.':'A.M.';h=h%12||12;a+=(a?' - ':'')+h+':'+m+' '+ap}return {a:a,b:o.exl||''}}
/* ---------- dibujo ---------- */
function noise(c,base,alpha,n){c.save();for(var i=0;i<n;i++){c.fillStyle='rgba('+base+','+(Math.random()*alpha)+')';c.fillRect(Math.random()*W,Math.random()*H,1+Math.random()*2.5,1+Math.random()*2.5)}c.restore()}
function wrap(c,t,maxW){var w=String(t||'').split(/\s+/),L=[],cur='';w.forEach(function(x){var tr=cur?cur+' '+x:x;if(c.measureText(tr).width>maxW&&cur){L.push(cur);cur=x}else cur=tr});if(cur)L.push(cur);return L}
function fit(c,font,size,t,maxW,maxLines,minSize){var s=size;for(;s>=minSize;s-=4){c.font=font.replace('#',s);var L=wrap(c,t,maxW);if(L.length<=maxLines)return {L:L,s:s}}c.font=font.replace('#',minSize);return {L:wrap(c,t,maxW).slice(0,maxLines),s:minSize}}
function cover(c,img,x,y,w,h){var r=Math.max(w/img.width,h/img.height),iw=img.width*r,ih=img.height*r;c.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih)}
function ribbon(c,x,y,s,col,lw){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle=col;c.lineWidth=lw;c.lineCap='butt';c.lineJoin='round';
 c.beginPath();c.moveTo(-60,170);c.bezierCurveTo(-10,90,40,30,40,-30);c.bezierCurveTo(40,-95,-40,-95,-40,-30);c.bezierCurveTo(-40,30,10,90,60,170);c.stroke();c.restore()}
function sprig(c,x,y,len,ang,col){c.save();c.translate(x,y);c.rotate(ang);c.strokeStyle=col;c.fillStyle=col;c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(len*.2,-len*.5,0,-len);c.stroke();
 for(var i=1;i<9;i++){var t=i/9,py=-len*t,px=Math.sin(t*3)*len*.06,sd=i%2?1:-1;c.beginPath();c.moveTo(px,py);c.lineTo(px+sd*28,py-14);c.stroke();c.beginPath();c.arc(px+sd*34,py-18,10+Math.random()*5,0,7);c.globalAlpha=.55;c.fill();c.globalAlpha=1}c.restore()}
function candle(c,x,y,w,h){var g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#e9dcc0');g.addColorStop(.5,'#fbf3e1');g.addColorStop(1,'#d9c7a3');c.fillStyle=g;c.beginPath();c.moveTo(x,y+12);c.quadraticCurveTo(x+w/2,y-10,x+w,y+12);c.lineTo(x+w,y+h);c.lineTo(x,y+h);c.closePath();c.fill();
 c.strokeStyle='#3a2a1a';c.lineWidth=4;c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y-26);c.stroke();
 var fx=x+w/2,fy=y-70,gl=c.createRadialGradient(fx,fy+20,4,fx,fy+20,110);gl.addColorStop(0,'rgba(255,214,120,.55)');gl.addColorStop(1,'rgba(255,214,120,0)');c.fillStyle=gl;c.fillRect(fx-120,fy-100,240,240);
 var fg=c.createLinearGradient(fx,fy-50,fx,fy+44);fg.addColorStop(0,'#fff6c8');fg.addColorStop(.5,'#ffb300');fg.addColorStop(1,'#e8590c');c.fillStyle=fg;c.beginPath();c.moveTo(fx,fy-58);c.bezierCurveTo(fx+30,fy-10,fx+26,fy+38,fx,fy+44);c.bezierCurveTo(fx-26,fy+38,fx-30,fy-10,fx,fy-58);c.fill()}
function drawLight(c,o){c.fillStyle='#f3efe7';c.fillRect(0,0,W,H);noise(c,'120,100,70',.12,9000);
 sprig(c,40,1250,560,-.12,'#9b978f');sprig(c,10,820,420,.18,'#a7a39b');sprig(c,90,560,300,-.05,'#b3afa7');
 ribbon(c,250,260,1.15,'#262626',46);
 c.fillStyle='#161616';var nm=(o.nm||'Nombre').trim(),pp=nm.split(/\s+/),l1=pp.length>1?pp.slice(0,Math.ceil(pp.length/2)).join(' '):nm,l2=pp.length>1?pp.slice(Math.ceil(pp.length/2)).join(' '):'';
 c.textBaseline='alphabetic';var f=fit(c,'italic 700 #px "Playfair Display", Georgia, serif',150,l1+(l2?' '+l2:''),620,1,70),s=f.s;if(l2){s=Math.min(150,s+30);c.font='italic 700 '+s+'px "Playfair Display", Georgia, serif';while((c.measureText(l1).width>640||c.measureText(l2).width>640)&&s>60){s-=6;c.font='italic 700 '+s+'px "Playfair Display", Georgia, serif'}c.fillText(l1,380,230);c.fillText(l2,380,230+s*.95)}else{c.fillText(l1,380,260)}
 var dy=l2?230+s*.95+80:330;c.font='46px "Playfair Display", Georgia, serif';c.fillText(o.bn?dmy(o.bn)+' - '+dmy(o.dd):'† '+dmy(o.dd),390,dy);
 c.save();c.translate(560,860);c.rotate(-.04);c.shadowColor='rgba(0,0,0,.25)';c.shadowBlur=30;c.shadowOffsetY=12;c.fillStyle='#fff';c.fillRect(-300,-330,600,660);c.shadowColor='transparent';c.fillStyle='#ccc';c.fillRect(-270,-300,540,600);
 if(PH){c.save();c.beginPath();c.rect(-270,-300,540,600);c.clip();c.filter='grayscale(1) contrast(1.05)';cover(c,PH,-270,-300,540,600);c.restore()}c.restore();
 c.fillStyle='#1d1d1d';var m=fit(c,'italic 400 #px "Playfair Display", Georgia, serif',54,o.msg||'',740,5,36);var y=1290;m.L.forEach(function(L){c.fillText(L,90,y);y+=m.s*1.22});
 var ex=exTxt(o);if(ex){y+=36;c.font='italic 700 60px "Playfair Display", Georgia, serif';c.fillText('Exequias',90,y);y+=70;c.font='italic 400 46px "Playfair Display", Georgia, serif';if(ex.a){c.fillText(ex.a,90,y);y+=60}if(ex.b){wrap(c,ex.b,600).slice(0,2).forEach(function(L){c.fillText(L,90,y);y+=58})}}
 candle(c,880,1450,170,470);candle(c,720,1720,130,220)}
function drawDark(c,o){var g=c.createRadialGradient(W/2,H*.35,80,W/2,H*.5,H*.75);g.addColorStop(0,'#3d3d3d');g.addColorStop(1,'#0f0f0f');c.fillStyle=g;c.fillRect(0,0,W,H);noise(c,'255,255,255',.06,14000);
 c.save();c.globalAlpha=.18;ribbon(c,140,1150,4.2,'#9a9a9a',60);c.restore();
 c.fillStyle='#fff';c.textAlign='center';c.font='700 128px "Inter", "Helvetica Neue", Arial, sans-serif';c.fillText('Descanse en',W/2,250);c.fillText('paz',W/2,385);
 var px=W/2-230,py=470,pw=460,ph=700,r=230;c.save();c.beginPath();c.moveTo(px+r,py);c.arcTo(px+pw,py,px+pw,py+ph,r);c.arcTo(px+pw,py+ph,px,py+ph,r);c.arcTo(px,py+ph,px,py,r);c.arcTo(px,py,px+pw,py,r);c.closePath();
 c.fillStyle='#777';c.fill();if(PH){c.save();c.clip();c.filter='grayscale(1) contrast(1.05)';cover(c,PH,px,py,pw,ph);c.restore()}c.lineWidth=18;c.strokeStyle='#fff';c.stroke();c.restore();
 c.fillStyle='#fff';c.font='300 54px "Inter", "Helvetica Neue", Arial, sans-serif';c.fillText('Con profundo pesar',W/2,1290);c.fillText('comunicamos el fallecimiento de',W/2,1358);
 var f=fit(c,'#px "Great Vibes", "Brush Script MT", cursive',130,o.nm||'Nombre',940,1,70);c.fillText(f.L[0]||'',W/2,1500);
 /* de abajo hacia arriba: fecha al final, exequias encima y el mensaje se ajusta al espacio que queda */
 var dY=1858,ex=exTxt(o),ef=ex?fit(c,'600 #px "Inter", Arial, sans-serif',40,'Exequias: '+[ex.a,ex.b].filter(Boolean).join(' · '),940,2,28):null,exH=ef?ef.L.length*ef.s*1.25:0,exTop=dY-62-exH,avail=exTop-1560,m=null;
 for(var sz=56;sz>=30;sz-=2){c.font='700 '+sz+'px "Inter", "Helvetica Neue", Arial, sans-serif';var L=wrap(c,o.msg||'',900);if(L.length*sz*1.2<=avail||sz===30){m={L:L.slice(0,Math.max(1,Math.floor(avail/(sz*1.2)))),s:sz};break}}
 var y=1600;m.L.forEach(function(L){c.fillText(L,W/2,y);y+=m.s*1.2});
 if(ef){c.font='600 '+ef.s+'px "Inter", Arial, sans-serif';var yy=exTop+ef.s;ef.L.forEach(function(L){c.fillText(L,W/2,yy);yy+=ef.s*1.25})}
 c.font='400 50px "Inter", Arial, sans-serif';c.fillText('†  '+(o.bn?dmy(o.bn)+' - ':'')+dmy(o.dd),W/2,dY);c.textAlign='left'}
function draw(cv,o){var c=cv.getContext('2d');c.clearRect(0,0,W,H);c.save();(o.tp==='dark'?drawDark:drawLight)(c,o);c.restore()}
/* ---------- formulario ---------- */
function vals(){var g=function(id){var e=document.getElementById(id);return e?e.value.trim():''};return {tp:O.tp,nm:g('ob-nm').slice(0,60),bn:dval('bn'),dd:dval('dd'),msg:g('ob-msg').slice(0,260),exd:g('ob-exd'),exh:g('ob-exh'),exl:g('ob-exl').slice(0,80),by:g('ob-by').slice(0,30),wa:g('ob-wa').replace(/\D/g,'')}}
var pend=0;function prev(){if(pend)return;pend=1;requestAnimationFrame(function(){pend=0;var cv=document.getElementById('ob-cv');if(cv&&O){O=Object.assign(O,vals());draw(cv,O)}})}
/* v266: cada fecha puede ser completa o solo el año */
function dfield(k,lab,today,val){var y=new Date().getFullYear();return '<div><label for="ob-'+k+'">'+lab+'</label><div class="obi-dm" role="group" aria-label="Formato de la fecha"><button type="button" data-obdm="'+k+':d" aria-pressed="true">Fecha</button><button type="button" data-obdm="'+k+':y" aria-pressed="false">Solo el año</button></div><input id="ob-'+k+'" type="date" max="'+today+'" value="'+val+'"><input id="ob-'+k+'y" type="number" inputmode="numeric" min="1900" max="'+y+'" placeholder="Ej: '+(k==='bn'?'1950':y)+'" hidden aria-label="Año de '+(k==='bn'?'nacimiento':'fallecimiento')+'"></div>'}
function dval(k){var y=O&&O.dm&&O.dm[k]==='y';var e=document.getElementById('ob-'+k+(y?'y':''));var v=e?e.value.trim():'';return y?(/^\d{4}$/.test(v)?v:''):v}
function dmode(k,m,v){O.dm=O.dm||{};O.dm[k]=m;document.querySelectorAll('[data-obdm^="'+k+':"]').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.obdm===k+':'+m)});var a=document.getElementById('ob-'+k),b=document.getElementById('ob-'+k+'y');if(a)a.hidden=m==='y';if(b)b.hidden=m!=='y';if(v!=null){if(m==='y'&&b)b.value=v;else if(a)a.value=v}}
function form(){fonts();O={tp:'light',dm:{bn:'d',dd:'d'}};PH=null;var u=(typeof S!=='undefined'&&S.user)||{},today=new Date().toLocaleDateString('en-CA');
 modal('<h2>Publicar obituario</h2><p class="muted">Llena los datos y mira cómo queda. La imagen también sirve para compartir por WhatsApp. <b>'+E(durTxt())+'</b></p>'+
  '<label>Plantilla</label><div class="obi-tpl" role="group" aria-label="Plantilla"><button type="button" class="t1" data-obtp="light" aria-pressed="true"><i aria-hidden="true"></i>Clara (velas)</button><button type="button" class="t2" data-obtp="dark" aria-pressed="false"><i aria-hidden="true"></i>Oscura (lazo)</button></div>'+
  '<div class="obi-prev"><canvas id="ob-cv" width="'+W+'" height="'+H+'" aria-label="Vista previa del obituario"></canvas></div>'+
  '<label for="ob-ph">Foto de la persona</label><input id="ob-ph" type="file" accept="image/*">'+
  '<label for="ob-nm">Nombre completo</label><input id="ob-nm" type="text" maxlength="60" placeholder="Ej: Fulano de Tal">'+
  '<div class="obi-row">'+dfield('bn','Nacimiento (opcional)',today,'')+dfield('dd','Fallecimiento',today,today)+'</div>'+
  '<label for="ob-msg">Palabras para la persona</label><textarea id="ob-msg" rows="3" maxlength="260" placeholder="Escribe unas palabras o elige una de abajo"></textarea><div class="obi-sug">'+SUG.map(function(t,i){return '<button type="button" data-obsug="'+i+'">'+E(t.length>48?t.slice(0,46)+'…':t)+'</button>'}).join('')+'</div>'+
  '<details class="obi-ex"><summary><span><b>Agregar datos de las exequias</b><small>Opcional · toca aquí para poner fecha, hora y lugar</small></span><i aria-hidden="true"></i></summary><div class="obi-row"><div><label for="ob-exd">Fecha</label><input id="ob-exd" type="date"></div><div><label for="ob-exh">Hora</label><input id="ob-exh" type="time"></div></div><label for="ob-exl">Lugar</label><input id="ob-exl" type="text" maxlength="80" placeholder="Ej: Parroquia San Antonio, Calle 6 # 8-20"></details>'+
  '<div class="obi-row"><div><label for="ob-by">Publicado por</label><input id="ob-by" type="text" maxlength="30" value="'+E(u.name||'')+'" placeholder="Tu nombre o la familia"></div><div><label for="ob-wa">WhatsApp (opcional)</label><input id="ob-wa" type="tel" inputmode="numeric" maxlength="14" value="'+E(u.wa||'')+'" placeholder="3001234567"></div></div>'+
  '<p class="err" id="ob-err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-obpub="1">Publicar obituario</button><button type="button" class="btn ghost" data-obdl="1">Descargar imagen</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>');
 fready().then(prev);prev()}
function check(o){if(!PH)return 'Sube la foto de la persona.';if(o.nm.length<3)return 'Escribe el nombre completo.';var yN=new Date().getFullYear(),yr=function(v){return +String(v).slice(0,4)};
 if(O.dm&&O.dm.bn==='y'&&document.getElementById('ob-bny').value.trim()&&!o.bn)return 'Escribe el año de nacimiento con 4 números (ej: 1950).';
 if(!o.dd)return O.dm&&O.dm.dd==='y'?'Escribe el año de fallecimiento con 4 números (ej: '+yN+').':'Escribe la fecha de fallecimiento.';
 if(yr(o.dd)<1900||yr(o.dd)>yN||(o.bn&&(yr(o.bn)<1850||yr(o.bn)>yN)))return 'Revisa los años: deben estar entre 1900 y '+yN+'.';
 if(o.bn&&((o.bn.length===4||o.dd.length===4)?yr(o.bn)>yr(o.dd):o.bn>o.dd))return 'El nacimiento debe ser antes del fallecimiento.';if(o.msg.length<5)return 'Escribe unas palabras para la persona.';if(o.wa&&o.wa.length!==10)return 'El WhatsApp debe tener 10 dígitos.';return ''}
function big(o){var cv=document.createElement('canvas');cv.width=W;cv.height=H;draw(cv,o);return cv.toDataURL('image/jpeg',.82)}
/* v265: cupo propio del obituario (pl 'obi'): 3 días gratis, 1 al día por persona, sin gastar el anuncio gratis del día */
function obiToday(){try{var n=Date.now();return comMine().some(function(a){return a.pl==='obi'&&n-(a.ts||0)<864e5})}catch(e){return false}}
function plan(){try{if(accOn('comu'))return 'comu';var t=comTiers().filter(function(u){return COM_DAYS[u]-comUsed(u)>0});if(t.length)return t[0];if(!obiToday())return 'obi';return comFreeWait()?'':'free'}catch(e){return 'obi'}}
function durTxt(){var pl=(typeof S!=='undefined'&&S.user)?plan():'obi';return pl==='comu'?'Con tu rol Comunidad dura 30 días.':pl==='obi'?'Es gratis y dura 3 días.':pl==='free'?'Ya publicaste un obituario hoy: este usará tu anuncio gratis del día y dura 24 horas.':pl?'Con tu plan dura '+COM_DAYS[pl]+' días.':'Hoy ya publicaste un obituario y usaste tu anuncio gratis: podrás publicar mañana.'}
async function publish(b){var o=vals(),er=document.getElementById('ob-err'),m=check(o);if(m){er.textContent=m;return}
 if(!S.user){CMO=o;return need(function(){form2()})}
 var pl=plan();if(!pl){er.textContent='Hoy ya publicaste un obituario y usaste tu anuncio gratis. Puedes publicarlo mañana o activar un plan de Clasificados o el rol Comunidad.';return}
 b.disabled=true;er.textContent='Preparando la imagen…';await fready();var img=big(o);try{if(typeof r2up==='function')img=await r2up(img)}catch(e){}
 if(String(img).length>790000){b.disabled=false;er.textContent='La imagen quedó muy pesada. Prueba con otra foto.';return}
 var ex=exTxt(o),now=Date.now(),DAYMS=86400000,days=pl==='free'?1:pl==='obi'?3:pl==='comu'?30:COM_DAYS[pl],
  tx=(o.msg+(o.bn?'\n'+dmy(o.bn)+' - '+dmy(o.dd):(o.dd.length===4?'\nFalleció en ':'\nFalleció el ')+dmy(o.dd))+(ex?'\nExequias: '+[ex.a,ex.b].filter(Boolean).join(', '):'')).slice(0,500),
  a={id:'c'+now.toString(36)+Math.random().toString(36).slice(2,6),ownerKey:QH.key(),owner:(o.by||S.user.name||'Familia').slice(0,30),title:('Obituario: '+o.nm).slice(0,80),text:tx,img:img,wa:o.wa,link:'',pl:pl,ts:now,exp:now+days*DAYMS,op:'',cat:'com',sub:'Obituarios',price:0,zone:'Pradera',cond:'',imgs:[]};
 er.textContent='Publicando…';try{await QH.comPut(a);closeModal(1);view='com';render();scrollTo(0,0);toast('Obituario publicado')}catch(e){b.disabled=false;er.textContent=(e&&e.m)||(e&&e.code==='permission-denied'?'No se pudo publicar. Revisa que tu cuenta esté verificada.':'No se pudo publicar. Revisa tu internet.')}}
var CMO=null;function form2(){/* vuelve al formulario tras entrar (la foto se vuelve a pedir) */form();if(CMO){var o=CMO;CMO=null;setTimeout(function(){['nm','msg','exd','exh','exl','by','wa'].forEach(function(k){var e=document.getElementById('ob-'+k);if(e&&o[k])e.value=o[k]});['bn','dd'].forEach(function(k){if(o[k])dmode(k,o[k].length===4?'y':'d',o[k])});O.tp=o.tp;document.querySelectorAll('[data-obtp]').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.obtp===o.tp)});document.getElementById('ob-err').textContent='Ya entraste. Vuelve a subir la foto y toca «Publicar obituario».';prev()},50)}}
/* ---------- eventos ---------- */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-obi],[data-obtp],[data-obsug],[data-obpub],[data-obdl],[data-obdm]');if(!b)return;e.preventDefault();e.stopPropagation();var d=b.dataset;
 if(d.obi){if(typeof MODE!=='undefined'&&MODE==='index'){location.href=PANEL_URL+'#/obituario';return}closeModal(1);return form()}
 if(d.obtp){O.tp=d.obtp;document.querySelectorAll('[data-obtp]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});return prev()}
 if(d.obdm){var kk=d.obdm.split(':');dmode(kk[0],kk[1]);var f=document.getElementById('ob-'+kk[0]+(kk[1]==='y'?'y':''));if(f)f.focus();return prev()}
 if(d.obsug!=null){var t=document.getElementById('ob-msg');t.value=SUG[+d.obsug];return prev()}
 if(d.obdl){var o=vals();if(!PH){document.getElementById('ob-err').textContent='Sube la foto para descargar la imagen.';return}fready().then(function(){var a=document.createElement('a');a.href=big(o);a.download='obituario-'+(o.nm||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-')+'.jpg';document.body.appendChild(a);a.click();a.remove()});return}
 if(d.obpub)return publish(b)},true);
document.addEventListener('input',function(e){if(e.target.id&&e.target.id.slice(0,3)==='ob-'&&e.target.id!=='ob-ph')prev()});
document.addEventListener('change',function(e){if(e.target.id!=='ob-ph')return;var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(){var i=new Image();i.onload=function(){PH=i;prev()};i.src=r.result};r.readAsDataURL(f)});
/* botón en Clasificados (junto a «+ Nuevo anuncio») y tarjeta vertical para los obituarios */
function paint(){var l=document.querySelectorAll('[data-act="pubAsk"][data-v="com"]');for(var i=0;i<l.length;i++){var b=l[i];if(b.closest('.modal')||b.nextElementSibling&&b.nextElementSibling.hasAttribute&&b.nextElementSibling.hasAttribute('data-obi'))continue;b.insertAdjacentHTML('afterend','<button type="button" class="btn ghost obi-b" data-obi="1">'+RIB+'Publicar obituario</button>')}
 try{var A=document.querySelectorAll('article[data-cid]:not(.cm-obi-ok)');for(var j=0;j<A.length;j++){var x=A[j];x.classList.add('cm-obi-ok');var ad=(QH.COM||[]).find(function(z){return z.id===x.dataset.cid});if(ad&&ad.sub==='Obituarios')x.classList.add('cm-obi')}}catch(e){}}
var pt=0;new MutationObserver(function(){if(!pt){pt=1;requestAnimationFrame(function(){pt=0;paint()})}}).observe(document.documentElement,{childList:true,subtree:true});
/* entrada directa desde la portada: ?panel#/obituario */
try{if(location.hash==='#/obituario')setTimeout(function(){if(typeof MODE!=='undefined'&&MODE!=='admin'){view='com';render();form()}},2500)}catch(e){}
window.obiForm=form;
})();
