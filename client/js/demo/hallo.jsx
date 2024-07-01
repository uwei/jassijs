define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Panel"], function (require, exports, Component_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MyComp = exports.State = void 0;
    /*
    function j() {
    }
    interface Prop {
        name?: string;
    }
    function createDummy(): HTMLElement {
        function allowDrop(ev) {
            ev.preventDefault();
        }
        function drag(ev) {
            var child: HTMLElement=ev.target;
            ev.dataTransfer.setDragImage(child.nextSibling,20,20);
            ev.dataTransfer.setData("text",ev.target.id);
        }
        function drop(ev) {
            ev.preventDefault();
            var data=ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));
        }
        function keydown(ev) {
            console.log(ev);
        }
        var ret: HTMLComponent=<span className="designdummy" draggable="true" onDragStart={drag} onKeyDown={keydown} style={{
            verticalAlign: "text-top",display: "inline-block",
            minWidth: "8px",minHeight: "5px",backgroundColor: "red"
        }}>
        </span> as any;
        //ret.dom.removeEventListener("keydown", keydown);
        //    ret.dom.addEventListener("keydown", (ev)=>keydown(ev));
        ret.dom.classList.remove("jcomponent");
        return ret;
    }
    function correctdummy(node: HTMLElement) {
        for(var x=0;x<node.childNodes.length;x++) {
            var el=node.childNodes[x] as HTMLElement;
            if(x%2===0&&!el.classList?.contains("designdummy")) {
                el.parentNode.insertBefore(createDummy().dom,el);
            }
            if(x%2===1&&el.classList?.contains("designdummy")) {
                el.remove();
                x=x-1;
            }
            if(!el.classList?.contains("designdummy")) {
                correctdummy(el);
            }
        }
        if(node.childNodes.length===0||(node.childNodes[node.childNodes.length-1] as HTMLElement).classList?.contains("dummy")) {
            if(node.append!==undefined)
                node.append(createDummy());
        }
    }
    function keydown(ev) {
        console.log(ev);
        ev.preventDefault();
    }
    interface Prop {
        text?: string;
    }*/
    var x = 1;
    /*
    class MyComp extends Component<Prop> {
        render() {
            var _this=this;
            var ret=<div>
                {this.props.text}
                <button onClick={() => {
                    _this.config({ text: "neu"+x++ });
                }}>Click
                </button>
                Haello
                <span>kkkk</span>
            </div>;
            return ret;
        }
    }*/
    class StateProp {
    }
    class State {
        constructor(data = undefined) {
            this.self = this;
            this._comps_ = [];
            this.data = data;
        }
        _observe_(control, property, atype) {
            this._comps_.push({ ob: control, name: property, atype });
        }
        get current() {
            return this.data;
        }
        set current(data) {
            this.data = data;
            for (var x = 0; x < this._comps_.length; x++) {
                var c = this._comps_[x];
                var prop = c.name;
                var ob = c.ob;
                if (c.atype === "style") {
                    //for (var key in (<any>props).style) {
                    //var val = (<any>props).style[key];
                    ob.dom.style[prop] = data;
                    //}
                }
                else if (c.atype === "dom") {
                    Reflect.set(ob.dom, prop, data);
                }
                else if (c.atype === "attribute") {
                    ob.dom.setAttribute(prop, data);
                }
                else {
                    Reflect.set(ob, prop, data);
                }
                /*else if (prop in this.dom) {
                           Reflect.set(this.dom, prop, [props[prop]])
                       } else if (prop.toLocaleLowerCase() in this.dom) {
                           Reflect.set(this.dom, prop.toLocaleLowerCase(), props[prop])
                       } else if (prop in this.dom)
                       this.dom.setAttribute(prop, (<any>props)[prop]);*/
            }
        }
    }
    exports.State = State;
    function createState(val = undefined) {
        var ret = new State();
        ret.current = val;
        return ret;
    }
    function MyComp(props) {
        var colorState = createState("green");
        var textState = createState("hallo");
        var calculateState = (props) => {
            if (props.mycolor)
                colorState.current = props.mycolor;
            if (props.mytext)
                textState.current = props.mytext;
        };
        return <Panel_1.Panel calculateState={calculateState}>

         {textState}
        <input value={textState.self}/>
        <input value={textState.self}/>
        <button style={{ color: colorState.self }} onClick={() => {
                //  alert(8);
                colorState.current = "blue";
                textState.current = "oo";
            }}>dfgdfg</button>

    </Panel_1.Panel>;
    }
    exports.MyComp = MyComp;
    function test() {
        // calculateState
        var ret = <MyComp mycolor="yellow" mytext="Top"></MyComp>;
        var comp = (0, Component_1.createComponent)(ret);
        //  comp.config(<MyComp mycolor="red"></MyComp>);
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo.jsx.map