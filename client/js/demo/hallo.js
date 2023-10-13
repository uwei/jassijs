define(["require", "exports", "jassijs/ui/Button", "jassijs/ui/Component", "jassijs/ui/Panel", "jassijs/ui/Textbox"], function (require, exports, Button_1, Component_1, Panel_1, Textbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
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
    function test() {
        /*var ret=<Panel height="153">
            <button width="202" contentEditable="false" style={{ color: "red" }} height="42">hall</button>
            <Button text="sdfsdfsdf"></Button>
            dddd
        </Panel>;
       */
        var ret = Component_1.React.createElement(Panel_1.Panel, null,
            Component_1.React.createElement(Textbox_1.Textbox, { value: "AA" }),
            Component_1.React.createElement(Button_1.Button, null),
            Component_1.React.createElement(Textbox_1.Textbox, { value: "fffrr3" }),
            Component_1.React.createElement(Panel_1.Panel, { height: 150, width: 150 },
                Component_1.React.createElement(Button_1.Button, null),
                Component_1.React.createElement(Textbox_1.Textbox, { value: "fffrr3" })));
        /*<div>v
          sdfsdf
              <div style={{color:"blue"}}>
                  sdfsdfsdf
              </div>sdfs
              <br />
              d
              <br />
      
      
      
              ssss
              <Table></Table>
      
          </div>;*/
        // var ret= <Button text="Hallo" ></Button>
        //
        //<MyComp text="sdfsdfddsdf"></MyComp>;
        var comp = (0, Component_1.createComponent)(ret);
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo.js.map