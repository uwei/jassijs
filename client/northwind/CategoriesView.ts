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
import { DBObjectView,$DBObjectView,DBObjectViewToolbar } from "jassijs/ui/DBObjectView";
import { jc } from "jassijs/ui/Component";
@$DBObjectView({ classname: "northwind.Categories",actionname: "Northwind/Categories",icon: "mdi mdi-cube" })
@$Class("northwind.CategoriesView")
//@$Property({name:"value",componentType:"northwind.Categories", type: "DBObject", isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
@$Property({ name: "aa",type: "string" })
@$Property({ name: "ab",type: "string" })
export class CategoriesView extends DBObjectView<Categories> {
    get title() {
        return this.value===undefined? "CategoriesView":"CategoriesView "+this.value.id;
    }
    render() {
        return jc(Panel,{
            children: [
                jc(DBObjectViewToolbar,{ view: this }),
                jc(Textbox,{
                    label: "Id",
                    bind: this.states.value.bind.id,
                    width: 40,
                    converter: new NumberConverter()
                }),
                jc(Textbox,{
                    label: "Name",
                    bind: this.states.value.bind.CategoryName,
                    width: 235
                }),
                jc("br"),
                jc(Textarea,{
                    label: "Description",
                    bind: this.states.value.bind.Description,
                    width: 280
                }),
                jc(Table,{
                    height: "100%",
                    bindItems: this.states.value.bind.Products,
                    width: "100%"
                }),
            ]
        });
    }
}
export async function test() {
    var ret=new CategoriesView();
    var data=<Categories>await Categories.findOne({relations: ["*"] });
        ret.config({value: data });
        //    ret["value"] = 
        return ret;
}
