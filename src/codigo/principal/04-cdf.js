let cdF={s:'',u:'',q:''};
const cdSt=x=>!x.used?'new':(Number(x.end)||((Number(x.usedAt)||0)+(Number(x.days)||0)*864e5))>Date.now()?'act':'exp';
const cdOrig=x=>x.why==='gratis'?'Gratis (al instante)':x.pago?'Pago en la página':x.why?codeWhyN(x.why).replace(/^\S+\s/,''):'Venta normal';
const cdWho=x=>{const P=QH.plans(),a=x.usedBy&&P.find(p=>p.k===x.usedBy),b=x.uid&&P.find(p=>p.uid===x.uid);return (a||b||{}).name||''};
function cdList(){const q=norm(cdF.q||'').trim().replace(/-/g,'');return QH.codes().filter(x=>{const s=cdSt(x);if(cdF.u&&x.use!==cdF.u)return false;
 if(cdF.s==='new'||cdF.s==='act'||cdF.s==='exp'){if(s!==cdF.s)return false}else if(cdF.s==='gratis'){if(x.why!=='gratis')return false}else if(cdF.s==='gift'){if(!codeGift(x.why))return false}else if(cdF.s==='sold'){if(x.why==='gratis'||codeGift(x.why)||x.why==='vul')return false}
 return !q||norm(x.c+' '+cdWho(x)+' '+cdOrig(x)).includes(q)})}
function cdTable(){const L=cdList(),fd2=t=>new Date(t).toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'}),SN={new:'Sin usar',act:'Activo',exp:'Vencido'};
 if(!L.length)return `<p class="muted">${QH.codes().length?'Ningún código coincide con el filtro.':'Aún no hay códigos.'}</p>`;
 return `<p class="muted cdc">${L.length} ${L.length===1?'código':'códigos'}</p><div class="cdw"><table class="qct cdtb"><thead><tr><th>Código</th><th>Rol</th><th>Origen</th><th>Estado</th><th>Persona</th><th>Vence</th><th></th></tr></thead><tbody>${L.map(x=>{const s=cdSt(x),e=x.used?(Number(x.end)||((Number(x.usedAt)||0)+(Number(x.days)||0)*864e5)):0,r=USES[x.use]||COMU[x.use]||{},w=cdWho(x);
  return `<tr class="cd-${s}"><td data-l="Código"><code>${esc(codeFmt(x.c))}</code><small>Creado ${esc(fd2(x.ts||0))}</small></td><td data-l="Rol">${esc(r.n||x.use)}<small>${COMU[x.use]?COM_DAYS[x.use]+' días':codeMn(x.months)}</small></td><td data-l="Origen">${esc(cdOrig(x))}</td><td data-l="Estado"><span class="cds ${s}">${SN[s]}</span>${x.used?`<small>Usado el ${esc(fd2(x.usedAt||0))}</small>`:''}</td><td data-l="Persona">${w?esc(w):'—'}${!x.used&&x.uid?'<small>Reservado para esta persona</small>':''}</td><td data-l="Vence">${e?esc(fd2(e))+`<small>${e>Date.now()?'Faltan '+Math.ceil((e-Date.now())/864e5)+' días':'Vencido'}</small>`:'—'}</td><td class="cda"><button class="btn ghost" data-act="codeCp" data-c="${esc(x.c)}">Copiar</button>${x.used?'':`<button class="btn ghost" data-act="codeDel" data-c="${esc(x.c)}">Eliminar</button>`}</td></tr>`}).join('')}</tbody></table></div>`}
