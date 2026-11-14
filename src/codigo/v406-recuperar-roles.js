/* v406: roles por recuperar. Si la ficha de una cuenta (plans/<k>) se borró y se volvió a crear, queda sin roles (acc) aunque sus
   códigos sigan usados y vigentes («Mis códigos» los muestra, pero «Publicar» dice «Sin activar»). En Usuarios, el administrador
   ve la lista y con un botón devuelve a cada ficha el fin de cada rol según sus códigos (y acc.mercF del destacado de Comerciante
   de 6 meses o más). Solo sube fechas, nunca las baja. Si algo falla, borra este bloque y la llamada admRolesFix en 11-profilemodal. */
(function(){
var DAY=864e5,E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function rn(u){try{return CD_SH[u]||u}catch(e){return u}}
function fd(t){return new Date(t).toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'})}
/* lo que falta en cada ficha: {k, p, acc (nuevo), faltan:[[rol,fin]]} */
function gaps(){var now=Date.now(),P={},out=[];try{QH.plans().forEach(function(p){if(p&&p.k)P[p.k]=p})}catch(e){return []}
 /* El fin de cada rol se calcula con los días de cada código (los pone el administrador o las reglas), en el orden en que se usaron:
    cada código empieza cuando termina el anterior. La fecha «end» que guarda el código la escribe quien lo canjea y las reglas no
    la revisan, así que solo se usa para BAJAR el resultado, nunca para subirlo. Los códigos gratis no se suman entre sí. */
 var want={},G={};try{QH.codes().forEach(function(c){if(!c||!c.used||!c.usedBy||!c.use)return;var g=G[c.usedBy]=G[c.usedBy]||{};(g[c.use]=g[c.use]||[]).push(c)})}catch(e){return []}
 Object.keys(G).forEach(function(k){Object.keys(G[k]).forEach(function(u){var e=0,f=0;
  G[k][u].sort(function(a,b){return (Number(a.usedAt)||0)-(Number(b.usedAt)||0)}).forEach(function(c){var t=Math.min(Number(c.usedAt)||0,now),d=(Number(c.days)||0)*DAY;if(!(t>0)||!(d>0))return;
   var x=(c.why==='gratis'?t:Math.max(e,t))+d;if(Number(c.end)>0)x=Math.min(x,Number(c.end));e=Math.max(e,x);if(u==='merc'&&(Number(c.months)||0)>=6)f=Math.max(f,x)});
  if(e>now){var w=want[k]=want[k]||{};w[u]=e;if(f>now)w.mercF=f}})});
 Object.keys(want).forEach(function(k){var p=P[k];if(!p)return;var acc=Object.assign({},p.acc||{}),f=[];
  Object.keys(want[k]).forEach(function(u){if((Number(acc[u])||0)<want[k][u]-DAY){acc[u]=want[k][u];if(u!=='mercF')f.push([u,want[k][u]])}});
  if(f.length)out.push({k:k,p:p,acc:acc,faltan:f})});return out}
window.admRolesFix=function(){var L=gaps();if(!L.length)return '';
 return '<div class="cg aadp"><h3>Roles por recuperar <em>'+L.length+'</em></h3><p class="muted">Estas cuentas tienen códigos usados y vigentes, pero su ficha no tiene el rol (por ejemplo, porque la ficha se borró y se creó de nuevo). Por eso al publicar les sale «Sin activar».</p>'+
  L.map(function(g){return '<div class="aadr pend"><b>'+E(g.p.name||'(sin nombre)')+(g.p.email?' · '+E(g.p.email):'')+'</b><p>'+g.faltan.map(function(x){return E(rn(x[0]))+' hasta el '+fd(x[1])}).join(' · ')+'</p></div>'}).join('')+
  '<div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-rolesfix="1">Recuperar '+(L.length===1?'el rol':'los roles')+'</button></div></div>'};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-rolesfix]');if(!b||typeof MODE==='undefined'||MODE!=='admin')return;e.preventDefault();e.stopImmediatePropagation();
 var L=gaps();if(!L.length)return toast('No hay roles por recuperar.');b.disabled=true;
 Promise.all(L.map(function(g){return QH.planSet(g.k,{acc:g.acc})})).then(function(){toast(L.length===1?'Rol recuperado':'Roles recuperados en '+L.length+' cuentas');setTimeout(function(){try{render(true)}catch(x){}},500)}).catch(function(){b.disabled=false;toast('No se pudo guardar. Intenta de nuevo.')})},true);
})();
