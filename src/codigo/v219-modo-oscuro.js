
/* v219: MODO OSCURO DE VERDAD. Antes se invertian los colores de toda la pagina (filter:invert) y luego se volvian a invertir
   las imagenes; esa doble inversion no es exacta y cambiaba los colores intensos de las fotos (p. ej. el rosado salia morado).
   Ahora: 1) se borran las reglas "html.dark{filter:...}" (las imagenes ya no pasan por ningun filtro);
   2) se lee cada regla de estilo y se crea su version oscura en <style id="v219-oscuro-generado">: fondos claros -> oscuros,
   textos oscuros -> claros, bordes suaves; los colores de marca (azul, verde de WhatsApp, colores de categorias) se conservan;
   3) tambien se procesan los estilos que la pagina agrega despues y los colores escritos en style="..." de cada elemento.
   Si este script falla, la pagina sigue usando el modo oscuro anterior (invertido). Para volver al anterior a proposito, borra SOLO este <script>. */
(function(){try{
var H=document.documentElement,OUT=null,done=new WeakSet(),killed=false,css=[];
/* ---------- colores ---------- */
function clamp(x){return x<0?0:x>1?1:x}
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;var mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,h=0,s=0,d=mx-mn;if(d){s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h/=6}return[h,s,l]}
function hsl2rgb(h,s,l){if(!s){var v=Math.round(l*255);return[v,v,v]}function f(p,q,t){if(t<0)t+=1;if(t>1)t-=1;return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p}var q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;return[Math.round(f(p,q,h+1/3)*255),Math.round(f(p,q,h)*255),Math.round(f(p,q,h-1/3)*255)]}
function parse(c){c=c.trim().toLowerCase();var m;
 if(c==='white')return[255,255,255,1];if(c==='black')return[0,0,0,1];
 if((m=c.match(/^#([0-9a-f]{3,8})$/))){var x=m[1];if(x.length<5)x=x.split('').map(function(k){return k+k}).join('');return[parseInt(x.slice(0,2),16),parseInt(x.slice(2,4),16),parseInt(x.slice(4,6),16),x.length>6?parseInt(x.slice(6,8),16)/255:1]}
 if((m=c.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,\/]+([\d.]+%?))?\s*\)$/))){var a=m[4]==null?1:/%$/.test(m[4])?parseFloat(m[4])/100:parseFloat(m[4]);return[+m[1],+m[2],+m[3],a]}
 return null}
function out(r,a){return a>=1?'rgb('+r[0]+', '+r[1]+', '+r[2]+')':'rgba('+r[0]+', '+r[1]+', '+r[2]+', '+(+a.toFixed(3))+')'}
/* role: b=fondo, f=texto/icono, l=borde/linea */
function shift(c,role){var p=parse(c);if(!p)return c;var hsl=rgb2hsl(p[0],p[1],p[2]),h=hsl[0],s=hsl[1],l=hsl[2];
 if(role==='b'){if(l>.55){l=.07+(1-l)*.55;s=s*.75}else return c}
 else if(role==='f'){if(l<.5){l=.93-l*.6}else return c}
 else if(role==='l'){if(l>.5){l=.17+(1-l)*.45;s=s*.6}else if(l<.2&&p[3]<.5){return out([255,255,255],Math.min(.16,p[3]*1.2))}else return c}
 return out(hsl2rgb(h,clamp(s),clamp(l)),p[3])}
var COLRE=/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\bwhite\b|\bblack\b/g;
function mapVal(v,role){return v.replace(COLRE,function(c){return shift(c,role)})}
/* valores claros originales de las variables (:root). Si una variable "de texto" (p. ej. --ink) se usa como FONDO, se reemplaza por su
   valor original tratado como fondo (sigue oscura); y una variable "de fondo" usada como TEXTO, por su valor tratado como texto */
var VARS={};
function fixVars(v,role){if(v.indexOf('var(')<0||role==='keep')return v;return v.replace(/var\(\s*(--[\w-]+)\s*(?:,[^()]*(?:\([^()]*\)[^()]*)*)?\)/g,function(m,n){var r=varRole(n),o=VARS[n];if(!o||!r)return m;if((role==='b'&&r==='f')||(role==='f'&&r==='b'))return mapVal(o,role);return m})}
var ROLE={'color':'f','background-color':'b','background-image':'b','border-top-color':'l','border-right-color':'l','border-bottom-color':'l','border-left-color':'l','outline-color':'l','fill':'f','stroke':'f','caret-color':'f','text-decoration-color':'f','column-rule-color':'l','box-shadow':'keep','text-shadow':'keep','accent-color':'keep'};
function varRole(n){n=n.toLowerCase();if(/ink|text|obsidian|carbon|iron|graphite|slate|pewter|silver|muted|fg|sapphire|cornflower|link/.test(n))return 'f';if(/line|mist|border|veil/.test(n))return 'l';if(/bg|card|canvas|white|fog|surface|ice|wash|paper/.test(n))return 'b';return ''}
/* Se copian TODAS las declaraciones de color (aunque no cambien) para que entre las reglas oscuras se respete la misma prioridad que en claro */
var SHORT={'background':'b','border':'l','border-color':'l','border-top':'l','border-right':'l','border-bottom':'l','border-left':'l','outline':'l'};
function ruleCSS(st){var o='',any=false;
 /* atajos con var() (p. ej. background:var(--rio)): el navegador no los separa en partes, asi que se copian enteros */
 for(var sh in SHORT){var sv=st.getPropertyValue(sh);if(sv&&sv.indexOf('var(')>-1){var imp=st.getPropertyPriority(sh)?' !important':'';
  if(sh==='background'){var nsv=fixVars(mapVal(sv,'b'),'b');if(nsv!==sv)any=true;o+='background:'+nsv+imp+';'}
  else{/* de bordes y contornos solo se copia el color (el grosor y el estilo siguen saliendo de la regla original) */var cm=sv.match(/var\((?:[^()]|\([^()]*\))*\)|#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g);if(cm){var cv=mapVal(cm[cm.length-1],'l');o+=(sh==='outline'?'outline-color':sh==='border'||sh==='border-color'?'border-color':sh+'-color')+':'+cv+imp+';'}}}}
 for(var i=0;i<st.length;i++){var p=st[i],v=st.getPropertyValue(p),pr=st.getPropertyPriority(p);if(!v)continue;
  var cust=p.indexOf('--')===0,role=cust?varRole(p):ROLE[p];if(!role)continue;var lit=/#[0-9a-fA-F]{3,8}\b|rgba?\(|\bwhite\b|\bblack\b/.test(v);
  if(cust&&!lit)continue;if(cust&&/^(?::root|html)$/.test(st.parentRule&&st.parentRule.selectorText||''))VARS[p]=v.trim();
  var nv=(lit&&role!=='keep')?mapVal(v,role):v;if(!cust)nv=fixVars(nv,role);if(nv!==v)any=true;o+=p+':'+nv+(pr?' !important':'')+';'}return any||o&&o.length<4000?o:''}
function walk(rules,acc){for(var i=0;i<rules.length;i++){var r=rules[i];
  if(r.type===1){if(/html\.dark/.test(r.selectorText))continue;var d=ruleCSS(r.style);if(d)acc.push('html.dark '+scope(r.selectorText)+'{'+d+'}')}
  else if(r.type===4){var a=[];walk(r.cssRules,a);if(a.length)acc.push('@media '+r.media.mediaText+'{'+a.join('')+'}')}
  else if(r.type===12){var b=[];walk(r.cssRules,b);if(b.length)acc.push('@supports '+r.conditionText+'{'+b.join('')+'}')}}}
/* antepone html.dark a cada selector para que solo aplique en oscuro y gane por especificidad */
function scope(sel){return sel.split(/,(?![^(]*\))/).map(function(x){x=x.trim();if(/^:root\b/.test(x))return x.replace(/^:root/,'');if(/^html\b/.test(x))return x.replace(/^html/,'');return ' '+x}).join(',html.dark')}
/* borra las reglas viejas de inversion (html.dark{filter...}) */
function kill(sh){try{var rs=sh.cssRules;for(var i=rs.length-1;i>=0;i--){var r=rs[i];if(r.type===1&&/html\.dark/.test(r.selectorText)&&r.style.filter){r.style.removeProperty('filter');if(/^html\.dark$/.test(r.selectorText.trim()))r.style.removeProperty('background')}}}catch(e){}}
function take(sh){if(!sh||done.has(sh)||(OUT&&sh===OUT.sheet))return;done.add(sh);var rs;try{rs=sh.cssRules}catch(e){return}kill(sh);var a=[];walk(rs,a);if(a.length)css.push(a.join('\n'))}
function flush(){if(!OUT){OUT=document.createElement('style');OUT.id='v219-oscuro-generado'}
 OUT.textContent=':root.dark{color-scheme:dark}html.dark .hmb i{background:#f5f5f7!important}html.dark input,html.dark select,html.dark textarea{background-color:#1c1c1e;color:#f5f5f7;border-color:#3a3a3c}html.dark ::placeholder{color:#8e8e93}\n'+css.join('\n');
 if(OUT.parentNode!==document.head||document.head.lastElementChild!==OUT)document.head.appendChild(OUT)}
function scanAll(){var n=css.length;[].forEach.call(document.styleSheets,take);if(css.length!==n||!OUT||document.head.lastElementChild!==OUT)flush()}
/* colores escritos en style="..." */
var IN=/(background(?:-color)?|color|border(?:-[a-z]+)?-?color|border)\s*:\s*([^;]+)/g;
function inl(el){var s=el.getAttribute('style');if(!s||!/#[0-9a-fA-F]{3,8}\b|rgba?\(|\bwhite\b|\bblack\b/.test(s))return;
 if(H.classList.contains('dark')){if(el.dataset.dkO==null)el.dataset.dkO=s;var o=el.dataset.dkO,n=o.replace(IN,function(m,p,v){var role=/^color$/.test(p)?'f':/border/.test(p)?'l':'b';return p+':'+mapVal(v,role)});if(n!==s)el.setAttribute('style',n)}
 else if(el.dataset.dkO!=null){el.setAttribute('style',el.dataset.dkO);delete el.dataset.dkO}}
function inlAll(root){if(root.nodeType!==1)return;if(root.hasAttribute('style'))inl(root);var l=root.querySelectorAll('[style]');for(var i=0;i<l.length;i++)inl(l[i])}
scanAll();
new MutationObserver(function(ms){var st=false;for(var i=0;i<ms.length;i++){var m=ms[i];
 if(m.type==='attributes'){if(m.target===H&&m.attributeName==='class'){inlAll(document.body||H);continue}if(m.attributeName==='style'&&m.target.dataset.dkO==null)inl(m.target);continue}
 for(var j=0;j<m.addedNodes.length;j++){var n=m.addedNodes[j];if(n.nodeName==='STYLE'||n.nodeName==='LINK'){if(n!==OUT)st=true}else if(n.nodeType===1&&H.classList.contains('dark'))inlAll(n)}}
 if(st)scanAll()}).observe(H,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
document.addEventListener('DOMContentLoaded',function(){scanAll();inlAll(document.body)});
window.addEventListener('load',scanAll);
}catch(e){}})();
