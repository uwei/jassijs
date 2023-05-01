
import registry from "jassijs/remote/Registry";


@$Class("jassijs.remote.JassiError")
export class JassiError extends Error{
    constructor(msg:string){
        super(msg);
    }
} 

function $Class(longclassname: string): Function {
    return function (pclass) {
        registry.register("$Class", pclass, longclassname);
    }
}
/**
* manage all registered classes ->jassijs.register("classes")
* @class jassijs.base.Classes
*/
@$Class("jassijs.remote.Classes")
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
                //@ts-ignore
                if (require.main) {//nodes load project class from module
                    //@ts-ignore 
                    await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                } else {
                    await import(classname.replaceAll(".", "/"));
                }
            } catch (err) {
                err = err;
            }
        } else {
            if (cl === undefined || cl.length === 0) {
                throw new JassiError("Class not found:" + classname);
            }
 
            var file = cl[0].filename;
            //@ts-ignore
            if (window.document === undefined) {
                var pack = file.split("/"); 
                if (pack.length < 2 || pack[1] === "server") {
                   // throw new JassiError("Server classes could not be loaded: " + classname );
                }
            }
            //@ts-ignore
            if (require.main) { //nodes load project class from module
                //@ts-ignore
                var imp = await Promise.resolve().then(() => require.main.require(file.replace(".ts", "")));
            } else {
                var imp = await import(file.replace(".ts", ""));
            }
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
        if (_class.constructor?._classname)
            return _class.constructor?._classname;
        if (_class.prototype?.constructor?._classname)
            return _class.prototype?.constructor?._classname;
        return undefined;
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

export async function test(t){
    var cl=classes.getClass("jassijs.ui.Button");
    t.expectEqual(cl===await classes.loadClass("jassijs.ui.Button"));
    t.expectEqual(classes.getClassName(cl)==="jassijs.ui.Button");
}