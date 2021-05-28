var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/BoxPanel", "jassi/ui/Repeater", "jassi/ui/Calendar", "jassi/ui/ObjectChooser", "jassi/ui/HTMLPanel", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Property", "northwind/remote/Orders", "jassi/ui/DBObjectView"], function (require, exports, BoxPanel_1, Repeater_1, Calendar_1, ObjectChooser_1, HTMLPanel_1, NumberConverter_1, Textbox_1, Jassi_1, Panel_1, Property_1, Orders_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.OrdersView = void 0;
    let OrdersView = class OrdersView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "OrdersView" : "OrdersView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_1.Textbox();
            me.customername = new HTMLPanel_1.HTMLPanel();
            me.employeename = new HTMLPanel_1.HTMLPanel();
            me.chooseEmployee = new ObjectChooser_1.ObjectChooser();
            me.choosecustomer = new ObjectChooser_1.ObjectChooser();
            me.orderDate = new Calendar_1.Calendar();
            me.requiredDate = new Calendar_1.Calendar();
            me.shippedDate = new Calendar_1.Calendar();
            me.shipVia = new HTMLPanel_1.HTMLPanel();
            me.shipviaChooser = new ObjectChooser_1.ObjectChooser();
            me.freight = new Textbox_1.Textbox();
            me.shipName = new Textbox_1.Textbox();
            me.shipAddress = new Textbox_1.Textbox();
            me.shipPostalCode = new Textbox_1.Textbox();
            me.shipCity = new Textbox_1.Textbox();
            me.shipCountry = new Textbox_1.Textbox();
            me.shipRegion = new Textbox_1.Textbox();
            me.repeater1 = new Repeater_1.Repeater();
            me.panel1 = new Panel_1.Panel();
            me.panel2 = new Panel_1.Panel();
            me.panel3 = new Panel_1.Panel();
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.boxpanel2 = new BoxPanel_1.BoxPanel();
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
            me.main.add(me.boxpanel1);
            me.main.add(me.boxpanel2);
            me.main.add(me.repeater1);
            me.id.x = 5;
            me.id.y = 5;
            me.id.converter = new NumberConverter_1.NumberConverter();
            me.id.bind(me.databinder, "id");
            me.id.label = "Order ID";
            me.id.width = 70;
            me.customername.x = 10;
            me.customername.y = 5;
            me.customername.width = 265;
            me.customername.template = "{{id}} {{CompanyName}}";
            me.customername.bind(me.databinder, "Customer");
            me.customername.value = "VINET Vins et alcools Chevalier";
            me.customername.label = "Customer";
            me.customername.height = 15;
            me.employeename.x = 10;
            me.employeename.y = 90;
            me.employeename.bind(me.databinder, "Employee");
            me.employeename.label = "Employee";
            me.employeename.width = 265;
            me.employeename.value = "5 Steven Buchanan";
            me.employeename.template = "{{id}} {{FirstName}} {{LastName}}";
            me.chooseEmployee.x = 275;
            me.chooseEmployee.y = 105;
            me.chooseEmployee.bind(me.databinder, "Employee");
            me.chooseEmployee.items = "northwind.Employees";
            me.chooseEmployee.height = 20;
            me.choosecustomer.x = 275;
            me.choosecustomer.y = 15;
            me.choosecustomer.items = "northwind.Customer";
            me.choosecustomer.bind(me.databinder, "Customer");
            me.choosecustomer.onchange(function (event) {
                let cust = me.choosecustomer.value;
                me.shipName.value = cust.CompanyName;
                me.shipAddress.value = cust.Address;
                me.shipPostalCode.value = cust.PostalCode;
                me.shipCity.value = cust.City;
                me.shipCountry.value = cust.Country;
                me.shipRegion.value = cust.Region;
            });
            me.orderDate.x = 10;
            me.orderDate.y = 130;
            me.orderDate.bind(me.databinder, "OrderDate");
            me.orderDate.label = "Order Date";
            me.orderDate.width = 70;
            me.requiredDate.x = 90;
            me.requiredDate.y = 130;
            me.requiredDate.bind(me.databinder, "RequiredDate");
            me.requiredDate.label = "Required Date";
            me.requiredDate.width = 75;
            me.shippedDate.x = 175;
            me.shippedDate.y = 130;
            me.shippedDate.bind(me.databinder, "ShippedDate");
            me.shippedDate.width = 75;
            me.shippedDate.label = "Shipped Date";
            me.shipVia.x = 10;
            me.shipVia.y = 45;
            me.shipVia.bind(me.databinder, "ShipVia");
            me.shipVia.template = "{{id}} {{CompanyName}}";
            me.shipVia.label = "Ship via";
            me.shipVia.value = "3 Federal Shipping";
            me.shipVia.width = 260;
            me.shipviaChooser.x = 275;
            me.shipviaChooser.y = 60;
            me.shipviaChooser.bind(me.databinder, "ShipVia");
            me.shipviaChooser.items = "northwind.Shippers";
            me.shipviaChooser.width = 30;
            me.freight.x = 5;
            me.freight.y = 50;
            me.freight.bind(me.databinder, "Freight");
            me.freight.width = 70;
            me.freight.label = "Freight";
            me.freight.converter = new NumberConverter_1.NumberConverter();
            me.freight.format = "#.##0,00";
            me.freight.css({
                text_align: "right"
            });
            me.shipName.x = 5;
            me.shipName.y = 5;
            me.shipName.bind(me.databinder, "ShipName");
            me.shipName.width = 220;
            me.shipName.label = "Ship Name";
            me.shipAddress.x = 5;
            me.shipAddress.y = 50;
            me.shipAddress.bind(me.databinder, "ShipAddress");
            me.shipAddress.width = 220;
            me.shipAddress.label = "Ship Address";
            me.shipPostalCode.x = 5;
            me.shipPostalCode.y = 95;
            me.shipPostalCode.bind(me.databinder, "ShipPostalCode");
            me.shipPostalCode.width = 55;
            me.shipPostalCode.label = "Postal Code";
            me.shipCity.x = 75;
            me.shipCity.y = 95;
            me.shipCity.bind(me.databinder, "ShipCity");
            me.shipCity.label = "Ship City";
            me.shipCity.width = 150;
            me.shipCountry.x = 135;
            me.shipCountry.y = 140;
            me.shipCountry.bind(me.databinder, "ShipCountry");
            me.shipCountry.label = "Ship Country";
            me.shipCountry.width = 90;
            me.shipRegion.x = 5;
            me.shipRegion.y = 140;
            me.shipRegion.bind(me.databinder, "ShipRegion");
            me.shipRegion.label = "Ship Region";
            me.shipRegion.width = 120;
            me.repeater1.bind(me.databinder, "Details");
            me.repeater1.width = 420;
            me.repeater1.createRepeatingComponent(function (me) {
                me.detailsQuantity = new Textbox_1.Textbox();
                me.detailsProduct = new HTMLPanel_1.HTMLPanel();
                me.objectchooser1 = new ObjectChooser_1.ObjectChooser();
                this.design.add(me.detailsQuantity);
                this.design.add(me.detailsProduct);
                this.design.add(me.objectchooser1);
                me.detailsQuantity.bind(me.repeater1.design.databinder, "Quantity");
                me.detailsQuantity.width = 60;
                me.detailsProduct.width = "100";
                me.detailsProduct.bind(me.repeater1.design.databinder, "Product");
                me.detailsProduct.template = "{{ProductName}}";
                me.objectchooser1.bind(me.repeater1.design.databinder, "Product");
                me.objectchooser1.items = "northwind.Products";
                me.detailsProduct.css({
                    overflow: "hidden"
                });
                me.detailsProduct.height = "18";
            });
            me.panel1.isAbsolute = true;
            me.panel1.height = 185;
            me.panel1.width = 250;
            me.panel1.add(me.shipName);
            me.panel1.add(me.shipAddress);
            me.panel1.add(me.shipPostalCode);
            me.panel1.add(me.shipCity);
            me.panel1.add(me.shipCountry);
            me.panel1.add(me.shipRegion);
            me.panel2.width = 105;
            me.panel2.height = 185;
            me.panel2.isAbsolute = true;
            me.panel2.add(me.id);
            me.panel2.add(me.freight);
            me.panel3.width = 320;
            me.panel3.height = 185;
            me.panel3.isAbsolute = true;
            me.panel3.add(me.customername);
            me.panel3.add(me.choosecustomer);
            me.panel3.add(me.shipVia);
            me.panel3.add(me.shipviaChooser);
            me.panel3.add(me.employeename);
            me.panel3.add(me.chooseEmployee);
            me.panel3.add(me.orderDate);
            me.panel3.add(me.requiredDate);
            me.panel3.add(me.shippedDate);
            me.boxpanel1.horizontal = true;
            me.boxpanel1.add(me.panel1);
            me.boxpanel1.add(me.panel2);
            me.boxpanel1.add(me.panel3);
            me.boxpanel1.height = 230;
            me.boxpanel2.add(me.htmlpanel1);
            me.boxpanel2.add(me.htmlpanel2);
            me.boxpanel2.horizontal = true;
            me.htmlpanel1.value = "Quantity<br>";
            me.htmlpanel1.width = 65;
            me.htmlpanel2.value = "Text<br>";
            me.htmlpanel2.width = 100;
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Orders_1.Orders)
    ], OrdersView.prototype, "value", void 0);
    OrdersView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.Orders", actionname: "Northwind/Orders", icon: "mdi mdi-script-text" }),
        Jassi_1.$Class("northwind.OrdersView"),
        __metadata("design:paramtypes", [])
    ], OrdersView);
    exports.OrdersView = OrdersView;
    async function test() {
        var ret = new OrdersView;
        ret["value"] = await Orders_1.Orders.findOne({ id: 10250, relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=OrdersView.js.map