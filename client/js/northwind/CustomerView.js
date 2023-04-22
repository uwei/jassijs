var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Customer", "jassijs/ui/DBObjectView"], function (require, exports, Textbox_1, Registry_1, Property_1, Customer_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerView = void 0;
    let CustomerView = class CustomerView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "CustomerView" : "CustomerView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_1.Textbox();
            me.companyname = new Textbox_1.Textbox();
            me.contacttitle = new Textbox_1.Textbox();
            me.contactname = new Textbox_1.Textbox();
            me.address = new Textbox_1.Textbox();
            me.postalcode = new Textbox_1.Textbox();
            me.textbox1 = new Textbox_1.Textbox();
            me.region = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            me.phone = new Textbox_1.Textbox();
            me.fax = new Textbox_1.Textbox();
            this.me.main.config({
                isAbsolute: true,
                width: 560,
                height: "300",
                children: [
                    me.id.config({
                        x: 10,
                        y: 5,
                        bind: [me.databinder, "id"],
                        width: 65,
                        label: "id"
                    }),
                    me.contactname.config({
                        x: 90,
                        y: 5,
                        label: "Contact Name",
                        bind: [me.databinder, "ContactName"],
                        width: 260
                    }),
                    me.contacttitle.config({
                        x: 10,
                        y: 45,
                        label: "Contact Title",
                        bind: [me.databinder, "ContactTitle"]
                    }),
                    me.companyname.config({
                        x: 195,
                        y: 45,
                        bind: [me.databinder, "CompanyName"],
                        label: "Company Name",
                        width: 155
                    }),
                    me.address.config({
                        x: 10,
                        y: 90,
                        bind: [me.databinder, "Address"],
                        label: "Address",
                        width: 340
                    }),
                    me.postalcode.config({
                        x: 10,
                        y: 140,
                        label: "Postal Code",
                        bind: [me.databinder, "PostalCode"],
                        width: 90
                    }),
                    me.textbox1.config({
                        x: 100,
                        y: 140,
                        label: "City",
                        width: 250,
                        bind: [me.databinder, "City"]
                    }),
                    me.region.config({
                        x: 10,
                        y: 185,
                        bind: [me.databinder, "Region"],
                        label: "Region"
                    }),
                    me.textbox2.config({
                        x: 195,
                        y: 185,
                        label: "Country",
                        bind: [me.databinder, "Country"]
                    }),
                    me.phone.config({
                        x: 10,
                        y: 230,
                        label: "Phone",
                        bind: [me.databinder, "Phone"]
                    }),
                    me.fax.config({
                        x: 195,
                        y: 230,
                        label: "Fax",
                        bind: [me.databinder, "Fax"]
                    })
                ]
            });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Customer_1.Customer !== "undefined" && Customer_1.Customer) === "function" ? _a : Object)
    ], CustomerView.prototype, "value", void 0);
    CustomerView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({
            classname: "northwind.Customer",
            actionname: "Northwind/Customers",
            icon: "mdi mdi-nature-people"
        }),
        (0, Registry_1.$Class)("northwind/CustomerView"),
        __metadata("design:paramtypes", [])
    ], CustomerView);
    exports.CustomerView = CustomerView;
    async function test() {
        var ret = new CustomerView;
        ret["value"] = await Customer_1.Customer.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=CustomerView.js.map