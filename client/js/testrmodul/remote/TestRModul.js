var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject"], function (require, exports, Registry_1, RemoteObject_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestRModul = void 0;
    let TestRModul = class TestRModul {
        //this is a sample remote function
        async sayHello(name, context = undefined) {
            return "Hello " + name; //this would be execute on server  
        }
    };
    __decorate([
        (0, RemoteObject_1.UseServer)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_a = typeof Context !== "undefined" && Context) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], TestRModul.prototype, "sayHello", null);
    TestRModul = __decorate([
        (0, Registry_1.$Class)("testrmodul.remote.TestRModul")
    ], TestRModul);
    exports.TestRModul = TestRModul;
});
//# sourceMappingURL=TestRModul.js.map