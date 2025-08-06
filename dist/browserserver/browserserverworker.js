"use strict";
var browserserverworker = {
    runningApps: []
    // modulecache : []
};
debugger;
//@ts-ignore
var baseroot = self.location.href.substring(0, self.location.href.lastIndexOf("/"));
if (baseroot.indexOf("/apps/") !== -1)
    baseroot = baseroot.split("/apps/")[0];
//if(baseroot.endsWith("/")){
//  baseroot=baseroot.substring(0,baseroot.length-1);
//}
debugger;
console.log("browserserverworker started:" + new Date().toString());
importScripts('./Npm.js');
importScripts('./PatchHTTP.js');
importScripts('./PatchFS.js');
importScripts('./IndexDB.js');
importScripts('./browserserverapp.js');
importScripts('./Api.js');
self.addEventListener('fetch', (event) => {
    if (event.respondWith === undefined)
        return;
    if (event.request.url.startsWith(baseroot + "/api/")) {
        var pr = browserserverworker.handleAPI(event.request);
        event.respondWith(pr);
    }
    else if (event.request.url.startsWith(baseroot + "/apps/")) {
        try {
            var pr = browserserverworker.handleLocalServerEvent(event.request);
        }
        catch (err) {
            debugger;
            throw err;
        }
        event.respondWith(pr);
        return;
    }
    //console.log("no answer to "+event.request.url);
    //  event.waitUntil(pr);
});
//browserserverworker.runLocalServerIfNeeded();
browserserverworker.handleLocalServerEvent = async (request) => {
    var name = request.url.substring((baseroot + "/apps/").length); //host client files
    var appname = name.split("/")[0];
    var url = name.substring(appname.length + 1);
    if (url === "BrowserserverLoadingPage.html") {
        let ret = await fetch(baseroot + "/BrowserserverLoadingPage.html");
        //ret=await ret.json();
        return ret;
    }
    var app = browserserverworker.runningApps[appname];
    if (app === undefined) {
        app = new BrowserServerAppClass(appname);
    }
    await app.runLocalServerIfNeeded();
    if (app.requestHandler) {
        var ret = app.requestHandler[Object.keys(app.requestHandler)[0]](request);
    }
    return ret;
};
//patchNodeFunction;
(() => {
    const originalSetInterval = globalThis.setInterval;
    globalThis.setInterval = (...args) => {
        var ret = new Number(originalSetInterval(...args));
        ret.unref = () => true;
        return ret;
    };
    //@ts-ignore
    globalThis.setImmediate = (proc, ...params) => {
        // debugger;
        return proc();
    };
})();
//# sourceMappingURL=browserserverworker.js.map