/* GødEngine V1.4 offline cache (GitHub Pages only). Same-origin app pages are served from the phone's cache;
   a background refresh runs at most once every 6 hours, so the radio stays quiet. Other requests are not touched. */
var C='ge-v151',PAGES=['./','index.html','LAUNCH_GODENGINE.html'],MAXAGE=6*3600*1000;
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(PAGES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
function refresh(req){return fetch(req).then(function(r){if(r&&r.ok){var h=new Headers(r.headers);h.set('x-ge-at',String(Date.now()));return r.clone().blob().then(function(b){return caches.open(C).then(function(c){c.put(req,new Response(b,{status:r.status,headers:h}));return r})})}return r})}
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||r.cache==='no-store')return;
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(hit){if(!hit)return refresh(r).catch(function(){return caches.match('index.html')});
  var at=+(hit.headers.get('x-ge-at')||0);if(Date.now()-at>MAXAGE)e.waitUntil(refresh(r).catch(function(){}));return hit}))});
