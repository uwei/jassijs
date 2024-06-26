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
exports.test = exports.Customer = void 0;
const DBObject_1 = require("jassijs/remote/DBObject");
const Registry_1 = require("jassijs/remote/Registry");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const Validator_1 = require("jassijs/remote/Validator");
let Customer = class Customer extends DBObject_1.DBObject {
    constructor() {
        super();
        this.CompanyName = "";
        this.ContactName = "";
        this.ContactTitle = "";
        this.Address = "";
        this.City = "";
        /*  this.id = 0;
          this.vorname = "";
          this.nachname = "";
          this.strasse = "";
          this.PLZ = "";
          this.hausnummer = 0;
          this.initExtensions();*/
    }
};
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Customer.prototype, "id", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)(),
    (0, DatabaseSchema_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "CompanyName", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)(),
    (0, DatabaseSchema_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "ContactName", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)(),
    (0, DatabaseSchema_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "ContactTitle", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)(),
    (0, DatabaseSchema_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "Address", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)(),
    (0, DatabaseSchema_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "City", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true })
    // @Column({default:""})
    ,
    __metadata("design:type", String)
], Customer.prototype, "Region", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "PostalCode", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "Country", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "Phone", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "Fax", void 0);
Customer = __decorate([
    (0, DBObject_1.$DBObject)(),
    (0, Registry_1.$Class)("northwind.Customer"),
    __metadata("design:paramtypes", [])
], Customer);
exports.Customer = Customer;
async function test() {
    var all = await Customer.find();
    //var cus2=<Customer>await Customer.findOne();
    //debugger;
    //await Kunde.sample();
    //	new de.Kunde().generate();
    //jassijs.db.uploadType(de.Kunde);
}
exports.test = test;
;
//# sourceMappingURL=Customer.js.map