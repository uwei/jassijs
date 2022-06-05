import { Checkbox } from "jassijs/ui/Checkbox";
import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
type Me = {
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
        me.button1 = new Button();

        this.config({
            children: [
                me.button1.config({
                    width: "150",
                    text: "sdfsdf",
                    label: "werwer"
                })
            ],
            height: 30
        });
    }
}
export async function test() {
    var ret = new Dialog();
    return ret;
}
