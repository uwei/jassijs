var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Checkbox", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Component_1, Checkbox_1, Registry_1, Panel_1) {
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
            me.div = new Component_1.HTMLComponent({ tag: "div" });
            me.checkbox = new Checkbox_1.Checkbox();
            me.text = new Component_1.TextComponent();
            me.text2 = new Component_1.TextComponent();
            me.br = new Component_1.HTMLComponent();
            me.text3 = new Component_1.TextComponent();
            me.htmlcomponent = new Component_1.HTMLComponent();
            me.text4 = new Component_1.TextComponent();
            me.htmlcomponent2 = new Component_1.HTMLComponent();
            me.htmlcomponent3 = new Component_1.HTMLComponent();
            me.text5 = new Component_1.TextComponent();
            me.htmlcomponent4 = new Component_1.HTMLComponent();
            this.config({
                children: [
                    this.me.div.config({}),
                    me.text3.config({ text: "Ha" }),
                    me.htmlcomponent.config({
                        tag: "span",
                        children: [
                            me.text2.config({ text: "kd" })
                        ]
                    }),
                    me.br.config({ tag: "br" }),
                    me.htmlcomponent3.config({
                        tag: "span", children: [
                            me.text4.config({ text: "k" })
                        ]
                    }),
                    me.htmlcomponent2.config({
                        tag: "span", children: [
                            me.htmlcomponent4.config({
                                tag: "span", children: [
                                    me.text5.config({ text: "i" })
                                ],
                                style: { "fontWeight": "bold" }
                            }),
                            me.text.config({
                                text: ""
                            })
                        ]
                    })
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