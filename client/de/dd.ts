import { Table } from "jassi/ui/Table";
import { Button } from "jassi/ui/Button";
import { Panel } from "jassi/ui/Panel";
import { Textbox } from "jassi/ui/Textbox";
type Me = {
    button1?: Button;
    button2?: Button;
    button3?: Button;
    table1?: Table;
};
export function test() {
    var pan = new Panel();
    var me: Me = {};
    me.button1 = new Button();
    me.button2 = new Button();
    me.button3 = new Button();
    me.table1 = new Table();
    me.table1.width = 150;
    pan["me"] = me;
    pan.add(me.table1);
    pan.isAbsolute = false;
    pan.add(me.button1);
    pan.add(me.button2);
    pan.add(me.button3);
    me.button1.text = "button";
    me.button1.onclick(function (event) {
    });
    me.button2.text = "button";
    me.button3.text = "buttonss";
    me.button3.onclick(function (event) {
    });
    return pan;
}
