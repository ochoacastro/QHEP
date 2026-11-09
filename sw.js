/* Service worker de Mi Pradera: permite instalar la página en el celular.
   Siempre pide la página a internet primero (así ves la última versión). Solo si no hay
   conexión muestra la última copia guardada. No guarda datos de Firebase ni de otros sitios. */
const CACHE = 'mipradera-v1';
const BASICOS = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASICOS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    const red = fetch(r).then(res => {
      const u = new URL(r.url);
      if (res.ok && !u.search && /\/(index\.html)?$/.test(u.pathname)) {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put('./', copia)).catch(() => {});
      }
      return res;
    });
    /* v378: en la página principal, si internet tarda más de 3,5 segundos se muestra la copia guardada
       (la versión nueva queda guardada para la próxima vez). Con buena conexión no cambia nada. */
    const inicio = /\/(index\.html)?$/.test(new URL(r.url).pathname);
    e.respondWith(new Promise(ok => {
      let listo = false;
      const fin = x => { if (!listo && x) { listo = true; ok(x); } };
      const t = inicio ? setTimeout(() => caches.match('./').then(fin), 3500) : 0;
      red.then(res => { clearTimeout(t); fin(res); })
         .catch(() => caches.match('./').then(c => { listo || (listo = true, ok(c || Response.error())); }));
    }));
    return;
  }
  /* v378: el logo y los íconos se muestran al instante desde la copia guardada y se actualizan por detrás */
  if (/\/(logo-mp(-oscuro)?\.webp|icon-192\.png|icon-512\.png|img\/[\w-]+\.(?:webp|jpg|png))$/.test(new URL(r.url).pathname)) { /* v392: también los íconos de categorías y de pagos (img/) */
    e.respondWith(caches.open(CACHE).then(c => c.match(r).then(hit => {
      const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()).catch(() => {}); return res; });
      return hit || net;
    })));
    return;
  }
  e.respondWith(fetch(r).catch(() => caches.match(r)));
});

/* v250: al tocar el aviso de una noticia nueva («Seguir noticias»), abre esa noticia en la página */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './#/noticias';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
    for (const c of l) { if ('focus' in c) { c.navigate ? c.navigate(url).catch(() => {}) : 0; return c.focus(); } }
    return self.clients.openWindow ? self.clients.openWindow(url) : null;
  }));
});
