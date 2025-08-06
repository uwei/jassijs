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
const Server_1 = require("jassijs/remote/Server");
const Validator_1 = require("jassijs/remote/Validator");
let ServerReport = ServerReport_1 = class ServerReport {
    static async getDesign(path, parameter) {
        //@ts-ignore
        var DoServerreport = (await Promise.resolve().then(() => require("jassijs_report/server/DoServerreport"))).DoServerreport;
        ServerReport_1.cacheLastParameter[path] = parameter;
        return await new DoServerreport().getDesign(path, parameter);
    }
    static async getBase64(path, parameter) {
        //@ts-ignore
        var DoServerreport = (await Promise.resolve().then(() => require("jassijs_report/server/DoServerreport"))).DoServerreport;
        if (parameter == "useLastCachedParameter")
            parameter = ServerReport_1.cacheLastParameter[path];
        return await new DoServerreport().getBase64(path, parameter);
    }
    static async getBase64FromFile(file, context = undefined) {
        var res = await new Server_1.Server().testServersideFile(file.substring(0, file.length - 3), context);
        //@ts-ignore 
        var DoServerreport = (await Promise.resolve().then(() => require("jassijs_report/server/DoServerreport"))).DoServerreport;
        return await new DoServerreport().getBase64FromData(res);
    }
};
ServerReport.cacheLastParameter = {};
__decorate([
    (0, RemoteObject_1.UseServer)(),
    (0, Validator_1.ValidateFunctionParameter)(),
    __param(0, (0, Validator_1.ValidateIsString)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServerReport, "getDesign", null);
__decorate([
    (0, RemoteObject_1.UseServer)(),
    (0, Validator_1.ValidateFunctionParameter)(),
    __param(0, (0, Validator_1.ValidateIsString)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServerReport, "getBase64", null);
__decorate([
    (0, RemoteObject_1.UseServer)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], ServerReport, "getBase64FromFile", null);
ServerReport = ServerReport_1 = __decorate([
    (0, Registry_1.$Class)("jassijs_report.remote.ServerReport")
], ServerReport);
exports.ServerReport = ServerReport;
async function test() {
    var ret = await ServerReport.getBase64("jassijs_report/server/TestServerreport", { sort: "name" });
    return ret;
    //    console.log(await new ServerReport().sayHello("Kurt"));
}
exports.test = test;
//# sourceMappingURL=ServerReport.js.map