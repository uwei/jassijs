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
define(["require", "exports", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Customer", "jassi/ui/DBObjectView"], function (require, exports, Textbox_1, Jassi_1, Property_1, Customer_1, DBObjectView_1) {
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
            me.main.isAbsolute = true;
            me.main.width = 560;
            me.main.height = "300";
            me.main.add(me.id);
            me.main.add(me.companyname);
            me.main.add(me.contacttitle);
            me.main.add(me.contactname);
            me.main.add(me.address);
            me.main.add(me.postalcode);
            me.main.add(me.textbox1);
            me.main.add(me.region);
            me.main.add(me.textbox2);
            me.main.add(me.phone);
            me.main.add(me.fax);
            me.id.x = 10;
            me.id.y = 5;
            me.id.bind(me.databinder, "id");
            me.id.width = 65;
            me.id.label = "id";
            me.companyname.x = 195;
            me.companyname.y = 45;
            me.companyname.bind(me.databinder, "CompanyName");
            me.companyname.label = "Company Name";
            me.companyname.width = 155;
            me.contacttitle.x = 10;
            me.contacttitle.y = 45;
            me.contacttitle.label = "Contact Title";
            me.contacttitle.bind(me.databinder, "ContactTitle");
            me.contactname.x = 90;
            me.contactname.y = 5;
            me.contactname.label = "Contact Name";
            me.contactname.bind(me.databinder, "ContactName");
            me.contactname.width = 260;
            me.address.x = 10;
            me.address.y = 90;
            me.address.bind(me.databinder, "Address");
            me.address.label = "Address";
            me.address.width = 340;
            me.postalcode.x = 10;
            me.postalcode.y = 140;
            me.postalcode.label = "Postal Code";
            me.postalcode.bind(me.databinder, "PostalCode");
            me.postalcode.width = 90;
            me.textbox1.x = 100;
            me.textbox1.y = 140;
            me.textbox1.label = "City";
            me.textbox1.width = 250;
            me.textbox1.bind(me.databinder, "City");
            me.region.x = 10;
            me.region.y = 185;
            me.region.bind(me.databinder, "Region");
            me.region.label = "Region";
            me.textbox2.x = 195;
            me.textbox2.y = 185;
            me.textbox2.label = "Country";
            me.textbox2.bind(me.databinder, "Country");
            this.width = 940;
            this.height = 377;
            me.phone.x = 10;
            me.phone.y = 230;
            me.phone.label = "Phone";
            me.phone.bind(me.databinder, "Phone");
            me.fax.x = 195;
            me.fax.y = 230;
            me.fax.label = "Fax";
            me.fax.bind(me.databinder, "Fax");
            me.toolbar.height = 20;
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Customer_1.Customer)
    ], CustomerView.prototype, "value", void 0);
    CustomerView = __decorate([
        DBObjectView_1.$DBObjectView({
            classname: "northwind.Customer",
            actionname: "Northwind/Customers",
            icon: "mdi mdi-nature-people"
        }),
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
//# sourceMappingURL=CustomerView.js.map