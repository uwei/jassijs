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
exports.test = exports.Products = void 0;
const Categories_1 = require("northwind/remote/Categories");
const Suppliers_1 = require("northwind/remote/Suppliers");
const DBObject_1 = require("jassijs/remote/DBObject");
const Registry_1 = require("jassijs/remote/Registry");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const Validator_1 = require("jassijs/remote/Validator");
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
    // var p: Products = <Products>await Products.findOne();
    //  var tr=new Transaction();
    /*    var ret=await tr.useTransaction(async ()=>{
          // var c1=new Products();
         //  c1.id=58800;
         //  var c2=new Products();
         //  c2.id="aa500585";
           var ret=[];
          // ret.push(p.save()),
        //    ret.push(p.save());
         
           return ret;
       });*/
}
exports.test = test;
//# sourceMappingURL=Products.js.map