document.addEventListener('input',e=>{if(e.target.id!=='cdf-q')return;cdF.q=e.target.value;const t=$('#cdt');if(t)t.innerHTML=cdTable()});
document.addEventListener('change',e=>{const id=e.target.id;if(id!=='cdf-u'&&id!=='cdf-s')return;cdF[id==='cdf-u'?'u':'s']=e.target.value;const t=$('#cdt');if(t)t.innerHTML=cdTable();document.querySelectorAll('.cdsum .cdt').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===cdF.s)))});
const sortL=l=>sortBy==='rate'?l.slice().sort((a,b)=>avg(b.rates)-avg(a.rates)||(b.rates||[]).length-(a.rates||[]).length):sortBy==='az'?l.slice().sort((a,b)=>a.name.localeCompare(b.name,'es')):featFirst(l);
const isFav=(k,id)=>S.favs.includes(k+':'+id);
/* v84: lista de favoritos del usuario (tiendas, productos, servicios y anuncios) para "Mis favoritos" en el panel */
const favRows=()=>S.favs.map(f=>{const i=f.indexOf(':'),k=f.slice(0,i),id=f.slice(i+1);let t='',sub='',u='';
if(k==='store'){const s=S.stores.find(x=>x.id===id);if(!s)return null;t=s.name;sub='Tienda · '+s.cat;u=storeUrl(id)}
else if(k==='prod'){const [sid,pid]=id.split('__'),s=S.stores.find(x=>x.id===sid),p=s&&s.products.find(x=>x.id===pid);if(!p)return null;t=p.name;sub='Producto · '+s.name+' · '+money(p.price);u=prodUrl(sid,pid)}
else if(k==='serv'){const x=S.services.find(y=>y.id===id);if(!x)return null;t=x.name;sub='Servicio · '+(x.job||'');u=BASE_URL+'#/servicios'}
else if(k==='ad'){const a=S.ads.find(y=>y.id===id);if(!a)return null;t=a.title;sub=((ADT[a.type]||{}).one||'Anuncio');u=adUrl(id)}
else return null;return {k,id,t,sub,u}}).filter(Boolean);
const need=f=>{if(S.user)f();else{after=f;loginForm()}};
const zonesOf=l=>[...new Set(l.map(x=>(x.zone||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
const toolsHTML=k=>`<div class="tools"><label for="t-sort">Ordenar</label><select id="t-sort" data-sel="sort"><option value="">Más recientes</option><option value="rate"${sortBy==='rate'?' selected':''}>Mejor calificadas</option><option value="az"${sortBy==='az'?' selected':''}>A – Z</option></select><label for="t-zone">Barrio</label><select id="t-zone" data-sel="zone"><option value="">Todos</option>${znOpts(zonesOf(k==='store'?S.stores:S.services),zoneF)}</select><button class="chip" data-act="favf" aria-pressed="${favOnly}">Solo favoritos</button></div>`;
const storeUrl=id=>BASE_URL+'?tienda='+stRefId(id);/* v300: sin «#» *//* v297: con el nombre de la tienda */const cardUrl=id=>BASE_URL+'#/n/'+encodeURIComponent(id);
const adUrl=id=>BASE_URL+'#/a/'+encodeURIComponent(id);
const pCode=p=>'QHP-'+String(p.id).toUpperCase();
const prodUrl=(sid,pid,v,t)=>BASE_URL+'?producto='+stRefId(sid)+'/'+encodeURIComponent(pid)+(v?'&v='+v:'')+(t?'&talla='+encodeURIComponent(t):'');/* v300: sin «#» (el color va en v y la talla en talla) *//* v296: el enlace lleva el color (v) y la talla (t) */
/* ---- v9: paginación, vencimiento de anuncios, avisos y textos legales ---- */
const PAGE=12,AD_DAYS=60,AD_MS=AD_DAYS*864e5;let lim=PAGE,limKey='';
const site=()=>S.site||{};
const saveCats=()=>{S.cats=CATS.map(c=>c.slice());save()};
/* v34: iconos de categorías y carrusel de publicidad */
const CAT_EM={Ropa:'👕',Tecnología:'📱',Cocina:'🍳',Hogar:'🛋️',Belleza:'💄',Juguetes:'🧸',Comida:'🍔',Deportes:'⚽',Otros:'🛍️'};
const catIcon=c=>{const i=c[1]||'';return /^data:image\/[a-z]+;base64,[A-Za-z0-9+\/=]+$/.test(i)?`<img src="${i}" alt="" loading="lazy">`:esc(i||CAT_EM[c[0]]||'🏷️')};
/* v56: página "Todas las categorías" (botón Más). Servicios va primero para que quede visible */
/* v68: solo se muestran las categorías que alguna tienda eligió al crearse */
const usedCats=()=>new Set(S.stores.filter(vis).map(s=>s.cat));
const CATPG=[['Alquiler de artículos','🎪','#0E7490'],['Ferretería','🔧','#B45309'],['Muebles y decoración','🛋️','#9A3412'],['Moda y accesorios','👗','#BE185D'],['Accesorios vehículos','🚗','#1E4FBF'],['Deporte y fitness','🏋️','#15803D'],['Tecnología','💻','#1F6F8B'],['Oficina y papelería','📎','#6D28D9'],['Videojuegos','🎮','#4338CA'],['Juegos y juguetes','🧸','#C2410C'],['Abarrotes','🛒','#2E7D5B'],['Bebés','🍼','#DB2777'],['Mascotas','🐶','#A0551A'],['Instrumentos musicales','🎸','#7C2D12'],['Joyas y relojes','💍','#A16207'],['Cacharrerías','🧰','#475569'],['Belleza y salud','💄','#BE123C'],['Licores','🍷','#8A4B1A'],['Calzado','👟','#4D7C0F'],['Libros y revistas','📚','#6D28D9'],['Floristería y regalos','💐','#BE185D'],['Panadería y pastelería','🥐','#B45309'],['Jardinería y agro','🌱','#15803D'],['Fiestas y eventos','🎉','#9F1239']];
const catsView=()=>`${menuBar()}<section class="cpg"><div class="shead"><h2>Categorías</h2><button class="btn ghost" data-act="home">← Volver</button></div><div class="cplist" role="list">${catGroupedHTML(CATS.filter(c=>usedCats().has(c[0])),c=>`<button class="cpi" role="listitem" data-act="catPg" data-v="${esc(c[0])}" data-g="${c[3]||''}" style="--c:${c[2]}"><span class="cico">${catIcon(c)}</span><span>${esc(c[0])}</span></button>`)/* v215: desde CATS y agrupadas */||'<p class="muted">Aún no hay tiendas con categoría.</p>'}</div></section>`;
/* v38: 6 categorías principales (iconos de las capturas) + 3 accesos pequeños */
[['Droguerías','#1E6FBF'],['Restaurantes','#B23A2E'],['Licoreras','#8A4B1A'],['Electrodomésticos','#2B3A55'],['Ropa y calzado','#4A4A6A'],['Celulares y computadores','#C0392B']]/* v215: nombres nuevos */.forEach(x=>{if(!CATS.some(c=>c[0]===x[0]))CATS.push([x[0],'',x[1]])});
const MAIN_X=['Droguerías','Restaurantes','Mercado','Licoreras','Mascota',...PELU];/* v215: nombres nuevos */
/* v47: carrusel deslizable de categorías (imágenes de las capturas) + botón Más */
const MLIMG={"inmuebles":"img/cat-inmuebles.webp", "farmacia":"img/cat-farmacia.webp", "electrodomesticos":"img/cat-electrodomesticos.webp", "restaurantes":"img/cat-restaurantes.webp", "moda":"img/cat-moda.webp", "vehiculos":"img/cat-vehiculos.webp", "celulares":"img/cat-celulares.webp", "computacion":"img/cat-computacion.webp", "hogar":"img/cat-hogar.webp"};
