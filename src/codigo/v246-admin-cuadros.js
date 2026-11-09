
/* v246: en el celular los cuadros ocupan casi toda la pantalla; al elegir una sección se baja solo hasta su contenido */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.tabs.admg [data-act="at"]');if(!b||innerWidth>=900)return;
 setTimeout(function(){var n=document.querySelector('.tabs.admg');if(n)scrollTo({top:n.getBoundingClientRect().bottom+scrollY-8,behavior:'smooth'})},150)});
