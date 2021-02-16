define(["require", "exports", "jassi/ui/ContextMenu", "jassi/ui/MenuItem", "jassi/ui/Table"], function (require, exports, ContextMenu_1, MenuItem_1, Table_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test() {
        var tab = new Table_1.Table({
            movableColumns: true,
            rowDblClick: function () {
                debugger;
                tab.table.setFilter(data => {
                    return data.name === "Mary May";
                }); //rowManager.setActiveRows([tab.table.rowManager.rows[0]]);
                // tab.table.redraw();     
            }
        });
        tab.width = 400;
        var contextmenu = new ContextMenu_1.ContextMenu();
        tab.contextMenu = contextmenu;
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
        var tabledata = [
            { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
            { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
            { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
            { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
            { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
        ];
        tab.items = tabledata;
        tab.selectComponent = { value: "" };
        tab.showSearchbox = true;
        //    var kunden = await jassi.db.load("de.Kunde");
        //   tab.items = kunden;
        return tab;
    }
    exports.test = test;
});
//# sourceMappingURL=TableContextmenu.js.map