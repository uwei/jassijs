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
exports.test = exports.Order = void 0;
const OrderDetails_1 = require("northwind/remote/OrderDetails");
const Customer_1 = require("tests/remote/Customer");
const DBObject_1 = require("jassijs/remote/DBObject");
const Jassi_1 = require("jassijs/remote/Jassi");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
let Order = class Order extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
__decorate([
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    DatabaseSchema_1.ManyToOne(type => Customer_1.Customer),
    __metadata("design:type", Customer_1.Customer)
], Order.prototype, "customer", void 0);
__decorate([
    DatabaseSchema_1.ManyToOne(type => OrderDetails_1.OrderDetails),
    __metadata("design:type", OrderDetails_1.OrderDetails)
], Order.prototype, "details", void 0);
Order = __decorate([
    DBObject_1.$DBObject(),
    Jassi_1.$Class("tests.Order"),
    __metadata("design:paramtypes", [])
], Order);
exports.Order = Order;
async function test() {
}
exports.test = test;
;
//# sourceMappingURL=Order.js.map