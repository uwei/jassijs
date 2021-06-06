import { Checkbox } from "jassijs/ui/Checkbox";
import { Table } from "jassijs/ui/Table";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { Textarea } from "jassijs/ui/Textarea";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Categories } from "northwind/remote/Categories";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
type Me = {
    Id?: Textbox;
    name?: Textbox;
    description?: Textarea;
    boxpanel1?: BoxPanel;
    table1?: Table;
    textbox1?: Textbox;
    panel1?: Panel;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Categories", actionname: "Northwind/Categories", icon: "mdi mdi-cube" })
@$Class("northwind.CategoriesView")
export class CategoriesView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    value: Categories;
    constructor() {
        super();
        // this.me = {}; //this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "CategoriesView" : "CategoriesView " + this.value.id;
    }
   
    layout(me: Me) {
        me.Id = new Textbox();
        me.name = new Textbox();
        me.description = new Textarea();
        me.boxpanel1 = new BoxPanel();
        me.table1 = new Table();
        me.panel1 = new Panel();
        me.main.add(me.boxpanel1);
        me.main.add(me.description);
        me.main.add(me.panel1);
        me.main.add(me.table1);
        me.Id.label = "Id";
        me.Id.bind(me.databinder, "id");
        me.Id.width = 40;
        me.name.bind(me.databinder, "CategoryName");
        me.name.label = "Name";
        me.name.width = 225;
        me.description.height = 70;
        me.description.width = 280;
        me.description.bind(me.databinder, "Description");
        me.description.label = "Description";
        me.boxpanel1.add(me.Id);
        me.boxpanel1.horizontal = true;
        me.boxpanel1.width = 80;
        me.boxpanel1.add(me.name);
        me.table1.height = "100%";
        me.table1.bindItems(me.databinder, "Products");
        me.table1.width = "100%";
    }
}
export async function test() {
    var ret = new CategoriesView();
    ret["value"] = <Categories>await Categories.findOne({ relations: ["*"] });
    return ret;
}
