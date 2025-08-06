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
var Orders_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.Orders = void 0;
const OrderDetails_1 = require("northwind/remote/OrderDetails");
const Employees_1 = require("northwind/remote/Employees");
const Customer_1 = require("northwind/remote/Customer");
const DBObject_1 = require("jassijs/remote/DBObject");
const Registry_1 = require("jassijs/remote/Registry");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const Shippers_1 = require("northwind/remote/Shippers");
const Validator_1 = require("jassijs/remote/Validator");
let Orders = Orders_1 = class Orders extends DBObject_1.DBObject {
    constructor() {
        super();
    }
    static async findAllWithDetails(context) {
        return await Orders_1.find({ relations: ["*"] }, context);
    }
};
__decorate([
    (0, Validator_1.ValidateIsNumber)({ optional: true }),
    (0, DatabaseSchema_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Orders.prototype, "id", void 0);
__decorate([
    (0, Validator_1.ValidateIsInstanceOf)({ type: type => Customer_1.Customer }),
    (0, DatabaseSchema_1.ManyToOne)(type => Customer_1.Customer),
    __metadata("design:type", Customer_1.Customer)
], Orders.prototype, "Customer", void 0);
__decorate([
    (0, Validator_1.ValidateIsInstanceOf)({ type: type => Employees_1.Employees }),
    (0, DatabaseSchema_1.ManyToOne)(type => Employees_1.Employees),
    __metadata("design:type", Employees_1.Employees)
], Orders.prototype, "Employee", void 0);
__decorate([
    (0, Validator_1.ValidateIsDate)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Orders.prototype, "OrderDate", void 0);
__decorate([
    (0, Validator_1.ValidateIsDate)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Orders.prototype, "RequiredDate", void 0);
__decorate([
    (0, Validator_1.ValidateIsDate)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Orders.prototype, "ShippedDate", void 0);
__decorate([
    (0, Validator_1.ValidateIsInstanceOf)({ type: type => Shippers_1.Shippers }),
    (0, DatabaseSchema_1.ManyToOne)(type => Shippers_1.Shippers),
    __metadata("design:type", Shippers_1.Shippers)
], Orders.prototype, "ShipVia", void 0);
__decorate([
    (0, Validator_1.ValidateIsNumber)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true, type: "decimal" }),
    __metadata("design:type", Number)
], Orders.prototype, "Freight", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Orders.prototype, "ShipName", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Orders.prototype, "ShipAddress", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Orders.prototype, "ShipCity", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Orders.prototype, "ShipRegion", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Orders.prototype, "ShipPostalCode", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Orders.prototype, "ShipCountry", void 0);
__decorate([
    (0, Validator_1.ValidateIsArray)({ type: type => OrderDetails_1.OrderDetails }),
    (0, DatabaseSchema_1.OneToMany)(type => OrderDetails_1.OrderDetails, e => e.Order),
    __metadata("design:type", Array)
], Orders.prototype, "Details", void 0);
Orders = Orders_1 = __decorate([
    (0, DBObject_1.$DBObject)(),
    (0, Registry_1.$Class)("northwind.Orders"),
    __metadata("design:paramtypes", [])
], Orders);
exports.Orders = Orders;
async function test() {
}
exports.test = test;
;
//# sourceMappingURL=Orders.js.map