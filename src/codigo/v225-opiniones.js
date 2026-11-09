
/* v225: en cada clasificado: "¿Te sirvió este anuncio?" (Sí / No) y comentarios.
   Se guarda en la coleccion "cmFb": un documento por persona y anuncio (id = <anuncio>_<uid>) con util (true/false), txt y name.
   Votar y comentar pide sesion real. El dueño del anuncio ve todo, pero no puede votar ni comentar (la pagina no le muestra
   los botones y las reglas de Firestore v23 lo impiden). Solo el autor o el administrador borran un comentario.
   Si las reglas aun no tienen "cmFb", la seccion no aparece. Si algo falla, borra este <script id="v225-opiniones">,
   el <style id="v225-opiniones-css"> y el <div class="cmfb"> de la tarjeta del clasificado. */
(function(){
var FB=null,open={},busy=false,LOC={};
var IC={up:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>',
 down:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>',
 msg:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>'};
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function me(){try{var u=QH.authCur&&QH.authCur();return u&&!u.isAnonymous?u:null}catch(e){return null}}
function adOf(id){try{return (QH.COM||[]).find(function(x){return x.id===id})||null}catch(e){return null}}
function isOwner(a){var u=me();try{return !!a&&((u&&a.ownerUid===u.uid)||(typeof QH.key==='function'&&QH.key()&&a.ownerKey===QH.key()))}catch(e){return false}}
function isAdm(){var u=me();try{return (typeof MODE!=='undefined'&&MODE==='admin')||(u&&typeof ADMIN_UID!=='undefined'&&u.uid===ADMIN_UID)}catch(e){return false}}
function when(t){try{return new Date(t).toLocaleDateString('es-CO',{day:'numeric',month:'short'})}catch(e){return ''}}
function html(id){var a=adOf(id),L=(FB[id]||[]).slice().sort(function(x,y){return (y.ts||0)-(x.ts||0)}),u=me(),mine=u?L.find(function(x){return x.uid===u.uid}):null,own=isOwner(a),adm=isAdm();
 var si=L.filter(function(x){return x.util===true}).length,no=L.filter(function(x){return x.util===false}).length,cs=L.filter(function(x){return x.txt}),h='';
 if(own){h+='<p class="cmfb-sum">'+(si||no?(si+(si===1?' persona dijo':' personas dijeron')+' que le sirvió · '+no+' que no'):'Aún nadie ha dicho si le sirvió tu anuncio.')+'</p>'}
 else{h+='<div class="cmfb-q"><span>¿Te sirvió este anuncio?</span><button type="button" class="cmfb-v" data-fbv="1" aria-pressed="'+(!!mine&&mine.util===true)+'">'+IC.up+'Sí <b>'+si+'</b></button><button type="button" class="cmfb-v" data-fbv="0" aria-pressed="'+(!!mine&&mine.util===false)+'">'+IC.down+'No <b>'+no+'</b></button></div>'}
 h+='<button type="button" class="cmfb-tg" data-fbt="1" aria-expanded="'+!!open[id]+'">'+IC.msg+'Comentarios ('+cs.length+')</button>';
 if(open[id]){h+='<div class="cmfb-ls">'+(cs.length?cs.map(function(c){var del=(u&&c.uid===u.uid)||adm;
   return '<div class="cmfb-c"><b>'+E(c.name||'Vecino')+'</b><small>'+E(when(c.ts))+'</small>'+(c.util===true?'<span class="cmfb-tag">Le sirvió</span>':c.util===false?'<span class="cmfb-tag">No le sirvió</span>':'')+'<p>'+E(c.txt)+'</p>'+(del?'<button type="button" class="cmfb-del" data-fbd="'+E(c.uid)+'">Borrar comentario</button>':'')+'</div>'}).join(''):'<p class="cmfb-note">Aún no hay comentarios.</p>');
  if(own)h+='<p class="cmfb-note">No puedes calificar ni comentar tu propio anuncio.</p>';
  else h+='<div class="cmfb-f"><label class="qh-sr" for="fbt-'+E(id)+'">Tu comentario</label><textarea id="fbt-'+E(id)+'" maxlength="300" placeholder="Cuéntales a otros vecinos cómo te fue (máximo 300 letras)">'+E(mine&&mine.txt||'')+'</textarea><button type="button" class="btn" data-fbs="1">'+(mine&&mine.txt?'Actualizar comentario':'Publicar comentario')+'</button></div>';
  h+='</div>'}
 return h}
function paint(root){if(!FB)return;var l=(root||document).querySelectorAll('.cmfb[data-ad]');for(var i=0;i<l.length;i++){var b=l[i],id=b.dataset.ad;if(!id||b.closest('.cwz-card'))continue;if(document.activeElement&&document.activeElement.tagName==='TEXTAREA'&&b.contains(document.activeElement))continue;var h=html(id);if(b._h!==h){b._h=h;b.innerHTML=h}}}
function ref(id,uid){return firebase.firestore().collection('cmFb').doc(id+'_'+uid)}
function save(id,patch){var u=me();if(!u){try{need(function(){})}catch(e){}return}
 var a=adOf(id);if(isOwner(a))return toast('No puedes calificar ni comentar tu propio anuncio.');
 var fbc=(FB[id]||[]).find(function(x){return x.uid===u.uid}),lc=LOC[id];var cur=(lc&&(!fbc||(lc.ts||0)>(fbc.ts||0))?lc:fbc)||{},d={ad:id,uid:u.uid,name:String((S.user&&S.user.name)||'Vecino').slice(0,40),ts:Date.now()};
 var util='util' in patch?patch.util:cur.util,txt='txt' in patch?patch.txt:(cur.txt||'');if(util===true||util===false)d.util=util;if(txt)d.txt=txt;
 busy=true;LOC[id]=d;var p=(d.util===undefined&&!d.txt)?ref(id,u.uid).delete():ref(id,u.uid).set(d);
 p.then(function(){busy=false}).catch(function(e){busy=false;toast(e&&e.code==='permission-denied'?'No se pudo guardar. Entra con tu correo para opinar.':'No se pudo guardar. Revisa tu conexión.')})}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.cmfb [data-fbv],.cmfb [data-fbt],.cmfb [data-fbs],.cmfb [data-fbd]');if(!b)return;
 var box=b.closest('.cmfb'),id=box.dataset.ad;e.preventDefault();e.stopPropagation();
 if(b.dataset.fbt){open[id]=!open[id];paint(box.parentNode);return}
 if(!me()){if(typeof S==='object'&&S&&S.user){toast('Para opinar entra con tu correo y tu clave.')}else{try{need(function(){paint()})}catch(x){toast('Entra a tu cuenta para opinar.')}}return}
 if(b.dataset.fbv!=null){var v=b.dataset.fbv==='1',u=me(),cur=(FB[id]||[]).find(function(x){return x.uid===u.uid});save(id,{util:cur&&cur.util===v?null:v});return}
 if(b.dataset.fbs){var t=(box.querySelector('textarea').value||'').trim().slice(0,300);if(t.length<3)return toast('Escribe tu comentario (mínimo 3 letras).');save(id,{txt:t});toast('Gracias por tu comentario');return}
 if(b.dataset.fbd){var uid=b.dataset.fbd,u2=me();if(u2&&uid===u2.uid)save(id,{txt:''});else if(isAdm())firebase.firestore().collection('cmFb').doc(id+'_'+uid).delete().catch(function(){toast('No se pudo borrar.')});return}
},true);
/* escucha la coleccion cuando Firebase ya este listo; si las reglas no la permiten, la seccion no se muestra */
function start(){try{if(!window.firebase||!firebase.apps||!firebase.apps.length||typeof QH==='undefined')return setTimeout(start,500);
 firebase.firestore().collection('cmFb').onSnapshot(function(sn){var m={};sn.forEach(function(d){var x=d.data();if(x&&x.ad){(m[x.ad]=m[x.ad]||[]).push(x)}});FB=m;paint()},function(){FB=null;var l=document.querySelectorAll('.cmfb');for(var i=0;i<l.length;i++){l[i].innerHTML='';l[i]._h=''}})}catch(e){setTimeout(start,1000)}}
var pend=false;new MutationObserver(function(){if(FB&&!pend){pend=true;(window.requestAnimationFrame||setTimeout)(function(){pend=false;paint()})}}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
