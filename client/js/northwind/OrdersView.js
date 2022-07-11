var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Style", "jassijs/ui/BoxPanel", "jassijs/ui/Repeater", "jassijs/ui/Calendar", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Property", "northwind/remote/Orders", "jassijs/ui/DBObjectView"], function (require, exports, Style_1, BoxPanel_1, Repeater_1, Calendar_1, ObjectChooser_1, HTMLPanel_1, NumberConverter_1, Textbox_1, Registry_1, Panel_1, Property_1, Orders_1, DBObjectView_1) {
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
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.panel1 = new Panel_1.Panel();
            me.shipName = new Textbox_1.Textbox();
            me.shipAddress = new Textbox_1.Textbox();
            me.shipPostalCode = new Textbox_1.Textbox();
            me.shipCity = new Textbox_1.Textbox();
            me.shipCountry = new Textbox_1.Textbox();
            me.shipRegion = new Textbox_1.Textbox();
            me.panel2 = new Panel_1.Panel();
            me.id = new Textbox_1.Textbox();
            me.freight = new Textbox_1.Textbox();
            me.panel3 = new Panel_1.Panel();
            me.customername = new HTMLPanel_1.HTMLPanel();
            me.choosecustomer = new ObjectChooser_1.ObjectChooser();
            me.shipVia = new HTMLPanel_1.HTMLPanel();
            me.shipviaChooser = new ObjectChooser_1.ObjectChooser();
            me.employeename = new HTMLPanel_1.HTMLPanel();
            me.chooseEmployee = new ObjectChooser_1.ObjectChooser();
            me.orderDate = new Calendar_1.Calendar();
            me.requiredDate = new Calendar_1.Calendar();
            me.shippedDate = new Calendar_1.Calendar();
            me.boxpanel2 = new BoxPanel_1.BoxPanel();
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
            me.repeater1 = new Repeater_1.Repeater();
            me.style1 = new Style_1.Style();
            this.me.main.add(me.boxpanel1);
            this.me.main.add(me.boxpanel2);
            this.me.main.add(me.repeater1);
            this.me.main.add(me.style1);
            me.boxpanel1.add(me.panel1);
            me.boxpanel1.add(me.panel2);
            me.boxpanel1.add(me.panel3);
            me.boxpanel1.height = 230;
            me.boxpanel1.horizontal = true;
            me.panel1.add(me.shipName);
            me.panel1.add(me.shipAddress);
            me.panel1.add(me.shipPostalCode);
            me.panel1.add(me.shipCity);
            me.panel1.add(me.shipRegion);
            me.panel1.add(me.shipCountry);
            me.panel1.width = 250;
            me.panel1.height = 185;
            me.panel1.isAbsolute = true;
            me.panel2.add(me.id);
            me.panel2.add(me.freight);
            me.panel2.isAbsolute = true;
            me.panel2.height = 185;
            me.panel2.width = 105;
            me.panel3.add(me.customername);
            me.panel3.add(me.choosecustomer);
            me.panel3.add(me.shipVia);
            me.panel3.add(me.shipviaChooser);
            me.panel3.add(me.employeename);
            me.panel3.add(me.chooseEmployee);
            me.panel3.add(me.orderDate);
            me.panel3.add(me.requiredDate);
            me.panel3.add(me.shippedDate);
            me.panel3.isAbsolute = true;
            me.panel3.height = 185;
            me.panel3.width = 320;
            me.boxpanel2.add(me.htmlpanel1);
            me.boxpanel2.add(me.htmlpanel2);
            me.boxpanel2.horizontal = true;
            me.repeater1.createRepeatingComponent(function (me) {
                me.detailsQuantity = new Textbox_1.Textbox();
                me.detailsProduct = new HTMLPanel_1.HTMLPanel();
                me.objectchooser1 = new ObjectChooser_1.ObjectChooser();
                me.repeater1.design.add(me.detailsQuantity);
                me.repeater1.design.add(me.detailsProduct);
                me.repeater1.design.add(me.objectchooser1);
                me.detailsQuantity.bind = [me.repeater1.design.databinder, "Quantity"];
                me.detailsQuantity.width = 60;
                me.detailsProduct.width = 530;
                me.detailsProduct.bind = [me.repeater1.design.databinder, "Product"];
                me.detailsProduct.template = "{{ProductName}}";
                me.detailsProduct.css = {
                    overflow: "hidden",
                    margin_top: "5px"
                };
                me.detailsProduct.styles = [me.style1];
                me.objectchooser1.bind = [me.repeater1.design.databinder, "Product"];
                me.objectchooser1.items = "northwind.Products";
            });
            me.repeater1.width = 675;
            me.repeater1.bind = [me.databinder, "Details"];
            me.shipName.x = 5;
            me.shipName.y = 5;
            me.shipName.bind = [me.databinder, "ShipName"];
            me.shipName.width = 220;
            me.shipName.label = "Ship Name";
            me.shipAddress.x = 5;
            me.shipAddress.y = 50;
            me.shipAddress.bind = [me.databinder, "ShipAddress"];
            me.shipAddress.width = 220;
            me.shipAddress.label = "Ship Address";
            me.shipPostalCode.x = 5;
            me.shipPostalCode.y = 95;
            me.shipPostalCode.bind = [me.databinder, "ShipPostalCode"];
            me.shipPostalCode.width = 55;
            me.shipPostalCode.label = "Postal Code";
            me.shipCity.x = 75;
            me.shipCity.y = 95;
            me.shipCity.bind = [me.databinder, "ShipCity"];
            me.shipCity.label = "Ship City";
            me.shipCity.width = 150;
            me.shipCountry.x = 135;
            me.shipCountry.y = 140;
            me.shipCountry.bind = [me.databinder, "ShipCountry"];
            me.shipCountry.label = "Ship Country";
            me.shipCountry.width = 90;
            me.shipRegion.x = 5;
            me.shipRegion.y = 140;
            me.shipRegion.bind = [me.databinder, "ShipRegion"];
            me.shipRegion.label = "Ship Region";
            me.shipRegion.width = 120;
            me.id.x = 5;
            me.id.y = 5;
            me.id.converter = new NumberConverter_1.NumberConverter();
            me.id.bind = [me.databinder, "id"];
            me.id.label = "Order ID";
            me.id.width = 70;
            me.id.css = {
                text_align: "right"
            };
            me.freight.x = 5;
            me.freight.y = 50;
            me.freight.bind = [me.databinder, "Freight"];
            me.freight.width = 70;
            me.freight.label = "Freight";
            me.freight.converter = new NumberConverter_1.NumberConverter({ format: "#.##0,00" });
            me.freight.css = {
                text_align: "right"
            };
            me.customername.x = 10;
            me.customername.y = 5;
            me.customername.width = 265;
            me.customername.template = "{{id}} {{CompanyName}}";
            me.customername.bind = [me.databinder, "Customer"];
            me.customername.value = "VINET Vins et alcools Chevalier";
            me.customername.label = "Customer";
            me.customername.height = 15;
            me.customername.styles = [me.style1];
            me.choosecustomer.x = 275;
            me.choosecustomer.y = 15;
            me.choosecustomer.items = "northwind.Customer";
            me.choosecustomer.bind = [me.databinder, "Customer"];
            me.choosecustomer.onchange(function (event) {
                let cust = me.choosecustomer.value;
                me.shipName.value = cust.CompanyName;
                me.shipAddress.value = cust.Address;
                me.shipPostalCode.value = cust.PostalCode;
                me.shipCity.value = cust.City;
                me.shipCountry.value = cust.Country;
                me.shipRegion.value = cust.Region;
            });
            me.shipVia.x = 10;
            me.shipVia.y = 45;
            me.shipVia.bind = [me.databinder, "ShipVia"];
            me.shipVia.template = "{{id}} {{CompanyName}}";
            me.shipVia.label = "Ship via";
            me.shipVia.value = "3 Federal Shipping";
            me.shipVia.width = 260;
            me.shipVia.height = 20;
            me.shipVia.styles = [me.style1];
            me.shipviaChooser.x = 275;
            me.shipviaChooser.y = 60;
            me.shipviaChooser.bind = [me.databinder, "ShipVia"];
            me.shipviaChooser.items = "northwind.Shippers";
            me.shipviaChooser.width = 30;
            me.employeename.x = 10;
            me.employeename.y = 90;
            me.employeename.bind = [me.databinder, "Employee"];
            me.employeename.label = "Employee";
            me.employeename.width = 265;
            me.employeename.value = "5 Steven Buchanan";
            me.employeename.template = "{{id}} {{FirstName}} {{LastName}}";
            me.employeename.styles = [me.style1];
            me.chooseEmployee.x = 275;
            me.chooseEmployee.y = 105;
            me.chooseEmployee.bind = [me.databinder, "Employee"];
            me.chooseEmployee.items = "northwind.Employees";
            me.chooseEmployee.height = 20;
            me.orderDate.x = 10;
            me.orderDate.y = 130;
            me.orderDate.bind = [me.databinder, "OrderDate"];
            me.orderDate.label = "Order Date";
            me.orderDate.width = 70;
            me.requiredDate.x = 90;
            me.requiredDate.y = 130;
            me.requiredDate.bind = [me.databinder, "RequiredDate"];
            me.requiredDate.label = "Required Date";
            me.requiredDate.width = 75;
            me.shippedDate.x = 175;
            me.shippedDate.y = 130;
            me.shippedDate.bind = [me.databinder, "ShippedDate"];
            me.shippedDate.width = 75;
            me.shippedDate.label = "Shipped Date";
            me.htmlpanel1.value = "Quantity<br>";
            me.htmlpanel1.width = 65;
            me.htmlpanel1.styles = [];
            me.htmlpanel2.value = "Text<br>";
            me.htmlpanel2.width = 100;
            me.style1.css = {};
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Orders_1.Orders)
    ], OrdersView.prototype, "value", void 0);
    OrdersView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Orders", actionname: "Northwind/Orders", icon: "mdi mdi-script-text" }),
        (0, Registry_1.$Class)("northwind.OrdersView"),
        __metadata("design:paramtypes", [])
    ], OrdersView);
    exports.OrdersView = OrdersView;
    async function test() {
        var ret = new OrdersView;
        ret["value"] = await Orders_1.Orders.findOne({ id: 10249, relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=OrdersView.js.map