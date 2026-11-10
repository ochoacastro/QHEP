/* v403: «Conoce el lugar» en cada tienda, en vez de la imagen de portada (ninguna tienda la usaba).
   Fotos verticales del local (s.gal, se suben a R2 como las de los productos) y un video de YouTube (s.vid; s.vv si es Short).
   Gratis: hasta 3 fotos. Con el rol de la tienda (shopPaid): hasta 10 fotos y 1 video. Lo mismo exigen las reglas v50.
   Tocar una foto o el video lo abre en grande (lbOpen). Si algo falla, borra este bloque y la llamada placeHTML en storeView0. */
(function(){
var MAXF=3,MAXP=10;
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var IC={cam:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>',
 play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
 yt:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49 49 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49 49 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>',
 lock:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'};
function st(id){try{return S.stores.find(function(x){return x.id===(id||cur)})}catch(e){return null}}
function paid(s){try{return (typeof MODE!=='undefined'&&MODE==='admin')||shopPaid(s)}catch(e){return false}}
function max(s){return paid(s)?MAXP:MAXF}
function live(s){try{return paid(s)||shopLive(s)}catch(e){return false}}/* al público: según la fecha de pago de la tienda (pexp, con 3 días de gracia) */
function items(s){var p=live(s),l=(s.gal||[]).slice(0,p?MAXP:MAXF);if(s.vid&&p)l.unshift('yt:'+s.vid);return l}/* sin el rol: solo 3 fotos y sin video (lo demás no se borra) */
window.placeHTML=function(s,mine){var L=items(s),v=L[0]&&L[0].slice(0,3)==='yt:'?s.vid:'',g=L.filter(function(m){return m.slice(0,3)!=='yt:'});if(!L.length&&!mine)return '';
 var tiles=L.map(function(m,i){var isV=m.slice(0,3)==='yt:';return '<div class="clt'+(isV?' v':'')+'"><button type="button" class="clz" data-clopen="'+i+'" aria-label="'+(isV?'Ver el video de '+E(s.name):'Ver foto '+(isV?i:i+(v?0:1))+' de '+E(s.name))+'"><img src="'+E(isV?ytThumb(m.slice(3)):m)+'" alt="" loading="lazy">'+(isV?'<span class="clp">'+IC.play+'</span>':'')+'</button>'+(mine?'<button type="button" class="clx" data-cldel="'+(isV?'v':i-(v?1:0))+'" aria-label="'+(isV?'Quitar el video':'Quitar esta foto')+'">✕</button>':'')+'</div>'}).join('');
 var room=max(s)-g.length,add='';
 if(mine){add=(room>0?'<label class="clt cla"><input type="file" accept="image/*" multiple data-cladd="1" hidden>'+IC.cam+'<span>Agregar fotos</span><small>'+g.length+' de '+max(s)+'</small></label>':'')+
  (paid(s)?(v?'':'<button type="button" class="clt cla" data-clvid="1">'+IC.yt+'<span>Agregar video de YouTube</span></button>'):'<button type="button" class="clt cla lock" data-act="shopPro">'+IC.lock+'<span>Más fotos y video</span><small>Rol Comerciante</small></button>')}
 return '<section class="clug"><div class="clh"><h3 class="ptitle">Conoce el lugar</h3>'+(L.length?'<span>'+(g.length?g.length+(g.length===1?' foto':' fotos'):'')+(g.length&&v?' · ':'')+(v?'video':'')+'</span>':'')+'</div>'+
  (mine&&!L.length?'<p class="muted">Muestra tu local: la fachada, el interior y tus productos en estante. Las fotos verticales (como las del celular) se ven mejor.'+(paid(s)?' Puedes subir hasta '+MAXP+' fotos y un video de YouTube.':' Gratis puedes subir hasta '+MAXF+' fotos.')+'</p>':'')+
  '<div class="clr">'+tiles+add+'</div></section>'};
/* abrir en grande */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-clopen]');if(!b)return;e.preventDefault();var s=st();if(!s)return;lbOpen(items(s),+b.dataset.clopen,s.name,!!s.vv)},true);
/* quitar */
document.addEventListener('click',async function(e){var b=e.target.closest&&e.target.closest('[data-cldel]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();var s=st();if(!s)return;var k=b.dataset.cldel;
 if(!(await askC(k==='v'?'¿Quitar el video de «Conoce el lugar»?':'¿Quitar esta foto de «Conoce el lugar»?','Quitar')))return;
 if(k==='v'){s.vid='';delete s.vv}else{s.gal=(s.gal||[]).filter(function(_,i){return i!==+k})}save();var y=scrollY;render(true);scrollTo(0,y);toast(k==='v'?'Video quitado':'Foto quitada')},true);
/* agregar fotos */
document.addEventListener('change',async function(e){var i=e.target;if(!i||!i.matches||!i.matches('[data-cladd]'))return;var s=st();if(!s)return;var fs=[].slice.call(i.files||[]);i.value='';if(!fs.length)return;
 var room=max(s)-(s.gal||[]).length;if(room<=0)return toast('Ya tienes '+max(s)+' fotos. Quita una para agregar otra.');
 if(fs.length>room){toast('Solo caben '+room+(room===1?' foto más':' fotos más')+(paid(s)?'':'. Con el rol Comerciante puedes subir hasta '+MAXP)+'.');fs=fs.slice(0,room)}
 var lb=i.closest('.cla');if(lb)lb.classList.add('busy');toast('Subiendo '+(fs.length===1?'la foto':fs.length+' fotos')+'…');
 var up=[];for(var k=0;k<fs.length;k++){var d=await resize(fs[k],1000,.78);if(d)up.push(d)}
 if(!up.length){if(lb)lb.classList.remove('busy');return toast('No se pudo leer la imagen')}
 s.gal=(s.gal||[]).concat(up).slice(0,max(s));save();var y=scrollY;render(true);scrollTo(0,y);toast(up.length===1?'Foto agregada':up.length+' fotos agregadas')});
/* video de YouTube */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-clvid],[data-clvidok]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();var s=st();if(!s)return;
 if(!paid(s))return toast('El video es parte del rol Comerciante.');
 if(b.dataset.clvid){modal('<h2>Video de YouTube</h2><p class="muted">Pega el enlace de un video o un Short de YouTube donde se vea tu negocio.</p><label for="cl-vid">Enlace del video</label><input id="cl-vid" type="text" inputmode="url" maxlength="200" placeholder="https://youtube.com/shorts/…"><p class="err" id="err"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-clvidok="1">Guardar video</button><button type="button" class="btn ghost" data-act="close">Cancelar</button></div>');return}
 var u=(document.getElementById('cl-vid')||{value:''}).value.trim(),id=ytId(u),er=document.getElementById('err');if(!id){if(er)er.textContent='Ese enlace no es de un video de YouTube. Cópialo desde el botón «Compartir» de YouTube.';return}
 s.vid=id;if(/shorts\//.test(u))s.vv=true;else delete s.vv;save();closeModal(1);var y=scrollY;render(true);scrollTo(0,y);toast('Video agregado')},true);
document.head.insertAdjacentHTML('beforeend','<style id="v403-css">.clug{margin:18px 0 6px}.clh{display:flex;align-items:baseline;justify-content:space-between;gap:10px}.clh .ptitle{margin:0}.clh>span{color:var(--color-pewter,#6e6e73);font-size:14px}.clug>.muted{margin:6px 0 0}'+
 '.clr{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:10px 2px 8px;-webkit-overflow-scrolling:touch}.clt{position:relative;flex:none;width:clamp(120px,36vw,170px);aspect-ratio:3/4;scroll-snap-align:start;background:#e9e9ee}'+
 '.clz{display:block;width:100%;height:100%;padding:0;border:0;background:none;cursor:zoom-in}.clz img{width:100%;height:100%;object-fit:cover;display:block}.clt.v .clz img{object-fit:cover}'+
 '.clp{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none}.clp svg{width:52px;height:52px;padding:12px;background:#000000a6;fill:#fff;border-radius:50%}'+
 '.clx{position:absolute;top:6px;right:6px;width:32px;height:32px;border:0;background:#000000b3;color:#fff;font-size:15px;cursor:pointer}'+
 '.cla{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:10px;border:2px dashed #0071e3;background:#eef4ff;color:#0071e3;font:inherit;font-weight:700;font-size:14px;text-align:center;cursor:pointer}.cla svg{width:30px;height:30px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.cla small{font-weight:500;color:#6e6e73}.cla.lock{border-color:#c7c7cc;background:#f5f5f7;color:#1d1d1f}.cla.busy{opacity:.55;pointer-events:none}'+
 'html.dark .clt{background:#2c2c2e}html.dark .cla{background:#0a2540!important;color:#64a8ff!important;border-color:#0a84ff!important}html.dark .cla.lock{background:#2c2c2e!important;color:#f5f5f7!important;border-color:#48484a!important}html.dark .cla small{color:#aeaeb2}'+
 '.clt,.clx,.cla,.clp svg{border-radius:0!important}.clp svg{border-radius:50%!important}'+
 /* dentro de la tienda: SOS solo con el ícono (más pequeño) y espacio abajo para que los botones flotantes no tapen el final */
 'body.instore .emgfab{width:48px;height:48px;padding:0;justify-content:center;gap:0}body.instore .emgfab>span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}body.instore .emgfab svg{width:26px;height:26px}body.instore #app{padding-bottom:calc(200px + env(safe-area-inset-bottom))}</style>');
})();
