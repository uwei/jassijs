import { ReportDesign } from "jassijs_report/ReportDesign";
import jassi from "jassijs/jassi";
import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassijs_report/RText";
@$Class("demo.ReportInvoice")
export class ReportInvoice extends ReportDesign {
    me = {};

    constructor() {
        super();
        this.layout(this.me);
    }
    async setdata() {
    }
    get title() {
        return "Invoicreport";
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
}
export async function test() {
    // kk.o=0;
    var dlg = new ReportInvoice();
    //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
    //	dlg.value=jassijs.db.load("de.Kunde",9);	
    //console.log(JSON.stringify(dlg.toJSON()));
    return dlg;
}
