var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/MenuItem", "jassi/ui/Checkbox", "jassi/ui/Textbox", "jassi/ui/Button", "jassi/ui/BoxPanel", "remote/jassi/base/Jassi", "jassi/ui/Panel", "jassi/ui/HTMLPanel"], function (require, exports, MenuItem_1, Checkbox_1, Textbox_1, Button_1, BoxPanel_1, Jassi_1, Panel_1, HTMLPanel_1) {
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
            me.button3 = new Button_1.Button();
            me.button5 = new Button_1.Button();
            me.checkbox2 = new Checkbox_1.Checkbox();
            me.menuitem2 = new MenuItem_1.MenuItem();
            Jassi_1.default.includeCSS("kkkk", {
                ".ui-state-highlight": {
                    border: "3px solid yellow"
                }
            });
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.button2 = new Button_1.Button();
            me.button4 = new Button_1.Button();
            me.button7 = new Button_1.Button();
            me.textbox3 = new Textbox_1.Textbox();
            me.textbox4 = new Textbox_1.Textbox();
            me.checkbox1 = new Checkbox_1.Checkbox();
            me.boxpanel1.add(me.button7);
            me.boxpanel1.add(me.checkbox2);
            me.boxpanel1.add(me.panel1);
            me.boxpanel1.add(me.button3);
            this.add(me.boxpanel1);
            this.add(me.htmlpanel1);
            this.add(me.htmlpanel2);
            me.htmlpanel1.value = "";
            me.htmlpanel1.newlineafter = false;
            me.htmlpanel1.height = 15;
            me.htmlpanel2.value = "dd";
            me.button7.text = "button3";
            me.button3.text = "button";
            me.menuitem2.text = "menu";
        }
    };
    Dialog = __decorate([
        Jassi_1.$Class("$/Dialog"),
        __metadata("design:paramtypes", [])
    ], Dialog);
    exports.Dialog = Dialog;
    async function test() {
        var ret = new Dialog();
        var h = monaco.languages.typescript.typescriptDefaults;
        debugger;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog.js.map