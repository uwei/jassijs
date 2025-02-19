import { BoxPanel } from "jassijs/ui/BoxPanel";
import { Button } from "jassijs/ui/Button";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { DefaultConverter } from "jassijs/ui/converters/DefaultConverter";
import { Table } from "jassijs/ui/Table";
import { StringConverter } from "jassijs/ui/converters/StringConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property, Property } from "jassijs/ui/Property";
import { $Action } from "jassijs/base/Actions";

type Me = {
    boxpanel?: Panel;
    button?: Button;
    button2?: Button;
    textbox?: Textbox;
    table?: Table;
};
@$Class("demo/Dialog2")
export class Dialog2 extends Panel {

    me: Me;

    data:string;
    constructor(data) {
        super();
        this.me = {};
        this.data = data;
        this.layout(this.me);
    }
    layout(me: Me) {
        me.boxpanel = new Panel();
        me.button = new Button();
        me.button2 = new Button();
        me.textbox = new Textbox();
        me.table = new Table({ options:{ data: this.data} });
        var _this = this;
        this.config({ children: [
                me.boxpanel.config({
                    children: [
                        me.button.config({ text: "button", x: 10, y: 50 }),
                        me.button2.config({
                            text: "buw",
                            x: 70,
                            y: 20,
                            icon: "mdi mdi-account-box-outline",
                            onclick: function (event) {
                                alert(6);
                            }
                        }),
                        me.textbox.config({ value: "ee", label: "s", x: 220, y: 10 }),
                        me.table.config({
                            x: 75,
                            y: 70,
                            width: 290,
                            height: 120,
                            label: "wwwsdwe",
                            onblur: function (event) {
                            },
                            tooltip: "wes"
                        })
                    ],
                    isAbsolute: true,
                    height: 215
                })
            ] });
    }
}
function kk() {
    return "kko";
}
export async function test() {
    var data=[{name:"Hans", id:1},{name:"Heinz", id:2}];
    var ret = new Dialog2(data);
    return ret;
}
