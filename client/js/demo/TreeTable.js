var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/ui/Table"], function (require, exports, Panel_1, Registry_1, Table_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TreeTable = void 0;
    class Person {
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
    }
    ;
    let TreeTable = class TreeTable extends Panel_1.Panel {
        constructor() {
            super();
            this.me = new Me();
            this.layout(this.me);
        }
        layout(me) {
            var s = new Person("Sophie", 1);
            var p = new Person("Phillip", 2);
            var u = new Person("Udo", 3, [p, s]);
            var t = new Person("Thomas", 5);
            var c = new Person("Christoph", 4, [u, t]);
            s.childs = [c];
            me.tab = new Table_1.Table({
                items: [c],
                dataTreeChildFunction: "t"
            });
            me.tab.height = "150";
            me.tab.width = "100%";
            //me.tab.items = [c, u];
            this.add(me.tab);
        }
        layoutalt(me) {
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
                me.tab = new Table_1.Table({
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
                    /*dataTreeChildFunction1: function (ob) {
                        return ob.childs;
                    }*/
                });
                var data = [c];
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
    };
    TreeTable = __decorate([
        (0, Registry_1.$Class)("demo.TreeTable"),
        __metadata("design:paramtypes", [])
    ], TreeTable);
    exports.TreeTable = TreeTable;
    async function test() {
        var tab = new TreeTable();
        //test
        return tab;
    }
    exports.test = test;
});
//# sourceMappingURL=TreeTable.js.map