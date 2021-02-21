var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Employees", "jassi/ui/DBObjectView"], function (require, exports, Jassi_1, Property_1, Employees_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ttt = void 0;
    let ttt = class ttt extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "ttt" : "ttt " + this.value.id;
        }
        layout(me) {
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Employees_1.Employees)
    ], ttt.prototype, "value", void 0);
    ttt = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.Employees" }),
        Jassi_1.$Class("northwind.ttt"),
        __metadata("design:paramtypes", [])
    ], ttt);
    exports.ttt = ttt;
    async function test() {
        var ret = new ttt;
        ret["value"] = await Employees_1.Employees.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=ttt.js.map