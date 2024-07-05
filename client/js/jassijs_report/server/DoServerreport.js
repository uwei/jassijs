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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define(["require", "exports", "jassijs/remote/Config"], function (require, exports, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DoServerreport = void 0;
    class DoServerreport {
        async getDesign(path, parameter) {
            var fill = (await new Promise((resolve_1, reject_1) => { require([path], resolve_1, reject_1); }).then(__importStar)).fill;
            var content = await fill(parameter);
            return content;
        }
        async download(url, dest) {
        }
        async getBase64(file, parameter) {
            var data = await this.getDesign(file, parameter);
            return await this.getBase64FromData(data);
        }
        async getBase64FromData(data) {
            var PDFReport = await new Promise((resolve) => {
                Config_1.config.clientrequire(["jassijs_report/PDFReport"], (rep) => {
                    resolve(rep.PDFReport);
                });
            });
            var rep = new PDFReport();
            rep.data = data.data;
            rep.value = data.reportdesign;
            rep.parameter = data.parameter;
            await rep.fill();
            return await rep.getBase64();
        }
    }
    exports.DoServerreport = DoServerreport;
});
//# sourceMappingURL=DoServerreport.js.map