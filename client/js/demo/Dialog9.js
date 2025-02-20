var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Component"], function (require, exports, Registry_1, Panel_1, Button_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog9 = void 0;
    let Dialog9 = class Dialog9 extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            //this.layout(this.me);
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [(0, Component_1.jc)(Button_1.Button, { text: "halloe2" }), (0, Component_1.jc)(Button_1.Button, { text: "halloe" })]
            }, (0, Component_1.jc)(Button_1.Button, { text: "halloe3" }));
        }
        layout(me) {
            var bt = new Button_1.Button({ text: "Hallo" });
            //this.config({});
            this.add(bt);
        }
    };
    Dialog9 = __decorate([
        (0, Registry_1.$Class)("demo/Dialog9"),
        __metadata("design:paramtypes", [])
    ], Dialog9);
    exports.Dialog9 = Dialog9;
    async function test() {
        var ret = new Dialog9();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog9.js.map