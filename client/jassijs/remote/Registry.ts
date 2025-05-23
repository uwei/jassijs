
import { config } from "jassijs/remote/Config";
import "reflect-metadata";


export function $Class(longclassname: string,target=undefined): Function {
    return function (pclass) {
        if(target){
            pclass.target=target;
            registry.register("$Class", target, longclassname);
        }else
            registry.register("$Class", pclass, longclassname);
    }
}
export function $register(servicename: string, ...params): Function {
    return function (pclass) {
        registry.register(servicename, pclass, params);
    }
}

if (Reflect["_metadataorg"] === undefined) {
    Reflect["_metadataorg"] = Reflect["metadata"];
    if (Reflect["_metadataorg"] === undefined)
        Reflect["_metadataorg"] = null;
}

//@ts-ignore
Reflect["metadata"] = function (o, property, ...args): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor, ...fargs) {
        //delegation to 

        if (Reflect["_metadataorg"] !== null) {
            var func = Reflect["_metadataorg"](o, property, ...args);
            func(target, propertyKey, descriptor, ...fargs);
        }
        if (o === "design:type") {
            registry.registerMember("design:type", target, propertyKey, property);
        }
    }
}

class DataEntry {
    oclass: new (...args: any[]) => any;
    params: any[];
}

class JSONDataEntry {
    classname: string;
    params: any[];
    filename: string;
}


/**                       
* Manage all known data registered by jassijs.register
* the data is downloaded by /registry.json
* registry.json is updated by the server on code upload 
* @class jassijs.base.Registry 
*/
export class Registry {
    

