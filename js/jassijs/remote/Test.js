"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const Registry_1 = require("jassijs/remote/Registry");
let Test = class Test {
    /**
     * fails if the condition is false
     * @parameter condition
     **/
    expectEqual(condition) {
        if (!condition)
            throw new Error("Test fails");
    }
    /**
     * fails if the func does not throw an error
     * @parameter func - the function that should failed
     **/
    expectError(func) {
        try {
            if (func.toString().startsWith("async ")) {
                var errobj;
                try {
                    throw new Error("test fails");
                }
                catch (err) {
                    errobj = err;
                }
                func().then(() => {
                    throw errobj;
                }).catch((err) => {
                    if (err.message === "test fails")
                        throw errobj;
                    var k = 1; //io
                });
                return;
            }
            else {
                func();
            }
        }
        catch (_a) {
            return; //io
        }
        throw new Error("test fails");
    }
    /**
    * fails if the func does not throw an error
    * @parameter func - the function that should failed
    **/
    async expectErrorAsync(func) {
        var errors = false;
        try {
            var errobj;
            await func().then((e) => {
            }).catch((e) => {
                errors = true;
            });
        }
        catch (_a) {
            errors = true;
        }
        if (!errors)
            throw new Error("test fails");
    }
};
Test = __decorate([
    Registry_1.$Class("jassijs.remote.Test")
], Test);
exports.Test = Test;
//# sourceMappingURL=Test.js.map