var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "de/remote/Kunde", "jassijs/ui/DBObjectView"], function (require, exports, Registry_1, Property_1, Kunde_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.myview2 = void 0;
    let myview2 = class myview2 extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "myview2" : "myview2 " + this.value.id;
        }
        layout(me) {
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Kunde_1.Kunde)
    ], myview2.prototype, "value", void 0);
    myview2 = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "de.Kunde" }),
        (0, Registry_1.$Class)("de.myview2"),
        __metadata("design:paramtypes", [])
    ], myview2);
    exports.myview2 = myview2;
    async function test() {
        var ret = new myview2();
        ret["value"] = await Kunde_1.Kunde.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=myview2.js.map