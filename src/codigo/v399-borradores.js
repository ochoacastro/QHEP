/* v399: BORRADORES. Mientras alguien llena un formulario (tienda nueva, editar tienda, anuncio, servicio, producto, editar
   producto o registro), lo que escribe se guarda solo en ESTE teléfono (localStorage «qh_borr», nunca en Firebase).
   Si la ventana se cierra sin guardar (un toque afuera, «Cancelar», cerrar o recargar la página), sale abajo el aviso
   «Tienes … sin terminar · Continuar». Al volver a abrir ese formulario, arriba sale «Continuar donde quedé».
   Al guardar con éxito el borrador se borra. No se guardan contraseñas ni fotos (las fotos se eligen de nuevo).
   Los borradores duran 7 días. Si algo falla, borra este bloque. */
(function(){
var LS='qh_borr',DIAS=7*864e5;
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function g(n){try{return window[n]}catch(e){}}
/* qué formulario es, cómo se llama y cómo se vuelve a abrir */
var K={
 saveShop:{n:'tu tienda nueva',c:function(){return ''},o:function(){shopForm()}},
 saveEditShop:{n:'los cambios de tu tienda',c:function(){return cur||''},o:function(c){cur=c;editShop()}},
 saveAd:{n:'tu anuncio',c:function(){return (af&&af.type||'')+'|'+(af&&af.id||'')},o:function(c){var p=c.split('|');adForm(p[0],p[1]?S.ads.find(function(a){return a.id===p[1]}):undefined)}},
 saveServ:{n:'tu servicio',c:function(){return ''},o:function(){servForm()}},
 saveProd:{n:'tu producto nuevo',c:function(){return cur||''},o:function(c){cur=c;prodForm()}},
 saveEdit:{n:'los cambios del producto',c:function(){return (cur||'')+'|'+(ed&&ed.id||'')},o:function(c){var p=c.split('|');cur=p[0];editForm(p[1])}},
 doReg:{n:'tu registro',c:function(){return ''},o:function(){regForm()}}
};
function mode(){try{return MODE}catch(e){return ''}}
function ukey(){try{return QH.key()||''}catch(e){return ''}}
function all(){var o={};try{o=JSON.parse(localStorage.getItem(LS)||'{}')||{}}catch(e){}var n=Date.now(),ch=0;for(var k in o){if(!o[k]||n-(o[k].ts||0)>DIAS){delete o[k];ch=1}}if(ch)put(o);return o}
function put(o){try{localStorage.setItem(LS,JSON.stringify(o))}catch(e){}}
function mine(d){return d&&(!d.u||d.u===ukey())}
function M(){return document.querySelector('#ov .modal')}
function kindOf(m){if(!m)return null;for(var a in K)if(m.querySelector('[data-act="'+a+'"]'))return a;return null}
function fields(m){return [].slice.call(m.querySelectorAll('input[id],select[id],textarea[id]')).filter(function(i){return i.type!=='password'&&i.type!=='file'&&!/^(ap|ip|as|a-em|a-pw|rc-)/.test(i.id)})}
function snap(m){var v={};fields(m).forEach(function(i){v[i.id]=i.type==='checkbox'||i.type==='radio'?i.checked:i.value});return v}
function chips(m){return [].slice.call(m.querySelectorAll('button.chip[aria-pressed="true"][data-act][data-v]')).map(function(b){return [b.dataset.act,b.dataset.v]})}
/* ---- estado de la ventana abierta ---- */
var S0=null;/* {act,key,init,dirty,saving} */
function keyOf(act){try{return act+'#'+K[act].c()}catch(e){return act+'#'}}
function txt(v){for(var k in v)if(typeof v[k]==='string'&&v[k].trim())return true;return false}
function store(m){m=m||M();if(!S0||!m||m!==S0.el||kindOf(m)!==S0.act)return;/* solo la ventana donde se escribió */var v=snap(m),dif=false;for(var k in v)if(v[k]!==S0.init[k]){dif=true;break}
 var ch=chips(m);if(!dif&&JSON.stringify(ch)===S0.ich)return;if(!txt(v))return;S0.dirty=true;
 var o=all(),h=m.querySelector('h2'),d={a:S0.act,c:S0.key.split('#').slice(1).join('#'),v:v,ch:ch,ts:Date.now(),u:ukey(),t:h?h.textContent.trim().slice(0,60):'',f:!!m.querySelector('input[type=file]')};
 try{if(S0.act==='saveAd'&&af&&af.imgs&&af.imgs.length){var im=JSON.stringify(af.imgs);if(im.length<1500000)d.im=af.imgs.slice()}}catch(e){}
 o[S0.key]=d;put(o)}
var tW,pendM=null;function later(){var m=M();if(!m)return;pendM=m;clearTimeout(tW);tW=setTimeout(function(){var x=pendM;pendM=null;store(x)},400)}
function del(key){var o=all();delete o[key];put(o)}
/* v412: «No guardar» al salir pregunta si hay cambios (dirty) y borra el borrador de la ventana abierta (drop) */
window.qhBorr={dirty:function(){return !!(S0&&S0.dirty)},drop:function(){clearTimeout(tW);pendM=null;if(S0){del(S0.key);S0.dirty=false;S0.el=null}bar()}};
function ago(ts){var m=Math.round((Date.now()-ts)/6e4);return m<1?'hace un momento':m<60?'hace '+m+' min':m<1440?'hace '+Math.round(m/60)+' h':'hace '+Math.round(m/1440)+' días'}
/* ---- volver a poner lo escrito ---- */
function setv(i,val){if(i.type==='checkbox'||i.type==='radio'){if(i.checked!==!!val){i.checked=!!val;i.dispatchEvent(new Event('change',{bubbles:true}))}}
 else if(i.value!==val){i.value=val;i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}))}}
