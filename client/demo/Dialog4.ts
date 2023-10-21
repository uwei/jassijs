import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me={
    button?: Button;
    panel?: Panel;
    button2?: Button;
};
@$Class("demo/Dialog4")
export class Dialog4 extends Panel {
    me: Me;
    constructor() {
        super();
        this.me={};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.button=new Button();
        me.panel=new Panel();
        me.button2=new Button();
        this.config({
            children: [
                me.button.config({ text: "button" }),
                me.panel.config({
                    width: 200,
                    height: 150,children: [
                        me.button2.config({ text: "button" })
                    ]
                })
            ]
        });
    }
}
export async function test() {
    var ret=new Dialog4();
    return ret;
}
