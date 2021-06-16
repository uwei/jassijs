import { ReportDesign } from "jassijs_report/ReportDesign";

import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";
import { Kunde } from "de/remote/Kunde";
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
    var dlg = new ReportKunde();
    return dlg;
}
