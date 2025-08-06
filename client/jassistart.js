class JassijsStarter {
    runScript = document.currentScript.getAttribute("data-run");
    configFile = document.currentScript.getAttribute("data-config");
    runFunction = document.currentScript.getAttribute("data-run-function");
    cssFiles = {};
    //config data
    config;
    async enableLocaldir() {
        var req = indexedDB.open("handles", 3);
        req.onupgradeneeded = function (ev) {
            var db = ev.target["result"];
            var objectStore = db.createObjectStore("handles");
        }
        var db = await new Promise((res) => {
            req.onsuccess = (ev) => {
                res(ev.target["result"])
            };
        });
        let transaction = db.transaction("handles", 'readwrite');
        const store = transaction.objectStore("handles");
        var ret = await store.get("handle");
        var fileHandle = await new Promise((resolve) => {
            ret.onsuccess = ev => { resolve(ret.result) }
        });
        if (fileHandle) {
            return await new Promise((resolve) => {
                var buttonOpen = document.createElement("input");
                var buttonClose = document.createElement("input");
                window.enableFileSystem = async () => {
                    const options = { mode: 'readwrite' };
                    document.body.removeChild(document.getElementById("loadlocalFolder"));
                    document.body.removeChild(document.getElementById("closelocalFolder"));

                    if ((await fileHandle.queryPermission(options)) === 'granted') {
                        resolve(fileHandle);
                    }
                    if ((await fileHandle.requestPermission(options)) === 'granted') {
                        resolve(fileHandle);
                    } else
                        resolve(undefined);
                }
                window.closeFileSystem = async () => {

                    var req = window.indexedDB.open("handles", 3);
                    var db = await new Promise((resolve) => {
                        req.onupgradeneeded = function (event) {
                            var db = event.target["result"];
                            var objectStore = db.createObjectStore("handles");
                        }
                        req.onsuccess = (ev) => {
                            resolve(ev.target["result"])
                        };
                    });
                    let transaction = db.transaction('handles', 'readwrite');
                    const store = transaction.objectStore('handles');
                    store.delete("handle");
                    await new Promise((resolve) => { transaction.oncomplete = resolve })

                    document.body.removeChild(document.getElementById("loadlocalFolder"));
                    document.body.removeChild(document.getElementById("closelocalFolder"));
                    resolve(undefined);
                }

                document.body.appendChild(buttonOpen);
                document.body.appendChild(buttonClose);

                buttonOpen.outerHTML = '<input type="button" id="loadlocalFolder" onclick="enableFileSystem()" value="load ' + fileHandle.name + '">';
                buttonClose.outerHTML = '<input type="button" id="closelocalFolder" onclick="closeFileSystem()" value="close ' + fileHandle.name + '">';

            })
        }
    }
    registerServiceWorker() {

       /* var http = new XMLHttpRequest();
        http.open('HEAD', './service-worker.js', false);
        http.send();
        if (http.status === 401 || http.status === 404) {
            return;
        }*/
        //fetch('./service-worker.js').then((d)=>{debugger});
        if ('serviceWorker' in navigator) {
            //navigator.serviceWorker.registedr('../../service-worker-scope.js?jassijs');
            
            navigator.serviceWorker.register('./service-worker.js');
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload(); // Seite neu laden, um neuen SW zu aktivieren
            });
          /*  navigator.serviceWorker.addEventListener("message", (evt) => {
                if (evt.data === "wait for login") {
                    new Promise((resolve_1, reject_1) => { require(["jassijs/base/LoginDialog"], resolve_1, reject_1); }).then((data) => {
                        data.login();
                        //          navigator.serviceWorker.controller.postMessage("logindialog closed");
                    });
                }
            });*/
        }
        return this;
    }
    async loadText(url) {
        return new Promise((resolve) => {
            let oReq = new XMLHttpRequest();
            oReq.open("GET", url);
            oReq.onerror = () => {
                resolve(undefined);
            };
            oReq.addEventListener("load", () => {
                if (oReq.status === 200)
                    resolve(oReq.responseText);
                else
                    resolve(undefined);
            });
            oReq.send();
        });
    }
    async loadScript(url) {
        return new Promise((resolve) => {
            var js = window.document.createElement("script");
            js.src = url;
            js.onload = () => {
                resolve();
            };
            window.document.head.appendChild(js);
        });
    }

    loadModules(res, mods, modules,  startlib, beforestartlib, contextname) {
        var isServer= contextname !== "_";
        for (let x = 0; x < res.length; x++) {
            var conf = res[x].default;
            if (isServer)
                conf = conf.server;
            if (conf) {
                if (conf.css) {
                    var mod = mods[x];
                    mod = mod.substring(0, mod.length - "/modul".length);
                    var modpath = modules[mod];
                    for (let key in conf.css) {
                        let f = conf.css[key];
                        if (f.indexOf(":") > -1) //https://cdn
                            this.cssFiles[key] = f;
                        else if (modpath.endsWith(".js") || modpath.indexOf(".js?") > -1) {
                            var m = modpath.substring(0, modpath.lastIndexOf("/"));
                            this.cssFiles[key] = m + "/" + f;
                        }
                        else {
                            this.cssFiles[key] = modpath + "/" + f;
                        }
                    }
                }

                if (conf.loadonstart) {
                    conf.loadonstart.forEach((entr) => startlib.push(entr));
                }
                if (conf.loadbeforestart) {


                    conf.loadbeforestart.forEach((entr) => {
                        beforestartlib.push(entr);
                    });
                }
                let toadd = conf.require;
                if (toadd) {
                    require.s.contexts[contextname].configure(toadd);
                    /*if (!requireconfig.paths) {
                        requireconfig.paths = {};
                    }
                    if (toadd.paths)
                        Object.assign(requireconfig.paths, toadd.paths);
                    if (!requireconfig.shim) {
                        requireconfig.shim = {};
                    }
                    if (!requireconfig.map) {
                        requireconfig.map = {};
                    }
                    if (toadd.shim)
                        Object.assign(requireconfig.shim, toadd.shim);
                    if (toadd.map)
                        Object.assign(requireconfig.map, toadd.map);*/
                }
            }
        }
    }
    async loadBeforestart(beforestartlib, myrequire) {
        var _this = this;
        for (var x = 0; x < beforestartlib.length; x++) {
            const [beforestart] = await this.asyncrequire(myrequire, [beforestartlib[x]]);
            if (beforestart && beforestart.autostart) {
                await beforestart.autostart();
            }

        }
    }
    async loadRequirejs(requireconfig) {
        //load requirejs
        if (!window.requirejs) {
            let path;
            if (requireconfig === null || requireconfig === void 0 ? void 0 : requireconfig.paths) {
                path = requireconfig.paths["require.js"];
            }
            if (path === undefined)
                path = "//cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.js";
            await this.loadScript(path);
        }
        //wait for async sample
        define("async", {
            load: function (name, req, onload, config) {
                var file = name.split(":")[0];
                var func = name.split(":")[1];
                req([file], function (value) {
                    value[func]().then((ret) => onload(ret));
                });
            }
        });
        requirejs.onResourceLoad = function (context, map, depArray, o) {
            for (var x = 0; x < depArray.length; x++) {
                if (depArray[x].name.indexOf("jquery") > -1) {
                    x = x;
                }
            }
        };
    }
    async loadInternetModules(modules, myrequire) {
        var all = await new Promise((resolve) => {
            myrequire([], () => {
                let allmodules = {};
                let dowait = [];
                for (let modul in modules) {
                    if (modules[modul].endsWith(".js") || modules[modul].indexOf(".js?") > -1) {
                        dowait.push(this.loadScript(modules[modul]));
                    }
                }
                resolve(dowait);
            });
        });
        await Promise.all(all);
    }
    async asyncrequire(func, libs) {
        return new Promise(resolve => {
            func(libs, function (...ret) {
                resolve(ret);
            });
        });
    }
    async runContext(modules, myRequire, contextname, configtext, otherRequire, isLocalFolderMapped) {
        if (modules === undefined || modules.length === 0)
            return;
        await this.loadInternetModules(modules, myRequire);




        // await this.loadInternetModules(servermodules,serverRequire);

        var mods = [];
        var all = ["jassijs/remote/Jassi", "jassijs/remote/Config"];
        for (let key in modules) {
            mods.push(key + "/modul");
            all.push(key + "/modul");
        }
        var startlib = [];
        var beforestartlib = [];
        var _this = this;



        const [remoteJassi, config, ...res] = await this.asyncrequire(myRequire, all);
        config.config.init(configtext);
        config.config.isLocalFolderMapped = isLocalFolderMapped;
        if (contextname === "server") {
            //window.jassijs.modules = _this.config.modules;
            config.config.isServer = true;
            config.config.clientrequire = otherRequire;
            config.config.serverrequire = myRequire;
        } else {
            config.config.isServer = false;
            config.config.clientrequire = myRequire;
            config.config.serverrequire = otherRequire;
        }
        var requireconfig = {};
        require.s.contexts[contextname].configure(requireconfig);
        _this.loadModules(res, mods, modules,  startlib, beforestartlib,contextname);
        window.jassijs.options = _this.config.options;
        window.jassijs.cssFiles = _this.cssFiles;
      
        //            requirejs.config(requireconfig);
        //var context=JSON.parse(JSON.stringify(require.s.contexts._.config))



        await _this.loadBeforestart(beforestartlib, myRequire);

        const [jassijs, ...others] = await this.asyncrequire(myRequire, startlib);

        for (var key in _this.cssFiles) {
            //jassijs.default.myRequire(_this.cssFiles[key]);
        }
        if (_this.runFunction && window[_this.runFunction]) {
            window[_this.runFunction]();
        }
        if (_this.runScript && contextname === "_") {
            await this.asyncrequire(myRequire,[_this.runScript]);
            
        } 
    }
    async run() {

        var configtext = await this.loadText(this.configFile);
        var requireconfig = {};
        let modules;
        let servermodules;
        if (configtext) {
            var data = JSON.parse(configtext);
            if (data.require)
                requireconfig = data.require;
            modules = data.modules;
            servermodules = data.server.modules;
            this.config = data;
            // window.__jassijsconfig__ = data;//is consumed by Jassijs


        }
        if (data.runServerInBrowser === true)
            var localDir = await this.enableLocaldir();
        await this.loadRequirejs(requireconfig);
        requirejs.config({
            waitSeconds: 200,
            baseUrl: 'js',
            paths: {
                //"jassijs/ext": '../../jassijs/ext',
                "remote/jassijs/ext": '../../remote/jassijs/ext'
          
            }
        });

        var context = JSON.parse(JSON.stringify(require.s.contexts._.config))
        context.context = "server";
        context.urlArgs = "server=1";
        let serverRequire;
        if (data.runServerInBrowser) {
            serverRequire = requirejs.config(context);
            await this.runContext(servermodules, serverRequire, "server", configtext, requirejs, localDir !== undefined);
        }
        this.runContext(modules, requirejs, "_", configtext, serverRequire, localDir !== undefined);



    }
}
(() => {
    var jstart = new JassijsStarter();
    try {
        jstart.registerServiceWorker();
    } catch {
        console.log("could not start Serviceworker");
    }
    jstart.run();

})();


/*
 window.onerror =function(errorMsg, url, lineNumber, column, errorObj) {
    var stack=(errorObj===null||errorObj===undefined)?"":errorObj.stack;
    var s = 'Error: ' + errorMsg +
                               ' Script: ' + url +
                               ' (' + lineNumber +
                               ', ' + column +
                               '): ' +  stack+"->"+url;
    var err=this.document.getElementById("errormsg");
    var node=document.createTextNode(s);
    err.appendChild(node);
    return true;
}*/
