import { TextComponent } from "jassijs/ui/Component";
import { Button } from "jassijs/ui/Button";
import { Checkbox } from "jassijs/ui/Checkbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me={
    checkbox?: Checkbox;
    checkbox2?: Checkbox;
    button?: Button;
    text1?: TextComponent;
};
@$Class("demo/Dialog5")
export class Dialog5 extends Panel {
    me: Me;
    constructor() {
        super();
        this.me={};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.checkbox=new Checkbox();
        me.checkbox2=new Checkbox();
        me.button=new Button();
        me.text1=new TextComponent();
        this.config({
            children: [
                me.button.config({}),
                me.text1.config({ text: "Halllo" }),
                me.checkbox2.config({})
            ]
        });
    }
}
export async function test() {
    var ret=new Dialog5();
    return ret;
}
