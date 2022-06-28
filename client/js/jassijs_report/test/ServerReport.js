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
    exports.test = exports.ServerReport = void 0;
    /*var reportdesign:JassijsReportDefinition = {
        content: [
            {
                datatable: {
                    dataforeach:"person",
                    body: [
                        "${person.name}","${person.lastname}"
                    ]
                }
            }
        ]
    };*/
    let ServerReport = class ServerReport extends Report_1.Report {
    };
    __decorate([
        (0, Property_1.$Property)({ chooseFromStrict: true, chooseFrom: ["name", "lastname"] }),
        __metadata("design:type", String)
    ], ServerReport.prototype, "sort", void 0);
    ServerReport = __decorate([
        (0, Report_1.$Report)({ name: "test/Sample Serverreport", serverReportPath: "jassijs_report/TestServerreport" }),
        (0, Registry_1.$Class)("jassijs_report.test.ServerReport")
    ], ServerReport);
    exports.ServerReport = ServerReport;
    async function test() {
        var cl = new ServerReport();
        cl.sort = "lastname";
        await cl.show();
    }
    exports.test = test;
});
//# sourceMappingURL=ServerReport.js.map