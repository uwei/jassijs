import { Button } from "jassi/ui/Button";
import { Repeater } from "jassi/ui/Repeater";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
type Me = {
    repeater1?: Repeater;
    button1?: Button;
};
@$Class("demo.EmptyDialog")
export class EmptyDialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.repeater1 = new Repeater();
        this.add(me.repeater1);
        me.repeater1.createRepeatingComponent(function (databinder1) {
            me.button1 = new Button();
            me.repeater1.design.add(me.button1);
        });
        
       
    }
}
export async function test() {
    var ret = new EmptyDialog();
    return ret;
}
