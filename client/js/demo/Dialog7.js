var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Checkbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Component", "jassijs/ui/Button", "jassijs/ui/State"], function (require, exports, Checkbox_1, Registry_1, Panel_1, Component_1, Button_1, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog7 = void 0;
    let Dialog7 = class Dialog7 extends Panel_1.Panel {
        constructor() {
            super();
            //  this.me = {};
            // this.layout(this.me);
        }
        render() {
            this.me = {};
            var refs = (0, State_1.createRefs)(this.me);
            //var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
            //
            return (0, Component_1.jc)(Panel_1.Panel, { label: "hh" }, (0, Component_1.jc)(Panel_1.Panel, {}, (0, Component_1.jc)("br"), "Hahhh", (0, Component_1.jc)(Checkbox_1.Checkbox, { text: "eeed" }), (0, Component_1.jc)(Button_1.Button, {
                ref: refs.button1,
                text: "Hadds",
                onclick: () => {
                    this.me.button1.text = "pp";
                    return undefined;
                },
                tooltip: "dfgdfg",
                onfocus: function (event) {
                }
            })));
        }
    };
    exports.Dialog7 = Dialog7;
    exports.Dialog7 = Dialog7 = __decorate([
        (0, Registry_1.$Class)("demo/Dialog7"),
        __metadata("design:paramtypes", [])
    ], Dialog7);
    async function test() {
        var ret = new Dialog7();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog7.js.map