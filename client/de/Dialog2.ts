import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    textbox?: Textbox;
    textbox2?: Textbox;
    textbox3?: Textbox;
};
@$Class("de/Dialog2")
export class Dialog2 extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.textbox = new Textbox();
        me.textbox2 = new Textbox();
        me.textbox3 = new Textbox();
        this.config({ children: [
                me.textbox.config({}),
                me.textbox2.config({ value: "fff" }),
                me.textbox3.config({})
            ] });
    }
}
export async function test() {
    var ret = new Dialog2();
    return ret;
}
