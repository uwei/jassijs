var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportInvoice = void 0;
    var reportdesign = {
        content: [
            {
                columns: [
                    [
                        "${invoice.customer.firstname} ${invoice.customer.lastname}",
                        "${invoice.customer.street}",
                        "${invoice.customer.place}"
                    ],
                    [
                        { fontSize: 18, text: "Invoice" },
                        "\n",
                        {
                            table: {
                                widths: ["auto", 100],
                                body: [
                                    [
                                        "Date:",
                                        {
                                            text: "${invoice.date}",
                                            format: "YYYY-MM-DD"
                                        }
                                    ],
                                    ["Number:", "${invoice.number}"]
                                ]
                            },
                            layout: "noBorders"
                        },
                        "",
                        "",
                        "\n"
                    ]
                ]
            },
            {
                datatable: {
                    header: ["Item", "Price"],
                    dataforeach: "line in invoice.lines",
                    body: [
                        "${line.text}",
                        {
                            bold: false,
                            text: "${line.price}",
                            format: "#.##0,00"
                        }
                    ]
                }
            },
            "\n",
            {
                foreach: "summ in invoice.summary",
                columns: ["${summ.text}", "${summ.value}"]
            }
        ]
    };
    let ReportInvoice = class ReportInvoice {
        constructor() {
            this.reportdesign = reportdesign;
        }
        get title() {
            return "Invoicreport";
        }
    };
    ReportInvoice = __decorate([
        (0, Registry_1.$Class)("demo.ReportInvoice"),
        __metadata("design:paramtypes", [])
    ], ReportInvoice);
    exports.ReportInvoice = ReportInvoice;
    async function test() {
        // kk.o=0;
        var dlg = new ReportInvoice();
        dlg.parameter = { date: "21.05.2022" };
        dlg.value = {
            invoice: {
                number: 1000,
                date: new Date(),
                customer: {
                    firstname: "Henry",
                    lastname: "Klaus",
                    street: "Hauptstr. 157",
                    place: "chemnitz",
                },
                lines: [
                    { pos: 1, text: "this is the first position, lksjdflgsd er we wer wre er er er re wekfgjslkdfjjdk sgfsdg", price: 10.00, amount: 50, variante: [{ m: 1 }, { m: 2 }] },
                    { pos: 2, text: "this is the next position", price: 20.50, },
                    { pos: 3, text: "this is an other position", price: 19.50 },
                    { pos: 4, text: "this is the last position", price: 50.00 },
                ],
                summary: [
                    { text: "Subtotal", value: 100.00 },
                    { text: "Tax", value: 19.00 },
                    { text: "Subtotal", value: 119.00 },
                ]
            }
        };
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=ReportInvoice2.js.map