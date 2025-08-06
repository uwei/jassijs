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
exports.MyRemoteObject = exports.test = exports.MyRemoteObject2 = void 0;
const Registry_1 = require("jassijs/remote/Registry");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
let MyRemoteObject2 = class MyRemoteObject2 {
    //this is a sample remote function
    async sayHello(name) {
        return "Hello " + name; //this would be execute on server  
    }
};
MyRemoteObject2 = __decorate([
    (0, Registry_1.$Class)("de.remote.MyRemoteObject2")
], MyRemoteObject2);
exports.MyRemoteObject2 = MyRemoteObject2;
async function test() {
    console.log(await new MyRemoteObject2().sayHello("Kurt"));
}
exports.test = test;
const RemoteObject_2 = require("jassijs/remote/RemoteObject");
const Validator_1 = require("jassijs/remote/Validator");
let MyRemoteObject = class MyRemoteObject {
    //this is a sample remote function
    async tt(name) {
        return "oo";
    }
    async sayHello(name, age = 9, context) {
        console.log(await this.tt("hallo"));
        console.log(context.isServer);
        return "Hello3 " + name + "(" + age + ")"; //this would be execute on server  
    }
    static async sayHello2(name) {
        try {
            return "Hello static " + name + " from " + (`Node.js version: ${process.version}`); //this would be execute on server  
        }
        catch (_a) {
            return "Hello static " + name + " from Browser";
        }
    }
};
__decorate([
    __param(0, (0, Validator_1.ValidateIsString)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MyRemoteObject.prototype, "tt", null);
__decorate([
    (0, RemoteObject_1.UseServer)(),
    (0, Validator_1.ValidateFunctionParameter)(),
    __param(0, (0, Validator_1.ValidateIsString)()),
    __param(1, (0, RemoteObject_2.DefaultParameterValue)(9)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, RemoteObject_2.Context]),
    __metadata("design:returntype", Promise)
], MyRemoteObject.prototype, "sayHello", null);
__decorate([
    (0, RemoteObject_1.UseServer)(),
    (0, Validator_1.ValidateFunctionParameter)(),
    __param(0, (0, Validator_1.ValidateIsString)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MyRemoteObject, "sayHello2", null);
MyRemoteObject = __decorate([
    (0, Registry_1.$Class)("de.remote.MyRemoteObject")
], MyRemoteObject);
exports.MyRemoteObject = MyRemoteObject;
async function test() {
    console.log(await new MyRemoteObject().sayHello("Kurtt"));
    console.log(await new MyRemoteObject().sayHello("Kurtt", 10));
    console.log(await MyRemoteObject.sayHello2("5"));
}
exports.test = test;
//# sourceMappingURL=MyRemoteObject2.js.map