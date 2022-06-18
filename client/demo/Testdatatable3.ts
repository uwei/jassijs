import { ReportDesign } from "jassijs_report/ReportDesign";
import jassi from "jassijs/jassi";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassijs_report/RText";

var reportdesign = {
	content: [
		{
			datatable: {
				widths: [140,"auto","auto"],
				groups: [
					{
						header: ["${group1.name}","","${count(group1,'age')}"],
						expression: "city",
						footer: ["","${group1.name}",""]
},
					{
						header: ["${group2.name}","",""],
						expression: "customer",
						footer: ["custfooter","",""]
					}
				],
				header: ["id","customer","city"],
				footer: ["","",""],
				dataforeach: "cust",
				body: ["${cust.id}","${cust.customer}","${cust.city}"]
			}
		}
	]
};

var sampleData = [
	{ id: 1, customer: "Fred", city: "Frankfurt", age: 51 },
	{ id: 8, customer: "Alma", city: "Dresden", age: 70 },
	{ id: 3, customer: "Heinz", city: "Frankfurt", age: 33 },
	{ id: 2, customer: "Fred", city: "Frankfurt", age: 88 },
	{ id: 6, customer: "Max", city: "Dresden", age: 3 },
	{ id: 4, customer: "Heinz", city: "Frankfurt", age: 64 },
	{ id: 5, customer: "Max", city: "Dresden", age: 54 },
	{ id: 7, customer: "Alma", city: "Dresden", age: 33 },
	{ id: 9, customer: "Otto", city: "Berlin", age: 21 }
];





export async function test() {
    // kk.o=0;
    var dlg: any = { reportdesign };
    dlg.value = sampleData;

    return dlg;
}
