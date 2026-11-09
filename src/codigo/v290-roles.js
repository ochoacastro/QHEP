
/* v290: cuadros de roles para la ventana «Roles» (cdBox). Si algo falla, borra este <script> y su <style>: vuelven las pestañas. */
window.cdTilesHTML=function(tabs){var fd=function(t){return new Date(t).toLocaleDateString('es-CO')},now=Date.now();
 return '<div class="cdtg" role="group" aria-label="Roles">'+tabs.map(function(u){var ic=u==='com'?'📢':(typeof USES==='object'&&USES[u]&&USES[u].ico)||'🔓',n=(typeof CD_SH==='object'&&CD_SH[u])||u,st='',on=false;
  try{if(u==='com'){var t=typeof comTiers==='function'?comTiers():[];on=t.length>0;st=on?'Plan activo':'Gratis: 1 al día'}else{var e=accEnd(u);on=e>now;var vk='';if(['merc','home','car'].indexOf(u)>=0&&S.plan&&S.plan.acc){var A=S.plan.acc,ev=+A[u]||0,e1=+A[u+'1']||0;vk=e===ev?(u==='merc'?'Varios negocios':'Varios'):e===e1?(u==='merc'?'Un negocio':'Uno'):u!=='merc'?'Incluido en Comerciante':''}st=on?(vk?vk+' · ':'')+'Activo hasta el '+fd(e):'Sin activar'/* v339: dice si es Uno o Varios */}}catch(x){st=''}
  var sel=!!window.cdPick&&u===String(cdU).replace(/1$/,'')/* v313 */;
  return '<button type="button" class="cdti" data-act="cdTab" data-v="'+u+'" aria-pressed="'+sel+'"><i aria-hidden="true">'+ic+'</i><b>'+n+'</b>'+(st?'<small class="'+(on?'on':'')+'">'+st+'</small>':'')+'</button>'}).join('')+'</div>'};
