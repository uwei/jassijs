var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/ui/Checkbox", "jassijs/ui/Textbox", "jassijs/ui/HTMLPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Actions", "jassijs/base/Windows", "northwind/remote/Products", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Component", "jassijs/ui/State"], function (require, exports, Checkbox_1, Textbox_1, HTMLPanel_1, Registry_1, Panel_1, Actions_1, Windows_1, Products_1, NumberConverter_1, Component_1, State_1) {
    "use strict";
    var ProductList_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ProductList = void 0;
    Windows_1 = __importDefault(Windows_1);
    function ProductPanel(props, states) {
        return (0, Component_1.jc)(Panel_1.Panel, {
            children: [
                (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { value: "Product Name:", width: 125 }),
                (0, Component_1.jc)(Textbox_1.Textbox, { bind: states.value.bind.ProductName }),
                (0, Component_1.jc)(Checkbox_1.Checkbox, { text: "Discounted", bind: states.value.bind.Discontinued }),
                (0, Component_1.jc)("br"),
                (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { value: "Quantity Per Unit:", width: 125 }),
                (0, Component_1.jc)(Textbox_1.Textbox, { bind: states.value.bind.QuantityPerUnit }),
                (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { value: "Unit Price:" }),
                (0, Component_1.jc)(Textbox_1.Textbox, {
                    bind: states.value.bind.UnitPrice, converter: new NumberConverter_1.NumberConverter({
                        format: "#.##0,00"
                    })
                }),
                (0, Component_1.jc)("br"),
                (0, Component_1.jc)("br"),
            ]
        });
    }
    let ProductList = ProductList_1 = class ProductList extends Panel_1.Panel {
        constructor(props) {
            super(props);
            this.setData();
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, {
                        value: "Productlist",
                        style: {
                            fontSize: "20px",
                            color: "darkblue"
                        }
                    }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Panel_1.Panel, {
                        children: (0, State_1.foreach)(this.states.values, (ob) => (0, Component_1.jc)(ProductPanel, { value: ob }))
                    })
                ]
            });
        }
        static showDialog() {
            Windows_1.default.add(new ProductList_1(), "ProductList");
        }
        async setData() {
            var all = await Products_1.Products.find({});
            all.sort((a, b) => { return a.ProductName.localeCompare(b.ProductName); });
            this.states.values.current = all;
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
        __metadata("design:paramtypes", [Object])
    ], ProductList);
    exports.ProductList = ProductList;
    async function test() {
        var all = await Products_1.Products.find({});
        all.sort((a, b) => { return a.ProductName.localeCompare(b.ProductName); });
        //this.states.values.current = [all[0]];
        var ret = new ProductList({ values: all });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=ProductList.js.map