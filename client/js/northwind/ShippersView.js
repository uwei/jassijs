var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Shippers", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Registry_1, Property_1, Shippers_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ShippersView = void 0;
    let ShippersView = class ShippersView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "ShippersView" : "ShippersView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_1.Textbox();
            me.phone = new Textbox_1.Textbox();
            me.companyName = new Textbox_1.Textbox();
            this.me.main.config({
                isAbsolute: true,
                width: "626",
                height: "150",
                children: [
                    me.id.config({
                        converter: new NumberConverter_1.NumberConverter(),
                        bind: [me.databinder, "id"],
                        label: "Id",
                        width: 40,
                        x: 5,
                        y: 0
                    }),
                    me.companyName.config({
                        x: 60,
                        y: 0,
                        bind: [me.databinder, "CompanyName"],
                        label: "Company name",
                        width: 160
                    }),
                    me.phone.config({
                        x: 5,
                        y: 50,
                        width: 215,
                        bind: [me.databinder, "Phone"],
                        label: "Phone"
                    })
                ]
            });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Shippers_1.Shippers)
    ], ShippersView.prototype, "value", void 0);
    ShippersView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Shippers", actionname: "Northwind/Shippers", icon: "mdi mdi-truck-delivery" }),
        (0, Registry_1.$Class)("northwind.ShippersView"),
        __metadata("design:paramtypes", [])
    ], ShippersView);
    exports.ShippersView = ShippersView;
    async function test() {
        var ret = new ShippersView;
        ret["value"] = await Shippers_1.Shippers.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=ShippersView.js.map