define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Button", "jassijs/ui/State"], function (require, exports, Component_1, Button_1, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var x = 1;
    class MyComp extends Component_1.Component {
        constructor(p) {
            super(p);
        }
        render() {
            this.me = {};
            var me = (0, State_1.createRefs)(this.me);
            //        var color: State|any = new State("red");
            //var ret = <div calculateState={calculateState}> 
            if (this.props.color === undefined)
                this.states.color.current = "yellow";
            //{me.states.colorState}  
            var ret = Component_1.React.createElement("div", null,
                Component_1.React.createElement(Button_1.Button, { ref: me.refs.button, text: "kk", style: { color: this.states.color.self }, onclick: () => {
                        this.states.color.current = "blue";
                        me.button.text = "oo";
                        // _this.config({ text: "neu"+x++ });
                    } }),
                "Haello ggg",
                Component_1.React.createElement("span", null, "kkkk"));
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