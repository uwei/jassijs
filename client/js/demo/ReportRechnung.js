var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs_report/ReportDesign", "jassijs/remote/Jassi", "jassijs/ui/Property", "de/remote/Kunde"], function (require, exports, ReportDesign_1, Jassi_1, Property_1, Kunde_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportRechnung = void 0;
    let ReportRechnung = class ReportRechnung extends ReportDesign_1.ReportDesign {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        async setdata() {
        }
        get title() {
            return this.value === undefined ? "Kundenreport" : "Kundenreport " + this.value.id;
        }
        layout(me) {
            this.design = {
                content: {
                    stack: [
                        {
                            columns: [
                                {
                                    stack: [
                                        {
                                            text: "{{invoice.customer.firstname}} {{invoice.customer.lastname}}"
                                        },
                                        {
                                            text: "{{invoice.customer.street}}"
                                        },
                                        {
                                            text: "{{invoice.customer.place}}"
                                        }
                                    ]
                                },
                                {
                                    stack: [
                                        {
                                            text: "Invoice",
                                            fontSize: 18
                                        },
                                        {
                                            text: "\n"
                                        },
                                        {
                                            text: "Date: {{invoice.date}}"
                                        },
                                        {
                                            text: "Number: {{invoice.number}}",
                                            bold: true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            table: {
                                body: [
                                    [
                                        "Item",
                                        "Price"
                                    ],
                                    {
                                        foreach: "line in invoice.lines",
                                        do: [
                                            "{{line.text}}",
                                            "{{line.price}}"
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            text: "\n"
                        },
                        {
                            foreach: "sum in invoice.summary",
                            do: {
                                columns: [
                                    {
                                        text: "{{sum.text}}"
                                    },
                                    {
                                        text: "{{sum.value}}"
                                    }
                                ]
                            }
                        }
                    ]
                },
                data: {
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
                }
            };
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Kunde_1.Kunde)
    ], ReportRechnung.prototype, "value", void 0);
    ReportRechnung = __decorate([
        Jassi_1.$Class("demo.ReportRechnung"),
        __metadata("design:paramtypes", [])
    ], ReportRechnung);
    exports.ReportRechnung = ReportRechnung;
    async function test() {
        // kk.o=0;
        var dlg = new ReportRechnung();
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=ReportRechnung.js.map