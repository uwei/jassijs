define(["require", "exports", "jassijs/ui/Component", "demo/hallo"], function (require, exports, Component_1, hallo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var x = 1;
    class MyComp extends Component_1.Component {
        makeGreen() {
            this.mycolor.s("green");
            this.mytext.s("green");
        }
        constructor(p) {
            super(p);
        }
        render() {
            //        var color: State|any = new State("red");
            var _this = this;
            _this.mycolor = new hallo_1.State("red");
            _this.mytext = new hallo_1.State("Hallo");
            var ret = <div>
            {this.mytext}
            <button style={{ color: _this.mycolor }} onClick={() => {
                    this.mytext.s("ooo");
                    _this.mycolor.s("blue");
                    // _this.config({ text: "neu"+x++ });
                }}>Click
            </button>
            Haello
            <span>kkkk</span>
        </div>;
            return ret;
        }
    }
    function test() {
        var ret = <MyComp mycolor="yellow" mytext="Hallo2"></MyComp>;
        //var comp = createComponent(ret);
        var comp = new MyComp({ mycolor: "orange" });
        //comp.makeGreen();
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo3.jsx.map