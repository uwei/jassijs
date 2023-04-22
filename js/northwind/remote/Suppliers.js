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
exports.test = exports.Suppliers = void 0;
const DBObject_1 = require("jassijs/remote/DBObject");
const Registry_1 = require("jassijs/remote/Registry");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const Validator_1 = require("jassijs/remote/Validator");
let Suppliers = class Suppliers extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
__decorate([
    Validator_1.ValidateIsInt({ optional: true }),
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Suppliers.prototype, "id", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "CompanyName", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "ContactName", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "ContactTitle", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "Address", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "City", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "Region", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "PostalCode", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "Country", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "Phone", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "Fax", void 0);
__decorate([
    Validator_1.ValidateIsString({ optional: true }),
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Suppliers.prototype, "HomePage", void 0);
Suppliers = __decorate([
    DBObject_1.$DBObject(),
    Registry_1.$Class("northwind.Suppliers"),
    __metadata("design:paramtypes", [])
], Suppliers);
exports.Suppliers = Suppliers;
async function test() {
}
exports.test = test;
;
function ValidateIsIntn(arg0) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=Suppliers.js.map