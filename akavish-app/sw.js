// Service worker: האתר נפתח גם בלי אינטרנט. נתוני הלוח נשמרים בדפדפן (localStorage) מהטעינה האחרונה.
const CACHE = "akavish-v6";
const SHELL = ["./", "index.html", "config.js", "sample-data.js", "manifest.webmanifest",
  "img/logo.png", "img/spider-white.png", "img/hero.jpg", "img/trailer.jpg", "img/shirt.jpg", "img/icon-192.png", "img/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // Apps Script API & fonts go straight to network
  // network-first so updates to config/index show up immediately; fall back to cache offline
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
