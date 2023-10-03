define(["require", "exports", "jassijs/ui/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function j() {
    }
    function createDummy() {
        function allowDrop(ev) {
            ev.preventDefault();
        }
        function drag(ev) {
            var child = ev.target;
            ev.dataTransfer.setDragImage(child.nextSibling, 20, 20);
            ev.dataTransfer.setData("text", ev.target.id);
        }
        function drop(ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));
        }
        function keydown(ev) {
            console.log(ev);
        }
        var ret = React.createElement("span", { className: "designdummy", draggable: "true", onDragStart: drag, onKeyDown: keydown, style: {
                verticalAlign: "text-top", display: "inline-block",
                minWidth: "8px", minHeight: "5px", backgroundColor: "red"
            } });
        //ret.dom.removeEventListener("keydown", keydown);
        //    ret.dom.addEventListener("keydown", (ev)=>keydown(ev));
        ret.dom.classList.remove("jcomponent");
        return ret;
    }
    function correctdummy(node) {
        var _a, _b, _c, _d;
        for (var x = 0; x < node.childNodes.length; x++) {
            var el = node.childNodes[x];
            if (x % 2 === 0 && !((_a = el.classList) === null || _a === void 0 ? void 0 : _a.contains("designdummy"))) {
                el.parentNode.insertBefore(createDummy().dom, el);
            }
            if (x % 2 === 1 && ((_b = el.classList) === null || _b === void 0 ? void 0 : _b.contains("designdummy"))) {
                el.remove();
                x = x - 1;
            }
            if (!((_c = el.classList) === null || _c === void 0 ? void 0 : _c.contains("designdummy"))) {
                correctdummy(el);
            }
        }
        if (node.childNodes.length === 0 || ((_d = node.childNodes[node.childNodes.length - 1].classList) === null || _d === void 0 ? void 0 : _d.contains("dummy"))) {
            if (node.append !== undefined)
                node.append(createDummy());
        }
    }
    function keydown(ev) {
        console.log(ev);
        ev.preventDefault();
    }
    var x = 1;
    /*
    class MyComp extends Component<Prop> {
    
        render() {
            var _this=this;
            return <div>
                {this.props.text}
                <button onClick={() => {
                    _this.config({ text: "neu"+x++ });
                }}>Click
                </button>
            </div>;
        }
    }*/
    function test() {
        /*var ret=<Panel height="153">
            <button width="202" contentEditable="false" style={{ color: "red" }} height="42">hall</button>
            <Button text="sdfsdfsdf"></Button>
            dddd
        </Panel>;*/
        var ret = React.createElement("div", null, "Hasdfgsdfgsdfgsdfg dsfgllo");
        var comp = (0, Component_1.createComponent)(ret);
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo.js.map