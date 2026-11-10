
/* v214: botones del horario por dia: "+ Otro horario", "Quitar 2.º horario" y "Copiar el primer dia marcado a los demas".
   Si algo falla, borra este <script id="v214-horario"> y el <style id="v214-horario-css"> (el resto del v214 esta en hoursTxt, openBadge, readHours y extraFields). */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#x-hrs [data-h]');if(!b)return;e.preventDefault();
 var h=b.dataset.h,r=b.closest('.hrow');
 if(h==='add'&&r){r.classList.add('two');var i=r.querySelectorAll('.h2 input');if(i[0])i[0].focus()}
 else if(h==='rm'&&r)r.classList.remove('two');
 else if(h==='copy'){var rows=[].slice.call(document.querySelectorAll('#x-hrs .hrow')),src=rows.filter(function(x){return x.querySelector('.hon').checked})[0];if(!src)return;
  var v=[].map.call(src.querySelectorAll('.ho,.hc'),function(x){return x.value}),two=src.classList.contains('two');
  rows.forEach(function(x){if(x===src||!x.querySelector('.hon').checked)return;[].forEach.call(x.querySelectorAll('.ho,.hc'),function(t,k){t.value=v[k]});x.classList.toggle('two',two)});
  if(typeof toast==='function')toast('Horario copiado a los días marcados')}
});
