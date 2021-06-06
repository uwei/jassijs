var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/remote/RemoteObject"], function (require, exports, Jassi_1, RemoteObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MyRemoteObject = void 0;
    let MyRemoteObject = class MyRemoteObject extends RemoteObject_1.RemoteObject {
        //this is a sample remote function
        async sayHello(name, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.sayHello, name, context);
            }
            else {
                return "Heillo " + name; //this would be execute on server  
            }
        }
    };
    MyRemoteObject = __decorate([
        Jassi_1.$Class("tg/remote/MyRemoteObject")
    ], MyRemoteObject);
    exports.MyRemoteObject = MyRemoteObject;
    async function test() {
        console.log(await new MyRemoteObject().sayHello("Kurt"));
    }
    exports.test = test;
});
//# sourceMappingURL=MyRemoteObject.js.map