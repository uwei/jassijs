import { ReportDesign } from "jassijs_report/ReportDesign";
import jassi from "jassijs/jassi";
import { $Class } from "jassijs/remote/Jassi";
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
						header: ["${group1.name}","\n",""],
						expression: "city",
						footer: ["${sum(group1,'name')}","${group1.name}",""]
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
    { id: 1, customer: "Fred", city: "Frankfurt" },
    { id: 8, customer: "Alma", city: "Dresden" },
    { id: 3, customer: "Heinz", city: "Frankfurt" },
    { id: 2, customer: "Fred", city: "Frankfurt" },
    { id: 6, customer: "Max", city: "Dresden" },
    { id: 4, customer: "Heinz", city: "Frankfurt" },
    { id: 5, customer: "Max", city: "Dresden" },
    { id: 7, customer: "Alma", city: "Dresden" },
    { id: 9, customer: "Otto", city: "Berlin" }
];




export async function test() {
    // kk.o=0;
    var dlg: any = { reportdesign };
    dlg.value = sampleData;

    return dlg;
}
