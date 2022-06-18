var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/HTMLPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, HTMLPanel_1, Button_1, Registry_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.EmptyDialog = void 0;
    let EmptyDialog = class EmptyDialog extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.button1 = new Button_1.Button();
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.button2 = new Button_1.Button();
            me.htmlpanel3 = new HTMLPanel_1.HTMLPanel();
            me.htmlpanel1.value = "lkjlkj";
            me.htmlpanel1.width = 65;
            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
            me.htmlpanel2.value = "lkjlkjadfsasa";
            this.add(me.button1);
            this.add(me.htmlpanel2);
            this.add(me.htmlpanel1);
            this.add(me.htmlpanel3);
            this.add(me.button2);
            me.button2.text = "button";
            me.button2.onclick(function (event) {
                debugger;
                // alert(document.activeElement.innerHTML);
            });
            me.htmlpanel3.value = "sssssssss<br>";
        }
    };
    EmptyDialog = __decorate([
        (0, Registry_1.$Class)("demo.EmptyDialog"),
        __metadata("design:paramtypes", [])
    ], EmptyDialog);
    exports.EmptyDialog = EmptyDialog;
    async function test() {
        var ret = new EmptyDialog();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=EmptyDialog.js.map