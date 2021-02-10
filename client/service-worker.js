var RUNTIME = 'runtime53';

var PRECACHE = 'precache-v1';
var tempFiles={};
// A list of local resources we always want to be cached.
var PRECACHE_URLS = [
  /*'index.html',
  './', // Alias for index.html
  'styles.css',
  '../../styles/main.css',
  'demo.js'*/
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    cache.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
}); 

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', function (evt) {
  if(evt.data&&evt.data.type==="SAVE_FILE"){
    console.log(evt.data.filename);
    tempFiles[evt.data.filename]=evt.data.code;
    evt.ports[0].postMessage({result: "ok"});
  }
  else
   console.log('postMessage received', evt);
  
  });
// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
var openrequests=[];
self.addEventListener('fetch', event => {
 
  if (event.request.method==="POST"|| event.request.url.indexOf("/remoteprotocol?") !== -1) {
    var pr = new Promise((resolve, reject) => {
      fetch(event.request).then((data) => {
        if (data.status === 401||data.status === 500) {
         
          self.clients.get(event.clientId).then((client)=>{
            client.postMessage(`wait for login`);
            console.log("wait for login");
            resolve(data);
          })
        }
        resolve(data);
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    })
    event.respondWith(pr);
    return;
  }
  event.respondWith(
    caches.open(RUNTIME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fromCache = event.request.headers.get("X-Custom-FromCache");
        //we needn't ask the server if a newer version exists 
        if (response && fromCache !== undefined && fromCache !== null &&
          fromCache === response.headers.get("X-Custom-Date")) {
          return response;
        }
        if (event.request.url.startsWith(self.location.origin) && response) {
              var filename=event.request.url.substring(self.location.origin.length+1);
             // var plainfilename=filename.replace("?tmp","");
              if(tempFiles[filename]){
                var type="application/javascript";
                if(filename.endsWith(".ts"))
                 type="video/mp2t";
                if(filename.endsWith(".map"))
                  type="text/html; charset=utf-8";
                return new Response(tempFiles[filename],{
                  headers:{"Content-Type":type}
                });
          }
          var dat = response.headers.get("X-Custom-Date");
          var s = event.request.url + "?lastcachedate=" + dat;
          if (event.request.url.indexOf("?") > 0) {
            s = event.request.url + "&lastcachedate=" + dat;
          }
          if (dat !== undefined) {
            return fetch(s, { cache: "no-store" }).then(function (networkResponse) {

              if (networkResponse.headers.get("X-Custom-UpToDate") === "true") {
                return response;//server says the cache is upToDate
              } else {
                //server has new data
                // console.log("cache "+ event.request.url);
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              }
            });
          } else
            return response;
        }
        //external sites
        if (response)
          return response;
        //not in cache so cache now
        return fetch(event.request, { cache: "no-store" }).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          console.log("cache+ " + event.request.url);
          return networkResponse;
        });
      }).catch(function (error) {

        // Handles exceptions that arise from match() or fetch().
        console.error('Error in fetch handler:', error);

        throw error;
      });
    })
  );
});

