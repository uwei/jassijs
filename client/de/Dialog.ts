import { BoxPanel } from "jassijs/ui/BoxPanel";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Databinder } from "jassijs/ui/Databinder";
import { ContextMenu } from "jassijs/ui/ContextMenu";
import { Textbox } from "jassijs/ui/Textbox";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import windows from "jassijs/base/Windows";
import { Component } from "jassijs/ui/Component";
type Me = {
    textbox1?: Textbox;
    databinder1?: Databinder;
    panel1?: Panel;
    button1?: Button;
    textbox2?: Textbox;
    htmlpanel?: HTMLPanel;
    checkbox?: Checkbox;
    button?: Button;
    button2?: Button;
    textbox22?: Textbox;
    boxpanel?: BoxPanel;
    textbox?: Textbox;
    checkbox2?: Checkbox;
};
@$Class("de/Dialog")
export class Dialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.textbox1 = new Textbox();
        me.databinder1 = new Databinder();
        me.panel1 = new Panel();
        me.button1 = new Button();
        me.textbox2 = new Textbox();
        me.htmlpanel = new HTMLPanel();
        me.checkbox = new Checkbox();
        me.button = new Button();
        me.button2 = new Button();
        me.textbox22 = new Textbox();
        me.boxpanel = new BoxPanel();
        me.textbox = new Textbox();
        me.checkbox2 = new Checkbox();
        me.databinder1.value = {
            Halo: "Du"
        };
        this.config({
            children: [
                me.textbox1.config({
                    value: "sadfasdf",
                    label: "asdf",
                    bind: [me.databinder1, "Halo"],
                    width: 95,
                }),
                me.databinder1.config({}),
                me.checkbox.config({}),
                me.textbox22.config({ width: 180, height: 20 }),
                me.textbox2.config({ width: 180 }),
                me.button.config({ text: "button", onclick: () => alert(8) }),
                me.htmlpanel.config({ value: "dddd<br>" }),
                me.button2.config({ text: "button", onclick: () => alert(8) }),
                me.boxpanel.config({ children: [
                        me.checkbox2.config({}),
                        me.textbox.config({})
                    ] }),
                me.panel1.config({ children: [
                        me.button1.config({ text: "button" })
                    ] })
            ]
        });
        me.textbox1.domWrapper.style.marginRight = "4px";
        me.button.domWrapper.style.marginRight = "4px";
    }
}
export async function test() {
    var ret = new Dialog();
    var nd = Component.createHTMLElement("<table><tr><td>hall<button>fdg</button><td>jj</td></tr><tr><td>hall<td>jj</td></tr></table>");
    ret.dom.appendChild(nd);
    ret.dom.contentEditable = "true";
    //  windows.add(ret,"Hall");
    var h = ret.dom.querySelectorAll('input');
    h.forEach((el) => el.style.color = "red");
    h.forEach((el) => el.contentEditable = "false");
    h.forEach((el) => el.setAttribute("draggable", "true"));
    return ret;
    var divMO = new window.MutationObserver(function (e) {
        //    console.log(e);
    });
    divMO.observe(ret.dom, { childList: true, subtree: true, characterData: true });
    //return ret;
}
