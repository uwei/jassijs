var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/Server", "jassijs/remote/Validator"], function (require, exports, Registry_1, RemoteObject_1, Server_1, Validator_1) {
    "use strict";
    var ServerReport_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ServerReport = void 0;
<<<<<<< HEAD
    let ServerReport = ServerReport_1 = class ServerReport {
        static async getDesign(path, parameter) {
            //@ts-ignore
            var DoServerreport = (await new Promise((resolve_1, reject_1) => { require(["jassijs_report/server/DoServerreport"], resolve_1, reject_1); }).then(__importStar)).DoServerreport;
            ServerReport_1.cacheLastParameter[path] = parameter;
            return await new DoServerreport().getDesign(path, parameter);
        }
        static async getBase64(path, parameter) {
            //@ts-ignore
            var DoServerreport = (await new Promise((resolve_2, reject_2) => { require(["jassijs_report/server/DoServerreport"], resolve_2, reject_2); }).then(__importStar)).DoServerreport;
            if (parameter == "useLastCachedParameter")
                parameter = ServerReport_1.cacheLastParameter[path];
            return await new DoServerreport().getBase64(path, parameter);
        }
        static async getBase64FromFile(file, context = undefined) {
            var res = await new Server_1.Server().testServersideFile(file.substring(0, file.length - 3), context);
            //@ts-ignore 
            var DoServerreport = (await new Promise((resolve_3, reject_3) => { require(["jassijs_report/server/DoServerreport"], resolve_3, reject_3); }).then(__importStar)).DoServerreport;
            return await new DoServerreport().getBase64FromData(res);
=======
    let ServerReport = ServerReport_1 = class ServerReport extends RemoteObject_1.RemoteObject {
        static async getDesign(path, parameter, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await ServerReport_1.call(this.getDesign, path, parameter, context);
            }
            else {
                //@ts-ignore
                var DoServerreport = (await new Promise((resolve_1, reject_1) => { require(["jassijs_report/server/DoServerreport"], resolve_1, reject_1); }).then(__importStar)).DoServerreport;
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
                var DoServerreport = (await new Promise((resolve_2, reject_2) => { require(["jassijs_report/server/DoServerreport"], resolve_2, reject_2); }).then(__importStar)).DoServerreport;
                if (parameter == "useLastCachedParameter")
                    parameter = ServerReport_1.cacheLastParameter[path];
                return await new DoServerreport().getBase64(path, parameter);
            }
        }
        static async getBase64FromFile(file, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await ServerReport_1.call(this.getBase64FromFile, file, context);
            }
            else {
                var res = await new Server_1.Server().testServersideFile(file.substring(0, file.length - 3), context);
                //@ts-ignore 
                var DoServerreport = (await new Promise((resolve_3, reject_3) => { require(["jassijs_report/server/DoServerreport"], resolve_3, reject_3); }).then(__importStar)).DoServerreport;
                return await new DoServerreport().getBase64FromData(res);
            }
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
});
//# sourceMappingURL=ServerReport.js.map