    public jsondata: { [service: string]: { [classname: string]: JSONDataEntry } } = undefined;
    public data: { [service: string]: { [classname: string]: DataEntry } } = {};
    public dataMembers: { [service: string]: { [classname: string]: { [membername: string]: any[] } } } = {};
    public jsondataMembers: { [service: string]: { [classname: string]: { [membername: string]: any[] } } } = {};
    private isLoading: any;
    _eventHandler: { [service: string]: any[] } = {};
    constructor() {
       //this._nextID = 10;
        this.isLoading = this.reload();
    }
    getData(service: string, classname: string = undefined): DataEntry[] {
        var olddata = this.data[service];
        if (olddata === undefined)
            return [];
        var ret = [];
        if (classname !== undefined) {
            if (olddata[classname] !== undefined) {
                ret.push(olddata[classname]);
            }
        } else {
            for (var key in olddata) {
                ret.push(olddata[key]);
            }
        }
        return ret;
    }
    onregister(service: string, callback: (oclass: new (...args: any[]) => any, ...params) => void) {
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
    offregister(service: string, callback: (oclass: new (...args: any[]) => any, ...params) => void) {
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
    register(service: string, aclass: new (...args: any[]) => any, ...params) {
        var oclass=aclass;
        if(oclass["target"]) {
            oclass=oclass["target"];
        }
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
                    this.dataMembers[sservice][sclass] = <any>pservice;
                }
                delete oclass.prototype.$$tempRegisterdMembers$$;
                //@ts-ignore
                delete oclass.$$tempRegisterdMembers$$;
            }
        }
    }
    getMemberData(service: string): {
        [classname: string]: {
            [membername: string]: any[]
        }
    } {

        return this.dataMembers[service];

    }
    getJSONMemberData(service: string): {
        [classname: string]: {
            [membername: string]: any[]
        }
    } {

        return this.jsondataMembers[service];

    }
    /** 
     * register an anotation
     * Important: this function should only used from an annotation
     **/
    registerMember(service: string, aclass: any/*new (...args: any[]) => any*/, membername: string, ...params) {
        var oclass=aclass;
        if(oclass["target"]) {
            oclass=oclass["target"];
        }
        if(oclass?.constructor?.target){
            oclass=oclass.constructor.target
        }
        var m = oclass;
        if (oclass.prototype !== undefined)
            m = oclass.prototype;
        var clname = oclass.prototype?.constructor?._classname;
        if (clname) {

            if (this.dataMembers[service] === undefined) {
                this.dataMembers[service] = {};
            }
            if (this.dataMembers[service][clname] === undefined) {
                this.dataMembers[service][clname] = {};
            }
            if (this.dataMembers[service][clname][membername] === undefined) {
                this.dataMembers[service][clname][membername] = [];
            }
            this.dataMembers[service][clname][membername].push(params);
        } else {
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
    }
    /**
    * with every call a new id is generated - used to create a free id for the dom
    * @returns {number} - the id
    */
    /*nextID() {
        this._nextID = this._nextID + 1;
        return this._nextID.toString();
    }*/
    /**
    * Load text with Ajax synchronously: takes path to file and optional MIME type
    * @param {string} filePath - the url
    * @returns {string} content
    *//*
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
    private async loadText(url): Promise<string> {
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
        if (window?.document === undefined) { //on server

            //@ts-ignore 
            var fs = await import('fs');
            var Filesystem = await import("jassijs/server/Filesystem");
            var modules = config.server.modules;
            for (let modul in modules) {
                try {

                    try {
                        //@ts-ignore
                        delete require.cache[require.resolve(modul + "/registry")];
                    } catch {
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

                } catch {
                    console.error("failed load registry " + modul + "/registry.js");
                }


            }

        } else { //on client
            // var config=(await import("./Config")).config;
            //   this.isServer=config.isServer;
            var all = {};
            var modules = config.modules;
            var myrequire;
            if (config.isServer) {
                //if(require.defined("jassijs/server/Installserver")){
                myrequire = <any>config.serverrequire;
                modules = config.server.modules;
            } else {
                myrequire = <any>config.clientrequire;
            }
            (<any>this).isServer = config.isServer;//is this needed?
            for (let modul in modules) {
                if (!modules[modul].endsWith(".js") && modules[modul].indexOf(".js?") === -1)
                    myrequire.undef(modul + "/registry");
                {
                    var m = modul;
                    all[modul] = new Promise((resolve, reject) => {
                        //@ts-ignore
                        myrequire([m + "/registry"], function (ret) {
                            resolve(ret.default);
                        });
                    });
                }
            }
            for (let modul in modules) {
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
        var vdata: { [file: string]: { [classname: string]: { [service: string]: any } } } = json;
        for (var file in vdata) {
            var vfiles = vdata[file];
            for (var classname in vfiles) {
                if (classname === "date")
                    continue;
                this.jsondata.$Class[classname] = {
                    classname: classname,
                    params: [classname],
                    filename: file
                }
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
                    } else {
                        if (this.jsondata[service] === undefined)
                            this.jsondata[service] = {};
                        var entr = new JSONDataEntry();
                        entr.params = theclass[service];

                        entr.classname = classname;//vfiles.$Class === undefined ? undefined : vfiles.$Class[0];
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
    async getJSONData(service: string, classname: string = undefined): Promise<JSONDataEntry[]> {
        // if (this.isLoading)
        await this.isLoading;
        /* if (this.jsondata === undefined) {
             this.isLoading = this.reload();
             await this.isLoading;
         }
         this.isLoading = undefined;*/
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


    getAllFilesForService(service: string, classname: string = undefined): string[] {

        var data = this.jsondata[service];
        var ret: string[] = [];
        for (var clname in data) {
            var test = data[clname];
            if (classname == undefined || test.classname === classname)
                ret.push(test.filename);
        }
        return ret;
    }
    async loadAllFilesForEntries(entries: JSONDataEntry[]) {
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
    async loadAllFilesForService(service: string) {
        var services = this.getAllFilesForService(service);
        await this.loadAllFiles(services);
    }
    /**
     * load all files 
     * @param {string} files - the files to load
     */
    async loadAllFiles(files: string[]) {
        //   var services = this.getAllFilesForService(service);

        return new Promise((resolve, reject) => {

            var dependency = [];
            for (var x = 0; x < files.length; x++) {
                var name = files[x];
                if (name.endsWith(".ts"))
                    name = name.substring(0, name.length - 3);
                else if (name.endsWith(".tsx"))
                    name = name.substring(0, name.length - 4);
                dependency.push(name);
            }
            var req: any = require;
            req(dependency, function () {
                resolve(undefined);
            });
        });
    }
};

var registry = new Registry();
export default registry;
export function migrateModul(oldModul, newModul) {
    if (newModul.registry) {
        //newModul.registry._nextID = oldModul.registry._nextID;
        newModul.registry.entries = oldModul.registry.entries;
    }
}
//jassijs.registry=registry;
