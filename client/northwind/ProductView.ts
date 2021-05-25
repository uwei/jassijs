import { Style } from "jassi/ui/Style";
import { ObjectChooser } from "jassi/ui/ObjectChooser";
import { HTMLPanel } from "jassi/ui/HTMLPanel";
import { Checkbox } from "jassi/ui/Checkbox";
import { NumberConverter } from "jassi/ui/converters/NumberConverter";
import { Textbox } from "jassi/ui/Textbox";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { Products } from "northwind/remote/Products";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";
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
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: Products;
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
        me.productName = new Textbox();
        me.quantityPerUnit = new Textbox();
        me.unitPrice = new Textbox();
        me.unitsInStock = new Textbox();
        me.unitsOnOrder = new Textbox();
        me.reorderLevel = new Textbox();
        me.discontinued = new Checkbox();
        me.category = new HTMLPanel();
        me.categoryChooser = new ObjectChooser();
        me.supplier = new HTMLPanel();
        me.supplierchooser = new ObjectChooser();
        me.styleNumber = new Style();
        me.main.add(me.id);
        me.main.isAbsolute = true;
        me.main.add(me.styleNumber);
        me.main.add(me.supplierchooser);
        me.main.add(me.supplier);
        me.main.add(me.categoryChooser);
        me.main.add(me.category);
        me.main.add(me.discontinued);
        me.main.add(me.reorderLevel);
        me.main.add(me.unitsOnOrder);
        me.main.add(me.unitsInStock);
        me.main.add(me.unitPrice);
        me.main.add(me.quantityPerUnit);
        me.main.add(me.productName);
        this.width = 678;
        this.height = 220;
        me.id.x = 10;
        me.id.y = 10;
        me.id.bind(me.databinder, "id");
        me.id.label = "Id";
        me.id.width = 65;
        me.id.converter = new NumberConverter();
        me.productName.x = 90;
        me.productName.y = 10;
        me.productName.bind(me.databinder, "ProductName");
        me.productName.label = "Product Name";
        me.productName.width = 310;
        me.quantityPerUnit.x = 10;
        me.quantityPerUnit.y = 60;
        me.quantityPerUnit.bind(me.databinder, "QuantityPerUnit");
        me.quantityPerUnit.width = 135;
        me.quantityPerUnit.label = "Quantity per Unit";
        me.unitPrice.x = 160;
        me.unitPrice.y = 60;
        me.unitPrice.bind(me.databinder, "UnitPrice");
        me.unitPrice.label = "Unit Price";
        me.unitPrice.width = 65;
        me.unitPrice.converter = new NumberConverter();
        me.unitPrice.format = "#.##0,00";
        me.unitPrice.styles = [me.styleNumber];
        me.unitsInStock.x = 240;
        me.unitsInStock.y = 60;
        me.unitsInStock.bind(me.databinder, "UnitsInStock");
        me.unitsInStock.label = "Units in Stock";
        me.unitsInStock.width = 70;
        me.unitsInStock.converter = new NumberConverter();
        me.unitsInStock.format = "#.##0,00";
        me.unitsInStock.styles = [me.styleNumber];
        me.unitsOnOrder.x = 325;
        me.unitsOnOrder.y = 60;
        me.unitsOnOrder.bind(me.databinder, "UnitsOnOrder");
        me.unitsOnOrder.label = "Units on Order";
        me.unitsOnOrder.width = 75;
        me.unitsOnOrder.converter = new NumberConverter();
        me.unitsOnOrder.format = "#.##0,00";
        me.unitsOnOrder.styles = [me.styleNumber];
        me.reorderLevel.x = 415;
        me.reorderLevel.y = 60;
        me.reorderLevel.bind(me.databinder, "ReorderLevel");
        me.reorderLevel.width = 70;
        me.reorderLevel.label = "Reorder Level";
        me.reorderLevel.converter = new NumberConverter();
        me.reorderLevel.styles = [me.styleNumber];
        me.discontinued.x = 415;
        me.discontinued.y = 10;
        me.discontinued.width = 70;
        me.discontinued.bind(me.databinder, "Discontinued");
        me.discontinued.label = "Discontinued";
        me.category.x = 10;
        me.category.y = 110;
        me.category.template = "{{CategoryName}}";
        me.category.value = "Condiments";
        me.category.bind(me.databinder, "Category");
        me.category.width = 170;
        me.category.label = "Category";
        me.categoryChooser.x = 185;
        me.categoryChooser.y = 125;
        me.categoryChooser.items = "northwind.Categories";
        me.categoryChooser.bind(me.databinder, "Category");
        me.categoryChooser.width = 30;
        me.supplier.x = 225;
        me.supplier.y = 110;
        me.supplier.bind(me.databinder, "Supplier");
        me.supplier.value = "New Orleans Cajun Delights";
        me.supplier.template = "{{CompanyName}}";
        me.supplier.label = "Supplier";
        me.supplier.width = 230;
        me.supplierchooser.x = 460;
        me.supplierchooser.y = 125;
        me.supplierchooser.bind(me.databinder, "Supplier");
        me.supplierchooser.items = "northwind.Suppliers";
        me.styleNumber.x = 442;
        me.styleNumber.y = 183;
        me.styleNumber.css({
            text_align: "right"
        });
    }
}
export async function test() {
    var ret = new ProductView;
    //var h=await Products.find({relations:["Category"]});
    ret["value"] = <Products>await Products.findOne({ relations: ["*"] });
    return ret;
}
