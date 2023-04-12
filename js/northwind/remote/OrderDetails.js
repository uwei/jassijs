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
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.OrderDetails = void 0;
const Products_1 = require("northwind/remote/Products");
const Orders_1 = require("northwind/remote/Orders");
const DBObject_1 = require("jassijs/remote/DBObject");
const Registry_1 = require("jassijs/remote/Registry");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const Validator_1 = require("jassijs/remote/Validator");
let OrderDetails = class OrderDetails extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
__decorate([
    (0, Validator_1.ValidateIsInt)({ optional: true }),
    (0, DatabaseSchema_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderDetails.prototype, "id", void 0);
__decorate([
    (0, Validator_1.ValidateIsInstanceOf)({ type: Orders_1.Orders }),
    (0, DatabaseSchema_1.ManyToOne)(type => Orders_1.Orders, e => e.Details),
    __metadata("design:type", Orders_1.Orders)
], OrderDetails.prototype, "Order", void 0);
__decorate([
    (0, Validator_1.ValidateIsInstanceOf)({ type: Products_1.Products }),
    (0, DatabaseSchema_1.ManyToOne)(type => Products_1.Products),
    __metadata("design:type", Products_1.Products)
], OrderDetails.prototype, "Product", void 0);
__decorate([
    (0, Validator_1.ValidateIsNumber)(),
    (0, DatabaseSchema_1.Column)({ nullable: false, type: "decimal" }),
    __metadata("design:type", Number)
], OrderDetails.prototype, "UnitPrice", void 0);
__decorate([
    (0, Validator_1.ValidateIsNumber)(),
    (0, DatabaseSchema_1.Column)(),
    __metadata("design:type", Number)
], OrderDetails.prototype, "Quantity", void 0);
__decorate([
    (0, Validator_1.ValidateIsNumber)(),
    (0, DatabaseSchema_1.Column)({ nullable: true, type: "decimal" }),
    __metadata("design:type", Number)
], OrderDetails.prototype, "Discount", void 0);
OrderDetails = __decorate([
    (0, DBObject_1.$DBObject)(),
    (0, Registry_1.$Class)("northwind.OrderDetails"),
    __metadata("design:paramtypes", [])
], OrderDetails);
exports.OrderDetails = OrderDetails;
async function test() {
}
exports.test = test;
;
//# sourceMappingURL=OrderDetails.js.map