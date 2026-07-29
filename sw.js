const CACHE = 'cs15-v1';
const FILES = [
  '/cs15-tracker/cs15-tracker.html',
  '/cs15-tracker/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// ── Notificaciones ────────────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/cs15-tracker/cs15-tracker.html'));
});

self.addEventListener('push', e => {
  e.waitUntil(
    self.registration.showNotification('⛽ CS15 Tracker', {
      body: '¿Registraste el odómetro hoy? Solo toma 30 segundos.',
      icon: '/cs15-tracker/icon-192.png',
    })
  );
});
