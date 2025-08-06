"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.DelRemoteObject = void 0;
const Registry_1 = require("jassijs/remote/Registry");
let DelRemoteObject = class DelRemoteObject {
    //this is a sample remote function
    async sayHello(name) {
        return "Hello " + name; //this would be execute on server  
    }
};
DelRemoteObject = __decorate([
    (0, Registry_1.$Class)("de.remote.DelRemoteObject")
], DelRemoteObject);
exports.DelRemoteObject = DelRemoteObject;
async function test() {
    console.log(await new DelRemoteObject().sayHello("Kurt"));
}
exports.test = test;
//# sourceMappingURL=DelRemoteObject.js.map