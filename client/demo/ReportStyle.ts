import { ReportDesign } from "jassijs_report/ReportDesign";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassijs_report/RText";

var reportdesign = {
	defaultStyle: {italics: true},
	styles: {
		header: {bold: true,fontSize: 22},
		underline: {decoration: "underline"}
	},
	content: [
		{style: "header",text: "The Header"},
		{
			columns: [
				{width: 215,stack: ["firstname lastname","street","place"]},
				{
					width: 245,
					style: "underline",
					stack: [
						{fontSize: 18,text: "Invoice"},
						"\n",
						"Date: ",
						"Number: "
					]
				}
			]
		},
		{
			table: {body: [["Item","Price"],["hh","999"]]}
		}
	]
};


export async function test() {
    
   
    // kk.o=0;
    return {
        reportdesign: reportdesign
    }
}
