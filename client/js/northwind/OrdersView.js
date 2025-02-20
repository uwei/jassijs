var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/converters/DateTimeConverter", "jassijs/ui/BoxPanel", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Orders", "jassijs/ui/DBObjectView", "jassijs/ui/Component", "jassijs/ui/State"], function (require, exports, DateTimeConverter_1, BoxPanel_1, ObjectChooser_1, HTMLPanel_1, NumberConverter_1, Textbox_1, Registry_1, Panel_1, Orders_1, DBObjectView_1, Component_1, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.OrdersView = void 0;
    function ProductDetails(props, states) {
        var hh = states.product;
        return (0, Component_1.jc)(Panel_1.Panel, {
            children: [
                (0, Component_1.jc)(Textbox_1.Textbox, { bind: states.product.bind.Quantity, width: 85 }),
                (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { bind: states.product.bind.Product.ProductName, width: 365 }),
                (0, Component_1.jc)(ObjectChooser_1.ObjectChooser, {
                    bind: states.product.bind.Product,
                    items: "northwind.Products"
                }),
                (0, Component_1.jc)("br"),
            ]
        });
    }
    let OrdersView = class OrdersView extends DBObjectView_1.DBObjectView {
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(BoxPanel_1.BoxPanel, {
                        horizontal: true,
                        children: [
                            (0, Component_1.jc)(Panel_1.Panel, {
                                children: [
                                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Ship Name", bind: this.state.value.bind.ShipName, width: 260, ref: this.refs.shipName }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, {
                                        label: "Order ID", bind: this.state.value.bind.id, converter: new NumberConverter_1.NumberConverter(), style: {
                                            textAlign: "right",
                                            width: 60
                                        }
                                    }),
                                    (0, Component_1.jc)("br", { tag: "br" }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Ship Address", bind: this.state.value.bind.ShipAddress, width: 260, ref: this.refs.shipAddress }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, {
                                        label: "Freight", bind: this.state.value.bind.Freight, width: 60, converter: new NumberConverter_1.NumberConverter({ format: "#.##0,00" }), style: {
                                            textAlign: "right"
                                        }
                                    }),
                                    (0, Component_1.jc)("br", { tag: "br" }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Postal Code", bind: this.state.value.bind.ShipPostalCode, width: 60, hidden: false, ref: this.refs.shipPostalCode }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.ShipCity, label: "Ship City", width: 195, value: "shipCity" }),
                                    (0, Component_1.jc)("br", { tag: "br" }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Ship Region", bind: this.state.value.bind.ShipRegion, width: 150, ref: this.refs.shipRegion }),
                                    "",
                                    (0, Component_1.jc)(Textbox_1.Textbox, { label: " Ship Country", bind: this.state.value.bind.ShipCountry, width: 105, ref: this.refs.shipCountry })
                                ],
                                width: 485
                            }),
                            (0, Component_1.jc)(Panel_1.Panel, {
                                children: [
                                    (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { bind: this.state.value.bind.Customer.CompanyName, label: "Customer", width: 260 }),
                                    (0, Component_1.jc)(ObjectChooser_1.ObjectChooser, {
                                        autocommit: false, items: "northwind.Customer", bind: this.state.value.bind.Customer, height: 25,
                                        onchange: (data) => {
                                            var cust = this.state.value.Customer.current;
                                            this.refs.shipName.value = cust.CompanyName;
                                            this.refs.shipAddress.value = cust.Address;
                                            this.refs.shipPostalCode.value = cust.PostalCode;
                                            this.refs.shipCity.value = cust.City;
                                            this.refs.shipCountry.value = cust.Country;
                                            this.refs.shipRegion.value = cust.Region;
                                        }
                                    }),
                                    (0, Component_1.jc)("br", {}),
                                    (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { bind: this.state.value.bind.ShipVia, template: "{{id}} {{CompanyName}}", width: 260, label: "Ship Via" }),
                                    (0, Component_1.jc)(ObjectChooser_1.ObjectChooser, { items: "northwind.Shippers", bind: this.state.value.bind.ShipVia }),
                                    (0, Component_1.jc)("br", {}),
                                    (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { bind: this.state.value.bind.Employee, template: "{{id}} {{FirstName}} {{LastName}}", width: 260, label: "Employee", height: 20 }),
                                    (0, Component_1.jc)(ObjectChooser_1.ObjectChooser, { items: "northwind.Employees", bind: this.state.value.bind.Employee }),
                                    (0, Component_1.jc)("br", {}),
                                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.OrderDate, converter: new DateTimeConverter_1.DateTimeConverter(), label: "Oder Date", width: 95, text: "Oder Date" }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.RequiredDate, converter: new DateTimeConverter_1.DateTimeConverter(), label: "Required Date", width: 95 }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.ShippedDate, converter: new DateTimeConverter_1.DateTimeConverter(), label: "Shipped Date", width: 95 })
                                ]
                            })
                        ]
                    }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { value: "Quantity", width: 90 }),
                    (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, { value: "Text" }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(BoxPanel_1.BoxPanel, {
                        children: (0, State_1.foreach)(this.state.value.Details, (ob) => (0, Component_1.jc)(ProductDetails, {
                            product: ob
                        }))
                    })
                ]
            });
        }
        get title() {
            return this.value === undefined ? "OrdersView" : "OrdersView " + this.value.id;
        }
    };
    OrdersView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Orders", actionname: "Northwind/Orders", icon: "mdi mdi-script-text", queryname: "findAllWithDetails" }),
        (0, Registry_1.$Class)("northwind.OrdersView")
    ], OrdersView);
    exports.OrdersView = OrdersView;
    async function test() {
        var order = await Orders_1.Orders.findOne({ id: 10266, relations: ["*"] });
        //  var order=await Orders.find({relations: ["*"] });
        var ret = new OrdersView({
            value: order
        });
        setTimeout(async () => {
            ret.value = order = await Orders_1.Orders.findOne({ id: 10252, relations: ["*"] });
            //  var order=await Orders.find({relations: ["*"] });
        }, 3000);
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=OrdersView.js.map