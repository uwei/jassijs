var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Panel", "remote/jassi/base/Jassi", "jassi/ui/Table"], function (require, exports, Panel_1, Jassi_1, Table_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TreeTable = void 0;
    class Person {
        constructor(name, id, childs = undefined) {
            this.name = name;
            this.id = id;
            this.childs = childs;
        }
    }
    let TreeTable = class TreeTable extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {
            //tab:Table
            };
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
                dataTreeChildFunction: function (ob) {
                    return ob.childs;
                }
            });
            me.tab.items = [c];
            me.tab.height = "150";
            me.tab.width = "100%";
            me.tab.items = [c, u];
            this.add(me.tab);
        }
    };
    TreeTable = __decorate([
        Jassi_1.$Class("demo.TreeTable"),
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