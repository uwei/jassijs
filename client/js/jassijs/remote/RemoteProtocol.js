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
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Registry_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoteProtocol = void 0;
    let RemoteProtocol = class RemoteProtocol {
        /**
         * converts object to jsonstring
         * if class is registerd in classes then the class is used
         * if id is used then recursive childs are possible
         * @param obj
         */
        stringify(obj) {
            var ref = [];
            return JSON.stringify(obj, function (key, value) {
                var val = {};
                var clname = value === null ? undefined : Classes_1.classes.getClassName(value);
                var k = clname;
                if (k !== undefined) {
                    val.__clname__ = clname;
                    //if (value.id !== undefined)
                    //	k = k + ":" + (value.id === undefined ? RemoteProtocol.counter++ : value.id);
                    //the object was seen the we save a ref
                    if (ref.indexOf(value) >= 0) {
                        val.__ref__ = ref.indexOf(value);
                    }
                    else {
                        Object.assign(val, value);
                        ref.push(value);
                        val.__refid__ = ref.length - 1;
                    }
                }
                else {
                    val = value;
                }
                return val;
            });
        }
        static async simulateUser(user = undefined, password = undefined) {
            var rights = (await new Promise((resolve_1, reject_1) => { require(["jassijs/remote/security/Rights"], resolve_1, reject_1); }).then(__importStar)).default;
            //	if(await rights.isAdmin()){
            //		throw new Error("not an admin")
            //	}
            //@ts-ignore
            var Cookies = (await new Promise((resolve_2, reject_2) => { require(["jassijs/util/Cookies"], resolve_2, reject_2); }).then(__importStar)).Cookies;
            if (user === undefined) {
                Cookies.remove("simulateUser", {});
                Cookies.remove("simulateUserPassword", {});
            }
            else {
                Cookies.set("simulateUser", user, {});
                Cookies.set("simulateUserPassword", password, {});
            }
        }
        async exec(config, object) {
            return await new Promise((resolve, reject) => {
                //@ts-ignore
                var xhr = new XMLHttpRequest();
                xhr.open('POST', config.url, true);
                xhr.setRequestHeader("Content-Type", "text");
                xhr.onload = function (data) {
                    if (this.status === 200)
                        resolve(this.responseText);
                    else
                        reject(this);
                };
                xhr.send(config.data);
                xhr.onerror = function (data) {
                    reject(data);
                };
            });
            //return await $.ajax(config, object);
        }
        /**
       * call the server
       */
        async call() {
            if (jassijs.isServer)
                throw new Classes_1.JassiError("should be called on client");
            var sdataObject = undefined;
            var url = "remoteprotocol?" + Date.now();
            var _this = this;
            var redirect = undefined;
            var config = {
                url: url,
                type: 'post',
                dataType: "text",
                data: this.stringify(this),
            };
            var ret;
            try {
                ret = await this.exec(config, this._this);
            }
            catch (ex) {
                if (ex.status === 401 || (ex.responseText && ex.responseText.indexOf("jwt expired") !== -1)) {
                    redirect = new Promise((resolve) => {
                        //@ts-ignore
                        new Promise((resolve_3, reject_3) => { require(["jassijs/base/LoginDialog"], resolve_3, reject_3); }).then(__importStar).then((lib) => {
                            lib.doAfterLogin(resolve, _this);
                        });
                    });
                }
                else {
                    throw ex;
                }
            }
            if (redirect !== undefined)
                return await redirect;
            if (ret === "$$undefined$$")
                return undefined;
            var retval = await this.parse(ret);
            if (retval["**throw error**"] !== undefined) {
                throw new Classes_1.JassiError(retval["**throw error**"]);
            }
            return retval;
        }
        /**
         * converts jsonstring to an object
         */
        async parse(text) {
            var ref = {};
            if (text === undefined)
                return undefined;
            if (text === "")
                return "";
            //first get all classnames	
            var allclassnames = [];
            JSON.parse(text, function (key, value) {
                if (value === null || value === undefined)
                    return value;
                if (value.__clname__ !== null && value.__clname__ !== undefined && allclassnames.indexOf(value.__clname__) === -1) {
                    allclassnames.push(value.__clname__);
                }
                return value;
            });
            //all classes must be loaded
            for (var x = 0; x < allclassnames.length; x++) {
                await Classes_1.classes.loadClass(allclassnames[x]);
            }
            return JSON.parse(text, function (key, value) {
                var val = value;
                if (value === null || value === undefined)
                    return value;
                if (value.__ref__ !== undefined) {
                    val = ref[value.__ref__];
                    if (val === undefined) {
                        //TODO import types from js
                        //create dummy
                        var type = Classes_1.classes.getClass(value.__clname__);
                        //@ts-ignore
                        var test = type._createObject === undefined ? undefined : type._createObject(val);
                        if (test !== undefined)
                            val = test;
                        else
                            val = new type();
                        ref[value.__ref__] = val;
                    }
                }
                else {
                    if (value.__clname__ !== undefined) {
                        if (value.__refid__ !== undefined && ref[value.__refid__] !== undefined) { //there is a dummy
                            val = ref[value.__refid__];
                        }
                        else {
                            //TODO import types from js
                            var type = Classes_1.classes.getClass(value.__clname__);
                            //@ts-ignore
                            var test = type._createObject === undefined ? undefined : type._createObject(value);
                            if (test !== undefined)
                                val = test;
                            else
                                val = new type();
                            if (value.__refid__ !== undefined) {
                                ref[value.__refid__] = val;
                            }
                        }
                        Object.assign(val, value);
                        delete val.__refid__;
                        delete val.__clname__;
                    }
                }
                //Date conversation
                var datepattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
                if (typeof value === 'string') {
                    var a = datepattern.exec(value);
                    if (a)
                        return new Date(value);
                }
                return val;
            });
        }
        async test() {
            var a = new A();
            var b = new B();
            a.b = b;
            a.name = "max";
            a.id = 9;
            b.a = a;
            b.id = 7;
            var s = this.stringify(a);
            var test = await this.parse(s);
        }
    };
    RemoteProtocol.counter = 0;
    RemoteProtocol = __decorate([
        (0, Registry_1.$Class)("jassijs.remote.RemoteProtocol")
    ], RemoteProtocol);
    exports.RemoteProtocol = RemoteProtocol;
    class A {
    }
    //jassijs.register("classes", "de.A", A);
    class B {
    }
});
//jassijs.register("classes", "de.B", B);
//# sourceMappingURL=RemoteProtocol.js.map