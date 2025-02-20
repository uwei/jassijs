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
define(["require", "exports", "jassijs/ui/Table", "jassijs/ui/HTMLPanel", "jassijs/ui/ObjectChooser", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Customer", "northwind/remote/Orders", "jassijs/base/Actions", "jassijs/base/Windows", "jassijs/ui/Component", "jassijs/ui/DBObjectView"], function (require, exports, Table_1, HTMLPanel_1, ObjectChooser_1, Registry_1, Panel_1, Customer_1, Orders_1, Actions_1, Windows_1, Component_1, DBObjectView_1) {
    "use strict";
    var CustomerOrders_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerOrders = void 0;
    Windows_1 = __importDefault(Windows_1);
    let CustomerOrders = CustomerOrders_1 = class CustomerOrders extends DBObjectView_1.DBObjectView {
        constructor(props = {}) {
            super(props);
            if (!(props === null || props === void 0 ? void 0 : props.order))
                this.initData();
        }
        render() {
            var _this = this;
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, {
                        width: 300,
                        value: "Blauer See Delikatessen",
                        bind: this.state.value.bind.CompanyName,
                        label: "Company Name",
                        height: 20
                    }),
                    (0, Component_1.jc)(ObjectChooser_1.ObjectChooser, {
                        width: 25,
                        bind: this.state.value.bind,
                        items: "northwind.Customer",
                        onchange: function (event) {
                            _this.customerChanged();
                        }
                    }),
                    (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, {
                        width: 110,
                        value: " ",
                        bind: this.state.value.bind.Country,
                        label: "Country"
                    }),
                    (0, Component_1.jc)(Table_1.Table, {
                        bind: this.state.order.bind,
                        bindItems: this.state.orders.bind,
                        width: "100%",
                        label: "Click an order...",
                        height: "180"
                    }),
                    (0, Component_1.jc)(Table_1.Table, {
                        bindItems: this.state.order.bind.Details,
                        width: "100%",
                        height: "140",
                        label: "...to see order details"
                    })
                ]
            });
        }
        static showDialog() {
            Windows_1.default.add(new CustomerOrders_1(), "Customer Orders");
        }
        async customerChanged() {
            var cust = this.state.value.current;
            this.state.orders.current = await Orders_1.Orders.find({
                where: "Customer.id=:param",
                whereParams: { param: cust.id }
            });
            this.state.order.current = this.state.orders.current.length === 0 ? undefined : this.state.orders.current[0];
            //    this.me.IDOrders.items = orders;
            //   this.me.databinderOrder.value = orders[0];
        }
        set value(value) {
            super.value = value;
            this.customerChanged();
        }
        async initData() {
            this.value = await Customer_1.Customer.findOne();
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
        __metadata("design:paramtypes", [Object])
    ], CustomerOrders);
    exports.CustomerOrders = CustomerOrders;
    async function test() {
        var ret = new CustomerOrders();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=CustomerOrders.js.map