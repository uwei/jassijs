//@ts-ignore

import "jassijs/remote/Classes";
import { classes } from "jassijs/remote/Classes";
import registry from "jassijs/remote/Registry";

class ServerserviceProperties {
    name: string;
}
var allServices = {};
var serverservices: Serverservice = <any>new Proxy(allServices, {
    get(target, prop, receiver) {
        return new Promise(async (resolve, reject) => {
            if (target[prop]) {
                resolve(target[prop]);
            } else {
                var all = await registry.getJSONData("$Serverservice");
                for (var x = 0; x < all.length; x++) { 
                    var serv = all[x];
                    var name = serv.params[0].name;
                    if (name === prop) {
                        var classname = serv.classname;
                        var cl = await registry.getJSONData("$Class", classname);
                        if (require.main) {//nodes load project class from module
                            //@ts-ignore
                            await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                        } else {
                            //is loaded
                            //await import(classname.replaceAll(".", "/"));
                        }
                       
                    }
                    var cls = classes.getClass(classname);
                    target[prop] = new cls();
                    resolve(target[prop]);
                    return;
                }
            }

            reject("serverservice not found:" + <string>prop);
        });
    }
});

export function $Serverservice(properties: ServerserviceProperties): Function {
    return function (pclass) {
        registry.register("$Serverservice", pclass, properties);
    }
}

export { serverservices };


