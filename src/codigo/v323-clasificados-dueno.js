
/* v323: cuando Firebase no deja eliminar, ocultar o renovar un clasificado, se dice la causa real (sesión cerrada o
   cuenta distinta) en vez de «faltan las reglas». Con las reglas v43 el dueño se reconoce también por su correo o celular. */
window.comErr=function(e,que){var u=null;try{u=QH.authCur()}catch(x){}
 if(e&&e.m)return toast(e.m);
 if(!u||u.isAnonymous)return toast('Tu sesión se cerró: entra de nuevo con tu correo y tu clave para '+que+' el anuncio.');
 if(e&&e.code==='permission-denied')return toast('No se pudo '+que+': Firebase no te reconoce como dueño de este anuncio. Cierra sesión y vuelve a entrar; si sigue igual, avisa al administrador.');
 toast('No se pudo '+que+'. Revisa tu internet e inténtalo de nuevo.')};
