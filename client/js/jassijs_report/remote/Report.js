var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/base/Windows", "jassijs/remote/Classes"], function (require, exports, Registry_1, RemoteObject_1, Windows_1, Classes_1) {
    "use strict";
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
    let Report = class Report extends RemoteObject_1.RemoteObject {
        //this is a sample remote function
        async fill(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var clname = Classes_1.classes.getClassName(this);
                var meta = Registry_1.default.getData("$Report", clname);
                if ((meta === null || meta === void 0 ? void 0 : meta.length) > 0 && meta[0].params.length > 0) {
                    var path = meta[0].params[0].serverReportPath;
                    if (path) {
                        this["serverReportPath"] = path;
                    }
                    return await this.call(this, this.fill, context);
                }
                throw new Classes_1.JassiError("Clintreports must implememt fill");
            }
            else {
                var fill = (await new Promise((resolve_1, reject_1) => { require([this["serverReportPath"]], resolve_1, reject_1); })).fill;
                return await fill(this.parameter); //this would be execute on server  
            }
        }
        async open() {
            var PDFReport = await Classes_1.classes.loadClass("jassijs_report.PDFReport");
            var PDFViewer = await Classes_1.classes.loadClass("jassijs_report.PDFViewer");
            var rep = new PDFReport();
            var des = await this.fill();
            rep.value = des.reportdesign;
            rep.data = des.data;
            rep.parameter = des.parameter;
            rep.fill();
            var viewer = new PDFViewer();
            viewer.value = await rep.getBase64();
            Windows_1.default.add(viewer, "Report");
        }
    };
    Report = __decorate([
        (0, Registry_1.$Class)("jassijs_report.remote.Report")
    ], Report);
    exports.Report = Report;
    async function test() {
        //    console.log(await new Report().sayHello("Kurt"));
    }
    exports.test = test;
});
//# sourceMappingURL=Report.js.map