var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Style", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Products", "jassijs/ui/DBObjectView"], function (require, exports, Style_1, ObjectChooser_1, HTMLPanel_1, Checkbox_1, NumberConverter_1, Textbox_1, Registry_1, Property_1, Products_1, DBObjectView_1) {
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
            me.styleNumber = new Style_1.Style();
            me.supplierchooser = new ObjectChooser_1.ObjectChooser();
            me.supplier = new HTMLPanel_1.HTMLPanel();
            me.categoryChooser = new ObjectChooser_1.ObjectChooser();
            me.category = new HTMLPanel_1.HTMLPanel();
            me.discontinued = new Checkbox_1.Checkbox();
            me.reorderLevel = new Textbox_1.Textbox();
            me.unitsOnOrder = new Textbox_1.Textbox();
            me.unitsInStock = new Textbox_1.Textbox();
            me.unitPrice = new Textbox_1.Textbox();
            me.quantityPerUnit = new Textbox_1.Textbox();
            me.productName = new Textbox_1.Textbox();
            this.me.main.config({ isAbsolute: true, width: "678", height: "170", children: [
                    me.id.config({
                        x: 10,
                        y: 10,
                        bind: [me.databinder, "id"],
                        label: "Id",
                        width: 65,
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    me.productName.config({
                        x: 90,
                        y: 10,
                        bind: [me.databinder, "ProductName"],
                        label: "Product Name",
                        width: 310
                    }),
                    me.discontinued.config({
                        x: 415,
                        y: 10,
                        width: 70,
                        bind: [me.databinder, "Discontinued"],
                        label: "Discontinued"
                    }),
                    me.quantityPerUnit.config({
                        x: 10,
                        y: 60,
                        bind: [me.databinder, "QuantityPerUnit"],
                        width: 135,
                        label: "Quantity per Unit"
                    }),
                    me.unitPrice.config({
                        x: 160,
                        y: 60,
                        bind: [me.databinder, "UnitPrice"],
                        label: "Unit Price",
                        width: 65,
                        converter: new NumberConverter_1.NumberConverter({ format: "#.##0,00" }),
                        styles: [me.styleNumber]
                    }),
                    me.unitsInStock.config({
                        x: 240,
                        y: 60,
                        bind: [me.databinder, "UnitsInStock"],
                        label: "Units in Stock",
                        width: 70,
                        converter: new NumberConverter_1.NumberConverter({ format: "#.##0,00" }),
                        styles: [me.styleNumber]
                    }),
                    me.unitsOnOrder.config({
                        x: 325,
                        y: 60,
                        bind: [me.databinder, "UnitsOnOrder"],
                        label: "Units on Order",
                        width: 75,
                        converter: new NumberConverter_1.NumberConverter({ format: "#.##0,00" }),
                        styles: [me.styleNumber]
                    }),
                    me.reorderLevel.config({
                        x: 415,
                        y: 60,
                        bind: [me.databinder, "ReorderLevel"],
                        width: 70,
                        label: "Reorder Level",
                        converter: new NumberConverter_1.NumberConverter(),
                        styles: [me.styleNumber]
                    }),
                    me.category.config({
                        x: 10,
                        y: 110,
                        template: "{{CategoryName}}",
                        value: "Beverages",
                        bind: [me.databinder, "Category"],
                        width: 170,
                        label: "Category"
                    }),
                    me.categoryChooser.config({
                        x: 185,
                        y: 125,
                        items: "northwind.Categories",
                        bind: [me.databinder, "Category"],
                        width: 30,
                        value: "Beverages"
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
                    me.supplierchooser.config({
                        x: 460,
                        y: 125,
                        bind: [me.databinder, "Supplier"],
                        items: "northwind.Suppliers"
                    }),
                    me.styleNumber.config({
                        style: {
                            textAlign: "right"
                        }
                    })
                ] });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Products_1.Products)
    ], ProductView.prototype, "value", void 0);
    ProductView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Products", actionname: "Northwind/Products", icon: "mdi mdi-reproduction" }),
        (0, Registry_1.$Class)("northwind.ProductView"),
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