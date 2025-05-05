define(["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/Checkbox", "jassijs/ui/Component", "jassijs/ui/State"], function (require, exports, Textbox_1, Checkbox_1, Component_1, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function Dialog2(props, states) {
        var refs = (0, State_1.createRefs)();
        return React.createElement("div", null,
            React.createElement(Checkbox_1.Checkbox, { text: "errt" }),
            "Hallo",
            React.createElement("br", null),
            "sdfasdfsdf",
            React.createElement("span", { style: { "color": "green", "fontSize": "18px" } }, "sadfasdfasdf"),
            React.createElement(Textbox_1.Textbox, { label: "sdafsdf" }),
            "asd");
    }
    function test() {
        var ret = React.createElement(Dialog2, { sampleProp: "jj" });
        var comp = (0, Component_1.createComponent)(ret);
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog2.js.map