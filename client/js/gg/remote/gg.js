var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/remote/RemoteObject"], function (require, exports, Jassi_1, RemoteObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestServer = void 0;
    let TestServer = class TestServer extends RemoteObject_1.RemoteObject {
        async zip(hallo, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.zip, hallo, context);
            }
            else {
                return hallo + " Du";
            }
        }
    };
    TestServer = __decorate([
        Jassi_1.$Class("jassi.remote.Server")
    ], TestServer);
    exports.TestServer = TestServer;
    async function test() {
        console.log(await new TestServer().zip("Hallo"));
    }
    exports.test = test;
});
//# sourceMappingURL=gg.js.map