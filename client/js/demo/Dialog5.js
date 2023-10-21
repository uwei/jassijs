var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Button", "jassijs/ui/Checkbox", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Component_1, Button_1, Checkbox_1, Registry_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog5 = void 0;
    let Dialog5 = class Dialog5 extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.checkbox = new Checkbox_1.Checkbox();
            me.checkbox2 = new Checkbox_1.Checkbox();
            me.button = new Button_1.Button();
            me.text1 = new Component_1.TextComponent();
            this.config({
                children: [
                    me.button.config({}),
                    me.text1.config({ text: "Halllo" }),
                    me.checkbox2.config({})
                ]
            });
        }
    };
    Dialog5 = __decorate([
        (0, Registry_1.$Class)("demo/Dialog5"),
        __metadata("design:paramtypes", [])
    ], Dialog5);
    exports.Dialog5 = Dialog5;
    async function test() {
        var ret = new Dialog5();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog5.js.map