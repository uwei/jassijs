var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Button", "jassi/ui/Repeater", "jassi/remote/Jassi", "jassi/ui/Panel"], function (require, exports, Button_1, Repeater_1, Jassi_1, Panel_1) {
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
            me.repeater1 = new Repeater_1.Repeater();
            this.add(me.repeater1);
            me.repeater1.createRepeatingComponent(function (databinder1) {
                me.button1 = new Button_1.Button();
                me.repeater1.design.add(me.button1);
            });
        }
    };
    EmptyDialog = __decorate([
        Jassi_1.$Class("demo.EmptyDialog"),
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