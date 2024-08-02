define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Panel", "jassijs/ui/Component"], function (require, exports, Component_1, Panel_1, Component_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog7 = void 0;
    class Dialog7 extends Panel_1.Panel {
        render() {
            //var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
            //
            return (0, Component_2.jc)(Panel_1.Panel, {
                label: "hh",
                children: [
                    "aaaaaaa",
                    (0, Component_2.jc)("span", {
                        children: [
                            "bb"
                        ],
                    }),
                    "cc"
                ]
            });
        }
    }
    exports.Dialog7 = Dialog7;
    async function test() {
        //var ret=new Dialog7();
        var k = (0, Component_2.jc)(Dialog7, { height: 15 });
        var ret = (0, Component_1.createComponent)(k);
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog8.js.map