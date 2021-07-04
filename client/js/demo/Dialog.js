var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Button_1, BoxPanel_1, Jassi_1, Panel_1) {
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
        Jassi_1.$Class("demo/Dialog"),
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