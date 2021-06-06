var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "de/remote/Kunde", "jassijs/ui/ObjectChooser", "jassijs/ui/Databinder", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Button", "jassijs/ui/HTMLPanel", "jassijs/ui/Textbox", "jassijs/ui/Select", "jassijs/ui/BoxPanel", "jassijs/ui/Repeater", "jassijs/ui/Table", "jassijs/ui/Checkbox", "jassijs/remote/Jassi", "demo/TestComponent", "jassijs/ui/Property", "jassijs/base/Router", "jassijs/base/Actions"], function (require, exports, Panel_1, Kunde_1, ObjectChooser_1, Databinder_1, NumberConverter_1, Button_1, HTMLPanel_1, Textbox_1, Select_1, BoxPanel_1, Repeater_1, Table_1, Checkbox_1, jassijs_1, TestComponent_1, Property_1, Router_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DialogKunde = void 0;
    let DialogKunde = class DialogKunde extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        static async showDialog() {
            Router_1.router.navigate("#do=de.DialogKunde");
        }
        async setdata() {
            var kunden = await Kunde_1.Kunde.find();
            //this.me.binder.toForm(kunde);
            this.me.idtable.items = kunden;
            this.me.select1.items = kunden;
        }
        get title() {
            return this.value === undefined ? "Kunde" : "Kunde " + this.value.id;
        }
        layout(me) {
            var test = new Kunde_1.Kunde();
            me.idvorname = new Textbox_1.Textbox("red");
            me.idid = new Textbox_1.Textbox();
            me.idnachname = new Textbox_1.Textbox();
            me.objectchooser1 = new ObjectChooser_1.ObjectChooser();
            me.testcomponent1 = new TestComponent_1.TestComponent();
            me.IDBT5 = new Button_1.Button();
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.IDSave = new Button_1.Button();
            me.select1 = new Select_1.Select();
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.IDBoxButton = new Button_1.Button();
            me.textbox1 = new Textbox_1.Textbox();
            me.repeater1 = new Repeater_1.Repeater();
            this.isAbsolute = true;
            me.IDRose = new Button_1.Button();
            me.binder = new Databinder_1.Databinder();
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
            me.idid.converter = new NumberConverter_1.NumberConverter();
            this.add(me.idid);
            me.idnachname.label = "Nachname";
            me.idnachname.y = 75;
            me.idnachname.x = 5;
            me.idnachname.bind(me.binder, "nachname");
            me.idnachname.width = 160;
            me.idnachname.autocommit = true;
            this.add(me.idnachname);
            me.idtable = new Table_1.Table({
                cellDblClick: function (event, group) {
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
            me.checkPanel = new Panel_1.Panel();
            me.checkPanel.height = 120;
            me.checkPanel.width = 165;
            this.add(me.checkPanel);
            me.IDCheckBox = new Checkbox_1.Checkbox();
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
                Kunde_1.Kunde.find({ id: 4 }).then(function (kunde) {
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
            me.repeater1.createRepeatingComponent(function (me) {
                me.button1 = new Button_1.Button();
                me.button1.text = "button";
                me.button1.onclick(function (event) {
                    me.button1.text = me.idvorname.value + "" + me.textbox3.value;
                });
                me.button1.width = 65;
                me.textbox3 = new Textbox_1.Textbox();
                me.textbox2 = new Textbox_1.Textbox();
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
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Kunde_1.Kunde)
    ], DialogKunde.prototype, "value", void 0);
    __decorate([
        Actions_1.$Action({
            name: "Demo/Kunden",
            icon: "mdi mdi-account"
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DialogKunde, "showDialog", null);
    DialogKunde = __decorate([
        Actions_1.$ActionProvider("jassijs.base.ActionNode"),
        jassijs_1.$Class("de.DialogKunde"),
        __metadata("design:paramtypes", [])
    ], DialogKunde);
    exports.DialogKunde = DialogKunde;
    async function test() {
        var kd = (await Kunde_1.Kunde.find({ id: 2 }))[0];
        var dlg = new DialogKunde();
        dlg.value = kd;
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=DialogKunde.js.map
//# sourceMappingURL=DialogKunde.js.map