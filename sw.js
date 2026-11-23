/* عامل الخدمة: يحفظ ملفات التطبيق في الجهاز ليعمل بلا إنترنت بعد أول فتح.
   عند تعديل أي ملف في التطبيق غيّر رقم الإصدار هنا ليحصل الطلاب على النسخة الجديدة. */
var VERSION = "qz-app-v17";
var FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

/* صفحة التطبيق (index.html): من الإنترنت أولاً حتى تظهر التحديثات فوراً، ومن الجهاز إذا لم يتوفر الاتصال.
   بقية الملفات (الأيقونات...): من الجهاز أولاً مع تحديثها في الخلفية. */
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  var url = new URL(e.request.url), same = url.origin === self.location.origin;
  var isPage = e.request.mode === "navigate" || /\/$|\.html$/.test(url.pathname);
  if(isPage){
    e.respondWith(caches.open(VERSION).then(function(c){
      return fetch(e.request, {cache:"no-store"}).then(function(res){
        if(res && res.ok && same) c.put(e.request, res.clone());
        return res;
      }).catch(function(){
        return c.match(e.request, {ignoreSearch:true}).then(function(hit){ return hit || c.match("./index.html"); });
      });
    }));
    return;
  }
  e.respondWith(caches.open(VERSION).then(function(c){
    return c.match(e.request, {ignoreSearch:true}).then(function(hit){
      var net = fetch(e.request).then(function(res){
        if(res && res.ok && same) c.put(e.request, res.clone());
        return res;
      }).catch(function(){ return hit; });
      return hit || net;
    });
  }));
});
