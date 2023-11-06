import { HTMLComponent,TextComponent } from "jassijs/ui/Component";
import { Button } from "jassijs/ui/Button";
import { Checkbox } from "jassijs/ui/Checkbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
type Me={
    div?: HTMLComponent;
    checkbox?: Checkbox;
    text?: TextComponent;
    text2?: TextComponent;
    br?: HTMLComponent;
    text3?: TextComponent;
    htmlcomponent?: HTMLComponent;
    text4?: TextComponent;
    htmlcomponent2?: HTMLComponent;
    htmlcomponent3?: HTMLComponent;
    text5?: TextComponent;
    htmlcomponent4?: HTMLComponent;
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
        me.div=new HTMLComponent({ tag: "div" });
        me.checkbox=new Checkbox();
        me.text=new TextComponent();
        me.text2=new TextComponent();
        me.br=new HTMLComponent();
        me.text3=new TextComponent();
        me.htmlcomponent=new HTMLComponent();
        me.text4=new TextComponent();
        me.htmlcomponent2=new HTMLComponent();
        me.htmlcomponent3=new HTMLComponent();
        me.text5=new TextComponent();
        me.htmlcomponent4=new HTMLComponent();
        this.config({
            children: [
                this.me.div.config({}),
                me.text3.config({ text: "Ha" }),
                me.htmlcomponent.config({
                    tag: "span",
                    children: [
                        me.text2.config({ text: "kd" })
                    ]
                }),
                me.br.config({ tag: "br" }),
                me.htmlcomponent3.config({
                    tag: "span",children: [
                        me.text4.config({ text: "k" })
                    ]
                }),
                me.htmlcomponent2.config({
                    tag: "span",children: [
                        me.htmlcomponent4.config({
                            tag: "span",children: [
                                me.text5.config({ text: "i" })
                            ],
                            style: { "fontWeight": "bold" }
                        }),
                        me.text.config({
                            text: ""
                        })
                    ]
                })
            ]
        });
    }
}
export async function test() {
    var ret=new Dialog5();
    return ret;
}
