import { Ref } from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { jc } from "jassijs/ui/Component";
type Me={};
@$Class("demo/Dialog9")
export class Dialog9 extends Panel {
    me: Me;
    constructor() {
        super();
        this.me={};
        //this.layout(this.me);
    }
    render() {
        return jc(Panel,{
            children: [jc(Button,{ text: "halloe2" }),jc(Button,{ text: "halloe" })]
        },jc(Button,{ text: "halloe3" }));
    }
    layout(me: Me) {
        var bt=new Button({ text: "Hallo" });
        //this.config({});
        this.add(bt);
    }
}
export async function test() {
    var ret=new Dialog9();
    return ret;
}
