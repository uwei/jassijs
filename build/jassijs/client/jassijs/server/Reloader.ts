//copy from jassijs/util/Reloader
import { config } from "jassijs/remote/Config";
import { $Class } from "jassijs/remote/Registry";
import registry from "jassijs/remote/Registry";


@$Class("jassijs.server.Reloader")
export class Reloader {
    static cache = [];
    static reloadCodeFromServerIsRunning: boolean = false;
    static instance = new Reloader();
    listener = [];
    /**
     * reloads Code
     */
    private constructor() {

    }
    /**
     * check code changes out of the browser if localhost and load the changes in to the browser
     */
    public static startReloadCodeFromServer(): void {
        if (Reloader.reloadCodeFromServerIsRunning)
            return;
        if (window.location.hostname !== "localhost") {
            return;
        }
        var h = { date: 0, files: [] };
        var f = async function () {
            jassijs.server.call("checkDir", h.date).then(function (t) {
                h = JSON.parse(t);
                var len = h.files.length;
                if (len > 3)
                    len = 1;
                for (var x = 0; x < len; x++) {
                    var file = h.files[x];
                    new Reloader().reloadJS(file);
                   // notify(file + " reloaded", "info", { position: "bottom right" });
                }
                window.setTimeout(f, 100000);
            });
        };
        window.setTimeout(f, 100000);
    }
    /**
     * listener for code reloaded 
     * @param {function} func - callfunction for the event
     */
    addEventCodeReloaded(func) {
        this.listener.push(func);
    }
    removeEventCodeReloaded(func) {
        var pos = this.listener.indexOf(func);
        if (pos !== -1) {
            this.listener.splice(pos, 1);
        }
    }

