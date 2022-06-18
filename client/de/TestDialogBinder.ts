import { Button } from "jassijs/ui/Button";
import { Textbox } from "jassijs/ui/Textbox";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Databinder } from "jassijs/ui/Databinder";
import { Repeater } from "jassijs/ui/Repeater";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    databinder?: Databinder;
    repeater?: Repeater;
    textbox?: Textbox;
};
@$Class("de/TestDialogBinder")
export class TestDialogBinder extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.databinder = new Databinder();
        me.repeater = new Repeater();
        me.repeater.config({
            createRepeatingComponent: function (me: Me) {
                me.textbox = new Textbox();
                me.repeater.design.config({ children: [
                        me.textbox.config({ bind: [me.repeater.design.databinder, "name"] })
                    ] });
            }
        });
        this.add(me.databinder);
        this.add(me.repeater);
        me.repeater.bind = [me.databinder, "customers"];
    }
}
export async function test() {
    var ret = new TestDialogBinder();
    var data = {
        customers: [
            { name: "Hans" },
            { name: "Klaus" }
        ]
    };
    //  throw new Error("kkk");
    ret.me.databinder.value = data;
    return ret;
}
