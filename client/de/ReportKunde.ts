import { ReportDesign } from "jassijs_report/ReportDesign";
import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";
import { Kunde } from "de/remote/Kunde";
var reportdesign = {
	content: [
			{
				text: "Hallo Herr ${nachname}"
			},
			{
				text: "ok"
			},
			{
				columns: [
					{
						text: "text"
					},
					{
						text: "text"
					}
				]
			}
		]
	
};
export { reportdesign };
@$Class("de.ReportKunde")
export class ReportKunde  {
    me = {};
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    value: Kunde;
    reportdesign=reportdesign;
    
    get title() {
        return this.value === undefined ? "Kundenreport" : "Kundenreport " + this.value.id;
    }
    fill(){

    }
}
export async function test() {
    var dlg = new ReportKunde();
    dlg.value=new Kunde();
	dlg.value.nachname="Klaus";

    return dlg;
}
