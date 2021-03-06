var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/ObjectChooser", "jassi/ui/HTMLPanel", "jassi/ui/Checkbox", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Products", "jassi/ui/DBObjectView"], function (require, exports, ObjectChooser_1, HTMLPanel_1, Checkbox_1, NumberConverter_1, Textbox_1, Jassi_1, Property_1, Products_1, DBObjectView_1) {
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
            me.checkbox1 = new Checkbox_1.Checkbox();
            me.category = new HTMLPanel_1.HTMLPanel();
            me.categoryChooser = new ObjectChooser_1.ObjectChooser();
            me.supplier = new HTMLPanel_1.HTMLPanel();
            me.supplierchooser = new ObjectChooser_1.ObjectChooser();
            me.main.add(me.id);
            me.main.isAbsolute = true;
            me.main.x = 15;
            me.main.y = 105;
            me.main.add(me.supplierchooser);
            me.main.add(me.supplier);
            me.main.add(me.categoryChooser);
            me.main.add(me.category);
            me.main.add(me.checkbox1);
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
            me.id.converter = new NumberConverter_1.NumberConverter();
            me.productName.x = 92;
            me.productName.y = 12;
            me.productName.bind(me.databinder, "ProductName");
            me.productName.label = "Product Name";
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
            me.unitPrice.converter = new NumberConverter_1.NumberConverter();
            me.unitsInStock.x = 240;
            me.unitsInStock.y = 60;
            me.unitsInStock.bind(me.databinder, "UnitsInStock");
            me.unitsInStock.label = "Units in Stock";
            me.unitsInStock.width = 70;
            me.unitsInStock.converter = new NumberConverter_1.NumberConverter();
            me.unitsOnOrder.x = 325;
            me.unitsOnOrder.y = 60;
            me.unitsOnOrder.bind(me.databinder, "UnitsOnOrder");
            me.unitsOnOrder.label = "Units on Order";
            me.unitsOnOrder.width = 75;
            me.unitsOnOrder.converter = new NumberConverter_1.NumberConverter();
            me.reorderLevel.x = 415;
            me.reorderLevel.y = 60;
            me.reorderLevel.bind(me.databinder, "ReorderLevel");
            me.reorderLevel.width = 70;
            me.reorderLevel.label = "Reorder Level";
            me.reorderLevel.converter = new NumberConverter_1.NumberConverter();
            me.checkbox1.x = 268;
            me.checkbox1.y = 18;
            me.checkbox1.width = 15;
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
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Products_1.Products)
    ], ProductView.prototype, "value", void 0);
    ProductView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.Products" }),
        Jassi_1.$Class("northwind.ProductView"),
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