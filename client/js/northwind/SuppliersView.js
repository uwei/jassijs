var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Suppliers", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Registry_1, Property_1, Suppliers_1, DBObjectView_1) {
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
            me.homepage = new Textbox_1.Textbox();
            me.fax = new Textbox_1.Textbox();
            me.phone = new Textbox_1.Textbox();
            me.Country = new Textbox_1.Textbox();
            me.region = new Textbox_1.Textbox();
            me.city = new Textbox_1.Textbox();
            me.postalCode = new Textbox_1.Textbox();
            me.address = new Textbox_1.Textbox();
            me.contactTitle = new Textbox_1.Textbox();
            me.contactName = new Textbox_1.Textbox();
            me.companyName = new Textbox_1.Textbox();
            this.me.main.config({ isAbsolute: true, width: "800", height: "800", children: [
                    me.id.config({
                        x: 10,
                        y: 5,
                        converter: new NumberConverter_1.NumberConverter(),
                        width: 50,
                        bind: [me.databinder, "id"],
                        label: "Id"
                    }),
                    me.homepage.config({
                        x: 10,
                        y: 275,
                        bind: [me.databinder, "HomePage"],
                        label: "Home Page",
                        width: 355
                    }),
                    me.fax.config({
                        x: 180,
                        y: 230,
                        bind: [me.databinder, "Fax"],
                        label: "Fax",
                        width: 185
                    }),
                    me.phone.config({
                        x: 10,
                        y: 230,
                        bind: [me.databinder, "Phone"],
                        label: "Phone",
                        width: 155
                    }),
                    me.Country.config({
                        x: 180,
                        y: 185,
                        bind: [me.databinder, "Country"],
                        label: "Country",
                        width: 185
                    }),
                    me.region.config({
                        x: 10,
                        y: 185,
                        bind: [me.databinder, "Region"],
                        label: "Region",
                        width: 155
                    }),
                    me.city.config({
                        x: 120,
                        y: 140,
                        bind: [me.databinder, "City"],
                        label: "City",
                        width: 245
                    }),
                    me.postalCode.config({
                        x: 10,
                        y: 140,
                        bind: [me.databinder, "PostalCode"],
                        width: 95,
                        label: "Postal Code"
                    }),
                    me.address.config({
                        x: 10,
                        y: 95,
                        bind: [me.databinder, "Address"],
                        label: "Address",
                        width: 355
                    }),
                    me.contactTitle.config({
                        x: 180,
                        y: 50,
                        bind: [me.databinder, "ContactTitle"],
                        label: "Contact Title",
                        width: 185
                    }),
                    me.contactName.config({
                        x: 10,
                        y: 50,
                        bind: [me.databinder, "ContactName"],
                        label: "Contact Name"
                    }),
                    me.companyName.config({
                        x: 75,
                        y: 5,
                        label: "Company Name",
                        bind: [me.databinder, "CompanyName"],
                        width: 290
                    })
                ] });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Suppliers_1.Suppliers)
    ], SuppliersView.prototype, "value", void 0);
    SuppliersView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Suppliers", actionname: "Northwind/Suppliers", icon: "mdi mdi-office-building-outline" }),
        (0, Registry_1.$Class)("northwind.SuppliersView"),
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