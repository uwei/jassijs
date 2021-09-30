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
				widths: ["auto",50,"auto","auto"],
				body: [
					["d","\n","",""],
					["3","","",""],
					["3","","",""],
					["","","",""]
				]
			},
			layout: {
				fillColor: function (rowIndex, node, columnIndex) {	
                        return (rowIndex % 2 === 0) ? 'yellow' : null;	
                    },
				hLineWidth: function (i, node) {	
                        return (i === 0 || i === node.table.body.length) ? 4 : 1;	
                    },
				vLineWidth: function (i, node) {	
                        return (i === 0 || i === node.table.widths.length) ? 4 : 1;	
                    },
				hLineColor: function (i, node) {	
                        return (i === 0 || i === node.table.body.length) ? 'black' : 'red';	
                    },
				vLineColor: function (i, node) {	
                        return (i === 0 || i === node.table.widths.length) ? 'blue' : 'green';	
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
