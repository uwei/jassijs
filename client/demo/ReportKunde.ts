import { ReportDesign } from "jassi_report/ReportDesign";
import jassi from "jassi/jassi";
import { $Class } from "jassi/remote/Jassi";
import { $Property } from "jassi/ui/Property";
import { $UIComponent } from "jassi/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassi_report/RText";
@$Class("demo.ReportKunde")
export class ReportKunde extends ReportDesign {
    me = {};
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: Kunde;
    constructor() {
        super();
        this.layout(this.me);
    }
    async setdata() {
    }
    get title() {
        return this.value === undefined ? "Kundenreport" : "Kundenreport " + this.value.id;
    }
    layout(me) {
        this.design = { "content": { "stack": [{ "text": "Hallo" }, { "text": "ok" }, { "columns": [{ "text": "text" }, { "text": "text" }] }] } };
    }
}
export async function test() {
    // kk.o=0;
    var dlg = new ReportKunde();
    //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
    //	dlg.value=jassi.db.load("de.Kunde",9);	
    //console.log(JSON.stringify(dlg.toJSON()));
    return dlg;
}
