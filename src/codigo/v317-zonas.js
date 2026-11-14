
/* v317: Pradera se divide en zona urbana (barrios) y zona rural (corregimientos).
   - En los formularios (tienda, anuncio, servicio y clasificado) el barrio se elige de una lista con dos grupos;
     «Otro lugar» deja escribirlo como antes. Se sigue guardando el nombre en el mismo campo «zone».
   - En los filtros aparecen «Toda la zona urbana» y «Toda la zona rural», y los lugares agrupados.
   - El administrador corrige la lista en Configuración (S.site.zonas). La lista inicial sale de los listados de la Alcaldía.
   Usa znOk() y znOpts() desde los filtros de la página. */
(function(){
var URB0=['Centro','Alto del Castillo','Antonio Ricaurte','Bello Horizonte','Berlín','El Bolito','El Cairo','El Jardín','Jorge Eliécer Gaitán','La Bodega','La Colina','La Esperanza','La Libertad','La Lorena','La Michela','La Misericordia','Las Vegas','Los Comuneros','Manuel José Ramírez','Marsella','Oriente','Panchinita','Primero de Mayo','Provivienda','Puertas del Sol','Puerto Nuevo','San José','San Roque','Serrezuela','Villamarina','Bosques de la Colina','Bosques de la Pradera','El Prado','La María I','La María II','Las Margaritas','Portal de Castilla'];
var RUR0=['Arenillo','Bolívar','Bolo Azul','Bolo Blanco','Bolo Hartonal','El Líbano','El Nogal','El Recreo','El Retiro','La Carbonera','La Feria','La Floresta','La Fría','La Granja','La Ruiza','La Tupia','Lomitas','Los Pinos','Párraga','Potrerito','San Antonio','San Isidro','Vallecito'];
var nm=function(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/^(barrio|urbanizacion|urb\.?|corregimiento|correg\.?|vereda)\s+/,'').replace(/\s+/g,' ').trim()};
function lists(){var z=(typeof S==='object'&&S.site&&S.site.zonas)||{};var u=Array.isArray(z.urb)&&z.urb.length?z.urb:URB0,r=Array.isArray(z.rur)&&z.rur.length?z.rur:RUR0;
 var sort=function(l){return l.slice().sort(function(a,b){return a==='Centro'?-1:b==='Centro'?1:a.localeCompare(b,'es')})};return {urb:sort(u),rur:sort(r)}}
window.znArea=function(z){var k=nm(z);if(!k)return '';var L=lists();if(L.urb.some(function(x){return nm(x)===k}))return 'urb';if(L.rur.some(function(x){return nm(x)===k}))return 'rur';
 if(/^(corregimiento|vereda)\b/i.test(String(z).trim()))return 'rur';return ''};
window.znOk=function(z,f){if(!f)return true;if(f==='@urb')return znArea(z)==='urb';if(f==='@rur')return znArea(z)==='rur';return String(z||'').trim()===f};
var E=function(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
/* opciones de un filtro: las zonas que tienen publicaciones, agrupadas */
window.znOpts=function(have,sel){var g={urb:[],rur:[],otr:[]};(have||[]).forEach(function(z){g[znArea(z)||'otr'].push(z)});
 var o=function(v,t){return '<option value="'+E(v)+'"'+(sel===v?' selected':'')+'>'+E(t)+'</option>'};
 var h='';if(g.urb.length)h+=o('@urb','Toda la zona urbana');if(g.rur.length)h+=o('@rur','Toda la zona rural');
 if(g.urb.length)h+='<optgroup label="Zona urbana · barrios">'+g.urb.map(function(z){return o(z,z)}).join('')+'</optgroup>';
 if(g.rur.length)h+='<optgroup label="Zona rural · corregimientos">'+g.rur.map(function(z){return o(z,z)}).join('')+'</optgroup>';
 if(g.otr.length)h+='<optgroup label="Otros lugares">'+g.otr.map(function(z){return o(z,z)}).join('')+'</optgroup>';return h};
/* formularios: el campo de texto del barrio se vuelve una lista con «Otro lugar» */
var IDS=['cm-z','x-zone','af-zone','v-zone','ad-zone','iv-zone'/* v416: pedido sin registro */]/* v322: también la dirección de entrega */;
function enhance(i){if(i.dataset.zn)return;i.dataset.zn='1';var L=lists(),v=i.value.trim(),hit='';
 [].concat(L.urb,L.rur).forEach(function(x){if(nm(x)===nm(v))hit=x});
 var opt=function(x){return '<option'+(hit===x?' selected':'')+'>'+E(x)+'</option>'};
 var s=document.createElement('select');s.className='znsel';s.setAttribute('aria-label','Barrio o corregimiento');
 s.innerHTML='<option value="">Elige el barrio o corregimiento…</option><optgroup label="Zona urbana · barrios">'+L.urb.map(opt).join('')+'</optgroup><optgroup label="Zona rural · corregimientos">'+L.rur.map(opt).join('')+'</optgroup><option value="@otro"'+(v&&!hit?' selected':'')+'>Otro lugar (escribirlo)</option>';
 var w=document.createElement('div');w.className='znw';i.parentNode.insertBefore(w,i);w.appendChild(s);w.appendChild(i);
 if(hit)i.value=hit;i.hidden=!(v&&!hit);if(!i.hidden)i.placeholder='Escribe el barrio, vereda o lugar';
 var lb=document.querySelector('label[for="'+i.id+'"]');if(lb){lb.setAttribute('for','');lb.addEventListener('click',function(){s.focus()});if(/barrio|ubicaci/i.test(lb.textContent)&&!/corregimiento/i.test(lb.textContent))lb.firstChild&&(lb.firstChild.textContent=lb.firstChild.textContent.replace(/\(barrio o vereda\)|Barrio o zona/,function(m){return m[0]==='('?'(barrio o corregimiento)':'Barrio o corregimiento'}))}
 i.addEventListener('change',function(){var v2=i.value.trim(),h2='';if(s.value==='@otro'&&!i.hidden)return;[].concat(L.urb,L.rur).forEach(function(x){if(nm(x)===nm(v2))h2=x});if(h2)i.value=h2;s.value=h2||(v2?'@otro':'');i.hidden=!(v2&&!h2)});/* si el campo se llena desde un borrador, la lista lo muestra */
 s.addEventListener('change',function(){if(s.value==='@otro'){i.hidden=false;i.value='';i.placeholder='Escribe el barrio, vereda o lugar';i.focus()}else{i.hidden=true;i.value=s.value}i.dispatchEvent(new Event('input',{bubbles:true}))})}
function scan(){IDS.forEach(function(id){var i=document.getElementById(id);if(i&&i.tagName==='INPUT')enhance(i)})}
new MutationObserver(function(){scan()}).observe(document.documentElement,{childList:true,subtree:true});
/* administrador: corregir la lista */
window.znAdmin=function(){var L=lists();return '<div class="cg znadm"><h3>Barrios y corregimientos</h3><p class="muted">Pradera se divide en zona urbana (barrios) y zona rural (corregimientos). Estas listas salen en los formularios y en los filtros. Escribe un nombre por línea.</p><div class="znc"><div><label for="zn-u">Zona urbana · barrios ('+L.urb.length+')</label><textarea id="zn-u">'+E(L.urb.join('\n'))+'</textarea></div><div><label for="zn-r">Zona rural · corregimientos ('+L.rur.length+')</label><textarea id="zn-r">'+E(L.rur.join('\n'))+'</textarea></div></div><p class="err" id="zn-err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-znsave="1">Guardar lista</button><button type="button" class="btn ghost" data-znreset="1">Volver a la lista inicial</button></div></div>'};
function rd(id){var t=document.getElementById(id);var seen={};return (t?t.value:'').split('\n').map(function(x){return x.trim().replace(/\s+/g,' ').slice(0,40)}).filter(function(x){var k=nm(x);if(!x||seen[k])return false;seen[k]=1;return true}).slice(0,150)}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-znsave],[data-znreset]');if(!b)return;var er=document.getElementById('zn-err');
 try{var z;if(b.dataset.znreset){z={urb:[],rur:[]}}else{z={urb:rd('zn-u'),rur:rd('zn-r')};if(!z.urb.length||!z.rur.length){if(er)er.textContent='Cada lista necesita al menos un nombre.';return}}
  S.site=Object.assign({},S.site,{zonas:z});save();render(true);toast(b.dataset.znreset?'Lista inicial restaurada':'Barrios y corregimientos guardados')}catch(x){if(er)er.textContent='No se pudo guardar. Intenta de nuevo.'}});
})();
