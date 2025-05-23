const CACHE_NAME = "veganscope-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Installation : mise en cache des fichiers statiques
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activation : nettoyage ancien cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch : réponse depuis cache, mise à jour si possible
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ignore les appels non GET
  if (request.method !== "GET") return;

  // Priorité : cache first, puis mise à jour silencieuse
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => cached); // offline fallback

      return cached || fetchPromise;
    })
  );
});
