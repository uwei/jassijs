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
define(["require", "exports", "jassijs/ui/Table", "jassijs/ui/BoxPanel", "jassijs/ui/HTMLPanel", "jassijs/ui/Databinder", "jassijs/ui/ObjectChooser", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Customer", "northwind/remote/Orders", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, Table_1, BoxPanel_1, HTMLPanel_1, Databinder_1, ObjectChooser_1, Registry_1, Panel_1, Customer_1, Orders_1, Actions_1, Windows_1) {
    "use strict";
    var CustomerOrders_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerOrders = void 0;
    Windows_1 = __importDefault(Windows_1);
    let CustomerOrders = CustomerOrders_1 = class CustomerOrders extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            var _this = this;
            me.IDChooseCustomer = new ObjectChooser_1.ObjectChooser();
            me.databinderCustomer = new Databinder_1.Databinder();
            me.htmlpanel = new HTMLPanel_1.HTMLPanel();
            me.boxpanel = new BoxPanel_1.BoxPanel();
            me.boxpanel2 = new BoxPanel_1.BoxPanel();
            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
            me.IDOrders = new Table_1.Table();
            me.databinderOrder = new Databinder_1.Databinder();
            me.table = new Table_1.Table();
            this.config({ children: [
                    me.databinderCustomer.config({}),
                    me.boxpanel.config({ children: [
                            me.boxpanel2.config({
                                children: [
                                    me.htmlpanel.config({
                                        width: 185,
                                        value: "Berglunds snabbköp",
                                        bind: [me.databinderCustomer, "CompanyName"],
                                        label: "Company Name",
                                        height: 20
                                    }),
                                    me.IDChooseCustomer.config({
                                        width: 25,
                                        bind: [me.databinderCustomer, "this"],
                                        items: "northwind.Customer",
                                        onchange: function (event) {
                                            _this.customerChanged();
                                        }
                                    }),
                                    me.htmlpanel2.config({
                                        width: 110,
                                        value: " ",
                                        bind: [me.databinderCustomer, "Country"],
                                        label: "Country"
                                    })
                                ],
                                horizontal: true
                            }),
                            me.IDOrders.config({
                                width: "100%",
                                label: "Click an order...",
                                height: "180"
                            }),
                            me.table.config({
                                width: "100%",
                                bindItems: [me.databinderOrder, "Details"],
                                height: "140",
                                label: "...to see order details"
                            })
                        ] }),
                    me.databinderOrder.config({})
                ] });
            me.IDOrders.selectComponent = me.databinderOrder;
            this.setData();
            this.width = "100%";
            this.height = "100%";
        }
        static showDialog() {
            Windows_1.default.add(new CustomerOrders_1(), "Customer Orders");
        }
        async customerChanged() {
            var cust = this.me.databinderCustomer.value;
            var orders = await Orders_1.Orders.find({ where: "Customer.id=:param",
                whereParams: { param: cust.id } });
            this.me.IDOrders.items = orders;
            this.me.databinderOrder.value = orders[0];
        }
        async setData() {
            var all = await Customer_1.Customer.find();
            this.me.databinderCustomer.value = all[0];
            this.customerChanged();
            //        this.me.IDChooseCustomer.items = all;
            //      this.me.databinderCustomer.value = all[0];
        }
    };
    __decorate([
        (0, Actions_1.$Action)({ name: "Northwind/Customer Orders", icon: "mdi-script-text-play-outline" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CustomerOrders, "showDialog", null);
    CustomerOrders = CustomerOrders_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("northwind/CustomerOrders"),
        __metadata("design:paramtypes", [])
    ], CustomerOrders);
    exports.CustomerOrders = CustomerOrders;
    async function test() {
        var ret = new CustomerOrders();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=CustomerOrders.js.map