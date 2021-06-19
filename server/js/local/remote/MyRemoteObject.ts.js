"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.MyRemoteObject = void 0;
const Jassi_1 = require("jassijs/remote/Jassi");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
let MyRemoteObject = class MyRemoteObject {
};
MyRemoteObject = __decorate([
    Jassi_1.$Class("local/remote/MyRemoteObject.ts")
], MyRemoteObject);
exports.MyRemoteObject = MyRemoteObject;
ts;
RemoteObject_1.RemoteObject;
{
    async;
    sayHello(name, string, context, RemoteObject_1.Context = undefined);
    {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await this.call(this, this.sayHello, name, context);
        }
        else {
            return "Hello " + name; //this would be execute on server  
        }
    }
}
async function test() {
    console.log(await new MyRemoteObject.ts().sayHello("Kurt"));
}
exports.test = test;
//# sourceMappingURL=MyRemoteObject.ts.js.map