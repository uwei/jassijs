var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/base/Windows", "jassijs/remote/Classes", "jassijs_report/remote/ServerReport", "jassijs_report/PDFReport", "jassijs_report/ReportViewer"], function (require, exports, Registry_1, RemoteObject_1, Windows_1, Classes_1, ServerReport_1, PDFReport_1, ReportViewer_1) {
    "use strict";
    var Report_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Report = exports.$Report = exports.ReportProperties = void 0;
    class ReportProperties {
    }
    exports.ReportProperties = ReportProperties;
    function $Report(properties) {
        return function (pclass) {
            Registry_1.default.register("$Report", pclass, properties);
        };
    }
    exports.$Report = $Report;
    let Report = Report_1 = class Report extends RemoteObject_1.RemoteObject {
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
        async open() {
            var ret = new ReportViewer_1.ReportViewer();
            ret.value = this;
            Windows_1.default.add(ret, "Report");
        }
    };
    Report = Report_1 = __decorate([
        (0, Registry_1.$Class)("jassijs_report.remote.Report")
    ], Report);
    exports.Report = Report;
    async function test() {
        //    console.log(await new Report().sayHello("Kurt"));
    }
    exports.test = test;
});
//# sourceMappingURL=Report.js.map