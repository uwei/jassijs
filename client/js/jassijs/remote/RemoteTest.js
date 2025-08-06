var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/RemoteObject", "jassijs/remote/Registry"], function (require, exports, RemoteObject_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RemoteTest = void 0;
    let RemoteTest = class RemoteTest {
        async createFolder(foldername, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                //var ret = await this.call(this, this.createFolder, foldername, context);
                var ret = await RemoteObject_1.RemoteObject.docall(this, this.createFolder, ...arguments);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                console.log("Hallo");
                return "created " + foldername;
            }
        }
        async createFolder2(foldername) {
            console.log("Hallo2");
            return "created2 " + foldername;
        }
        static async mytest(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await RemoteObject_1.RemoteObject.docall(this, this.mytest, ...arguments);
                // return await this.call(this.mytest, context);
            }
            else {
                console.log(14);
                return 14 + 1; //this is called on server
            }
        }
        static async mytest2() {
            console.log(14);
            return 14 + 1; //this is called on server
        }
    };
    __decorate([
        (0, RemoteObject_1.UseServer)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], RemoteTest.prototype, "createFolder2", null);
    __decorate([
        (0, RemoteObject_1.UseServer)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], RemoteTest, "mytest2", null);
    RemoteTest = __decorate([
        (0, Registry_1.$Class)("jassijs.remote.RemoteTest")
    ], RemoteTest);
    exports.RemoteTest = RemoteTest;
    async function test() {
        console.log(await new RemoteTest().createFolder2("Hi"));
        console.log(await RemoteTest.mytest2());
    }
    exports.test = test;
});
//# sourceMappingURL=RemoteTest.js.map