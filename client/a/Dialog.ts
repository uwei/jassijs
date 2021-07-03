import { MenuItem } from "jassijs/ui/MenuItem";
import { Menu } from "jassijs/ui/Menu";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Textbox } from "jassijs/ui/Textbox";
import { Button } from "jassijs/ui/Button";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Style } from "jassijs/ui/Style";
import windows from "jassijs/base/Windows";
import { FileExplorer } from "jassijs/ui/FileExplorer";
//test
type Me = {
    htmlpanel1?: HTMLPanel;
    htmlpanel2?: HTMLPanel;
    boxpanel1?: BoxPanel;
    button2?: Button;
    button4?: Button;
    button7?: Button;
    textbox3?: Textbox;
    textbox4?: Textbox;
    checkbox1?: Checkbox;
    panel1?: Panel;
    button3?: Button;
    button5?: Button;
    checkbox2?: Checkbox;
    menuitem2?: MenuItem;
};
@$Class("$/Dialog")
export class Dialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.panel1 = new Panel();
        me.button3 = new Button();
        me.button5 = new Button();
        me.checkbox2 = new Checkbox();
        me.menuitem2 = new MenuItem();
        jassijs.includeCSS("kkkk", {
            ".ui-state-highlight": {
                border: "3px solid yellow"
            }
        });
        me.htmlpanel1 = new HTMLPanel();
        me.htmlpanel2 = new HTMLPanel();
        me.boxpanel1 = new BoxPanel();
        me.button2 = new Button();
        me.button4 = new Button();
        me.button7 = new Button();
        me.textbox3 = new Textbox();
        me.textbox4 = new Textbox();
        me.checkbox1 = new Checkbox();
        me.boxpanel1.add(me.button7);
        me.boxpanel1.add(me.checkbox2);
        me.boxpanel1.add(me.panel1);
        me.boxpanel1.add(me.button3);
        this.add(me.boxpanel1);
        this.add(me.htmlpanel1);
        this.add(me.htmlpanel2);
        me.htmlpanel1.value = "";
        me.htmlpanel1.newlineafter = false;
        me.htmlpanel1.height = 15;
        me.htmlpanel2.value = "dd";
        me.button7.text = "dfdf";
        me.button7.width = "150";
        me.button3.text = "button";
        me.menuitem2.text = "menu";
    }
}
export async function test() {
   
    //windows.addLeft(new FileExplorer(), "Files");
    var ret = new Dialog();
    //  	var h=monaco.languages.typescript.typescriptDefaults;
    return ret;
}
