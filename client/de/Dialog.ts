import { Checkbox } from "jassijs/ui/Checkbox";
import { Button } from "jassijs/ui/Button";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import { Numberformatter } from "jassijs/util/Numberformatter";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
type Me = {
    textbox1?: Textbox;
    button1?: Button;
    textbox2?: Textbox;
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
        me.button1 = new Button();
        me.textbox2 = new Textbox();
        this.width = 750;
        this.height = 206;
        this.isAbsolute = false;
        me.textbox1.width = 135;
        me.textbox1.value = "5555";
        this.add(me.textbox1);
        this.add(me.textbox2);
        this.add(me.button1);
        me.textbox2.value = "555";
    }
}
export async function test() {
    var ret = new Dialog();
    return ret;
}
