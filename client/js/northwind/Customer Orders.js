var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Registry_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Customer = void 0;
    let Customer = class Customer {
    };
    Customer = __decorate([
        (0, Registry_1.$Class)("northwind/Customer Orders")
    ], Customer);
    exports.Customer = Customer;
    Orders;
    Panel_1.Panel;
    {
        me: Me;
        constructor();
        {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me, Me);
        {
            this.config({});
        }
    }
    async function test() {
        var ret = new Customer, Orders;
        ();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Customer%20Orders.js.map