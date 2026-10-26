/* kidtask Service Worker：站点已迁移到新域名，本 SW 只做自我清理（注销自身+清全部缓存），不拦截任何请求 */
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((cs) => cs.forEach((c) => { try { c.navigate(c.url); } catch (err) {} }))
  );
});
/* 不注册 fetch 拦截：所有请求直连网络（拿到迁移跳转页） */
