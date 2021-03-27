import { Checkbox } from "jassi/ui/Checkbox";
import { Button } from "jassi/ui/Button";
import { Textbox } from "jassi/ui/Textbox";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
type Me = {
    textbox1?: Textbox;
    panel1?: Panel;
    panel2?: Panel;
    button1?: Button;
    panel3?: Panel;
    checkbox1?: Checkbox;
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
        me.panel1 = new Panel();
        me.panel2 = new Panel();
        me.button1 = new Button();
        me.panel3 = new Panel();
        me.checkbox1 = new Checkbox();
        this.width = 750;
        this.height = 206;
        this.isAbsolute = false;
        this.add(me.panel2);
        this.add(me.panel1);
        this.add(me.panel3);
        me.textbox1.x = 35;
        me.textbox1.y = 15;
        me.textbox1.height = 50;
        me.textbox1.width = 130;
 
        me.panel1.width = 275;
        me.panel1.height = 105;
        me.panel1.isAbsolute = true;
        me.panel1.add(me.textbox1);
   
        me.panel2.width = 200;
        me.panel2.height = 55;
        me.panel2.isAbsolute = true;
        me.panel2.add(me.button1);
        me.button1.text = "button";
        me.button1.x = 10;
        me.button1.y = 15;
   
        me.panel3.width = 180;
        me.panel3.height = 55;
        me.panel3.isAbsolute = true;
        me.panel3.add(me.checkbox1);
        me.checkbox1.x = 16;
        me.checkbox1.y = 9;
    }
}
export async function test() {
    var ret = new Dialog();
    return ret;
}
