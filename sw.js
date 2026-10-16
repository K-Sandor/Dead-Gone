// Offline cache for Dead & Gone (made by mk_app.py; the cache name changes with every new build).
const CACHE = 'loot-run-5135786009cb', FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "apple-touch-icon.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// the game's own files come from the cache (the new build arrives with the next sw.js); the Google fonts are cached the first time they load
self.addEventListener('fetch', e => {
  const r = e.request; if(r.method !== 'GET') return;
  const u = new URL(r.url), font = u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if(u.origin !== location.origin && !font) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(r, {ignoreSearch: !font}).then(hit => hit || fetch(r).then(res => { if(res && (res.ok || res.type === 'opaque')) c.put(r, res.clone()); return res; })))
    .catch(() => caches.match('index.html')));
});
