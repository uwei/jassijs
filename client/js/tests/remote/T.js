var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/RemoteObject", "jassijs/remote/Server"], function (require, exports, Jassi_1, RemoteObject_1, Server_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.T = void 0;
    let T = class T extends RemoteObject_1.RemoteObject {
        //this is a sample remote function
        async sayHello(name, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.sayHello, name, context);
            }
            else {
                var H = await new Promise((resolve_1, reject_1) => { require(["Hallo"], resolve_1, reject_1); });
                return "Hello " + name + H.test(); //this would be execute on server  
            }
        }
    };
    T = __decorate([
        (0, Jassi_1.$Class)("tests.remote.T")
    ], T);
    exports.T = T;
    async function test() {
        await new Server_1.Server().saveFile("Hallo.ts", "export class Hallo{};export function test(){return 2 };", true);
        console.log(await new T().sayHello("Kurt"));
    }
    exports.test = test;
    async function test2() {
    }
    exports.test2 = test2;
});
//# sourceMappingURL=T.js.map