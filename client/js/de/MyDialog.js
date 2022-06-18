var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Databinder", "jassijs/ui/Checkbox", "jassijs/ui/Button", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Databinder_1, Checkbox_1, Button_1, Textbox_1, Registry_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MyDialog = void 0;
    let MyDialog = class MyDialog extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.panel1 = new Panel_1.Panel();
            me.textbox1 = new Textbox_1.Textbox();
            me.button1 = new Button_1.Button();
            me.IDCheck = new Checkbox_1.Checkbox();
            me.checkbox2 = new Checkbox_1.Checkbox();
            me.databinder1 = new Databinder_1.Databinder();
            me.databinder1.value = { hallo: "Hallo" };
            this.config({ children: [
                    me.panel1.config({ children: [
                            me.textbox1.config({ label: "fg" }),
                            me.button1.config({
                                text: "button",
                                onclick: function (event) {
                                    alert(8);
                                }
                            }),
                            me.IDCheck.config({ text: "sdfsdf" })
                        ] }),
                    me.databinder1.config({})
                ] });
        }
    };
    MyDialog = __decorate([
        (0, Registry_1.$Class)("de/MyDialog"),
        __metadata("design:paramtypes", [])
    ], MyDialog);
    exports.MyDialog = MyDialog;
    async function test() {
        var ret = new MyDialog();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=MyDialog.js.map