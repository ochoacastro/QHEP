/* v442: MURO estilo Facebook. El botón «Clasificados» de la barra de abajo pasa a llamarse «Muro» y la vista de Clasificados (view 'com')
   se cambia por un muro: arriba «¿Deseas publicar un anuncio?» (abre la ventana «¿Qué quieres publicar?»), el buscador y las pestañas
   de las categorías principales (Todo, Clasificados, Tiendas, Comidas, Peluquerías, Servicios, Vehículos, Inmuebles, Noticias).
   Debajo, las publicaciones en tarjetas, una debajo de otra. Deslizando el dedo hacia los lados se pasa de una categoría a otra.
   En Clasificados, «Filtros» abre una ventana con tipo, categoría, subcategoría, ubicación, estado, fecha y precio (los mismos de antes).
   El «+ Publicar» de abajo también abre «¿Qué quieres publicar?» (antes abría directo el clasificado, v407).
   La vista anterior queda en comView0: si algo falla, borra este bloque y la vista de Clasificados vuelve sola. */
(function(){
var comView0=null,E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var TABS=[['todo','Todo'],['cm','Clasificados'],['tienda','Tiendas'],['comida','Comidas'],['pelu','Peluquerías'],['serv','Servicios'],['veh','Vehículos'],['casa','Inmuebles'],['news','Noticias']];
var tab='cm',more=30,anim='';
var SV=function(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'};
var IC={cm:SV('<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 8a5 5 0 0 1 0 8"/><path d="M18 5a9 9 0 0 1 0 14"/>'),
 store:SV('<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9h18"/><path d="M10 20v-6h4v6"/>'),
 casa:SV('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'),
 veh:SV('<path d="M5 17h14l-1.5-6.5A2 2 0 0 0 15.6 9H8.4a2 2 0 0 0-1.9 1.5z"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>'),
 serv:SV('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>'),
 emp:SV('<rect x="3" y="7" width="18" height="13"/><path d="M8 7V4h8v3M3 12h18"/>'),
 obi:SV('<path d="M12 21c-4-6-6-9.5-6-12a6 6 0 0 1 12 0c0 2.5-2 6-6 12z"/><path d="M9.5 9.5 14.5 14.5M14.5 9.5 9.5 14.5"/>'),
 otro:SV('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
 plan:SV('<path d="M12 2l3 6 6 .9-4.5 4.4 1 6.2L12 16.6 6.5 19.5l1-6.2L3 8.9 9 8z"/>'),
 foto:SV('<rect x="3" y="5" width="18" height="14"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 8"/>'),
 flt:SV('<path d="M4 6h16M7 12h10M10 18h4"/>')};
function ago(t){if(!t)return '';var m=Math.floor((Date.now()-t)/60000);if(m<1)return 'ahora';if(m<60)return 'hace '+m+' min';var h=Math.floor(m/60);if(h<24)return 'hace '+h+' h';var d=Math.floor(h/24);if(d===1)return 'ayer';if(d<30)return 'hace '+d+' días';var mo=Math.floor(d/30);return mo<12?'hace '+mo+(mo===1?' mes':' meses'):'hace '+Math.floor(mo/12)+(mo<24?' año':' años')}
function T(x){var v=Number(x&&(x.ts||x.created||0));return isFinite(v)?v:0}
function ok(u){return typeof u==='string'&&/^(https:|data:image\/|blob:)/.test(u)}
function nz(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()}
function hit(r){var q=nz(typeof query==='string'?query.trim():'');if(!q)return true;return nz([r.n,r.ti,r.d,r.k,r.z].join(' ')).indexOf(q)>=0}
function cut(s,n){s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1)+'…':s}
/* publicaciones de cada pestaña (menos Clasificados, que usa la tarjeta de siempre: comCard) */
function stores(kind){var L=[];try{S.stores.filter(function(s){return vis(s)&&!ageBlock(s)}).forEach(function(s){var k=COMIDAS.includes(s.cat)?'comida':PELU.includes(s.cat)?'pelu':'tienda';if(kind&&k!==kind)return;
 var pi=(s.products||[]).map(function(p){return pimgs(p)[0]}).find(ok)||'',np=(s.products||[]).length;
 L.push({tab:k,t:T(s),lg:ok(s.logo)?s.logo:'',ic:IC.store,n:s.name,k:k==='comida'?'Comida':k==='pelu'?'Peluquería':'Tienda'+(s.cat?' · '+s.cat:''),z:s.zone||'',img:ok(s.cover)?s.cover:pi,d:cut(s.desc,180),pr:np?np+(np===1?' producto':' productos'):'',a:'open',id:s.id,cta:k==='comida'?'Ver menú':'Ver tienda',wa:s.wa?1:0,rt:(function(){try{return rateLine(s)}catch(e){return ''}})()/* v454: WhatsApp y estrellas en la fila */})})}catch(e){}return L}
function servs(){var L=[];try{S.services.filter(function(x){return vis(x)}).forEach(function(x){L.push({tab:'serv',t:T(x),lg:'',ic:IC.serv,n:x.name,k:'Servicio'+(x.job?' · '+x.job:''),z:x.zone||'',img:ok(x.img)?x.img:'',d:cut(x.desc||x.d,180),a:'serv',id:x.id,cta:'Ver servicio'})})}catch(e){}return L}
function ads(ty){var L=[];try{S.ads.filter(function(a){return (ty==='veh'?a.type==='veh':['arr','casa'].includes(a.type))&&vis(a)&&!a.closed&&!expired(a)}).forEach(function(a){var pr='';try{pr=String(adPrice(a)||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()}catch(e){}
 L.push({tab:ty,t:T(a),lg:'',ic:ty==='veh'?IC.veh:IC.casa,n:a.owner||((ADT[a.type]&&ADT[a.type].one)||'Anuncio'),k:(ADT[a.type]&&ADT[a.type].one)||'Anuncio',z:a.zone||'',img:pimgs(a).find(ok)||'',ti:a.title,pr:pr,d:cut(a.desc,180),a:'openAd',id:a.id,cta:'Ver anuncio'})})}catch(e){}return L}
function news(){var L=[];try{(QH.NEWS||[]).forEach(function(n){var im=n.img||(Array.isArray(n.imgs)&&n.imgs[0])||'';L.push({tab:'news',t:T(n),lg:'',ic:IC.cm,n:n.author||'Mi Pradera',k:'Noticia',z:'',img:ok(im)?im:'',ti:n.title||'Noticia',d:cut(n.sum||n.lead||'',180),a:'nwOpen',id:n.id,cta:'Leer noticia'})})}catch(e){}return L}
function coms(){var k='';try{k=QH.key()}catch(e){}var l=[];try{l=QH.COM.filter(function(a){return comActive(a)&&!a.hid&&comMatch(a,query)&&cmFilt(a)})}catch(e){}
 var fe=l.filter(cmFeat),re=l.filter(function(a){return !cmFeat(a)});return fe.concat(re).map(function(a){return {tab:'cm',t:T(a),cm:a,k:k}})}
function card(r){if(r.cm)return comCard(r.cm,r.k);
 /* v454: negocios, servicios, vehículos, inmuebles y noticias en FILA (los clasificados siguen como en Facebook): a la izquierda el
    logo (o la foto si no hay logo, o el ícono); a la derecha qué es, el nombre o título, las estrellas, el precio, la descripción y
    los botones (WhatsApp en los negocios que lo tienen). Para volver a la tarjeta anterior: borrar desde aquí hasta «v454 fin». */
 if(!window.qhMuroViejo){var f=r.lg?'<img class="murlg" src="'+E(r.lg)+'" alt="" loading="lazy">':r.img?'<img class="murim" src="'+E(r.img)+'" alt="" loading="lazy">':'<span class="muric">'+r.ic+'</span>';
  return '<article class="cmc muc mur"><button type="button" class="murf" data-act="'+r.a+'" data-id="'+E(r.id)+'" aria-label="'+E(r.cta+': '+(r.ti||r.n))+'">'+f+'</button>'+
   '<div class="murb"><div class="murk">'+E([r.k,r.z,ago(r.t)].filter(Boolean).join(' · '))+'</div><h3 class="murn">'+E(r.ti||r.n||'')+'</h3>'+(r.ti&&r.n?'<div class="murz">'+E(r.n)+'</div>':'')+
   (r.rt?'<div class="murz">'+r.rt+'</div>':'')+(r.pr?'<p class="cmpr murp">'+E(r.pr)+'</p>':'')+(r.d?'<p class="murd">'+E(r.d)+'</p>':'')+
   '<div class="murr">'+(r.wa?'<button type="button" class="murw" data-act="hubWa" data-id="'+E(r.id)+'">WhatsApp</button>':'')+'<button type="button" class="murv" data-act="'+r.a+'" data-id="'+E(r.id)+'">'+E(r.cta)+'</button></div></div></article>'}
 /* v454 fin */
 return '<article class="cmc muc"><div class="cmh"><span class="cma'+(r.lg?' mulg':'')+'">'+(r.lg?'<img src="'+E(r.lg)+'" alt="" loading="lazy">':r.ic)+'</span><div><b>'+E(r.n||'')+'</b><small>'+E([r.k,r.z,ago(r.t)].filter(Boolean).join(' · '))+'</small></div></div>'+
  (r.img?'<button type="button" class="muim" data-act="'+r.a+'" data-id="'+E(r.id)+'" aria-label="'+E(r.cta+': '+(r.ti||r.n))+'"><img src="'+E(r.img)+'" alt="" loading="lazy"></button>':'')+
  '<div class="cmb">'+(r.ti?'<b>'+E(r.ti)+'</b>':'')+(r.pr?'<p class="cmpr">'+E(r.pr)+'</p>':'')+(r.d?'<p>'+E(r.d)+'</p>':'')+'</div>'+
  '<div class="cmact"><button type="button" class="btn pink" data-act="'+r.a+'" data-id="'+E(r.id)+'">'+E(r.cta)+'</button></div></article>'}
function items(){var L;
 if(tab==='cm')return coms();
 if(tab==='todo')L=coms().concat(stores(''),servs(),ads('veh'),ads('casa'),news());
 else if(tab==='serv')L=servs();else if(tab==='veh'||tab==='casa')L=ads(tab);else if(tab==='news')L=news();else L=stores(tab);
 L=L.filter(function(r){return r.cm||hit(r)});
 return tab==='todo'?L.sort(function(x,y){return y.t-x.t}):L.sort(function(x,y){return y.t-x.t})}
function nFlt(){try{return ['op','cat','sub','min','max','zone','cond','days'].filter(function(x){return cmF[x]}).length}catch(e){return 0}}
function initial(){try{return E(((S.user&&S.user.name)||'').trim().charAt(0).toUpperCase())}catch(e){return ''}}
function muro(){var L=items(),n=L.length,back='';try{back=MODE==='panel'?'<div class="hubbar"><button class="btn ghost" data-act="home">← Volver a mi cuenta</button></div>':''}catch(e){}
 var q=typeof query==='string'&&query.trim(),nf=tab==='cm'?nFlt():0,ti=TABS.find(function(x){return x[0]===tab})||TABS[1];
 var none=q||nf?'<div class="empty">No encontramos publicaciones'+(q?' con «'+E(q)+'»':'')+(nf?' con esos filtros':'')+'.</div>':'<div class="empty">Todavía no hay publicaciones en '+E(ti[1])+'. ¡Publica la primera!</div>';
 var old='';if(tab==='cm'){try{var o=comMine().filter(function(a){return !comActive(a)});if(o.length)old='<div class="cg cmold"><h3>Mis anuncios vencidos</h3>'+o.map(function(a){return '<div class="ci"><span>'+E(a.title)+'</span><button class="btn ghost" data-act="cmxDel" data-id="'+E(a.id)+'">Eliminar</button></div>'}).join('')+'</div>'}catch(e){}}
 var ini=initial();
 return (typeof tabs==='function'?tabs().replace('<span class="hcur">Clasificados</span>','<span class="hcur">Muro</span>'):'')+back+
  '<section class="mu" aria-label="Muro">'+
  '<button type="button" class="mucomp" data-mu="pub"><span class="mua" aria-hidden="true">'+(ini||IC.otro)+'</span><span class="mup">¿Deseas publicar un anuncio?</span><span class="muf" aria-hidden="true">'+IC.foto+'</span></button>'+
  (typeof catSearch==='function'?catSearch('Buscar en el muro'):'')+
  '<div class="mutabs" role="tablist" aria-label="Categorías del muro">'+TABS.map(function(t){return '<button type="button" role="tab" data-mutab="'+t[0]+'" aria-selected="'+(t[0]===tab)+'">'+E(t[1])+'</button>'}).join('')+'</div>'+
  (tab==='cm'?'<div class="mufl"><button type="button" class="chip" data-mu="flt" aria-haspopup="dialog">'+IC.flt+'Filtros'+(nf?' ('+nf+')':'')+'</button>'+(nf||q?'<button type="button" class="chip" data-mu="clr">Limpiar</button>':'')+'</div>':'')+
  '<div class="mufeed'+(anim?' '+anim:'')+'" id="mufeed" role="tabpanel" aria-label="'+E(ti[1])+'">'+(n?L.slice(0,more).map(card).join('')+(n>more?'<button type="button" class="btn ghost mumore" data-mu="more">Ver más publicaciones</button>':''):none)+old+'</div>'+
  '</section>'}
/* el programa principal se carga al final de la página: se espera a que exista comView para cambiarla por el muro */
function inst(){if(comView0)return true;if(typeof comView!=='function'||typeof render!=='function')return false;comView0=comView;window.comView0=comView0;comView=muro;
 try{hubIc.muro=MURO_IC;BN.forEach(function(x){if(x[0]==='com'){x[1]='Muro';x[2]='muro'}})}catch(e){}nombre();try{if(view==='com')render()}catch(e){}return true}
/* ---- ventana «¿Qué quieres publicar?» ---- */
function opt(ic,t,d,attrs){return '<button type="button" class="muop" '+attrs+'><span class="muoi">'+ic+'</span><span><b>'+t+'</b><small>'+d+'</small></span></button>'}
function pubWin(){modal('<h2>¿Qué quieres publicar?</h2><p class="muted">Gratis: 1 anuncio clasificado al día, que dura 24 horas.</p><div class="muops">'+
 opt(IC.cm,'Anuncio clasificado','Vende, compra, arrienda o regala algo','data-act="cmxNew"')+
 opt(IC.store,'Mi negocio o tienda','Regístralo gratis: nombre, logo, dirección y teléfono','data-act="newShop"')+
 opt(IC.casa,'Inmueble','Casa, apartamento, local o lote en arriendo o venta','data-act="gdPub" data-v="inm"')+
 opt(IC.veh,'Vehículo','Moto, carro o camioneta','data-act="gdPub" data-v="veh"')+
 opt(IC.serv,'Servicio','Ofrece lo que sabes hacer','data-act="pubAsk" data-v="serv" data-pn="1"')+
 opt(IC.emp,'Empleo','Ofrece un trabajo','data-empb="1"')+
 opt(IC.obi,'Obituario','Aviso de fallecimiento con imagen para compartir','data-obi="1"')+
 opt(IC.otro,'Otro tipo de anuncio','¿No está lo que buscas? Escribe libremente lo que quieres publicar','data-act="cmxNew"')+
 opt(IC.plan,'Planes y precios','Para publicar más o que tu anuncio dure más','data-act="menuPlanes"')+
 '</div><div class="row" style="margin-top:12px"><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>');try{var m=document.querySelector('#ov .modal');if(m)m.classList.add('mupw')}catch(e){}}
window.qhPublicar=pubWin;
/* ---- ventana de filtros de Clasificados ---- */
function fltWin(){var act=[];try{act=QH.COM.filter(function(a){return comActive(a)&&!a.hid})}catch(e){}var ct=cmCat(cmF.cat),zs=zonesOf(act),sel=function(v,x){return v===x?' selected':''};
 modal('<h2>Filtros</h2><label for="muf-op">Tipo</label><select id="muf-op"><option value="">Todos</option>'+CM_OPS.map(function(o){return '<option value="'+o[0]+'"'+sel(cmF.op,o[0])+'>'+E(o[2])+'</option>'}).join('')+'</select>'+
  '<label for="muf-cat">Categoría</label><select id="muf-cat"><option value="">Todas</option>'+CM_CATS.map(function(c){return '<option value="'+c[0]+'"'+sel(cmF.cat,c[0])+'>'+E(c[2])+'</option>'}).join('')+'</select>'+
  '<label for="muf-sub">Subcategoría</label><select id="muf-sub"'+(ct?'':' disabled')+'><option value="">Todas</option>'+(ct?ct[4].map(function(s){return '<option'+sel(cmF.sub,s)+'>'+E(s)+'</option>'}).join(''):'')+'</select>'+
  '<label for="muf-zone">Ubicación</label><select id="muf-zone"><option value="">Todas</option>'+znOpts(zs,cmF.zone)+'</select>'+
  '<label for="muf-cond">Estado</label><select id="muf-cond"><option value="">Todos</option>'+['Nuevo','Usado'].map(function(x){return '<option'+sel(cmF.cond,x)+'>'+x+'</option>'}).join('')+'</select>'+
  '<label for="muf-days">Publicado</label><select id="muf-days"><option value="">Cuando sea</option>'+[[1,'Hoy'],[7,'Últimos 7 días'],[30,'Últimos 30 días']].map(function(d){return '<option value="'+d[0]+'"'+sel(String(cmF.days),String(d[0]))+'>'+d[1]+'</option>'}).join('')+'</select>'+
  '<label for="muf-min">Precio</label><span class="pr mupr"><input id="muf-min" type="text" inputmode="numeric" data-money placeholder="Desde" aria-label="Precio desde" value="'+E(moneyFmt(cmF.min))+'"><input id="muf-max" type="text" inputmode="numeric" data-money placeholder="Hasta" aria-label="Precio hasta" value="'+E(moneyFmt(cmF.max))+'"></span>'+
  '<div class="row" style="margin-top:14px"><button type="button" class="btn pink" data-mu="fok">Ver resultados</button><button type="button" class="btn ghost" data-mu="fclr">Limpiar filtros</button></div>')}
function fltRead(){var v=function(i){var x=document.getElementById(i);return x?x.value:''},d=function(i){return v(i).replace(/\D/g,'')};
 cmF.op=v('muf-op');cmF.cat=v('muf-cat');cmF.sub=cmF.cat?v('muf-sub'):'';cmF.zone=v('muf-zone');cmF.cond=v('muf-cond');cmF.days=v('muf-days');cmF.min=d('muf-min');cmF.max=d('muf-max')}
document.addEventListener('change',function(e){if(e.target&&e.target.id==='muf-cat'){var c=cmCat(e.target.value),s=document.getElementById('muf-sub');if(!s)return;s.disabled=!c;s.innerHTML='<option value="">Todas</option>'+(c?c[4].map(function(x){return '<option>'+E(x)+'</option>'}).join(''):'')}});
/* ---- pestañas y deslizar ---- */
function go(t,dir){if(t===tab)return;tab=t;more=30;anim=dir?'mu-'+dir:'';try{render()}catch(e){}anim='';center();var f=document.querySelector('.mutabs');if(f&&f.getBoundingClientRect().top<0)f.scrollIntoView({block:'start'})}
function center(){var b=document.querySelector('.mutabs [aria-selected="true"]');if(!b)return;var w=b.parentNode;w.scrollLeft=Math.max(0,b.offsetLeft-(w.clientWidth-b.offsetWidth)/2)}
function step(d){var i=TABS.findIndex(function(x){return x[0]===tab}),j=i+d;if(j<0||j>=TABS.length)return;go(TABS[j][0],d>0?'l':'r')}
window.muroTab=function(t){if(TABS.some(function(x){return x[0]===t})){tab=t;more=30}};
var x0=null,y0=0,t0=0;
document.addEventListener('touchstart',function(e){x0=null;if(e.touches.length!==1||typeof view==='undefined'||view!=='com'||document.getElementById('ov'))return;var t=e.target;if(!t.closest||!t.closest('.mu')||t.closest('.mutabs,input,select,textarea,.cmths,.cmvw'))return;
 if(t.closest('article.cmc img.cmi')){var a=t.closest('article.cmc');if(a&&a.querySelector('.cmths'))return}/* v207: esa foto pasa de foto en foto */
 x0=e.touches[0].clientX;y0=e.touches[0].clientY;t0=Date.now()},{passive:true});
document.addEventListener('touchend',function(e){if(x0===null)return;var c=e.changedTouches[0],dx=c.clientX-x0,dy=c.clientY-y0;x0=null;if(Date.now()-t0>800)return;if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.8)return;step(dx<0?1:-1)},{passive:true});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-mutab],[data-mu],#bnav [data-act="bn"][data-v="pub"],#bnav [data-act="bn"][data-v="com"]');if(!b)return;
 if(b.matches('#bnav [data-v="com"]')){tab='todo';more=30;return}/* «Muro» abre en «Todo»; el resto lo hace la barra de siempre */
 e.preventDefault();e.stopImmediatePropagation();
 if(b.matches('#bnav [data-v="pub"]')){try{closeModal(1)}catch(x){}return pubWin()}
 if(b.hasAttribute('data-mutab'))return go(b.getAttribute('data-mutab'),'');
 var m=b.getAttribute('data-mu');
 if(m==='pub')return pubWin();
 if(m==='flt')return fltWin();
 if(m==='fok'){fltRead();closeModal(1);more=30;render();return}
 if(m==='fclr'||m==='clr'){try{cmF=Object.assign({},CMF0)}catch(x){}query='';var q0=document.getElementById('cq');if(q0)q0.value='';closeModal(1);render();return}
 if(m==='more'){more+=30;var y=scrollY;render();scrollTo(0,y)}},true);
