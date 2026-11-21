/* عامل الخدمة: يحفظ ملفات التطبيق في الجهاز ليعمل بلا إنترنت بعد أول فتح.
   عند تعديل أي ملف في التطبيق غيّر رقم الإصدار هنا ليحصل الطلاب على النسخة الجديدة. */
var VERSION = "qz-app-v1";
var FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

/* من الجهاز أولاً (يعمل بلا إنترنت)، ثم تحديث النسخة المحفوظة في الخلفية إن توفر الاتصال */
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(caches.open(VERSION).then(function(c){
    return c.match(e.request, {ignoreSearch:true}).then(function(hit){
      var net = fetch(e.request).then(function(res){
        if(res && res.ok && new URL(e.request.url).origin === self.location.origin) c.put(e.request, res.clone());
        return res;
      }).catch(function(){ return hit; });
      return hit || net;
    });
  }));
});
