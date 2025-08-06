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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs_report/ext/pdfmake", "jassijs/base/Windows", "jassijs/remote/Classes", "jassijs_report/remote/ServerReport", "jassijs_report/PDFReport", "jassijs/base/Actions"], function (require, exports, Registry_1, pdfmake_1, Windows_1, Classes_1, ServerReport_1, PDFReport_1, Actions_1) {
    "use strict";
    var Report_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Report = exports.$Report = exports.ReportProperties = void 0;
    Registry_1 = __importStar(Registry_1);
    pdfmake_1 = __importDefault(pdfmake_1);
    Windows_1 = __importDefault(Windows_1);
    //import { ReportViewer } from "jassijs_report/ReportViewer";
    class ReportProperties {
    }
    exports.ReportProperties = ReportProperties;
    function $Report(properties) {
        return function (pclass) {
            Registry_1.default.register("$Report", pclass, properties);
        };
    }
    exports.$Report = $Report;
    let Report = Report_1 = class Report {
        //this is a sample remote function
        async fill() {
            var clname = Classes_1.classes.getClassName(this);
            var meta = Registry_1.default.getData("$Report", clname);
            if ((meta === null || meta === void 0 ? void 0 : meta.length) > 0 && meta[0].params.length > 0) {
                var path = meta[0].params[0].serverReportPath;
                if (path) {
                    var par = this.getParameter();
                    var ret = await ServerReport_1.ServerReport.getDesign(path, par);
                    return ret;
                }
                //return await this.call(this, this.fill, context);
            }
            throw new Classes_1.JassiError("Clintreports must implememt fill");
        }
        getParameter() {
            var reportFields = Object.keys(new Report_1());
            var thisFields = Object.keys(this);
            var ret = {};
            thisFields.forEach((f) => {
                if (reportFields.indexOf(f) === -1) {
                    ret[f] = this[f];
                    if (typeof ret[f] === "function")
                        ret[f].bind(ret);
                }
            });
            return ret;
        }
        async getBase64() {
            var clname = Classes_1.classes.getClassName(this);
            var meta = Registry_1.default.getData("$Report", clname);
            if ((meta === null || meta === void 0 ? void 0 : meta.length) > 0 && meta[0].params.length > 0) {
                var path = meta[0].params[0].serverReportPath;
                if (path) {
                    var par = this.getParameter();
                    return await ServerReport_1.ServerReport.getBase64(path, par);
                }
                //return await this.call(this, this.fill, context);
            }
            var rep = new PDFReport_1.PDFReport();
            var des = await this.fill();
            rep.value = des.reportdesign;
            rep.data = des.data;
            rep.parameter = des.parameter;
            rep.fill();
            return await rep.getBase64();
        }
        getName() {
            var clname = Classes_1.classes.getClassName(this);
            var meta = Registry_1.default.getData("$Report", clname);
            var ret = "Report";
            if ((meta === null || meta === void 0 ? void 0 : meta.length) > 0 && meta[0].params.length > 0) {
                ret = meta[0].params[0].name;
                ret = ret.split("/")[ret.split("/").length - 1];
            }
            return ret;
        }
        _base64ToArrayBuffer(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
        async open() {
            var b64 = await this.getBase64();
            var rep = pdfmake_1.default.createPdf({ content: [] });
            var _this = this;
            rep.getBuffer = async () => {
                return _this._base64ToArrayBuffer(b64);
            };
            rep.open();
            //alert("TODO");
        }
        async view() {
            var ReportViewer = (await new Promise((resolve_1, reject_1) => { require(["jassijs_report/ReportViewer"], resolve_1, reject_1); }).then(__importStar)).ReportViewer;
            var ret = new ReportViewer();
            ret.value = this;
            Windows_1.default.add(ret, this.getName());
        }
        static createFunction(classname) {
            return async function () {
                var Rep = await Classes_1.classes.loadClass(classname);
                new Rep().view();
            };
        }
        /**
        * create Action for all DBObjectView with actionname is defined
        */
        static async createActions() {
            console.log("TODO repair Actions");
            return [];
            var ret = [];
            var data = await Registry_1.default.getJSONData("$Report");
            for (var x = 0; x < data.length; x++) {
                var param = data[x].params[0];
                if (param.actionname) {
                    ret.push({
                        name: param.actionname,
                        icon: param.icon,
                        run: this.createFunction(data[x].classname)
                    });
                }
            }
            return ret;
        }
    };
    __decorate([
        (0, Actions_1.$Actions)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Report, "createActions", null);
    Report = Report_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("jassijs_report.remote.Report")
    ], Report);
    exports.Report = Report;
    async function test() {
        //    console.log(await new Report().sayHello("Kurt"));
    }
    exports.test = test;
});
//# sourceMappingURL=Report.js.map