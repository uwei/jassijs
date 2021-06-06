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
define(["require", "exports", "jassijs/ui/Checkbox", "jassijs/ui/Button", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Checkbox_1, Button_1, Textbox_1, jassijs_1, Panel_1) {
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
            me.textbox1 = new Textbox_1.Textbox();
            me.panel1 = new Panel_1.Panel();
            me.panel2 = new Panel_1.Panel();
            me.button1 = new Button_1.Button();
            me.panel3 = new Panel_1.Panel();
            me.checkbox1 = new Checkbox_1.Checkbox();
            this.width = 750;
            this.height = 206;
            this.isAbsolute = false;
            this.add(me.panel2);
            this.add(me.panel1);
            this.add(me.panel3);
            me.textbox1.x = 35;
            me.textbox1.y = 15;
            me.textbox1.height = 50;
            me.textbox1.width = 130;
            me.panel1.width = 275;
            me.panel1.height = 105;
            me.panel1.isAbsolute = true;
            me.panel1.add(me.textbox1);
            me.panel2.width = 200;
            me.panel2.height = 55;
            me.panel2.isAbsolute = true;
            me.panel2.add(me.button1);
            me.button1.text = "button";
            me.button1.x = 10;
            me.button1.y = 15;
            me.panel3.width = 180;
            me.panel3.height = 55;
            me.panel3.isAbsolute = true;
            me.panel3.add(me.checkbox1);
            me.checkbox1.x = 16;
            me.checkbox1.y = 9;
        }
    };
    Dialog = __decorate([
        jassijs_1.$Class("de/Dialog"),
        __metadata("design:paramtypes", [])
    ], Dialog);
    exports.Dialog = Dialog;
    async function test() {
        var ret = new Dialog();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog.js.map
//# sourceMappingURL=Dialog.js.map