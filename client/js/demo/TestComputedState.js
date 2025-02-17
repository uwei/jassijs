define(["require", "exports", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Component", "jassijs/ui/State"], function (require, exports, Panel_1, Button_1, Component_1, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function MyTest(prop, states = undefined) {
        var computedState = (0, State_1.createComputedState)(() => {
            return "Hallo " + states.text.current;
        }, states, states);
        { /*called if one of the states are changed*/ }
        var num = (0, State_1.createState)(10);
        return React.createElement(Panel_1.Panel, null,
            React.createElement("span", null, computedState),
            React.createElement(Button_1.Button, { text: states.text, onclick: () => { states.text.current = "Max"; num.current = 5; } }),
            (0, State_1.ccs)(() => (10 * num.current), num),
            " ");
    }
    function test() {
        var ret = React.createElement(MyTest, { text: "Heinz" });
        return (0, Component_1.createComponent)(ret);
    }
    exports.test = test;
});
//# sourceMappingURL=TestComputedState.js.map