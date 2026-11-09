
/* v278: el administrador escribe las redes de Mi Pradera en Administrar → Configuración (se guardan en meta/site.soc).
   El pie de página muestra un botón cuadrado por cada red configurada y «© año Mi Pradera. Todos los derechos reservados.»
   Si algo falla, borra este <script> y su <style>. */
(function(){
var NET=[
 ['fb','Facebook','facebook.com/','<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fl" d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v9h4v-9h3l1-4h-4V9c0-.6.4-1 1-1z"/></svg>','Ej: facebook.com/mipradera'],
 ['ig','Instagram','instagram.com/','<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="st" x="3" y="3" width="18" height="18" rx="5"/><circle class="st" cx="12" cy="12" r="4"/><circle class="fl" cx="17.5" cy="6.5" r="1.2"/></svg>','Ej: @mipradera'],
 ['tt','TikTok','tiktok.com/@','<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fl" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>','Ej: @mipradera'],
 ['wa','WhatsApp','','<svg viewBox="0 0 24 24" aria-hidden="true"><path class="st" d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path class="st" d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.4-1.9-1.3-2.3-2.3l.8-1-1-2z"/></svg>','Ej: 3001234567 o el enlace del canal'],
 ['yt','YouTube','youtube.com/@','<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fl" d="M2 8.5A3.5 3.5 0 0 1 5.5 5h13A3.5 3.5 0 0 1 22 8.5v7a3.5 3.5 0 0 1-3.5 3.5h-13A3.5 3.5 0 0 1 2 15.5zM10 9v6l5-3z" fill-rule="evenodd"/></svg>','Ej: @mipradera'],
 ['x','X','x.com/','<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fl" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>','Ej: @mipradera']
];
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function soc(){try{return (S&&S.site&&S.site.soc)||{}}catch(e){return {}}}
/* convierte lo que escribió el administrador (enlace, @usuario o número) en un enlace seguro */
function url(k,v){v=String(v||'').trim();if(!v)return '';
 if(/^https?:\/\//i.test(v))return v;
 if(k==='wa'){var d=v.replace(/\D/g,'');if(/^(chat|whatsapp)\.|wa\.me/i.test(v))return 'https://'+v;if(d.length===10)d='57'+d;return d.length>=11?'https://wa.me/'+d:''}
 if(/^[a-z0-9.-]+\.[a-z]{2,}\//i.test(v))return 'https://'+v;
 var u=v.replace(/^@/,'').replace(/[^\w.\-]/g,'');if(!u)return '';
 var n=NET.filter(function(x){return x[0]===k})[0];return 'https://'+n[2]+u}
function paint(){var f=document.querySelector('footer');if(!f)return;var s=soc(),h='';
 NET.forEach(function(n){var u=url(n[0],s[n[0]]);if(u)h+='<a href="'+E(u)+'" target="_blank" rel="noopener" aria-label="Mi Pradera en '+n[1]+'" title="'+n[1]+'">'+n[3]+'</a>'});
 var key=h+'|'+new Date().getFullYear();if(f.__soc===key)return;f.__soc=key;
 var w=f.querySelector('.qsocw');if(!w){w=document.createElement('div');w.className='qsocw';var ct=f.querySelector(':scope>.qctw');f.insertBefore(w,ct?ct.nextSibling:f.firstChild)/* v393: siempre después del bloque de contacto */}
 w.innerHTML=h?'<p class="qsoc-h">Síguenos</p><div class="qsoc">'+h+'</div>':'';
 var c=f.querySelector('.qcopy');if(!c){c=document.createElement('div');c.className='qcopy';f.appendChild(c)}
 c.textContent='© '+new Date().getFullYear()+' Mi Pradera. Todos los derechos reservados.'}
/* administración: tarjeta en Administrar → Configuración */
window.socAdmin=function(){var s=soc();return '<div class="cg socadm"><h3>Redes sociales de Mi Pradera</h3><p class="muted">Aparecen como botones al final de la página. Escribe el enlace completo o solo el usuario (@mipradera). Para WhatsApp, el número o el enlace del canal. Deja vacío lo que no uses.</p>'+
 NET.map(function(n){return '<div class="socr"><label for="soc-'+n[0]+'">'+n[1]+'</label><input id="soc-'+n[0]+'" type="text" maxlength="200" inputmode="url" autocomplete="off" value="'+E(s[n[0]]||'')+'" placeholder="'+E(n[4])+'"></div>'}).join('')+
 '<p class="err" id="soc-err" role="alert"></p><div class="row" style="margin-top:8px"><button type="button" class="btn pink" data-socsave="1">Guardar redes</button></div></div>'};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-socsave]');if(!b)return;
 var o={},bad='';NET.forEach(function(n){var el=document.getElementById('soc-'+n[0]);var v=el?el.value.trim().slice(0,200):'';if(v){if(!url(n[0],v))bad=bad||n[1];o[n[0]]=v}});
 var er=document.getElementById('soc-err');if(bad){if(er)er.textContent='Revisa '+bad+': no parece un enlace, usuario o número válido.';return}
 try{S.site=Object.assign({},S.site,{soc:o});save();render(true);toast('Redes sociales guardadas')}catch(x){if(er)er.textContent='No se pudo guardar. Intenta de nuevo.'}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',paint);else setTimeout(paint,0);
setInterval(paint,1500);
window.socPaint=paint;
})();
