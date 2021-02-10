define(["require", "exports", "jassi/ui/Table", "jassi/ui/Button", "jassi/ui/Panel"], function (require, exports, Table_1, Button_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function test() {
        var pan = new Panel_1.Panel();
        var me = {};
        me.button1 = new Button_1.Button();
        me.button2 = new Button_1.Button();
        me.button3 = new Button_1.Button();
        me.table1 = new Table_1.Table();
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
    exports.test = test;
});
//# sourceMappingURL=dd.js.map