
import registry from "remote/jassi/base/Registry";

//import Service from "remote/jassi/base/Service";

function $Class(longclassname: string): Function {
    return function (pclass) {
        registry.register("$Class", pclass, longclassname);
    }
}
/**
* manage all registered classes ->jassi.register("classes")
* @class jassi.base.Classes
*/
@$Class("remote.jassi.base.Classes")
export class Classes {
    private _cache: { [service: string]: new (...args: any[]) => any };
    private funcRegister;
    constructor() {
        this._cache = {};

        this.funcRegister = registry.onregister("$Class", this.register.bind(this));
    }

    destroy() {
        registry.offregister("$Class", this.funcRegister);
    }
    /**
     * load the a class
     * @param classname - the class to load
     */

    async loadClass(classname: string) {
        var cl = await registry.getJSONData("$Class", classname);
        if (cl === undefined) {
            try {
                await import(classname.replaceAll(".", "/"));
            } catch(err) {
                err=err;
            }
        } else {
            if (cl === undefined || cl.length === 0) {
                throw "Class not found:" + classname;
            }

            var file = cl[0].filename;
            //@ts-ignore
            if (window.document === undefined) {
                if (!file.startsWith("remote/")) {
                    throw "failed loadClass " + classname + " on server only remote classes coud be loaded";
                }
            }
            var imp = await import(file.replace(".ts", ""));
        }
        return this.getClass(classname);
    }
    /**
    * get the class of the given classname
    * @param {string} - the classname
    * @returns {class} - the class
    */
    getClass(classname: string) {
        return this._cache[classname];
        /* var ret=this.getPackage(classname);
         
         if(ret!==undefined&&ret.prototype!==undefined && ret.prototype.constructor === ret)
             return ret;
         else
             return undefined; */
    }
    /**
    * get the name of the given class
    * @param {class} _class - the class (prototype)
    * @returns {string} name of the class
    */
    getClassName(_class): string {
        if (_class === undefined)
            return undefined;
        if (_class._classname === undefined) {
            if (_class.prototype !== undefined && _class.prototype._classname !== undefined) {
                return _class.prototype._classname;
            }
            if (_class.__proto__ === null)
                return undefined;
            return _class.__proto__._classname;
        }
        return _class._classname;
    }

    register(data: new (...args: any[]) => any, name: string) {
        //data.prototype._classname=name;
        this._cache[name] = data;
    }
    /*
     register(name:string,data:new(...args: any[])=>any){
 
         data.prototype._classname=name;
         this._cache[name]=data;
 
 
     }*/
};

let classes = new Classes();
export { classes };