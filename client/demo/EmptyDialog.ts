import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Button } from "jassijs/ui/Button";
import { Repeater } from "jassijs/ui/Repeater";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    repeater1?: Repeater;
    button1?: Button;
    htmlpanel1?: HTMLPanel;
    htmlpanel2?: HTMLPanel;
    button2?: Button;
    htmlpanel3?: HTMLPanel;
};
@$Class("demo.EmptyDialog")
export class EmptyDialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.button1 = new Button();
        me.htmlpanel1 = new HTMLPanel();
        me.button2 = new Button();
        me.htmlpanel3 = new HTMLPanel();
        me.htmlpanel1.value = "lkjlkj";
        me.htmlpanel1.width = 65;
        me.htmlpanel2 = new HTMLPanel();
        me.htmlpanel2.value = "lkjlkjadfsasa";
        this.add(me.button1);
        this.add(me.htmlpanel2);
        this.add(me.htmlpanel1);
        this.add(me.htmlpanel3);
        this.add(me.button2);
        me.button2.text = "button";
        me.button2.onclick(function (event) {
            debugger;
            // alert(document.activeElement.innerHTML);
        });
        me.htmlpanel3.value = "sssssssss<br>";
    }
}
export async function test() {
    var ret = new EmptyDialog();
    return ret;
}
