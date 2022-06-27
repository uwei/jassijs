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
    exports.test = exports.ClientReport = exports.ClientReportParameter = void 0;
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
    let ClientReportParameter = class ClientReportParameter {
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String)
    ], ClientReportParameter.prototype, "sort", void 0);
    ClientReportParameter = __decorate([
        (0, Registry_1.$Class)("jassijs_report.remote.ClientReportParameter")
    ], ClientReportParameter);
    exports.ClientReportParameter = ClientReportParameter;
    let ClientReport = class ClientReport extends Report_1.Report {
        async fill() {
            var data = [
                { name: "Aoron", lastname: "Müller" },
                { name: "Heino", lastname: "Brecht" }
            ];
            return {
                reportdesign,
                data
            };
        }
    };
    __decorate([
        (0, Property_1.$Property)({ type: "json", componentType: "jassijs_report.remote.ClientReportParameter" }),
        __metadata("design:type", ClientReportParameter)
    ], ClientReport.prototype, "parameter", void 0);
    ClientReport = __decorate([
        (0, Report_1.$Report)({ name: "test/Sample Clientreport" }),
        (0, Registry_1.$Class)("jassijs_report.test.ClientReport")
    ], ClientReport);
    exports.ClientReport = ClientReport;
    async function test() {
        var cl = new ClientReport();
        await cl.open();
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50UmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvdGVzdC9DbGllbnRSZXBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUlBLElBQUksWUFBWSxHQUEyQjtRQUN2QyxPQUFPLEVBQUU7WUFDTDtnQkFDSSxTQUFTLEVBQUU7b0JBQ1AsV0FBVyxFQUFDLFFBQVE7b0JBQ3BCLElBQUksRUFBRTt3QkFDRixnQkFBZ0IsRUFBQyxvQkFBb0I7cUJBQ3hDO2lCQUNKO2FBQ0o7U0FDSjtLQUNKLENBQUM7SUFFRixJQUFhLHFCQUFxQixHQUFsQyxNQUFhLHFCQUFxQjtLQUdqQyxDQUFBO0lBREc7UUFEQyxJQUFBLG9CQUFTLEdBQUU7O3VEQUNFO0lBRkwscUJBQXFCO1FBRGpDLElBQUEsaUJBQU0sRUFBQyw2Q0FBNkMsQ0FBQztPQUN6QyxxQkFBcUIsQ0FHakM7SUFIWSxzREFBcUI7SUFNbEMsSUFBYSxZQUFZLEdBQXpCLE1BQWEsWUFBYSxTQUFRLGVBQU07UUFHcEMsS0FBSyxDQUFDLElBQUk7WUFDTixJQUFJLElBQUksR0FBQztnQkFDTCxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLFFBQVEsRUFBQztnQkFDaEMsRUFBQyxJQUFJLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUM7YUFDL0IsQ0FBQTtZQUNMLE9BQU87Z0JBQ0gsWUFBWTtnQkFDWixJQUFJO2FBQ1AsQ0FBQTtRQUNMLENBQUM7S0FDSixDQUFBO0lBWEc7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSw2Q0FBNkMsRUFBRSxDQUFDO2tDQUN2RSxxQkFBcUI7bURBQUM7SUFGaEMsWUFBWTtRQUZ4QixJQUFBLGdCQUFPLEVBQUMsRUFBQyxJQUFJLEVBQUMsMEJBQTBCLEVBQUMsQ0FBQztRQUMxQyxJQUFBLGlCQUFNLEVBQUMsa0NBQWtDLENBQUM7T0FDOUIsWUFBWSxDQWF4QjtJQWJZLG9DQUFZO0lBZWxCLEtBQUssVUFBVSxJQUFJO1FBQ3RCLElBQUksRUFBRSxHQUFDLElBQUksWUFBWSxFQUFFLENBQUM7UUFDMUIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUhELG9CQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgJFJlcG9ydCwgUmVwb3J0IH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydFwiO1xuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xuXG52YXIgcmVwb3J0ZGVzaWduOkphc3NpanNSZXBvcnREZWZpbml0aW9uID0ge1xuICAgIGNvbnRlbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgZGF0YXRhYmxlOiB7XG4gICAgICAgICAgICAgICAgZGF0YWZvcmVhY2g6XCJwZXJzb25cIixcbiAgICAgICAgICAgICAgICBib2R5OiBbXG4gICAgICAgICAgICAgICAgICAgIFwiJHtwZXJzb24ubmFtZX1cIixcIiR7cGVyc29uLmxhc3RuYW1lfVwiXG4gICAgICAgICAgICAgICAgXSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF1cbn07XG5AJENsYXNzKFwiamFzc2lqc19yZXBvcnQucmVtb3RlLkNsaWVudFJlcG9ydFBhcmFtZXRlclwiKVxuZXhwb3J0IGNsYXNzIENsaWVudFJlcG9ydFBhcmFtZXRlciB7XG4gICAgQCRQcm9wZXJ0eSgpXG4gICAgc29ydD86IHN0cmluZztcbn1cbkAkUmVwb3J0KHtuYW1lOlwidGVzdC9TYW1wbGUgQ2xpZW50cmVwb3J0XCJ9KVxuQCRDbGFzcyhcImphc3NpanNfcmVwb3J0LnRlc3QuQ2xpZW50UmVwb3J0XCIpXG5leHBvcnQgY2xhc3MgQ2xpZW50UmVwb3J0IGV4dGVuZHMgUmVwb3J0IHtcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJqc29uXCIsIGNvbXBvbmVudFR5cGU6IFwiamFzc2lqc19yZXBvcnQucmVtb3RlLkNsaWVudFJlcG9ydFBhcmFtZXRlclwiIH0pXG4gICAgZGVjbGFyZSBwYXJhbWV0ZXI6IENsaWVudFJlcG9ydFBhcmFtZXRlcjtcbiAgICBhc3luYyBmaWxsKCkge1xuICAgICAgICB2YXIgZGF0YT1bXG4gICAgICAgICAgICB7bmFtZTpcIkFvcm9uXCIsbGFzdG5hbWU6XCJNw7xsbGVyXCJ9LFxuICAgICAgICAgICAge25hbWU6XCJIZWlub1wiLGxhc3RuYW1lOlwiQnJlY2h0XCJ9XG4gICAgICAgICAgICBdXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXBvcnRkZXNpZ24sXG4gICAgICAgICAgICBkYXRhXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCl7XG4gICAgdmFyIGNsPW5ldyBDbGllbnRSZXBvcnQoKTtcbiAgICBhd2FpdCBjbC5vcGVuKCk7XG59Il19