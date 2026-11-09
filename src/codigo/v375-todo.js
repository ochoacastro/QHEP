
/* v375: PESTAÑA «LO MÁS RECIENTE» en el inicio (la primera; antes se llamó «Todo» y «Lo último»). Junta clasificados, tiendas (también comidas y peluquerías), servicios,
   vehículos, inmuebles y noticias, ordenados por fecha de creación: lo más reciente arriba. Cada fila abre la publicación.
   Tiendas y servicios guardan su fecha desde v375; los que se crearon antes no la tienen y salen al final.
   Si algo falla, borra este bloque: la pestaña desaparece sola. */
(function(){
var MAX=30,E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var SV=function(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'};
var IC={store:SV('<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9h18"/><path d="M10 20v-6h4v6"/>'),
 cm:SV('<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 8a5 5 0 0 1 0 8"/><path d="M18 5a9 9 0 0 1 0 14"/>'),
 serv:SV('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>'),
 veh:SV('<path d="M5 17h14l-1.5-6.5A2 2 0 0 0 15.6 9H8.4a2 2 0 0 0-1.9 1.5z"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>'),
 casa:SV('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'),
 news:SV('<rect x="3" y="4" width="18" height="16"/><path d="M7 8h10M7 12h10M7 16h6"/>')};
function ago(t){if(!t)return '';var m=Math.floor((Date.now()-t)/60000);if(m<1)return 'ahora';if(m<60)return 'hace '+m+' min';var h=Math.floor(m/60);if(h<24)return 'hace '+h+' h';var d=Math.floor(h/24);if(d===1)return 'ayer';if(d<30)return 'hace '+d+' días';var mo=Math.floor(d/30);return mo<12?'hace '+mo+(mo===1?' mes':' meses'):'hace '+Math.floor(mo/12)+(mo<24?' año':' años')}
function T(x){var v=Number(x&&(x.ts||x.created||0));return isFinite(v)?v:0}
function ok(u){return typeof u==='string'&&/^(https:|data:image\/|blob:)/.test(u)}
window.hubTodo=function(){var L=[],i=0;
 try{S.stores.filter(function(s){return vis(s)&&!ageBlock(s)}).forEach(function(s){var pi=(s.products||[]).map(function(p){return pimgs(p)[0]}).find(Boolean),im=s.cover||'',lg=ok(s.logo)?s.logo:'';
  var k=COMIDAS.includes(s.cat)?'Comida':PELU.includes(s.cat)?'Peluquería':'Tienda';L.push({t:T(s),o:i++,ic:'store',img:im||lg||pi||'',lg:!im&&!!lg,k:k+(s.cat&&k==='Tienda'?' · '+s.cat:''),n:s.name,s:s.zone||'',a:'open',id:s.id})})}catch(e){}
 try{S.services.filter(function(x){return vis(x)}).forEach(function(x){L.push({t:T(x),o:i++,ic:'serv',img:ok(x.img)?x.img:'',k:'Servicio'+(x.job?' · '+x.job:''),n:x.name,s:x.zone||'',a:'serv',id:x.id})})}catch(e){}
 try{S.ads.filter(function(a){return ['veh','arr','casa'].includes(a.type)&&vis(a)&&!a.closed&&!expired(a)}).forEach(function(a){var im=pimgs(a)[0]||'';L.push({t:T(a),o:i++,ic:a.type==='veh'?'veh':'casa',img:im,k:(ADT[a.type]&&ADT[a.type].one)||'Anuncio',n:a.title,s:[String(adPrice(a)||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim(),a.zone].filter(Boolean).join(' · '),a:'openAd',id:a.id})})}catch(e){}
 try{(QH.COM||[]).filter(function(a){return comActive(a)&&!a.hid}).forEach(function(a){var pr=Number(a.price)||0,c=cmCat(a.cat);L.push({t:T(a),o:i++,ic:'cm',img:ok(a.img)?a.img:'',k:'Clasificado'+(c&&c[2]?' · '+c[2]:''),n:a.title,s:[pr?money(pr):a.op==='regalo'?'Gratis':'',a.zone].filter(Boolean).join(' · '),a:'cmxOpen',id:a.id})})}catch(e){}
 try{(QH.NEWS||[]).forEach(function(n){var im=n.img||(Array.isArray(n.imgs)&&n.imgs[0])||'';L.push({t:T(n),o:i++,ic:'news',img:ok(im)?im:'',k:'Noticia',n:n.title||'Noticia',s:n.author||'',a:'nwOpen',id:n.id})})}catch(e){}
 if(!L.length)return '<div class="empty">Todavía no hay publicaciones. ¡Sé el primero en publicar!</div>';
 L.sort(function(x,y){return (y.t-x.t)||(x.o-y.o)});
 return '<div class="tdl">'+L.slice(0,MAX).map(function(r){var w=ago(r.t);
  return '<button type="button" class="tdr" data-act="'+r.a+'" data-id="'+E(r.id)+'"><span class="tdi'+(r.img?'':' ic')+'">'+(r.img?'<img src="'+E(r.img)+'" alt="" loading="lazy"'+(r.lg?' class="lg"':'')+'>':IC[r.ic])+'</span><span class="tdb"><em>'+E(r.k)+'</em><b>'+E(r.n||'')+'</b><small>'+E([r.s,w].filter(Boolean).join(' · '))+'</small></span></button>'}).join('')+'</div>'};
document.head.insertAdjacentHTML('beforeend','<style id="v375-css">.tdl{display:flex;flex-direction:column;margin-top:4px}.tdr{display:flex;gap:14px;align-items:center;width:100%;text-align:left;padding:12px 2px;border:0;border-bottom:1px solid #e5e5ea;background:none;color:inherit;font:inherit;cursor:pointer}.tdr:last-child{border-bottom:0}.tdi{width:76px;height:76px;flex:none;background:#f2f2f4;display:grid;place-items:center;overflow:hidden}.tdi img{width:100%;height:100%;object-fit:cover;display:block}.tdi img.lg{object-fit:contain;background:#fff;padding:6px}.tdi.ic svg{width:34px;height:34px;color:#6e6e73}.tdb{display:flex;flex-direction:column;gap:2px;min-width:0}.tdb em{font-style:normal;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#6e6e73}.tdb b{font-size:16px;line-height:1.3;color:var(--ink,#1d1d1f);overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.tdb small{font-size:13px;color:#6e6e73}html.dark .tdr{border-color:#2c2c2e}html.dark .tdi{background:#1c1c1e}html.dark .tdb b{color:#f5f5f7}html.dark .tdb em,html.dark .tdb small,html.dark .tdi.ic svg{color:#a1a1a6}</style>');
})();
