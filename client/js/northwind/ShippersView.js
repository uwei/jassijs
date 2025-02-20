var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Shippers", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, NumberConverter_1, Textbox_1, Registry_1, Panel_1, Shippers_1, DBObjectView_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ShippersView = void 0;
    let ShippersView = class ShippersView extends DBObjectView_1.DBObjectView {
        get title() {
            return this.value === undefined ? "ShippersView" : "ShippersView " + this.value.id;
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        converter: new NumberConverter_1.NumberConverter(),
                        bind: this.state.value.bind.id,
                        label: "Id",
                        width: 40,
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.state.value.bind.CompanyName,
                        label: "Company name",
                        width: 160
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        width: 215,
                        bind: this.state.value.bind.Phone,
                        label: "Phone"
                    })
                ]
            });
        }
    };
    ShippersView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Shippers", actionname: "Northwind/Shippers", icon: "mdi mdi-truck-delivery" }),
        (0, Registry_1.$Class)("northwind.ShippersView")
    ], ShippersView);
    exports.ShippersView = ShippersView;
    async function test() {
        var ret = new ShippersView();
        ret.value = await Shippers_1.Shippers.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=ShippersView.js.map