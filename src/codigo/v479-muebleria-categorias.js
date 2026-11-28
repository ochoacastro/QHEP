/* v479: MENÚ DE CATEGORÍAS DE LA MUEBLERÍA. En la tienda de una mueblería (marca .qhmue-m, v478), antes de los productos sale un menú
   plegable: cada categoría (Colchones, Combos de colchón, Alcobas, Salas, Comedores, Ropa de cama) con su dibujo; al tocarla se abre
   una cuadrícula de dos columnas con sus subcategorías y «Ver todo en …». Tocar una subcategoría o «Ver todo» muestra solo esos
   productos, con «Ver todos los productos» para volver.
   - La lista es fija (window.QH_MUE). En el inventario (ferreteria.html, v479) la subcategoría de cada producto es su «Categoría»;
     «Publicar tienda» la guarda en Mi Pradera como products/<tienda>__<id>.ferCat.
   - Solo salen las categorías y subcategorías que tienen productos. Los productos sin subcategoría de la lista salen en «Ver todos».
   - Los dibujos son propios (línea azul marino con relleno gris niebla), hechos para Mi Pradera.
   Solo mira la página y oculta tarjetas; no guarda nada. Si algo falla, borra este bloque y su <style>. */
(function(){
var F=' class="f"',S2=' class="s"';
/* dibujos: viewBox 64x44, trazo currentColor; .f relleno niebla; .s sombra */
var D={
 sombra:'<ellipse'+S2+' cx="32" cy="40" rx="24" ry="2.6"/>',
 colchon:'<path'+F+' d="M10 22l4-8h36l4 8z"/><rect x="9" y="22" width="46" height="9" rx="2"/><path d="M9 26h46"/><path d="M19 17h1M26 17h1M33 17h1M40 17h1M23 20h1M30 20h1M37 20h1M44 20h1"/>',
 colchon2:'<path'+F+' d="M12 26l4-7h32l4 7z"/><rect x="11" y="26" width="42" height="8" rx="2"/><path d="M22 18c2-8 18-8 20 0"/><path d="M40 15l2 3 3-2"/>',
 base:'<path'+F+' d="M10 17l3-6h38l3 6z"/><rect x="9" y="17" width="46" height="7" rx="2"/><rect'+F+' x="8" y="24" width="48" height="8" rx="1.5"/><path d="M12 32v4M52 32v4"/>',
 tapizada:'<rect'+F+' x="14" y="6" width="36" height="14" rx="2"/><path d="M20 10h1M27 10h1M34 10h1M41 10h1M23 15h1M30 15h1M37 15h1"/><rect x="10" y="20" width="44" height="9" rx="2"/><rect'+F+' x="10" y="29" width="44" height="4" rx="1"/><path d="M13 33v4M51 33v4"/>',
 madera:'<rect x="14" y="6" width="36" height="14" rx="1.5"/><path d="M21 6v14M28 6v14M36 6v14M43 6v14"/><rect'+F+' x="10" y="20" width="44" height="9" rx="2"/><rect x="10" y="29" width="44" height="4" rx="1"/><path d="M13 33v4M51 33v4"/>',
 nido:'<path d="M9 10v20M55 10v20"/><rect'+F+' x="11" y="12" width="42" height="7" rx="1.5"/><rect x="13" y="22" width="38" height="7" rx="1.5"/><path d="M9 30h46M12 30v5M52 30v5"/>',
 nochero:'<rect x="21" y="8" width="22" height="12" rx="1.5"/><rect'+F+' x="18" y="20" width="28" height="9" rx="2"/><path d="M20 29v5M44 29v5"/><rect'+F+' x="4" y="20" width="11" height="12" rx="1"/><path d="M4 26h11M8 23h3M8 29h3M6 32v3M13 32v3"/><rect'+F+' x="49" y="20" width="11" height="12" rx="1"/><path d="M49 26h11M53 23h3M53 29h3M51 32v3M58 32v3"/>',
 cama:'<rect'+F+' x="14" y="5" width="36" height="17" rx="1.5"/><path d="M14 22h36"/><path d="M12 22h40v12H12z"/><path d="M14 26h36M14 29h36M14 32h36"/><path d="M14 34v3M50 34v3"/>',
 mesanoche:'<path'+F+' d="M28 4h8l3 7H25z"/><path d="M32 11v6M28 17h8"/><rect x="18" y="17" width="28" height="17" rx="1.5"/><path d="M18 25.5h28M32 21h1M32 30h1M21 34v3M43 34v3"/>',
 camarote:'<path d="M12 4v33M52 4v33"/><rect'+F+' x="14" y="8" width="36" height="6" rx="1.5"/><path d="M12 15h40"/><rect'+F+' x="14" y="25" width="36" height="6" rx="1.5"/><path d="M12 32h40M44 15v17M48 15v17M44 20h4M44 25h4"/>',
 closet:'<rect'+F+' x="16" y="4" width="32" height="31" rx="1.5"/><path d="M32 4v31M29 18v4M35 18v4M19 35v3M45 35v3"/>',
 tocador:'<rect'+F+' x="24" y="3" width="16" height="13" rx="6"/><rect x="14" y="17" width="36" height="17" rx="1.5"/><path d="M32 17v17M14 25.5h18M22 21h2M22 30h2M40 24h2M17 34v3M47 34v3"/>',
 sofa:'<rect x="12" y="8" width="40" height="13" rx="2"/><path'+F+' d="M14 21h36v6H14z"/><path d="M25 8v13M39 8v13"/><rect x="7" y="14" width="7" height="16" rx="2"/><rect x="50" y="14" width="7" height="16" rx="2"/><path d="M14 27h36v3H14M10 30v4M54 30v4"/>',
 sofacama:'<rect x="12" y="7" width="40" height="11" rx="2"/><path d="M25 7v11M39 7v11"/><rect x="7" y="12" width="7" height="18" rx="2"/><rect x="50" y="12" width="7" height="18" rx="2"/><path'+F+' d="M10 22l4-4h36l4 4z"/><rect x="10" y="22" width="44" height="6" rx="1.5"/><path d="M20 20h1M30 20h1M40 20h1M14 28v6M50 28v6"/>',
 sofaL:'<rect x="8" y="8" width="44" height="12" rx="2"/><path d="M22 8v12M37 8v12"/><rect x="4" y="13" width="6" height="16" rx="2"/><path'+F+' d="M10 20h32v6H10z"/><rect'+F+' x="40" y="20" width="18" height="12" rx="1.5"/><rect x="56" y="13" width="5" height="19" rx="2"/><path d="M10 26h30v3H10M7 29v5M44 32v4M57 32v4"/>',
 combosala:'<rect x="6" y="11" width="30" height="11" rx="2"/><path d="M21 11v11"/><rect x="3" y="15" width="5" height="14" rx="2"/><rect x="34" y="15" width="5" height="14" rx="2"/><path'+F+' d="M8 22h26v5H8z"/><path d="M6 29v4M36 29v4"/><rect x="44" y="12" width="14" height="10" rx="2"/><rect x="41" y="16" width="5" height="13" rx="2"/><rect x="56" y="16" width="5" height="13" rx="2"/><path'+F+' d="M46 22h10v5H46z"/><path d="M43 29v4M59 29v4"/>',
 modular:'<rect x="6" y="8" width="16" height="12" rx="2"/><rect x="24" y="8" width="16" height="12" rx="2"/><rect x="42" y="8" width="16" height="12" rx="2"/><path'+F+' d="M6 20h16v11H6zM24 20h16v11H24zM42 20h16v11H42z"/><path d="M8 31v4M20 31v4M26 31v4M38 31v4M44 31v4M56 31v4"/>',
 poltrona:'<rect x="12" y="6" width="22" height="15" rx="2"/><rect x="8" y="13" width="6" height="18" rx="2"/><rect x="32" y="13" width="6" height="18" rx="2"/><path'+F+' d="M14 21h18v7H14z"/><path d="M14 28h18v3H14M10 31v4M36 31v4"/><path'+F+' d="M44 23c0-3 14-3 14 0v9c0 3-14 3-14 0z"/><ellipse cx="51" cy="23" rx="7" ry="2"/>',
 reclinable:'<path d="M14 6l8 16"/><path'+F+' d="M10 8l5-3 9 17-5 3z"/><rect x="18" y="20" width="22" height="12" rx="2"/><path'+F+' d="M40 22l14-3 2 5-14 4z"/><path d="M22 32v4M36 32v4"/>',
 mesacentro:'<rect'+F+' x="8" y="17" width="48" height="5" rx="1.5"/><path d="M12 22v12M52 22v12M12 29h40"/><rect x="18" y="13" width="10" height="4" rx="1"/><path d="M42 17c0-3 4-3 4 0M44 14v-4"/>',
 comedor4:'<rect'+F+' x="16" y="4" width="10" height="11" rx="1"/><rect'+F+' x="38" y="4" width="10" height="11" rx="1"/><rect x="8" y="15" width="48" height="4" rx="1"/><path d="M12 19v16M52 19v16M18 19v14M24 19v14M40 19v14M46 19v14"/>',
 comedor6:'<rect'+F+' x="10" y="4" width="9" height="11" rx="1"/><rect'+F+' x="27.5" y="4" width="9" height="11" rx="1"/><rect'+F+' x="45" y="4" width="9" height="11" rx="1"/><rect x="5" y="15" width="54" height="4" rx="1"/><path d="M8 19v16M56 19v16M12 19v14M18 19v14M29 19v14M35 19v14M47 19v14M53 19v14"/>',
 mesacomedor:'<path'+F+' d="M25 11c0-5 14-5 14 0z"/><rect x="8" y="13" width="48" height="5" rx="1.5"/><path d="M12 18v17M52 18v17M12 21h40"/>',
 sillas:'<rect'+F+' x="14" y="3" width="12" height="16" rx="1.5"/><path d="M12 19h16v3H12zM14 22v14M26 22v14"/><rect'+F+' x="38" y="3" width="12" height="16" rx="1.5"/><path d="M36 19h16v3H36zM38 22v14M50 22v14"/>',
 almohada:'<path'+F+' d="M22 8c10-2 22-2 32 0 1 6 1 12 0 18-10 2-22 2-32 0-1-6-1-12 0-18z"/><path d="M8 14c11-2 25-2 36 0 1 7 1 13 0 20-11 2-25 2-36 0-1-7-1-13 0-20z"/><path d="M11 17l3 3M41 17l-3 3M11 31l3-3M41 31l-3-3"/>',
 protector:'<path d="M32 4c-3 4-4 6-4 8a4 4 0 0 0 8 0c0-2-1-4-4-8z"/><path'+F+' d="M12 24l4-6h32l4 6z"/><rect x="11" y="24" width="42" height="8" rx="2"/><path d="M20 21h1M28 21h1M36 21h1M44 21h1"/>',
 sabanas:'<rect'+F+' x="10" y="20" width="44" height="9" rx="3"/><rect x="12" y="11" width="40" height="9" rx="3"/><path d="M14 15h36M14 24h38"/><rect x="30" y="11" width="6" height="18"/>',
 duvet:'<rect x="16" y="5" width="32" height="9" rx="1.5"/><rect'+F+' x="20" y="7" width="10" height="5" rx="1"/><rect'+F+' x="34" y="7" width="10" height="5" rx="1"/><path'+F+' d="M12 14h40v8H12z"/><path d="M14 17h36M12 22c0 6 4 9 8 9s4-3 6-3 4 3 6 3 4-3 6-3 4 3 6 3 8-3 8-9"/>',
 plumon:'<rect'+F+' x="10" y="22" width="40" height="8" rx="2"/><rect x="12" y="13" width="38" height="9" rx="3"/><path d="M22 13v9M32 13v9M42 13v9"/><path d="M46 14c3-6 8-9 12-10-1 4-4 9-10 12z"/><path d="M47 15l7-8"/>',
 cojin:'<rect'+F+' x="30" y="6" width="22" height="22" rx="4"/><rect x="12" y="11" width="24" height="24" rx="4"/><rect x="16" y="15" width="16" height="16" rx="2"/><circle cx="24" cy="23" r=".6"/>',
 tapete:'<path'+F+' d="M10 30l8-16h28l8 16z"/><path d="M14 28l6-12h24l6 12z"/><path d="M26 22l6-3 6 3-6 3z"/><path d="M12 30v3M18 30v3M24 30v3M30 30v3M36 30v3M42 30v3M48 30v3M52 30v3"/>'
};
/* la lista fija: [categoría, dibujo, [[subcategoría, dibujo], …]] */
var L=[
 ['Colchones','colchon',[['Colchones de una cara','colchon'],['Colchones de dos caras','colchon2']]],
 ['Combos de colchón','base',[['Colchón y base cama','base'],['Colchón y cama tapizada','tapizada'],['Colchón y cama de madera','madera'],['Colchón y cama nido','nido'],['Colchón y nocheros','nochero']]],
 ['Alcobas','cama',[['Camas y bases','cama'],['Mesas de noche','mesanoche'],['Camarotes','camarote'],['Clósets','closet'],['Tocadores','tocador']]],
 ['Salas','sofa',[['Sofás','sofa'],['Sofá camas','sofacama'],['Sofás en L','sofaL'],['Combos de salas','combosala'],['Modulares','modular'],['Sillas, poltronas y puff','poltrona'],['Sillas reclinables','reclinable'],['Mesas de centro','mesacentro']]],
 ['Comedores','comedor4',[['Comedores de 4 puestos','comedor4'],['Comedores de 6 puestos','comedor6'],['Mesas de comedor','mesacomedor'],['Sillas de comedor','sillas']]],
 ['Ropa de cama','almohada',[['Almohadas','almohada'],['Protectores','protector'],['Sábanas','sabanas'],['Duvets','duvet'],['Plumones y cobijas','plumon'],['Cojines','cojin'],['Tapetes','tapete']]]
];
window.QH_MUE=L.map(function(c){return {n:c[0],subs:c[2].map(function(s){return s[0]})}});/* la usa el inventario (ferreteria.html) */
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var nrm=function(t){return String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim()};
var dib=function(k){return '<svg class="qmu-ic" viewBox="0 0 64 44" aria-hidden="true">'+D.sombra+(D[k]||D.cama)+'</svg>'};
var subDe={};L.forEach(function(c){c[2].forEach(function(s){subDe[nrm(s[0])]={cat:c[0],sub:s[0]}})});
var est={tienda:null,abierta:null,filtro:null};/* filtro: {t:'sub'|'cat', n:nombre} */
function tienda(){try{return view==='store'?S.stores.find(function(x){return x.id===cur}):null}catch(e){return null}}
function deProd(p){return subDe[nrm(p&&p.ferCat)]||null}
function menu(s){var hay={};(s.products||[]).forEach(function(p){var d=deProd(p);if(!d)return;(hay[d.cat]=hay[d.cat]||{})[d.sub]=(hay[d.cat][d.sub]||0)+1});
 var cats=L.filter(function(c){return hay[c[0]]});if(!cats.length)return '';
 return '<section class="qmu" aria-label="Categorías de la tienda"><h3 class="qmu-t">Categorías</h3>'+cats.map(function(c){var ab=est.abierta===c[0],subs=c[2].filter(function(x){return hay[c[0]][x[0]]});
  return '<div class="qmu-c'+(ab?' on':'')+'"><button type="button" class="qmu-h" data-qmu-cat="'+E(c[0])+'" aria-expanded="'+ab+'"><span class="qmu-hi">'+dib(c[1])+'</span><span class="qmu-hn">'+E(c[0])+'</span><svg class="qmu-fl" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>'+
   (ab?'<div class="qmu-g">'+subs.map(function(x){return '<button type="button" class="qmu-s" data-qmu-sub="'+E(x[0])+'">'+dib(x[1])+'<span>'+E(x[0])+'</span></button>'}).join('')+'</div><button type="button" class="qmu-todo" data-qmu-todo="'+E(c[0])+'">Ver todo en '+E(c[0])+'</button>':'')+'</div>'}).join('')+'</section>'}
function barra(n){return '<div class="qmu-fx" role="status"><span>'+E(est.filtro.n)+': '+n+(n===1?' producto':' productos')+'</span><button type="button" class="qmu-todos" data-qmu-todos="1">Ver todos los productos</button></div>'}
function aplicar(){var m=document.querySelector('.qhmue-m');var s=m?tienda():null;
 if(!s){est.tienda=null;return}
 if(est.tienda!==s.id){est.tienda=s.id;est.abierta=null;est.filtro=null}
 var t=document.querySelector('#app .ptitle');if(!t)return;
 var viejo=document.querySelector('.qmu-w');var html=menu(s);
 if(!html){if(viejo)viejo.remove();return}
 var w=viejo||document.createElement('div');w.className='qmu-w';if(w.getAttribute('data-h')!==html+JSON.stringify(est.filtro)){w.innerHTML=html;w.setAttribute('data-h',html+JSON.stringify(est.filtro))}
 if(!viejo)t.parentNode.insertBefore(w,t);
 /* filtrar tarjetas */
 var byId={};(s.products||[]).forEach(function(p){byId[p.id]=p});var n=0;
 document.querySelectorAll('#app .pgrid .prod').forEach(function(card){var b=card.querySelector('[data-act="prod"][data-id],[data-act="add"][data-id]'),p=b&&byId[b.getAttribute('data-id')],d=deProd(p);
  var ok=!est.filtro||(d&&(est.filtro.t==='sub'?d.sub===est.filtro.n:d.cat===est.filtro.n));card.classList.toggle('qmu-no',!ok);if(ok&&est.filtro)n++});
 /* la barra del filtro solo se toca si cambió (si no, el observador la volvería a poner sin parar) */
 var fx=document.querySelector('.qmu-fx'),nuevo=est.filtro?barra(n):'';
 if(fx&&fx.getAttribute('data-h')===nuevo&&fx.previousElementSibling===t)return;
 if(fx)fx.remove();
 if(nuevo){t.insertAdjacentHTML('afterend',nuevo);t.nextElementSibling.setAttribute('data-h',nuevo)}}
var pend=false;function luego(){if(pend)return;pend=true;requestAnimationFrame(function(){pend=false;try{aplicar()}catch(e){}})}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-qmu-cat],[data-qmu-sub],[data-qmu-todo],[data-qmu-todos]');if(!b)return;e.preventDefault();
 if(b.hasAttribute('data-qmu-cat')){var c=b.getAttribute('data-qmu-cat');est.abierta=est.abierta===c?null:c}
 else if(b.hasAttribute('data-qmu-sub'))est.filtro={t:'sub',n:b.getAttribute('data-qmu-sub')};
 else if(b.hasAttribute('data-qmu-todo'))est.filtro={t:'cat',n:b.getAttribute('data-qmu-todo')};
 else est.filtro=null;
 aplicar();if(!b.hasAttribute('data-qmu-cat')){var t=document.querySelector('#app .ptitle');if(t)t.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}});
function inst(){var a=document.getElementById('app');if(!a)return false;new MutationObserver(luego).observe(a,{childList:true,subtree:true});luego();return true}
if(!inst())document.addEventListener('DOMContentLoaded',inst);
})();
