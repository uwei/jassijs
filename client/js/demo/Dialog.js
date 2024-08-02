define(["require", "exports", "jassijs/ui/Checkbox", "jassijs/ui/Panel", "jassijs/ui/Component"], function (require, exports, Checkbox_1, Panel_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog = void 0;
    class Dialog extends Panel_1.Panel {
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(Checkbox_1.Checkbox, {
                        text: "456456", style: {
                            color: "maroon"
                        }
                    }),
                    (0, Component_1.jc)(Checkbox_1.Checkbox, {
                        text: "456456", style: {
                            color: "maroon"
                        }
                    }),
                    (0, Component_1.jc)(Checkbox_1.Checkbox, {
                        text: "456456", style: {
                            color: "green"
                        }
                    }),
                    "Das",
                    (0, Component_1.jc)("br", { tag: "br" }),
                    "Hallo",
                    "Das",
                    (0, Component_1.jc)("br", {}),
                    "Hallo",
                    (0, Component_1.jc)(Checkbox_1.Checkbox, {
                        text: "456456", style: {
                            color: "maroon"
                        }
                    }),
                    (0, Component_1.jc)(Checkbox_1.Checkbox, {
                        text: "456456", style: {
                            color: "maroon"
                        }
                    }),
                    (0, Component_1.jc)(Checkbox_1.Checkbox, {
                        text: "456456", style: {
                            color: "green"
                        }
                    }),
                    "Das",
                    (0, Component_1.jc)("br", {}),
                    "Hallo",
                    "Das",
                    (0, Component_1.jc)("br", {}),
                    "Hallo",
                    "",
                    ""
                ]
            });
        }
    }
    exports.Dialog = Dialog;
    function test() {
        var ret = new Dialog();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog.js.map