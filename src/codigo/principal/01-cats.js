
const CATS=[['Farmacia','','#1E6FBF'],['Electrodomésticos','','#2B3A55'],['Restaurantes','','#B23A2E'],['Ropa','','#4A4A6A'],['Celulares','','#C0392B'],['Computación','','#1F6F8B'],['Hogar','','#2E7D5B'],['Alquiler de artículos','🎪','#0E7490'],['Ferretería','🔧','#B45309'],['Muebles y decoración','🛋️','#9A3412'],['Moda y accesorios','👗','#BE185D'],['Accesorios vehículos','🚗','#1E4FBF'],['Deporte y fitness','🏋️','#15803D'],['Tecnología','💻','#1F6F8B'],['Oficina y papelería','📎','#6D28D9'],['Videojuegos','🎮','#4338CA'],['Juegos y juguetes','🧸','#C2410C'],['Abarrotes','🛒','#2E7D5B'],['Bebés','🍼','#DB2777'],['Mascotas','🐶','#A0551A'],['Instrumentos musicales','🎸','#7C2D12'],['Joyas y relojes','💍','#A16207'],['Cacharrerías','🧰','#475569'],['Belleza y salud','💄','#BE123C'],['Licores','🍷','#8A4B1A'],['Calzado','👟','#4D7C0F'],['Libros y revistas','📚','#6D28D9'],['Floristería y regalos','💐','#BE185D'],['Panadería y pastelería','🥐','#B45309'],['Jardinería y agro','🌱','#15803D'],['Fiestas y eventos','🎉','#9F1239']];
const OFICIOS=['Niñera','Cuidador de ancianos','Aseadora','Carpintero','Plomero o fontanero','Electricista','Pintor','Jardinero','Mecánico','Servicios especializados','Otro'];const DEFJOBS=OFICIOS.filter(o=>o!=='Otro');let newCatImg='';
function applyJobs(){const j=(typeof S!=='undefined'&&S&&S.site&&Array.isArray(S.site.jobs))?S.site.jobs:DEFJOBS;OFICIOS.length=0;j.filter(x=>x&&x!=='Otro').slice().sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'})).forEach(x=>OFICIOS.push(x));OFICIOS.push('Otro')}
const VT=['Carro','Moto','Bicicleta','Otro'],FU=['Eléctrico','Gasolina','Diésel','Otro'];
const LISTING=['Arriendos','Venta de casas','Venta de vehículos'];
const COMIDAS=['Restaurantes','Comidas rápidas','Panaderías y pastelerías','Comida','Panadería y pastelería']/* v215: antes solo Restaurantes; Comida y Panadería quedaban fuera de "Comidas" */;let kf='';
/* v144: categoria principal Peluquerias = Barberias (hombres), Salones de belleza (mujeres), Peluquerias unisex */
const PELU=['Barberías','Salones de belleza','Peluquerías unisex'],PELU_C=[['Barberías','💈','#0F766E'],['Salones de belleza','💇‍♀️','#DB2777'],['Peluquerías unisex','✂️','#7C3AED']];
const ensurePelu=()=>{PELU_C.forEach(x=>{if(!CATS.some(c=>c[0]===x[0])){const k=CATS.findIndex(c=>c[0]==='Otros');if(k>=0)CATS.splice(k,0,x.slice());else CATS.push(x.slice())}})};ensurePelu();
/* v192: sanea las categorías que llegan de Firestore o del almacenamiento local (nombre, ícono y color) antes de pintarlas */
const catClean=a=>{const n=String(a[0]).replace(/[<>"`]/g,'').trim().slice(0,40),i=typeof a[1]==='string'?a[1]:'',ic=/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+\/=]+$/.test(i)?i:(i.length<=8&&!/[<>"'`&]/.test(i)?i:''),co=typeof a[2]==='string'&&/^#[0-9a-fA-F]{6}$/.test(a[2])?a[2]:'#5B6475';return[n,ic,co]};
const catOf=n=>CATS.find(c=>c[0]===n)||CATS[CATS.length-1];
/* ===== v51: UN SOLO ARCHIVO con 3 modos =====
   · index.html            → página pública
   · index.html?panel      → panel de vendedores
   · index.html?admin=CLAVE → administrador (link exclusivo: solo se abre con la clave correcta; aquí solo se guarda su huella SHA-256) */
const sha256=(()=>{const K=[],H0=[];let n=2,c=0;const fr=x=>(x-Math.floor(x))*4294967296|0;
for(;c<64;n++){let p=1;for(let i=2;i*i<=n;i++)if(n%i===0){p=0;break}if(p){if(c<8)H0[c]=fr(Math.sqrt(n));K[c++]=fr(Math.cbrt(n))}}
return s=>{const b=unescape(encodeURIComponent(s)),l=b.length,N=(((l+8)>>6)+1)*16,w=new Array(N).fill(0);for(let i=0;i<l;i++)w[i>>2]|=b.charCodeAt(i)<<(24-(i%4)*8);w[l>>2]|=0x80<<(24-(l%4)*8);w[N-1]=l*8;const H=H0.slice();
for(let j=0;j<N;j+=16){const x=w.slice(j,j+16),a=H.slice();for(let i=0;i<64;i++){if(i>=16){const g=x[i-15],h=x[i-2];x[i]=(x[i-16]+(((g>>>7)|(g<<25))^((g>>>18)|(g<<14))^(g>>>3))+x[i-7]+(((h>>>17)|(h<<15))^((h>>>19)|(h<<13))^(h>>>10)))|0}
const e=a[4],t1=(a[7]+(((e>>>6)|(e<<26))^((e>>>11)|(e<<21))^((e>>>25)|(e<<7)))+((e&a[5])^(~e&a[6]))+K[i]+x[i])|0,A=a[0],t2=((((A>>>2)|(A<<30))^((A>>>13)|(A<<19))^((A>>>22)|(A<<10)))+((A&a[1])^(A&a[2])^(a[1]&a[2])))|0;a.pop();a.unshift((t1+t2)|0);a[4]=(a[4]+t1)|0}
for(let i=0;i<8;i++)H[i]=(H[i]+a[i])|0}return H.map(v=>(v>>>0).toString(16).padStart(8,'0')).join('')}})();
const ADMIN_HASH='ea3226a18acc09cdb002e13dbbcc84d6a645dfdcb332f6c09f12fffb00a7a766';
const ADMIN_UID='KUowZZ25CePVc9IXGmhCLVbbSIB3';/* v175: mismo UID que isAdmin() en las reglas; solo la cuenta del administrador entra al panel admin */
const MODE=(()=>{try{const q=new URLSearchParams(location.search),k=q.get('admin');if(k&&sha256(k)===ADMIN_HASH)return'admin';if(q.has('panel'))return'panel'}catch(e){}return'index'})();
const KEY='pradereando_v1',LKEY='pradereando_loc1',TITLE=MODE==='admin'?'Administrador – Mi Pradera':MODE==='panel'?'Mi cuenta – Mi Pradera':'Mi Pradera – Lo nuestro, en un solo lugar';
const BASE_URL=location.href.split('#')[0].split('?')[0],PANEL_URL=BASE_URL+'?panel';
if(MODE!=='index')document.title=TITLE;
if(MODE!=='index'){try{document.head.insertAdjacentHTML('beforeend','<meta name="robots" content="noindex,nofollow">')}catch(e){}}
const SEED=[
 {id:'s1',name:'Moda Pradera',cat:'Ropa',owner:'Lucía',wa:'',emoji:'👗',desc:'Ropa fresca para el clima de la tierra caliente.',products:[{id:'p1',name:'Camisa de lino',price:65000,emoji:'👕'},{id:'p2',name:'Sombrero vueltiao',price:90000,emoji:'👒'}]},
 {id:'s2',name:'Techno Valle',cat:'Tecnología',owner:'Andrés',wa:'',emoji:'🎧',desc:'Accesorios y gadgets para tu celular.',products:[{id:'p3',name:'Audífonos bluetooth',price:78000,emoji:'🎧'},{id:'p4',name:'Cargador rápido',price:35000,emoji:'🔌'}]},
 {id:'s3',name:'Sazón de Casa',cat:'Cocina',owner:'Doña Marta',wa:'',emoji:'🍳',desc:'Todo para que tu cocina huela a domingo.',products:[{id:'p5',name:'Olla arrocera',price:120000,emoji:'🍲'},{id:'p6',name:'Set de cuchillos',price:54000,emoji:'🔪'}]},
 {id:'s4',name:'Hogar Dulce Hogar',cat:'Hogar',owner:'Carlos',wa:'',emoji:'🛋️',desc:'Detalles que convierten tu casa en un hogar.',products:[{id:'p7',name:'Cojín tropical',price:28000,emoji:'🛋️'},{id:'p8',name:'Matera de barro',price:18000,emoji:'🪴'}]}
];
let S={stores:[],cart:{},mine:[],services:[],myServ:[]},view='home',cur=null,cat='',query='',vt='',fu='',sj='',sortBy='',zoneF='',favOnly=false,adm=false,at='rep',after=null,adF={},curAd='',curU='',sm='dom',curP='',pI=0,pQ=1,curN='',NW=false,nwf={id:'',img:''};
try{const d=JSON.parse(localStorage.getItem(LKEY));if(d){S.cart=d.cart||{};S.favs=d.favs||[];S.user=d.user||null;S.myIdeas=d.myIdeas||[]}}catch(e){}
S.services=S.services||[];S.myServ=S.myServ||[];S.ideas=S.ideas||[];S.myIdeas=S.myIdeas||[];S.reports=S.reports||[];S.favs=S.favs||[];S.user=S.user||null;S.pin=S.pin||'';S.ads=S.ads||[];S.myAds=S.myAds||[];S.site=S.site||{name:'',wa:'',mail:''};applyJobs();if(Array.isArray(S.cats)&&S.cats.length&&S.catsV===62){CATS.length=0;S.cats.filter(c=>Array.isArray(c)&&typeof c[0]==='string').map(catClean).filter(c=>c[0]).forEach(c=>CATS.push(c))}else{S.cats=CATS.map(c=>c.slice());S.catsV=62}ensurePelu();catMigrate();/* v215 */(S.stores||[]).forEach(s=>{if(s.cat==='Moda')s.cat='Ropa'});
const save=()=>{try{localStorage.setItem(LKEY,JSON.stringify({cart:S.cart,favs:S.favs,user:S.user,myIdeas:S.myIdeas}))}catch(e){toast('No se pudo guardar en este dispositivo')}QH.push()};
/* ===== v74: base de datos compartida (Firestore) — la usan los 3 modos (público, panel y admin) ===== */
const QH=(function(){
 /* Configuración del proyecto Firebase (qhep-b812f) */
 const CFG={apiKey:"AIzaSyAeKBOFG5nBIfL1tJoLW4JiKmzySiEoNAg",authDomain:"qhep-b812f.firebaseapp.com",projectId:"qhep-b812f",storageBucket:"qhep-b812f.firebasestorage.app",messagingSenderId:"799855828473",appId:"1:799855828473:web:ce1060358a18820dbbb128"};
 const COLS=['stores','products','services','ads','ideas','banners','topAds','cats','meta'];
 const RATED=['stores','products','services','ads'];
 let db=null,auth=null,ready=false,failed=false,authP=Promise.resolve(),repL=false,busy=false,again=false,rt=0;
 const RAW={},LAST={},BAD={};
 const sj=o=>JSON.stringify(o,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.keys(v).sort().reduce((r,x)=>(r[x]=v[x],r),{}):v);
 const clean=o=>JSON.parse(JSON.stringify(o));
 const slug=n=>String(n).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'x';
 const waKey=w=>sha256('wa:'+String(w||'').replace(/\D/g,'').slice(-10));
 const key=()=>{const u=S.user;if(!u)return'';if(!u.k)u.k=u.email?sha256('mail:'+u.email.toLowerCase()):u.wa?waKey(u.wa):''/* v371: con correo, la ficha siempre va por el correo (antes, entrar con Google creaba otra ficha por el celular) */;return u.k};
 /* ---- lo que la app tiene ahora, en forma de documentos ---- */
 function want(){const k=key(),D={};['stores','products','services','ads','ideas','reports','banners','topAds','cats','meta'].forEach(c=>D[c]={});
  const ord=o=>{if(!o._o)o._o=Date.now()};
  const uid0=(()=>{const u=auth&&auth.currentUser,e=S.user&&String(S.user.email||'').toLowerCase();return u&&!u.isAnonymous&&e&&String(u.email||'').toLowerCase()===e?u.uid:''})();
  const own=(o,mine)=>{if(MODE==='panel'&&k&&!o.ownerKey&&mine.includes(o.id))o.ownerKey=k;if(uid0&&k&&o.ownerKey===k&&o.ownerUid!==uid0)o.ownerUid=uid0};/* v102: ownerUid solo con sesion real del mismo correo; v285: tambien si la cuenta interna cambio (antes la tienda quedaba bloqueada; requiere reglas v37) */
  S.stores.forEach(s=>{own(s,S.mine);ord(s);const d=clean(s);delete d.products;D.stores[s.id]=d;(s.products||[]).forEach(p=>{ord(p);const q=clean(p);q.sid=s.id;if(s.ownerKey)q.ownerKey=s.ownerKey;if(s.ownerUid)q.ownerUid=s.ownerUid;D.products[s.id+'__'+p.id]=q})});
  S.services.forEach(x=>{own(x,S.myServ);ord(x);D.services[x.id]=clean(x)});
  S.ads.forEach(x=>{own(x,S.myAds);ord(x);D.ads[x.id]=clean(x)});
  S.ideas.forEach(x=>{if(!x.ownerKey)x.ownerKey=DEV;if(!x.uid&&x.ownerKey===DEV&&auth&&auth.currentUser)x.uid=auth.currentUser.uid;ord(x);D.ideas[x.id]=clean(x)});
  (S.reports||[]).forEach(x=>{ord(x);D.reports[x.id]=clean(x)});
  (S.banners||[]).forEach((x,i)=>{x._o=i;D.banners[x.id]=clean(x)});
  (S.topAds||[]).forEach((x,i)=>{x._o=i;D.topAds[x.id]=clean(x)});
  CATS.forEach((c,i)=>{const id=slug(c[0]);D.cats[id]={id,a:c.slice(),_o:i}});
  D.meta.site=clean(S.site||{});
  return D}
 /* ---- qué puede escribir cada archivo ---- */
 function how(c,nd,od){const k=key();
  if(MODE==='admin')return adm?'set':null;/* v336: sin la sesión de administrador no se intenta guardar (lo pendiente se guarda al entrar) */
  if(MODE==='panel'){
   if(c==='stores'||c==='products'||c==='services'||c==='ads'){const o=(nd||od).ownerKey;return k&&o===k&&(!od||!nd||od.ownerKey===k)?'set':null}
   if(c==='cats')return nd&&!od?'set':null;
   return null}
  if(RATED.includes(c))return nd&&od&&sj(nd.rates||[])!==sj(od.rates||[])?'rates':null;
  if(c==='ideas')return nd&&!od?'set':(!nd&&od&&od.ownerKey===DEV?'set':null);
  if(c==='reports')return nd&&!od?'set':null;
  return null}
 const ref=(c,id)=>db.collection(c).doc(id);
 async function rates(c,id,nd){const r=ref(c,id),mine=(nd.rates||[]).filter(isMyRate)[0];
  /* v150: las reglas v12 solo permiten quitar O agregar UNA calificacion por escritura: editar = quitar y luego agregar */
  await db.runTransaction(async t=>{const s=await t.get(r);if(!s.exists)return;const cur=s.data().rates||[],i=cur.findIndex(isMyRate);if(i<0)return;const rm=cur[i],cu=s.data().rU||[];t.update(r,{rates:cur.filter((x,j)=>j!==i),rRm:rm,rU:rm.a?cu.filter(x=>x!==rm.a):cu})});
  if(mine)await db.runTransaction(async t=>{const s=await t.get(r);if(!s.exists)return;const d=s.data();t.update(r,{rates:(d.rates||[]).concat([mine]),rU:(d.rU||[]).concat([myUid()])})})}
 async function flush(){const D=want();
  for(const c in D){const L=LAST[c]||(LAST[c]={}),cur=D[c];
   for(const id in cur){const nd=cur[id],j=sj(nd),old=L[id];if(old&&old.j===j)continue;
    const m=how(c,nd,old&&old.d);if(!m)continue;
    if(j.length>900000){if(BAD[c+id]!==j){BAD[c+id]=j;toast('Esa publicación pesa demasiado (fotos). Quita o reduce fotos e inténtalo de nuevo.')}continue}
    if(m==='rates')await rates(c,id,nd);else await ref(c,id).set(nd);
    if(old&&old.d)r2q(old.d);L[id]={j,d:nd}}
   for(const id of Object.keys(L)){if(id in cur)continue;if(how(c,null,L[id].d)){await ref(c,id).delete();r2q(L[id].d);delete L[id]}}}r2gc([D,COM,NEWS])}
 async function push(){if(!ready)return;if(busy){again=true;return}busy=true;
  try{await authP;do{again=false;await flush()}while(again)}catch(e){wfail(e)}busy=false}
 function wfail(e){const c=(e&&e.code)||'';toast(c==='permission-denied'?'No tienes permiso para guardar ese cambio.':'No se pudo guardar ('+(c||'sin conexión')+'). Revisa tu internet.');rebuild();render(true)}
 /* ---- lo que llega de Firestore ---- */
 function rebuild(){
  const g=(c,asc)=>Object.values(RAW[c]||{}).map(clean).map(o=>typeof docFix==='function'?docFix(c,o):o)/* v413 */.sort((a,b)=>asc?(a._o||0)-(b._o||0):(b._o||0)-(a._o||0));
  const pr={};g('products',1).forEach(p=>(pr[p.sid]=pr[p.sid]||[]).push(p));
  S.stores=g('stores').map(s=>(s.products=pr[s.id]||[],s));
  if(MODE!=='admin'){const k0=key();S.stores.forEach(s=>{if(k0&&s.ownerKey===k0)return;if(!shopLive(s)){s._off=1;s.products=[];delete s.cover}})}/* v259: plan vencido: solo el registro básico a la vista (el dueño y el admin ven todo) */
  S.services=g('services');S.ads=g('ads');S.ideas=g('ideas',1);
  if(MODE==='admin')S.reports=g('reports',1);
  S.banners=g('banners',1);S.topAds=g('topAds',1);
  const cs=g('cats',1).filter(x=>Array.isArray(x.a)&&x.a.length&&typeof x.a[0]==='string');if(cs.length){const o=cs.filter(x=>x.a[0]==='Otros'),r=cs.filter(x=>x.a[0]!=='Otros');CATS.length=0;r.concat(o).map(x=>catClean(x.a)).filter(c=>c[0]).forEach(c=>{CATS.push(c)});ensurePelu();catMigrate();/* v215 */S.cats=CATS.map(c=>c.slice())}
  const m=(RAW.meta||{}).site;if(m){S.site=clean(m);applyJobs();splCache();applyLook()}
  derive();presBeat()}
 function derive(){if(MODE==='index'){planListen();return}if(MODE!=='panel')return;const k=key(),m=l=>k?l.filter(o=>o.ownerKey===k).map(o=>o.id):[];S.mine=m(S.stores);S.myServ=m(S.services);S.myAds=m(S.ads);planListen();autoFeat()}
 function same(c){const D=want()[c]||{},R=RAW[c]||{},a=Object.keys(D),b=Object.keys(R);if(a.length!==b.length)return false;return a.every(id=>R[id]&&sj(D[id])===sj(R[id]))}
 function sched(){clearTimeout(rt);rt=setTimeout(()=>{if($('#ov')||$('#lb'))return;const f=document.activeElement;if(f&&/^(INPUT|TEXTAREA|SELECT)$/.test(f.tagName))return;render(true)},400)}
 function listen(c,done){let first=true;return db.collection(c).onSnapshot(snap=>{
   const o={},L={};snap.forEach(d=>{const x=d.data();o[d.id]=x;L[d.id]={j:sj(x),d:x}});RAW[c]=o;LAST[c]=L;
   if(first){first=false;done();return}
   if(ready&&!same(c)){rebuild();sched()}
  },e=>{if(!ready)fail(e);else if(c==='reports'){repL=false}else if(c==='plans'){plL=false/* v336: se vuelve a escuchar al entrar */}else if(!(e&&e.code==='permission-denied'))wfail(e)/* v336: una lectura negada no es «guardar» */})}
 function fail(e){failed=true;hideSplash();const c=(e&&e.code)||'';
  $('#app').innerHTML=`<div class="cg"><h2>No pudimos conectar con la base de datos</h2><p class="muted">${esc(c==='permission-denied'?'Faltan publicar las reglas de seguridad de Firestore (ver LEEME).':c==='timeout'||c==='unavailable'?'Revisa tu conexión a internet e inténtalo de nuevo.':'Ocurrió un error ('+(c||e)+').')}</p><button class="btn pink" onclick="location.reload()">Reintentar</button></div>`}
 let plL=false;
 function plansListen(){if(MODE!=='admin'||plL||!adm||!ready)return;plL=true;listen('plans',()=>{if(view==='admin'&&!$('#ov'))render(true)})}
 const planSet=(k,patch)=>ref('plans',k).set(patch,{merge:true}).catch(wfail);
 const planDel=k=>{try{if(typeof window.planDelExt==='function')window.planDelExt(k)}catch(e){}/* v389: v371 libera el celular */return ref('plans',k).delete().catch(wfail)};
 const plans=()=>Object.values(RAW.plans||{});
 /* v103: codigos de acceso (coleccion codes/<CODIGO de 12 caracteres>); el admin los crea, el usuario los canjea */
 const codes=()=>Object.values(RAW.codes||{}).sort((a,b)=>(b.ts||0)-(a.ts||0));
 let cdL=false;function codesListen(){if(MODE!=='admin'||cdL||!adm||!ready)return;cdL=true;db.collection('codes').onSnapshot(snap=>{const o={};snap.forEach(d=>{o[d.id]=d.data()});RAW.codes=o;if(view==='admin'&&at==='cod'&&!$('#ov'))render(true)},e=>{cdL=false})}
 async function codeGen(use,months,n,why){await authP;const AL='ABCDEFGHJKMNPQRSTUVWXYZ23456789',out=[];
  for(let i=0;i<n;i++){const r=crypto.getRandomValues(new Uint32Array(12)),c=Array.from(r,x=>AL[x%AL.length]).join('');await ref('codes',c).set({c,use,months,days:COM_DAYS[use]||CODE_DAYS[months],used:false,ts:Date.now(),...(why?{why}:{})});out.push(c)}return out}
 const codeDel=c=>ref('codes',c).delete().catch(wfail);
 async function codeRedeem(raw,noEnd){/* v236: el código guarda su fecha de vencimiento (end); si las reglas aún no lo permiten, se canjea sin ella */const k=key(),c=String(raw||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(!k)throw{m:'Tu sesión no está activa. Entra de nuevo.'};if(c.length!==12)throw{m:'Escribe los 12 caracteres del código.'};
  await authP;const cr=ref('codes',c),pr=ref('plans',k);
  try{return await db.runTransaction(async t=>{const cs=await t.get(cr);if(!cs.exists)throw{m:'Código incorrecto.'};const cd=cs.data();if(cd.used)throw{m:'Ese código ya fue usado.'};
   const ps=await t.get(pr);if(!ps.exists)throw{m:'Tu cuenta aún no está lista. Inténtalo en unos segundos.'};
   const now=Date.now(),acc=Object.assign({},ps.data().acc||{}),end=Math.max(now,Number(acc[cd.use])||0)+cd.days*DAY;acc[cd.use]=end;
   /* v208: el rol Comerciante de 6 meses o más (6, 9 meses o 1 año) incluye destacado hasta el fin de ese acceso (acc.mercF) */
   const feat=cd.use==='merc'&&(Number(cd.months)||0)>=6;if(feat)acc.mercF=end;
   t.update(cr,noEnd?{used:true,usedBy:k,usedAt:now}:{used:true,usedBy:k,usedAt:now,end});t.update(pr,{acc,accCode:c});return{use:cd.use,end,feat}})}
  catch(e){if(e&&e.m)throw e;if(e&&e.code==='permission-denied'&&!noEnd)return codeRedeem(raw,true);throw{m:(e&&e.code==='permission-denied')?'No se pudo canjear. Avisa al administrador.':'No se pudo canjear ('+((e&&e.code)||'error')+'). Revisa tu internet.'}}}
 function repListen(){plansListen();codesListen();if(MODE!=='admin'||repL||!adm||!ready)return;repL=true;listen('reports',()=>{rebuild();render(true)})}
 /* ---- v52: dueños en línea (punto verde en el logo). Colección presence/<ownerKey> = {t: última señal}; en línea = señal de hace menos de 3,5 min ---- */
 const PRES={};let presOn=false,presLast=0;
 const online=k=>{const t=k&&PRES[k];return!!t&&Date.now()-t<330000};
 const presOwner=()=>{const k=key();return k&&MODE!=='admin'&&S.stores.some(s=>s.ownerKey===k)?k:''};
 async function presBeat(off){const k=presOwner(),now=Date.now();if(!ready||!k)return;if(off!==0&&(document.hidden||now-presLast<30000))return;presLast=now;PRES[k]=off===0?0:now;try{await authP;await ref('presence',k).set({t:off===0?0:now})}catch(e){}}
 async function presPoll(){if(!ready||document.hidden)return;try{await authP;const s=await db.collection('presence').where('t','>',Date.now()-330000).get(),n={};s.forEach(d=>{n[d.id]=(d.data()||{}).t||0});const a=Object.keys(PRES).filter(online).sort().join();Object.keys(PRES).forEach(x=>delete PRES[x]);Object.assign(PRES,n);if(Object.keys(n).sort().join()!==a)sched()}catch(e){}}
 function presInit(){if(presOn)return;presOn=true;presBeat();presPoll();setInterval(presBeat,120000);setInterval(presPoll,240000);document.addEventListener('visibilitychange',()=>{if(document.hidden)presBeat(0);else{presBeat();presPoll()}})}
 function start(cb){
  document.body.classList.add('m-'+MODE);{const sl=$('#splash .spl-logo');if(sl){let c={};try{c=JSON.parse(localStorage.getItem('qh_splash'))||{}}catch(e){}const dk=document.documentElement.classList.contains('dark'),v=(dk&&c.d)?c.d:c.s;if(v!=='none')sl.innerHTML='<img src="'+esc(v||LOGO)+'" alt="Mi Pradera">'}}$('#app').innerHTML='<div class="empty">Cargando…</div>';
  try{firebase.initializeApp(CFG);db=firebase.firestore();try{db.enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}auth=firebase.auth()}catch(e){return fail(e)}
  if(MODE==='panel'&&!S.user){const d=LEG();if(d&&d.user&&d.user.name){S.user=d.user;save()}}
  /* v143: cierre de sesion por inactividad (30 dias vendedores, 24 h administrador) */
  try{const IK='pradereando_last_'+MODE,L=+localStorage.getItem(IK)||0,N=Date.now();if(L&&N-L>(MODE==='admin'?18e5/* v222: 30 min (antes 24 h) */:2592e6)){if(MODE==='admin'){auth.signOut()}else if(S.user){S.user=null;auth.signOut();localStorage.setItem(LKEY,JSON.stringify({cart:S.cart,favs:S.favs,user:null,myIdeas:S.myIdeas}));setTimeout(()=>{try{toast('Tu sesión expiró por inactividad. Vuelve a entrar.')}catch(e){}},1500)}}localStorage.setItem(IK,N)}catch(e){}
  authP=new Promise(ok=>{auth.onAuthStateChanged(u=>{
   if(!u){auth.signInAnonymously().catch(()=>ok());return}
   if(MODE==='admin'){const a=!u.isAnonymous&&!!u.email&&u.uid===ADMIN_UID&&u.emailVerified!==false/* v398 */;if(a!==adm){adm=a;if(ready){closeModal();view='admin';render()}}if(a)repListen()}
   if(ready&&!u.isAnonymous)setTimeout(()=>{try{push()}catch(e){}},400);
   ok()})});
  let n=COLS.length;
  COLS.forEach(c=>listen(c,()=>{if(--n===0){ready=true;rebuild();cb();hideSplash();presInit();comListen();newsListen()}}));
  setTimeout(()=>{if(!ready&&!failed)fail({code:'timeout'})},15000)}
 /* ---- entradas de cada archivo ---- */
 function after(){if(MODE==='admin'){view='admin';render();if(!adm)admForm();else repListen()}else if(MODE==='panel'){const h0=window.QH_H0||location.hash;window.QH_H0='';/* v211: la dirección original (render() y route() la reescriben) */render();if(h0==='#/negocio'&&typeof qhBiz==='function')qhBiz()/* v253 */;else if(h0==='#/clasificado'){view='com';render();comForm()}/* v255 */else if(/^#\/crear\/\w+$/.test(h0)&&S.user&&typeof roleGo==='function')roleGo(h0.slice(8));/* v256 */else if(/^#\/publicar-(inmueble|vehiculo)$/.test(h0)&&typeof gdOpen==='function')gdOpen(h0==='#/publicar-vehiculo'?'veh':'inm')/* v308 */;else if(h0==='#/publicar'&&!/[?&]reg=1(&|$)/.test(location.search)){need(pubMenu)}else if(!S.user){if(/[?&]reg=1(&|$)/.test(location.search))regForm();else loginForm()}else if(h0==='#/accesos')codesModal();setTimeout(()=>{try{cmgPend()}catch(e){}},900)/* v256 */}}
 const go=f=>{if(MODE==='index'){location.href=PANEL_URL;return}if(MODE==='admin')return toast('Las publicaciones se crean desde el panel de vendedores');need(f)};
 function admForm(){modal(`<h2>Administrador</h2><p class="muted">Entra con el correo y la clave de administrador.</p><label for="a-em">Correo</label><input id="a-em" type="email" autocomplete="username"><label for="a-pw">Clave</label><input id="a-pw" type="password" autocomplete="current-password"><div class="err" id="err"></div><p class="muted" style="font-size:12px">Protegido por reCAPTCHA de Google: aplican su <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacidad</a> y sus <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Términos</a>.</p><div class="row" style="margin-top:8px"><button class="btn pink" data-act="admIn">Entrar</button><button class="btn ghost" data-act="close">Cancelar</button></div><p style="margin-top:10px"><button type="button" class="btn ghost" data-act="admReset">Olvidé mi clave</button></p>`);rcRender('rc-adm')}/* v397: botón «Olvidé mi clave» */
 async function admIn(){const em=$('#a-em').value.trim(),pw=$('#a-pw').value,err=$('#err');if(!em||!pw)return err.textContent='Escribe tu correo y tu clave.';
  try{await rcToken('rc-adm')}catch(e){return err.textContent='No se pudo verificar reCAPTCHA. Recarga la página e inténtalo de nuevo.'}
  try{const c=await auth.signInWithEmailAndPassword(em,pw);if(!c.user||c.user.uid!==ADMIN_UID){try{await auth.signOut()}catch(x){}adm=false;rcReset('rc-adm');err.textContent='Esta cuenta no es la del administrador.';return}if(!c.user.emailVerified){try{await c.user.sendEmailVerification()}catch(x){}try{await auth.signOut()}catch(x){}adm=false;rcReset('rc-adm');err.textContent='Tu correo de administrador aún no está verificado y sin eso Firebase no deja guardar cambios. Te enviamos un correo para verificarlo (revisa también spam): ábrelo y vuelve a entrar.';return}/* v398 */adm=true;closeModal();view='admin';render();repListen();toast('Bienvenido')}catch(e){rcReset('rc-adm');const k=e&&e.code||'';err.textContent=k==='auth/too-many-requests'?'Demasiados intentos. Espera unos minutos o usa «Olvidé mi clave».':k==='auth/user-disabled'?'Esta cuenta está deshabilitada en Firebase (Authentication → Usuarios).':k==='auth/network-request-failed'?'Sin conexión. Revisa tu internet.':/app-check|appCheck/i.test(k+' '+(e&&e.message||''))?'Firebase rechazó la verificación de la página (App Check). Revisa App Check en la consola de Firebase.':/invalid-credential|wrong-password|user-not-found|invalid-login|invalid-email/.test(k)?'Correo o clave incorrectos. Si no recuerdas la clave, usa «Olvidé mi clave».':'No se pudo entrar ('+(k||'error desconocido')+'). Inténtalo de nuevo.'}}/* v397: dice el motivo real */
 async function admReset(){const em=($('#a-em')||{value:''}).value.trim(),err=$('#err');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))return err.textContent='Escribe arriba el correo de administrador y vuelve a tocar «Olvidé mi clave».';
  err.textContent='Enviando…';try{await auth.sendPasswordResetEmail(em);err.textContent='Si ese correo es el del administrador, te llegó un mensaje de Firebase para crear una clave nueva. Revisa también la carpeta de spam.'}catch(e){const k=e&&e.code||'';err.textContent=k==='auth/too-many-requests'?'Demasiados intentos. Espera unos minutos.':k==='auth/network-request-failed'?'Sin conexión. Revisa tu internet.':'Si ese correo es el del administrador, te llegó un mensaje de Firebase para crear una clave nueva. Revisa también la carpeta de spam.'}}
 async function admOut(){try{await auth.signOut()}catch(e){}adm=false;repL=false;S.reports=[];view='admin';render();admForm()}
 /* ---- datos de la versión anterior (guardados solo en este dispositivo) ---- */
 const IMP='pradereando_imp1';
 function LEG(){try{const d=JSON.parse(localStorage.getItem(KEY));return d&&d.stores?d:null}catch(e){return null}}
 function legItems(all){const d=LEG();if(!d||localStorage.getItem(IMP))return null;const sd=new Set(SEED.map(s=>s.id)),k=key();
  if(!all&&!k)return null;
  const pick=(l,mine)=>(l||[]).map((o,i)=>[o,i]).filter(([o])=>all?!sd.has(o.id):(mine||[]).includes(o.id));
  return{d,sd,k,st:pick(d.stores,d.mine),sv:pick(d.services,d.myServ),ad:pick(d.ads,d.myAds)}}
 function legacyCard(){if(MODE==='index')return'';const it=legItems(MODE==='admin');if(!it)return'';const n=it.st.length+it.sv.length+it.ad.length;if(!n)return'';
  return `<div class="cg"><h3>Datos guardados antes de la actualización</h3><p class="muted">Encontramos ${n} publicación${n===1?'':'es'} guardada${n===1?'':'s'} solo en este dispositivo. Súbelas a la base de datos compartida para que todos las vean.</p><button class="btn pink" data-act="legImport">Importar ahora</button></div>`}
 async function importLegacy(){const all=MODE==='admin',it=legItems(all);if(!it)return;await authP;const{d,k}=it,base=Date.now();let n=0;
  const put=async(c,id,doc)=>{if((RAW[c]||{})[id])return;const x=clean(doc);if(sj(x).length>900000)return;await ref(c,id).set(x);n++};
  const okey=o=>all?(o.wa?waKey(o.wa):''):k;
  try{
   for(const[s,i]of it.st){const ok=okey(s),{products,...rest}=s;await put('stores',s.id,{...rest,ownerKey:ok,_o:base-i});const ps=products||[];for(let j=0;j<ps.length;j++)await put('products',s.id+'__'+ps[j].id,{...ps[j],sid:s.id,ownerKey:ok,_o:base+j})}
   for(const[x,i]of it.sv)await put('services',x.id,{...x,ownerKey:okey(x),_o:base-i});
   for(const[x,i]of it.ad)await put('ads',x.id,{...x,ownerKey:okey(x),_o:base-i});
   if(all){for(const[i,x]of(d.ideas||[]).entries())await put('ideas',x.id,{...x,ownerKey:'',_o:base+i});
    if(!(RAW.cats&&Object.keys(RAW.cats).length)&&Array.isArray(d.cats)&&d.catsV===62)for(const[i,c]of d.cats.entries())await put('cats',slug(c[0]),{id:slug(c[0]),a:c,_o:i});
    for(const[i,x]of(d.banners||[]).entries())await put('banners',x.id,{...x,_o:i});for(const[i,x]of(d.topAds||[]).entries())await put('topAds',x.id,{...x,_o:i});
    if(d.site&&(d.site.name||d.site.wa||d.site.mail)&&!(RAW.meta||{}).site)await put('meta','site',d.site)}
   localStorage.setItem(IMP,'1');toast(n?'Se importaron '+n+' elementos':'No había nada nuevo para importar');
  }catch(e){toast('No se pudo importar ('+((e&&e.code)||'error')+'). Se importó lo que alcanzó a subir.')}
  rebuild();render(true)}
 /* ---- v203: cuentas — un documento por usuario en plans/<ownerKey> (ya no hay planes: solo sus datos y sus accesos por código). Se crea solo la primera vez ---- */
 let planK='',planUn=null,acctBusy=false;
 async function acctEnsure(){const k=key(),u=S.user;if(!k||!u||acctBusy)return;if(u.pl)return planGone()/* v334: una cuenta que ya tuvo perfil no se vuelve a crear sola: si falta, la eliminó el administrador */;acctBusy=true;await authP;const r=ref('plans',k),now=Date.now();
  try{await db.runTransaction(async t=>{const s=await t.get(r);if(s.exists)return;t.set(r,{k,name:u.name||'',wa:u.wa||'',email:u.email||'',plan:'free',trial:false,paid:false,start:now,end:now+3650*DAY,featSlots:0,ts:now,...(auth.currentUser?{uid:auth.currentUser.uid}:{})})})}catch(e){planErr(e)}acctBusy=false}
 function planErr(e){S.planErr=(e&&e.code)||'error';/* v318: si Firebase cerró la sesión (quedó como visitante) no es culpa de las reglas: se pide entrar de nuevo */if(S.planErr==='permission-denied'&&S.user&&auth&&auth.currentUser&&auth.currentUser.isAnonymous){S.planErr='';S.user=null;S.plan=null;planK='';if(planUn){try{planUn()}catch(x){}planUn=null}derive();save();syncUI();closeModal(1);toast('Tu sesión se cerró. Entra de nuevo con tu correo y tu clave para continuar.');if(MODE==='panel'){render();loginForm()}return}if(!$('#ov'))render(true);else toast(S.planErr==='permission-denied'?'No se pudo crear tu cuenta: faltan publicar las reglas de Firestore para "plans". Avisa al administrador.':'No se pudo continuar ('+S.planErr+'). Revisa tu internet e inténtalo de nuevo.')}
 /* v334: CIERRE DE SESIÓN CUANDO EL ADMINISTRADOR ELIMINA EL PERFIL. Cierra también la sesión de Firebase (correo y clave),
    no solo la del dispositivo. planGone() confirma con el servidor; se revisa al volver a la app y cada 5 minutos. */
 function acctOut(){if(!S.user)return;try{wipeLocal(key())}catch(e){}/* v362: la cuenta fue eliminada: se borra lo guardado en el teléfono */planAsk=false;try{presBeat(0)}catch(e){}S.user=null;S.plan=null;planK='';if(planUn){try{planUn()}catch(x){}planUn=null}
  try{const cu=auth&&auth.currentUser;if(cu&&!cu.isAnonymous)auth.signOut()}catch(e){}derive();save();closeModal(1);syncUI();toast('Tu cuenta fue eliminada por el administrador. Se cerró tu sesión.');if(MODE==='panel')render()}
 async function planGone(){const k=key();if(!ready||!db||!k||!S.user||!S.user.pl||MODE==='admin')return;try{const s=await ref('plans',k).get({source:'server'});if(!s.exists&&S.user&&key()===k)acctOut()}catch(e){}}
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')planGone()});setInterval(()=>{if(document.visibilityState==='visible')planGone()},3e5);
 function planListen(){if(MODE==='admin'||!ready)return;const k=key();
  if(!k){if(planUn)planUn();planUn=null;planK='';S.plan=null;return}
  if(planK===k)return;planK=k;if(planUn)planUn();
  planUn=ref('plans',k).onSnapshot(s=>{if(!s.exists){S.plan=null;if(S.user&&S.user.pl){if(s.metadata.fromCache)planGone();else acctOut();return}/* v334: perfil eliminado → se cierra la sesión (si el aviso viene del caché, se confirma con el servidor) */if(MODE==='panel'||planAsk){planAsk=false;acctEnsure()}return}
   S.plan=s.data();setTimeout(()=>{try{pexpSync()}catch(e){}},300)/* v263: al renovar, la tienda vuelve a verse completa enseguida */;if(S.user){/* v261: completa lo que falte con la ficha del plan */let ch=0;const P=S.plan;if(!S.user.wa&&P.wa){S.user.wa=String(P.wa);ch=1}if(S.user.nm0&&P.name){S.user.name=String(P.name).slice(0,30);delete S.user.nm0;ch=1}if(ch){save();syncUI()}}if(S.user&&S.user.ach){/* v210: se quitó el ingreso con código: esas sesiones se cierran y piden correo y clave */S.user=null;S.plan=null;derive();save();closeModal();syncUI();toast('El ingreso con código ya no existe. Entra con tu correo y tu clave.');if(MODE==='panel'){render();loginForm()}return}if(S.user&&!S.user.pl){S.user.pl=1;save()}planAsk=false;S.planErr='';
   const w=planWait;planWait=null;if(w)w();else{if(!$('#ov'))render(true);setTimeout(roleWelcome,600)}},e=>planErr(e))}
 const planProf=(n,w)=>{const k=key();if(!k||!S.plan)return;if(S.plan.name===n&&(S.plan.wa||'')===w)return;const old=S.plan.wa||'',go=()=>ref('plans',k).update({name:String(n).slice(0,40),wa:String(w).slice(0,15)}).catch(()=>{});if(w&&w!==old&&typeof telClaim==='function'){telClaim(w,old).then(ok=>{if(ok)return go();toast('Ese celular ya está registrado en otra cuenta de Mi Pradera. Usa otro número.');if(S.user){S.user.wa=old;save();try{syncUI()}catch(e){}}})}else go()/* v371: un celular por cuenta */ /* v261: necesita reglas v34; si no, el perfil igual queda en la cuenta */};
 const token=async()=>{try{await authP;const u=auth&&auth.currentUser;return u?await u.getIdToken():''}catch(e){return ''}};
 /* v104: Clasificados — coleccion community/<id>; listener propio, fuera del diff de want()/flush() */
 const COM=[];let comUn=null;
 function comListen(){if(comUn||!ready)return;comUn=db.collection('community').where('exp','>',Date.now()-2*DAY).onSnapshot(snap=>{COM.length=0;snap.forEach(d=>{const o=Object.assign({},d.data(),{id:d.id});COM.push(typeof cmNorm==='function'?cmNorm(typeof docFix==='function'?docFix('community',o):o/* v413 */):o)})/* v287: anuncios viejos a las categorías nuevas */;COM.sort((a,b)=>(b.ts||0)-(a.ts||0));if((view==='com'||view==='home'||(view==='admin'&&at==='ver'))&&!$('#ov'))render(true)},e=>{comUn=null;COM.length=0})}
 async function comPut(o){await authP;const u=auth&&auth.currentUser;if(!u||u.isAnonymous)throw{m:'Para publicar entra con tu correo y tu clave.'};o.ownerUid=u.uid;o.ttl=new Date(o.exp+2*DAY);await ref('community',o.id).set(o)}
 const comDel=async id=>{await authP;const o=COM.find(x=>x.id===id);await ref('community',id).delete();r2q(o);r2gc([want(),COM.filter(x=>x.id!==id),NEWS])};
/* v163: Noticias — coleccion news/<id>; publican quienes tengan el acceso "news" (plans/<k>.acc.news, por código) */
