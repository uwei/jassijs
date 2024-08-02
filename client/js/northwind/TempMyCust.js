var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Customer", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, Textbox_1, Registry_1, Panel_1, Customer_1, DBObjectView_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TempMyCust = void 0;
    let TempMyCust = class TempMyCust extends DBObjectView_1.DBObjectView {
        get title() {
            return this.value === undefined ? "TempMyCust" : "TempMyCust " + this.value.id;
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.ObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.states.value.bind.CompanyName
                    })
                ]
            });
        }
    };
    TempMyCust = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Customer" }),
        (0, Registry_1.$Class)("northwind.TempMyCust")
    ], TempMyCust);
    exports.TempMyCust = TempMyCust;
    async function test() {
        var ret = new TempMyCust();
        ret.value = await Customer_1.Customer.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=TempMyCust.js.map