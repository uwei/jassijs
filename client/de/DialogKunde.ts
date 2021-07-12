import { Tree } from "jassijs/ui/Tree";
import { Panel } from "jassijs/ui/Panel";
import { Kunde } from "de/remote/Kunde";
import { ObjectChooser } from "jassijs/ui/ObjectChooser";
import { Databinder } from "jassijs/ui/Databinder";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Button } from "jassijs/ui/Button";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Textbox } from "jassijs/ui/Textbox";
import { Select } from "jassijs/ui/Select";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { Repeater } from "jassijs/ui/Repeater";
import { Table } from "jassijs/ui/Table";
import { Checkbox } from "jassijs/ui/Checkbox";
 
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { TestComponent } from "demo/TestComponent";
import { Property, $Property } from "jassijs/ui/Property";
import { router } from "jassijs/base/Router";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
type Me = {
    repeater1?: Repeater;
    textbox1?: Textbox; 
    textbox2?: Textbox;
    idtable?: Table;
    select1?: Select;
    button1?: Button;
    textbox3?: Textbox;
    idvorname?: Textbox;
    idnachname?: Textbox;
    [name: string]: any;
};
@$ActionProvider("jassijs.base.ActionNode")
@$Class("de.DialogKunde")
export class DialogKunde extends Panel {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    value: Kunde;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
     @$Action({
        name: "Demo",
        icon: "mdi mdi-television-play"
    })
    static async dummy() {
        
    }
    @$Action({
        name: "Demo/Kunden",
        icon: "mdi mdi-account"
    })
    static async showDialog() {
        router.navigate("#do=de.DialogKunde");
    }
    async setdata() {
        var kunden = await Kunde.find();
        //this.me.binder.toForm(kunde);
        this.me.idtable.items = kunden;
        this.me.select1.items = kunden;
    }
    get title() {
        return this.value === undefined ? "Kunde" : "Kunde " + this.value.id;
    }
    layout(me: Me) {
        var test = new Kunde();
        me.idvorname = new Textbox("red");
        me.idid = new Textbox();
        me.idnachname = new Textbox();
        me.objectchooser1 = new ObjectChooser();
        me.testcomponent1 = new TestComponent();
        me.IDBT5 = new Button();
        me.htmlpanel1 = new HTMLPanel();
        me.IDSave = new Button();
        me.select1 = new Select();
        me.boxpanel1 = new BoxPanel();
        me.IDBoxButton = new Button();
        me.textbox1 = new Textbox();
        me.repeater1 = new Repeater();
        this.isAbsolute = true;
        me.IDRose = new Button();
        me.binder = new Databinder();
        me.binder.definePropertyFor(this, "value");
        me.idvorname.x = 5;
        me.idvorname.y = 35;
        me.idvorname.bind(me.binder, "vorname");
        me.idvorname.width = 95;
        me.idvorname.autocommit = false;
        me.idvorname.label = "Vorname";
        me.idvorname.value = "<strong>formatierter</strong><br />HTML Text";
        this.add(me.idvorname);
        me.idid.x = 5;
        me.idid.y = 5;
        me.idid.bind(me.binder, "id");
        me.idid.width = 145;
        me.idid.converter = new NumberConverter();
        this.add(me.idid);
        me.idnachname.label = "Nachname";
        me.idnachname.y = 75;
        me.idnachname.x = 5;
        me.idnachname.bind(me.binder, "nachname");
        me.idnachname.width = 160;
        me.idnachname.autocommit = true;
        this.add(me.idnachname);
        me.idtable = new Table({
            cellDblClick: function (event: any, group: any) {
                alert(8);
            },
            movableColumns: false,
            dataTreeChildField: ""
        });
        /**/
        me.idtable.width = 275;
        me.idtable.height = 195;
       // me.idtable.selectComponent = me.binder;
        me.idtable.onchange(function (event) {
            //alert(event.item.vorname);
        });
        me.idtable.x = 5;
        me.idtable.y = 160;
        me.idtable.bind(me.binder, "this");
        me.idtable.autocommit = true;
        me.checkPanel = new Panel();
        me.checkPanel.height = 120;
        me.checkPanel.width = 165;
        this.add(me.checkPanel);
        me.IDCheckBox = new Checkbox();
        me.IDCheckBox.value = true;
        me.IDCheckBox.text = "Checkme";
        me.IDCheckBox.width = 95;
        me.checkPanel.add(me.IDCheckBox);
        me.checkPanel.add(me.IDRose);
        me.checkPanel.add(me.IDBT5);
        me.checkPanel.label = "relativer Panel";
        me.checkPanel.y = 1;
        me.checkPanel.x = 280;
        me.checkPanel.add(me.htmlpanel1);
        this.add(me.idtable);
        this.width = 598;
        this.height = 373;
        me.IDRose.text = "🌹";
        var _this = this;
        me.IDRose.onclick(function (event) {
            Kunde.find({ id: 4 }).then(function (kunde) {
                _this.value = kunde[0];
            });
        });
        this.add(me.IDSave);
        this.add(me.testcomponent1);
        this.add(me.objectchooser1);
        this.add(me.binder);
        me.objectchooser1.x = 10;
        me.objectchooser1.y = 130;
        me.objectchooser1.bind(me.binder, "this");
        me.objectchooser1.items = "de.Kunde";
        me.objectchooser1.height = 25;
        me.objectchooser1.width = 25;
        me.testcomponent1.x = 455;
        me.testcomponent1.y = 40;
        me.testcomponent1.width = 125;
        me.testcomponent1.height = 175;
        me.IDBT5.text = "5";
        me.IDBT5.height = 25;
        me.htmlpanel1.value = "<strong>formatierter</strong><br />HTML Text";
        me.htmlpanel1.height = 10;
        me.htmlpanel1.width = 85;
        me.IDSave.x = 180;
        me.IDSave.y = 10;
        me.IDSave.text = "Save";
        me.IDSave.onclick(function (event) {
            var ob = me.binder.fromForm();
            ob.save();
        });
        me.IDSave.icon = "mdi mdi-content-save";
        me.IDSave.width = 70;
        this.add(me.select1);
        me.select1.x = 40;
        me.select1.y = 130;
        me.select1.width = 195;
        me.select1.bind(me.binder, "this");
        me.select1.display = "nachname";
        me.select1.autocommit = true;
        this.add(me.boxpanel1);
        me.boxpanel1.x = 310;
        me.boxpanel1.y = 225;
        me.boxpanel1.width = 205;
        me.boxpanel1.height = 80;
        me.boxpanel1.horizontal = true;
        me.boxpanel1.add(me.textbox1);
        me.boxpanel1.add(me.IDBoxButton);
        me.boxpanel1.label = "horizontaler Boxpanel";
        me.IDBoxButton.text = "button";
        this.add(me.repeater1);
        me.repeater1.createRepeatingComponent(function (me: Me) {
            me.button1 = new Button();
            me.button1.text = "button";
            me.button1.onclick(function (event) {
                me.button1.text = me.idvorname.value + "" + me.textbox3.value;
            });
            me.button1.width = 65;
            me.textbox3 = new Textbox();
            me.textbox2 = new Textbox();
            me.textbox2.width = 40;
            me.textbox2.bind(me.repeater1.design.databinder, "strasse");
            me.textbox3.width = "38";
            me.textbox3.bind(me.repeater1.design.databinder, "id");
            me.repeater1.design.add(me.textbox2);
            me.repeater1.design.add(me.textbox3);
            me.repeater1.design.add(me.button1);
        });
        me.repeater1.bind(me.binder, "rechnungen");
        me.repeater1.x = 410;
        me.repeater1.y = 175;
        me.repeater1.label = "Repeater";
        me.textbox1.bind(me.binder, "nachname");
        me.textbox1.height = 15;
        me.testcomponent1.me.button4.text = "kk";
        this.setdata();
    }
}
export async function test() {
    var kd = (await Kunde.find({ id: 2 }))[0];
    var dlg = new DialogKunde();
    dlg.value = kd;
    return dlg;
}
