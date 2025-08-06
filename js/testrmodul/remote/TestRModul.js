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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRModul = void 0;
const Registry_1 = require("jassijs/remote/Registry");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
let TestRModul = class TestRModul {
    //this is a sample remote function
    async sayHello(name, context = undefined) {
        return "Hello " + name; //this would be execute on server  
    }
};
exports.TestRModul = TestRModul;
__decorate([
    (0, RemoteObject_1.UseServer)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof Context !== "undefined" && Context) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], TestRModul.prototype, "sayHello", null);
exports.TestRModul = TestRModul = __decorate([
    (0, Registry_1.$Class)("testrmodul.remote.TestRModul")
], TestRModul);
//# sourceMappingURL=TestRModul.js.map