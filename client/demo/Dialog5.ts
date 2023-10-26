import { TextComponent } from "jassijs/ui/Component";
import { Button } from "jassijs/ui/Button";
import { Checkbox } from "jassijs/ui/Checkbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me={
   
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
      
        this.config({});
    }
}
export async function test() {
    var ret=new Dialog5();
    return ret;
}
