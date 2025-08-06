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
exports.test = exports.ll = void 0;
const Registry_1 = require("jassijs/remote/Registry");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
const Validator_1 = require("jassijs/remote/Validator");
let ll = class ll {
    async sayHello(name, age = 9, context) {
        //this runs serverside
        return "Hello3 " + name + "(" + age + ")"; //this would be execute on server  
    }
    static async info() {
        //this runs serverside
        try {
            return "static  from " + (`Node.js version: ${process.version}`); //this would be execute on server  
        }
        catch (_a) {
            return "static server runs on browser";
        }
    }
};
__decorate([
    (0, RemoteObject_1.UseServer)(),
    (0, Validator_1.ValidateFunctionParameter)()
    // name must be a string - validated on client and server
    // if age is missing set 9 as default value
    ,
    __param(0, (0, Validator_1.ValidateIsString)()),
    __param(1, (0, RemoteObject_1.DefaultParameterValue)(9)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], ll.prototype, "sayHello", null);
__decorate([
    (0, RemoteObject_1.UseServer)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ll, "info", null);
ll = __decorate([
    (0, Registry_1.$Class)("de.remote.ll")
], ll);
exports.ll = ll;
async function test() {
    console.log(await new ll().sayHello("Kurtt"));
    console.log(await new ll().sayHello("Kurtt", 10));
    console.log(await ll.info());
}
exports.test = test;
//# sourceMappingURL=ll.js.map