import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Table } from "jassijs/ui/Table";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { Textarea } from "jassijs/ui/Textarea";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Categories } from "northwind/remote/Categories";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
type Me = {
    boxpanel1?: BoxPanel;
    Id?: Textbox;
    name?: Textbox;
    description?: Textarea;
    panel1?: Panel;
    table1?: Table;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Categories", actionname: "Northwind/Categories", icon: "mdi mdi-cube" })
@$Class("northwind.CategoriesView")
export class CategoriesView extends DBObjectView {
    declare me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    declare value: Categories;
    constructor(config) {
        super();
        // this.me = {}; //this is called in objectdialog
        this.layout(this.me);

    }
    get title() {
        return this.value === undefined ? "CategoriesView" : "CategoriesView " + this.value.id;
    }
    layout(me: Me) {
        me.boxpanel1 = new BoxPanel();
        me.Id = new Textbox();
        me.name = new Textbox();
        me.description = new Textarea();
        me.panel1 = new Panel();
        me.table1 = new Table({data:this.value});
        this.me.main.config({ children: [
                me.boxpanel1.config({
                    children: [
                        me.Id.config({
                            label: "Id",
                            bind: [me.databinder, "id"],
                            width: 40,
                            converter: new NumberConverter()
                        }),
                        me.name.config({
                            bind: [me.databinder, "CategoryName"],
                            label: "Name",
                            width: 225
                        })
                    ],
                    width: 80,
                    horizontal: true
                }),
                me.description.config({
                    height: 70,
                    width: 280,
                    bind: [me.databinder, "Description"],
                    label: "Description"
                }),
                me.panel1.config({}),
                me.table1.config({
                    height: "100%",
                    bindItems: [me.databinder, "Products"],
                    width: "100%",
                    tooltip: "e"
                })
            ] });
    }
}
export async function test() {
    var ret = new CategoriesView();
    var data = <Categories>await Categories.findOne({ relations: ["*"] });
    ret.config({ value: data });
    //    ret["value"] = 
    return ret;
}
