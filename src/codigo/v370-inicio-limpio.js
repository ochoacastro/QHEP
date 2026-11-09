
/* v370: INICIO LIMPIO. La pantalla principal tenía unas 14 secciones seguidas. Ahora:
   - Sin la franja negra de arriba («Mi Pradera · Vende…»).
   - Título grande y buscador como protagonista; sin los botones verdes repetidos (Publicar está abajo y el registro de
     negocio está en el banner).
   - Íconos de categorías sobrios: fondo gris claro e ícono de color, sin sombras.
   - Las secciones vacías (noticias o avisos sin publicaciones) no se muestran; «Explora Pradera» se quita porque el Mapa y
     las Guías ya están en los íconos.
   - Más aire entre secciones; «Ver todas ›» como enlace simple.
   - «Escríbenos» del pie se abre con un botón en vez de mostrar todo el formulario.
   Solo cambia la vista (CSS y clases). Si algo falla, borra este bloque y vuelve el diseño anterior. */
(function(){
document.head.insertAdjacentHTML('beforeend','<style id="v370-css">'+
'html.qcl #annc{display:none}'+
'html.qcl:not(.dark) body,html.qcl:not(.dark) main#app{background:#fff!important}'+
'html.qcl .hub{gap:0;padding-top:8px}'+
'html.qcl .hub>*{margin-top:44px!important}html.qcl .hub>.hubhero{margin-top:0!important}html.qcl .hub>.hubg{margin-top:28px!important}'+
'html.qcl .hubhero{background:none!important;box-shadow:none!important;border:0!important;padding:36px 2px 0!important}'+
'html.qcl .hubhero h2{font-size:clamp(34px,10vw,52px)!important;line-height:1.04!important;letter-spacing:-.035em!important;font-weight:800!important;margin:0 0 12px!important}'+
'html.qcl .hubhero>p{font-size:17px!important;line-height:1.45!important;color:#6e6e73!important;max-width:30ch;margin:0 auto 26px!important}'+
'html.qcl .hubhero .hhr,html.qcl .hubhero .hhr2,html.qcl .hubhero .hhl{display:none!important}'+
'html.qcl .hneed{margin-top:14px!important}html.qcl .hneed button{border:0!important;background:#f2f2f4!important;font-weight:500!important}'+
'html.qcl .hubg{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:22px 12px!important}'+
'html.qcl .hubt{font-weight:500!important;font-size:12.5px!important;color:#1d1d1f!important;gap:8px!important}'+
'html.qcl .hubi{background:#f2f2f4!important;box-shadow:none!important;border-radius:22%!important;max-width:76px!important;filter:none!important}'+
'html.qcl .hubi svg{color:var(--c)!important;stroke:var(--c)!important;width:44%!important;height:44%!important}'+
'html.qcl .hubp.qcl-x,html.qcl .hubp.qcl-exp{display:none!important}'+
'html.qcl .hubph h2{font-size:24px!important;letter-spacing:-.02em!important;font-weight:800!important}'+
'html.qcl .hubph .btn.ghost{border:0!important;background:none!important;text-transform:none!important;letter-spacing:0!important;font-weight:600!important;font-size:15px!important;padding:6px 0!important;min-height:0!important;box-shadow:none!important;color:#0066cc!important}'+
'html.qcl .hswh{display:none!important}'+
'.qcl-ct{display:block;width:100%;max-width:680px;margin:8px auto 18px;padding:18px;border:1px solid #d2d2d7;background:none;font:inherit;font-size:16px;font-weight:600;color:var(--ink,#1d1d1f);text-align:left;cursor:pointer}'+
'.qcl-ct span{float:right;color:#0066cc}.qctw.qcl-h{display:none}'+
'html.dark.qcl .hubhero>p{color:#a1a1a6!important}html.dark.qcl .hubt{color:#f5f5f7!important}'+
'html.dark.qcl .hubi svg{color:color-mix(in srgb,var(--c) 62%,#fff)!important;stroke:color-mix(in srgb,var(--c) 62%,#fff)!important}'+
'html.dark.qcl .hubi{background:#1c1c1e!important}html.dark.qcl .hneed button{background:#1c1c1e!important;color:#f5f5f7!important}'+
'html.dark.qcl .hubph .btn.ghost,html.dark .qcl-ct span{color:#4da3ff!important}html.dark .qcl-ct{border-color:#3a3a3c;color:#f5f5f7}'+
'@media (prefers-color-scheme:dark){html:not(.light).qcl .hubi{background:#1c1c1e}}'+
'</style>');
function tidy(){var h=document.querySelector('.hub');document.documentElement.classList.toggle('qcl',!!h);
 if(h)[].forEach.call(h.querySelectorAll(':scope>section.hubp'),function(s){
  if(s.querySelector('.hexp')){s.classList.add('qcl-exp');return}
  var empty=!!s.querySelector('.nwc0')||(!!s.querySelector('.cg>p.muted')&&/^Aquí aparecen/.test(s.querySelector('.cg>p.muted').textContent.trim())&&!s.querySelector('article,.card,.cmc,.nwi,img'));
  s.classList.toggle('qcl-x',empty)});
 var w=document.querySelector('.qctw');if(w&&!w.dataset.qcl){w.dataset.qcl='1';w.classList.add('qcl-h');var b=document.createElement('button');b.type='button';b.className='qcl-ct';b.setAttribute('aria-expanded','false');
  b.innerHTML='Escríbenos: comentarios, sugerencias o errores<span aria-hidden="true">+</span>';
  b.addEventListener('click',function(){var o=w.classList.toggle('qcl-h');b.setAttribute('aria-expanded',String(!o));b.querySelector('span').textContent=o?'+':'−';if(!o){var f=w.querySelector('input,select,textarea');f&&f.focus()}});
  w.parentNode.insertBefore(b,w)}}
var t=0;new MutationObserver(function(){if(t)return;t=1;requestAnimationFrame(function(){t=0;tidy()})}).observe(document.documentElement,{childList:true,subtree:true});tidy();
})();
