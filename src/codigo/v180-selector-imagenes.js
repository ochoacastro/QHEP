/* v180: selector de imágenes con el diseño de la página + miniaturas (todos los input[type=file] de imágenes) */(function(){
const st=document.createElement('style');st.textContent='.fpk-in{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;overflow:hidden!important;pointer-events:none!important;margin:0!important;padding:0!important;border:0!important;flex:none!important}'+
'.fpk{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;margin:6px 0;flex:1 1 150px;min-width:0}'+
'.fpk-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;border:1.5px dashed var(--line2,#c9d3ea);background:transparent;color:inherit;font:inherit;font-weight:700;cursor:pointer;transition:border-color .15s,box-shadow .2s,transform .15s}'+
'.fpk-btn:hover,.fpk-btn:focus-visible{border-color:var(--rio,#3A5BFF);box-shadow:0 0 0 4px #3A5BFF26;outline:none}.fpk-btn:active{transform:scale(.98)}.fpk-btn[disabled]{opacity:.5;cursor:not-allowed;box-shadow:none}'+
'.fpk-nm{font-size:14px;opacity:.8;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1 1 120px}'+
'.fpk-th{display:flex;flex-wrap:wrap;gap:8px;width:100%}.fpk-th:empty{display:none}.fpk-t{position:relative;width:72px;height:72px;border-radius:12px;overflow:hidden;border:1px solid var(--line2,#c9d3ea);background:#0001;flex:none}.fpk-t img{width:100%;height:100%;object-fit:cover;display:block}.fpk-t .fpk-m{position:absolute;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.62);color:#fff;font-size:15px;font-weight:800}';
document.head.appendChild(st);
function enh(i){if(i.dataset.fpk||i.hidden||i.closest('.cfile')||!/image/.test(i.accept||''))return;i.dataset.fpk='1';
const multi=i.multiple,none='Ninguna foto elegida',skipTh=!!(i.previousElementSibling&&i.previousElementSibling.classList.contains('cmprev'))||i.classList.contains('cimf');
const w=document.createElement('div');w.className='fpk';
const bt=document.createElement('button');bt.type='button';bt.className='fpk-btn';bt.disabled=i.disabled;bt.innerHTML='<span aria-hidden="true">📷</span><span>'+(multi?'Elegir fotos':'Elegir foto')+'</span>';bt.onclick=()=>i.click();
const nm=document.createElement('span');nm.className='fpk-nm';nm.textContent=none;
const th=document.createElement('div');th.className='fpk-th';
w.append(bt,nm,th);i.classList.add('fpk-in');i.after(w);
let urls=[];
const clear=()=>{urls.forEach(u=>URL.revokeObjectURL(u));urls=[];th.innerHTML='';nm.textContent=none};
i.addEventListener('change',()=>{const fs=[...i.files];clear();if(!fs.length)return;nm.textContent=fs.length===1?fs[0].name:fs.length+' fotos elegidas';
if(!skipTh)fs.slice(0,6).forEach((f,k)=>{const u=URL.createObjectURL(f);urls.push(u);const t=document.createElement('span');t.className='fpk-t';const im=document.createElement('img');im.alt='';im.src=u;t.appendChild(im);if(k===5&&fs.length>6)t.insertAdjacentHTML('beforeend','<span class="fpk-m">+'+(fs.length-5)+'</span>');th.appendChild(t)});
setTimeout(()=>{if(!i.isConnected||!i.files.length)clear()},700)});
}
let q=0;const scan=()=>{q=0;document.querySelectorAll('input[type=file]:not([data-fpk])').forEach(enh)};
new MutationObserver(()=>{if(!q)q=requestAnimationFrame(scan)}).observe(document.body,{childList:true,subtree:true});scan()})()