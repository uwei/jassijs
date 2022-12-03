var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Registry_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TableColumnImport = void 0;
    let TableColumnImport = class TableColumnImport extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            //default dataformat
            //default numberformat
            //selectable table fields to import
            //button import fields
            this.config({});
        }
    };
    TableColumnImport = __decorate([
        (0, Registry_1.$Class)("jassijs/ui/PropertyEditors/TableColumnImport"),
        __metadata("design:paramtypes", [])
    ], TableColumnImport);
    exports.TableColumnImport = TableColumnImport;
    async function test() {
        var ret = new TableColumnImport();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=TableColumnImport.js.map