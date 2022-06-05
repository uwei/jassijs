var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema"], function (require, exports, DBObject_1, Jassi_1, DatabaseSchema_1) {
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
        (0, Jassi_1.$Class)("testrmodul.TestRCustomer"),
        __metadata("design:paramtypes", [])
    ], TestRCustomer);
    exports.TestRCustomer = TestRCustomer;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFJDdXN0b21lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RybW9kdWwvcmVtb3RlL1Rlc3RSQ3VzdG9tZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQU1BLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWMsU0FBUSxtQkFBUTtRQUd2QztZQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1osQ0FBQztLQUdKLENBQUE7SUFORztRQURDLElBQUEsOEJBQWEsR0FBRTs7NkNBQ0w7SUFLWDtRQURDLElBQUEsdUJBQU0sR0FBRTs7K0NBQ0k7SUFQSixhQUFhO1FBRnpCLElBQUEsb0JBQVMsR0FBRTtRQUNYLElBQUEsY0FBTSxFQUFDLDBCQUEwQixDQUFDOztPQUN0QixhQUFhLENBUXpCO0lBUlksc0NBQWE7SUFTbkIsS0FBSyxVQUFVLElBQUk7SUFDMUIsQ0FBQztJQURELG9CQUNDO0lBQ0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERCT2JqZWN0LCAkREJPYmplY3QgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvREJPYmplY3RcIjtcbmltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgRW50aXR5LCBQcmltYXJ5Q29sdW1uLCBDb2x1bW4sIE9uZVRvT25lLCBNYW55VG9NYW55LCBNYW55VG9PbmUsIE9uZVRvTWFueSwgSm9pbkNvbHVtbiwgSm9pblRhYmxlIH0gZnJvbSBcImphc3NpanMvdXRpbC9EYXRhYmFzZVNjaGVtYVwiO1xuaW1wb3J0IHsgJERCT2JqZWN0UXVlcnkgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvREJPYmplY3RRdWVyeVwiO1xuQCREQk9iamVjdCgpXG5AJENsYXNzKFwidGVzdHJtb2R1bC5UZXN0UkN1c3RvbWVyXCIpXG5leHBvcnQgY2xhc3MgVGVzdFJDdXN0b21lciBleHRlbmRzIERCT2JqZWN0IHtcbiAgICBAUHJpbWFyeUNvbHVtbigpXG4gICAgaWQ6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgQENvbHVtbigpXG4gICAgbmFtZTogc3RyaW5nO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG59XG47XG4iXX0=