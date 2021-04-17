var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Panel", "jassi/ui/Tree", "jassi/remote/Jassi"], function (require, exports, Panel_1, Tree_1, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestTree = void 0;
    let TestTree = class TestTree extends Panel_1.Panel {
        constructor() {
            super();
            this.layout();
        }
        layout() {
        }
    };
    TestTree = __decorate([
        Jassi_1.$Class("demo.TestTree"),
        __metadata("design:paramtypes", [])
    ], TestTree);
    exports.TestTree = TestTree;
    async function test() {
        var ret = new Panel_1.Panel();
        var tree = new Tree_1.Tree();
        var s = { name: "Sansa", id: 1 };
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
        tree.items = [c, u];
        tree.width = "100%";
        tree.height = "100px";
        tree.onclick(function (data) {
            console.log("select " + data.data.name);
        });
        ret.add(tree);
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=TestTree.js.map
//# sourceMappingURL=TestTree.js.map