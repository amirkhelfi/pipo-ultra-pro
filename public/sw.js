// PIPO ULTRA PRO Service Worker - Network-First Strategy with Self-Healing
const CACHE_NAME = 'pipo-ultra-v5.0-network-first';

self.addEventListener('install', (event) => {
<<<<<<< HEAD
=======
  // Immediately activate new service worker without waiting
>>>>>>> e86ab3b8f4485c7cb4e74604d156c9bf1e466e51
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass all API requests, video streaming, proxies, and websocket connections
  if (url.pathname.startsWith('/api/') || url.hostname !== self.location.hostname) {
    return;
  }

  // Network-First for HTML navigations and JavaScript/CSS assets
<<<<<<< HEAD
=======
  // This guarantees users ALWAYS get the latest build and never get a white screen from stale HTML
>>>>>>> e86ab3b8f4485c7cb4e74604d156c9bf1e466e51
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          }).catch(() => {});
        }
        return networkResponse;
      })
      .catch(async () => {
<<<<<<< HEAD
=======
        // Fallback to cache ONLY if network is completely offline
>>>>>>> e86ab3b8f4485c7cb4e74604d156c9bf1e466e51
        const cached = await caches.match(event.request);
        if (cached) {
          return cached;
        }
        if (event.request.mode === 'navigate') {
          const fallback = await caches.match('/');
          if (fallback) return fallback;
        }
        return new Response('Network offline', { status: 503, statusText: 'Service Unavailable' });
      })
  );
});

