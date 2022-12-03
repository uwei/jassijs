define(["require", "exports", "jassijs/ui/Tree", "jassijs/ui/ContextMenu", "jassijs/ui/MenuItem", "jassijs/ui/Panel", "jassijs/ui/Button"], function (require, exports, Tree_1, ContextMenu_1, MenuItem_1, Panel_1, Button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class Me {
    }
    async function test() {
        var s = { name: "Sansa", id: 1 };
        var p = { name: "Peter", id: 2 };
        var u = { name: "Uwe", id: 3, childs: [p, s] };
        var t = { name: "Tom", id: 5 };
        var c = { name: "Christoph", id: 4, childs: [u, t] };
        var me = new Me();
        me.tree = new Tree_1.Tree({
            checkbox: true,
            selectMode: 2,
        });
        me.panel = new Panel_1.Panel();
        me.button = new Button_1.Button();
        me.panel["me"] = me;
        me.panel.add(me.tree);
        me.panel.add(me.button);
        s.childs = [c];
        me.tree.propDisplay = "name";
        me.tree.propChilds = "childs";
        me.tree.propIcon = function (data) {
            if (data.name === "Uwe")
                return "mdi mdi-car";
        };
        me.tree.width = "100%";
        me.tree.height = 175;
        var contextmenu = new ContextMenu_1.ContextMenu();
        me.tree.contextMenu = contextmenu;
        var menu = new MenuItem_1.MenuItem();
        menu.text = "static menu";
        menu.onclick(function (ob) {
            alert(contextmenu.value[0].name + "clicked");
        });
        contextmenu.menu.add(menu);
        contextmenu.getActions = async function (obs) {
            return [{ name: "custom Action", call: function (data) {
                        alert(data[0].name);
                    } }];
        };
        me.tree.items = [c, u];
        me.tree.expandAll();
        me.tree.onclick(function (event, data) {
            //alert(event.selection[0].name);
        });
        me.button.text = "Test";
        me.button.onclick(() => {
            var h = me.tree.selection;
        });
        return me.panel;
    }
    exports.test = test;
});
//# sourceMappingURL=TreeContextmenu.js.map