import { ReportDesign } from "jassi_report/ReportDesign";
import jassi from "jassi/jassi";
import { $Class } from "jassi/remote/Jassi";
import { $Property } from "jassi/ui/Property";
import { $UIComponent } from "jassi/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassi_report/RText";
@$Class("demo.ReportRechnung")
export class ReportRechnung extends ReportDesign {
    me = {};
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: Kunde;
    constructor() {
        super();
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
                                        text: "<br>"
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
                        text: "<br>"
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
    var dlg = new ReportRechnung();
    //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
    //	dlg.value=jassi.db.load("de.Kunde",9);	
    //console.log(JSON.stringify(dlg.toJSON()));
    return dlg;
}
