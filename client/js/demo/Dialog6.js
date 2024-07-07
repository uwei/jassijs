var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "demo/hallo", "jassijs/ui/Component", "jassijs/ui/Button"], function (require, exports, Registry_1, Panel_1, hallo_1, Component_1, Button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog6 = void 0;
    let Dialog6 = class Dialog6 extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            this.config({});
        }
    };
    Dialog6 = __decorate([
        (0, Registry_1.$Class)("demo/Dialog6"),
        __metadata("design:paramtypes", [])
    ], Dialog6);
    exports.Dialog6 = Dialog6;
    async function test() {
        var ret = new Dialog6();
        //  var k=MyComp(p);
        // var co = createFunctionComponent(MyComp, { mycolor: "green", mytext: "Hallo" });
        var r = (0, Component_1.jc)(hallo_1.MyComp, { mycolor: "green", mytext: "Hallo" });
        var co = (0, Component_1.createComponent)(r);
        var bt = new Button_1.Button();
        co.config({ mycolor: "red" });
        ret.add(co);
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog6.js.map