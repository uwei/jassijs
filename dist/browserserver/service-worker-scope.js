"use strict";
/** serviceworkers could not be  delivered by an other serviceworker - so we have this serviceworker.
*** This serviceworker must be always unregister/register so the activate event is called.
*** In the activate event we load the code for app.serviceworkerfile and execute it.
**/
(() => {
    //collect the fetch listener and manage, that the fetch listener in app.serviceworkerfile ist firstly calles
    var fetchListener = [];
    self.addEventListener('fetch', (event) => {
        if (event.respondWith === undefined)
            return;
        let orgrepondwith = event.respondWith.bind(event);
        event.respondWith = (...args) => {
            orgrepondwith(...args);
            event.isresponded = true;
        };
        //at [0] there is the fetchlistener of browserserverworker
        for (let x = 1; x < fetchListener.length; x++) {
            fetchListener[x](event);
            if (event.isresponded)
                return;
        }
        fetchListener[0](event);
        if (!event.isresponded)
            orgrepondwith(_oldfetch(event.request));
    });
    var _oldaddlistener = self.addEventListener.bind(self);
    self.addEventListener = (name, func) => {
        if (name === "fetch") {
            fetchListener.push(func);
        }
        _oldaddlistener(name, func);
    };
    var _oldfetch = globalThis.fetch;
    //fetch should also include the virual server answers
    globalThis.fetch = async (...params) => {
        let req = params[0];
        if (typeof req === "string") {
            req = new Request(req);
        }
        let response = undefined;
        let event = {
            request: req,
            response: undefined,
            respondWith: (data) => response = data
        };
        fetchListener[0](event); //check /api/ and /apps/ in browserserverworker
        if (response !== undefined)
            return response;
        let ret = await _oldfetch(...params);
        return ret;
        return ret;
    };
    importScripts('./browserserverworker.js');
    self.addEventListener('activate', event => {
        //@ts-ignore
        event.waitUntil((async () => {
            var data = await browserserverworker.readIndexDB("browserserver", appname, "config");
            // var fspromise = new Promise((res => {
            //app.runLocalServerIfNeeded(res);
            //  }))
            if (data.serviceworkerfile) {
                var initialData = await browserserverworker.readIndexDB("browserserver", appname, "files");
                if (initialData) {
                    console.error("Serviceworker " + data.serviceworkerfile + " not found");
                    let code = BrowserServerAppClass.getCodeFileIntern(initialData, data.serviceworkerfile);
                    if (code)
                        eval(code);
                }
            }
        })());
        //@ts-ignore
        self.skipWaiting(); // optional: sofort aktivieren
    });
    //@ts-ignore
    var appname = self.registration.scope.substring(self.registration.scope.lastIndexOf("/") + 1);
    var app = new BrowserServerAppClass(appname);
    app.runLocalServerIfNeeded();
})();
//# sourceMappingURL=service-worker-scope.js.map