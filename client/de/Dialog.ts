import { ContextMenu } from "jassijs/ui/ContextMenu";
import { Textbox } from "jassijs/ui/Textbox";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    panel1?: Panel;
    textbox1?: Textbox;
    checkbox1?: Checkbox;
    checkbox2?: Checkbox;
    button1?: Button;
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
        me.panel1 = new Panel();
        me.textbox1 = new Textbox();
        me.checkbox1 = new Checkbox();
        me.checkbox2 = new Checkbox();
        me.button1 = new Button();
        this.config({
            children: [
                me.panel1
            ]
        });
        me.panel1.add(me.checkbox2);
        me.panel1.add(me.button1);
        me.panel1.add(me.textbox1.config({ value: "dfgdfg" }));
        me.button1.text = "button";
    }
}
export async function test() {
    var ret = new Dialog();
    return ret;
}
