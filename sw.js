/* Filo Real — Service Worker (Guía C3-A2: «proxy invisible» entre navegador y red)
   install: precache de todos los archivos · fetch: Cache Storage primero, red de respaldo · activate: limpia versiones viejas. */
const CACHE_NAME = 'cat-1-barberia-filo-real-v1.1.0';
const ASSETS_TO_CACHE = [
 "./",
 "./assets/images/aceite-para-barba.svg",
 "./assets/images/afeitado-cl-sico-a-navaja.svg",
 "./assets/images/barba-con-toalla-caliente.svg",
 "./assets/images/brocha-de-afeitar.svg",
 "./assets/images/cera-brillo-cl-sico.svg",
 "./assets/images/combo-corte-barba.svg",
 "./assets/images/combo-real.svg",
 "./assets/images/corte-cl-sico.svg",
 "./assets/images/corte-ni-o.svg",
 "./assets/images/dise-o-de-cejas.svg",
 "./assets/images/equipo-alexis.svg",
 "./assets/images/equipo-mauricio.svg",
 "./assets/images/equipo-rodrigo.svg",
 "./assets/images/fade-degradado.svg",
 "./assets/images/limpieza-facial-black-mask.svg",
 "./assets/images/logo.svg",
 "./assets/images/portada-barberia-realista.webp",
 "./assets/images/navaja-profesional.svg",
 "./assets/images/peine-de-madera.svg",
 "./assets/images/perfilado-de-barba.svg",
 "./assets/images/pomada-mate-fijaci-n-fuerte.svg",
 "./assets/images/pompadour-y-peinado.svg",
 "./data/products.json",
 "./data/site.json",
 "./icons/icon-192.png",
 "./icons/icon-512.png",
 "./index.html",
 "./manifest.json",
 "./script.js",
 "./styles.css",
 "./vendor/jquery-3.6.0.min.js",
 "./vendor/purify.min.js"
];
const RUNTIME_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('cat-1-barberia-filo-real-') && k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const request = event.request; const url = new URL(request.url);
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin && !RUNTIME_HOSTS.includes(url.hostname)) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response && response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then((c) => c.put(request, copy)); }
    return response;
  }).catch(() => request.mode === 'navigate' ? caches.match('./index.html') : new Response('Recurso no disponible sin conexión.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }))));
});
self.addEventListener('sync', (event) => { if (event.tag === 'pedidos-pendientes') event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((l) => l.forEach((c) => c.postMessage({ type: 'SYNC_AVAILABLE' })))); });
self.addEventListener('message', (event) => { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
