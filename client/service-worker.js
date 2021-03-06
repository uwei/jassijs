var RUNTIME = 'runtime54';

var PRECACHE = 'precache-v1';
var tempFiles = {};
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
var db;
async function getDB() {

  var req = indexedDB.open("jassi", 1);
  req.onupgradeneeded = function (ev) {
    var db = ev.target["result"];
    var objectStore = db.createObjectStore("files", { keyPath: "id" });
  }
  db = await new Promise((res) => {
    req.onsuccess = (ev) => { 
      res(ev.target["result"]) 
    };
    req.onerror=function(ev){
      console.log(ev);
    }
  })
  return db;
}
async function  loadFileFromDB(fileName,callback) {
  let transaction = (await getDB()).transaction('files', 'readonly');
  const store = transaction.objectStore('files');
  var ret = await store.get(fileName);
  var r = await new Promise((resolve) => {
    ret.onsuccess = ev => { resolve(ret.result) }
    ret.onerror = ev => { resolve(undefined) }
  });
  return (r!==undefined ? r.data : undefined);
}
function getMimeType(filename) {
  var type = "application/javascript";
  if (filename.endsWith(".ts"))
    type = "video/mp2t";
  if (filename.endsWith(".map"))
    type = "text/html; charset=utf-8";
  return type;
}

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
  if (evt.data && evt.data.type === "SAVE_FILE") {//this tempFiles could be delivered
    console.log(evt.data.filename);
    tempFiles[evt.data.filename] = evt.data.code;
    evt.ports[0].postMessage({ result: "ok" });
  }
  else
    console.log('postMessage received', evt);

});
// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
var openrequests = [];
self.addEventListener('fetch', event => {
  if (event.request.method === "POST" || event.request.url.indexOf("/remoteprotocol?") !== -1) {
    var pr = new Promise((resolve, reject) => {
      fetch(event.request).then((data) => {
        if (data.status === 401 || data.status === 500) {//now we display an Logindialog and pause the request
          self.clients.get(event.clientId).then((client) => {
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
    caches.open(RUNTIME).then(function (cache) {//we look in cache
      var filename = event.request.url;
      if (tempFiles[filename]) {//we deliver tempFiles
        console.log("deliver " + filename + tempFiles[filename].substring(0, 50));
        return new Response(tempFiles[filename], {
          headers: { "Content-Type": getMimeType(filename) }
        });
      }
      var sfilename=filename.replace(self.serviceWorker.scriptURL.replace("service-worker.js",""),"");
      
      var wait=loadFileFromDB(sfilename);
      event.waitUntil(wait);
      return wait.then((content)=>{
        if(content!==undefined){
          return new Response(content, {
            headers: { "Content-Type": getMimeType(filename) }
          });
        }else{
          return cache.match(event.request).then(function (response) {
            var fromCache = event.request.headers.get("X-Custom-FromCache");
            //we needn't ask the server if a newer version exists 
            if (response && fromCache !== undefined && fromCache !== null &&
              fromCache === response.headers.get("X-Custom-Date")) {
              return response;
            }
            if (event.request.url.startsWith(self.location.origin) && response) {
              //we check if the cache is still current
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
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                  }
                });
              } /*end self origin*/else
                return response;
            }
            //external sites
            if (response)
              return response;
            //not in cache so cache now
            return fetch(event.request, { cache: "no-store" }).then(function (networkResponse) {
              cache.put(event.request, networkResponse.clone());
              //console.log("cache+ " + event.request.url);
              return networkResponse;
            });
          }).catch(function (error) {//cache.match
    
            // Handles exceptions that arise from match() or fetch().
            console.error('Error in fetch handler:', error);
    
            throw error;
          });
        }
      })//loadFileFromDB
      
    })//cache.open
  );//event.respondWith
});//self.addEventListener('fetch'

