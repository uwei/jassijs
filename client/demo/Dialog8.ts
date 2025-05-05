import { MenuItem } from "jassijs/ui/MenuItem";
import { Menu } from "jassijs/ui/Menu";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { createComponent } from "jassijs/ui/Component";
import { TextComponent } from "jassijs/ui/Component";
import { Textbox } from "jassijs/ui/Textbox";
import { Checkbox } from "jassijs/ui/Checkbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { jc } from "jassijs/ui/Component";
import { Button } from "jassijs/ui/Button";
import { Table } from "jassijs/ui/Table";
import { $Property } from "jassijs/ui/Property";
type Me={
    button1?: Button;
};
export class Dialog7 extends Panel {
    render() {
        //var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
        //
        return jc(Panel,{
            label: "hh",
            children: [
                "aaaaaaa",
                jc("span",{
                    children: [
                        "bb"
                    ],
                    
                }),
                "cc"
            ]
        });
    }
}
export async function test() {
    //var ret=new Dialog7();
    var k=jc(Dialog7,{ height: 15 });
    var ret=createComponent(k);
    return ret;
}
