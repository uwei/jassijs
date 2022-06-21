import { ReportDesign } from "jassijs_report/ReportDesign";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassijs_report/RText";

var reportdesign = {
	footer: [{},{},{}],
	content: [
		{
			columns: [
				[
					"${invoice.customer.firstname} ${invoice.customer.lastname}",
					"${invoice.customer.street}",
					"${invoice.customer.place}"
				],
				[
					{fontSize: 18,text: "Invoice"},
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
					["Item","Price"],
					{
						foreach: "line in invoice.lines",
						do: ["${line.text}","${line.price}"]
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


@$Class("demo.ReportInvoice")
export class ReportInvoice {
    reportdesign = reportdesign;
	parameter;
    value;
    constructor() {

    }
    get title() {
        return "Invoicreport";
    }

}
export async function test() {
    // kk.o=0;
    var dlg = new ReportInvoice();
	dlg.parameter={date:"21.05.2022"};
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
