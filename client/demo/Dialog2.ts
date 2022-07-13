import { BoxPanel } from "jassijs/ui/BoxPanel";
import { Button } from "jassijs/ui/Button";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { DefaultConverter } from "jassijs/ui/converters/DefaultConverter";
import { Table } from "jassijs/ui/Table";
import { StringConverter } from "jassijs/ui/converters/StringConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    boxpanel?: BoxPanel;
    button?: Button;
    button2?: Button;
};
@$Class("demo/Dialog2")
export class Dialog2 extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.boxpanel = new BoxPanel();
        me.button = new Button();
        me.button2 = new Button();
        this.config({ children: [
                me.boxpanel.config({
                    children: [
                        me.button.config({ text: "button" }),
                        me.button2.config({ text: "button" })
                    ]
                })
            ] });
    }
}
export async function test() {
    var ret = new Dialog2();
    return ret;
}
