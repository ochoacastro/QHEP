/* v485: IMAGEN DE MUESTRA PARA ANUNCIOS SIN FOTO. Un arriendo, una venta de inmueble o un vehículo sin fotos mostraba «Sin foto» sobre
   un fondo vacío (en la tarjeta de la lista y en el anuncio abierto). Ahora sale un dibujo de línea según el tipo: casa, apartamento
   (también apartaestudio y oficina), habitación, local, bodega, finca, lote; carro (y camioneta), moto o bicicleta. Va en el color del
   tipo de anuncio (--c) sobre un fondo suave, con la etiqueta «Imagen de referencia» para que nadie crea que es una foto del inmueble.
   No cambia adCard ni adView: cambia el contenido de cada <span class="nop"> dentro de .adpic cuando aparece en la página.
   Si algo falla, quita este archivo y su CSS de src/orden.json: vuelve el «Sin foto». */
(function(){
var F='class="f"',G='<path d="M14 150H306"/>',SOL='<circle class="s" cx="266" cy="38" r="13"/><path class="n" d="M196 44a12 12 0 0 1 22-6 9 9 0 0 1 14 8h-36z"/>';
var D={
 casa:SOL+'<path '+F+' d="M112 150V84h96v66z"/><path '+F+' d="M100 88l60-46 60 46"/><path d="M188 66V48h12v27"/><rect '+F+' x="150" y="112" width="20" height="38" rx="2"/><rect x="124" y="96" width="18" height="16" rx="2"/><rect x="178" y="96" width="18" height="16" rx="2"/><path d="M133 96v16M124 104h18M187 96v16M178 104h18"/><circle '+F+' cx="64" cy="104" r="22"/><path d="M64 126v24"/>'+G,
 apto:SOL+'<rect '+F+' x="118" y="40" width="78" height="110" rx="3"/>'+[0,1,2].map(function(i){return [0,1,2,3,4].map(function(j){return '<rect x="'+(130+i*20)+'" y="'+(52+j*16)+'" width="10" height="9" rx="1.5"/>'}).join('')}).join('')+'<rect '+F+' x="150" y="134" width="16" height="16" rx="2"/><rect '+F+' x="206" y="84" width="46" height="66" rx="3"/><path d="M216 98h8M234 98h8M216 114h8M234 114h8M216 130h8M234 130h8"/><circle '+F+' cx="80" cy="112" r="18"/><path d="M80 130v20"/>'+G,
 hab:'<rect '+F+' x="190" y="40" width="54" height="42" rx="3"/><path d="M217 40v42M190 61h54"/><rect '+F+' x="62" y="86" width="22" height="58" rx="4"/><rect '+F+' x="82" y="108" width="140" height="22" rx="6"/><rect x="90" y="98" width="30" height="10" rx="4"/><path d="M136 108c10-8 40-8 86 0"/><path d="M90 130v16M214 130v16"/><rect '+F+' x="238" y="112" width="32" height="34" rx="3"/><path d="M254 112v-14M244 98h20l-4-12h-12z"/>'+G,
 local:SOL+'<rect '+F+' x="92" y="70" width="136" height="80" rx="2"/><path '+F+' d="M84 70h152l-6-20H90z"/><path d="M84 70q9.5 12 19 0q9.5 12 19 0q9.5 12 19 0q9.5 12 19 0q9.5 12 19 0q9.5 12 19 0q9.5 12 19 0q9.5 12 19 0"/><rect '+F+' x="104" y="94" width="60" height="40" rx="2"/><rect '+F+' x="178" y="98" width="34" height="52" rx="2"/><path d="M206 124v4"/>'+G,
 bodega:SOL+'<path '+F+' d="M78 150V82l82-36 82 36v68"/><rect '+F+' x="124" y="96" width="72" height="54" rx="2"/><path d="M124 108h72M124 120h72M124 132h72M124 144h72"/><rect x="92" y="96" width="18" height="12" rx="2"/><rect x="210" y="96" width="18" height="12" rx="2"/>'+G,
 finca:SOL+'<path '+F+' d="M0 150c40-30 90-36 150-18s110 6 170-20v38z"/><path '+F+' d="M170 116v-24h46v24"/><path '+F+' d="M164 96l29-22 29 22"/><rect x="186" y="104" width="12" height="16" rx="1.5"/><circle '+F+' cx="70" cy="98" r="18"/><path d="M70 116v20"/><path d="M232 150v-18M252 150v-18M272 150v-18M292 150v-18M226 140h72"/>'+G,
 lote:SOL+'<path '+F+' d="M40 150l24-34h192l24 34z"/><path d="M64 116v-12M100 116v-12M136 116v-12M172 116v-12M208 116v-12M244 116v-12M256 116v-12M64 108h192"/><path d="M160 116v-50"/><rect '+F+' x="132" y="50" width="56" height="26" rx="3"/><path d="M144 63h32"/>'+G,
 carro:SOL+'<path '+F+' d="M66 134v-16q2-9 13-11l32-3 22-20q6-6 16-6h56q10 0 16 8l16 18 14 2q10 2 10 12v16z"/><path d="M140 102l12-15h28v15zM188 87h22l12 15h-34z"/><circle '+F+' cx="110" cy="136" r="14"/><circle '+F+' cx="222" cy="136" r="14"/><path d="M14 150H96M124 150h84M236 150h70"/>',
 moto:SOL+'<circle '+F+' cx="94" cy="128" r="22"/><circle '+F+' cx="228" cy="128" r="22"/><path d="M94 128l36-26h48l50 26M178 102l18-24h18M130 102l-10-10H100"/><rect '+F+' x="136" y="108" width="34" height="18" rx="4"/><path '+F+' d="M128 98h46c0-10-11-14-23-14s-23 4-23 14z"/><path d="M14 150h306"/>',
 bici:SOL+'<circle '+F+' cx="100" cy="124" r="25"/><circle '+F+' cx="222" cy="124" r="25"/><path d="M100 124l40-38h56l26 38M140 86l24 38 32-38M164 124h-64M196 86l-6-14h16M140 86l-4-10M128 76h18"/><path d="M14 150h306"/>'
};
function clave(a){var f=(a&&a.f)||{},t=String(f.ptype||f.vtype||'');
 if(a&&a.type==='veh')return /moto/i.test(t)?'moto':/bici/i.test(t)?'bici':'carro';
 if(/apart|oficina/i.test(t))return 'apto';if(/habitaci/i.test(t))return 'hab';if(/local/i.test(t))return 'local';if(/bodega/i.test(t))return 'bodega';
 if(/finca/i.test(t))return 'finca';if(/lote/i.test(t))return 'lote';return 'casa'}
function anuncio(n){var b=n.closest('[data-act="openAd"][data-id]'),id=b?b.getAttribute('data-id'):(typeof curAd!=='undefined'?curAd:'');
 try{return (S.ads||[]).find(function(x){return x.id===id})||null}catch(e){return null}}
function poner(){var L=document.querySelectorAll('.adpic>.nop:not(.v485)');for(var i=0;i<L.length;i++){var n=L[i],a=anuncio(n);if(!a)continue;
 n.classList.add('v485');n.parentNode.classList.add('v485p');
 n.innerHTML='<svg viewBox="8 22 304 132" aria-hidden="true" preserveAspectRatio="xMidYMid meet">'+D[clave(a)]+'</svg><small>Imagen de referencia</small><b class="v485t">Sin fotos</b>';
 n.setAttribute('role','img');n.setAttribute('aria-label','Anuncio sin fotos: imagen de referencia')}}
var pend=0;function luego(){if(pend)return;pend=requestAnimationFrame(function(){pend=0;try{poner()}catch(e){}})}
new MutationObserver(luego).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState!=='loading')luego();else document.addEventListener('DOMContentLoaded',luego);
})();
