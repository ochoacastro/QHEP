
/* v309: la publicación guardada sin cuenta (inmueble, vehículo, negocio o clasificado) aparece en «Mi cuenta» como
   «Publicación pendiente», para revisarla y publicarla cuando quiera. Se guarda en este celular. Si falla, borra este bloque. */
(function(){
var IC='<svg class="qi" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"/></svg>';
var KN={arr:'Inmueble en arriendo',casa:'Inmueble en venta',veh:'Vehículo',shop:'Registro de tu negocio'};
function cmg(){try{if(typeof CMG!=='undefined'&&CMG)return CMG;var c=JSON.parse(localStorage.getItem('qh_cmg')||'null');return c&&c.t&&Date.now()-(c.ts||0)<=7*864e5?c:null}catch(e){return null}}
function ttl(d){var v=d.v||{};return v['af-title']||v['f-name']||[v['af-brand'],v['af-line'],v['af-year']].filter(Boolean).join(' ')||''}
window.gdMenu=function(it){var h='',d=typeof gdGet==='function'?gdGet():null,c=cmg();
 if(d){var t=ttl(d);h+=it(IC,'Publicación pendiente',esc(KN[d.k]||'Publicación')+(t?' · «'+esc(t)+'»':'')+' · toca para revisarla y publicarla','gdDraft','gdr',{n:1,t:'sin publicar'})}
 if(c)h+=it(IC,'Clasificado pendiente','«'+esc(c.t)+'» · toca para revisarlo y publicarlo','gdDraft','cmg',{n:1,t:'sin publicar'});
 return h};
function delBtn(){var c=document.querySelector('#ov .modal [data-act="close"]');if(c&&!document.querySelector('[data-gddel]'))c.insertAdjacentHTML('afterend','<button type="button" class="btn ghost" data-gddel="1">Descartar borrador</button>')}
addEventListener('click',async function(e){var t=e.target;if(!t.closest)return;
 var b=t.closest('[data-act="gdDraft"]');
 if(b){e.preventDefault();e.stopImmediatePropagation();
  if(b.dataset.v==='cmg'){try{if(!CMG)CMG=cmg()}catch(_){}if(typeof comGuestShow==='function')comGuestShow();return}
  var d=gdGet();if(!d){render();return}
  if(d.k==='shop'){shopForm();if(!document.getElementById('f-cats'))return;await gdFill(d)}else{adForm(d.k)}
  delBtn();return}
 if(t.closest('[data-gddel]')){e.preventDefault();e.stopImmediatePropagation();if(await askC('¿Descartar esta publicación guardada?')){gdClear();closeModal(1);render();toast('Borrador descartado')}return}
 /* si la persona ya entró y publica el borrador a mano, se borra al quedar publicado */
 var s=t.closest('[data-act="saveAd"],[data-act="saveShop"]');if(!s||!S.user||typeof gdGet!=='function')return;var g=gdGet();if(!g)return;
 var shop=s.dataset.act==='saveShop';if(shop!==(g.k==='shop')||(!shop&&(typeof af==='undefined'||af.id||af.type!==g.k)))return;
 setTimeout(function(){if(!document.getElementById(shop?'f-cats':'adf')&&gdGet()===g){gdClear();if(MODE==='panel'&&view==='home')render(true)}},1800)},true);
})();
