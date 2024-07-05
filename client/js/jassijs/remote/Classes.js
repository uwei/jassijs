var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.classes = exports.Classes = exports.JassiError = void 0;
    Registry_1 = __importDefault(Registry_1);
    let JassiError = class JassiError extends Error {
        constructor(msg) {
            super(msg);
        }
    };
    JassiError = __decorate([
        $Class("jassijs.remote.JassiError"),
        __metadata("design:paramtypes", [String])
    ], JassiError);
    exports.JassiError = JassiError;
    function $Class(longclassname) {
        return function (pclass) {
            Registry_1.default.register("$Class", pclass, longclassname);
        };
    }
    /**
    * manage all registered classes ->jassijs.register("classes")
    * @class jassijs.base.Classes
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
            var config = (await new Promise((resolve_1, reject_1) => { require(["./Config"], resolve_1, reject_1); }).then(__importStar)).config;
            var cl = await Registry_1.default.getJSONData("$Class", classname);
            if (cl === undefined) {
                try {
                    //@ts-ignore
                    if (require.main) { //nodes load project class from module
                        //@ts-ignore 
                        await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                    }
                    else {
                        await new Promise((resolve_2, reject_2) => { require([classname.replaceAll(".", "/")], resolve_2, reject_2); }).then(__importStar);
                    }
                }
                catch (err) {
                    err = err;
                }
            }
            else {
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
                }
                else {
                    var imp = await new Promise((resolve_3, reject_3) => { require([file.replace(".ts", "")], resolve_3, reject_3); }).then(__importStar);
                }
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
            var _a, _b, _c, _d, _e, _f;
            if (_class === undefined)
                return undefined;
            if ((_a = _class.constructor) === null || _a === void 0 ? void 0 : _a._classname)
                return (_b = _class.constructor) === null || _b === void 0 ? void 0 : _b._classname;
            if ((_d = (_c = _class.prototype) === null || _c === void 0 ? void 0 : _c.constructor) === null || _d === void 0 ? void 0 : _d._classname)
                return (_f = (_e = _class.prototype) === null || _e === void 0 ? void 0 : _e.constructor) === null || _f === void 0 ? void 0 : _f._classname;
            return undefined;
        }
        register(data, name) {
            //data.prototype._classname=name;
            this._cache[name] = data;
        }
    };
    Classes = __decorate([
        $Class("jassijs.remote.Classes"),
        __metadata("design:paramtypes", [])
    ], Classes);
    exports.Classes = Classes;
    ;
    let classes = new Classes();
    exports.classes = classes;
    async function test(t) {
        var cl = classes.getClass("jassijs.ui.Button");
        t.expectEqual(cl === await classes.loadClass("jassijs.ui.Button"));
        t.expectEqual(classes.getClassName(cl) === "jassijs.ui.Button");
    }
    exports.test = test;
});
//# sourceMappingURL=Classes.js.map