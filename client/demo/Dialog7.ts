import { MenuItem } from "jassijs/ui/MenuItem";
import { Menu } from "jassijs/ui/Menu";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $UIComponent,Component,ComponentProperties,HTMLComponent,createComponent } from "jassijs/ui/Component";
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
interface M1Props extends ComponentProperties {
    text?: string;
}
class M2 extends Component<M1Props> {
    constructor(props: M1Props) {
        super(props);
    }
    render() {
        return jc("span",{
            children: [
                this.state.text,
                jc(Checkbox,{ text: "ert" }),
                "M2",
                jc(Button,{ text: "fghfghfgh",width: 125 }),
                "M2"
            ]
        });
    }
}
@$UIComponent({ fullPath: "common/M1" })
@$Class("demo/M1")
@$Property({ name: "text",type: "string" })
class M1 extends Component<M1Props> {
    constructor(props: M1Props) {
        super(props);
    }
    render() {
        return jc(M2,{ text: this.state.text });
    }
}
@$Class("demo/Dialog7")
export class Dialog7 extends Panel {
    constructor() {
        super();
        //  this.me = {};
        // this.layout(this.me);
    }
    render() {
        //var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
        //
        return jc(Panel,{
            label: "hh",
            children: [
                jc(M1,{ text: "",style: { color: "red" } }),
                jc(Panel,{
                    children: [
                        "tessdf",
                        jc(Checkbox,{ text: "dfgdfgdfg" }),
                        jc("br",{ tag: "br" }),
                        jc(Panel,{
                            children: [
                                "text3",
                                jc(Checkbox,{ text: "uu" })
                            ]
                        }),
                        "test7",
                        "cvxvxcvxcv ",
                        jc(Button,{
                            text: "Hadds",
                            onclick: () => {
                            },
                            tooltip: "dfgdfg",
                            onfocus: function(event) {
                            },
                            hidden: false,
                            width: 95,
                            height: 35
                        }),
                        jc(Button,{
                            text: "Hadfffds",
                            onclick: () => {
                            },
                            tooltip: "dfgdfg",
                            onfocus: function(event) {
                            },
                            hidden: false,
                            width: 90,
                            height: 35
                        }),
                        jc(Button,{
                            text: "Hadfffds",
                            onclick: () => {
                            },
                            tooltip: "dfgdfg",
                            onfocus: function(event) {
                            },
                            hidden: false,
                            width: 90,
                            height: 35
                        }),
                        jc(Checkbox,{})
                    ],
                    label: "fg"
                }),
                jc(Menu,{
                    children: [jc(MenuItem,{})]
                })
            ]
        });
    }
}
export async function test() {
    //var ret=new Dialog7();
    var k=jc(Dialog7,{});
    var ret=createComponent(k);
    return ret;
}
