import { Textbox } from "jassijs/ui/Textbox";
import { Checkbox } from "jassijs/ui/Checkbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { jc } from "jassijs/ui/Component";
import { Button } from "jassijs/ui/Button";
import { createRefs } from "jassijs/ui/State";
import { Table } from "jassijs/ui/Table";
type Me = {
    button1?: Button;
};
@$Class("demo/Dialog7")
export class Dialog7 extends Panel {
    me: Me;
    constructor() {
        super();
        //  this.me = {};
        // this.layout(this.me);
    }
    render() {
        this.me = {};
        var refs = createRefs(this.me);
        //var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
        //
        return jc(Panel, {
            label: "hh",
            children: [
                jc(Panel, {
                    children: [
                        jc("br"),
                        "Hsssasa",
                        jc(Panel, {
                            children: [
                                jc(Checkbox, { text: "sss" }),
                            ]
                        }),
                        jc(Button, {
                            text: "Hadds",
                            onclick: () => {
                                this.me.button1.text = "pp";
                                return undefined;
                            },
                            tooltip: "dfgdfg",
                            onfocus: function (event) {
                            }
                        })
                    ]
                })
            ]
        });
    }
}
export async function test() {
    var ret = new Dialog7();
    return ret;
}
