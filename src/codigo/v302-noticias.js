
/* v302: Redactor de noticias:
   - «Mis noticias» en tabla con portada, estado (Publicada, Programada, Borrador) y acciones.
   - Borradores: se guardan en este celular (localStorage), no en Firestore; nadie más los ve.
   - Programar: la noticia se guarda con pub = fecha y hora; el público no la ve hasta esa hora (requiere reglas v38).
   - Vista previa: muestra la noticia como se verá, sin publicarla.
   Si algo falla, borra este <script> y su <style>: la página vuelve a publicar solo «ahora». */
(function(){
function E(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function $1(id){return document.getElementById(id)}
function pad(n){return String(n).padStart(2,'0')}
function loc(t){var d=new Date(t);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes())}
function fdt(t){return new Date(t).toLocaleString('es-CO',{day:'numeric',month:'long',hour:'numeric',minute:'2-digit'})}
/* ---------- programar ---------- */
window.nwSchedHTML=function(n){var p=n&&(Number(n.pub)||0)>Date.now()?Number(n.pub):0,isNew=!n||n._d,pub=!isNew&&!p;if(pub)return '';/* una noticia ya publicada no se vuelve a programar */
 var def=p||(Math.ceil((Date.now()+3600000)/900000)*900000);
 return '<div class="nwsc" id="nw-sc"><b>¿Cuándo se publica?</b><div class="nwscl" role="radiogroup"><label><input type="radio" name="nw-when" value="now"'+(p?'':' checked')+'> Publicar ahora</label><label><input type="radio" name="nw-when" value="at"'+(p?' checked':'')+'> Programar</label></div>'+
 '<div id="nw-atw"'+(p?'':' hidden')+'><label for="nw-at">Fecha y hora de publicación</label><input id="nw-at" type="datetime-local" value="'+loc(def)+'" min="'+loc(Date.now()+5*60000)+'"><p class="muted" style="margin:6px 0 0;font-size:13px">Hasta esa hora solo tú la ves (marcada «Programada»). A la hora elegida aparece sola para todos.</p></div></div>'};
window.nwSchedSync=function(){var at=document.querySelector('input[name="nw-when"]:checked'),w=$1('nw-atw'),go=$1('nw-go');if(!at)return;var on=at.value==='at';if(w)w.hidden=!on;if(go){go.textContent=on?'Programar':'Publicar'}};
window.nwSchedRead=function(){var at=document.querySelector('input[name="nw-when"]:checked');if(!at||at.value!=='at')return {on:false};var v=($1('nw-at')||{}).value||'',t=v?new Date(v).getTime():NaN;
 if(!t||isNaN(t))return {err:'Elige la fecha y la hora de publicación.'};if(t<Date.now()+2*60000)return {err:'La fecha y hora deben ser al menos 2 minutos después de ahora.'};if(t>Date.now()+180*864e5)return {err:'Se puede programar hasta 6 meses adelante.'};return {on:true,at:t}};
document.addEventListener('change',function(e){if(e.target&&e.target.name==='nw-when')nwSchedSync()});
/* ---------- borradores (en este celular) ---------- */
function dk(){var k='';try{k=QH.key()}catch(e){}return 'qh_nwdr_'+(k||'anon')}
function dAll(){try{return JSON.parse(localStorage.getItem(dk()))||[]}catch(e){return []}}
function dPut(l){try{localStorage.setItem(dk(),JSON.stringify(l));return true}catch(e){return false}}
window.nwDraftDel=function(id){dPut(dAll().filter(function(x){return x.id!==id}))};
function formObj(){var g=function(id){return (($1(id)||{}).value||'').trim()},l0=g('nw-v'),l='';if(l0){l=/^https?:\/\//i.test(l0)?l0:'https://'+l0}
 var img=(typeof nwf==='object'&&nwf.img)||'';if(l&&!img&&typeof ytId==='function'){var y=ytId(l);if(y)img=ytThumb(y)}
 var sc=nwSchedRead(),o={title:g('nw-t'),text:g('nw-x'),cat:g('nw-cat'),author:g('nw-a'),link:l,img:img,imgs:((typeof nwf==='object'&&nwf.imgs)||[]).slice(0,4),ts:Date.now()};if(sc.on){o.pub=sc.at;o.ts=sc.at}return o}
document.addEventListener('click',async function(e){var b=e.target.closest&&e.target.closest('[data-nwdraft],[data-nwprev],[data-nwpvx],[data-nwdedit],[data-nwddel]');if(!b)return;e.preventDefault();
 if(b.dataset.nwdraft){var o=formObj();if(!o.title&&!o.text){var er=$1('err');if(er)er.textContent='Escribe al menos el título o el texto para guardar el borrador.';return}
  o.id=(typeof nwf==='object'&&nwf.did)||('d'+Date.now().toString(36));o._d=1;o.sv=Date.now();var l=dAll().filter(function(x){return x.id!==o.id});l.unshift(o);
  if(!dPut(l.slice(0,20))){var er2=$1('err');if(er2)er2.textContent='No hay espacio en este celular para el borrador. Quita alguna foto e inténtalo de nuevo.';return}
  closeModal();toast('Borrador guardado en este celular');return}
 if(b.dataset.nwprev){var p=formObj();p.id='preview';p.ownerKey='';if(!p.title)p.title='(Sin título)';if(!p.text)p.text='(Sin texto)';
  var x=document.createElement('div');x.className='nwpv';x.setAttribute('role','dialog');x.setAttribute('aria-modal','true');x.setAttribute('aria-label','Vista previa de la noticia');
  x.innerHTML='<div class="nwpvb"><div class="nwpvh"><span>VISTA PREVIA'+(p.pub?' · se publicará el '+E(fdt(p.pub)):'')+'</span><button type="button" class="btn pink" data-nwpvx="1">Volver a editar</button></div>'+newsCard(p,true)+'</div>';
  document.body.appendChild(x);x.querySelectorAll('.cmown,.nwfb,.nwprog,[data-act="nwShare"]').forEach(function(z){z.remove()});var bx=x.querySelector('[data-nwpvx]');if(bx)bx.focus();return}
 if(b.dataset.nwpvx){var v=b.closest('.nwpv');if(v)v.remove();return}
 if(b.dataset.nwdedit){var d=dAll().find(function(x){return x.id===b.dataset.nwdedit});if(d){if(document.querySelector('#ov'))closeModal(1);nwForm(d)}return}
 if(b.dataset.nwddel){if(await askC('¿Eliminar este borrador?','Eliminar')){nwDraftDel(b.dataset.nwddel);var t=document.querySelector('#ov .nwmt');if(t)t.outerHTML=nwTableHTML(QH.NEWS.filter(function(x){return x.ownerKey===QH.key()}));else if(typeof render==='function')render(true);toast('Borrador eliminado')}return}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var v=document.querySelector('.nwpv');if(v){v.remove();e.stopPropagation()}}},true);
/* ---------- Mis noticias en tabla ---------- */
function thumb(n){var u=n.img||(n.imgs||[])[0]||'';return u?'<img class="nwth" src="'+E(u)+'" alt="" loading="lazy">':'<span class="nwth ph">Sin portada</span>'}
window.nwTableHTML=function(l){var now=Date.now(),dr=dAll(),acc='';try{acc=new Date(accEnd('news')).toLocaleDateString('es-CO')}catch(e){}
 var rows=dr.map(function(d){return '<tr><td>'+thumb(d)+'</td><td><b>'+E(d.title||'(Sin título)')+'</b><span class="msts dra">Borrador · en este celular</span><small>Guardado el '+E(fdt(d.sv||d.ts))+'</small></td><td><div class="msta"><button type="button" class="btn" data-nwdedit="'+E(d.id)+'">Continuar</button><button type="button" class="btn ghost mstd" data-nwddel="'+E(d.id)+'">Eliminar</button></div></td></tr>'}).concat(
  l.map(function(n){var p=(Number(n.pub)||0)>now;return '<tr><td>'+thumb(n)+'</td><td><b>'+E(n.title)+'</b>'+(p?'<span class="msts prog">Programada · '+E(fdt(n.pub))+'</span>':'<span class="msts ok">Publicada</span><small>'+E(typeof nwDate==='function'?nwDate(n):'')+'</small>')+'</td><td><div class="msta">'+
   (p?'':'<a class="btn ghost" href="'+E(newsUrl(n.id))+'" target="_blank" rel="noopener">Ver</a><button type="button" class="btn ghost" data-act="nwShare" data-id="'+E(n.id)+'">Compartir</button>')+
   '<button type="button" class="btn" data-act="nwEdit" data-id="'+E(n.id)+'">Editar</button><button type="button" class="btn ghost mstd" data-act="nwDel" data-id="'+E(n.id)+'">Eliminar</button></div></td></tr>'}));
 return '<div class="cg nwmt"><h3>Mis noticias ('+l.length+(dr.length?' · '+dr.length+(dr.length===1?' borrador':' borradores'):'')+')</h3>'+(acc?'<p class="muted">Tu acceso de Noticias está activo hasta el '+E(acc)+'.</p>':'')+
  '<button type="button" class="btn pink msnew" data-act="nwNew">+ Nueva noticia</button>'+
  (rows.length?'<div class="mstw"><table class="mst"><thead><tr><th scope="col">Portada</th><th scope="col">Noticia</th><th scope="col">Acciones</th></tr></thead><tbody>'+rows.join('')+'</tbody></table></div><p class="muted mstx">Los borradores se guardan solo en este celular.</p>':'<p class="muted">Aún no has publicado noticias.</p>')+'</div>'};
})();
