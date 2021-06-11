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
const Order_1 = require("tests/remote/Order");
const DBObject_1 = require("jassijs/remote/DBObject");
const Jassi_1 = require("jassijs/remote/Jassi");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
let OrderDetails = class OrderDetails extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
__decorate([
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], OrderDetails.prototype, "id", void 0);
__decorate([
    DatabaseSchema_1.ManyToOne(type => Order_1.Order),
    __metadata("design:type", Order_1.Order)
], OrderDetails.prototype, "order", void 0);
OrderDetails = __decorate([
    DBObject_1.$DBObject(),
    Jassi_1.$Class("tests.OrderDetails"),
    __metadata("design:paramtypes", [])
], OrderDetails);
exports.OrderDetails = OrderDetails;
async function test() {
}
exports.test = test;
;
//# sourceMappingURL=OrderDetails.js.map