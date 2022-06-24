var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Button_1, Registry_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestDialog = void 0;
    let TestDialog = class TestDialog extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.button = new Button_1.Button();
            this.config({ children: [
                    me.button.config({ text: "button" })
                ] });
        }
    };
    TestDialog = __decorate([
        (0, Registry_1.$Class)("tests/TestDialog"),
        __metadata("design:paramtypes", [])
    ], TestDialog);
    exports.TestDialog = TestDialog;
    async function test() {
        var ret = new TestDialog();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=TestDialog.js.map