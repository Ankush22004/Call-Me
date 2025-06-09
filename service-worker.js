self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("bharatverse-cache").then(cache => {
      return cache.addAll([
        "index.html",
        "dashboard.html",
        "css/style.css",
        "js/app.js"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
