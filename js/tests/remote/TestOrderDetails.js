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
exports.test = exports.TestOrderDetails = void 0;
const TestOrder_1 = require("tests/remote/TestOrder");
const DBObject_1 = require("jassijs/remote/DBObject");
const Registry_1 = require("jassijs/remote/Registry");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const Rights_1 = require("jassijs/remote/security/Rights");
let TestOrderDetails = class TestOrderDetails extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
__decorate([
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], TestOrderDetails.prototype, "id", void 0);
__decorate([
    Rights_1.$CheckParentRight(),
    DatabaseSchema_1.ManyToOne(type => TestOrder_1.TestOrder, e => e.details),
    __metadata("design:type", TestOrder_1.TestOrder)
], TestOrderDetails.prototype, "Order", void 0);
TestOrderDetails = __decorate([
    DBObject_1.$DBObject(),
    Registry_1.$Class("tests.TestOrderDetails"),
    __metadata("design:paramtypes", [])
], TestOrderDetails);
exports.TestOrderDetails = TestOrderDetails;
async function test() {
}
exports.test = test;
;
//# sourceMappingURL=TestOrderDetails.js.map