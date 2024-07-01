define(["require", "exports", "jassijs/ui/State", "jassijs/ui/Component", "jassijs/ui/Panel"], function (require, exports, State_1, Component_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MyComp = void 0;
    function MyComp(props) {
        var colorState = (0, State_1.createState)("green");
        var textState = (0, State_1.createState)("hallo");
        var calculateState = (props) => {
            if (props.mycolor)
                colorState.current = props.mycolor;
            if (props.mytext)
                textState.current = props.mytext;
        };
        //<Panel {{calculateState}}>
        // <Panel {...{calculateState}}>
        return Component_1.React.createElement(Panel_1.Panel, { calculateState: calculateState },
            Component_1.React.createElement("input", { value: textState.self }),
            Component_1.React.createElement("input", { value: textState.self }),
            Component_1.React.createElement("button", { style: { color: colorState.self }, onClick: () => {
                    //  alert(8);
                    colorState.current = "blue";
                    textState.current = "oo";
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