import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    button?: Button;
};
@$Class("tests/TestDialog")
export class TestDialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.button = new Button();
        this.config({ children: [
                me.button.config({ text: "button" })
            ] });
    }
}
export async function test() {
    var ret = new TestDialog();
    return ret;
}
