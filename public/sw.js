// Service Worker for Veteran Symptom Tracker
const CACHE_NAME = 'symptom-tracker-v1';

// Assets to cache for offline use
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Time to log your symptoms',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/',
    },
    actions: [
      { action: 'log', title: 'Log Symptom' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
      self.registration.showNotification('Veteran Symptom Tracker', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Open or focus the app
  event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});