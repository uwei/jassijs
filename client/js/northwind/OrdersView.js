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
            me.main.isAbsolute = true;
            me.main.height = "500";
            me.main.width = "500";
            me.main.add(me.id);
            me.main.add(me.customername);
            me.main.add(me.shippedDate);
            me.main.add(me.requiredDate);
            me.main.add(me.orderDate);
            me.main.add(me.choosecustomer);
            me.main.add(me.chooseEmployee);
            me.main.add(me.employeename);
            me.id.x = 9;
            me.id.y = 11;
            me.id.converter = new NumberConverter_1.NumberConverter();
            me.id.bind(me.databinder, "id");
            me.id.label = "Order ID";
            me.id.width = 70;
            me.customername.x = 10;
            me.customername.y = 65;
            me.customername.width = 375;
            me.customername.template = "{{id}} {{CompanyName}}";
            me.customername.bind(me.databinder, "Customer");
            me.customername.value = "VINET Vins et alcools Chevalier";
            me.customername.label = "Customer";
            me.employeename.x = 111;
            me.employeename.y = 11;
            me.employeename.bind(me.databinder, "Employee");
            me.employeename.label = "Employee";
            me.employeename.width = 275;
            me.employeename.value = "5 Steven Buchanan";
            me.employeename.template = "{{id}} {{FirstName}} {{LastName}}";
            me.chooseEmployee.x = 390;
            me.chooseEmployee.y = 25;
            me.chooseEmployee.bind(me.databinder, "Employee");
            me.chooseEmployee.items = "northwind.Employees";
            me.choosecustomer.x = 390;
            me.choosecustomer.y = 70;
            me.choosecustomer.items = "northwind.Customer";
            me.choosecustomer.bind(me.databinder, "Customer");
            me.orderDate.x = 10;
            me.orderDate.y = 115;
            me.orderDate.bind(me.databinder, "OrderDate");
            me.orderDate.label = "Order Date";
            me.orderDate.width = 75;
            me.requiredDate.x = 100;
            me.requiredDate.y = 115;
            me.requiredDate.bind(me.databinder, "RequiredDate");
            me.requiredDate.label = "Required Date";
            me.requiredDate.width = 75;
            me.shippedDate.x = 190;
            me.shippedDate.y = 115;
            me.shippedDate.bind(me.databinder, "ShippedDate");
            me.shippedDate.width = 75;
            me.shippedDate.label = "Shipped Date";
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
        ret["value"] = await Orders_1.Orders.findOne({ relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=OrdersView.js.map