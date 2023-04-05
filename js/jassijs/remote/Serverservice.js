"use strict";
//@ts-ignore
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverservices = exports.$Serverservice = void 0;
require("jassijs/remote/Classes");
const Classes_1 = require("jassijs/remote/Classes");
const Registry_1 = require("jassijs/remote/Registry");
class ServerserviceProperties {
}
var allServices = {};
var serverservices = new Proxy(allServices, {
    get(target, prop, receiver) {
        return new Promise(async (resolve, reject) => {
            if (target[prop]) {
                resolve(target[prop]);
            }
            else {
                var all = await Registry_1.default.getJSONData("$Serverservice");
                for (var x = 0; x < all.length; x++) {
                    var serv = all[x];
                    var name = serv.params[0].name;
                    if (name === prop) {
                        var classname = serv.classname;
                        var cl = await Registry_1.default.getJSONData("$Class", classname);
                        if (require.main) { //nodes load project class from module
                            //@ts-ignore
                            await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                        }
                        else {
                            //is loaded
                            //await import(classname.replaceAll(".", "/"));
                        }
                    }
                    var cls = Classes_1.classes.getClass(classname);
                    target[prop] = new cls();
                    resolve(target[prop]);
                    return;
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
//# sourceMappingURL=Serverservice.js.map