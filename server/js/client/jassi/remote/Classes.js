"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classes = exports.Classes = void 0;
const Registry_1 = require("jassi/remote/Registry");
function $Class(longclassname) {
    return function (pclass) {
        Registry_1.default.register("$Class", pclass, longclassname);
    };
}
/**
* manage all registered classes ->jassi.register("classes")
* @class jassi.base.Classes
*/
let Classes = class Classes {
    constructor() {
        this._cache = {};
        this.funcRegister = Registry_1.default.onregister("$Class", this.register.bind(this));
    }
    destroy() {
        Registry_1.default.offregister("$Class", this.funcRegister);
    }
    /**
     * load the a class
     * @param classname - the class to load
     */
    async loadClass(classname) {
        var cl = await Registry_1.default.getJSONData("$Class", classname);
        if (cl === undefined) {
            try {
                await Promise.resolve().then(() => require(classname.replaceAll(".", "/")));
            }
            catch (err) {
                err = err;
            }
        }
        else {
            if (cl === undefined || cl.length === 0) {
                throw "Class not found:" + classname;
            }
            var file = cl[0].filename;
            //@ts-ignore
            if (window.document === undefined) {
                var pack = file.split("/");
                if (pack.length < 2 || pack[1] !== "remote") {
                    throw "failed loadClass " + classname + " on server only remote classes coud be loaded";
                }
            }
            var imp = await Promise.resolve().then(() => require(file.replace(".ts", "")));
        }
        return this.getClass(classname);
    }
    /**
    * get the class of the given classname
    * @param {string} - the classname
    * @returns {class} - the class
    */
    getClass(classname) {
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
    getClassName(_class) {
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
    register(data, name) {
        //data.prototype._classname=name;
        this._cache[name] = data;
    }
};
Classes = __decorate([
    $Class("jassi.remote.Classes"),
    __metadata("design:paramtypes", [])
], Classes);
exports.Classes = Classes;
;
let classes = new Classes();
exports.classes = classes;
//# sourceMappingURL=Classes.js.map