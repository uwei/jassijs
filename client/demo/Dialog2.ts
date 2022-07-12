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
    button?: Button;
    textbox2?: Textbox;
    textbox?: Textbox;
    boxpanel?: BoxPanel;
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
        me.button = new Button();
        me.textbox = new Textbox();
        me.boxpanel = new BoxPanel();
        this.height = 17;
        this.width = 876;
        this.add(me.boxpanel);
        me.button.text = "button";
        me.button.onclick(function (event) {
            var h = me.textbox.value;
        });
        me.textbox.converter = new NumberConverter({
            format: "#.##0,00"
        });
        me.boxpanel.add(me.textbox);
        me.boxpanel.add(me.button);
        me.boxpanel.spliter = [50, 50];
        me.boxpanel.height = "500";
        me.boxpanel.horizontal = true;
    }
}
export async function test() {
    var ret = new Dialog2();
    ret.me.textbox.value = 8;
    return ret;
}
