const CACHE_NAME = 'agrishield-app-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/public/favicon.svg',
  '/public/icon-192.png',
  '/public/icon-512.png',
  '/public/apple-touch-icon.png'
];

// Install event - Pre-cache core app shell assets
self.addEventListener('install', (event) => {
  console.log('[AgriShield PWA SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[AgriShield PWA SW] Pre-caching App Shell assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[AgriShield PWA SW] Pre-cache partial fail:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - Clean up stale cache versions
self.addEventListener('activate', (event) => {
  console.log('[AgriShield PWA SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[AgriShield PWA SW] Deleting obsolete cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Cache First for static assets, Network First with Cache Fallback for dynamic pages
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin non-GET or API requests from intercepting write ops
  if (request.method !== 'GET') return;

  // Handle API calls with network first, then offline json fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            return new Response(
              JSON.stringify({ error: true, message: 'You are currently offline. Please check your connection.' }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // Handle HTML navigation and static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-while-revalidate in background for static files
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {/* Silent catch offline */});
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If HTML page request fails offline, serve offline.html fallback
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/offline.html') || caches.match('/index.html');
          }
        });
    })
  );
});

// Listen for custom skipWaiting signal from client UI
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
