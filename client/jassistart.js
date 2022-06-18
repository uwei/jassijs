class JassijsStarter {
    runScript = document.currentScript.getAttribute("data-run");
    configFile = document.currentScript.getAttribute("data-config");
    runFunction = document.currentScript.getAttribute("data-run-function");
    cssFiles = {};
    //config data
    config;
    registerServiceWorker() {

        var http = new XMLHttpRequest();
        http.open('HEAD', 'service-worker.js', false);
        http.send();
        if (http.status === 401 || http.status === 404) {
            return;
        }

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js');
            navigator.serviceWorker.addEventListener("message", (evt) => {
                if (evt.data === "wait for login") {
                    new Promise((resolve_1, reject_1) => { require(["jassijs/base/LoginDialog"], resolve_1, reject_1); }).then((data) => {
                        data.login();
                        //          navigator.serviceWorker.controller.postMessage("logindialog closed");
                    });
                }
            });
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
    loadModules(res, mods, modules, requireconfig, startlib,beforestartlib) {
        for (let x = 0; x < res.length; x++) {
            if (res[x].default.css) {
                var mod = mods[x];
                mod = mod.substring(0, mod.length - "/modul".length);
                var modpath = modules[mod];
                for (let key in res[x].default.css) {
                    let f = res[x].default.css[key];
                    if (f.indexOf(":") > -1) //https://cdn
                        this.cssFiles[key]=f;
                    else if (modpath.endsWith(".js") || modpath.indexOf(".js?") > -1) {
                        var m = modpath.substring(0, modpath.lastIndexOf("/"));
                        this.cssFiles[key]=m + "/" + f;
                    }
                    else {
                        this.cssFiles[key]=modpath + "/" + f;
                    }
                }
            }
            if (res[x].default.loadonstart) {
                res[x].default.loadonstart.forEach((entr) => startlib.push(entr));
            }
            if (res[x].default.loadbeforestart) {
                res[x].default.loadbeforestart.forEach((entr) => beforestartlib.push(entr));
            }
            let toadd = res[x].default.require;
            if (toadd) {
                if (!requireconfig.paths) {
                    requireconfig.paths = {};
                }
                if (toadd.paths)
                    Object.assign(requireconfig.paths, toadd.paths);
                if (!requireconfig.shim) {
                    requireconfig.shim = {};
                }
                if (toadd.shim)
                    Object.assign(requireconfig.shim, toadd.shim);
            }
        }
    }
    async loadBeforestart(beforestartlib) {
        var _this = this;
        for (var x = 0; x < beforestartlib.length; x++) {
            await new Promise((resolve) => {
                require([beforestartlib[x]], function (beforestart) {
                    if (beforestart && beforestart.autostart) {
                        beforestart.autostart().then(() => {
                            resolve(undefined);
                        })
                    } else {
                        resolve(undefined);
                    }
                });
            })
            if (beforestartlib[x] === "jassijs/jassi") {
                
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
        /*requirejs.onResourceLoad = function (context, map, depArray, o) {
            for (var x = 0; x < depArray.length; x++) {
                if (depArray[x].name.indexOf("util/Parser") > -1) {
                    x = x;
                }
            }
        };*/
    }
    async loadInternetModules(modules){
        let allmodules = {};
            let dowait = [];
            for (let modul in modules) {
                if (modules[modul].endsWith(".js") || modules[modul].indexOf(".js?") > -1) {
                    dowait.push(this.loadScript(modules[modul]));
                }
            }
            for (let x = 0; x < dowait.length; x++) {
                var mod = await dowait[x];
            }
    }
    async run() {
        var smodules = await this.loadText(this.configFile);
        var requireconfig = {};
        let modules;

        if (smodules) {
            let data = JSON.parse(smodules);
            if (data.require)
                requireconfig = data.require;
            modules = data.modules;
            this.config=data;
           // window.__jassijsconfig__ = data;//is consumed by Jassijs
            
            
        }
        await this.loadRequirejs(requireconfig);
        await this.loadInternetModules(modules);
        requirejs.config({
            waitSeconds: 200,
            baseUrl: 'js',
            paths: {
                //"jassijs/ext": '../../jassijs/ext',
                "remote/jassijs/ext": '../../remote/jassijs/ext',
                "reflect-metadata": "https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect",

            }
        });
        var mods = [];
        var all = ["jassijs/remote/Jassi"];
        for (let key in modules) {
            mods.push(key + "/modul");
            all.push(key + "/modul");
        }
        var startlib = ["jassijs/jassi"];
        var beforestartlib = [];
        var _this = this;
        require(all, function (remoteJassi, ...res) {
            window.jassijs.modules=_this.config.modules;
          
            _this.loadModules(res, mods, modules, requireconfig, startlib,beforestartlib);
            window.jassijs.options=_this.config.options;
            window.jassijs.cssFiles=_this.cssFiles;
            requirejs.config(requireconfig);
            //read UserSettings after all beforestartlib are loaded
            beforestartlib.push("jassijs/jassi");
            beforestartlib.push("jassijs/remote/Settings");
            //load beforestartlib synchron

            _this.loadBeforestart(beforestartlib).then(() => {
                require(startlib, function (jassijs, ...others) {
                    for(var key in _this.cssFiles){
                        //jassijs.default.myRequire(_this.cssFiles[key]);
                    }
                    if (_this.runFunction && window[runFunction]) {
                        window[_this.runFunction]();
                    }
                    if (_this.runScript) {
                        require([_this.runScript], function () {
                        });
                    }
                });
            });
        });
    }
}

new JassijsStarter().registerServiceWorker().run();


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
