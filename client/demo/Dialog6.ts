import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { MyComp,MyCompProp } from "demo/hallo";
import { Component, FunctionComponent, createComponent, jc} from "jassijs/ui/Component";
import { createStates } from "jassijs/ui/State";
import { Button } from "jassijs/ui/Button";
import { Textbox } from "jassijs/ui/Textbox";
import { Table } from "jassijs/ui/Table";

type Me = {
}

@$Class("demo/Dialog6")
export class Dialog6 extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        this.config({});
    }
}


export async function test() {
    var ret = new Dialog6();


    //  var k=MyComp(p);
   // var co = createFunctionComponent(MyComp, { mycolor: "green", mytext: "Hallo" });
    var r=jc(MyComp, { mycolor: "green", mytext: "Hallo" });
    var co=createComponent(r);
    var bt = new Button();

    co.config({ mycolor: "red" });
    ret.add(co);
    return ret;
}