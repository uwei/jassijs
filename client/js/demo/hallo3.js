define(["require", "exports", "jassijs/ui/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var x = 1;
    class MyComp extends Component_1.Component {
        makeGreen() {
            this.state.mycolor.current = "green";
            this.state.mytext.current = "green";
        }
        constructor(p) {
            super(p);
        }
        render() {
            //        var color: State|any = new State("red");
            var _this = this;
            var ret = React.createElement("div", null,
                this.state.mytext,
                React.createElement("button", { style: { color: _this.state.mycolor.self }, onClick: () => {
                        this.state.mytext.current = "ooo";
                        _this.state.mycolor.current = "blue";
                        // _this.config({ text: "neu"+x++ });
                    } }, "Click"),
                "Haello",
                React.createElement("span", null, "kkkk"));
            return ret;
        }
    }
    function test() {
        var ret = React.createElement(MyComp, { mycolor: "yellow", mytext: "Hallo2" });
        //var comp = createComponent(ret);
        var comp = new MyComp({ mycolor: "orange" });
        //comp.makeGreen();
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo3.js.map