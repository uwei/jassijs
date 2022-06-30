var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Checkbox", "jassijs/ui/Textbox", "jassijs/ui/Repeater", "jassijs/ui/BoxPanel", "jassijs/ui/HTMLPanel", "jassijs/ui/Databinder", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Actions", "jassijs/base/Windows", "northwind/remote/Products"], function (require, exports, Checkbox_1, Textbox_1, Repeater_1, BoxPanel_1, HTMLPanel_1, Databinder_1, Registry_1, Panel_1, Actions_1, Windows_1, Products_1) {
    "use strict";
    var ProductList_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ProductList = void 0;
    let ProductList = ProductList_1 = class ProductList extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            var _this = this;
            me.databinder = new Databinder_1.Databinder();
            me.repeater = new Repeater_1.Repeater();
            this.config({
                children: [
                    me.databinder.config({}),
                    me.repeater.config({
                        isAbsolute: false,
                        bind: [me.databinder, "this"],
                        createRepeatingComponent: function (me) {
                            me.textbox = new Textbox_1.Textbox();
                            me.htmlpanel = new HTMLPanel_1.HTMLPanel();
                            me.checkbox = new Checkbox_1.Checkbox();
                            me.htmlpanel3 = new HTMLPanel_1.HTMLPanel();
                            me.boxpanel = new BoxPanel_1.BoxPanel();
                            me.panel = new Panel_1.Panel();
                            me.boxpanel2 = new BoxPanel_1.BoxPanel();
                            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
                            me.textbox2 = new Textbox_1.Textbox();
                            me.htmlpanel22 = new HTMLPanel_1.HTMLPanel();
                            me.textbox22 = new Textbox_1.Textbox();
                            me.repeater.design.config({ children: [
                                    me.htmlpanel3.config({ value: " " }),
                                    me.boxpanel.config({
                                        children: [
                                            me.htmlpanel.config({ value: "Product Name:", width: "150" }),
                                            me.textbox.config({
                                                bind: [me.repeater.design.databinder, "ProductName"],
                                                readOnly: true,
                                                width: 290
                                            }),
                                            me.checkbox.config({
                                                bind: [me.repeater.design.databinder, "Discontinued"],
                                                text: "Discontinued"
                                            }),
                                            me.panel.config({})
                                        ],
                                        horizontal: true
                                    }),
                                    me.boxpanel2.config({
                                        children: [
                                            me.htmlpanel2.config({ value: "Quantity Per Unit:", width: "150" }),
                                            me.textbox2.config({
                                                readOnly: true,
                                                width: 175,
                                                bind: [me.repeater.design.databinder, "QuantityPerUnit"]
                                            }),
                                            me.htmlpanel22.config({ value: "&nbsp; &nbsp; &nbsp;Unit Price:", width: 110 }),
                                            me.textbox22.config({
                                                readOnly: true,
                                                width: 100,
                                                bind: [me.repeater.design.databinder, "UnitPrice"],
                                                format: "$ #.##0,00"
                                            })
                                        ],
                                        horizontal: true
                                    })
                                ] });
                        }
                    })
                ]
            });
            this.setData();
        }
        static showDialog() {
            Windows_1.default.add(new ProductList_1(), "ProductList");
        }
        async setData() {
            var all = await Products_1.Products.find({});
            all.sort((a, b) => { return a.ProductName.localeCompare(b.ProductName); });
            this.me.databinder.value = all;
            //        this.me.IDChooseCustomer.items = all;
            //      this.me.databinderCustomer.value = all[0];
        }
    };
    __decorate([
        (0, Actions_1.$Action)({ name: "Northwind/Product List", icon: "mdi mdi-reproduction" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ProductList, "showDialog", null);
    ProductList = ProductList_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("northwind/ProductList"),
        __metadata("design:paramtypes", [])
    ], ProductList);
    exports.ProductList = ProductList;
    async function test() {
        var ret = new ProductList();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=ProductList.js.map