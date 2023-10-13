import { Tree } from "jassijs/ui/Tree";
import { ContextMenu } from "jassijs/ui/ContextMenu";
import { MenuItem } from "jassijs/ui/MenuItem";
import { Table } from "jassijs/ui/Table";

export async function test() {
    var tabledata = [
        { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
        { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
        { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
        { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
        { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
    ];
    var tab = new Table(
        {
            options: {
                movableColumns: true,
                items: tabledata
            }
        });
    tab.width = 400;
    tab.table.on("rowDblClick", function () {
        tab.table.setFilter(data => {
            return data.name === "Mary May";
        });   //rowManager.setActiveRows([tab.table.rowManager.rows[0]]);
        // tab.table.redraw();     

    });
    var contextmenu = new ContextMenu();
    tab.contextMenu = contextmenu;
    var menu = new MenuItem();
    menu.text = "static menu";
    menu.onclick(function (ob) {
        alert(contextmenu.value[0].name + "clicked");
    })
    contextmenu.menu.add(menu);
    contextmenu.getActions = async function (obs) {
        return [{
            name: "custom Action", call: function (data) {
                alert(data[0].name)
            }
        }]
    }



    tab.selectComponent = { value: "" };
    tab.showSearchbox = true;


    //    var kunden = await jassijs.db.load("de.Kunde");
    //   tab.items = kunden;

    return tab;

}