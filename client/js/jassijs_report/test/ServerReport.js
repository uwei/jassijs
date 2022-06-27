var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs_report/Report", "jassijs/ui/Property", "jassijs/remote/Registry"], function (require, exports, Report_1, Property_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                datatable: {
                    dataforeach: "person",
                    body: [
                        "${person.name}", "${person.lastname}"
                    ]
                }
            }
        ]
    };
    let ServerReportParameter = class ServerReportParameter {
    };
    ServerReportParameter = __decorate([
        (0, Registry_1.$Class)("jassijs_report.remote.ServerReportParameter")
    ], ServerReportParameter);
    let ServerReport = class ServerReport extends Report_1.Report {
    };
    __decorate([
        (0, Property_1.$Property)({ type: "json", componentType: "jassijs_report.remote.ServerReportParameter" }),
        __metadata("design:type", ServerReportParameter)
    ], ServerReport.prototype, "parameter", void 0);
    ServerReport = __decorate([
        (0, Report_1.$Report)({ name: "test/Sample Serverreport", serverReportPath: "jassijs_report/TestServerreport" }),
        (0, Registry_1.$Class)("jassijs_report.test.ClientReport")
    ], ServerReport);
    async function test() {
        var cl = new ServerReport();
        cl.parameter = { sort: "name" };
        await cl.open();
    }
    exports.test = test;
});
//# sourceMappingURL=ServerReport.js.map