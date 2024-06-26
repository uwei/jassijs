var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "tests/remote/TestOrderDetails", "tests/remote/TestCustomer", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Rights"], function (require, exports, TestOrderDetails_1, TestCustomer_1, DBObject_1, Registry_1, DatabaseSchema_1, Rights_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestOrder = void 0;
    let TestOrder = class TestOrder extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], TestOrder.prototype, "id", void 0);
    __decorate([
        (0, Rights_1.$CheckParentRight)(),
        (0, DatabaseSchema_1.ManyToOne)(type => TestCustomer_1.TestCustomer),
        __metadata("design:type", TestCustomer_1.TestCustomer)
    ], TestOrder.prototype, "customer", void 0);
    __decorate([
        (0, DatabaseSchema_1.OneToMany)(type => TestOrderDetails_1.TestOrderDetails, e => e.Order),
        __metadata("design:type", Array)
    ], TestOrder.prototype, "details", void 0);
    TestOrder = __decorate([
        (0, DBObject_1.$DBObject)(),
        (0, Registry_1.$Class)("tests.TestOrder"),
        __metadata("design:paramtypes", [])
    ], TestOrder);
    exports.TestOrder = TestOrder;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=TestOrder.js.map