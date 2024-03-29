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
        footer: [{}, {}, {}],
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
                        "Date: ${parameter.date}",
                        "Number: ${invoice.number}"
                    ],
                    {}
                ]
            },
            {
                table: {
                    body: [
                        ["Item", "Price"],
                        {
                            foreach: "line in invoice.lines",
                            do: ["${line.text}", "${line.price}"]
                        }
                    ]
                }
            },
            {},
            {},
            "\n",
            {
                foreach: "sum in invoice.summary",
                do: {
                    columns: [
                        {
                            text: "${sum.text}"
                        },
                        {
                            text: "${sum.value}"
                        }
                    ]
                }
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
                date: "20.07.2018",
                customer: {
                    firstname: "Henry",
                    lastname: "Klaus",
                    street: "Hauptstr. 157",
                    place: "chemnitz"
                },
                lines: [
                    {
                        pos: 1,
                        text: "this is the first position, lksjdflgsd er we wer wre er er er re wekfgjslkdfjjdk sgfsdg",
                        price: 10,
                        amount: 50,
                        variante: [
                            {
                                m: 1
                            },
                            {
                                m: 2
                            }
                        ]
                    },
                    {
                        pos: 2,
                        text: "this is the next position",
                        price: 20.5
                    },
                    {
                        pos: 3,
                        text: "this is an other position",
                        price: 19.5
                    },
                    {
                        pos: 4,
                        text: "this is the last position",
                        price: 50
                    }
                ],
                summary: [
                    {
                        text: "Subtotal",
                        value: 100
                    },
                    {
                        text: "Tax",
                        value: 19
                    },
                    {
                        text: "Subtotal",
                        value: 119
                    }
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
//# sourceMappingURL=ReportInvoice.js.map