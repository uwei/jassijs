var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Style", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Style_1, Button_1, Registry_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.StyleDialog = void 0;
    let StyleDialog = class StyleDialog extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.button1 = new Button_1.Button();
            me.button2 = new Button_1.Button();
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
        (0, Registry_1.$Class)("demo/StyleDialog"),
        __metadata("design:paramtypes", [])
    ], StyleDialog);
    exports.StyleDialog = StyleDialog;
    async function test() {
        var ret = new StyleDialog();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=StyleDialog.js.map