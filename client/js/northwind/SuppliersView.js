var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Suppliers", "jassi/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Jassi_1, Property_1, Suppliers_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SuppliersView = void 0;
    let SuppliersView = class SuppliersView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "SuppliersView" : "SuppliersView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_1.Textbox();
            me.companyName = new Textbox_1.Textbox();
            me.contactName = new Textbox_1.Textbox();
            me.contactTitle = new Textbox_1.Textbox();
            me.address = new Textbox_1.Textbox();
            me.postalCode = new Textbox_1.Textbox();
            me.city = new Textbox_1.Textbox();
            me.region = new Textbox_1.Textbox();
            me.Country = new Textbox_1.Textbox();
            me.phone = new Textbox_1.Textbox();
            me.fax = new Textbox_1.Textbox();
            me.homepage = new Textbox_1.Textbox();
            me.main.add(me.id);
            me.main.isAbsolute = true;
            me.main.height = "800";
            me.main.width = 800;
            me.main.add(me.homepage);
            me.main.add(me.fax);
            me.main.add(me.phone);
            me.main.add(me.Country);
            me.main.add(me.region);
            me.main.add(me.city);
            me.main.add(me.postalCode);
            me.main.add(me.address);
            me.main.add(me.contactTitle);
            me.main.add(me.contactName);
            me.main.add(me.companyName);
            me.id.x = 10;
            me.id.y = 5;
            me.id.converter = new NumberConverter_1.NumberConverter();
            me.id.width = 50;
            me.id.bind(me.databinder, "id");
            me.id.label = "Id";
            me.companyName.x = 75;
            me.companyName.y = 5;
            me.companyName.label = "Company Name";
            me.companyName.bind(me.databinder, "CompanyName");
            me.companyName.width = 290;
            me.contactName.x = 10;
            me.contactName.y = 50;
            me.contactName.bind(me.databinder, "ContactName");
            me.contactName.label = "Contact Name";
            me.contactTitle.x = 180;
            me.contactTitle.y = 50;
            me.contactTitle.bind(me.databinder, "ContactTitle");
            me.contactTitle.label = "Contact Title";
            me.contactTitle.width = 185;
            me.address.x = 10;
            me.address.y = 95;
            me.address.bind(me.databinder, "Address");
            me.address.label = "Address";
            me.address.width = 355;
            me.postalCode.x = 10;
            me.postalCode.y = 140;
            me.postalCode.bind(me.databinder, "PostalCode");
            me.postalCode.width = 95;
            me.postalCode.label = "Postal Code";
            me.city.x = 120;
            me.city.y = 140;
            me.city.bind(me.databinder, "City");
            me.city.label = "City";
            me.city.width = 245;
            me.region.x = 10;
            me.region.y = 185;
            me.region.bind(me.databinder, "Region");
            me.region.label = "Region";
            me.region.width = 155;
            me.Country.x = 180;
            me.Country.y = 185;
            me.Country.bind(me.databinder, "Country");
            me.Country.label = "Country";
            me.Country.width = 185;
            me.phone.x = 10;
            me.phone.y = 230;
            me.phone.bind(me.databinder, "Phone");
            me.phone.label = "Phone";
            me.phone.width = 155;
            me.fax.x = 180;
            me.fax.y = 230;
            me.fax.bind(me.databinder, "Fax");
            me.fax.label = "Fax";
            me.fax.width = 185;
            me.homepage.x = 10;
            me.homepage.y = 275;
            me.homepage.bind(me.databinder, "HomePage");
            me.homepage.label = "Home Page";
            me.homepage.width = 355;
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Suppliers_1.Suppliers)
    ], SuppliersView.prototype, "value", void 0);
    SuppliersView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.Suppliers", actionname: "Northwind/Suppliers", icon: "mdi mdi-office-building-outline" }),
        Jassi_1.$Class("northwind.SuppliersView"),
        __metadata("design:paramtypes", [])
    ], SuppliersView);
    exports.SuppliersView = SuppliersView;
    async function test() {
        var ret = new SuppliersView;
        ret["value"] = await Suppliers_1.Suppliers.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=SuppliersView.js.map