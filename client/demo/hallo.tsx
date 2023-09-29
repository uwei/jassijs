import { Button } from "jassijs/ui/Button";
import { Textbox } from "jassijs/ui/Textbox";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Component,ComponentCreateProperties,HTMLComponent } from "jassijs/ui/Component";
import { Panel } from "jassijs/ui/Panel";
function j() {
}
interface Prop {
    name?: string;
}
class TC extends Component<Prop> {
    constructor(prop: Prop) {
        super(prop);
    }
    render(): JSX.Element {
        return <div>{this.props.name}</div>;
    }
}
function TC2(data: Prop) {
    return <div>{data.name}</div>;
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
export function test() {
    return <Panel>
        <button width="202" contentEditable="false" style={{ color: "red" }} height="44">hall</button>

    </Panel>;
}
