var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Textbox_1, Registry_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog2 = void 0;
    let Dialog2 = class Dialog2 extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.textbox = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            me.textbox3 = new Textbox_1.Textbox();
            this.config({ children: [
                    me.textbox.config({}),
                    me.textbox2.config({ value: "fff" }),
                    me.textbox3.config({})
                ] });
        }
    };
    Dialog2 = __decorate([
        (0, Registry_1.$Class)("de/Dialog2"),
        __metadata("design:paramtypes", [])
    ], Dialog2);
    exports.Dialog2 = Dialog2;
    async function test() {
        var ret = new Dialog2();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog2.js.map