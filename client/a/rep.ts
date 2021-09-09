import { ReportDesign } from "jassijs_report/ReportDesign";
import jassi from "jassijs/jassi";
import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassijs_report/RText";
var reportdesign= {
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
export class Rep  {
   reportdesign=reportdesign;
   
}
export async function test() {
    // kk.o=0;
    var dlg = new Rep();
    //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
    //	dlg.value=jassijs.db.load("de.Kunde",9);	
    //console.log(JSON.stringify(dlg.toJSON()));
    return dlg;
}
