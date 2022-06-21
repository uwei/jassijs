import { ReportDesign } from "jassijs_report/ReportDesign";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/Component";
import { Kunde } from "de/remote/Kunde";
import { RText } from "jassijs_report/RText";
import {doGroup} from "jassijs_report/remote/pdfmakejassi";
var reportdesign = {
    content: [

        {
            table: {
                body: [
                    [{ text: "cvor" }, "vor"],
                    {
                        foreach: "group1 in entries",

                        do:
                        {
                            foreach: "group2 in group1.entries",
                            dofirst: [{ bold:true,text: "${group1.name}", colSpan: 2 }, "dd"],
                            do: {
                                foreach: "ar in group2.entries",
                                dofirst: [{ text: "${group2.name}", colSpan: 2 }, "dd"],
                                do: [
                                    "${ar.id}",
                                    "${ar.customer} from ${ar.city}"
                                ],
                                dolast: ["    Summe", "${group2.name}"],
                            },
                            dolast: ["group1footer", "footer"],
                        }

                    },
                    ["nach", "nach"]
                ]
            }
        },

    ]
};

var sampleData = [
    { id: 1, customer: "Fred", city: "Frankfurt" },
    { id: 8, customer: "Alma", city: "Dresden" },
    { id: 3, customer: "Heinz", city: "Frankfurt" },
    { id: 2, customer: "Fred", city: "Frankfurt" },
    { id: 6, customer: "Max", city: "Dresden" },
    { id: 4, customer: "Heinz", city: "Frankfurt" },
    { id: 5, customer: "Max", city: "Dresden" },
    { id: 7, customer: "Alma", city: "Dresden" },
    { id: 9, customer: "Otto", city: "Berlin" }
];




export async function test() {
    var test = doGroup(sampleData, ["city", "customer"]);
    console.log(JSON.stringify(test));
    // kk.o=0;
    var dlg: any = { reportdesign };
    dlg.value = test;

    return dlg;
}
