const CACHE_NAME = 'sweet-story-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/styles/globals.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果在缓存中找到了响应，则返回缓存的响应
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});