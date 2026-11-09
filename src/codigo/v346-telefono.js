
/* v346: los teléfonos de Colombia se guardan con 10 dígitos, sin el indicativo 57 (si alguien escribe +57 315…, queda 315…).
   WhatsApp agrega el 57 solo al abrir el chat. La usan la dirección principal, la tienda nueva, editar tienda y el administrador. */
/* v362: al eliminar la cuenta se borra también lo que quedó guardado en este teléfono: dirección y teléfono (qh_dir_), datos de
   emergencia (qh_emg_), borradores, notificaciones, avisos vistos y preferencias de esa cuenta. Así, si se registra otra vez, empieza de cero. */
window.wipeLocal=function(k){try{var del=[],i,n;for(i=0;i<localStorage.length;i++){n=localStorage.key(i);if(!n)continue;
 if((k&&n.indexOf(k)>=0)||/^qh_(pseen|cseen)_/.test(n)||['qh_notif','qh_gdr','qh_cmg','qh_ct_last'].indexOf(n)>=0)del.push(n)}
 del.forEach(function(x){try{localStorage.removeItem(x)}catch(e){}})}catch(e){}};
window.telCO=function(v){var d=String(v==null?'':v).replace(/\D/g,'');if(d.length===12&&d.slice(0,2)==='57')d=d.slice(2);else if(d.length===13&&d.slice(0,3)==='057')d=d.slice(3);return d.slice(0,15)};
/* v348: el teléfono de «Tu dirección principal» y el de «Mis datos» son el mismo: al guardar uno se actualiza el otro.
   Quien ya lo había guardado solo en la dirección lo ve también en Mis datos al abrir la página. */
window.waSync=function(w){try{var u=S.user;w=telCO(w);if(!u||w.length<7||u.wa===w)return;if(typeof pfLock==='function'&&pfLock(u))return;
 QH.key();u.wa=w;save();try{var cu=QH.authCur();if(cu&&!cu.isAnonymous&&typeof dnRead==='function'){var o=dnRead(cu);cu.updateProfile({displayName:JSON.stringify({n:u.name,e:o.e||u.email||'',w:w})}).catch(function(){})}}catch(e){}
 try{QH.planProf(u.name,w)}catch(e){}try{syncUI()}catch(e){}}catch(e){}};
setInterval(function(){try{if(!S.user||S.user.wa||MODE==='admin')return;var k=QH.key();if(!k)return;var o=JSON.parse(localStorage.getItem('qh_dir_'+k)||'{}');if(o&&o.tel)waSync(o.tel)}catch(e){}},3000);
