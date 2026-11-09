/* v379: FIREBASE APP CHECK. Cada conexión de Firebase de la página (la principal y la de inicio de sesión) prueba
   con reCAPTCHA v3 que viene de mipradera.com.co y no de un robot o de otro sitio. Firebase lo revisa en su servidor;
   cuando en la consola se active «Aplicar» (Enforce), rechaza lo que no traiga esa prueba. Solo se activa en mipradera.com.co
   (en pruebas locales no). Si algo falla, borra este bloque y la línea de firebase-app-check-compat.js. */
(function(){try{if(!window.firebase||!firebase.appCheck||!firebase.initializeApp)return;
 if(!/(^|\.)mipradera\.com\.co$/.test(location.hostname)&&!/[?&]appcheck=1/.test(location.search))return;window.__APPCHECK=1;
 window.RC_ENT='6LcaDhguAAAAAEuRH9ah74jx2wRLAY4UY6xvUf18'/* v385: clave de Fraud Defense (antes reCAPTCHA Enterprise) del proyecto qhep-b812f; es pública */;
 var init=firebase.initializeApp;firebase.initializeApp=function(){var app=init.apply(this,arguments);
  try{(app.appCheck?app.appCheck():firebase.appCheck(app)).activate(new firebase.appCheck.ReCaptchaEnterpriseProvider(window.RC_ENT),true)/* v385: Fraud Defense */}catch(e){try{console.warn("App Check:",e&&e.message)}catch(x){}}return app}}catch(e){}})();