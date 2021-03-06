define(["require", "exports", "jassi_report/ReportDesign"], function (require, exports, ReportDesign_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Testreport = void 0;
    class Testreport extends ReportDesign_1.ReportDesign {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            this.design = {
                content: {
                    stack: [
                        {
                            text: "{{invoice.number}}"
                        },
                        {
                            datatable: {
                                widths: [
                                    125,
                                    105,
                                    "auto"
                                ],
                                header: [
                                    {
                                        text: "Item"
                                    },
                                    {
                                        text: "Price"
                                    },
                                    {
                                        text: "sssss"
                                    }
                                ],
                                footer: [
                                    {
                                        text: "sumItem"
                                    },
                                    {
                                        text: "sumPrice"
                                    },
                                    {
                                        text: "\n"
                                    }
                                ],
                                dataforeach: "line in invoice.lines",
                                body: [
                                    {
                                        text: "{{line.text}}"
                                    },
                                    {
                                        text: "{{line.price}}"
                                    },
                                    {
                                        stack: [
                                            {
                                                foreach: "variante in line.variante",
                                                columns: [
                                                    {
                                                        text: "kk"
                                                    },
                                                    {
                                                        text: "{{variante.m}}"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            text: "asdläkfakldl nlkjgsdijsfbkmssdlgkösdfjgsdfjla dfgljksdjg sdfkglsjdfglksfglskjfglskdfjg ssdfg kkkj"
                        },
                        {
                            columns: [
                                {
                                    text: "sdfsdf",
                                    width: 475
                                },
                                {
                                    text: "dfsdfsdf",
                                    width: 35
                                }
                            ]
                        }
                    ]
                },
                userPassword: "123",
                permissions: {
                    modifying: false,
                    copying: false,
                    annotating: false,
                    fillingForms: true,
                    contentAccessibility: true,
                    documentAssembly: true
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
                                price: 20.5,
                                amount: 50,
                                variante: [
                                    {
                                        m: 3
                                    },
                                    {
                                        m: 4
                                    }
                                ]
                            },
                            {
                                pos: 3,
                                text: "this is an other position",
                                price: 19.5,
                                variante: [
                                    {
                                        m: 3
                                    },
                                    {
                                        m: 4
                                    }
                                ]
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
    }
    exports.Testreport = Testreport;
    async function test() {
        // kk.o=0;
        var dlg = new Testreport();
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassi.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=testreport.js.map