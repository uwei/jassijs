"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.Shippers = void 0;
const DBObject_1 = require("jassijs/remote/DBObject");
const Jassi_1 = require("jassijs/remote/Jassi");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
let Shippers = class Shippers extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
__decorate([
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Shippers.prototype, "id", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Shippers.prototype, "CompanyName", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Shippers.prototype, "Phone", void 0);
Shippers = __decorate([
    DBObject_1.$DBObject(),
    Jassi_1.$Class("northwind.Shippers"),
    __metadata("design:paramtypes", [])
], Shippers);
exports.Shippers = Shippers;
async function test() {
}
exports.test = test;
;
//# sourceMappingURL=Shippers.js.map