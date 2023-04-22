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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.MyRemoteObject = void 0;
const Registry_1 = require("jassijs/remote/Registry");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
const Validator_1 = require("jassijs/remote/Validator");
let MyRemoteObject = class MyRemoteObject extends RemoteObject_1.RemoteObject {
    //this is a sample remote function
    async tt(name) {
        return "oo";
    }
    async sayHello(name, context = undefined) {
        console.log(this.sayHello.name);
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await this.call(this, this.sayHello, name, context);
        }
        else {
            console.log(await this.tt("hallo"));
            return "Hello " + name; //this would be execute on server  
        }
    }
    static async sayHello2(name, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await this.call(this.sayHello2, name, context);
        }
        else {
            return "Hello static " + name; //this would be execute on server  
        }
    }
};
__decorate([
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MyRemoteObject.prototype, "tt", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], MyRemoteObject.prototype, "sayHello", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], MyRemoteObject, "sayHello2", null);
MyRemoteObject = __decorate([
    Registry_1.$Class("de.remote.MyRemoteObject")
], MyRemoteObject);
exports.MyRemoteObject = MyRemoteObject;
async function test() {
    console.log(await new MyRemoteObject().sayHello("Kurt"));
    // console.log(await MyRemoteObject.sayHello2("5"));
}
exports.test = test;
//# sourceMappingURL=MyRemoteObject.js.map