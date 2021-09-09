import { ReportDesign } from "jassijs_report/ReportDesign";
import jassi from "jassijs/jassi";
import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassijs_report/RText";

var reportdesign = {
	content:  [
			"{{parameter.Datum}}",
			{
				table: {
					body: [
						[
							"Name",
							"Nachname"
						],
						{
							foreach: "kunde",
							do: [
								"{{kunde.name}}",
								"{{kunde.nachname}}"
							]
						}
					]
				}
			}
		]
};


@$Class("demo.ReportKunden")
export class ReportKunden {
    reportdesign = reportdesign;
	parameter;
    value;
    constructor() {

    }
  

}
export async function test() {
    // kk.o=0;
    var dlg = new ReportKunden();
	dlg.parameter={
		"Datum":"18.03.2021"
	};
    dlg.value = [{name:"Klaus",nachname:"Meier"},
                 {name:"Heinz",nachname:"Melzer"} ];
    //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
    //	dlg.value=jassijs.db.load("de.Kunde",9);	
    //console.log(JSON.stringify(dlg.toJSON()));
    return dlg;
}