/* «Clasificados» desde otras partes (inicio, menú, carrusel) abre la pestaña Clasificados */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-v="com"]:not([data-act="bn"]):not([data-act="pubAsk"]),[data-act="cmxOpen"]');if(b){tab='cm';more=30}},true);
/* el nombre del botón de abajo: «Muro» */
/* v466: ícono del Muro (antes el megáfono de Clasificados): lista con un cuadro a la izquierda y líneas a la derecha, como las
   publicaciones del Muro (v454). Es «layout-list» de Lucide, la misma familia de íconos de línea de la barra */
var MURO_IC='<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M14 4h7"/><path d="M14 9h7"/><path d="M14 15h7"/><path d="M14 20h7"/>';
function nombre(){var s=document.querySelector('#bnav [data-v="com"] span');if(s&&s.textContent!=='Muro')s.textContent='Muro';
 var g=document.querySelector('#bnav [data-v="com"] svg');if(g&&!g.dataset.muro){g.innerHTML=MURO_IC;g.dataset.muro='1'}}
if(!inst()){document.addEventListener('DOMContentLoaded',inst);var k0=0,iv=setInterval(function(){if(inst()||++k0>200)clearInterval(iv)},50)}setTimeout(nombre,1500);
document.head.insertAdjacentHTML('beforeend','<style id="v442-css">'+
 '.mu{display:flex;flex-direction:column;gap:12px;margin-top:6px}'+
 '.mucomp{display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;background:var(--card,#fff);border:1px solid var(--line,#d2d2d7);color:inherit;font:inherit;text-align:left;cursor:pointer;min-height:64px}'+
 '.mua{width:40px;height:40px;flex:none;display:grid;place-items:center;background:var(--rio,#0071e3);color:#fff;font-weight:800;font-size:17px}.mua svg{width:20px;height:20px}'+
 '.mup{flex:1;min-width:0;padding:10px 14px;background:var(--bg,#f5f5f7);border:1px solid var(--line,#d2d2d7);font-size:15px;opacity:.85}'+
 '.muf{flex:none;color:#16a34a}.muf svg{width:26px;height:26px}'+
 '.mu .csq{margin:0}'+
 '.mutabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;border-bottom:1px solid var(--line,#d2d2d7);position:sticky;top:0;z-index:5;background:var(--bg,#f5f5f7);margin:0 -16px;padding:0 16px}.mutabs::-webkit-scrollbar{display:none}'+
 '.mutabs button{flex:none;background:none;border:0;border-bottom:3px solid transparent;padding:12px 10px 10px;font:inherit;font-size:15px;font-weight:700;color:inherit;opacity:.62;cursor:pointer;min-height:46px;white-space:nowrap}'+
 '.mutabs button[aria-selected="true"]{opacity:1;color:var(--rio,#0071e3);border-bottom-color:var(--rio,#0071e3)}'+
 '.mufl{display:flex;gap:8px;flex-wrap:wrap}.mufl .chip{display:inline-flex;align-items:center;gap:6px}.mufl svg{width:18px;height:18px}'+
 '.mufeed{min-height:50vh;touch-action:pan-y}.mufeed>.empty{margin-top:8px}'+
 '.muc .cma.mulg{background:#fff;overflow:hidden;padding:0}.muc .cma img{width:100%;height:100%;object-fit:contain;display:block}.muc .cma svg{width:22px;height:22px}'+
 '.muim{display:block;width:100%;padding:0;border:0;background:#111;cursor:pointer}.muim img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}'+
 '.muc .cmb p{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}'+
 '.muc .cmact .btn{flex:1 1 100%}'+
 '.mumore{width:100%;margin-bottom:22px}'+
 '.muops{display:flex;flex-direction:column;gap:8px;margin-top:10px}'+
 '.muop{display:flex;align-items:center;gap:14px;width:100%;padding:12px;background:var(--card,#fff);border:1px solid var(--line,#d2d2d7);color:inherit;font:inherit;text-align:left;cursor:pointer;min-height:60px}'+
 '.muop b{display:block;font-size:16px}.muop small{display:block;font-size:13px;opacity:.72;margin-top:2px;line-height:1.35}'+
 '.muoi{width:42px;height:42px;flex:none;display:grid;place-items:center;background:color-mix(in srgb,var(--rio,#0071e3) 12%,transparent);color:var(--rio,#0071e3)}.muoi svg{width:24px;height:24px}'+
 '.mupr{display:flex;gap:8px}.mupr input{flex:1;min-width:0}'+
 '@media (prefers-reduced-motion:no-preference){.mufeed.mu-l{animation:mu-l .24s cubic-bezier(.2,.8,.2,1)}.mufeed.mu-r{animation:mu-r .24s cubic-bezier(.2,.8,.2,1)}}'+
 '@keyframes mu-l{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}@keyframes mu-r{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none}}'+
 '</style>');
})();
