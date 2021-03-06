import { Table } from "jassi/ui/Table";
import { Button } from "jassi/ui/Button";
import { NumberConverter } from "jassi/ui/converters/NumberConverter";
import { Databinder } from "jassi/ui/Databinder";
import { Textbox } from "jassi/ui/Textbox";
import { Panel } from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { $Class } from "jassi/remote/Jassi";
import { Kunde } from "de/remote/Kunde";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
type Me = {
    textbox1?: Textbox;
    textbox2?: Textbox;
    textbox3?: Textbox;
    textbox4?: Textbox;
    textbox5?: Textbox;
    textbox6?: Textbox;
    textbox7?: Textbox;
} & DBObjectViewMe;
//;
@$DBObjectView({ classname: "de.Kunde" })
@$Class("demo.KundeView")
export class KundeView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: Kunde;
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
        //this.setdata();
        me.textbox1 = new Textbox();
        me.textbox2 = new Textbox();
        me.textbox3 = new Textbox();
        me.textbox4 = new Textbox();
        me.textbox5 = new Textbox();
        me.textbox6 = new Textbox();
        me.textbox7 = new Textbox();
        me.main.isAbsolute = true;
        me.main.width = "300";
        me.main.height = "300";
        me.main.add(me.textbox2);
        me.main.add(me.textbox1);
        me.main.add(me.textbox3);
        me.main.add(me.databinder);
        me.main.add(me.textbox4);
        me.main.add(me.textbox6);
        me.main.add(me.textbox5);
        me.main.add(me.textbox7);
        me.textbox1.x = 15;
        me.textbox1.y = 70;
        me.textbox1.label = "Vorname";
        me.textbox1.width = 95;
        me.textbox1.bind(me.databinder, "vorname");
        me.textbox1.css({
            color: "#3dbbac",
        });
        me.textbox2.x = 15;
        me.textbox2.y = 25;
        me.textbox2.label = "Id";
        me.textbox2.width = 50;
        me.textbox2.bind(me.databinder, "id");
        me.textbox2.converter = new NumberConverter();
        me.textbox3.x = 125;
        me.textbox3.y = 70;
        me.textbox3.label = "Nachname";
        me.textbox3.width = 120;
        me.textbox3.bind(me.databinder, "nachname");
        me.textbox4.x = 15;
        me.textbox4.y = 110;
        me.textbox4.bind(me.databinder, "strasse");
        me.textbox4.label = "Straße";
        me.textbox4.width = 145;
        me.textbox5.x = 15;
        me.textbox5.y = 150;
        me.textbox5.width = 55;
        me.textbox5.bind(me.databinder, "PLZ");
        me.textbox5.label = "PLZ";
        me.textbox6.x = 170;
        me.textbox6.y = 110;
        me.textbox6.label = "Hausnummer";
        me.textbox6.width = 70;
        me.textbox6.bind(me.databinder, "hausnummer");
        me.textbox7.x = 80;
        me.textbox7.y = 150;
        me.textbox7.label = "Ort";
        me.textbox7.bind(me.databinder, "ort");
        me.textbox7.height = 15;
        me.textbox7.width = 165;
        me.toolbar.height = 30;
        this.add(me.main);
    }
}
export async function test() {
    var v = new KundeView();
    var test = await Kunde.findOne(1);
    v.value = <Kunde>test;
    return v;
}
