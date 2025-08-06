<<<<<<< HEAD
=======
var RUNTIME = 'runtime59';
var nextid = 0;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
var tempFiles = {};
//index db deliver files
var filesdb;
//deliver local folder
var localfolderdb;
async function loadLocalFileEntry(handle, fileName) {
    if (fileName.startsWith("./"))
        fileName = fileName.substring(2);
    if (fileName.startsWith("."))
        fileName = fileName.substring(1);
    if (fileName === "")
        return handle;
    var paths = fileName.split("/");
    var ret = handle;
    for (var x = 0; x < paths.length; x++) {
        try {
            ret = await ret.getDirectoryHandle(paths[x]);
        }
        catch (_a) {
            try {
                ret = await ret.getFileHandle(paths[x]);
            }
            catch (_b) {
                return undefined;
            }
        }
    }
    return ret;
}
async function findLocalFolder(fileName) {
    if (localfolderdb)
        await localfolderdb;
    else {
        localfolderdb = await new Promise((res) => {
            var req = indexedDB.open("handles", 3);
            req.onupgradeneeded = function (ev) {
                var db = ev.target["result"];
                var objectStore = db.createObjectStore("handles");
            };
            req.onsuccess = (ev) => {
                res(ev.target["result"]);
            };
            req.onerror = function (ev) {
                res(undefined);
            };
        });
    }
    let transaction = localfolderdb.transaction("handles", 'readwrite');
    const store = transaction.objectStore("handles");
    var ret = await store.get("handle");
    var handle = await new Promise((resolve) => {
        ret.onsuccess = ev => { resolve(ret.result); };
        ret.onerror = ev => { resolve(undefined); };
    });
    if (handle === undefined || (await handle.queryPermission({ mode: 'readwrite' })) !== 'granted') {
        return false;
    }
    var sfileName = "./client/" + fileName;
    if (fileName.indexOf("?server=1") !== -1 && fileName.indexOf("/jassi.json?server=1") === -1 && fileName.indexOf("/modul.js?server=1") === -1)
        sfileName = "./" + fileName.split("?")[0];
    sfileName = sfileName.split("?")[0];
    var ent = await loadLocalFileEntry(handle, sfileName);
    if (ent === undefined)
        return false;
    var ff = await ent.getFile();
    return await ff.text();
}
async function loadFileFromDB(fileName) {
    if (filesdb)
        await filesdb;
    else {
        filesdb = await new Promise((res) => {
            var req = indexedDB.open("jassi", 1);
            req.onupgradeneeded = function (ev) {
                var db = ev.target["result"];
                var objectStore = db.createObjectStore("files", { keyPath: "id" });
            };
            req.onsuccess = (ev) => {
                res(ev.target["result"]);
            };
            req.onerror = function (ev) {
                console.log(ev);
            };
        });
    }
    let transaction = filesdb.transaction('files', 'readonly');
    const store = transaction.objectStore('files');
    var sfileName = "./client/" + fileName;
    if (fileName.indexOf("?server=1") !== -1 && fileName.indexOf("/jassi.json?server=1") === -1 && fileName.indexOf("/modul.js?server=1") === -1)
        sfileName = "./" + fileName.split("?")[0];
    sfileName = sfileName.split("?")[0];
    var ret = await store.get(sfileName);
    var r = await new Promise((resolve) => {
        ret.onsuccess = ev => { resolve(ret.result); };
        ret.onerror = ev => { resolve(undefined); };
    });
    return (r !== undefined ? r.data : undefined);
}
function getMimeType(filename) {
    var type = "application/javascript";
    if (filename.endsWith(".ts"))
        type = "video/mp2t";
    if (filename.endsWith(".map"))
        type = "text/html; charset=utf-8";
    if (filename.endsWith(".css"))
        type = "text/css; charset=utf-8";
    return type;
}
self.addEventListener('install', event => {
    self.skipWaiting(); // Aktiviert den neuen SW sofort
});
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim()); // Übernimmt Kontrolle über alle Seiten
});
async function requestToJSON(req) {
    const cloned = req.clone(); // 🔁 Body kann nur einmal gelesen werden
    // Body (falls vorhanden) als Text
    let bodyText = null;
    try {
        bodyText = await cloned.text();
    }
    catch (_a) {
        bodyText = null;
    }
    // Objekt mit relevanten Eigenschaften
    const requestInfo = {
        method: req.method,
        url: req.url,
        headers: {},
        mode: req.mode,
        credentials: req.credentials,
        cache: req.cache,
        redirect: req.redirect,
        referrer: req.referrer,
        referrerPolicy: req.referrerPolicy,
        integrity: req.integrity,
        keepalive: req.keepalive,
        destination: req.destination,
        body: bodyText,
    };
    // Header extrahieren
    for (const [key, value] of req.headers.entries()) {
        requestInfo.headers[key] = value;
    }
    // JSON erzeugen
    const jsonOutput = JSON.stringify(requestInfo, null, 2);
    return jsonOutput;
}
self.addEventListener('message', function (evt) {
    if (evt.data && evt.data.type === "SAVE_FILE") { //this tempFiles could be delivered
        console.log(evt.data.filename);
        tempFiles[evt.data.filename] = evt.data.code;
        evt.ports[0].postMessage({ result: "ok" });
    }
    else if (evt.data && evt.data.type === "LOGGED_IN") {
        console.log("logged in");
    }
    else
        console.log('postMessage received', evt);
});
async function handleEvent(event) {
    console.log("sw get " + event.request.url);
    if (event.request.url.endsWith("/tsWorker.js")) {
        while (tempFiles[event.request.url] === undefined) {
            await new Promise((res) => setTimeout(() => res(), 100)); //wait until file is placed
        }
    }
<<<<<<< HEAD
=======
    if (event.request.url.endsWith("/tsWorker.js")) {
        while (tempFiles[event.request.url] === undefined) {
            await new Promise((res) => setTimeout(() => res(), 100)); //wait until file is placed
        }
    }
    //let cache = await caches.open(RUNTIME)
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    var filename = event.request.url;
    if (tempFiles[filename]) { //we deliver tempFiles
        console.log("deliver " + filename + tempFiles[filename].substring(0, 50));
        return new Response(tempFiles[filename], {
            headers: { "Content-Type": getMimeType(filename) }
        });
    }
    var sfileName = filename.replace(self.registration.scope, "");
    var content = await findLocalFolder(sfileName);
    if (!content)
        content = await loadFileFromDB(sfileName);
    if (content !== undefined) {
        return new Response(content, {
            headers: { "Content-Type": getMimeType(filename) }
        });
    }
    let networkResponse = await fetch(event.request);
    return networkResponse;
}
self.addEventListener('fetch', event => {
    var pr = handleEvent(event);
    event.respondWith(pr);
});
//# sourceMappingURL=service-worker.js.map