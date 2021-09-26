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
					['Column 1', 'Column 2', 'Column 3'],
					['One value goes here', 'Another one here', 'OK?']
				]
			}
		},

    ]
};




export async function test() {
    // kk.o=0;
    var dlg: any = { reportdesign };
 
    return dlg;
}
