import { Component,TextComponent } from "jassijs/ui/Component";

import { Panel,PanelProperties } from "jassijs/ui/Panel";
import { Kunde } from "de/remote/Kunde";

import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Button } from "jassijs/ui/Button";

import { Textbox } from "jassijs/ui/Textbox";
import { Select } from "jassijs/ui/Select";

import { $Class } from "jassijs/remote/Registry";

import { Property,$Property } from "jassijs/ui/Property";
import { router } from "jassijs/base/Router";
import { $Action,$ActionProvider } from "jassijs/base/Actions";
import { jc } from "jassijs/ui/Component";
interface KundeProperties extends PanelProperties {
    value?: Kunde;
    items?: Kunde[];
}
@$ActionProvider("jassijs.base.ActionNode")
@$Class("de.DialogKunde")
export class DialogKunde extends Panel<KundeProperties> {
    @$Property({ isUrlTag: true,id: true,editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    get value(): Kunde {
        return this.states.value.current;
    }
    set value(val: Kunde) {
        this.states.value.current=val;
    }
    set items(val: Kunde[]) {
        this.states.items.current=val;
    }
    @$Action({
        name: "Demo",
        icon: "mdi mdi-television-play"
    })
    render() {
        this.setdata();
        return jc(Panel,{
            children: [
                jc(Select,{ bind: this.states.value.bind,width: 500,items: this.states.items,display: "nachname" }),
                jc("br",{}),
                jc(Textbox,{
                    converter: new NumberConverter(),bind: this.states.value.bind.id,label: "Id"
                    
                }),
                jc(Textbox,{ bind: this.states.value.bind.vorname,label: "Vorname" }),
                jc(Textbox,{
                    bind: this.states.value.bind.nachname,label: "Nachname",
                }),
                jc(Button,{
                    text: "Save",onclick: async (event) => {
                        this.states.value.bind.$fromForm();
                        this.states.value.current.save();
                    }
                })
            ]
        });
    }
    @$Action({
        name: "Demo/Kunden",
        icon: "mdi mdi-account"
    })
    static async showDialog() {
        router.navigate("#do=de.DialogKunde");
    }
    async setdata() {
        var kunden=await Kunde.find();
        this.states.items.current=kunden;
    }
    get title() {
        return this.value===undefined? "Kunde":"Kunde "+this.value.id;
    }
   
}
class HH extends Component {
    kk="oo";
    hallo() {
        var h={
            oo: () => alert(this.kk)
        };
        return h;
    }
    render() {
        return jc("button",{
            onClick: () => {
                debugger;
                var h=this;
            }
        });
    }
    ;
}
export async function test() {
    var kunden=await Kunde.find();

    var dlg=new DialogKunde({
        value: kunden[0],
        items: kunden
    });
    return dlg;

}
