var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, DBObject_1, Jassi_1, DatabaseSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Categories = void 0;
    let Categories = class Categories extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Categories.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "CategoryName", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "Description", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Categories.prototype, "Picture", void 0);
    Categories = __decorate([
        DBObject_1.$DBObject(),
        Jassi_1.$Class("northwind.Categories"),
        __metadata("design:paramtypes", [])
    ], Categories);
    exports.Categories = Categories;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=Categories.js.map