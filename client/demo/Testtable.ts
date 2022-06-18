import { ReportDesign } from "jassijs_report/ReportDesign";
import jassi from "jassijs/jassi";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassijs_report/RText";
//height=50 -> gilt für alle und height=function()

var reportdesign = {
	content: [
		{
			table: {
				heights: 50,
				body: [
					["sssd","ssqwr","ewr","\n","\n"],
					["","","","",""],
					["3","qwer","reee","\n","\n"],
					["sdfsdf","df","sdf","",""]
				]
			},
			layout: {
				hLineWidth: function (i, node) {	
                        return (i === 1 ? 2 : 0); //(i === 0 || i === node.table.body.length) ? 4 : 1;		
                    },
				vLineWidth: function (i, node) {	
                        return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;		
                    }
			}
		}
	]
};




export async function test() {
	// kk.o=0;
	var dlg: any = { reportdesign };

	return dlg;
}
