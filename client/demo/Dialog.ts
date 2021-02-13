import { Button } from "jassi/ui/Button";
import { BoxPanel } from "jassi/ui/BoxPanel";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
type Me = {
    boxpanel1?: BoxPanel;
    button1?: Button;
    button2?: Button;
};
@$Class("demo/Dialog")
export class Dialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.boxpanel1 = new BoxPanel();
        me.button1 = new Button();
        me.button2 = new Button();
        me.boxpanel1.add(me.button1);
        me.boxpanel1.add(me.button2);
        me.boxpanel1.spliter = [60,40];
        me.button1.text = "button";
        me.button2.text = "button";
        this.add(me.boxpanel1);
    }
}
export async function test() {
    var ret = new Dialog();
    return ret;
}
