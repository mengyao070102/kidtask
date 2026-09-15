/* kidtask Service Worker：网络优先 + 离线兜底（只托管页面导航，MQTT/API 一律直连） */
const CACHE = 'kidtask-shell-v1';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add('./index.html')).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || req.mode !== 'navigate') return;   // 只接管页面导航
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', cp)); }
      return res;
    }).catch(() => caches.match('./index.html').then((r) => r || Response.error()))
  );
});
