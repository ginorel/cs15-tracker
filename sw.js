// ── Cambia este número con cada deploy para forzar actualización ──
const VERSION = 'cs15-v6';
const FILES = [
  '/cs15-tracker/cs15-tracker.html',
  '/cs15-tracker/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)));
  self.skipWaiting(); // activa inmediatamente sin esperar
});

self.addEventListener('activate', e => {
  // Borra cachés viejos
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // toma control de todas las pestañas abiertas
});

self.addEventListener('fetch', e => {
  // Network first: intenta red, si falla usa caché
  // Así siempre sirve la versión más nueva cuando hay internet
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Guarda en caché la respuesta nueva
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request)) // offline fallback
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/cs15-tracker/cs15-tracker.html'));
});

self.addEventListener('push', e => {
  e.waitUntil(
    self.registration.showNotification('⛽ Tracker Vehículo', {
      body: '¿Registraste el odómetro hoy? Solo toma 30 segundos.',
      icon: '/cs15-tracker/icon-192.png',
    })
  );
});
