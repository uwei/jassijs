import { Databinder } from "jassijs/ui/Databinder";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Button } from "jassijs/ui/Button";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    panel1?: Panel;
    textbox1?: Textbox;
    button1?: Button;
    IDCheck?: Checkbox;
    checkbox2?: Checkbox;
    databinder1?: Databinder;
};
@$Class("de/MyDialog")
export class MyDialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.panel1 = new Panel();
        me.textbox1 = new Textbox();
        me.button1 = new Button();
        me.IDCheck = new Checkbox();
        me.checkbox2 = new Checkbox();
        me.databinder1 = new Databinder();
        me.databinder1.value = { hallo: "Hallo" };
        this.config({ children: [
                me.panel1.config({ children: [
                        me.textbox1.config({ label: "fg" }),
                        me.button1.config({
                            text: "button",
                            onclick: function (event) {
                                alert(8);
                            }
                        }),
                        me.IDCheck.config({ text: "sdfsdf" })
                    ] }),
                me.databinder1.config({})
            ] });
    }
}
export async function test() {
    var ret = new MyDialog();
    return ret;
}
