define(["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/Registry"], function (require, exports, jassijs_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Extensions = void 0;
    class Extensions {
        constructor() {
            this.items = {};
        }
        /**
         * extend the class
         * @param {class} type - extend the type - add functions
         */
        extend(classname, classdef) {
            var exts = this.items[classname];
            if (exts !== undefined) {
                for (var alias in exts) {
                    var cl = exts[alias];
                    if (cl.extend) {
                        cl.extend(classdef);
                    }
                }
            }
        }
        async forFile(file) {
            var items = await Registry_1.default.getJSONData("extensions");
            return items[file];
        }
        /**
         * init the Extensions
         */
        init() {
            /*
            var config={
                paths:{},
                shim:{},
                map:{'*':{}}
            }

            var items=registry.get("extensions");
            for(var clname in items){
                var file=clname.replaceAll(".","/");
                config.paths[clname]=file;
                config.map["*"][file]=clname;
                
                var files=["jassijs/jassi"];
                for(var f=0;f<items[clname].length;f++){
                    files.push("js/"+items[clname][f].file.replace(".ts",".js"));
                }
                config.shim[clname]=files;
            }*/
            //requirejs.config(config);
        }
        /**
         * extend an existing class
         * all methods and property where copied
         * @param {string} - the name of the class to extend
         * @param {class} - the class
         */
        register(name, extClass, alias) {
            if (alias === undefined)
                throw "Error Extension " + name + ": alias must be implemented";
            if (this.items[name] === undefined)
                this.items[name] = {};
            this.items[name][alias] = extClass;
        }
    }
    exports.Extensions = Extensions;
    var extensions = jassijs_1.default.extensions;
    exports.default = extensions;
});
//# sourceMappingURL=Extensions.js.map
//# sourceMappingURL=Extensions.js.map