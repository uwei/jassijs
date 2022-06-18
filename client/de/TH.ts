import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    button?: Button;
    button2?: Button;
};
@$Class("de/TH")
export class TH extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.button = new Button();
        me.button2 = new Button();
        this.config({ children: [
                me.button.config({ text: "button" }),
                me.button2.config({ text: "button" })
            ] });
       
    }
}
export async function test() {
    var ret = new TH();
    return ret;
}
