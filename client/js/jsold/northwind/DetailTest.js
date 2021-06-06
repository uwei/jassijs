var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/OrderDetails", "jassijs/ui/DBObjectView", "jassijs/ui/Textbox"], function (require, exports, jassijs_1, Property_1, OrderDetails_1, DBObjectView_1, Textbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DetailTest = void 0;
    let DetailTest = class DetailTest extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "DetailTest" : "DetailTest " + this.value.id;
        }
        layout(me) {
            me.textbox1 = new Textbox_1.Textbox();
            me.main.add(me.textbox1);
            me.textbox1.bind(me.databinder, "Order.Customer.id");
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", OrderDetails_1.OrderDetails)
    ], DetailTest.prototype, "value", void 0);
    DetailTest = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.OrderDetails" }),
        jassijs_1.$Class("northwind.DetailTest"),
        __metadata("design:paramtypes", [])
    ], DetailTest);
    exports.DetailTest = DetailTest;
    async function test() {
        var ret = new DetailTest();
        // ret.value.Order.Customer
        ret["value"] = await OrderDetails_1.OrderDetails.findOne(); //{ relations: ["Order","Order.Customer"] });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=DetailTest.js.map
//# sourceMappingURL=DetailTest.js.map