/* عامل الخدمة: يحفظ ملفات التطبيق في الجهاز ليعمل بلا إنترنت بعد أول فتح.
   عند تعديل أي ملف في التطبيق غيّر رقم الإصدار هنا ليحصل الطلاب على النسخة الجديدة. */
var VERSION = "qz-app-v18";
/* الأصوات البشرية (GCompris): مخزن مستقل لا يُحذف عند تغيير الإصدار،
   غيّر رقمه فقط إذا استبدلت ملفات الأصوات نفسها. */
var SOUNDS = "qz-sounds-v1";
var SOUND_FILES = [
  "./sounds/ar/0.mp3",
  "./sounds/ar/1.mp3",
  "./sounds/ar/10.mp3",
  "./sounds/ar/11.mp3",
  "./sounds/ar/12.mp3",
  "./sounds/ar/13.mp3",
  "./sounds/ar/14.mp3",
  "./sounds/ar/15.mp3",
  "./sounds/ar/16.mp3",
  "./sounds/ar/17.mp3",
  "./sounds/ar/18.mp3",
  "./sounds/ar/19.mp3",
  "./sounds/ar/2.mp3",
  "./sounds/ar/20.mp3",
  "./sounds/ar/3.mp3",
  "./sounds/ar/4.mp3",
  "./sounds/ar/5.mp3",
  "./sounds/ar/6.mp3",
  "./sounds/ar/7.mp3",
  "./sounds/ar/8.mp3",
  "./sounds/ar/9.mp3",
  "./sounds/ar/U0623.mp3",
  "./sounds/ar/U0628.mp3",
  "./sounds/ar/U062A.mp3",
  "./sounds/ar/U062B.mp3",
  "./sounds/ar/U062C.mp3",
  "./sounds/ar/U062D.mp3",
  "./sounds/ar/U062E.mp3",
  "./sounds/ar/U062F.mp3",
  "./sounds/ar/U0630.mp3",
  "./sounds/ar/U0631.mp3",
  "./sounds/ar/U0632.mp3",
  "./sounds/ar/U0633.mp3",
  "./sounds/ar/U0634.mp3",
  "./sounds/ar/U0635.mp3",
  "./sounds/ar/U0636.mp3",
  "./sounds/ar/U0637.mp3",
  "./sounds/ar/U0638.mp3",
  "./sounds/ar/U0639.mp3",
  "./sounds/ar/U063A.mp3",
  "./sounds/ar/U0641.mp3",
  "./sounds/ar/U0642.mp3",
  "./sounds/ar/U0643.mp3",
  "./sounds/ar/U0644.mp3",
  "./sounds/ar/U0645.mp3",
  "./sounds/ar/U0646.mp3",
  "./sounds/ar/U0647.mp3",
  "./sounds/ar/U0648.mp3",
  "./sounds/ar/U064A.mp3",
  "./sounds/ar/awesome.mp3",
  "./sounds/ar/congratulation.mp3",
  "./sounds/ar/fantastic.mp3",
  "./sounds/ar/good.mp3",
  "./sounds/ar/great.mp3",
  "./sounds/ar/perfect.mp3",
  "./sounds/ar/super.mp3",
  "./sounds/ar/waytogo.mp3",
  "./sounds/en/0.mp3",
  "./sounds/en/1.mp3",
  "./sounds/en/10.mp3",
  "./sounds/en/11.mp3",
  "./sounds/en/12.mp3",
  "./sounds/en/13.mp3",
  "./sounds/en/14.mp3",
  "./sounds/en/15.mp3",
  "./sounds/en/16.mp3",
  "./sounds/en/17.mp3",
  "./sounds/en/18.mp3",
  "./sounds/en/19.mp3",
  "./sounds/en/2.mp3",
  "./sounds/en/20.mp3",
  "./sounds/en/3.mp3",
  "./sounds/en/4.mp3",
  "./sounds/en/5.mp3",
  "./sounds/en/6.mp3",
  "./sounds/en/7.mp3",
  "./sounds/en/8.mp3",
  "./sounds/en/9.mp3",
  "./sounds/en/U0061.mp3",
  "./sounds/en/U0062.mp3",
  "./sounds/en/U0063.mp3",
  "./sounds/en/U0064.mp3",
  "./sounds/en/U0065.mp3",
  "./sounds/en/U0066.mp3",
  "./sounds/en/U0067.mp3",
  "./sounds/en/U0068.mp3",
  "./sounds/en/U0069.mp3",
  "./sounds/en/U006A.mp3",
  "./sounds/en/U006B.mp3",
  "./sounds/en/U006C.mp3",
  "./sounds/en/U006D.mp3",
  "./sounds/en/U006E.mp3",
  "./sounds/en/U006F.mp3",
  "./sounds/en/U0070.mp3",
  "./sounds/en/U0071.mp3",
  "./sounds/en/U0072.mp3",
  "./sounds/en/U0073.mp3",
  "./sounds/en/U0074.mp3",
  "./sounds/en/U0075.mp3",
  "./sounds/en/U0076.mp3",
  "./sounds/en/U0077.mp3",
  "./sounds/en/U0078.mp3",
  "./sounds/en/U0079.mp3",
  "./sounds/en/U007A.mp3",
  "./sounds/en/awesome.mp3",
  "./sounds/en/congratulation.mp3",
  "./sounds/en/fantastic.mp3",
  "./sounds/en/good.mp3",
  "./sounds/en/great.mp3",
  "./sounds/en/perfect.mp3",
  "./sounds/en/super.mp3",
  "./sounds/en/try_again.mp3",
  "./sounds/en/waytogo.mp3"
];
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
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(FILES); }).then(function(){
    /* الأصوات: كل ملف وحده، وفشل أي ملف لا يوقف تثبيت التطبيق */
    return caches.open(SOUNDS).then(function(sc){
      return Promise.all(SOUND_FILES.map(function(f){
        return sc.match(f).then(function(hit){ return hit || sc.add(f)["catch"](function(){}); });
      }));
    });
  }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== VERSION && k !== SOUNDS; }).map(function(k){ return caches.delete(k); }));
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
  if(same && url.pathname.indexOf("/sounds/") >= 0){
    /* الأصوات: من الجهاز أولاً، وإن لم تكن محفوظة تُجلب وتُحفظ */
    e.respondWith(caches.open(SOUNDS).then(function(sc){
      return sc.match(e.request, {ignoreSearch:true}).then(function(hit){
        return hit || fetch(e.request).then(function(res){ if(res && res.ok) sc.put(e.request, res.clone()); return res; });
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
