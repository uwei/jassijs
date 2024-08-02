var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Products", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, ObjectChooser_1, HTMLPanel_1, Checkbox_1, NumberConverter_1, Textbox_1, Registry_1, Panel_1, Products_1, DBObjectView_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ProductView = void 0;
    let ProductView = class ProductView extends DBObjectView_1.DBObjectView {
        //@$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
        //declare value: Products;
        get title() {
            return this.value === undefined ? "ProductView" : "ProductView " + this.value.id;
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Id", bind: this.states.value.bind.id, converter: new NumberConverter_1.NumberConverter() }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.states.value.bind.ProductName, label: "Product Name", width: 375, height: 25 }),
                    (0, Component_1.jc)(Checkbox_1.Checkbox, { label: "Discounted", bind: this.states.value.bind.Discontinued }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Quantity per Unit", bind: this.states.value.bind.QuantityPerUnit }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.states.value.bind.UnitPrice, converter: new NumberConverter_1.NumberConverter({
                            format: "#.##0,00"
                        }), label: "Unit Price",
                        width: 70
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Units in Stock", bind: this.states.value.bind.UnitsInStock, converter: new NumberConverter_1.NumberConverter({
                            format: "#.##0,00"
                        }), width: 80
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.states.value.bind.UnitsOnOrder, converter: new NumberConverter_1.NumberConverter({
                            format: "#.##0,00"
                        }), label: "Units on Order", width: 80
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.states.value.bind.ReorderLevel, label: "Reorder Level", width: 185 }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { label: "Category", bind: this.states.value.bind.Category.CategoryName, width: 245 }),
                    (0, Component_1.jc)(ObjectChooser_1.ObjectChooser, { bind: this.states.value.bind.Category, items: "northwind.Categories" }),
                    (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { label: "Supplier", bind: this.states.value.bind.Supplier.CompanyName, width: 310 }),
                    (0, Component_1.jc)(ObjectChooser_1.ObjectChooser, { bind: this.states.value.bind.Supplier, items: "northwind.Suppliers" })
                ]
            });
        }
    };
    ProductView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Products", actionname: "Northwind/Products", icon: "mdi mdi-reproduction" }),
        (0, Registry_1.$Class)("northwind.ProductView")
    ], ProductView);
    exports.ProductView = ProductView;
    async function test() {
        var prod = await Products_1.Products.findOne({ relations: ["*"] });
        var ret = new ProductView({
            value: prod
        });
        //var h=await Products.find({relations:["Category"]});
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=ProductView.js.map