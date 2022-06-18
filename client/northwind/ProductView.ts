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
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
type Me = {
    id?: Textbox;
    productName?: Textbox;
    quantityPerUnit?: Textbox;
    unitPrice?: Textbox;
    unitsInStock?: Textbox;
    unitsOnOrder?: Textbox;
    reorderLevel?: Textbox;
    discontinued?: Checkbox;
    category?: HTMLPanel;
    categoryChooser?: ObjectChooser;
    supplier?: HTMLPanel;
    supplierchooser?: ObjectChooser;
    styleNumber?: Style;
   
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Products", actionname: "Northwind/Products", icon: "mdi mdi-reproduction" })
@$Class("northwind.ProductView")
export class ProductView extends DBObjectView {
    declare me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    declare value: Products;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "ProductView" : "ProductView " + this.value.id;
    }
    layout(me: Me) {
        me.id = new Textbox();
        me.styleNumber = new Style();
        me.supplierchooser = new ObjectChooser();
        me.supplier = new HTMLPanel();
        me.categoryChooser = new ObjectChooser();
        me.category = new HTMLPanel();
        me.discontinued = new Checkbox();
        me.reorderLevel = new Textbox();
        me.unitsOnOrder = new Textbox();
        me.unitsInStock = new Textbox();
        me.unitPrice = new Textbox();
        me.quantityPerUnit = new Textbox();
        me.productName = new Textbox();
        this.me.main.config({ isAbsolute: true, width: "678", height: "170", children: [
                me.id.config({
                    x: 10,
                    y: 10,
                    bind: [me.databinder, "id"],
                    label: "Id",
                    width: 65,
                    converter: new NumberConverter()
                }),
                me.styleNumber.config({
                    css: {
                        text_align: "right"
                    }
                }),
                me.supplierchooser.config({
                    x: 460,
                    y: 125,
                    bind: [me.databinder, "Supplier"],
                    items: "northwind.Suppliers"
                }),
                me.supplier.config({
                    x: 225,
                    y: 110,
                    bind: [me.databinder, "Supplier"],
                    value: "New Orleans Cajun Delights",
                    template: "{{CompanyName}}",
                    label: "Supplier",
                    width: 230
                }),
                me.categoryChooser.config({
                    x: 185,
                    y: 125,
                    items: "northwind.Categories",
                    bind: [me.databinder, "Category"],
                    width: 30
                }),
                me.category.config({
                    x: 10,
                    y: 110,
                    template: "{{CategoryName}}",
                    value: "Condiments",
                    bind: [me.databinder, "Category"],
                    width: 170,
                    label: "Category"
                }),
                me.discontinued.config({
                    x: 415,
                    y: 10,
                    width: 70,
                    bind: [me.databinder, "Discontinued"],
                    label: "Discontinued"
                }),
                me.reorderLevel.config({
                    x: 415,
                    y: 60,
                    bind: [me.databinder, "ReorderLevel"],
                    width: 70,
                    label: "Reorder Level",
                    converter: new NumberConverter(),
                    styles: [me.styleNumber]
                }),
                me.unitsOnOrder.config({
                    x: 325,
                    y: 60,
                    bind: [me.databinder, "UnitsOnOrder"],
                    label: "Units on Order",
                    width: 75,
                    converter: new NumberConverter(),
                    format: "#.##0,00",
                    styles: [me.styleNumber]
                }),
                me.unitsInStock.config({
                    x: 240,
                    y: 60,
                    bind: [me.databinder, "UnitsInStock"],
                    label: "Units in Stock",
                    width: 70,
                    converter: new NumberConverter(),
                    format: "#.##0,00",
                    styles: [me.styleNumber]
                }),
                me.unitPrice.config({
                    x: 160,
                    y: 60,
                    bind: [me.databinder, "UnitPrice"],
                    label: "Unit Price",
                    width: 65,
                    converter: new NumberConverter(),
                    format: "#.##0,00",
                    styles: [me.styleNumber]
                }),
                me.quantityPerUnit.config({
                    x: 10,
                    y: 60,
                    bind: [me.databinder, "QuantityPerUnit"],
                    width: 135,
                    label: "Quantity per Unit"
                }),
                me.productName.config({
                    x: 90,
                    y: 10,
                    bind: [me.databinder, "ProductName"],
                    label: "Product Name",
                    width: 310
                })
            ] });
    }
}
export async function test() {
    var ret = new ProductView;
    //var h=await Products.find({relations:["Category"]});
    ret["value"] = <Products>await Products.findOne({ relations: ["*"] });
    return ret;
}
