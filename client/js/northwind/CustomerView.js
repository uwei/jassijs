var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "remote/jassi/base/Jassi", "jassi/ui/Property", "remote/northwind/Customer", "jassi/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Jassi_1, Property_1, Customer_1, DBObjectView_1) {
    "use strict";
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
            me.textbox1 = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            me.textbox3 = new Textbox_1.Textbox();
            me.textbox4 = new Textbox_1.Textbox();
            me.main.isAbsolute = true;
            me.main.width = "400";
            me.main.height = "300";
            me.main.add(me.textbox1);
            me.main.add(me.textbox2);
            me.main.add(me.textbox3);
            me.main.add(me.textbox4);
            me.textbox1.x = 15;
            me.textbox1.y = 15;
            me.textbox1.bind(me.databinder, "id");
            me.textbox1.width = 65;
            me.textbox1.converter = new NumberConverter_1.NumberConverter();
            me.textbox1.label = "id";
            me.textbox2.x = 95;
            me.textbox2.y = 15;
            me.textbox2.bind(me.databinder, "CompanyName");
            me.textbox2.label = "Company Name";
            me.textbox3.x = 15;
            me.textbox3.y = 60;
            me.textbox3.label = "Contact Title";
            me.textbox3.bind(me.databinder, "ContactTitle");
            me.textbox4.x = 190;
            me.textbox4.y = 60;
            me.textbox4.label = "Contact Name";
            me.textbox4.bind(me.databinder, "ContactName");
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Customer_1.Customer)
    ], CustomerView.prototype, "value", void 0);
    CustomerView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.Customer" }),
        Jassi_1.$Class("northwind/CustomerView"),
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