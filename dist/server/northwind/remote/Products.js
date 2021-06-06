"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.Products = void 0;
const Categories_1 = require("northwind/remote/Categories");
const Suppliers_1 = require("northwind/remote/Suppliers");
const DBObject_1 = require("jassijs/remote/DBObject");
const Jassi_1 = require("jassijs/remote/Jassi");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
let Products = class Products extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
__decorate([
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Products.prototype, "id", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "ProductName", void 0);
__decorate([
    DatabaseSchema_1.ManyToOne(type => Suppliers_1.Suppliers),
    __metadata("design:type", typeof (_a = typeof Suppliers_1.Suppliers !== "undefined" && Suppliers_1.Suppliers) === "function" ? _a : Object)
], Products.prototype, "Supplier", void 0);
__decorate([
    DatabaseSchema_1.ManyToOne(type => Categories_1.Categories, e => e.Products),
    __metadata("design:type", typeof (_b = typeof Categories_1.Categories !== "undefined" && Categories_1.Categories) === "function" ? _b : Object)
], Products.prototype, "Category", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Products.prototype, "QuantityPerUnit", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true, type: "decimal" }),
    __metadata("design:type", Number)
], Products.prototype, "UnitPrice", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Products.prototype, "UnitsInStock", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Products.prototype, "UnitsOnOrder", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Products.prototype, "ReorderLevel", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], Products.prototype, "Discontinued", void 0);
Products = __decorate([
    DBObject_1.$DBObject(),
    Jassi_1.$Class("northwind.Products"),
    __metadata("design:paramtypes", [])
], Products);
exports.Products = Products;
async function test() {
    var p = await Products.findOne();
    debugger;
    p.ProductName = "udo";
    var p2 = await Products.findOne({ onlyColumns: [], relations: ["*"] });
    var k = p === p2;
}
exports.test = test;
;
//# sourceMappingURL=Products.js.map