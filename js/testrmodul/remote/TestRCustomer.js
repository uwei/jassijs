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
exports.TestRCustomer = void 0;
exports.test = test;
const DBObject_1 = require("jassijs/remote/DBObject");
const Registry_1 = require("jassijs/remote/Registry");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
let TestRCustomer = class TestRCustomer extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
exports.TestRCustomer = TestRCustomer;
__decorate([
    (0, DatabaseSchema_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], TestRCustomer.prototype, "id", void 0);
__decorate([
    (0, DatabaseSchema_1.Column)(),
    __metadata("design:type", String)
], TestRCustomer.prototype, "name", void 0);
exports.TestRCustomer = TestRCustomer = __decorate([
    (0, DBObject_1.$DBObject)(),
    (0, Registry_1.$Class)("testrmodul.TestRCustomer"),
    __metadata("design:paramtypes", [])
], TestRCustomer);
async function test() {
}
;
//# sourceMappingURL=TestRCustomer.js.map