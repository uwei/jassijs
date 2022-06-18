import { Databinder } from "jassijs/ui/Databinder";
import { ContextMenu } from "jassijs/ui/ContextMenu";
import { Textbox } from "jassijs/ui/Textbox";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    textbox1?: Textbox;
    databinder1?: Databinder;
    panel1?: Panel;
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
        me.databinder1 = new Databinder();
        me.panel1 = new Panel();
        me.button1 = new Button();
        me.textbox2 = new Textbox();
        me.databinder1.value = {
            Halo: "Du"
        };
        this.config({ children: [
                me.textbox1.config({
                    value: "sadfasdf",
                    label: "asdf",
                    bind: [me.databinder1, "Halo"]
                }),
                me.databinder1.config({}),
                me.textbox2.config({}),
                me.panel1.config({ children: [
                        me.button1.config({ text: "button" })
                    ] })
            ] });
    }
}
export async function test() {
    var ret = new Dialog();
    return ret;
}
