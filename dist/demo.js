var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("demo/DBTest", ["require", "exports", "de/remote/AR", "de/remote/Kunde", "de/remote/ARZeile"], function (require, exports, AR_1, Kunde_1, ARZeile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test3 = exports.test2 = exports.test4 = void 0;
    async function test4() {
        //await Kunde.sample();
        var ar = (await AR_1.AR.find({ id: 900 }))[0];
        var kunde = (await Kunde_1.Kunde.find({ id: 5 }))[0];
        ar.kunde = kunde;
        ar.save();
        var zeile = (await ARZeile_1.ARZeile.find({ id: 5 }))[0];
        zeile.ar = ar;
        zeile.position = 50;
        zeile.text = "kk2k";
        zeile.save();
    }
    exports.test4 = test4;
    ;
    async function test2() {
        //await Kunde.sample();
        var all = await Kunde_1.Kunde.find({ id: 5 });
        var k = all[0];
        k.id = 5;
        k.vorname = "Markus";
        k.nachname = "Beier";
        k.ort = "Mainz";
        k.PLZ = "99992";
        try {
            debugger;
            await k.save();
        }
        catch (ex) {
            debugger;
        }
        //	new de.Kunde().generate();
        //jassi.db.uploadType(de.Kunde);
    }
    exports.test2 = test2;
    ;
    async function test3() {
        var all = await AR_1.AR.find();
        var z = (await AR_1.AR.find({ id: 902 }))[0];
        //console.log(z.nummer++);
        z.save();
        var kd = (await Kunde_1.Kunde.find({ id: 4 }))[0];
        kd.extField = "yes";
        kd.save();
    }
    exports.test3 = test3;
});
define("demo/DK", ["require", "exports", "jassi/ui/Table", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Textbox", "jassi_localserver/Filesystem"], function (require, exports, Table_1, Jassi_1, Panel_1, Textbox_1, Filesystem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DK = void 0;
    var g = Filesystem_1.default;
    debugger;
    let DK = class DK extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.textbox1 = new Textbox_1.Textbox();
            me.table1 = new Table_1.Table();
            this.width = 459;
            this.height = 264;
            this.isAbsolute = true;
            this.add(me.textbox1);
            this.add(me.table1);
            me.textbox1.x = 97;
            me.textbox1.y = 26;
            me.textbox1.width = 245;
            me.table1.x = 325;
            me.table1.y = 100;
            me.table1.width = 125;
            /*	me.table1.setProperties(			{
                      "reorderColumns": false,
                      "multiSelect": true,
                      "show": {
                            "toolbar": true
                      }
                });*/
        }
    };
    DK = __decorate([
        Jassi_1.$Class("demo.DK"),
        __metadata("design:paramtypes", [])
    ], DK);
    exports.DK = DK;
    async function test() {
        var dlg = new DK();
        return dlg;
    }
    exports.test = test;
});
define("demo/Dialog", ["require", "exports", "jassi/ui/Button", "jassi/ui/BoxPanel", "jassi/remote/Jassi", "jassi/ui/Panel"], function (require, exports, Button_1, BoxPanel_1, Jassi_2, Panel_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog = void 0;
    let Dialog = class Dialog extends Panel_2.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.button1 = new Button_1.Button();
            me.button2 = new Button_1.Button();
            me.boxpanel1.add(me.button1);
            me.boxpanel1.add(me.button2);
            me.boxpanel1.spliter = [60, 40];
            me.button1.text = "button";
            me.button2.text = "button";
            this.add(me.boxpanel1);
        }
    };
    Dialog = __decorate([
        Jassi_2.$Class("demo/Dialog"),
        __metadata("design:paramtypes", [])
    ], Dialog);
    exports.Dialog = Dialog;
    async function test() {
        var ret = new Dialog();
        return ret;
    }
    exports.test = test;
});
define("demo/DialogKunde2", ["require", "exports", "jassi/ui/Panel", "jassi/ui/HTMLPanel", "jassi/ui/Textbox", "jassi/ui/Button", "jassi/ui/BoxPanel", "jassi/remote/Jassi"], function (require, exports, Panel_3, HTMLPanel_1, Textbox_2, Button_2, BoxPanel_2, Jassi_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DialogKunde2 = void 0;
    let DialogKunde2 = class DialogKunde2 extends Panel_3.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        async setdata() {
        }
        layout(me) {
            me.panel1 = new HTMLPanel_1.HTMLPanel();
            me.textbox1 = new Textbox_2.Textbox();
            me.textbox2 = new Textbox_2.Textbox();
            me.button1 = new Button_2.Button();
            me.button2 = new Button_2.Button();
            me.textbox3 = new Textbox_2.Textbox();
            me.button3 = new Button_2.Button();
            me.panel2 = new Panel_3.Panel();
            me.panel3 = new Panel_3.Panel();
            me.button4 = new Button_2.Button();
            me.textbox1 = new Textbox_2.Textbox();
            me.button1 = new Button_2.Button();
            me.boxpanel1 = new BoxPanel_2.BoxPanel();
            me.button2 = new Button_2.Button();
            me.button3 = new Button_2.Button();
            me.button4 = new Button_2.Button();
            me.button5 = new Button_2.Button();
            me.button6 = new Button_2.Button();
            this.add(me.textbox2);
            this.add(me.textbox1);
            this.add(me.button3);
            //  this.panel1.htmltext="Hallo";
            this.add(me.textbox1);
            this.add(me.textbox3);
            this.add(me.boxpanel1);
            this.add(me.button1);
            this.add(me.panel2);
            this.add(me.panel3);
            this.add(me.button4);
            this.add(me.button6);
            me.button2.text = "rrrr";
            me.button2.x = 45;
            me.button2.y = 70;
            me.button1.text = "dg1";
            me.button1.label = "sss";
            me.button1.height = "95";
            me.button3.text = "ddd";
            me.textbox3.width = 45;
            me.panel2.height = 235;
            me.panel2.width = 305;
            me.panel2.isAbsolute = false;
            me.panel3.height = 100;
            me.panel3.width = 315;
            me.panel3.isAbsolute = true;
            me.panel3.add(me.button4);
            me.button4.height = 25;
            me.button4.width = 120;
            me.button4.text = "ssss";
            me.button4.x = 155;
            me.button4.y = 65;
            me.textbox1.width = 85;
            me.button1.text = "rr";
            me.button1.onclick(function (event) {
                me.button1.text = "oo";
            });
            me.textbox2.height = 15;
            me.boxpanel1.add(me.button1);
            me.boxpanel1.height = "200";
            me.boxpanel1.horizontal = false;
            me.boxpanel1.width = "300";
            me.boxpanel1.add(me.button2);
            me.boxpanel1.add(me.button3);
            me.boxpanel1.add(me.button5);
            me.button3.text = "asdfasdf";
            me.button3.height = 50;
            me.button2.text = "asdfasdf";
            me.button2.height = "100%";
            me.button2.width = "80";
            me.button5.width = 170;
            me.button5.text = "sdf";
            me.button4.text = "dddd";
            me.button6.text = "3";
            me.button6.width = 55;
        }
    };
    DialogKunde2 = __decorate([
        Jassi_3.$Class("demo.DialogKunde2"),
        __metadata("design:paramtypes", [])
    ], DialogKunde2);
    exports.DialogKunde2 = DialogKunde2;
    function test() {
        // kk.o=0;
        return new DialogKunde2();
    }
    exports.test = test;
});
define("demo/EmptyDialog", ["require", "exports", "jassi/ui/Button", "jassi/ui/Repeater", "jassi/remote/Jassi", "jassi/ui/Panel"], function (require, exports, Button_3, Repeater_1, Jassi_4, Panel_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.EmptyDialog = void 0;
    let EmptyDialog = class EmptyDialog extends Panel_4.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.repeater1 = new Repeater_1.Repeater();
            this.add(me.repeater1);
            me.repeater1.createRepeatingComponent(function (databinder1) {
                me.button1 = new Button_3.Button();
                me.repeater1.design.add(me.button1);
            });
        }
    };
    EmptyDialog = __decorate([
        Jassi_4.$Class("demo.EmptyDialog"),
        __metadata("design:paramtypes", [])
    ], EmptyDialog);
    exports.EmptyDialog = EmptyDialog;
    async function test() {
        var ret = new EmptyDialog();
        return ret;
    }
    exports.test = test;
});
define("demo/KundeView", ["require", "exports", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/ui/Property", "jassi/remote/Jassi", "de/remote/Kunde", "jassi/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_3, Property_1, Jassi_5, Kunde_2, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.KundeView = void 0;
    //;
    let KundeView = class KundeView extends DBObjectView_1.DBObjectView {
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
        layout(me) {
            //this.setdata();
            me.textbox1 = new Textbox_3.Textbox();
            me.textbox2 = new Textbox_3.Textbox();
            me.textbox3 = new Textbox_3.Textbox();
            me.textbox4 = new Textbox_3.Textbox();
            me.textbox5 = new Textbox_3.Textbox();
            me.textbox6 = new Textbox_3.Textbox();
            me.textbox7 = new Textbox_3.Textbox();
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
            me.textbox2.converter = new NumberConverter_1.NumberConverter();
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
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Kunde_2.Kunde !== "undefined" && Kunde_2.Kunde) === "function" ? _a : Object)
    ], KundeView.prototype, "value", void 0);
    KundeView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "de.Kunde" }),
        Jassi_5.$Class("demo.KundeView"),
        __metadata("design:paramtypes", [])
    ], KundeView);
    exports.KundeView = KundeView;
    async function test() {
        var v = new KundeView();
        var test = await Kunde_2.Kunde.findOne(1);
        v.value = test;
        return v;
    }
    exports.test = test;
});
define("demo/MemoryTest", ["require", "exports", "jassi/remote/Server", "jassi/util/Reloader", "jassi/remote/Registry"], function (require, exports, Server_1, Reloader_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MemoryTest = void 0;
    function test() {
        let j = new Promise((resolve_1, reject_1) => { require(["demo/DK"], resolve_1, reject_1); });
        // let dk=new DK();
        // dk.destroy();
    }
    test();
    class MemoryTest {
        async MemoryTest() {
            let server = new Server_1.Server();
            let test = await server.loadFile("demo/DK.ts");
            await server.saveFile("demo/DK.ts", test);
            await new Reloader_1.Reloader().reloadJS("demo/DK.js");
            delete Registry_1.default.data["$Class"]["demo.DK"];
            requirejs.undef("demo/DK.js");
            requirejs.undef("demo/DK");
        }
    }
    exports.MemoryTest = MemoryTest;
});
define("demo/ParentRightCheck", ["require", "exports", "jassi/remote/security/Group", "jassi/remote/security/User", "de/remote/ARZeile", "de/remote/Kunde", "de/remote/AR", "jassi/remote/Registry", "jassi/remote/RemoteProtocol", "jassi/remote/DBObject", "jassi/remote/security/ParentRight"], function (require, exports, Group_1, User_1, ARZeile_2, Kunde_3, AR_2, Registry_2, RemoteProtocol_1, DBObject_1, ParentRight_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function freeNumber(cl) {
        var max = 1000000;
        var c = DBObject_1.DBObject["cache"];
        var num = Math.floor(Math.random() * Math.floor(1000000));
        var ob = await cl.findOne(num);
        while (ob !== undefined) {
            num = Math.floor(Math.random() * Math.floor(1000000));
            ob = await cl.find(num);
        }
        return num;
    }
    async function test(tst) {
        await RemoteProtocol_1.RemoteProtocol.simulateUser();
        //$.removeCookie("openedwindows", {})
        try {
            var kdid = await freeNumber(Kunde_3.Kunde);
            var kd = new Kunde_3.Kunde();
            kd.id = kdid;
            kd.nachname = "Nachname";
            kd.vorname = "Vorname";
            await kd.save();
            var kd5 = new Kunde_3.Kunde();
            kd5.id = await freeNumber(Kunde_3.Kunde);
            kd5.nachname = "Nachname";
            kd5.vorname = "Vorname";
            await kd5.save();
            //cache an reload
            var kd3 = await Kunde_3.Kunde.findOne(kdid);
            var kd2 = await Kunde_3.Kunde.findOne(kdid);
            tst.expectEqual(kd2 === kd3);
            //test removefromCache
            kd2.removeFromCache();
            kd2 = await Kunde_3.Kunde.findOne(kdid);
            tst.expectEqual(kd !== kd2);
            var ar = new AR_2.AR();
            ar.id = 8544 + Number(Registry_2.default.nextID());
            ar.kunde = kd;
            await ar.save();
            var z = new ARZeile_2.ARZeile();
            z.text = "w";
            z.position = 3;
            z.ar = ar;
            await z.save();
            //Load relations
            var arw = await ARZeile_2.ARZeile.findOne({ id: z.id, relations: ["ar.kunde"] });
            tst.expectEqual(arw.ar.kunde.nachname === kd.nachname);
            //wrong relation
            tst.expectError(async () => { await ARZeile_2.ARZeile.findOne({ id: z.id, relations: ["sdafsd"] }); });
            //User
            var user = new User_1.User();
            user.email = "mail" + await freeNumber(User_1.User);
            user.password = "hallo";
            await user.save();
            var group = new Group_1.Group();
            group.id = await freeNumber(Group_1.Group);
            group.name = "Group";
            await group.save();
            user.groups = [group];
            await user.save();
            var sec = new ParentRight_1.ParentRight();
            sec.classname = "de.Kunde";
            sec.name = "Kundennummern";
            sec.i1 = kdid;
            sec.i2 = kdid;
            sec.groups = [group];
            await sec.save();
            await RemoteProtocol_1.RemoteProtocol.simulateUser(user.email, user.password);
            var kunden = await Kunde_3.Kunde.find();
            tst.expectEqual(kunden.length === 1);
            await RemoteProtocol_1.RemoteProtocol.simulateUser();
            kunden = await Kunde_3.Kunde.find();
            tst.expectEqual(kunden.length > 1);
        }
        catch (err) {
            throw err;
        }
        finally {
            if (sec)
                await sec.remove();
            if (user)
                await user.remove();
            if (group)
                await group.remove();
            if (arw)
                await arw.remove();
            if (ar)
                await ar.remove();
            if (kd)
                await kd.remove();
            if (kd5)
                await kd5.remove();
        }
        console.log("ready");
    }
    exports.test = test;
});
define("demo/ReportKunde", ["require", "exports", "jassi_report/ReportDesign", "jassi/remote/Jassi", "jassi/ui/Property", "de/remote/Kunde"], function (require, exports, ReportDesign_1, Jassi_6, Property_2, Kunde_4) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportKunde = void 0;
    let ReportKunde = class ReportKunde extends ReportDesign_1.ReportDesign {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        async setdata() {
        }
        get title() {
            return this.value === undefined ? "Kundenreport" : "Kundenreport " + this.value.id;
        }
        layout(me) {
            this.design = { "content": { "stack": [{ "text": "Hallo" }, { "text": "ok" }, { "columns": [{ "text": "text" }, { "text": "text" }] }] } };
        }
    };
    __decorate([
        Property_2.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Kunde_4.Kunde !== "undefined" && Kunde_4.Kunde) === "function" ? _a : Object)
    ], ReportKunde.prototype, "value", void 0);
    ReportKunde = __decorate([
        Jassi_6.$Class("demo.ReportKunde"),
        __metadata("design:paramtypes", [])
    ], ReportKunde);
    exports.ReportKunde = ReportKunde;
    async function test() {
        // kk.o=0;
        var dlg = new ReportKunde();
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassi.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
define("demo/ReportRechnung", ["require", "exports", "jassi_report/ReportDesign", "jassi/remote/Jassi", "jassi/ui/Property", "de/remote/Kunde"], function (require, exports, ReportDesign_2, Jassi_7, Property_3, Kunde_5) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportRechnung = void 0;
    let ReportRechnung = class ReportRechnung extends ReportDesign_2.ReportDesign {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        async setdata() {
        }
        get title() {
            return this.value === undefined ? "Kundenreport" : "Kundenreport " + this.value.id;
        }
        layout(me) {
            this.design = {
                content: {
                    stack: [
                        {
                            columns: [
                                {
                                    stack: [
                                        {
                                            text: "{{invoice.customer.firstname}} {{invoice.customer.lastname}}"
                                        },
                                        {
                                            text: "{{invoice.customer.street}}"
                                        },
                                        {
                                            text: "{{invoice.customer.place}}"
                                        }
                                    ]
                                },
                                {
                                    stack: [
                                        {
                                            text: "Invoice",
                                            fontSize: 18
                                        },
                                        {
                                            text: "<br>"
                                        },
                                        {
                                            text: "Date: {{invoice.date}}"
                                        },
                                        {
                                            text: "Number: {{invoice.number}}",
                                            bold: true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            table: {
                                body: [
                                    [
                                        "Item",
                                        "Price"
                                    ],
                                    {
                                        foreach: "line in invoice.lines",
                                        do: [
                                            "{{line.text}}",
                                            "{{line.price}}"
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            text: "<br>"
                        },
                        {
                            foreach: "sum in invoice.summary",
                            do: {
                                columns: [
                                    {
                                        text: "{{sum.text}}"
                                    },
                                    {
                                        text: "{{sum.value}}"
                                    }
                                ]
                            }
                        }
                    ]
                },
                data: {
                    invoice: {
                        number: 1000,
                        date: "20.07.2018",
                        customer: {
                            firstname: "Henry",
                            lastname: "Klaus",
                            street: "Hauptstr. 157",
                            place: "chemnitz"
                        },
                        lines: [
                            {
                                pos: 1,
                                text: "this is the first position, lksjdflgsd er we wer wre er er er re wekfgjslkdfjjdk sgfsdg",
                                price: 10,
                                amount: 50,
                                variante: [
                                    {
                                        m: 1
                                    },
                                    {
                                        m: 2
                                    }
                                ]
                            },
                            {
                                pos: 2,
                                text: "this is the next position",
                                price: 20.5
                            },
                            {
                                pos: 3,
                                text: "this is an other position",
                                price: 19.5
                            },
                            {
                                pos: 4,
                                text: "this is the last position",
                                price: 50
                            }
                        ],
                        summary: [
                            {
                                text: "Subtotal",
                                value: 100
                            },
                            {
                                text: "Tax",
                                value: 19
                            },
                            {
                                text: "Subtotal",
                                value: 119
                            }
                        ]
                    }
                }
            };
        }
    };
    __decorate([
        Property_3.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Kunde_5.Kunde !== "undefined" && Kunde_5.Kunde) === "function" ? _a : Object)
    ], ReportRechnung.prototype, "value", void 0);
    ReportRechnung = __decorate([
        Jassi_7.$Class("demo.ReportRechnung"),
        __metadata("design:paramtypes", [])
    ], ReportRechnung);
    exports.ReportRechnung = ReportRechnung;
    async function test() {
        // kk.o=0;
        var dlg = new ReportRechnung();
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassi.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
define("demo/StyleDialog", ["require", "exports", "jassi/ui/Style", "jassi/ui/Button", "jassi/remote/Jassi", "jassi/ui/Panel"], function (require, exports, Style_1, Button_4, Jassi_8, Panel_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.StyleDialog = void 0;
    let StyleDialog = class StyleDialog extends Panel_5.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.button1 = new Button_4.Button();
            me.button2 = new Button_4.Button();
            me.style1 = new Style_1.Style();
            me.style2 = new Style_1.Style();
            me.style3 = new Style_1.Style();
            this.add(me.button1);
            this.add(me.button2);
            this.add(me.style1);
            this.add(me.style2);
            this.add(me.style3);
            me.button1.text = "button";
            me.button2.text = "button";
        }
    };
    StyleDialog = __decorate([
        Jassi_8.$Class("demo/StyleDialog"),
        __metadata("design:paramtypes", [])
    ], StyleDialog);
    exports.StyleDialog = StyleDialog;
    async function test() {
        var ret = new StyleDialog();
        return ret;
    }
    exports.test = test;
});
define("demo/TableContextmenu", ["require", "exports", "jassi/ui/ContextMenu", "jassi/ui/MenuItem", "jassi/ui/Table"], function (require, exports, ContextMenu_1, MenuItem_1, Table_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test() {
        var tab = new Table_2.Table({
            movableColumns: true,
            rowDblClick: function () {
                debugger;
                tab.table.setFilter(data => {
                    return data.name === "Mary May";
                }); //rowManager.setActiveRows([tab.table.rowManager.rows[0]]);
                // tab.table.redraw();     
            }
        });
        tab.width = 400;
        var contextmenu = new ContextMenu_1.ContextMenu();
        tab.contextMenu = contextmenu;
        var menu = new MenuItem_1.MenuItem();
        menu.text = "static menu";
        menu.onclick(function (ob) {
            alert(contextmenu.value[0].name + "clicked");
        });
        contextmenu.menu.add(menu);
        contextmenu.getActions = async function (obs) {
            return [{ name: "custom Action", call: function (data) {
                        alert(data[0].name);
                    } }];
        };
        var tabledata = [
            { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
            { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
            { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
            { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
            { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
        ];
        tab.items = tabledata;
        tab.selectComponent = { value: "" };
        tab.showSearchbox = true;
        //    var kunden = await jassi.db.load("de.Kunde");
        //   tab.items = kunden;
        return tab;
    }
    exports.test = test;
});
define("demo/TestComponent", ["require", "exports", "jassi/ui/Panel", "jassi/ui/Button", "jassi/ui/HTMLPanel", "jassi/remote/Jassi", "jassi/ui/Component"], function (require, exports, Panel_6, Button_5, HTMLPanel_2, Jassi_9, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestComponent = void 0;
    let TestComponent = class TestComponent extends Panel_6.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        async setdata() {
        }
        get title() {
            return "TestComponent ";
        }
        layout(me) {
            me.button1 = new Button_5.Button();
            me.htmlpanel1 = new HTMLPanel_2.HTMLPanel();
            me.button2 = new Button_5.Button();
            me.htmlpanel2 = new HTMLPanel_2.HTMLPanel();
            me.panel2 = new Panel_6.Panel();
            me.button3 = new Button_5.Button();
            me.button4 = new Button_5.Button();
            this.add(me.button2);
            this.add(me.button1);
            this.add(me.htmlpanel2);
            this.add(me.htmlpanel1);
            this.add(me.panel2);
            //this.value="rrr";
            me.button1.text = "ende";
            me.htmlpanel1.value = "Test";
            me.htmlpanel1.width = 25;
            me.button2.text = "start";
            me.htmlpanel2.text = "rrrere";
            me.htmlpanel2.width = 85;
            me.panel2.width = "100";
            me.panel2.height = "100";
            me.panel2.isAbsolute = true;
            me.panel2.add(me.button4);
            me.panel2.add(me.button3);
            me.button4.text = "Test";
            me.button4.x = 15;
            me.button4.y = 35;
            me.button3.height = 30;
            me.button3.width = 20;
            me.button3.x = 75;
            me.button3.y = 30;
        }
    };
    TestComponent = __decorate([
        Component_1.$UIComponent({ fullPath: "common/TestComponent", editableChildComponents: ["this", "me.button4"] }),
        Jassi_9.$Class("demo.TestComponent"),
        __metadata("design:paramtypes", [])
    ], TestComponent);
    exports.TestComponent = TestComponent;
    async function test() {
        var dlg = new TestComponent();
        return dlg;
    }
    exports.test = test;
});
define("demo/TestExtension", ["require", "exports", "de/remote/Kunde"], function (require, exports, Kunde_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function test() {
        var kd = new Kunde_6.Kunde();
        console.log(kd.extFunc());
    }
    exports.test = test;
});
define("demo/TestTab", ["require", "exports", "jassi/remote/Jassi", "jassi/base/Actions", "jassi/ui/Panel", "jassi/ui/HTMLPanel", "jassi/ui/Button"], function (require, exports, Jassi_10, Actions_1, Panel_7, HTMLPanel_3, Button_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.KK4 = exports.KK3 = void 0;
    let KK3 = class KK3 {
    };
    KK3 = __decorate([
        Actions_1.$ActionProvider("3"),
        Jassi_10.$Class("de.KK3")
    ], KK3);
    exports.KK3 = KK3;
    let KK4 = class KK4 {
    };
    KK4 = __decorate([
        Actions_1.$ActionProvider("4"),
        Jassi_10.$Class("de.KK4")
    ], KK4);
    exports.KK4 = KK4;
    function test() {
        var pan = new Panel_7.Panel();
        //pan.tooltip="Pan";
        pan.width = "100%";
        pan.height = "100%";
        var div = new HTMLPanel_3.HTMLPanel();
        div.value = "Hallo";
        div.height = 50;
        div.tooltip = "div";
        pan.add(div);
        var button = new Button_6.Button();
        button.tooltip = "But";
        button.text = "Button";
        pan.add(button);
        return pan;
    }
    exports.test = test;
});
define("demo/TestTree", ["require", "exports", "jassi/ui/Panel", "jassi/ui/Tree", "jassi/remote/Jassi"], function (require, exports, Panel_8, Tree_1, Jassi_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestTree = void 0;
    let TestTree = class TestTree extends Panel_8.Panel {
        constructor() {
            super();
            this.layout();
        }
        layout() {
        }
    };
    TestTree = __decorate([
        Jassi_11.$Class("demo.TestTree"),
        __metadata("design:paramtypes", [])
    ], TestTree);
    exports.TestTree = TestTree;
    async function test() {
        var ret = new Panel_8.Panel();
        var tree = new Tree_1.Tree();
        var s = { name: "Sansa", id: 1 };
        var p = { name: "Peter", id: 2 };
        var u = { name: "Uwe", id: 3, childs: [p, s] };
        var t = { name: "Tom", id: 5 };
        var c = { name: "Christoph", id: 4, childs: [u, t] };
        s.childs = [c];
        tree.propDisplay = "name";
        tree.propChilds = "childs";
        tree.propIcon = function (data) {
            if (data.name === "Uwe")
                return "mdi mdi-bed-single";
        };
        tree.items = [c, u];
        tree.width = "100%";
        tree.height = "100px";
        tree.onclick(function (data) {
            console.log("select " + data.data.name);
        });
        ret.add(tree);
        return ret;
    }
    exports.test = test;
});
define("demo/TestUpload", ["require", "exports", "jassi/ui/HTMLPanel", "jassi/ui/Upload", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ext/papaparse"], function (require, exports, HTMLPanel_4, Upload_1, Jassi_12, Panel_9, papaparse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestUpload = void 0;
    let TestUpload = class TestUpload extends Panel_9.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.upload1 = new Upload_1.Upload();
            me.htmlpanel1 = new HTMLPanel_4.HTMLPanel();
            this.add(me.upload1);
            this.add(me.htmlpanel1);
            me.upload1.multiple = true;
            me.upload1.onuploaded(function (data) {
                for (var key in data) {
                    me.htmlpanel1.value = data[key];
                }
            });
            me.htmlpanel1.value = "";
            me.htmlpanel1.label = "Content:";
            me.htmlpanel1.css({
                font_size: "x-small"
            });
        }
    };
    TestUpload = __decorate([
        Jassi_12.$Class("demo/TestUpload"),
        __metadata("design:paramtypes", [])
    ], TestUpload);
    exports.TestUpload = TestUpload;
    async function test() {
        var ret = new TestUpload();
        var data = papaparse_1.Papa;
        debugger;
        return ret;
    }
    exports.test = test;
});
define("demo/Testcontextmenu", ["require", "exports", "jassi/ui/Panel", "jassi/ui/ContextMenu", "jassi/ui/MenuItem", "jassi/ui/Button", "jassi/remote/Jassi"], function (require, exports, Panel_10, ContextMenu_2, MenuItem_2, Button_7, Jassi_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Testcontextmenu = void 0;
    let Testcontextmenu = class Testcontextmenu extends Panel_10.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.contextmenu1 = new ContextMenu_2.ContextMenu();
            me.car = new MenuItem_2.MenuItem();
            me.button1 = new Button_7.Button();
            me.menuitem1 = new MenuItem_2.MenuItem();
            me.menuitem2 = new MenuItem_2.MenuItem();
            me.menuitem3 = new MenuItem_2.MenuItem();
            me.menuitem4 = new MenuItem_2.MenuItem();
            me.menuitem5 = new MenuItem_2.MenuItem();
            me.car.text = "car sdf sdf aaa";
            me.car.icon = "mdi mdi-car";
            me.contextmenu1.menu.add(me.car);
            me.contextmenu1.menu.add(me.menuitem1);
            me.contextmenu1.menu.add(me.menuitem4);
            this.width = 872;
            this.height = 320;
            this.isAbsolute = true;
            me.button1.text = "Test2";
            this.add(me.button1);
            this.add(me.contextmenu1);
            me.button1.text = "button4";
            me.button1.x = 1;
            me.button1.contextMenu = me.contextmenu1;
            me.button1.y = 20;
            me.button1.height = 40;
            me.menuitem1.text = "menu";
            me.menuitem1.items.add(me.menuitem2);
            me.menuitem2.text = "menu";
            me.menuitem2.items.add(me.menuitem3);
            me.menuitem3.text = "menu";
            me.menuitem4.text = "menu";
            me.menuitem5.text = "menu";
            me.menuitem4.items.add(me.menuitem5);
        }
    };
    Testcontextmenu = __decorate([
        Jassi_13.$Class("demo.Testcontextmenu"),
        __metadata("design:paramtypes", [])
    ], Testcontextmenu);
    exports.Testcontextmenu = Testcontextmenu;
    async function test() {
        // kk.o=0;
        var dlg = new Testcontextmenu();
        return dlg;
    }
    exports.test = test;
});
define("demo/Testmenu", ["require", "exports", "jassi/ui/Panel", "jassi/jassi", "jassi/ui/Menu", "jassi/ui/MenuItem", "jassi/ui/Button", "jassi/remote/Jassi"], function (require, exports, Panel_11, jassi_1, Menu_1, MenuItem_3, Button_8, Jassi_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Testmenu = void 0;
    let Testmenu = class Testmenu extends Panel_11.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.menu1 = new Menu_1.Menu();
            me.menuitem1 = new MenuItem_3.MenuItem();
            me.menuitem2 = new MenuItem_3.MenuItem();
            me.menuitem3 = new MenuItem_3.MenuItem();
            me.menuitem4 = new MenuItem_3.MenuItem();
            me.menuitem5 = new MenuItem_3.MenuItem();
            me.button1 = new Button_8.Button();
            me.menuitem6 = new MenuItem_3.MenuItem();
            me.menuitem7 = new MenuItem_3.MenuItem();
            me.menu1.width = 205;
            me.menu1.height = 185;
            this.add(me.menu1);
            me.save = new MenuItem_3.MenuItem();
            me.save.text = "save";
            me.save.icon = "mdi mdi-content-save";
            me.save.height = 40;
            me.del = new MenuItem_3.MenuItem();
            me.del.text = "delete";
            me.del.icon = "mdi mdi-delete";
            me.del.onclick(function () {
                window.setTimeout(function () {
                    $(me.menu1.dom).menu("expand", null, true);
                }, 2000);
                //$(me.menu1.dom).menu();
                //	$(me.menu1.dom).menu("destroy");
                //$(me.menu1.dom).menu();
            });
            me.car = new MenuItem_3.MenuItem();
            me.car.text = "car sdf sdf aaa";
            me.car.icon = "mdi mdi-car";
            me.menu1.add(me.save);
            me.menu1.add(me.menuitem5);
            me.menu1.add(me.del);
            me.menu1.x = 10;
            me.menu1.y = 5;
            me.save.items.add(me.car);
            me.save.items.add(me.menuitem4);
            me.save.items.add(me.menuitem6);
            this.width = 872;
            this.height = 320;
            this.isAbsolute = true;
            this.add(me.button1);
            me.car.items.add(me.menuitem1);
            me.car.items.add(me.menuitem2);
            me.car.items.add(me.menuitem3);
            me.menuitem1.text = "ooopp";
            me.menuitem2.text = "menu";
            me.menuitem3.text = "menu";
            me.menuitem4.text = "menus";
            me.menuitem5.text = "ret";
            me.menuitem5.icon = "mdi mdi-car";
            me.button1.text = "button";
            me.button1.x = 398;
            me.button1.y = 26;
            me.button1.height = 25;
            me.menuitem6.text = "menu";
            me.menuitem5.items.add(me.menuitem7);
            me.menuitem7.text = "menupppp";
        }
    };
    Testmenu = __decorate([
        Jassi_14.$Class("demo.Testmenu"),
        __metadata("design:paramtypes", [])
    ], Testmenu);
    exports.Testmenu = Testmenu;
    jassi_1.default.test = async function () {
        // kk.o=0;
        var dlg = new Testmenu();
        return dlg;
    };
});
define("demo/TreeContextmenu", ["require", "exports", "jassi/ui/Tree", "jassi/ui/ContextMenu", "jassi/ui/MenuItem", "jassi/ui/Panel", "jassi/ui/Button"], function (require, exports, Tree_2, ContextMenu_3, MenuItem_4, Panel_12, Button_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class Me {
    }
    async function test() {
        var s = { name: "Sansa", id: 1 };
        var p = { name: "Peter", id: 2 };
        var u = { name: "Uwe", id: 3, childs: [p, s] };
        var t = { name: "Tom", id: 5 };
        var c = { name: "Christoph", id: 4, childs: [u, t] };
        var me = new Me();
        me.tree = new Tree_2.Tree({
            checkbox: true,
            selectMode: 2,
        });
        me.panel = new Panel_12.Panel();
        me.button = new Button_9.Button();
        me.panel["me"] = me;
        me.panel.add(me.tree);
        me.panel.add(me.button);
        s.childs = [c];
        me.tree.propDisplay = "name";
        me.tree.propChilds = "childs";
        me.tree.propIcon = function (data) {
            if (data.name === "Uwe")
                return "mdi mdi-car";
        };
        me.tree.width = "100%";
        me.tree.height = 175;
        /*  me.tree.onclick(function (data) {
              console.log("select " + data.item.name);
          });*/
        var contextmenu = new ContextMenu_3.ContextMenu();
        me.tree.contextMenu = contextmenu;
        var menu = new MenuItem_4.MenuItem();
        menu.text = "static menu";
        menu.onclick(function (ob) {
            alert(contextmenu.value[0].name + "clicked");
        });
        contextmenu.menu.add(menu);
        contextmenu.getActions = async function (obs) {
            return [{ name: "custom Action", call: function (data) {
                        alert(data[0].name);
                    } }];
        };
        me.tree.items = [c, u];
        me.tree.expandAll();
        me.tree.onclick(function (event, data) {
            //alert(event.selection[0].name);
        });
        me.button.text = "Test";
        me.button.onclick(() => {
            var h = me.tree.selection;
        });
        return me.panel;
    }
    exports.test = test;
});
define("demo/TreeTable", ["require", "exports", "jassi/ui/Panel", "jassi/remote/Jassi", "jassi/ui/Table"], function (require, exports, Panel_13, Jassi_15, Table_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TreeTable = void 0;
    class Person {
        constructor(name, id, childs = undefined) {
            this.name = name;
            this.id = id;
            this.childs = childs;
        }
        t() {
            return this.childs;
        }
    }
    class Me {
    }
    ;
    let TreeTable = class TreeTable extends Panel_13.Panel {
        constructor() {
            super();
            this.me = new Me();
            this.layout(this.me);
        }
        layout(me) {
            var s = new Person("Sophie", 1);
            var p = new Person("Phillip", 2);
            var u = new Person("Udo", 3, [p, s]);
            var t = new Person("Thomas", 5);
            var c = new Person("Christoph", 4, [u, t]);
            s.childs = [c];
            me.tab = new Table_3.Table({
                dataTreeChildFunction: "t"
            });
            me.tab.items = [c];
            me.tab.height = "150";
            me.tab.width = "100%";
            //me.tab.items = [c, u];
            this.add(me.tab);
        }
        layoutalt(me) {
            var s = new Person("Sophie", 1);
            var p = new Person("Phillip", 2);
            var u = new Person("Udo", 3, [p, s]);
            var t = new Person("Thomas", 5);
            var c = new Person("Christoph", 4, [u, t]);
            s.childs = [c];
            function populateData(data) {
                var childs = data["childs"];
                if (childs && childs.length > 0) {
                    Object.defineProperty(data, "__treechilds", {
                        configurable: true,
                        get: function () {
                            return childs;
                        }
                    });
                    for (var x = 0; x < childs.length; x++) {
                        var nchilds = childs[x]["childs"];
                        if (nchilds && nchilds.length > 0) {
                            Object.defineProperty(childs[x], "__treechilds", {
                                configurable: true,
                                get: function () {
                                    return ["dummy"];
                                }
                            });
                        }
                    }
                }
            }
            me.tab = new Table_3.Table({
                dataTree: true,
                dataTreeChildField: "__treechilds",
                dataTreeRowExpanded: function (row) {
                    let childs = row.getData()["childs"];
                    for (let f = 0; f < childs.length; f++) {
                        populateData(childs[f]);
                    }
                    row.update(row.getData());
                    /* var chs = row.getTreeChildren();
                    for (let x = 0; x < chs.length; x++) {
                        let r = chs[x];
                        var dat = r.getData();
                        let test=dat.__treechilds;
                        r.update(dat);
    
                    }
                    row.update(row.getData());*/
                }
                /*dataTreeChildFunction1: function (ob) {
                    return ob.childs;
                }*/
            });
            var data = [c];
            for (var x = 0; x < data.length; x++) {
                populateData(data[x]);
            }
            me.tab.items = data;
            me.tab.height = "150";
            me.tab.width = "100%";
            //me.tab.items = [c, u];
            this.add(me.tab);
        }
    };
    TreeTable = __decorate([
        Jassi_15.$Class("demo.TreeTable"),
        __metadata("design:paramtypes", [])
    ], TreeTable);
    exports.TreeTable = TreeTable;
    async function test() {
        var tab = new TreeTable();
        //test
        return tab;
    }
    exports.test = test;
});
define("demo/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "require": {}
    };
});
//this file is autogenerated don't modify
define("demo/registry", ["require"], function (require) {
    return {
        default: {
            "demo/DBTest.ts": {
                "date": 1613330812615
            },
            "demo/Dialog.ts": {
                "date": 1614895450330,
                "demo/Dialog": {}
            },
            "demo/DialogKunde2.ts": {
                "date": 1613391153926,
                "demo.DialogKunde2": {}
            },
            "demo/DK.ts": {
                "date": 1614892605286,
                "demo.DK": {}
            },
            "demo/EmptyDialog.ts": {
                "date": 1613218544157,
                "demo.EmptyDialog": {}
            },
            "demo/KundeView.ts": {
                "date": 1613330812615,
                "demo.KundeView": {
                    "$DBObjectView": [
                        {
                            "classname": "de.Kunde"
                        }
                    ]
                }
            },
            "demo/MemoryTest.ts": {
                "date": 1613330812614
            },
            "demo/modul.ts": {
                "date": 1612818333557
            },
            "demo/ParentRightCheck.ts": {
                "date": 1613330812615
            },
            "demo/ReportKunde.ts": {
                "date": 1613330812614,
                "demo.ReportKunde": {}
            },
            "demo/ReportRechnung.ts": {
                "date": 1613330812614,
                "demo.ReportRechnung": {}
            },
            "demo/StyleDialog.ts": {
                "date": 1613218544157,
                "demo/StyleDialog": {}
            },
            "demo/TableContextmenu.ts": {
                "date": 1588526093408
            },
            "demo/TestComponent.ts": {
                "date": 1613218544158,
                "demo.TestComponent": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/TestComponent",
                            "editableChildComponents": [
                                "this",
                                "me.button4"
                            ]
                        }
                    ]
                }
            },
            "demo/Testcontextmenu.ts": {
                "date": 1613394627144,
                "demo.Testcontextmenu": {}
            },
            "demo/TestExtension.ts": {
                "date": 1613330812614
            },
            "demo/Testmenu.ts": {
                "date": 1613218544157,
                "demo.Testmenu": {}
            },
            "demo/TestTab.ts": {
                "date": 1613218544160,
                "de.KK3": {
                    "$ActionProvider": [
                        "3"
                    ]
                },
                "de.KK4": {
                    "$ActionProvider": [
                        "4"
                    ]
                }
            },
            "demo/TestTree.ts": {
                "date": 1613218544157,
                "demo.TestTree": {}
            },
            "demo/TestUpload.ts": {
                "date": 1613218544157,
                "demo/TestUpload": {}
            },
            "demo/TreeContextmenu.ts": {
                "date": 1612387959952
            },
            "demo/TreeTable.ts": {
                "date": 1613914171753,
                "demo.TreeTable": {}
            }
        }
    };
});
//# sourceMappingURL=demo.js.map