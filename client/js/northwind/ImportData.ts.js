var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/Panel"], function (require, exports, Jassi_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ImportData = void 0;
    let ImportData = class ImportData {
    };
    ImportData = __decorate([
        Jassi_1.$Class("northwind/ImportData.ts")
    ], ImportData);
    exports.ImportData = ImportData;
    ts;
    Panel_1.Panel;
    {
        me: Me;
        constructor();
        {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me, Me);
        {
        }
    }
    async function test() {
        var ret = new ImportData.ts();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=ImportData.ts.js.map