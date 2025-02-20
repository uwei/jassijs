define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Panel"], function (require, exports, Component_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MyComp = void 0;
    function MyComp(props, states = undefined) {
        return Component_1.React.createElement(Panel_1.Panel, null,
            Component_1.React.createElement("input", { value: states.mytext }),
            Component_1.React.createElement("input", { value: states.mytext }),
            Component_1.React.createElement("span", null, "Hallo"),
            Component_1.React.createElement("button", { style: { color: states.mycolor }, onClick: () => {
                    //  alert(8);
                    states.mycolor.current = "blue";
                    states.mytext.current = "oo";
                } }, "dfgdfg"));
    }
    exports.MyComp = MyComp;
    function test() {
        // calculateState
        var ret = Component_1.React.createElement(MyComp, { mycolor: "yellow", mytext: "Top" });
        var comp = (0, Component_1.createComponent)(ret);
        comp.config({ mycolor: "red" });
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo.js.map