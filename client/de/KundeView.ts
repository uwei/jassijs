import { Table } from "jassijs/ui/Table";
import { Button } from "jassijs/ui/Button";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Databinder } from "jassijs/ui/Databinder";
import { Textbox } from "jassijs/ui/Textbox";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";
import { Kunde } from "de/remote/Kunde";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
type Me = {
    textbox2?: Textbox;
    textbox1?: Textbox;
    textbox3?: Textbox;
    textbox4?: Textbox;
    textbox6?: Textbox;
    textbox5?: Textbox;
    textbox7?: Textbox;
} & DBObjectViewMe;
//;
@$DBObjectView({ classname: "de.Kunde" })
@$Class("de.KundeView")
export class KundeView extends DBObjectView {
    declare me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    declare value: Kunde;
    constructor() {
        super();
        //this.me = {}; is initialized in super
        this.layout(this.me);
    }
    /*async setdata() {
        var kunden = await Kunde.find()[2];

    }*/
    get title() {
        return this.value === undefined ? "Kunde" : "Kunde " + this.value.id;
    }
    layout(me: Me) {
        me.textbox2 = new Textbox();
        me.textbox1 = new Textbox();
        me.textbox3 = new Textbox();
        me.textbox4 = new Textbox();
        me.textbox6 = new Textbox();
        me.textbox5 = new Textbox();
        me.textbox7 = new Textbox();
        this.me.main.config({
            isAbsolute: true,
            width: "300",
            height: "300",
            children: [
                me.textbox2.config({
                    x: 5,
                    y: 0,
                    label: "Id",
                    width: 50,
                    bind: [me.databinder, "id"],
                    converter: new NumberConverter()
                }),
                me.textbox1.config({
                    x: 5,
                    y: 40,
                    label: "Vorname",
                    width: 95,
                    bind: [me.databinder, "vorname"],
                    style: {
                        color: "#3dbbac",
                    }
                }),
                me.textbox3.config({
                    x: 110,
                    y: 40,
                    label: "Nachname",
                    width: 120,
                    bind: [me.databinder, "nachname"]
                }),
                me.textbox4.config({
                    x: 5,
                    y: 100,
                    bind: [me.databinder, "strasse"],
                    label: "Straße",
                    width: 145
                }),
                me.textbox6.config({
                    x: 160,
                    y: 100,
                    label: "Hausnummer",
                    width: 70,
                    bind: [me.databinder, "hausnummer"]
                }),
                me.textbox5.config({
                    x: 5,
                    y: 155,
                    width: 55,
                    bind: [me.databinder, "PLZ"],
                    label: "PLZ"
                }),
                me.textbox7.config({
                    x: 75,
                    y: 155,
                    label: "Ort",
                    bind: [me.databinder, "ort"],
                    height: 15,
                    width: 155
                })
            ]
        });
    }
}
export async function test() {
    var v = new KundeView();
    var test = await Kunde.findOne(1);
    
    v.value = <Kunde>test;
    return v;
}
