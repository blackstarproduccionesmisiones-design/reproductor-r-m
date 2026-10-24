// Rock & Metal Radio - Service Worker for PWA installation
const CACHE_NAME = 'rock-metal-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through all audio streams directly to avoid caching live radio
  if (event.request.url.includes('/listen/') || event.request.url.includes('.mp3') || event.request.url.includes('/api/stream')) {
    return;
  }
  // Standard network fetch
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
