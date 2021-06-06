import { ReportDesign } from "jassijs_report/ReportDesign";
import jassi from "jassijs/jassi";
import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassijs_report/RText";
@$Class("demo.ReportKunde")
export class ReportKunde extends ReportDesign {
    me = {};
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
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
    //	dlg.value=jassijs.db.load("de.Kunde",9);	
    //console.log(JSON.stringify(dlg.toJSON()));
    return dlg;
}
