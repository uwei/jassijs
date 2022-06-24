var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema"], function (require, exports, DBObject_1, Registry_1, DatabaseSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestRCustomer = void 0;
    let TestRCustomer = class TestRCustomer extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], TestRCustomer.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], TestRCustomer.prototype, "name", void 0);
    TestRCustomer = __decorate([
        (0, DBObject_1.$DBObject)(),
        (0, Registry_1.$Class)("testrmodul.TestRCustomer"),
        __metadata("design:paramtypes", [])
    ], TestRCustomer);
    exports.TestRCustomer = TestRCustomer;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFJDdXN0b21lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RybW9kdWwvcmVtb3RlL1Rlc3RSQ3VzdG9tZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQU1BLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWMsU0FBUSxtQkFBUTtRQUd2QztZQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1osQ0FBQztLQUdKLENBQUE7SUFORztRQURDLElBQUEsOEJBQWEsR0FBRTs7NkNBQ0w7SUFLWDtRQURDLElBQUEsdUJBQU0sR0FBRTs7K0NBQ0k7SUFQSixhQUFhO1FBRnpCLElBQUEsb0JBQVMsR0FBRTtRQUNYLElBQUEsaUJBQU0sRUFBQywwQkFBMEIsQ0FBQzs7T0FDdEIsYUFBYSxDQVF6QjtJQVJZLHNDQUFhO0lBU25CLEtBQUssVUFBVSxJQUFJO0lBQzFCLENBQUM7SUFERCxvQkFDQztJQUNELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEQk9iamVjdCwgJERCT2JqZWN0IH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0RCT2JqZWN0XCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVnaXN0cnlcIjtcbmltcG9ydCB7IEVudGl0eSwgUHJpbWFyeUNvbHVtbiwgQ29sdW1uLCBPbmVUb09uZSwgTWFueVRvTWFueSwgTWFueVRvT25lLCBPbmVUb01hbnksIEpvaW5Db2x1bW4sIEpvaW5UYWJsZSB9IGZyb20gXCJqYXNzaWpzL3V0aWwvRGF0YWJhc2VTY2hlbWFcIjtcbmltcG9ydCB7ICREQk9iamVjdFF1ZXJ5IH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0RCT2JqZWN0UXVlcnlcIjtcbkAkREJPYmplY3QoKVxuQCRDbGFzcyhcInRlc3RybW9kdWwuVGVzdFJDdXN0b21lclwiKVxuZXhwb3J0IGNsYXNzIFRlc3RSQ3VzdG9tZXIgZXh0ZW5kcyBEQk9iamVjdCB7XG4gICAgQFByaW1hcnlDb2x1bW4oKVxuICAgIGlkOiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIEBDb2x1bW4oKVxuICAgIG5hbWU6IHN0cmluZztcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xufVxuO1xuIl19