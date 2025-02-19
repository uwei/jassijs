var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/MenuItem", "jassijs/ui/Menu", "jassijs/ui/Component", "jassijs/ui/Checkbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Component", "jassijs/ui/Button", "jassijs/ui/Property"], function (require, exports, MenuItem_1, Menu_1, Component_1, Checkbox_1, Registry_1, Panel_1, Component_2, Button_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog7 = void 0;
    class M2 extends Component_1.Component {
        constructor(props) {
            super(props);
        }
        render() {
            return (0, Component_2.jc)("span", {
                children: [
                    this.states.text,
                    (0, Component_2.jc)(Checkbox_1.Checkbox, { text: "ert" }),
                    "M2",
                    (0, Component_2.jc)(Button_1.Button, { text: "fghfghfgh", width: 125 }),
                    "M2"
                ]
            });
        }
    }
    let M1 = class M1 extends Component_1.Component {
        constructor(props) {
            super(props);
        }
        render() {
            return (0, Component_2.jc)(M2, { text: this.states.text });
        }
    };
    M1 = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/M1" }),
        (0, Registry_1.$Class)("demo/M1"),
        (0, Property_1.$Property)({ name: "text", type: "string" }),
        __metadata("design:paramtypes", [Object])
    ], M1);
    let Dialog7 = class Dialog7 extends Panel_1.Panel {
        constructor() {
            super();
            //  this.me = {};
            // this.layout(this.me);
        }
        render() {
            //var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
            //
            return (0, Component_2.jc)(Panel_1.Panel, {
                label: "hh",
                children: [
                    (0, Component_2.jc)(M1, { text: "", style: { color: "red" } }),
                    (0, Component_2.jc)(Panel_1.Panel, {
                        children: [
                            "tessdf",
                            (0, Component_2.jc)(Checkbox_1.Checkbox, { text: "dfgdfgdfg" }),
                            (0, Component_2.jc)("br", { tag: "br" }),
                            (0, Component_2.jc)(Panel_1.Panel, {
                                children: [
                                    "text3",
                                    (0, Component_2.jc)(Checkbox_1.Checkbox, { text: "uu" })
                                ]
                            }),
                            "test7",
                            "cvxvxcvxcv ",
                            (0, Component_2.jc)(Button_1.Button, {
                                text: "Hadds",
                                onclick: () => {
                                },
                                tooltip: "dfgdfg",
                                onfocus: function (event) {
                                },
                                hidden: false,
                                width: 95,
                                height: 35
                            }),
                            (0, Component_2.jc)(Button_1.Button, {
                                text: "Hadfffds",
                                onclick: () => {
                                },
                                tooltip: "dfgdfg",
                                onfocus: function (event) {
                                },
                                hidden: false,
                                width: 90,
                                height: 35
                            }),
                            (0, Component_2.jc)(Button_1.Button, {
                                text: "Hadfffds",
                                onclick: () => {
                                },
                                tooltip: "dfgdfg",
                                onfocus: function (event) {
                                },
                                hidden: false,
                                width: 90,
                                height: 35
                            }),
                            (0, Component_2.jc)(Checkbox_1.Checkbox, {})
                        ],
                        label: "fg"
                    }),
                    (0, Component_2.jc)(Menu_1.Menu, {
                        children: [(0, Component_2.jc)(MenuItem_1.MenuItem, {})]
                    })
                ]
            });
        }
    };
    Dialog7 = __decorate([
        (0, Registry_1.$Class)("demo/Dialog7"),
        __metadata("design:paramtypes", [])
    ], Dialog7);
    exports.Dialog7 = Dialog7;
    async function test() {
        //var ret=new Dialog7();
        var k = (0, Component_2.jc)(Dialog7, {});
        var ret = (0, Component_1.createComponent)(k);
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog7.js.map