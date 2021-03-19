var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Calendar", "jassi/ui/ObjectChooser", "jassi/ui/HTMLPanel", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Orders", "jassi/ui/DBObjectView"], function (require, exports, Calendar_1, ObjectChooser_1, HTMLPanel_1, NumberConverter_1, Textbox_1, Jassi_1, Property_1, Orders_1, DBObjectView_1) {
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
            me.main.isAbsolute = true;
            me.main.height = "500";
            me.main.width = 735;
            me.main.add(me.id);
            me.main.add(me.customername);
            me.main.add(me.shippedDate);
            me.main.add(me.requiredDate);
            me.main.add(me.orderDate);
            me.main.add(me.choosecustomer);
            me.main.add(me.chooseEmployee);
            me.main.add(me.employeename);
            me.main.add(me.shipVia);
            me.main.add(me.shipviaChooser);
            me.main.add(me.freight);
            me.main.add(me.shipName);
            me.main.add(me.shipAddress);
            me.main.add(me.shipPostalCode);
            me.main.add(me.shipCity);
            me.main.add(me.shipRegion);
            me.main.add(me.shipCountry);
            me.id.x = 5;
            me.id.y = 10;
            me.id.converter = new NumberConverter_1.NumberConverter();
            me.id.bind(me.databinder, "id");
            me.id.label = "Order ID";
            me.id.width = 70;
            me.customername.x = 425;
            me.customername.y = 10;
            me.customername.width = 265;
            me.customername.template = "{{id}} {{CompanyName}}";
            me.customername.bind(me.databinder, "Customer");
            me.customername.value = "VINET Vins et alcools Chevalier";
            me.customername.label = "Customer";
            me.employeename.x = 425;
            me.employeename.y = 100;
            me.employeename.bind(me.databinder, "Employee");
            me.employeename.label = "Employee";
            me.employeename.width = 265;
            me.employeename.value = "5 Steven Buchanan";
            me.employeename.template = "{{id}} {{FirstName}} {{LastName}}";
            me.chooseEmployee.x = 695;
            me.chooseEmployee.y = 115;
            me.chooseEmployee.bind(me.databinder, "Employee");
            me.chooseEmployee.items = "northwind.Employees";
            me.choosecustomer.x = 695;
            me.choosecustomer.y = 25;
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
            me.orderDate.x = 425;
            me.orderDate.y = 140;
            me.orderDate.bind(me.databinder, "OrderDate");
            me.orderDate.label = "Order Date";
            me.orderDate.width = 70;
            me.requiredDate.x = 510;
            me.requiredDate.y = 140;
            me.requiredDate.bind(me.databinder, "RequiredDate");
            me.requiredDate.label = "Required Date";
            me.requiredDate.width = 75;
            me.shippedDate.x = 600;
            me.shippedDate.y = 140;
            me.shippedDate.bind(me.databinder, "ShippedDate");
            me.shippedDate.width = 75;
            me.shippedDate.label = "Shipped Date";
            me.shipVia.x = 425;
            me.shipVia.y = 55;
            me.shipVia.bind(me.databinder, "ShipVia");
            me.shipVia.template = "{{id}} {{CompanyName}}";
            me.shipVia.label = "Ship via";
            me.shipVia.value = "3 Federal Shipping";
            me.shipVia.width = 265;
            me.shipviaChooser.x = 695;
            me.shipviaChooser.y = 70;
            me.shipviaChooser.bind(me.databinder, "ShipVia");
            me.shipviaChooser.items = "northwind.Shippers";
            me.freight.x = 85;
            me.freight.y = 10;
            me.freight.bind(me.databinder, "Freight");
            me.freight.width = 60;
            me.freight.label = "Freight";
            me.shipName.x = 5;
            me.shipName.y = 60;
            me.shipName.bind(me.databinder, "ShipName");
            me.shipName.width = 220;
            me.shipName.label = "Ship Name";
            me.shipAddress.x = 5;
            me.shipAddress.y = 105;
            me.shipAddress.bind(me.databinder, "ShipAddress");
            me.shipAddress.width = 220;
            me.shipAddress.label = "Ship Address";
            me.shipPostalCode.x = 5;
            me.shipPostalCode.y = 150;
            me.shipPostalCode.bind(me.databinder, "ShipPostalCode");
            me.shipPostalCode.width = 55;
            me.shipPostalCode.label = "Postal Code";
            me.shipCity.x = 75;
            me.shipCity.y = 150;
            me.shipCity.bind(me.databinder, "ShipCity");
            me.shipCity.label = "Ship City";
            me.shipCity.width = 150;
            me.shipCountry.x = 135;
            me.shipCountry.y = 195;
            me.shipCountry.bind(me.databinder, "ShipCountry");
            me.shipCountry.label = "Ship Country";
            me.shipCountry.width = 90;
            me.shipRegion.x = 5;
            me.shipRegion.y = 195;
            me.shipRegion.bind(me.databinder, "ShipRegion");
            me.shipRegion.label = "Ship Region";
            me.shipRegion.width = 120;
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