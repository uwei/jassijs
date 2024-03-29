
import { $Class } from "jassijs/remote/Registry";

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
					{fontSize: 18,text: "Invoice"},
					"\n",
					{
						table: {
							widths: ["auto",100],
							body: [
								[
									"Date:",
									{
										text: "${invoice.date}",
										format: "YYYY-MM-DD"
									}
								],
								["Number:","${invoice.number}"]
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
				header: ["Item","Price"],
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
			columns: ["${summ.text}","${summ.value}"]
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
