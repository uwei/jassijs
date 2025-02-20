define(["require", "exports", "jassijs/ui/Checkbox", "jassijs/ui/Component", "jassijs/ui/Panel", "jassijs/ui/Button"], function (require, exports, Checkbox_1, Component_1, Panel_1, Button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var x = 1;
    class MyComp extends Component_1.Component {
        constructor(p) {
            super(p);
        }
        render() {
            if (this.props.color === undefined)
                this.state.color.current = "yellow";
            //{me.states.colorState}  
            var ret = Component_1.React.createElement("div", null,
                Component_1.React.createElement(Button_1.Button, { text: "kk", style: { color: this.state.color }, onclick: () => {
                        this.state.color.current = "blue";
                        // _this.config({ text: "neu"+x++ });
                    } }),
                "Haello ggg",
                Component_1.React.createElement(Checkbox_1.Checkbox, { text: "456456", style: {
                        color: "green"
                    } }),
                "Hallo Das",
                Component_1.React.createElement("span", null,
                    "kkk g",
                    Component_1.React.createElement(Checkbox_1.Checkbox, { text: "456456", style: {
                            color: "green"
                        } }),
                    "Hallo",
                    Component_1.React.createElement("br", null),
                    "Du Hallo",
                    Component_1.React.createElement("br", null),
                    "Du Hallo",
                    Component_1.React.createElement("br", null),
                    "Du Hallo",
                    Component_1.React.createElement("br", null),
                    "Du Hallo",
                    Component_1.React.createElement("br", null),
                    "Du Hallo",
                    Component_1.React.createElement(Panel_1.Panel, null),
                    Component_1.React.createElement("br", null),
                    "Du Hallo Du ; Hallo",
                    Component_1.React.createElement("br", null),
                    "Du Hallo",
                    Component_1.React.createElement("br", null),
                    "Du Hallo",
                    Component_1.React.createElement("br", null),
                    "Du Hallo",
                    Component_1.React.createElement("br", null),
                    "Du Hallo",
                    Component_1.React.createElement("br", null),
                    "Du Hallo",
                    Component_1.React.createElement("br", null),
                    "Du",
                    Component_1.React.createElement(Button_1.Button, { text: "kk", style: { color: this.state.color.self }, onclick: () => {
                            this.state.color.current = "blue";
                            // _this.config({ text: "neu"+x++ });
                        } }),
                    "Ha"));
            return ret;
        }
    }
    function k() {
        this.a = 9;
    }
    function test() {
        var ob = {};
        var o = k.bind(ob);
        o();
        var comp = new MyComp({ color: "green" });
        //   comp.config({ color: "red" });
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo5.js.map