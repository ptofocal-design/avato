const CACHE = 'avato-v7';
const SHELL = ['./', 'index.html', 'styles.js', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'logo.webp', 'mark.png', 'wordmark.png', 'buho-ref.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
// Red primero (siempre la última versión); la copia guardada solo sirve sin conexión. Nunca toca la API de OpenAI.
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; })
    .catch(() => caches.match(e.request)));
});
