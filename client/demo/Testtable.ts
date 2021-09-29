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
				body: [
					["www"],
					
				]
			}
		}
	],
	layout: {
		fillColor: function (rowIndex, node, columnIndex) {	
                return (rowIndex % 2 === 0) ? '#CCCCCC' : null;	
            }
	}
};




export async function test() {
	// kk.o=0;
	var dlg: any = { reportdesign };

	return dlg;
}
