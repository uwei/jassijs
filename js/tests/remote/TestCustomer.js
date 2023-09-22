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
exports.test = exports.TestCustomer = void 0;
const TestOrder_1 = require("tests/remote/TestOrder");
const DBObject_1 = require("jassijs/remote/DBObject");
const Registry_1 = require("jassijs/remote/Registry");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const Rights_1 = require("jassijs/remote/security/Rights");
let TestCustomer = class TestCustomer extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
__decorate([
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], TestCustomer.prototype, "id", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], TestCustomer.prototype, "name", void 0);
__decorate([
    DatabaseSchema_1.OneToMany(type => TestOrder_1.TestOrder, order => order.customer),
    __metadata("design:type", Array)
], TestCustomer.prototype, "orders", void 0);
TestCustomer = __decorate([
    Rights_1.$ParentRights([{ name: "TestCustomers", sqlToCheck: "me.id>=:i1 and me.id<=:i2",
            description: {
                text: "TestCustomer",
                i1: "from",
                i2: "to"
            } }]),
    DBObject_1.$DBObject(),
    Registry_1.$Class("tests.TestCustomer"),
    __metadata("design:paramtypes", [])
], TestCustomer);
exports.TestCustomer = TestCustomer;
async function test() {
}
exports.test = test;
;
//# sourceMappingURL=TestCustomer.js.map