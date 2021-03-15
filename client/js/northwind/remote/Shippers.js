var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, DBObject_1, Jassi_1, DatabaseSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Shippers = void 0;
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hpcHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9ub3J0aHdpbmQvcmVtb3RlL1NoaXBwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFNQSxJQUFhLFFBQVEsR0FBckIsTUFBYSxRQUFTLFNBQVEsbUJBQVE7UUFHbEM7WUFDSSxLQUFLLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FLSixDQUFBO0lBUkc7UUFEQyw4QkFBYSxFQUFFOzt3Q0FDTDtJQUtYO1FBREMsdUJBQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzs7aURBQ047SUFFcEI7UUFEQyx1QkFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDOzsyQ0FDWjtJQVRMLFFBQVE7UUFGcEIsb0JBQVMsRUFBRTtRQUNYLGNBQU0sQ0FBQyxvQkFBb0IsQ0FBQzs7T0FDaEIsUUFBUSxDQVVwQjtJQVZZLDRCQUFRO0lBV2QsS0FBSyxVQUFVLElBQUk7SUFDMUIsQ0FBQztJQURELG9CQUNDO0lBQ0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERCT2JqZWN0LCAkREJPYmplY3QgfSBmcm9tIFwiamFzc2kvcmVtb3RlL0RCT2JqZWN0XCI7XG5pbXBvcnQgamFzc2ksIHsgJENsYXNzIH0gZnJvbSBcImphc3NpL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgRW50aXR5LCBQcmltYXJ5Q29sdW1uLCBDb2x1bW4sIE9uZVRvT25lLCBNYW55VG9NYW55LCBNYW55VG9PbmUsIE9uZVRvTWFueSwgSm9pbkNvbHVtbiwgSm9pblRhYmxlIH0gZnJvbSBcImphc3NpL3V0aWwvRGF0YWJhc2VTY2hlbWFcIjtcbmltcG9ydCB7ICREQk9iamVjdFF1ZXJ5IH0gZnJvbSBcImphc3NpL3JlbW90ZS9EQk9iamVjdFF1ZXJ5XCI7XG5AJERCT2JqZWN0KClcbkAkQ2xhc3MoXCJub3J0aHdpbmQuU2hpcHBlcnNcIilcbmV4cG9ydCBjbGFzcyBTaGlwcGVycyBleHRlbmRzIERCT2JqZWN0IHtcbiAgICBAUHJpbWFyeUNvbHVtbigpXG4gICAgaWQ6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgQENvbHVtbih7XHRudWxsYWJsZTogdHJ1ZX0pXG4gICAgQ29tcGFueU5hbWU6IHN0cmluZztcbiAgICBAQ29sdW1uKHtcdG51bGxhYmxlOiB0cnVlfSlcbiAgICBQaG9uZTogc3RyaW5nO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG59XG47XG4iXX0=