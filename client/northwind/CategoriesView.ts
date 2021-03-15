import { Textarea } from "jassi/ui/Textarea";
import { Textbox } from "jassi/ui/Textbox";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { Categories } from "northwind/remote/Categories";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";
type Me = {
    Id?: Textbox;
    name?: Textbox;
    description?: Textarea;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Categories",actionname: "Northwind/Categories", icon:"mdi mdi-cube" })
@$Class("northwind.CategoriesView")
export class CategoriesView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: Categories;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "CategoriesView" : "CategoriesView " + this.value.id;
    }
    layout(me: Me) {
        me.Id = new Textbox();
        me.name = new Textbox();
        me.description = new Textarea();
        me.main.add(me.Id);
        me.main.isAbsolute = true;
        me.main.add(me.description);
        me.main.add(me.name);
        this.width = 626;
        this.height = 178;
        me.Id.x = 5;
        me.Id.y = 5;
        me.Id.label = "Id";
        me.Id.bind(me.databinder, "id");
        me.Id.width = 65;
        me.name.x = 85;
        me.name.y = 5;
        me.name.bind(me.databinder, "CategoryName");
        me.name.label = "Name";
        me.name.width = 180;
        me.description.x = 5;
        me.description.y = 60;
        me.description.height = 35;
        me.description.width = 260;
        me.description.bind(me.databinder, "Description");
        me.description.label = "Description";
    }
}
export async function test() {
    var ret = new CategoriesView;
    ret["value"] = <Categories>await Categories.findOne();
    return ret;
}
