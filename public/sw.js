// Service Worker for Doc Bear's Symptom Vault
// Version updated on each deploy to bust cache
const CACHE_VERSION = 'v2';
const CACHE_NAME = `symptom-tracker-${CACHE_VERSION}`;

// Only cache the shell, not the hashed assets
const ASSETS_TO_CACHE = [
  '/',
];

// Install event - cache minimal assets
self.addEventListener('install', (event) => {
  event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  // Force new service worker to take over immediately
  self.skipWaiting();
});

// Activate event - clean ALL old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames
            .filter((name) => name.startsWith('symptom-tracker-') && name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      }).then(() => {
        // Take control of all pages immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // For navigation requests (HTML), always go to network first
  if (event.request.mode === 'navigate') {
    event.respondWith(
        fetch(event.request)
        .catch(() => caches.match('/'))
    );
    return;
  }

  // For assets (JS, CSS), try network first, then cache
  event.respondWith(
      fetch(event.request)
      .then((response) => {
        // Clone and cache the response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
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
    data: { url: '/' },
    actions: [
      { action: 'log', title: 'Log Symptom' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(
      self.registration.showNotification('Doc Bear\'s Symptom Vault', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});