    private _findScript(name: string) {
        var scripts = document.querySelectorAll('script');
        for (var x = 0; x < scripts.length; x++) {
            var attr = scripts[x].getAttributeNode("src");
            if (attr !== null && attr !== undefined && attr.value === (name + ".js")) {//?bust="+window.jassiversion
                return scripts[x];
            }
        }
        return undefined;
    }
    async reloadJS(fileName: string) {
        await this.reloadJSAll([fileName]);

    }
    async reloadJSAll(fileNames: string[],afterUnload: () => {}=undefined,useServerRequire=false) {
        //classname->file
        var files = {};
        let allModules = {};
        var allfiles: string[] = [];
        
        for (let ff = 0; ff < fileNames.length; ff++) {
            
            var fileName = fileNames[ff];
            fileName=fileName.replace("$serverside/","");
            var fileNameBlank = fileName;
            if(fileName.toLocaleLowerCase().endsWith("css")){
                /*var node=document.getElementById("-->"+fileName);
                if(node){
                    document.getElementById("-->"+fileName).remove();
                }*/
                jassijs.myRequire(fileName);
                continue;
            }
            if(fileName.toLocaleLowerCase().endsWith("json")||fileName.toLocaleLowerCase().endsWith("html")){
                continue;
            }
            if (fileNameBlank.endsWith(".js"))
                fileNameBlank = fileNameBlank.substring(0, fileNameBlank.length - 3);
            var test = this._findScript(fileNameBlank);
            //de.Kunde statt de/kunde
            if (test !== undefined) {
                var attr = test.getAttributeNode("data-requiremodule");
                if (attr !== null) {
                    fileNameBlank = attr.value;
                }
            }
            //load all classes which are in the same filename

            var allclasses = await registry.getJSONData("$Class");
            var classesInFile = [];
            for (var x = 0; x < allclasses.length; x++) {
                var pclass = allclasses[x];
                if (pclass.filename === fileName) {
                    classesInFile.push(pclass.filename);
                }
            }
            //collect all classes which depends on the class
            var family = {};
            for (var x = 0; x < classesInFile.length; x++) {
                var classname = classesInFile[x];
                var check = classes.getClass(classname);
                if (check === undefined)
                    continue;
                var classes = classes.getCache();
                family[classname] = {};
                for (var key in classes) {
                    if (key === classname)
                        files[key] = allclasses[key][0].file;
                    if (classes[key].prototype instanceof check) {
                        files[key] = allclasses[key][0].file;
                        var tree = [];
                        let test = classes[key].prototype;
                        while (test !== check.prototype) {
                            tree.push(classes.getClassName(test));
                            test = test["__proto__"];
                            //all.push(allclasses[key][0].file);
                        }
                        var cur = family[classname];
                        for (var c = tree.length - 1; c >= 0; c--) {
                            var cl = tree[c];
                            if (cur[cl] === undefined)
                                cur[cl] = {};
                            cur = cur[cl];
                        }
                        //delete class - its better to get an exception if sonething goes wrong
                        //  classes[key]=undefined;
                        //jassijs.classes.removeClass(key);
                    }
                }
            }

            for (var key in files) {
                if (files[key].endsWith(".js"))
                    files[key] = files[key].substring(0, files[key].length - 3);   //files._self_=fileName;
                allfiles.push(files[key]);
            }
            if (allfiles.indexOf(fileNameBlank) < 0) {
                allfiles.push(fileNameBlank);
            }

            //save all modules

        }
        var myrequire;
        //@ts-ignore
        if(require.defined("jassijs/server/Installserver")||useServerRequire){
            myrequire=<any>config.serverrequire;
        }else{
            myrequire=<any>config.clientrequire;
        }
        await new Promise((resolve, reject) => {
            //@ts-ignore
            myrequire(allfiles, function (...ret) {
                for (var rx = 0; rx < ret.length; rx++) {
                    allModules[allfiles[rx]] = ret[rx];
                } 
                resolve(undefined);
            },(err)=>{
                throw err;

            });
        });
        for (let x = 0; x < allfiles.length; x++) {
            myrequire.undef(allfiles[x]);
        }
         if(afterUnload!==undefined)
            await afterUnload();
    
        var _this = this;

        // console.log("reload " + JSON.stringify(fileNameBlank));
        await new Promise((resolve, reject) => {
            //@ts-ignore
            myrequire(allfiles, function (...ret) {
                async function run() {
                    for (let f = 0; f < allfiles.length; f++) {
                        if(ret&&!ret[x].doNotReloadModule)
                            _this.migrateModul(allModules, allfiles[f], ret[f]);
                    }
                    for (let i = 0; i < _this.listener.length; i++) {
                       
                        await _this.listener[i](allfiles);
                        
                    };
                }
                run().then(() => {
                    resolve(undefined);
                }).catch(err => {
                    reject(err);
                });

            });
        }).catch(err => {
            throw err
        });

    }
    migrateModul(allModules, file, modul) {

        if (modul === undefined)
            return;
        var old = allModules[file];
        if(old===modul){
            console.log("migrate Modul "+file+" not work");
            return;
        }
        this.migrateClasses(file, old, modul);
        //now migrate loaded modules

        modul.__oldModul = old;
        while (old !== undefined) {
            for (let key in old) {
                if (key !== "__oldModul") {
                    old[key] = modul[key];
                }
            }
            old = old.__oldModul;
        }
    }
    migrateClasses(file, oldmodul, modul) {
        if (oldmodul === undefined)
            return;
        for (let key in modul) {
            var newClass = modul[key];
            if (newClass.prototype !== undefined && key !== "__oldModul") {
                //migrate old Class
                var meths = Object.getOwnPropertyNames(newClass.prototype);
                if (Reloader.cache[file + "/" + key] === undefined) {
                    Reloader.cache[file + "/" + key] = [];
                    Reloader.cache[file + "/" + key].push(oldmodul[key]);
                }
                for (let c = 0; c < Reloader.cache[file + "/" + key].length; c++) {
                    var oldClass = Reloader.cache[file + "/" + key][c];
                    if (oldClass !== undefined) {
                        for (var x = 0; x < meths.length; x++) {
                            var m = meths[x];
                            if (m === "constructor" || m === "length" || m === "prototype") {
                                continue;
                            }
                            var desc = Object.getOwnPropertyDescriptor(newClass.prototype, m);
                            if (desc.value !== undefined) {//function
                                oldClass.prototype[m] = newClass.prototype[m];
                            }
                            if (desc.get !== undefined || desc.set !== undefined) {
                                Object.defineProperty(oldClass.prototype, m, desc);
                            }
                        }
                    }
                }
                Reloader.cache[file + "/" + key].push(newClass)
            }
        }
    }
}

