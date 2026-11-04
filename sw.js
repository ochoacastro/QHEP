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
    e.respondWith(fetch(r).then(res => {
      const u = new URL(r.url);
      if (res.ok && !u.search && /\/(index\.html)?$/.test(u.pathname)) {
        const copia = res.clone();
        caches.open(CACHE).then(c => c.put('./', copia)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match('./')));
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
