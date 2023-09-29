//@ts-ignore
define(["require", "exports", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Classes_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runningServerservices = exports.doNotReloadModule = exports.serverservices = exports.$Serverservice = exports.beforeServiceLoad = exports.ServerserviceProperties = void 0;
    class ServerserviceProperties {
    }
    exports.ServerserviceProperties = ServerserviceProperties;
    var runningServerservices = {};
    exports.runningServerservices = runningServerservices;
    var beforeServiceLoadHandler = [];
    function beforeServiceLoad(func) {
        beforeServiceLoadHandler.push(func);
    }
    exports.beforeServiceLoad = beforeServiceLoad;
    var serverservices = new Proxy(runningServerservices, {
        get(target, prop, receiver) {
            return new Promise(async (resolve, reject) => {
                var khsdf = runningServerservices;
                if (target[prop]) {
                    resolve(target[prop]);
                    return;
                }
                else {
                    var all = await Registry_1.default.getJSONData("$Serverservice");
                    for (var x = 0; x < all.length; x++) {
                        var serv = all[x];
                        var name = serv.params[0].name;
                        if (name === prop) {
                            var classname = serv.classname;
                            var cl = await Registry_1.default.getJSONData("$Class", classname);
                            //@ts-ignore
                            if (require.main) { //nodes load project class from module
                                /*for (var jfile in require.cache) {
                                    if(jfile.replaceAll("\\","/").endsWith(serv.filename.substring(0,serv.filename.length-2)+"js")){
                                        delete require.cache[jfile];
                                    }
                                }*/
                                //@ts-ignore
                                await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                            }
                            else {
                                await Classes_1.classes.loadClass(classname); //await import(classname.replaceAll(".", "/"));
                            }
                            var props = Registry_1.default.getData("$Serverservice", classname)[0].params[0];
                            for (var x = 0; x < beforeServiceLoadHandler.length; x++) {
                                await beforeServiceLoadHandler[x](prop, props);
                            }
                            var instance = props.getInstance();
                            target[prop] = instance;
                            resolve(instance);
                            return;
                        }
                    }
                }
                reject("serverservice not found:" + prop);
            });
        }
    });
    exports.serverservices = serverservices;
    function $Serverservice(properties) {
        return function (pclass) {
            Registry_1.default.register("$Serverservice", pclass, properties);
        };
    }
    exports.$Serverservice = $Serverservice;
    var doNotReloadModule = true;
    exports.doNotReloadModule = doNotReloadModule;
});
//# sourceMappingURL=Serverservice.js.map