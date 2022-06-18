var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Databinder", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Databinder_1, Textbox_1, Button_1, Registry_1, Panel_1) {
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
            me.databinder1 = new Databinder_1.Databinder();
            me.panel1 = new Panel_1.Panel();
            me.button1 = new Button_1.Button();
            me.textbox2 = new Textbox_1.Textbox();
            me.databinder1.value = {
                Halo: "Du"
            };
            this.config({ children: [
                    me.textbox1.config({
                        value: "sadfasdf",
                        label: "asdf",
                        bind: [me.databinder1, "Halo"]
                    }),
                    me.databinder1.config({}),
                    me.textbox2.config({}),
                    me.panel1.config({ children: [
                            me.button1.config({ text: "button" })
                        ] })
                ] });
        }
    };
    Dialog = __decorate([
        (0, Registry_1.$Class)("de/Dialog"),
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