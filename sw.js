// BullQuest service worker: keep the app HTML fresh.
// GitHub Pages serves index.html with Cache-Control: max-age=600, so a normal refresh
// can serve a 10-minute-old page. This SW fetches HTML network-first (bypassing the HTTP
// cache) so a deploy shows up immediately on the next refresh. It stores nothing itself,
// and falls back to the browser default only if the network fails.
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var accept = req.headers.get('accept') || '';
  var isHTML = req.mode === 'navigate' || accept.indexOf('text/html') !== -1;
  if (isHTML) {
    e.respondWith(fetch(req, { cache: 'no-store' }).catch(function () { return fetch(req); }));
  }
  // non-HTML requests (assets, API) are left to the browser default; the SW caches nothing.
});
