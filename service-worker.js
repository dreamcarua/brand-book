// DreamCar Brand Book — Service Worker v4 (sidebar injection)
// Offline-first PWA + автоматичне впровадження assets/sidebar.js у ВСІ HTML
// відповіді. Це означає що sidebar буде однаковий ВСЮДИ без правки кожного файлу.

const CACHE = 'dreamcar-brand-v4';
const PRECACHE = [
  '/',
  '/index.html',
  '/print.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/favicon-32.png',
  '/apple-touch-icon.png',
  '/assets/styles.css',
  '/assets/sidebar.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE).catch((err) => {
      console.warn('[SW] precache partial failure:', err);
    }))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Inject sidebar.js into all HTML responses
async function handleHtmlRequest(request) {
  try {
    const response = await fetch(request);
    if (!response.ok) return response;
    const ct = response.headers.get('content-type') || '';
    if (!ct.includes('text/html')) return response;

    const text = await response.text();

    // Calculate relative path to sidebar.js
    const url = new URL(request.url);
    const path = url.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    const prefix = depth === 0 ? 'assets/' : '../'.repeat(depth) + 'assets/';

    // Inject only if not already present
    const injection = `<script src="${prefix}sidebar.js" defer></script>`;
    const modified = text.includes('sidebar.js') ? text : text.replace(/<\/body>/i, injection + '\n</body>');

    return new Response(modified, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (err) {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // HTML pages: inject sidebar.js + cache
  if (e.request.destination === 'document') {
    e.respondWith(handleHtmlRequest(e.request).then((resp) => {
      const clone = resp.clone();
      caches.open(CACHE).then((cache) => cache.put(e.request, clone)).catch(() => {});
      return resp;
    }));
    return;
  }

  // Google Fonts — cache forever
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(CACHE).then((cache) => cache.match(e.request).then((hit) => hit || fetch(e.request).then((resp) => {
        cache.put(e.request, resp.clone());
        return resp;
      })))
    );
    return;
  }

  // Same-origin assets: cache-first
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then((hit) => hit || fetch(e.request).then((resp) => {
        if (resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match('/index.html')))
    );
  }
});
