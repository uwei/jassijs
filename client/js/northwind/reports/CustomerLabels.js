var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs_report/Report", "jassijs/ui/Property", "jassijs/remote/Registry", "northwind/remote/Customer", "jassijs/base/Actions"], function (require, exports, Report_1, Property_1, Registry_1, Customer_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerLabels = void 0;
    var reportdesign = {
        content: [
            {
                table: {
                    dontBreakRows: false,
                    widths: ["33%", "33%", "33%"],
                    body: []
                },
                layout: "noBorders"
            }
        ]
    };
    var allCountries = ["Germany"];
    let CustomerLabels = class CustomerLabels extends Report_1.Report {
        async fill() {
            var customers = await Customer_1.Customer.find();
            for (var x = 0; x < customers.length; x++) {
                if (allCountries.indexOf(customers[x].Country) === -1) {
                    allCountries.push(customers[x].Country);
                }
            }
            allCountries.sort();
            if (this.country) {
                customers = await Customer_1.Customer.find({ where: "Country=:c", whereParams: { c: this.country } });
            }
            var line;
            reportdesign.content[0].table.body = [];
            for (var x = 0; x < customers.length; x++) {
                if (x % 3 === 0) {
                    line = [];
                    reportdesign.content[0].table.body.push(line);
                }
                var adr = { text: customers[x].CompanyName + "\n" +
                        customers[x].Address + "\n" +
                        customers[x].City + " " + customers[x].PostalCode + "\n" +
                        customers[x].Country + "\n\n\n" };
                if ((x - 1) % 21 === 0 && x > 16)
                    adr.pageBreak = 'after';
                line.push(adr);
            }
            while (x % 3 !== 0) {
                x = x + 1;
                line.push("");
            }
            return {
                reportdesign
            };
        }
        static async dummy() {
        }
    };
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: function () {
                return allCountries;
            } }),
        __metadata("design:type", String)
    ], CustomerLabels.prototype, "country", void 0);
    __decorate([
        (0, Actions_1.$Action)({
            name: "Northwind/Reports",
            icon: "mdi mdi-file-chart-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], CustomerLabels, "dummy", null);
    CustomerLabels = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Report_1.$Report)({ name: "nothwind/Customer Labels", actionname: "Northwind/Reports/Customer Labels", icon: "mdi mdi-file-chart-outline" }),
        (0, Registry_1.$Class)("nothwind.CustomerLabels")
    ], CustomerLabels);
    exports.CustomerLabels = CustomerLabels;
    async function test() {
        var cl = new CustomerLabels();
        cl.country = "USA";
        return await cl.fill();
        //await cl.open();
    }
    exports.test = test;
});
//# sourceMappingURL=CustomerLabels.js.map