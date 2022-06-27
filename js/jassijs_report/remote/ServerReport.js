"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ServerReport_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.ServerReport = void 0;
const Registry_1 = require("jassijs/remote/Registry");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
let ServerReport = ServerReport_1 = class ServerReport extends RemoteObject_1.RemoteObject {
    static async getDesign(path, parameter, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await ServerReport_1.call(this.getDesign, path, parameter, context);
        }
        else {
            //@ts-ignore
            var DoServerreport = (await Promise.resolve().then(() => require("jassijs_report/DoServerreport"))).DoServerreport;
            ServerReport_1.cacheLastParameter[path] = parameter;
            return await new DoServerreport().getDesign(path, parameter);
        }
    }
    static async getBase64(path, parameter, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await ServerReport_1.call(this.getBase64, path, parameter, context);
        }
        else {
            //@ts-ignore
            var DoServerreport = (await Promise.resolve().then(() => require("jassijs_report/DoServerreport"))).DoServerreport;
            if (parameter == "useLastCachedParameter")
                parameter = ServerReport_1.cacheLastParameter[path];
            return await new DoServerreport().getBase64(path, parameter);
        }
    }
    static async getBase64LastTestResult(context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await ServerReport_1.call(this.getBase64LastTestResult, context);
        }
        else {
            //@ts-ignore
            var DoServerreport = (await Promise.resolve().then(() => require("jassijs_report/DoServerreport"))).DoServerreport;
            return await new DoServerreport().getBase64LastTestResult();
        }
    }
};
ServerReport.cacheLastParameter = {};
ServerReport = ServerReport_1 = __decorate([
    (0, Registry_1.$Class)("jassijs_report.remote.ServerReport")
], ServerReport);
exports.ServerReport = ServerReport;
async function test() {
    var ret = await ServerReport.getBase64("jassijs_report/TestServerreport", { sort: "name" });
    return ret;
    //    console.log(await new ServerReport().sayHello("Kurt"));
}
exports.test = test;
//# sourceMappingURL=ServerReport.js.map