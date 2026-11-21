/* v460: en los arriendos, «Servicios que ya están pagos en el valor del arriendo» (f.inc) usa ahora las mismas palabras que
   «Servicios públicos con los que cuenta la vivienda» (f.svc): Energía en vez de Luz y Gas natural en vez de Gas.
   Los anuncios guardados antes con «Luz» o «Gas» se leen con las palabras nuevas, así la casilla sigue marcada al editar
   y el anuncio muestra lo mismo. Se engancha a docFix (v413), que corrige los datos al leerlos (solo en memoria; el dueño
   guarda la versión nueva la próxima vez que edite su anuncio). Para quitarlo: borrar este archivo de src/orden.json. */
(function(){
 var M={'Luz':'Energía','Gas':'Gas natural'};
 var f0=window.docFix;
 window.docFix=function(c,o){
  if(typeof f0==='function')o=f0(c,o);
  try{if(c==='ads'&&o&&o.f&&Array.isArray(o.f.inc)&&o.f.inc.some(function(v){return M[v]})){
   var vis={},n=[];o.f.inc.forEach(function(v){v=M[v]||v;if(!vis[v]){vis[v]=1;n.push(v)}});o.f=Object.assign({},o.f,{inc:n})}}catch(e){}
  return o};
})();
