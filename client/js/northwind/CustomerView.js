var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Registry", "northwind/remote/Customer", "jassijs/ui/DBObjectView", "jassijs/ui/Component", "jassijs/ui/Panel"], function (require, exports, Textbox_1, Registry_1, Customer_1, DBObjectView_1, Component_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerView = void 0;
    let CustomerView = class CustomerView extends DBObjectView_1.DBObjectView {
        get title() {
            return this.value === undefined ? "CustomerView" : "CustomerView " + this.value.id;
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.states.value.bind.id,
                        width: 65,
                        label: "id"
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Contact Name",
                        bind: this.states.value.bind.ContactName,
                        width: 255
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Contact Title",
                        bind: this.states.value.bind.ContactTitle,
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.states.value.bind.ContactName,
                        label: "Company Name",
                        width: 155
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.states.value.bind.Address,
                        label: "Address",
                        width: 325
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Postal Code",
                        bind: this.states.value.bind.PostalCode,
                        width: 90
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "City",
                        width: 230,
                        bind: this.states.value.bind.City,
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.states.value.bind.Region,
                        label: "Region"
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Country",
                        bind: this.states.value.bind.Country,
                        width: 155,
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Phone",
                        bind: this.states.value.bind.Phone,
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Fax",
                        bind: this.states.value.bind.Fax,
                        width: 155,
                    })
                ]
            });
        }
    };
    CustomerView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({
            classname: "northwind.Customer",
            actionname: "Northwind/Customers",
            icon: "mdi mdi-nature-people"
        }),
        (0, Registry_1.$Class)("northwind.CustomerView")
    ], CustomerView);
    exports.CustomerView = CustomerView;
    async function test() {
        var ret = new CustomerView;
        ret.value = await Customer_1.Customer.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=CustomerView.js.map