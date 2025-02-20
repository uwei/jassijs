var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Suppliers", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, NumberConverter_1, Textbox_1, Registry_1, Panel_1, Suppliers_1, DBObjectView_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SuppliersView = void 0;
    let SuppliersView = class SuppliersView extends DBObjectView_1.DBObjectView {
        get title() {
            return this.value === undefined ? "SuppliersView" : "SuppliersView " + this.value.id;
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.id, converter: new NumberConverter_1.NumberConverter(), label: "Id" }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.CompanyName, label: "Company Name" }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.ContactName, label: "Contact Name" }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Contact Title", bind: this.state.value.bind.ContactTitle }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.Address, label: "Address", width: 330 }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.PostalCode, label: "Postal Code" }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.City, label: "City" }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.Region, label: "Region" }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.Country, label: "Country" }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Phone", bind: this.state.value.bind.Phone }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Fax", bind: this.state.value.bind.Fax }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Homepage", bind: this.state.value.bind.HomePage, width: 330 })
                ]
            });
        }
    };
    SuppliersView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Suppliers", actionname: "Northwind/Suppliers", icon: "mdi mdi-office-building-outline" }),
        (0, Registry_1.$Class)("northwind.SuppliersView")
    ], SuppliersView);
    exports.SuppliersView = SuppliersView;
    async function test() {
        var sup = await Suppliers_1.Suppliers.findOne();
        var ret = new SuppliersView({
            value: sup
        });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=SuppliersView.js.map