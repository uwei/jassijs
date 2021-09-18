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
                body: [
                    [{text:"vor"},"vor"],
                    {
                        foreach: "line in invoice.lines",
                        do: 
                             {
                                foreach: "uline2 in line.ulines",
                                dofirst:[{text:"groupheader",colSpan:2},"dd"],
                                do: [
                                    "${uline2.text}",
                                    "${uline2.price}"
                                ],
                                dolast:["groupfooter","footer"],
                            }
                       
                    },
                    ["nach","nach"]
                ]
            }
        },

    ]
};




export async function test() {
    // kk.o=0;
    var dlg: any = { reportdesign };
    dlg.value = {
        invoice: {
            name:"hh",
            lines: [
                {
                    text: "text1",
                    price: 10,
                    ulines: [{ text: "a1", price: 1 },
                    { text: "a2", price: 2 }]
                },
                {
                    text: "test2",
                    ulines: [{ text: "a3", price: 3}]
                },/*
                {
                    text: "this is an other position",
                    price: 19.5
                },
                {
                    text: "this is the last position",
                    price: 50
                }*/
            ]
        }
    };
    return dlg;
}

    /*
    String.prototype.interpolate = function(params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${this}\`;`)(...vals);
}

    var s=`${dlg.value.invoice.lines.map((item, i) => `
      T: ${item.text}.
            ${item.ulines.map((item2) => `
                UT: ${item2.text}.
       
            `).join('')}
        
  `).join('')}
`;
    s=`${dlg.value.invoice.lines.map((item, i) => `T: ${item.text}`).join('')}`;
 //   console.log(s);

    String.prototype.interpolate = function(params) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${this}\`;`)(...vals);
}

let template = 'Example text: ${dlg.value.invoice.name}';
template="${dlg.value.invoice.lines.map((item, i) => `T: ${item.text}`).join('')}";
template="${dlg.value.invoice.lines.map((item, i) => ` T: ${item.text}.            ${item.ulines.map((item2) => `                UT: ${item2.text}.                   `).join('')}          `).join('')}";
const result = template.interpolate({
  dlg: dlg
});
console.log(result);*/

    //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
    //	dlg.value=jassijs.db.load("de.Kunde",9);	
    //console.log(JSON.stringify(dlg.toJSON()));
 //   return dlg;
