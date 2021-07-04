"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extensions = exports.Extensions = exports.$Extension = void 0;
const Registry_1 = require("jassijs/remote/Registry");
function $Extension(forclass) {
    return function (pclass) {
        Registry_1.default.register("$Extension", pclass, forclass);
    };
}
exports.$Extension = $Extension;
class Extensions {
    constructor() {
        this.funcRegister = Registry_1.default.onregister("$Extension", this.register.bind(this));
    }
    destroy() {
        Registry_1.default.offregister("$Extension", this.funcRegister);
    }
    annotate(oclass, ...annotations) {
    }
    register(extensionclass, forclass) {
        //TODO reloading???
        //we must wait with to extent because forclass ist not loaded
        var func = Registry_1.default.onregister("$Class", function (oclass, params) {
            if (oclass.prototype.constructor._classname === forclass) {
                Registry_1.default.offregister("$Class", func);
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
//# sourceMappingURL=Extensions.js.map