define(["require", "exports", "reflect-metadata"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.migrateModul = exports.Registry = void 0;
    if (Reflect["_metadataorg"] === undefined) {
        Reflect["_metadataorg"] = Reflect["metadata"];
        if (Reflect["_metadataorg"] === undefined)
            Reflect["_metadataorg"] = null;
    }
    //@ts-ignore
    Reflect["metadata"] = function (o, property, ...args) {
        return function (target, propertyKey, descriptor, ...fargs) {
            //delegation to 
            if (Reflect["_metadataorg"] !== null) {
                var func = Reflect["_metadataorg"](o, property, ...args);
                func(target, propertyKey, descriptor, ...fargs);
            }
            if (o === "design:type") {
                registry.registerMember("design:type", target, propertyKey, property);
            }
        };
    };
    class DataEntry {
    }
    class JSONDataEntry {
    }
    /**
    * Manage all known data registered by jassijs.register
    * the data is downloaded by /registry.json
    * registry.json is updated by the server on code upload
    * @class jassijs.base.Registry
    */
    class Registry {
        constructor() {
            this.jsondata = undefined;
            this.data = {};
            this.dataMembers = {};
            this.jsondataMembers = {};
            this._eventHandler = {};
            this._nextID = 10;
        }
        getData(service, classname = undefined) {
            var olddata = this.data[service];
            if (olddata === undefined)
                return [];
            var ret = [];
            if (classname !== undefined) {
                if (olddata[classname] !== undefined) {
                    ret.push(olddata[classname]);
                }
            }
            else {
                for (var key in olddata) {
                    ret.push(olddata[key]);
                }
            }
            return ret;
        }
        onregister(service, callback) {
            var events = this._eventHandler[service];
            if (events === undefined) {
                events = [];
                this._eventHandler[service] = events;
            }
            events.push(callback);
            //push already registered events
            var olddata = this.data[service];
            for (var key in olddata) {
                var dataentry = olddata[key];
                callback(dataentry.oclass, ...dataentry.params);
            }
            return callback;
        }
        offregister(service, callback) {
            var events = this._eventHandler[service];
            var pos = events.indexOf(callback);
            if (pos >= 0)
                events.splice(pos, 1);
        }
        /**
         * register an anotation
         * Important: this function should only used from an annotation, because the annotation is saved in
         *            index.json and could be read without loading the class
         **/
        register(service, oclass, ...params) {
            var sclass = oclass.prototype.constructor._classname;
            if (sclass === undefined && service !== "$Class") {
                throw new Error("@$Class member is missing or must be set at last");
                return;
            }
            if (service === "$Class") {
                sclass = params[0];
                oclass.prototype.constructor._classname = params[0];
            }
            if (this.data[service] === undefined) {
                this.data[service] = {};
            }
            this.data[service][sclass] = { oclass, params };
            //the array could be modified so we need a copy
            var events = this._eventHandler[service] === undefined ? undefined : [].concat(this._eventHandler[service]);
            if (events !== undefined) {
                for (var x = 0; x < events.length; x++) {
                    events[x](oclass, ...params);
                }
            }
            if (service === "$Class") {
                //console.log("load " + params[0]);
                //finalize temporary saved registerd members
                let tempMem = oclass.prototype.$$tempRegisterdMembers$$;
                if (tempMem === undefined)
                    //@ts-ignore
                    tempMem = oclass.$$tempRegisterdMembers$$;
                if (tempMem !== undefined) {
                    //this.dataMembers = oclass.prototype.$$tempRegisterdMembers$$;
                    for (var sservice in tempMem) {
                        var pservice = tempMem[sservice];
                        if (this.dataMembers[sservice] === undefined) {
                            this.dataMembers[sservice] = {};
                        }
                        this.dataMembers[sservice][sclass] = pservice;
                    }
                    delete oclass.prototype.$$tempRegisterdMembers$$;
                    //@ts-ignore
                    delete oclass.$$tempRegisterdMembers$$;
                }
            }
        }
        getMemberData(service) {
            return this.dataMembers[service];
        }
        getJSONMemberData(service) {
            return this.jsondataMembers[service];
        }
        /**
         * register an anotation
         * Important: this function should only used from an annotation
         **/
        registerMember(service, oclass /*new (...args: any[]) => any*/, membername, ...params) {
            var m = oclass;
            if (oclass.prototype !== undefined)
                m = oclass.prototype;
            //the classname is not already known so we temporarly store the data in oclass.$$tempRegisterdMembers$$
            //and register the member in register("$Class",....)
            if (m.$$tempRegisterdMembers$$ === undefined) {
                m.$$tempRegisterdMembers$$ = {};
            }
            if (m.$$tempRegisterdMembers$$[service] === undefined) {
                m.$$tempRegisterdMembers$$[service] = {};
            }
            if (m.$$tempRegisterdMembers$$[service][membername] === undefined) {
                m.$$tempRegisterdMembers$$[service][membername] = [];
            }
            m.$$tempRegisterdMembers$$[service][membername].push(params);
        }
        /**
        * with every call a new id is generated - used to create a free id for the dom
        * @returns {number} - the id
        */
        nextID() {
            this._nextID = this._nextID + 1;
            return this._nextID.toString();
        }
        /**
        * Load text with Ajax synchronously: takes path to file and optional MIME type
        * @param {string} filePath - the url
        * @returns {string} content
        */ /*
        loadFile(filePath)
        {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let response = null;
                xhr.addEventListener("readystatechange", function() {
                  if (this.readyState === xhr.DONE) {
                    response = this.responseText;
                    if (response) {
                      //response = JSON.parse(response);
                      resolve(response);
                    }
                  }
                });
                xhr.open("GET",filePath, true);
                xhr.send();
                xhr.overrideMimeType("application/json");
                xhr.onerror = function(error) {
                  reject({
                    error: "Some error"
                  })
                }
              });
        }*/
        async loadText(url) {
            return new Promise((resolve) => {
                //@ts-ignore
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
        /**
         * reload the registry
         */
        async reload() {
            this.jsondata = { $Class: {} };
            this.jsondataMembers = {};
            var _this = this;
            var modultext = "";
            //@ts-ignore
            if ((window === null || window === void 0 ? void 0 : window.document) === undefined) { //on server
                //@ts-ignore
                var fs = await new Promise((resolve_1, reject_1) => { require(['fs'], resolve_1, reject_1); });
                modultext = fs.readFileSync("./jassijs.json", 'utf-8');
                var modules = JSON.parse(modultext).modules;
                for (let modul in modules) {
                    try {
                        try {
                            //@ts-ignore
                            delete require.cache[require.resolve(modul + "/registry")];
                        }
                        catch (_a) {
                            //@ts-ignore
                            var s = (require.main["path"] + "/" + modul + "/registry").replaceAll("\\", "/") + ".js";
                            //@ts-ignore
                            delete require.cache[s];
                            //@ts-ignore
                            delete require.cache[s.replaceAll("/", "\\")];
                        }
                        //@ts-ignore
                        var data = (await require.main.require(modul + "/registry")).default;
                        this.initJSONData(data);
                    }
                    catch (_b) {
                        console.error("failed load registry " + modul + "/registry.js");
                    }
                }
            }
            else { //on client
                var all = {};
                var mod = JSON.parse(await (this.loadText("jassijs.json")));
                for (let modul in mod.modules) {
                    if (!mod.modules[modul].endsWith(".js") && mod.modules[modul].indexOf(".js?") === -1)
                        //@ts-ignore
                        requirejs.undef(modul + "/registry");
                    {
                        var m = modul;
                        all[modul] = new Promise((resolve, reject) => {
                            //@ts-ignore
                            require([m + "/registry"], function (ret, r2) {
                                resolve(ret.default);
                            });
                        });
                    }
                }
                for (let modul in mod.modules) {
                    var data = await all[modul];
                    _this.initJSONData(data);
                }
            }
            /* for (let modul in modules) {
            
                        //requirejs.undef("js/"+modul+"/registry.js");
                        all[modul] = fs.readFileSync("./../client/"+modul+"/registry.js", 'utf-8');
                    }
                    for (let modul in modules) {
                        var data = await all[modul].default;
                        _this.initJSONData(data);
                    }
            */
            //var reg = await this.reloadRegistry();
            //_this.initJSONData(reg);
            /*     requirejs.undef("text!../../../../registry.json?bust="+window["jassiversion"]);
             require(["text!../../../../registry.json?bust="+window["jassiversion"]], function(registry){
                 _this.init(registry);
             });*/
        }
        /**
        * loads entries from json string
        * @param {string} json - jsondata
        */
        initJSONData(json) {
            if (json === undefined)
                return;
            var vdata = json;
            for (var file in vdata) {
                var vfiles = vdata[file];
                for (var classname in vfiles) {
                    if (classname === "date")
                        continue;
                    this.jsondata.$Class[classname] = {
                        classname: classname,
                        params: [classname],
                        filename: file
                    };
                    var theclass = vfiles[classname];
                    for (var service in theclass) {
                        if (service === "@members") {
                            //public jsondataMembers: { [service: string]: { [classname: string]: { [membername: string]: any[] } } } = {};
                            var mems = theclass[service];
                            for (let mem in mems) {
                                let scs = mems[mem];
                                for (let sc in scs) {
                                    if (!this.jsondataMembers[sc])
                                        this.jsondataMembers[sc] = {};
                                    if (!this.jsondataMembers[sc][classname])
                                        this.jsondataMembers[sc][classname] = {};
                                    if (this.jsondataMembers[sc][classname][mem] === undefined)
                                        this.jsondataMembers[sc][classname][mem] = [];
                                    this.jsondataMembers[sc][classname][mem].push(scs[sc]);
                                }
                            }
                        }
                        else {
                            if (this.jsondata[service] === undefined)
                                this.jsondata[service] = {};
                            var entr = new JSONDataEntry();
                            entr.params = theclass[service];
                            entr.classname = classname; //vfiles.$Class === undefined ? undefined : vfiles.$Class[0];
                            entr.filename = file;
                            this.jsondata[service][entr.classname] = entr;
                        }
                    }
                }
            }
        }
        /**
         *
         * @param service - the service for which we want informations
         */
        async getJSONData(service, classname = undefined) {
            if (this.isLoading)
                await this.isLoading;
            if (this.jsondata === undefined) {
                this.isLoading = this.reload();
                await this.isLoading;
            }
            this.isLoading = undefined;
            var ret = [];
            var odata = this.jsondata[service];
            if (odata === undefined)
                return ret;
            if (classname !== undefined)
                return odata[classname] === undefined ? undefined : [odata[classname]];
            for (var clname in odata) {
                if (classname === undefined || classname === clname)
                    ret.push(odata[clname]);
            }
            return ret;
        }
        getAllFilesForService(service, classname = undefined) {
            var data = this.jsondata[service];
            var ret = [];
            for (var clname in data) {
                var test = data[clname];
                if (classname == undefined || test.classname === classname)
                    ret.push(test.filename);
            }
            return ret;
        }
        async loadAllFilesForEntries(entries) {
            var files = [];
            for (let x = 0; x < entries.length; x++) {
                if (files.indexOf(entries[x].filename) === -1)
                    files.push(entries[x].filename);
            }
            await this.loadAllFiles(files);
        }
        /**
         * load all files that registered the service
         * @param {string} service - name of the service
         * @param {function} callback - called when loading is finished
         */
        async loadAllFilesForService(service) {
            var services = this.getAllFilesForService(service);
            await this.loadAllFiles(services);
        }
        /**
         * load all files
         * @param {string} files - the files to load
         */
        async loadAllFiles(files) {
            //   var services = this.getAllFilesForService(service);
            return new Promise((resolve, reject) => {
                var dependency = [];
                for (var x = 0; x < files.length; x++) {
                    var name = files[x];
                    if (name.endsWith(".ts"))
                        name = name.substring(0, name.length - 3);
                    dependency.push(name);
                }
                var req = require;
                req(dependency, function () {
                    resolve(undefined);
                });
            });
        }
    }
    exports.Registry = Registry;
    ;
    var registry = new Registry();
    exports.default = registry;
    function migrateModul(oldModul, newModul) {
        newModul.registry._nextID = oldModul.registry._nextID;
        newModul.registry.entries = oldModul.registry.entries;
    }
    exports.migrateModul = migrateModul;
});
//jassijs.registry=registry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzL3JlbW90ZS9SZWdpc3RyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBTUEsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQ3ZDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDOUMsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssU0FBUztZQUNyQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ3RDO0lBRUQsWUFBWTtJQUNaLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJO1FBQ2hELE9BQU8sVUFBVSxNQUFXLEVBQUUsV0FBbUIsRUFBRSxVQUE4QixFQUFFLEdBQUcsS0FBSztZQUN2RixnQkFBZ0I7WUFFaEIsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUNsQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQzthQUNuRDtZQUNELElBQUksQ0FBQyxLQUFLLGFBQWEsRUFBRTtnQkFDckIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQzthQUN6RTtRQUNMLENBQUMsQ0FBQTtJQUNMLENBQUMsQ0FBQTtJQUVELE1BQU0sU0FBUztLQUdkO0lBRUQsTUFBTSxhQUFhO0tBSWxCO0lBR0Q7Ozs7O01BS0U7SUFDRixNQUFhLFFBQVE7UUFRakI7WUFOTyxhQUFRLEdBQWtF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QUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ25DLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQzt3QkFDcEIsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3pCO2dCQUNELElBQUksR0FBRyxHQUFRLE9BQU8sQ0FBQztnQkFDdkIsR0FBRyxDQUFDLFVBQVUsRUFBRTtvQkFDWixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQ0o7SUFwWkQsNEJBb1pDO0lBQUEsQ0FBQztJQUVGLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7SUFDOUIsa0JBQWUsUUFBUSxDQUFDO0lBQ3hCLFNBQWdCLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUTtRQUMzQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUN0RCxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztJQUMxRCxDQUFDO0lBSEQsb0NBR0M7O0FBQ0QsNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCBcInJlZmxlY3QtbWV0YWRhdGFcIjtcclxuXHJcblxyXG5cclxuXHJcbmlmIChSZWZsZWN0W1wiX21ldGFkYXRhb3JnXCJdID09PSB1bmRlZmluZWQpIHtcclxuICAgIFJlZmxlY3RbXCJfbWV0YWRhdGFvcmdcIl0gPSBSZWZsZWN0W1wibWV0YWRhdGFcIl07XHJcbiAgICBpZiAoUmVmbGVjdFtcIl9tZXRhZGF0YW9yZ1wiXSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIFJlZmxlY3RbXCJfbWV0YWRhdGFvcmdcIl0gPSBudWxsO1xyXG59XHJcblxyXG4vL0B0cy1pZ25vcmVcclxuUmVmbGVjdFtcIm1ldGFkYXRhXCJdID0gZnVuY3Rpb24gKG8sIHByb3BlcnR5LCAuLi5hcmdzKTogRnVuY3Rpb24ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZywgZGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yLCAuLi5mYXJncykge1xyXG4gICAgICAgIC8vZGVsZWdhdGlvbiB0byBcclxuXHJcbiAgICAgICAgaWYgKFJlZmxlY3RbXCJfbWV0YWRhdGFvcmdcIl0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGZ1bmMgPSBSZWZsZWN0W1wiX21ldGFkYXRhb3JnXCJdKG8sIHByb3BlcnR5LCAuLi5hcmdzKTtcclxuICAgICAgICAgICAgZnVuYyh0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yLCAuLi5mYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvID09PSBcImRlc2lnbjp0eXBlXCIpIHtcclxuICAgICAgICAgICAgcmVnaXN0cnkucmVnaXN0ZXJNZW1iZXIoXCJkZXNpZ246dHlwZVwiLCB0YXJnZXQsIHByb3BlcnR5S2V5LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBEYXRhRW50cnkge1xyXG4gICAgb2NsYXNzOiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7XHJcbiAgICBwYXJhbXM6IGFueVtdO1xyXG59XHJcblxyXG5jbGFzcyBKU09ORGF0YUVudHJ5IHtcclxuICAgIGNsYXNzbmFtZTogc3RyaW5nO1xyXG4gICAgcGFyYW1zOiBhbnlbXTtcclxuICAgIGZpbGVuYW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG4vKiogICAgICAgICAgICAgICAgICAgICAgIFxyXG4qIE1hbmFnZSBhbGwga25vd24gZGF0YSByZWdpc3RlcmVkIGJ5IGphc3NpanMucmVnaXN0ZXJcclxuKiB0aGUgZGF0YSBpcyBkb3dubG9hZGVkIGJ5IC9yZWdpc3RyeS5qc29uXHJcbiogcmVnaXN0cnkuanNvbiBpcyB1cGRhdGVkIGJ5IHRoZSBzZXJ2ZXIgb24gY29kZSB1cGxvYWQgXHJcbiogQGNsYXNzIGphc3NpanMuYmFzZS5SZWdpc3RyeSBcclxuKi9cclxuZXhwb3J0IGNsYXNzIFJlZ2lzdHJ5IHtcclxuICAgIHByaXZhdGUgX25leHRJRDogbnVtYmVyO1xyXG4gICAgcHVibGljIGpzb25kYXRhOiB7IFtzZXJ2aWNlOiBzdHJpbmddOiB7IFtjbGFzc25hbWU6IHN0cmluZ106IEpTT05EYXRhRW50cnkgfSB9ID0gdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIGRhdGE6IHsgW3NlcnZpY2U6IHN0cmluZ106IHsgW2NsYXNzbmFtZTogc3RyaW5nXTogRGF0YUVudHJ5IH0gfSA9IHt9O1xyXG4gICAgcHVibGljIGRhdGFNZW1iZXJzOiB7IFtzZXJ2aWNlOiBzdHJpbmddOiB7IFtjbGFzc25hbWU6IHN0cmluZ106IHsgW21lbWJlcm5hbWU6IHN0cmluZ106IGFueVtdIH0gfSB9ID0ge307XHJcbiAgICBwdWJsaWMganNvbmRhdGFNZW1iZXJzOiB7IFtzZXJ2aWNlOiBzdHJpbmddOiB7IFtjbGFzc25hbWU6IHN0cmluZ106IHsgW21lbWJlcm5hbWU6IHN0cmluZ106IGFueVtdIH0gfSB9ID0ge307XHJcbiAgICBwcml2YXRlIGlzTG9hZGluZzogYW55O1xyXG4gICAgX2V2ZW50SGFuZGxlcjogeyBbc2VydmljZTogc3RyaW5nXTogYW55W10gfSA9IHt9O1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fbmV4dElEID0gMTA7XHJcblxyXG4gICAgfVxyXG4gICAgZ2V0RGF0YShzZXJ2aWNlOiBzdHJpbmcsIGNsYXNzbmFtZTogc3RyaW5nID0gdW5kZWZpbmVkKTogRGF0YUVudHJ5W10ge1xyXG4gICAgICAgIHZhciBvbGRkYXRhID0gdGhpcy5kYXRhW3NlcnZpY2VdO1xyXG4gICAgICAgIGlmIChvbGRkYXRhID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB2YXIgcmV0ID0gW107XHJcbiAgICAgICAgaWYgKGNsYXNzbmFtZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChvbGRkYXRhW2NsYXNzbmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0LnB1c2gob2xkZGF0YVtjbGFzc25hbWVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBvbGRkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICByZXQucHVzaChvbGRkYXRhW2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBvbnJlZ2lzdGVyKHNlcnZpY2U6IHN0cmluZywgY2FsbGJhY2s6IChvY2xhc3M6IG5ldyAoLi4uYXJnczogYW55W10pID0+IGFueSwgLi4ucGFyYW1zKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50SGFuZGxlcltzZXJ2aWNlXTtcclxuICAgICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZXZlbnRzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlcltzZXJ2aWNlXSA9IGV2ZW50cztcclxuICAgICAgICB9XHJcbiAgICAgICAgZXZlbnRzLnB1c2goY2FsbGJhY2spO1xyXG4gICAgICAgIC8vcHVzaCBhbHJlYWR5IHJlZ2lzdGVyZWQgZXZlbnRzXHJcbiAgICAgICAgdmFyIG9sZGRhdGEgPSB0aGlzLmRhdGFbc2VydmljZV07XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9sZGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIGRhdGFlbnRyeSA9IG9sZGRhdGFba2V5XTtcclxuICAgICAgICAgICAgY2FsbGJhY2soZGF0YWVudHJ5Lm9jbGFzcywgLi4uZGF0YWVudHJ5LnBhcmFtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYWxsYmFjaztcclxuICAgIH1cclxuICAgIG9mZnJlZ2lzdGVyKHNlcnZpY2U6IHN0cmluZywgY2FsbGJhY2s6IChvY2xhc3M6IG5ldyAoLi4uYXJnczogYW55W10pID0+IGFueSwgLi4ucGFyYW1zKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50SGFuZGxlcltzZXJ2aWNlXTtcclxuICAgICAgICB2YXIgcG9zID0gZXZlbnRzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgZXZlbnRzLnNwbGljZShwb3MsIDEpO1xyXG4gICAgfVxyXG4gICAgLyoqIFxyXG4gICAgICogcmVnaXN0ZXIgYW4gYW5vdGF0aW9uXHJcbiAgICAgKiBJbXBvcnRhbnQ6IHRoaXMgZnVuY3Rpb24gc2hvdWxkIG9ubHkgdXNlZCBmcm9tIGFuIGFubm90YXRpb24sIGJlY2F1c2UgdGhlIGFubm90YXRpb24gaXMgc2F2ZWQgaW5cclxuICAgICAqICAgICAgICAgICAgaW5kZXguanNvbiBhbmQgY291bGQgYmUgcmVhZCB3aXRob3V0IGxvYWRpbmcgdGhlIGNsYXNzXHJcbiAgICAgKiovXHJcbiAgICByZWdpc3RlcihzZXJ2aWNlOiBzdHJpbmcsIG9jbGFzczogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55LCAuLi5wYXJhbXMpIHtcclxuICAgICAgICB2YXIgc2NsYXNzID0gb2NsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5fY2xhc3NuYW1lO1xyXG4gICAgICAgIGlmIChzY2xhc3MgPT09IHVuZGVmaW5lZCAmJiBzZXJ2aWNlICE9PSBcIiRDbGFzc1wiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkAkQ2xhc3MgbWVtYmVyIGlzIG1pc3Npbmcgb3IgbXVzdCBiZSBzZXQgYXQgbGFzdFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VydmljZSA9PT0gXCIkQ2xhc3NcIikge1xyXG4gICAgICAgICAgICBzY2xhc3MgPSBwYXJhbXNbMF07XHJcbiAgICAgICAgICAgIG9jbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IuX2NsYXNzbmFtZSA9IHBhcmFtc1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVtzZXJ2aWNlXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVtzZXJ2aWNlXSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRhdGFbc2VydmljZV1bc2NsYXNzXSA9IHsgb2NsYXNzLCBwYXJhbXMgfTtcclxuICAgICAgICAvL3RoZSBhcnJheSBjb3VsZCBiZSBtb2RpZmllZCBzbyB3ZSBuZWVkIGEgY29weVxyXG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudEhhbmRsZXJbc2VydmljZV0gPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IFtdLmNvbmNhdCh0aGlzLl9ldmVudEhhbmRsZXJbc2VydmljZV0pO1xyXG5cclxuICAgICAgICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBldmVudHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50c1t4XShvY2xhc3MsIC4uLnBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlcnZpY2UgPT09IFwiJENsYXNzXCIpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImxvYWQgXCIgKyBwYXJhbXNbMF0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vZmluYWxpemUgdGVtcG9yYXJ5IHNhdmVkIHJlZ2lzdGVyZCBtZW1iZXJzXHJcbiAgICAgICAgICAgIGxldCB0ZW1wTWVtID0gb2NsYXNzLnByb3RvdHlwZS4kJHRlbXBSZWdpc3RlcmRNZW1iZXJzJCQ7XHJcbiAgICAgICAgICAgIGlmICh0ZW1wTWVtID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIHRlbXBNZW0gPSBvY2xhc3MuJCR0ZW1wUmVnaXN0ZXJkTWVtYmVycyQkO1xyXG4gICAgICAgICAgICBpZiAodGVtcE1lbSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMuZGF0YU1lbWJlcnMgPSBvY2xhc3MucHJvdG90eXBlLiQkdGVtcFJlZ2lzdGVyZE1lbWJlcnMkJDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHNzZXJ2aWNlIGluIHRlbXBNZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHNlcnZpY2UgPSB0ZW1wTWVtW3NzZXJ2aWNlXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhTWVtYmVyc1tzc2VydmljZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFNZW1iZXJzW3NzZXJ2aWNlXSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFNZW1iZXJzW3NzZXJ2aWNlXVtzY2xhc3NdID0gPGFueT5wc2VydmljZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvY2xhc3MucHJvdG90eXBlLiQkdGVtcFJlZ2lzdGVyZE1lbWJlcnMkJDtcclxuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIG9jbGFzcy4kJHRlbXBSZWdpc3RlcmRNZW1iZXJzJCQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRNZW1iZXJEYXRhKHNlcnZpY2U6IHN0cmluZyk6IHtcclxuICAgICAgICBbY2xhc3NuYW1lOiBzdHJpbmddOiB7XHJcbiAgICAgICAgICAgIFttZW1iZXJuYW1lOiBzdHJpbmddOiBhbnlbXVxyXG4gICAgICAgIH1cclxuICAgIH0ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhTWVtYmVyc1tzZXJ2aWNlXTtcclxuXHJcbiAgICB9XHJcbiAgICBnZXRKU09OTWVtYmVyRGF0YShzZXJ2aWNlOiBzdHJpbmcpOiB7XHJcbiAgICAgICAgW2NsYXNzbmFtZTogc3RyaW5nXToge1xyXG4gICAgICAgICAgICBbbWVtYmVybmFtZTogc3RyaW5nXTogYW55W11cclxuICAgICAgICB9XHJcbiAgICB9IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuanNvbmRhdGFNZW1iZXJzW3NlcnZpY2VdO1xyXG5cclxuICAgIH1cclxuICAgIC8qKiBcclxuICAgICAqIHJlZ2lzdGVyIGFuIGFub3RhdGlvblxyXG4gICAgICogSW1wb3J0YW50OiB0aGlzIGZ1bmN0aW9uIHNob3VsZCBvbmx5IHVzZWQgZnJvbSBhbiBhbm5vdGF0aW9uXHJcbiAgICAgKiovXHJcbiAgICByZWdpc3Rlck1lbWJlcihzZXJ2aWNlOiBzdHJpbmcsIG9jbGFzczogYW55LypuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkqLywgbWVtYmVybmFtZTogc3RyaW5nLCAuLi5wYXJhbXMpIHtcclxuICAgICAgICB2YXIgbSA9IG9jbGFzcztcclxuICAgICAgICBpZiAob2NsYXNzLnByb3RvdHlwZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBtID0gb2NsYXNzLnByb3RvdHlwZTtcclxuICAgICAgICAvL3RoZSBjbGFzc25hbWUgaXMgbm90IGFscmVhZHkga25vd24gc28gd2UgdGVtcG9yYXJseSBzdG9yZSB0aGUgZGF0YSBpbiBvY2xhc3MuJCR0ZW1wUmVnaXN0ZXJkTWVtYmVycyQkXHJcbiAgICAgICAgLy9hbmQgcmVnaXN0ZXIgdGhlIG1lbWJlciBpbiByZWdpc3RlcihcIiRDbGFzc1wiLC4uLi4pXHJcbiAgICAgICAgaWYgKG0uJCR0ZW1wUmVnaXN0ZXJkTWVtYmVycyQkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbS4kJHRlbXBSZWdpc3RlcmRNZW1iZXJzJCQgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG0uJCR0ZW1wUmVnaXN0ZXJkTWVtYmVycyQkW3NlcnZpY2VdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbS4kJHRlbXBSZWdpc3RlcmRNZW1iZXJzJCRbc2VydmljZV0gPSB7fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtLiQkdGVtcFJlZ2lzdGVyZE1lbWJlcnMkJFtzZXJ2aWNlXVttZW1iZXJuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG0uJCR0ZW1wUmVnaXN0ZXJkTWVtYmVycyQkW3NlcnZpY2VdW21lbWJlcm5hbWVdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG0uJCR0ZW1wUmVnaXN0ZXJkTWVtYmVycyQkW3NlcnZpY2VdW21lbWJlcm5hbWVdLnB1c2gocGFyYW1zKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiB3aXRoIGV2ZXJ5IGNhbGwgYSBuZXcgaWQgaXMgZ2VuZXJhdGVkIC0gdXNlZCB0byBjcmVhdGUgYSBmcmVlIGlkIGZvciB0aGUgZG9tXHJcbiAgICAqIEByZXR1cm5zIHtudW1iZXJ9IC0gdGhlIGlkXHJcbiAgICAqL1xyXG4gICAgbmV4dElEKCkge1xyXG4gICAgICAgIHRoaXMuX25leHRJRCA9IHRoaXMuX25leHRJRCArIDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25leHRJRC50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIExvYWQgdGV4dCB3aXRoIEFqYXggc3luY2hyb25vdXNseTogdGFrZXMgcGF0aCB0byBmaWxlIGFuZCBvcHRpb25hbCBNSU1FIHR5cGVcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gdGhlIHVybFxyXG4gICAgKiBAcmV0dXJucyB7c3RyaW5nfSBjb250ZW50XHJcbiAgICAqLy8qXHJcbiAgICBsb2FkRmlsZShmaWxlUGF0aClcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gbnVsbDtcclxuICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlYWR5U3RhdGUgPT09IHhoci5ET05FKSB7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IHRoaXMucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oXCJHRVRcIixmaWxlUGF0aCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgICAgIHhoci5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgIHJlamVjdCh7XHJcbiAgICAgICAgICAgICAgICBlcnJvcjogXCJTb21lIGVycm9yXCJcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgIH0qL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBsb2FkVGV4dCh1cmwpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgbGV0IG9SZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgb1JlcS5vcGVuKFwiR0VUXCIsIHVybCk7XHJcbiAgICAgICAgICAgIG9SZXEub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgb1JlcS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAob1JlcS5zdGF0dXMgPT09IDIwMClcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG9SZXEucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHVuZGVmaW5lZCk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgb1JlcS5zZW5kKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHJlbG9hZCB0aGUgcmVnaXN0cnlcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVsb2FkKCkge1xyXG4gICAgICAgIHRoaXMuanNvbmRhdGEgPSB7ICRDbGFzczoge30gfTtcclxuICAgICAgICB0aGlzLmpzb25kYXRhTWVtYmVycyA9IHt9O1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBtb2R1bHRleHQgPSBcIlwiO1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmICh3aW5kb3c/LmRvY3VtZW50ID09PSB1bmRlZmluZWQpIHsgLy9vbiBzZXJ2ZXJcclxuXHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgZnMgPSBhd2FpdCBpbXBvcnQoJ2ZzJyk7XHJcblxyXG4gICAgICAgICAgICBtb2R1bHRleHQgPSBmcy5yZWFkRmlsZVN5bmMoXCIuL2phc3NpanMuanNvblwiLCAndXRmLTgnKTtcclxuICAgICAgICAgICAgdmFyIG1vZHVsZXMgPSBKU09OLnBhcnNlKG1vZHVsdGV4dCkubW9kdWxlcztcclxuICAgICAgICAgICAgZm9yIChsZXQgbW9kdWwgaW4gbW9kdWxlcykge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXF1aXJlLmNhY2hlW3JlcXVpcmUucmVzb2x2ZShtb2R1bCArIFwiL3JlZ2lzdHJ5XCIpXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gKHJlcXVpcmUubWFpbltcInBhdGhcIl0gKyBcIi9cIiArIG1vZHVsICsgXCIvcmVnaXN0cnlcIikucmVwbGFjZUFsbChcIlxcXFxcIiwgXCIvXCIpICsgXCIuanNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXF1aXJlLmNhY2hlW3NdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlcXVpcmUuY2FjaGVbcy5yZXBsYWNlQWxsKFwiL1wiLCBcIlxcXFxcIildO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IChhd2FpdCByZXF1aXJlLm1haW4ucmVxdWlyZShtb2R1bCArIFwiL3JlZ2lzdHJ5XCIpKS5kZWZhdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdEpTT05EYXRhKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmYWlsZWQgbG9hZCByZWdpc3RyeSBcIiArIG1vZHVsICsgXCIvcmVnaXN0cnkuanNcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2UgeyAvL29uIGNsaWVudFxyXG4gICAgICAgICAgICB2YXIgYWxsID0ge307XHJcbiAgICAgICAgICAgIHZhciBtb2QgPSBKU09OLnBhcnNlKGF3YWl0ICh0aGlzLmxvYWRUZXh0KFwiamFzc2lqcy5qc29uXCIpKSk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG1vZHVsIGluIG1vZC5tb2R1bGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW1vZC5tb2R1bGVzW21vZHVsXS5lbmRzV2l0aChcIi5qc1wiKSAmJiBtb2QubW9kdWxlc1ttb2R1bF0uaW5kZXhPZihcIi5qcz9cIikgPT09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVqcy51bmRlZihtb2R1bCArIFwiL3JlZ2lzdHJ5XCIpO1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtID0gbW9kdWw7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxsW21vZHVsXSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmUoW20gKyBcIi9yZWdpc3RyeVwiXSwgZnVuY3Rpb24gKHJldCwgcjIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmV0LmRlZmF1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKGxldCBtb2R1bCBpbiBtb2QubW9kdWxlcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBhd2FpdCBhbGxbbW9kdWxdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuaW5pdEpTT05EYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBmb3IgKGxldCBtb2R1bCBpbiBtb2R1bGVzKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy9yZXF1aXJlanMudW5kZWYoXCJqcy9cIittb2R1bCtcIi9yZWdpc3RyeS5qc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICBhbGxbbW9kdWxdID0gZnMucmVhZEZpbGVTeW5jKFwiLi8uLi9jbGllbnQvXCIrbW9kdWwrXCIvcmVnaXN0cnkuanNcIiwgJ3V0Zi04Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtb2R1bCBpbiBtb2R1bGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBhd2FpdCBhbGxbbW9kdWxdLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW5pdEpTT05EYXRhKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICovXHJcbiAgICAgICAgLy92YXIgcmVnID0gYXdhaXQgdGhpcy5yZWxvYWRSZWdpc3RyeSgpO1xyXG4gICAgICAgIC8vX3RoaXMuaW5pdEpTT05EYXRhKHJlZyk7XHJcbiAgICAgICAgLyogICAgIHJlcXVpcmVqcy51bmRlZihcInRleHQhLi4vLi4vLi4vLi4vcmVnaXN0cnkuanNvbj9idXN0PVwiK3dpbmRvd1tcImphc3NpdmVyc2lvblwiXSk7XHJcbiAgICAgICAgIHJlcXVpcmUoW1widGV4dCEuLi8uLi8uLi8uLi9yZWdpc3RyeS5qc29uP2J1c3Q9XCIrd2luZG93W1wiamFzc2l2ZXJzaW9uXCJdXSwgZnVuY3Rpb24ocmVnaXN0cnkpe1xyXG4gICAgICAgICAgICAgX3RoaXMuaW5pdChyZWdpc3RyeSk7ICBcclxuICAgICAgICAgfSk7Ki9cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBsb2FkcyBlbnRyaWVzIGZyb20ganNvbiBzdHJpbmdcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IGpzb24gLSBqc29uZGF0YVxyXG4gICAgKi9cclxuICAgIGluaXRKU09ORGF0YShqc29uKSB7XHJcblxyXG4gICAgICAgIGlmIChqc29uID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgdmRhdGE6IHsgW2ZpbGU6IHN0cmluZ106IHsgW2NsYXNzbmFtZTogc3RyaW5nXTogeyBbc2VydmljZTogc3RyaW5nXTogYW55IH0gfSB9ID0ganNvbjtcclxuICAgICAgICBmb3IgKHZhciBmaWxlIGluIHZkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciB2ZmlsZXMgPSB2ZGF0YVtmaWxlXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgY2xhc3NuYW1lIGluIHZmaWxlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNsYXNzbmFtZSA9PT0gXCJkYXRlXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpzb25kYXRhLiRDbGFzc1tjbGFzc25hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzbmFtZTogY2xhc3NuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogW2NsYXNzbmFtZV0sXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB0aGVjbGFzcyA9IHZmaWxlc1tjbGFzc25hbWVdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgc2VydmljZSBpbiB0aGVjbGFzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXJ2aWNlID09PSBcIkBtZW1iZXJzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIC8vcHVibGljIGpzb25kYXRhTWVtYmVyczogeyBbc2VydmljZTogc3RyaW5nXTogeyBbY2xhc3NuYW1lOiBzdHJpbmddOiB7IFttZW1iZXJuYW1lOiBzdHJpbmddOiBhbnlbXSB9IH0gfSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVtcz10aGVjbGFzc1tzZXJ2aWNlXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBtZW0gaW4gbWVtcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2NzPW1lbXNbbWVtXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgc2MgaW4gc2NzKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5qc29uZGF0YU1lbWJlcnNbc2NdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpzb25kYXRhTWVtYmVyc1tzY109e307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuanNvbmRhdGFNZW1iZXJzW3NjXVtjbGFzc25hbWVdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpzb25kYXRhTWVtYmVyc1tzY11bY2xhc3NuYW1lXT17fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmpzb25kYXRhTWVtYmVyc1tzY11bY2xhc3NuYW1lXVttZW1dPT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuanNvbmRhdGFNZW1iZXJzW3NjXVtjbGFzc25hbWVdW21lbV09W107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5qc29uZGF0YU1lbWJlcnNbc2NdW2NsYXNzbmFtZV1bbWVtXS5wdXNoKHNjc1tzY10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuanNvbmRhdGFbc2VydmljZV0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuanNvbmRhdGFbc2VydmljZV0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVudHIgPSBuZXcgSlNPTkRhdGFFbnRyeSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRyLnBhcmFtcyA9IHRoZWNsYXNzW3NlcnZpY2VdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRyLmNsYXNzbmFtZSA9IGNsYXNzbmFtZTsvL3ZmaWxlcy4kQ2xhc3MgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHZmaWxlcy4kQ2xhc3NbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudHIuZmlsZW5hbWUgPSBmaWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpzb25kYXRhW3NlcnZpY2VdW2VudHIuY2xhc3NuYW1lXSA9IGVudHI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gc2VydmljZSAtIHRoZSBzZXJ2aWNlIGZvciB3aGljaCB3ZSB3YW50IGluZm9ybWF0aW9uc1xyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRKU09ORGF0YShzZXJ2aWNlOiBzdHJpbmcsIGNsYXNzbmFtZTogc3RyaW5nID0gdW5kZWZpbmVkKTogUHJvbWlzZTxKU09ORGF0YUVudHJ5W10+IHtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRpbmcpXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaXNMb2FkaW5nO1xyXG4gICAgICAgIGlmICh0aGlzLmpzb25kYXRhID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0aGlzLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmlzTG9hZGluZztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHJldCA9IFtdO1xyXG4gICAgICAgIHZhciBvZGF0YSA9IHRoaXMuanNvbmRhdGFbc2VydmljZV07XHJcbiAgICAgICAgaWYgKG9kYXRhID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgaWYgKGNsYXNzbmFtZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gb2RhdGFbY2xhc3NuYW1lXSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogW29kYXRhW2NsYXNzbmFtZV1dO1xyXG4gICAgICAgIGZvciAodmFyIGNsbmFtZSBpbiBvZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoY2xhc3NuYW1lID09PSB1bmRlZmluZWQgfHwgY2xhc3NuYW1lID09PSBjbG5hbWUpXHJcbiAgICAgICAgICAgICAgICByZXQucHVzaChvZGF0YVtjbG5hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0QWxsRmlsZXNGb3JTZXJ2aWNlKHNlcnZpY2U6IHN0cmluZywgY2xhc3NuYW1lOiBzdHJpbmcgPSB1bmRlZmluZWQpOiBzdHJpbmdbXSB7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5qc29uZGF0YVtzZXJ2aWNlXTtcclxuICAgICAgICB2YXIgcmV0OiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGNsbmFtZSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gZGF0YVtjbG5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoY2xhc3NuYW1lID09IHVuZGVmaW5lZCB8fCB0ZXN0LmNsYXNzbmFtZSA9PT0gY2xhc3NuYW1lKVxyXG4gICAgICAgICAgICAgICAgcmV0LnB1c2godGVzdC5maWxlbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBhc3luYyBsb2FkQWxsRmlsZXNGb3JFbnRyaWVzKGVudHJpZXM6IEpTT05EYXRhRW50cnlbXSkge1xyXG4gICAgICAgIHZhciBmaWxlcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgZW50cmllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAoZmlsZXMuaW5kZXhPZihlbnRyaWVzW3hdLmZpbGVuYW1lKSA9PT0gLTEpXHJcbiAgICAgICAgICAgICAgICBmaWxlcy5wdXNoKGVudHJpZXNbeF0uZmlsZW5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRBbGxGaWxlcyhmaWxlcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGxvYWQgYWxsIGZpbGVzIHRoYXQgcmVnaXN0ZXJlZCB0aGUgc2VydmljZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlcnZpY2UgLSBuYW1lIG9mIHRoZSBzZXJ2aWNlXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxlZCB3aGVuIGxvYWRpbmcgaXMgZmluaXNoZWRcclxuICAgICAqL1xyXG4gICAgYXN5bmMgbG9hZEFsbEZpbGVzRm9yU2VydmljZShzZXJ2aWNlOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgc2VydmljZXMgPSB0aGlzLmdldEFsbEZpbGVzRm9yU2VydmljZShzZXJ2aWNlKTtcclxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRBbGxGaWxlcyhzZXJ2aWNlcyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGxvYWQgYWxsIGZpbGVzIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVzIC0gdGhlIGZpbGVzIHRvIGxvYWRcclxuICAgICAqL1xyXG4gICAgYXN5bmMgbG9hZEFsbEZpbGVzKGZpbGVzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIC8vICAgdmFyIHNlcnZpY2VzID0gdGhpcy5nZXRBbGxGaWxlc0ZvclNlcnZpY2Uoc2VydmljZSk7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGVwZW5kZW5jeSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGZpbGVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IGZpbGVzW3hdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUuZW5kc1dpdGgoXCIudHNcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoIC0gMyk7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmN5LnB1c2gobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJlcTogYW55ID0gcmVxdWlyZTtcclxuICAgICAgICAgICAgcmVxKGRlcGVuZGVuY3ksIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnkoKTtcclxuZXhwb3J0IGRlZmF1bHQgcmVnaXN0cnk7XHJcbmV4cG9ydCBmdW5jdGlvbiBtaWdyYXRlTW9kdWwob2xkTW9kdWwsIG5ld01vZHVsKSB7XHJcbiAgICBuZXdNb2R1bC5yZWdpc3RyeS5fbmV4dElEID0gb2xkTW9kdWwucmVnaXN0cnkuX25leHRJRDtcclxuICAgIG5ld01vZHVsLnJlZ2lzdHJ5LmVudHJpZXMgPSBvbGRNb2R1bC5yZWdpc3RyeS5lbnRyaWVzO1xyXG59XHJcbi8vamFzc2lqcy5yZWdpc3RyeT1yZWdpc3RyeTtcclxuIl19