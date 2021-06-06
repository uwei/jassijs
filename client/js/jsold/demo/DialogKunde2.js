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
define(["require", "exports", "jassijs/ui/Panel", "jassijs/ui/HTMLPanel", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Jassi"], function (require, exports, Panel_1, HTMLPanel_1, Textbox_1, Button_1, BoxPanel_1, jassijs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DialogKunde2 = void 0;
    let DialogKunde2 = class DialogKunde2 extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        async setdata() {
        }
        layout(me) {
            me.panel1 = new HTMLPanel_1.HTMLPanel();
            me.textbox1 = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            me.button1 = new Button_1.Button();
            me.button2 = new Button_1.Button();
            me.textbox3 = new Textbox_1.Textbox();
            me.button3 = new Button_1.Button();
            me.panel2 = new Panel_1.Panel();
            me.panel3 = new Panel_1.Panel();
            me.button4 = new Button_1.Button();
            me.textbox1 = new Textbox_1.Textbox();
            me.button1 = new Button_1.Button();
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.button2 = new Button_1.Button();
            me.button3 = new Button_1.Button();
            me.button4 = new Button_1.Button();
            me.button5 = new Button_1.Button();
            me.button6 = new Button_1.Button();
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
        jassijs_1.$Class("demo.DialogKunde2"),
        __metadata("design:paramtypes", [])
    ], DialogKunde2);
    exports.DialogKunde2 = DialogKunde2;
    function test() {
        // kk.o=0;
        return new DialogKunde2();
    }
    exports.test = test;
});
//# sourceMappingURL=DialogKunde2.js.map
//# sourceMappingURL=DialogKunde2.js.map