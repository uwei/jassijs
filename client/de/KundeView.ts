import { HTMLComponent } from "jassijs/ui/Component";
import { Table } from "jassijs/ui/Table";
import { Button } from "jassijs/ui/Button";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";

import { Textbox } from "jassijs/ui/Textbox";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";
import { Kunde } from "de/remote/Kunde";
import { DBObjectView,$DBObjectView, DBObjectViewToolbar } from "jassijs/ui/DBObjectView";
import { jc } from "jassijs/ui/Component";
//;
@$DBObjectView({ classname: "de.Kunde" })
@$Class("de.KundeView")
export class KundeView extends DBObjectView<Kunde> {
    /*async setdata() {
        var kunden = await Kunde.find()[2];

    }*/
    get title() {
        return this.value===undefined? "Kunde":"Kunde "+this.value.id;
    }
    render() {
        return (jc(Panel,{
            children: [
                jc(DBObjectViewToolbar,{ view: this }),
                jc(Textbox,{ label: "Id",bind: this.states.value.bind.id,converter: new NumberConverter() }),
                jc("br",{}),
                jc(Textbox,{ bind: this.states.value.bind.vorname,label: "Vorname" }),
                jc(Textbox,{ label: "Nachname",bind: this.states.value.bind.nachname }),
                jc("br",{}),
                jc(Textbox,{ bind: this.states.value.bind.strasse,label: "Straße" }),
                jc("br",{}),
                jc(Textbox,{ bind: this.states.value.bind.PLZ,label: "PLZ" }),
                jc(Textbox,{ bind: this.states.value.bind.ort,label: "Ort" }),
                jc("br",{ label: "" }),
                jc(Textbox,{ label: "Land",bind: this.states.value.bind.land })
            ]
        }));
    }
}
export async function test() {
    var t: Kunde=<any>await Kunde.findOne(1);
        var v = new KundeView({
            value: t
    });
        return v;
}
