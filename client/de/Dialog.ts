import { Checkbox } from "jassi/ui/Checkbox";
import { Button } from "jassi/ui/Button";
import { Textbox } from "jassi/ui/Textbox";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
type Me = {
    panel2?: Panel;
    textbox1?: Textbox;
    checkbox1?: Checkbox;
    textbox2?: Textbox;
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
        me.panel2 = new Panel();
        me.textbox1 = new Textbox();
        me.checkbox1 = new Checkbox();
        me.textbox2 = new Textbox();
        me.checkbox2 = new Checkbox();
        me.button1 = new Button();
        this.width = 750;
        this.height = 206;
        this.isAbsolute = false;
        this.add(me.panel2);
        this.add(me.checkbox1);
        this.add(me.textbox2);
        this.add(me.textbox1);
        me.panel2.width = 200;
        me.panel2.height = 55;
        me.panel2.isAbsolute = false;
        me.panel2.add(me.checkbox2);
        me.panel2.add(me.button1);
        me.button1.text = "button";
    }
}
export async function test() {
    var ret = new Dialog();
    return ret;
}
