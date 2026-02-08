// ADViral Agency — Service Worker for offline caching
const CACHE_NAME = 'adviral-v2';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/assets/fonts/Sansation-Light.woff2',
  '/assets/fonts/Sansation-Regular.woff2',
  '/assets/images/poster_hero_desktop.webp',
  '/assets/images/poster_hero_mobile.webp',
  '/assets/images/poster_contact.webp',
  '/assets/images/icons/favicon-ad-transparent.webp',
];

// Install: precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: stale-while-revalidate for most assets, network-first for HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // HTML pages: network-first
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Videos: network-only (too large to cache)
  if (url.pathname.endsWith('.mp4')) return;

  // Everything else: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          cache.put(request, response.clone());
          return response;
        }).catch(() => cached);

        return cached || fetchPromise;
      });
    })
  );
});
