var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extensions = exports.Extensions = exports.$Extension = void 0;
    Registry_1 = __importDefault(Registry_1);
    function $Extension(forclass) {
        return function (pclass) {
            Registry_1.default.register("$Extension", pclass, forclass);
        };
    }
    exports.$Extension = $Extension;
    class ExtensionTarget {
        addFunction(name, func, ifExists) {
        }
        addMember(name) {
        }
        annotateMember(member, type, ...annotations) {
        }
    }
    class Extensions {
        constructor() {
            this.funcRegister = Registry_1.default.onregister("$Extension", this.register.bind(this));
        }
        destroy() {
            Registry_1.default.offregister("$Extension", this.funcRegister);
        }
        annotate(oclass, ...annotations) {
            throw new Error("not implemented yet");
        }
        register(extensionclass, forclass) {
            //TODO reloading???
            //we must wait with to extent because forclass ist not loaded
            var func = Registry_1.default.onregister("$Class", function (oclass, params) {
                if (oclass.prototype.constructor._classname === forclass) {
                    // reloading code-> registry.offregister("$Class", func);
                    let props = Object.getOwnPropertyNames(extensionclass.prototype);
                    for (var m = 0; m < props.length; m++) {
                        var member = props[m];
                        if (member !== "_classname" && member !== "constructor") {
                            if (typeof extensionclass.prototype[member] === "function") {
                                if (oclass.prototype[member] !== undefined) {
                                    var sic = oclass.prototype[member];
                                    var ext = extensionclass.prototype[member];
                                    oclass.prototype[member] = function (...p) {
                                        sic.bind(this)(...p);
                                        ext.bind(this)(...p);
                                    };
                                }
                                else
                                    oclass.prototype[member] = extensionclass.prototype[member];
                            }
                        }
                    }
                }
            });
            //  alert(forclass);
        }
        annotateMember(classname, member, type, ...annotations) {
            var func = Registry_1.default.onregister("$Class", function (oclass, params) {
                if (oclass.prototype.constructor._classname === classname) {
                    Registry_1.default.offregister("$Class", func);
                    //designtype
                    Reflect["metadata"]("design:type", type)(oclass.prototype, member);
                    for (var x = 0; x < annotations.length; x++) {
                        let ann = annotations[x];
                        ann(oclass.prototype, member);
                    }
                }
            });
        }
    }
    exports.Extensions = Extensions;
    var extensions = new Extensions();
    exports.extensions = extensions;
});
//# sourceMappingURL=Extensions.js.map