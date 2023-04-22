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
var ServerReport_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.ServerReport = void 0;
const Registry_1 = require("jassijs/remote/Registry");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
const Validator_1 = require("jassijs/remote/Validator");
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
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], ServerReport, "getDesign", null);
__decorate([
    Validator_1.ValidateFunctionParameter(),
    __param(0, Validator_1.ValidateIsString()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], ServerReport, "getBase64", null);
ServerReport = ServerReport_1 = __decorate([
    Registry_1.$Class("jassijs_report.remote.ServerReport")
], ServerReport);
exports.ServerReport = ServerReport;
async function test() {
    var ret = await ServerReport.getBase64("jassijs_report/TestServerreport", { sort: "name" });
    return ret;
    //    console.log(await new ServerReport().sayHello("Kurt"));
}
exports.test = test;
//# sourceMappingURL=ServerReport.js.map