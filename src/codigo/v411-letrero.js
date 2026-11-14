/* v411: LETRERO de la tienda (reemplaza la pausa de v310, que ya no existe). El dueño pone a mano «Abierto» o «Cerrado»
   desde su tienda (botón «Cambiar letrero»). El letrero de cerrado manda sobre el horario, lleva una nota opcional
   (una de la lista, otra escrita por el dueño o ninguna) y se queda puesto hasta que el dueño lo cambie.
   Los clientes ven el letrero arriba de la tienda; con «Abierto» la tienda sigue su horario normal.
   Campos de la tienda: shut = 1 si el letrero dice cerrado, shutN = la nota (máx. 80 letras). El «Cerrado ahora» de las
   tarjetas sale de openBadge (09-rateform.js). Si algo falla, borra este bloque y su CSS (v411-letrero-css.css). */
(function(){
var NOTAS=['Mañana volvemos al horario habitual','Hoy no hay atención','Abrimos en la tarde'];
var st=function(id){return S.stores.find(function(x){return x.id===id})};
var mineOf=function(s){try{return !!s&&shopsMine().some(function(x){return x.id===s.id})}catch(e){return false}};
var shut=function(s){return !!s&&!!s.shut};window.ltrShut=shut;
function sign(on,cls){var c=on?'#0e9f4b':'#d92027';
 return '<svg class="ltrs'+(cls?' '+cls:'')+'" viewBox="0 0 120 72" role="img" aria-label="Letrero: '+(on?'abierto':'cerrado')+'"><g fill="none" stroke="'+c+'" stroke-width="3" stroke-linecap="round"><circle cx="60" cy="7" r="4.5"/><path d="M57 10.5 20 37M63 10.5 100 37"/></g><rect x="2" y="36" width="116" height="34" fill="'+c+'"/><text x="60" y="59.5" text-anchor="middle" font-size="18" font-weight="800" letter-spacing="1" fill="#fff" font-family="inherit">'+(on?'ABIERTO':'CERRADO')+'</text></svg>'}
/* cerrado por horario (sin letrero): lo que ya dice la insignia del horario */
function porHorario(s){try{return /cerrado/i.test(String(openBadge(s)).replace(/<[^>]*>/g,''))}catch(e){return false}}
function banner(s,mine){var c=shut(s),h=!c&&porHorario(s),on=!c&&!h,n=c?String(s.shutN||'').trim():'';
 var t=c?'<b>La tienda está cerrada en este momento</b>'+(n?'<p>'+esc(n)+'</p>':''):h?'<b>Cerrado</b><p>Según el horario de la tienda.</p>':'<b>Abierto</b>';
 var o=mine?'<p class="ltrm">'+(c?'Tus clientes ven este letrero aunque tu horario diga abierto. Se queda puesto hasta que lo cambies.':'Así ven tu tienda tus clientes. Si vas a cerrar un rato, pon el letrero de cerrado.')+'</p><div class="row"><button type="button" class="btn '+(c?'pink':'ghost')+'" data-ltr="menu">Cambiar letrero</button></div>':'';
 return '<div class="ltr '+(on?'on':'off')+'" role="status">'+sign(on)+'<div>'+t+o+'</div></div>'}
function wrap(){if(window.__ltrW||typeof storeView0!=='function')return;window.__ltrW=1;
 window.storeViewExt=function(){var h=storeView0(),s=view==='store'?st(cur):null;if(!s)return h;var bn=banner(s,mineOf(s)),i=h.indexOf('<div class="icard">');
  return i>0?h.slice(0,i)+bn+h.slice(i):bn+h}}
document.addEventListener('DOMContentLoaded',wrap);setTimeout(wrap,0);
/* ---- el dueño cambia el letrero ---- */
var M={c:0,k:'none'};
function menuBody(){var ch=function(k,t){return '<button type="button" class="chip" data-ltr="nota" data-k="'+k+'" aria-pressed="'+(M.k===String(k))+'">'+t+'</button>'};
 return '<div class="ltr2" role="group" aria-label="Elige el letrero"><button type="button" data-ltr="pick" data-v="0" aria-pressed="'+(!M.c)+'">'+sign(1)+'</button><button type="button" data-ltr="pick" data-v="1" aria-pressed="'+(!!M.c)+'">'+sign(0)+'</button></div>'+
  (M.c?'<div class="ltrn" role="group" aria-label="Nota para tus clientes"><b>Nota para tus clientes (opcional)</b><div class="ltrc">'+NOTAS.map(function(t,i){return ch(i,esc(t))}).join('')+ch('otro','Otra nota')+ch('none','Sin nota')+'</div>'+
   (M.k==='otro'?'<label for="ltr-o">Escribe tu nota</label><input id="ltr-o" type="text" maxlength="80" value="'+esc(M.o||'')+'" placeholder="Ej: Volvemos a las 3 de la tarde">':'')+'</div>'
  :'<p class="muted">Con el letrero de abierto, tu tienda sigue el horario que tienes guardado.</p>')}
function menu(id){var s=st(id);if(!s)return;var n=String(s.shutN||'').trim(),i=NOTAS.indexOf(n);M={c:shut(s)?1:0,k:!n?'none':i>=0?String(i):'otro',o:i<0?n:''};
 modal('<h2>Letrero de tu tienda</h2><p>Tus clientes lo ven al entrar a <b>'+esc(s.name)+'</b>. El letrero de cerrado manda sobre tu horario y se queda puesto hasta que lo cambies.</p><div id="ltr-b">'+menuBody()+'</div><div class="row" style="margin-top:12px"><button type="button" class="btn pink" data-ltr="ok">Guardar letrero</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>')}
function keep(){var i=document.getElementById('ltr-o');if(i)M.o=i.value}
function redraw(f){var b=document.getElementById('ltr-b');if(!b)return;b.innerHTML=menuBody();if(f){var i=document.getElementById('ltr-o');if(i)i.focus()}}
addEventListener('click',function(e){var q=e.target.closest&&e.target.closest('[data-ltr]');if(!q)return;e.preventDefault();e.stopImmediatePropagation();var a=q.dataset.ltr,s=st(cur);
 if(a==='menu'){if(s&&mineOf(s))menu(s.id);return}
 if(a==='pick'){keep();M.c=+q.dataset.v;return redraw()}
 if(a==='nota'){keep();M.k=q.dataset.k;return redraw(M.k==='otro')}
 if(a==='ok'){keep();if(!s||!mineOf(s))return closeModal(1);
  var n=!M.c||M.k==='none'?'':M.k==='otro'?String(M.o||'').replace(/\s+/g,' ').trim().slice(0,80):NOTAS[+M.k]||'';
  s.shut=M.c?1:0;s.shutN=n;if(s.pause){s.pause=0;s.pauseA=0}/* limpia la pausa vieja (v310) */
  save();closeModal(1);if(view==='store')render(true);toast(M.c?'Tu tienda muestra el letrero de cerrado':'Tu tienda muestra el letrero de abierto')}},true);
/* si el horario abre o cierra mientras alguien mira la tienda, el letrero se actualiza solo */
var last='';setInterval(function(){if(view!=='store'||document.getElementById('ov'))return;var s=st(cur),k=s?String(shut(s))+porHorario(s):'';if(k!==last){if(last!=='')render(true);last=k}},30000);
})();
