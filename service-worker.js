// DreamCar Brand Book — Service Worker v10
// Offline-first + автоматичне впровадження assets/sidebar.js у HTML responses.
// v10: bump cache → sidebar v8 (text-only DREAMCAR) + PDF dark fix + brand-sync.

const CACHE = 'dreamcar-brand-v10';
const PRECACHE = [
  '/',
  '/index.html',
  '/print.html',
  '/404.html',
  '/manifest.webmanifest',
  '/sitemap.xml',
  '/robots.txt',
  '/humans.txt',
  '/favicon.svg',
  '/favicon-32.png',
  '/apple-touch-icon.png',
  '/og-image.png',
  '/assets/styles.css',
  '/assets/sidebar.js',
  '/assets/search-index.json',
  '/assets/logo/dreamcar-racing-plate.png',
  '/assets/logo/dreamcar-avatar-mark.png',
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

async function handleHtmlRequest(request) {
  try {
    const response = await fetch(request);
    if (!response.ok) return response;
    const ct = response.headers.get('content-type') || '';
    if (!ct.includes('text/html')) return response;

    const text = await response.text();

    if (/sidebar\.js"\s+defer/i.test(text)) return new Response(text, {
      status: response.status,
      statusText: response.statusText,
      headers: cleanHeaders(response.headers),
    });

    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const dirDepth = segments.length > 0 && segments[segments.length - 1].endsWith('.html')
      ? segments.length - 1
      : segments.length;
    const prefix = dirDepth === 0 ? 'assets/' : '../'.repeat(dirDepth) + 'assets/';

    const injection = `<script src="${prefix}sidebar.js" defer></script>`;
    const modified = text.replace(/<\/body>/i, injection + '\n</body>');

    return new Response(modified, {
      status: response.status,
      statusText: response.statusText,
      headers: cleanHeaders(response.headers),
    });
  } catch (err) {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503, headers: { 'content-type': 'text/plain' } });
  }
}

function cleanHeaders(headers) {
  const h = new Headers();
  headers.forEach((v, k) => {
    if (k.toLowerCase() === 'content-length') return;
    if (k.toLowerCase() === 'content-encoding') return;
    h.set(k, v);
  });
  return h;
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  if (e.request.destination === 'document') {
    e.respondWith(
      handleHtmlRequest(e.request).then((resp) => {
        const clone = resp.clone();
        caches.open(CACHE).then((cache) => cache.put(e.request, clone)).catch(() => {});
        return resp;
      })
    );
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(CACHE).then((cache) => cache.match(e.request).then((hit) => hit || fetch(e.request).then((resp) => {
        cache.put(e.request, resp.clone());
        return resp;
      })))
    );
    return;
  }

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

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE).then(() => {
      event.ports[0]?.postMessage({ cleared: true });
    });
  }
});
