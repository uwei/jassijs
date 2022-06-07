import { Textbox } from "jassijs/ui/Textbox";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    textbox1?: Textbox;
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
        this.config({
            height: 20,
            children: [
                me.textbox1.config({
                    onclick: function (event) {
                        alert(8)
                    }
                })
            ]
        });
    }
}
export async function test() {
    var ret = new Dialog();
    return ret;
}
