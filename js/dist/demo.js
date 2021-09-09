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
define("demo/Dialog", ["require", "exports", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Button_1, BoxPanel_1, Jassi_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog = void 0;
    let Dialog = class Dialog extends Panel_1.Panel {
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
            me.button1.text = "button1";
            me.button2.text = "button";
            this.add(me.boxpanel1);
        }
    };
    Dialog = __decorate([
        (0, Jassi_1.$Class)("demo/Dialog"),
        __metadata("design:paramtypes", [])
    ], Dialog);
    exports.Dialog = Dialog;
    async function test() {
        var ret = new Dialog();
        return ret;
    }
    exports.test = test;
});
define("demo/EmptyDialog", ["require", "exports", "jassijs/ui/Button", "jassijs/ui/Repeater", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Button_2, Repeater_1, Jassi_2, Panel_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.EmptyDialog = void 0;
    let EmptyDialog = class EmptyDialog extends Panel_2.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.repeater1 = new Repeater_1.Repeater();
            this.add(me.repeater1);
            me.repeater1.createRepeatingComponent(function (databinder1) {
                me.button1 = new Button_2.Button();
                me.repeater1.design.add(me.button1);
            });
        }
    };
    EmptyDialog = __decorate([
        (0, Jassi_2.$Class)("demo.EmptyDialog"),
        __metadata("design:paramtypes", [])
    ], EmptyDialog);
    exports.EmptyDialog = EmptyDialog;
    async function test() {
        var ret = new EmptyDialog();
        return ret;
    }
    exports.test = test;
});
define("demo/MemoryTest", ["require", "exports", "jassijs/remote/Server", "jassijs/util/Reloader", "jassijs/remote/Registry"], function (require, exports, Server_1, Reloader_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MemoryTest = void 0;
    function test() {
        //let j=import("de/DK");
        // let dk=new DK();
        // dk.destroy();
    }
    test();
    class MemoryTest {
        async MemoryTest() {
            let server = new Server_1.Server();
            let test = await server.loadFile("demo/DK.ts");
            await server.saveFile("demo/DK.ts", test);
            await Reloader_1.Reloader.instance.reloadJS("demo/DK.js");
            delete Registry_1.default.data["$Class"]["demo.DK"];
            requirejs.undef("demo/DK.js");
            requirejs.undef("demo/DK");
        }
    }
    exports.MemoryTest = MemoryTest;
});
define("demo/ReportInvoice", ["require", "exports", "jassijs/remote/Jassi"], function (require, exports, Jassi_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportInvoice = void 0;
    var reportdesign = {
        content: [
            {
                columns: [
                    [
                        "{{invoice.customer.firstname}} {{invoice.customer.lastname}}",
                        "{{invoice.customer.street}}",
                        "{{invoice.customer.place}}"
                    ],
                    [
                        {
                            text: "Invoice.",
                            fontSize: 18
                        },
                        "\n",
                        "Date: {{date}}",
                        {
                            text: "Number: {{invoice.number}}",
                            bold: true
                        }
                    ]
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
            "\n",
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
    };
    let ReportInvoice = class ReportInvoice {
        constructor() {
            this.reportdesign = reportdesign;
        }
        get title() {
            return "Invoicreport";
        }
    };
    ReportInvoice = __decorate([
        (0, Jassi_3.$Class)("demo.ReportInvoice"),
        __metadata("design:paramtypes", [])
    ], ReportInvoice);
    exports.ReportInvoice = ReportInvoice;
    async function test() {
        // kk.o=0;
        var dlg = new ReportInvoice();
        dlg.parameter = { date: "21.05.2022" };
        dlg.value = {
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
        };
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
define("demo/ReportKunden", ["require", "exports", "jassijs/remote/Jassi"], function (require, exports, Jassi_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportKunden = void 0;
    var reportdesign = {
        content: [
            "{{parameter.Datum}}",
            {
                table: {
                    body: [
                        [
                            "Name",
                            "Nachname"
                        ],
                        {
                            foreach: "kunde",
                            do: [
                                "{{kunde.name}}",
                                "{{kunde.nachname}}"
                            ]
                        }
                    ]
                }
            }
        ]
    };
    let ReportKunden = class ReportKunden {
        constructor() {
            this.reportdesign = reportdesign;
        }
    };
    ReportKunden = __decorate([
        (0, Jassi_4.$Class)("demo.ReportKunden"),
        __metadata("design:paramtypes", [])
    ], ReportKunden);
    exports.ReportKunden = ReportKunden;
    async function test() {
        // kk.o=0;
        var dlg = new ReportKunden();
        dlg.parameter = {
            "Datum": "18.03.2021"
        };
        dlg.value = [{ name: "Klaus", nachname: "Meier" },
            { name: "Heinz", nachname: "Melzer" }];
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
define("demo/StyleDialog", ["require", "exports", "jassijs/ui/Style", "jassijs/ui/Button", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Style_1, Button_3, Jassi_5, Panel_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.StyleDialog = void 0;
    let StyleDialog = class StyleDialog extends Panel_3.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.button1 = new Button_3.Button();
            me.button2 = new Button_3.Button();
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
        (0, Jassi_5.$Class)("demo/StyleDialog"),
        __metadata("design:paramtypes", [])
    ], StyleDialog);
    exports.StyleDialog = StyleDialog;
    async function test() {
        var ret = new StyleDialog();
        return ret;
    }
    exports.test = test;
});
define("demo/TableContextmenu", ["require", "exports", "jassijs/ui/ContextMenu", "jassijs/ui/MenuItem", "jassijs/ui/Table"], function (require, exports, ContextMenu_1, MenuItem_1, Table_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test() {
        var tab = new Table_1.Table({
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
        //    var kunden = await jassijs.db.load("de.Kunde");
        //   tab.items = kunden;
        return tab;
    }
    exports.test = test;
});
define("demo/TestComponent", ["require", "exports", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/HTMLPanel", "jassijs/remote/Jassi", "jassijs/ui/Component"], function (require, exports, Panel_4, Button_4, HTMLPanel_1, Jassi_6, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestComponent = void 0;
    let TestComponent = class TestComponent extends Panel_4.Panel {
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
            me.button1 = new Button_4.Button();
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.button2 = new Button_4.Button();
            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
            me.panel2 = new Panel_4.Panel();
            me.button3 = new Button_4.Button();
            me.button4 = new Button_4.Button();
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
        (0, Component_1.$UIComponent)({ fullPath: "common/TestComponent", editableChildComponents: ["this", "me.button4"] }),
        (0, Jassi_6.$Class)("demo.TestComponent"),
        __metadata("design:paramtypes", [])
    ], TestComponent);
    exports.TestComponent = TestComponent;
    async function test() {
        var dlg = new TestComponent();
        return dlg;
    }
    exports.test = test;
});
define("demo/TestTree", ["require", "exports", "jassijs/ui/Panel", "jassijs/ui/Tree", "jassijs/remote/Jassi"], function (require, exports, Panel_5, Tree_1, Jassi_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestTree = void 0;
    let TestTree = class TestTree extends Panel_5.Panel {
        constructor() {
            super();
            this.layout();
        }
        layout() {
        }
    };
    TestTree = __decorate([
        (0, Jassi_7.$Class)("demo.TestTree"),
        __metadata("design:paramtypes", [])
    ], TestTree);
    exports.TestTree = TestTree;
    async function test() {
        var ret = new Panel_5.Panel();
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
define("demo/TestUpload", ["require", "exports", "jassijs/ui/HTMLPanel", "jassijs/ui/Upload", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ext/papaparse"], function (require, exports, HTMLPanel_2, Upload_1, Jassi_8, Panel_6, papaparse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestUpload = void 0;
    let TestUpload = class TestUpload extends Panel_6.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.upload1 = new Upload_1.Upload();
            me.htmlpanel1 = new HTMLPanel_2.HTMLPanel();
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
        (0, Jassi_8.$Class)("demo/TestUpload"),
        __metadata("design:paramtypes", [])
    ], TestUpload);
    exports.TestUpload = TestUpload;
    async function test() {
        var ret = new TestUpload();
        var data = papaparse_1.Papa;
        return ret;
    }
    exports.test = test;
});
define("demo/Testcontextmenu", ["require", "exports", "jassijs/ui/Panel", "jassijs/ui/ContextMenu", "jassijs/ui/MenuItem", "jassijs/ui/Button", "jassijs/remote/Jassi"], function (require, exports, Panel_7, ContextMenu_2, MenuItem_2, Button_5, Jassi_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Testcontextmenu = void 0;
    let Testcontextmenu = class Testcontextmenu extends Panel_7.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.contextmenu1 = new ContextMenu_2.ContextMenu();
            me.car = new MenuItem_2.MenuItem();
            me.button1 = new Button_5.Button();
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
        (0, Jassi_9.$Class)("demo.Testcontextmenu"),
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
define("demo/Testmenu", ["require", "exports", "jassijs/ui/Panel", "jassijs/ui/Menu", "jassijs/ui/MenuItem", "jassijs/ui/Button", "jassijs/remote/Jassi"], function (require, exports, Panel_8, Menu_1, MenuItem_3, Button_6, Jassi_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Testmenu = void 0;
    let Testmenu = class Testmenu extends Panel_8.Panel {
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
            me.button1 = new Button_6.Button();
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
        (0, Jassi_10.$Class)("demo.Testmenu"),
        __metadata("design:paramtypes", [])
    ], Testmenu);
    exports.Testmenu = Testmenu;
});
define("demo/TreeContextmenu", ["require", "exports", "jassijs/ui/Tree", "jassijs/ui/ContextMenu", "jassijs/ui/MenuItem", "jassijs/ui/Panel", "jassijs/ui/Button"], function (require, exports, Tree_2, ContextMenu_3, MenuItem_4, Panel_9, Button_7) {
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
        me.panel = new Panel_9.Panel();
        me.button = new Button_7.Button();
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
define("demo/TreeTable", ["require", "exports", "jassijs/ui/Panel", "jassijs/remote/Jassi", "jassijs/ui/Table"], function (require, exports, Panel_10, Jassi_11, Table_2) {
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
    let TreeTable = class TreeTable extends Panel_10.Panel {
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
            me.tab = new Table_2.Table({
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
            me.tab = new Table_2.Table({
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
        (0, Jassi_11.$Class)("demo.TreeTable"),
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
            "demo/Dialog.ts": {
                "date": 1627586451134,
                "demo/Dialog": {}
            },
            "demo/EmptyDialog.ts": {
                "date": 1622984213677,
                "demo.EmptyDialog": {}
            },
            "demo/MemoryTest.ts": {
                "date": 1624296679246
            },
            "demo/modul.ts": {
                "date": 1612818333557
            },
            "demo/ReportInvoice.ts": {
                "date": 1631222146247,
                "demo.ReportInvoice": {}
            },
            "demo/StyleDialog.ts": {
                "date": 1622984213677,
                "demo/StyleDialog": {}
            },
            "demo/TableContextmenu.ts": {
                "date": 1622984379892
            },
            "demo/TestComponent.ts": {
                "date": 1622984213677,
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
                "date": 1622984213677,
                "demo.Testcontextmenu": {}
            },
            "demo/Testmenu.ts": {
                "date": 1622985794017,
                "demo.Testmenu": {}
            },
            "demo/TestTree.ts": {
                "date": 1622984213677,
                "demo.TestTree": {}
            },
            "demo/TestUpload.ts": {
                "date": 1623178689366,
                "demo/TestUpload": {}
            },
            "demo/TreeContextmenu.ts": {
                "date": 1622984213677
            },
            "demo/TreeTable.ts": {
                "date": 1622984213677,
                "demo.TreeTable": {}
            },
            "demo/ReportKunden.ts": {
                "date": 1631221228504,
                "demo.ReportKunden": {}
            }
        }
    };
});
//# sourceMappingURL=demo.js.map
//# sourceMappingURL=demo.js.map