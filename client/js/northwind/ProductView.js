var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Style", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Products", "jassijs/ui/DBObjectView"], function (require, exports, Style_1, ObjectChooser_1, HTMLPanel_1, Checkbox_1, NumberConverter_1, Textbox_1, Jassi_1, Property_1, Products_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ProductView = void 0;
    let ProductView = class ProductView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "ProductView" : "ProductView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_1.Textbox();
            me.productName = new Textbox_1.Textbox();
            me.quantityPerUnit = new Textbox_1.Textbox();
            me.unitPrice = new Textbox_1.Textbox();
            me.unitsInStock = new Textbox_1.Textbox();
            me.unitsOnOrder = new Textbox_1.Textbox();
            me.reorderLevel = new Textbox_1.Textbox();
            me.discontinued = new Checkbox_1.Checkbox();
            me.category = new HTMLPanel_1.HTMLPanel();
            me.categoryChooser = new ObjectChooser_1.ObjectChooser();
            me.supplier = new HTMLPanel_1.HTMLPanel();
            me.supplierchooser = new ObjectChooser_1.ObjectChooser();
            me.styleNumber = new Style_1.Style();
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
            me.main.width = 678;
            me.main.height = "170";
            me.id.x = 10;
            me.id.y = 10;
            me.id.bind = [me.databinder, "id"];
            me.id.label = "Id";
            me.id.width = 65;
            me.id.converter = new NumberConverter_1.NumberConverter();
            me.productName.x = 90;
            me.productName.y = 10;
            me.productName.bind = [me.databinder, "ProductName"];
            me.productName.label = "Product Name";
            me.productName.width = 310;
            me.quantityPerUnit.x = 10;
            me.quantityPerUnit.y = 60;
            me.quantityPerUnit.bind = [me.databinder, "QuantityPerUnit"];
            me.quantityPerUnit.width = 135;
            me.quantityPerUnit.label = "Quantity per Unit";
            me.unitPrice.x = 160;
            me.unitPrice.y = 60;
            me.unitPrice.bind = [me.databinder, "UnitPrice"];
            me.unitPrice.label = "Unit Price";
            me.unitPrice.width = 65;
            me.unitPrice.converter = new NumberConverter_1.NumberConverter();
            me.unitPrice.format = "#.##0,00";
            me.unitPrice.styles = [me.styleNumber];
            me.unitsInStock.x = 240;
            me.unitsInStock.y = 60;
            me.unitsInStock.bind = [me.databinder, "UnitsInStock"];
            me.unitsInStock.label = "Units in Stock";
            me.unitsInStock.width = 70;
            me.unitsInStock.converter = new NumberConverter_1.NumberConverter();
            me.unitsInStock.format = "#.##0,00";
            me.unitsInStock.styles = [me.styleNumber];
            me.unitsOnOrder.x = 325;
            me.unitsOnOrder.y = 60;
            me.unitsOnOrder.bind = [me.databinder, "UnitsOnOrder"];
            me.unitsOnOrder.label = "Units on Order";
            me.unitsOnOrder.width = 75;
            me.unitsOnOrder.converter = new NumberConverter_1.NumberConverter();
            me.unitsOnOrder.format = "#.##0,00";
            me.unitsOnOrder.styles = [me.styleNumber];
            me.reorderLevel.x = 415;
            me.reorderLevel.y = 60;
            me.reorderLevel.bind = [me.databinder, "ReorderLevel"];
            me.reorderLevel.width = 70;
            me.reorderLevel.label = "Reorder Level";
            me.reorderLevel.converter = new NumberConverter_1.NumberConverter();
            me.reorderLevel.styles = [me.styleNumber];
            me.discontinued.x = 415;
            me.discontinued.y = 10;
            me.discontinued.width = 70;
            me.discontinued.bind = [me.databinder, "Discontinued"];
            me.discontinued.label = "Discontinued";
            me.category.x = 10;
            me.category.y = 110;
            me.category.template = "{{CategoryName}}";
            me.category.value = "Condiments";
            me.category.bind = [me.databinder, "Category"];
            me.category.width = 170;
            me.category.label = "Category";
            me.categoryChooser.x = 185;
            me.categoryChooser.y = 125;
            me.categoryChooser.items = "northwind.Categories";
            me.categoryChooser.bind = [me.databinder, "Category"];
            me.categoryChooser.width = 30;
            me.supplier.x = 225;
            me.supplier.y = 110;
            me.supplier.bind = [me.databinder, "Supplier"];
            me.supplier.value = "New Orleans Cajun Delights";
            me.supplier.template = "{{CompanyName}}";
            me.supplier.label = "Supplier";
            me.supplier.width = 230;
            me.supplierchooser.x = 460;
            me.supplierchooser.y = 125;
            me.supplierchooser.bind = [me.databinder, "Supplier"];
            me.supplierchooser.items = "northwind.Suppliers";
            me.styleNumber.x = 442;
            me.styleNumber.y = 183;
            me.styleNumber.css = {
                text_align: "right"
            };
            console.log("main " + me.main._id);
            console.log("this " + this._id);
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Products_1.Products)
    ], ProductView.prototype, "value", void 0);
    ProductView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Products", actionname: "Northwind/Products", icon: "mdi mdi-reproduction" }),
        (0, Jassi_1.$Class)("northwind.ProductView"),
        __metadata("design:paramtypes", [])
    ], ProductView);
    exports.ProductView = ProductView;
    async function test() {
        var ret = new ProductView;
        //var h=await Products.find({relations:["Category"]});
        ret["value"] = await Products_1.Products.findOne({ relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=ProductView.js.map