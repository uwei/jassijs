define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/State"], function (require, exports, Component_1, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function Dialog1(props, states) {
        var refs = (0, State_1.createRefs)();
        return React.createElement("div", null, states.sampleProp);
    }
    function test() {
        var ret = React.createElement(Dialog1, { sampleProp: "jj" });
        var comp = (0, Component_1.createComponent)(ret);
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo.js.map