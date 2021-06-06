import {Panel} from "jassijs/ui/Panel";
import jassi from "jassijs/jassi";
import {Tree} from "jassijs/ui/Tree";
import { $Class } from "jassijs/remote/Jassi";

@$Class("demo.TestTree")
export class TestTree extends Panel {

    constructor() {
        super();
        this.layout();
    }
   
    layout() {

    }

}

export async function test() {
    var ret = new Panel();

    var tree = new Tree();
    var s:any = { name: "Sansa", id: 1 };
    var p = { name: "Peter", id: 2 };
    var u = { name: "Uwe", id: 3, childs: [p, s] };
    var t = { name: "Tom", id: 5 };
    var c = { name: "Christoph", id: 4, childs: [u, t] };
    s.childs = [c];
    tree.propDisplay = "name";
    tree.propChilds = "childs";
    tree.propIcon = function (data) {
        if (data.name === "Uwe")
            return "mdi mdi-bed-single";
    };

    tree.items= [c, u];
    tree.width = "100%";
    tree.height = "100px";
    tree.onclick(function (data) {
        console.log("select " + data.data.name);
    });
    ret.add(tree);
    return ret;
}

