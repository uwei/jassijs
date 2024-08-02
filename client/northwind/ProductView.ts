import { HTMLComponent } from "jassijs/ui/Component";
import { Style } from "jassijs/ui/Style";
import { ObjectChooser } from "jassijs/ui/ObjectChooser";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Checkbox } from "jassijs/ui/Checkbox";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Products } from "northwind/remote/Products";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView,$DBObjectView,DBObjectViewMe, DBObjectViewToolbar } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
import { jc } from "jassijs/ui/Component";
@$DBObjectView({ classname: "northwind.Products",actionname: "Northwind/Products",icon: "mdi mdi-reproduction" })
@$Class("northwind.ProductView")
export class ProductView extends DBObjectView<Products> {
    //@$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    //declare value: Products;
    get title() {
        return this.value===undefined? "ProductView":"ProductView "+this.value.id;
    }
    render() {
        return jc(Panel,{
            children: [
                jc(DBObjectViewToolbar,{ view: this }),
                jc(Textbox,{ label: "Id",bind: this.states.value.bind.id,converter: new NumberConverter() }),
                jc(Textbox,{ bind: this.states.value.bind.ProductName,label: "Product Name",width: 375,height: 25 }),
                jc(Checkbox,{ label: "Discounted",bind: this.states.value.bind.Discontinued }),
                jc("br",{}),
                jc(Textbox,{ label: "Quantity per Unit",bind: this.states.value.bind.QuantityPerUnit }),
                jc(Textbox,{
                    bind: this.states.value.bind.UnitPrice,converter: new NumberConverter({
                        format: "#.##0,00"
                    }),label: "Unit Price",
                    width: 70
                }),
                jc(Textbox,{
                    label: "Units in Stock",bind: this.states.value.bind.UnitsInStock,converter: new NumberConverter({
                        format: "#.##0,00"
                    }),width: 80
                }),
                jc(Textbox,{
                    bind: this.states.value.bind.UnitsOnOrder,converter: new NumberConverter({
                        format: "#.##0,00"
                    }),label: "Units on Order",width: 80
                }),
                jc(Textbox,{ bind: this.states.value.bind.ReorderLevel,label: "Reorder Level",width: 185 }),
                jc("br",{}),
                jc(HTMLPanel,{ label: "Category",bind: this.states.value.bind.Category.CategoryName,width: 245 }),
                jc(ObjectChooser,{ bind: this.states.value.bind.Category,items: "northwind.Categories" }),
                jc(HTMLPanel,{ label: "Supplier",bind: this.states.value.bind.Supplier.CompanyName,width: 310 }),
                jc(ObjectChooser,{ bind: this.states.value.bind.Supplier,items: "northwind.Suppliers" })
            ]
        });
    }
}
export async function test() {
    var prod=<Products>await Products.findOne({relations: ["*"] });
        var ret = new ProductView({
            value: prod
    });
    //var h=await Products.find({relations:["Category"]});
        return ret;
}
