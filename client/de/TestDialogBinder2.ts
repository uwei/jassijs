import { Button } from "jassijs/ui/Button";
import { Textbox } from "jassijs/ui/Textbox";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Databinder } from "jassijs/ui/Databinder";
import { Repeater } from "jassijs/ui/Repeater";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me = {

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
        this.config({});
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
    //ret.me.databinder.value = data;
    return ret;
}
