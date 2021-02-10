import { ReportDesign } from "jassi_report/ReportDesign";
import jassi from "jassi/jassi";
import { $Class } from "remote/jassi/base/Jassi";
import { $Property } from "jassi/ui/Property";
import { $UIComponent } from "jassi/ui/Component";
import { Kunde } from "remote/de/Kunde";
import { RText } from "jassi_report/RText";
export class Rep extends ReportDesign {
    me = {};
    constructor() {
        super();
        this.layout(this.me);
    }
    async setdata() {
    }
    layout(me) {
        this.design = {
            content: {
                stack: [
                    {
                        text: "Das ist der Titel",
                        bold: true
                    },
                    {
                        text: [
                            {
                                text: " "
                            }
                        ],
                        editTogether: true
                    },
                    {
                        text: "Hallo"
                    }
                ]
            }
        };
    }
}
export async function test() {
    // kk.o=0;
    var dlg = new Rep();
    //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
    //	dlg.value=jassi.db.load("de.Kunde",9);	
    //console.log(JSON.stringify(dlg.toJSON()));
    return dlg;
}
