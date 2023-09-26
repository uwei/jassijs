import { Checkbox } from "jassijs/ui/Checkbox";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { Component, HTMLComponent } from "jassijs/ui/Component";
import { BoxPanel } from "jassijs/ui/BoxPanel";
type Me = {
    p1?: HTMLComponent;
    p2?: HTMLComponent;
    p3?: HTMLComponent;
    p4?: HTMLComponent;
    p5?: HTMLComponent;
    checkbox2?: Checkbox;
};
var x = 1;
class H extends HTMLComponent {
    render() {
        return React.createElement("div", {
            style: { borderStyle: "ridge", borderWidth: "5px" }
        })//, "Hallo" + (x++);
    }
}
class H2 extends HTMLComponent {
    render() {
        return React.createElement("u", {
            style: { borderStyle: "ridge", borderWidth: "5px" }
        }); //, "Hallo" + (x++));
    }
}
@$Class("demo/Dialog3")
export class Dialog3 extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        this.dom.contentEditable = "true";
        me.p1 = new BoxPanel();me.p1.horizontal=true;;me.p1.domWrapper.classList.add("testuw");
        me.p1.domWrapper.style.borderWidth = "5px;";
        me.p1.domWrapper.style.borderStyle = "ridge";
        
        me.p2 = new Panel();
        me.p2.domWrapper.style.borderWidth = "5px;";
        me.p2.domWrapper.style.borderStyle = "ridge";
        me.p3 = new Panel();
        me.p3.domWrapper.style.borderWidth = "5px;";
        me.p3.domWrapper.style.borderStyle = "ridge";
        me.p4 = new H({ nowrapper: true });
        me.p5 = new H({ nowrapper: true });
        this.add(me.p1);
        me.p1.add(me.p2);
        me.p1.add(me.p3);
        this.add(me.p4);
        this.add(me.p5);
        this.height = 25;
        setTimeout(()=>{
            const selection = window.getSelection()
            console.log(me.p2.dom.id);
            const headerElement = document.querySelector('#'+me.p2.dom.id).childNodes[0]
            selection.setBaseAndExtent(headerElement,0,headerElement,2)
        },10000);
        /*    me.p2 = new HTMLComponent({nowrapper:true});me.p2.dom=me.p2.domWrapper=Component.createHTMLElement(h);this.add(me.p2);
            me.p3 = new HTMLComponent({nowrapper:true});me.p3.dom=me.p3.domWrapper=Component.createHTMLElement(h);this.add(me.p3);
            me.p4 = new HTMLComponent({nowrapper:true});me.p4.dom=me.p4.domWrapper=Component.createHTMLElement(h);this.add(me.p4);
            me.p5 = new HTMLComponent({nowrapper:true});me.p5.dom=me.p5.domWrapper=Component.createHTMLElement(h);this.add(me.p5);
            me.p6 = new HTMLComponent({nowrapper:true});me.p6.dom=me.p6.domWrapper=Component.createHTMLElement(h);this.add(me.p6);*/
    }
}
export async function test() {
    var ret = new Dialog3();
    return ret;
}