function fill(d){var m=M();if(!m||!d)return;
 (d.ch||[]).forEach(function(p){var b=m.querySelector('button.chip[data-act="'+p[0]+'"][data-v="'+String(p[1]).replace(/"/g,'\\"')+'"]');if(b&&b.getAttribute('aria-pressed')!=='true')b.click()});
 for(var r=0;r<2;r++)for(var id in d.v){var i=document.getElementById(id);if(i&&m.contains(i)&&i.type!=='password'&&i.type!=='file')setv(i,d.v[id])}
 try{if(d.im&&af&&d.a==='saveAd'){af.imgs=d.im.slice();var w=document.getElementById('a-imgs');if(w&&typeof aImgs==='function')w.innerHTML=aImgs()}}catch(e){}
 if(S0){S0.init=snap(m);S0.ich=JSON.stringify(chips(m));S0.dirty=true}}
function banner(m,d){if(!m||m.querySelector('.brb'))return;var h=m.querySelector('h2'),w=document.createElement('div');w.className='brb';w.setAttribute('role','status');
 w.innerHTML='<p><b>Tienes un avance sin guardar</b> ('+ago(d.ts)+').'+(d.f?' Las fotos tendrás que elegirlas de nuevo.':'')+'</p><div class="brbr"><button type="button" class="btn pink" data-brb="go">Continuar donde quedé</button><button type="button" class="btn ghost" data-brb="no">Empezar de nuevo</button></div>';
 if(h&&h.parentNode===m)h.insertAdjacentElement('afterend',w);else m.insertBefore(w,m.firstChild)}
/* ---- aviso abajo cuando hay algo sin terminar ---- */
var hid=false;
function last(){var o=all(),b=null,bk='';for(var k in o){var d=o[k];if(!mine(d)||!K[d.a]||!K[d.a].o)continue;if(!b||d.ts>b.ts){b=d;bk=k}}return b?{k:bk,d:b}:null}
function bar(){var x=document.getElementById('brbar');if(mode()==='admin'||hid||document.getElementById('ov')){if(x)x.remove();return}
 var L=last();if(!L){if(x)x.remove();return}
 var h='<span><b>Tienes '+E(K[L.d.a].n)+' sin terminar</b><small>'+E(L.d.t||'')+' · '+ago(L.d.ts)+'</small></span><button type="button" class="btn pink" data-brk="'+E(L.k)+'">Continuar</button><button type="button" class="brx" data-brx="1" aria-label="Ocultar este aviso">×</button>';
 if(!x){x=document.createElement('div');x.id='brbar';x.setAttribute('role','status');document.body.appendChild(x)}if(x.innerHTML!==h)x.innerHTML=h}
function resume(k){var d=all()[k];if(!d||!K[d.a]||!K[d.a].o)return;hid=false;try{K[d.a].o(d.c)}catch(e){return}
 setTimeout(function(){var m=M();if(m&&kindOf(m)===d.a){var b=m.querySelector('.brb');if(b)b.remove();fill(d);toast('Seguimos donde quedaste')}},60)}
/* ---- eventos ---- */
document.addEventListener('input',function(e){if(e.isTrusted&&e.target&&e.target.closest&&e.target.closest('#ov .modal'))later()},true);
document.addEventListener('change',function(e){if(e.isTrusted&&e.target&&e.target.closest&&e.target.closest('#ov .modal'))later()},true);
document.addEventListener('click',function(e){var t=e.target;if(!t||!t.closest)return;
 var b=t.closest('[data-brb]');if(b){e.preventDefault();e.stopPropagation();var m=M(),w=b.closest('.brb'),d=S0&&all()[S0.key];if(b.dataset.brb==='go'){fill(d);toast('Seguimos donde quedaste')}else if(S0){del(S0.key);S0.dirty=false}if(w)w.remove();return}
 var k=t.closest('[data-brk]');if(k){e.preventDefault();resume(k.dataset.brk);return}
 if(t.closest('[data-brx]')){hid=true;bar();return}
 var s=t.closest('#ov .modal [data-act]');if(s&&S0&&s.dataset.act===S0.act){store(S0.el);S0.saving=Date.now();[900,3000,8000].forEach(function(ms){setTimeout(function(){var er=document.querySelector('#ov #err');if(S0&&er&&er.textContent.trim()&&!/Enviando|Guardando/i.test(er.textContent))S0.saving=0},ms)})/* si salió un error, no se guardó */}
 else if(t.closest('#ov .modal .chip'))setTimeout(later,0)},true);
addEventListener('pagehide',function(){store()});document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')store()});
/* abrir, cambiar o cerrar ventanas */
function check(){var m=M(),act=kindOf(m);
 if(S0&&(m!==S0.el||act!==S0.act)){if(pendM===S0.el){clearTimeout(tW);pendM=null;store(S0.el)}var p=S0;S0=null;
  if(p.saving&&Date.now()-p.saving<30000)del(p.key);/* se guardó: el formulario ya no está */
  else if(p.dirty&&all()[p.key])hid=false;/* el aviso de abajo dice que quedó guardado */}
 if(m&&act&&!S0&&mode()!=='admin'){var key=keyOf(act);S0={el:m,act:act,key:key,init:snap(m),ich:JSON.stringify(chips(m)),dirty:false,saving:0};var d=all()[key];if(d&&mine(d))banner(m,d)}
 bar()}
var tc=0;new MutationObserver(function(){if(tc)return;tc=1;requestAnimationFrame(function(){tc=0;check()})}).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(check,2500);
document.head.insertAdjacentHTML('beforeend','<style id="v399-css">.brb{margin:4px 0 12px;padding:12px 14px;background:#eef4ff;border-left:5px solid #0071e3}.brb p{margin:0 0 8px}.brbr{display:flex;gap:8px;flex-wrap:wrap}.brbr .btn{flex:1 1 140px;min-height:44px}'+
 '#brbar{position:fixed;left:12px;right:12px;bottom:16px;z-index:30;display:flex;align-items:center;gap:10px;max-width:560px;margin:0 auto;padding:10px 10px 10px 14px;background:#1d1d1f;color:#fff;box-shadow:0 8px 24px #0000003d}#brbar span{flex:1;min-width:0}#brbar small{display:block;opacity:.75;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#brbar .btn{flex:none;min-height:42px;padding:6px 14px}#brbar .brx{flex:none;width:36px;height:42px;background:none;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer}'+
 '@media (max-width:900px){#brbar{bottom:calc(76px + env(safe-area-inset-bottom))}}html.dark .brb{background:#0a2540!important;color:#f5f5f7!important}html.dark #brbar{background:#2c2c2e;color:#f5f5f7}.brb,#brbar,#brbar .btn{border-radius:0!important}</style>');
})();
