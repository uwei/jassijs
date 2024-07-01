define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/State"], function (require, exports, Component_1, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var x = 1;
    class MyComp extends Component_1.Component {
        constructor(p) {
            super(p);
        }
        render() {
            //        var color: State|any = new State("red");
            var mycolor = (0, State_1.createState)("red");
            var ret = Component_1.React.createElement("div", null,
                mycolor,
                Component_1.React.createElement("button", { style: { color: mycolor.self }, onClick: () => {
                        mycolor.current = "blue";
                        // _this.config({ text: "neu"+x++ });
                    } }, "Click"),
                "Haello",
                Component_1.React.createElement("span", null, "kkkk"));
            return ret;
        }
    }
    function test() {
        var comp = new MyComp({ mycolor: "green" });
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo4.js.map