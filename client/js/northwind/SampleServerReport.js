var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Property", "jassijs_report/Report"], function (require, exports, Property_1, Report_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.SampleClientReport = exports.SampleServerReport = void 0;
    let SampleServerReport = class SampleServerReport {
        constructor() {
            this.content = undefined;
        }
        async open() {
            //  this.report.open();
        }
        async download() {
            //  this.report.download();
        }
        async print() {
            // this.report.print();
        }
        async getBase64() {
            //holt sichs vom Server - parameter übertragen
            this.content = undefined; //report;
        }
        //this would be rendered on server
        layout(me) {
            this.content = {
                stack: [
                    {
                        columns: [
                            {
                                stack: [
                                    {
                                        text: "{{name}}{{name2}}"
                                    },
                                ]
                            }
                        ]
                    }
                ]
            };
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String)
    ], SampleServerReport.prototype, "name", void 0);
    SampleServerReport = __decorate([
        (0, Report_1.$Report)({ fullPath: "northwind.SampleServerReport", serverReportClass: "northwind.SampleServerReport" })
    ], SampleServerReport);
    exports.SampleServerReport = SampleServerReport;
    let SampleClientReport = class SampleClientReport {
        constructor() {
            this.content = undefined;
        }
        async open() {
            //  this.report.open();
        }
        async download() {
            //  this.report.download();
        }
        async print() {
            // this.report.print();
        }
        async getBase64() {
            //holt sichs vom Server - parameter übertragen
            this.content = undefined; //report;
        }
        layout(me) {
            this.content = {
                stack: [
                    {
                        columns: [
                            {
                                stack: [
                                    {
                                        text: "{{name}}{{name2}}"
                                    },
                                ]
                            }
                        ]
                    }
                ]
            };
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String)
    ], SampleClientReport.prototype, "name", void 0);
    SampleClientReport = __decorate([
        (0, Report_1.$Report)({ fullPath: "northwind.SampleServerReport" })
    ], SampleClientReport);
    exports.SampleClientReport = SampleClientReport;
    async function test2() {
        // kk.o=0;
        var dlg = new SampleClientReport();
        dlg.name = "hh";
        this.data = {
            name2: "Hallo"
        };
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test2 = test2;
});
//# sourceMappingURL=SampleServerReport.js.map