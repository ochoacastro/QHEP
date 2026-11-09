
/* v337: la información de la tienda (página de la tienda) en una ficha ordenada: encabezado con nombre, descripción,
   etiquetas, sellos y calificación; luego filas con icono (ubicación, horario con estado abierto/cerrado, teléfono,
   domicilios y medios de pago). La página de la tienda llama a shopInfo(s): no borres este bloque. */
(function(){
var E=function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var SV=function(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};
var IC={pin:SV('<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>'),
 clock:SV('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
 phone:SV('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'),
 truck:SV('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>'),
 card:SV('<rect width="20" height="14" x="2" y="5" rx="0"/><path d="M2 10h20"/>')};
function row(ic,lb,val,extra){return '<div class="si-r"><span class="si-i">'+ic+'</span><div class="si-v"><div class="si-l">'+lb+(extra||'')+'</div>'+val+'</div></div>'}
function txt(h){var d=document.createElement('div');d.innerHTML=h||'';return d.textContent.replace(/^[\s·•]+/,'').trim()}
window.shopInfo=function(s){var o='<div class="sinfo">';
 o+='<div class="si-hd"><h3>'+E(s.name)+'</h3>'+(s.desc?'<p>'+E(s.desc)+'</p>':'')+
  ((s.tags||[]).length?'<div class="si-tags">'+s.tags.map(function(t){return '<span>#'+E(t)+'</span>'}).join('')+'</div>':'')+
  '<div class="si-bd">'+badge(s)+' '+rateLine(s)+'</div>'+socHTML(s)+'</div>';
 var rows='';
 if(s.addr||s.zone)rows+=row(IC.pin,'Ubicación','<div class="si-t">'+E(s.addr||s.zone)+'</div>'+(s.addr&&s.zone?'<small>Barrio '+E(s.zone)+'</small>':''));
 var ht=hoursTxt(s);if(ht){var st=txt(openBadge(s)),on=/abierto/i.test(st);
  var L=String(ht).split(' · ').map(function(x){var k=x.indexOf(': ');return k>0?'<li><b>'+E(x.slice(0,k))+'</b><span>'+E(x.slice(k+2))+'</span></li>':'<li><span>'+E(x)+'</span></li>'}).join('');
  rows+=row(IC.clock,'Horario','<ul class="si-h">'+L+'</ul>',st?'<em class="si-st '+(on?'on':'off')+'">'+E(st)+'</em>':'')}
 if(s.wa2)rows+=row(IC.phone,'Otro teléfono','<a class="si-t" href="tel:'+E(s.wa2)+'">'+E(s.wa2)+'</a>');
 if(s.delivery)rows+=row(IC.truck,'Domicilios','<div class="si-t">'+E(s.delivery)+E(delFeeTxt(s))+'</div>');
 var pt=paysTxt(s);if(pt)rows+=row(IC.card,'Medios de pago','<div class="si-pay">'+pt.split(' · ').map(function(x){return '<span>'+E(x)+'</span>'}).join('')+'</div>');
 if(rows)o+='<div class="si-rows">'+rows+'</div>';
 if(s.hidden)o+='<p class="si-hid">Oculta por el administrador</p>';
 return o+'</div>'};
})();
