
/* v339: códigos de acceso con los roles «Uno» y «Varios» bien separados en el administrador:
   - la lista de roles (generar y filtrar) agrupada: Comerciante, Vendedor de inmuebles, Vendedor de vehículos y Gratis;
   - debajo de «Generar códigos», el precio del rol y la duración elegidos y para quién es.
   Si algo falla, borra este bloque: las listas vuelven a ser planas. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var G=[['Comerciante',['merc1','merc']],['Vendedor de inmuebles',['home1','home']],['Vendedor de vehículos',['car1','car']],['Gratis por 1 año',['comu','news']]];
window.cdOpts=function(sel){var all=(typeof CODE_USES!=='undefined'?CODE_USES:[]),used={},h='';
 G.forEach(function(g){var l=g[1].filter(function(u){return all.indexOf(u)>=0&&USES[u]});if(!l.length)return;
  h+='<optgroup label="'+E(g[0])+'">'+l.map(function(u){used[u]=1;return '<option value="'+u+'"'+(sel===u?' selected':'')+'>'+E(USES[u].n)+'</option>'}).join('')+'</optgroup>'});
 all.forEach(function(u){if(!used[u]&&USES[u])h+='<option value="'+u+'"'+(sel===u?' selected':'')+'>'+E(USES[u].n)+'</option>'});return h};
function upd(){var u=document.getElementById('cg-u'),m=document.getElementById('cg-m'),w=document.getElementById('cg-why');if(!u||!m)return;
 var p=document.getElementById('cg-pr');if(!p){var box=u.closest('.cdg')||u.parentNode;box.insertAdjacentHTML('afterend','<p id="cg-pr" class="cgpr" aria-live="polite"></p>');p=document.getElementById('cg-pr')}
 var x=USES[u.value]||{},mm=+m.value,pr=0;try{pr=codePrice(u.value,mm)}catch(e){}var gift=false;try{gift=!!w&&codeGift(w.value)}catch(e){}
 p.innerHTML='<b>'+E(x.n||u.value)+' · '+E(typeof codeMn==='function'?codeMn(mm):mm+' meses')+'</b><span>'+(gift?'Gratis (regalo)':pr?'Precio de lista: '+E(money(pr)):'Gratis')+'</span>'+(x.d?'<small>'+E(x.d)+'</small>':'')}
document.addEventListener('change',function(e){var id=e.target&&e.target.id;if(id==='cg-u'||id==='cg-m'||id==='cg-why')setTimeout(upd,0)});
var t=0;new MutationObserver(function(){if(t)return;t=1;requestAnimationFrame(function(){t=0;if(document.getElementById('cg-u')&&!document.getElementById('cg-pr'))upd()})}).observe(document.documentElement,{childList:true,subtree:true});
document.head.insertAdjacentHTML('beforeend','<style id="v339-css">.cdg>div:has(#cg-u),.cdg>div:has(#cg-why){grid-column:1/-1}.cgpr{display:grid;gap:2px;margin:10px 0 4px;padding:10px 12px;background:#eef4ff;border-left:5px solid #0071e3;font-size:14px}.cgpr span{font-weight:800;color:#0b4fa8}.cgpr small{color:#48484a}html.dark .cgpr{background:#0a2540!important;color:#f5f5f7!important}html.dark .cgpr span{color:#64a8ff!important}html.dark .cgpr small{color:#d1d1d6!important}</style>');
})();
