var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/Checkbox", "jassijs/ui/Button", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Textbox_1, Checkbox_1, Button_1, Jassi_1, Panel_1) {
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
            me.panel1 = new Panel_1.Panel();
            me.textbox1 = new Textbox_1.Textbox();
            me.checkbox1 = new Checkbox_1.Checkbox();
            me.checkbox2 = new Checkbox_1.Checkbox();
            me.button1 = new Button_1.Button();
            this.config({
                children: [
                    me.panel1
                ]
            });
            me.panel1.add(me.checkbox2);
            me.panel1.add(me.button1);
            me.panel1.add(me.textbox1.config({ value: "dfgdfg" }));
            me.button1.text = "button";
        }
    };
    Dialog = __decorate([
        (0, Jassi_1.$Class)("de/Dialog"),
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