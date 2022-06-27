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
    __decorate([
        (0, Property_1.$Property)({ chooseFromStrict: true, chooseFrom: ["name", "lastname"] }),
        __metadata("design:type", String)
    ], ServerReportParameter.prototype, "sort", void 0);
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
        (0, Registry_1.$Class)("jassijs_report.test.ServerReport")
    ], ServerReport);
    exports.ServerReport = ServerReport;
    async function test() {
        var cl = new ServerReport();
        cl.parameter = { sort: "name" };
        await cl.open();
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyUmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvdGVzdC9TZXJ2ZXJSZXBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUlBLElBQUksWUFBWSxHQUEyQjtRQUN2QyxPQUFPLEVBQUU7WUFDTDtnQkFDSSxTQUFTLEVBQUU7b0JBQ1AsV0FBVyxFQUFDLFFBQVE7b0JBQ3BCLElBQUksRUFBRTt3QkFDRixnQkFBZ0IsRUFBQyxvQkFBb0I7cUJBQ3hDO2lCQUNKO2FBQ0o7U0FDSjtLQUNKLENBQUM7SUFFRixJQUFNLHFCQUFxQixHQUEzQixNQUFNLHFCQUFxQjtLQUcxQixDQUFBO0lBREc7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBQyxnQkFBZ0IsRUFBQyxJQUFJLEVBQUMsVUFBVSxFQUFDLENBQUMsTUFBTSxFQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUM7O3VEQUNwRDtJQUZaLHFCQUFxQjtRQUQxQixJQUFBLGlCQUFNLEVBQUMsNkNBQTZDLENBQUM7T0FDaEQscUJBQXFCLENBRzFCO0lBR0QsSUFBYSxZQUFZLEdBQXpCLE1BQWEsWUFBYSxTQUFRLGVBQU07S0FJdkMsQ0FBQTtJQUZHO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsNkNBQTZDLEVBQUUsQ0FBQztrQ0FDeEUscUJBQXFCO21EQUFDO0lBRi9CLFlBQVk7UUFGeEIsSUFBQSxnQkFBTyxFQUFDLEVBQUMsSUFBSSxFQUFDLDBCQUEwQixFQUFDLGdCQUFnQixFQUFDLGlDQUFpQyxFQUFDLENBQUM7UUFDN0YsSUFBQSxpQkFBTSxFQUFDLGtDQUFrQyxDQUFDO09BQzlCLFlBQVksQ0FJeEI7SUFKWSxvQ0FBWTtJQU1sQixLQUFLLFVBQVUsSUFBSTtRQUN0QixJQUFJLEVBQUUsR0FBQyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxTQUFTLEdBQUMsRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLENBQUM7UUFDM0IsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUpELG9CQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgJFJlcG9ydCwgUmVwb3J0IH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydFwiO1xuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xuXG52YXIgcmVwb3J0ZGVzaWduOkphc3NpanNSZXBvcnREZWZpbml0aW9uID0ge1xuICAgIGNvbnRlbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgZGF0YXRhYmxlOiB7XG4gICAgICAgICAgICAgICAgZGF0YWZvcmVhY2g6XCJwZXJzb25cIixcbiAgICAgICAgICAgICAgICBib2R5OiBbXG4gICAgICAgICAgICAgICAgICAgIFwiJHtwZXJzb24ubmFtZX1cIixcIiR7cGVyc29uLmxhc3RuYW1lfVwiXG4gICAgICAgICAgICAgICAgXSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF1cbn07XG5AJENsYXNzKFwiamFzc2lqc19yZXBvcnQucmVtb3RlLlNlcnZlclJlcG9ydFBhcmFtZXRlclwiKVxuY2xhc3MgU2VydmVyUmVwb3J0UGFyYW1ldGVyIHtcbiAgICBAJFByb3BlcnR5KHtjaG9vc2VGcm9tU3RyaWN0OnRydWUsY2hvb3NlRnJvbTpbXCJuYW1lXCIsXCJsYXN0bmFtZVwiXX0pXG4gICAgc29ydD86IHN0cmluZztcbn1cbkAkUmVwb3J0KHtuYW1lOlwidGVzdC9TYW1wbGUgU2VydmVycmVwb3J0XCIsc2VydmVyUmVwb3J0UGF0aDpcImphc3NpanNfcmVwb3J0L1Rlc3RTZXJ2ZXJyZXBvcnRcIn0pXG5AJENsYXNzKFwiamFzc2lqc19yZXBvcnQudGVzdC5TZXJ2ZXJSZXBvcnRcIilcbmV4cG9ydCBjbGFzcyBTZXJ2ZXJSZXBvcnQgZXh0ZW5kcyBSZXBvcnQge1xuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImpzb25cIiwgY29tcG9uZW50VHlwZTogXCJqYXNzaWpzX3JlcG9ydC5yZW1vdGUuU2VydmVyUmVwb3J0UGFyYW1ldGVyXCIgfSlcbiAgICBkZWNsYXJlIHBhcmFtZXRlcjpTZXJ2ZXJSZXBvcnRQYXJhbWV0ZXI7XG4gICAgXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCl7XG4gICAgdmFyIGNsPW5ldyBTZXJ2ZXJSZXBvcnQoKTtcbiAgICBjbC5wYXJhbWV0ZXI9e3NvcnQ6XCJuYW1lXCJ9O1xuICAgIGF3YWl0IGNsLm9wZW4oKTtcbn0iXX0=