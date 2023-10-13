import { Panel } from "jassijs/ui/Panel";

import { $Class } from "jassijs/remote/Registry";
import { Table } from "jassijs/ui/Table";

class Person {
    name;
    id;
    childs;
    t() {
        return this.childs;
    }
    constructor(name, id, childs = undefined) {
        this.name = name;
        this.id = id;
        this.childs = childs;
    }

}
class Me {
    tab: Table
};

@$Class("demo.TreeTable")
export class TreeTable extends Panel {
    me = new Me();
    constructor() {
        super();
        this.layout(this.me);

    }
    layout(me: Me) {


        var s = new Person("Sophie", 1);
        var p = new Person("Phillip", 2);
        var u = new Person("Udo", 3, [p, s]);
        var t = new Person("Thomas", 5);
        var c = new Person("Christoph", 4, [u, t]);

        s.childs = [c];

        me.tab = new Table({
            options: {
                items: [c],
                dataTreeChildFunction: "t"
            }

        });

        me.tab.height = "150";
        me.tab.width = "100%";
        //me.tab.items = [c, u];

        this.add(me.tab);
    }
    layoutalt(me: Me) {


        var s = new Person("Sophie", 1);
        var p = new Person("Phillip", 2);
        var u = new Person("Udo", 3, [p, s]);
        var t = new Person("Thomas", 5);
        var c = new Person("Christoph", 4, [u, t]);

        s.childs = [c];
        function populateData(data) {
            var childs = data["childs"];
            if (childs && childs.length > 0) {
                Object.defineProperty(data, "__treechilds", {
                    configurable: true,
                    get: function () {
                        return childs;
                    }
                });
                for (var x = 0; x < childs.length; x++) {
                    var nchilds = childs[x]["childs"];
                    if (nchilds && nchilds.length > 0) {
                        Object.defineProperty(childs[x], "__treechilds", {
                            configurable: true,
                            get: function () {
                                return ["dummy"];
                            }
                        });
                    }
                }

            }

            me.tab = new Table({
                options: {
                    dataTree: true,
                    dataTreeChildField: "__treechilds",
                    dataTreeRowExpanded: function (row) {
                        let childs = row.getData()["childs"];
                        for (let f = 0; f < childs.length; f++) {
                            populateData(childs[f]);

                        }
                        row.update(row.getData());
                        /* var chs = row.getTreeChildren();
                        for (let x = 0; x < chs.length; x++) {
                            let r = chs[x];
                            var dat = r.getData();
                            let test=dat.__treechilds;
                            r.update(dat);
        
                        }
                        row.update(row.getData());*/
                    }
                }
                /*dataTreeChildFunction1: function (ob) {
                    return ob.childs;
                }*/


            });
            var data = <any>[c];

            for (var x = 0; x < data.length; x++) {
                populateData(data[x]);
            }
            me.tab.items = data;
            me.tab.height = "150";
            me.tab.width = "100%";
            //me.tab.items = [c, u];

            this.add(me.tab);
        }
    }
}
export async function test() {
    var tab = new TreeTable();
    //test
    return tab;
}



