var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "northwind/remote/Categories", "northwind/remote/Suppliers", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Validator"], function (require, exports, Categories_1, Suppliers_1, DBObject_1, Registry_1, DatabaseSchema_1, Validator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Products = void 0;
    let Products = class Products extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, Validator_1.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Products.prototype, "id", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "ProductName", void 0);
    __decorate([
        (0, Validator_1.ValidateIsInstanceOf)({ type: type => Suppliers_1.Suppliers }),
        (0, DatabaseSchema_1.ManyToOne)(type => Suppliers_1.Suppliers),
        __metadata("design:type", Suppliers_1.Suppliers)
    ], Products.prototype, "Supplier", void 0);
    __decorate([
        (0, Validator_1.ValidateIsInstanceOf)({ type: c => Categories_1.Categories }),
        (0, DatabaseSchema_1.ManyToOne)(type => Categories_1.Categories, e => e.Products),
        __metadata("design:type", Categories_1.Categories)
    ], Products.prototype, "Category", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "QuantityPerUnit", void 0);
    __decorate([
        (0, Validator_1.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitPrice", void 0);
    __decorate([
        (0, Validator_1.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsInStock", void 0);
    __decorate([
        (0, Validator_1.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsOnOrder", void 0);
    __decorate([
        (0, Validator_1.ValidateIsNumber)({ optional: true }),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "ReorderLevel", void 0);
    __decorate([
        (0, Validator_1.ValidateIsBoolean)(),
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", Boolean)
    ], Products.prototype, "Discontinued", void 0);
    Products = __decorate([
        (0, DBObject_1.$DBObject)(),
        (0, Registry_1.$Class)("northwind.Products"),
        __metadata("design:paramtypes", [])
    ], Products);
    exports.Products = Products;
    async function test() {
        var p = await Products.findOne();
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=Products.js.map