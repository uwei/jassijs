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
			table: {
				widths: [15,"auto",75,"auto"],
				body: [
					["d","qwr","ewr","\n"],
					["3","qwer","eee","\n"],
					["3","er","\n",""],
					["","wqe","",""]
				]
			}
		}
	]
};




export async function test() {
	// kk.o=0;
	var dlg: any = { reportdesign };

	return dlg;
}
