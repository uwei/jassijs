

async function loadText(url) {
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
async function loadScript(url) {
    return new Promise((resolve) => {
        var js = window.document.createElement("script");
        js.src = url;
        js.onload = () => {
            resolve()
        }
        window.document.head.appendChild(js);
    });
}



var runScript = document.currentScript.getAttribute("data-run");
var configFile = document.currentScript.getAttribute("data-config");
async function run() {
    var smodules = await loadText(configFile);
    var requireconfig = {};
    let modules;
    if (smodules) {
        let data = JSON.parse(smodules);
        if (data.require)
            requireconfig = data.require;
        modules = data.modules;

        //load requirejs
        if (!window.requirejs){
            let path;
            if(requireconfig?.paths){
                path=requireconfig.paths["require.js"];
            }
            if(path===undefined)
                path="//cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.js";
            await loadScript(path);
        }


        let allmodules = {};
        let dowait = []
        for (let modul in modules) {
            if (modules[modul].endsWith(".js")) {
                dowait.push(loadScript(modules[modul]));
            }
            /*let modulpath = "./" + modul + "/jassi.json";
            if(data.require&&data.require.paths&&data.require.paths[modul])
                modulpath=data.require.paths[modul]+"/jassi.json";
            allmodules[modul] = loadText(modulpath);*/
        }
        for (let x = 0; x < dowait.length; x++) {
            await dowait[x];
        }
        /*for (let modul in modules) {
            var reqs = await allmodules[modul]
            if (reqs) {
                let toadd = JSON.parse(reqs).require;
                if (toadd){
                    if(!requireconfig.paths){
                        requireconfig.paths={}
                    }
                    if(toadd.paths)
                        Object.assign(requireconfig.paths, toadd.paths);
                    if(!requireconfig.shim){
                        requireconfig.shim={}
                    }
                    if(toadd.shim)
                    Object.assign(requireconfig.shim, toadd.shim);
                }
            }
        }*/
    }
   
    requirejs.config({
        baseUrl: 'js',
        paths: {
            //"jassi/ext": '../../jassi/ext',
            "remote/jassi/ext": '../../remote/jassi/ext'
        }
    });
    var mods = [];
    for (let key in modules) {
        mods.push(key+"/modul");
    }
    require(mods, function (...res) {
        for (let x = 0; x < res.length; x++) {
            let toadd = res[x].default.require;
            if (toadd) {
                if (!requireconfig.paths) {
                    requireconfig.paths = {}
                }
                if (toadd.paths)
                    Object.assign(requireconfig.paths, toadd.paths);
                if (!requireconfig.shim) {
                    requireconfig.shim = {}
                }
                if (toadd.shim)
                    Object.assign(requireconfig.shim, toadd.shim);
            }
        }
        requirejs.config(requireconfig);

        require(["jassi/jassi"], function (jassi) {
            jassi.default.modules=modules;
            if (runScript) {
                require([runScript], function () {

                });
            }
        });
    });

};
run();











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

