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
    exports.test = exports.Suppliers = void 0;
    let Suppliers = class Suppliers extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Suppliers.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "CompanyName", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "ContactName", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "ContactTitle", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Address", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "City", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Region", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "PostalCode", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Country", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Phone", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "Fax", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Suppliers.prototype, "HomePage", void 0);
    Suppliers = __decorate([
        DBObject_1.$DBObject(),
        Jassi_1.$Class("northwind.Suppliers"),
        __metadata("design:paramtypes", [])
    ], Suppliers);
    exports.Suppliers = Suppliers;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3VwcGxpZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbm9ydGh3aW5kL3JlbW90ZS9TdXBwbGllcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQU1BLElBQWEsU0FBUyxHQUF0QixNQUFhLFNBQVUsU0FBUSxtQkFBUTtRQUduQztZQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1osQ0FBQztLQXVCSixDQUFBO0lBMUJHO1FBREMsOEJBQWEsRUFBRTs7eUNBQ0w7SUFLWDtRQURDLHVCQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7O2tEQUNOO0lBRXBCO1FBREMsdUJBQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzs7a0RBQ047SUFFcEI7UUFEQyx1QkFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDOzttREFDTDtJQUVyQjtRQURDLHVCQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7OzhDQUNWO0lBRWhCO1FBREMsdUJBQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzs7MkNBQ2I7SUFFYjtRQURDLHVCQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7OzZDQUNYO0lBRWY7UUFEQyx1QkFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDOztpREFDUDtJQUVuQjtRQURDLHVCQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7OzhDQUNWO0lBRWhCO1FBREMsdUJBQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzs7NENBQ1o7SUFFZDtRQURDLHVCQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7OzBDQUNkO0lBRVo7UUFEQyx1QkFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDOzsrQ0FDVDtJQTNCUixTQUFTO1FBRnJCLG9CQUFTLEVBQUU7UUFDWCxjQUFNLENBQUMscUJBQXFCLENBQUM7O09BQ2pCLFNBQVMsQ0E0QnJCO0lBNUJZLDhCQUFTO0lBNkJmLEtBQUssVUFBVSxJQUFJO0lBQzFCLENBQUM7SUFERCxvQkFDQztJQUNELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEQk9iamVjdCwgJERCT2JqZWN0IH0gZnJvbSBcImphc3NpL3JlbW90ZS9EQk9iamVjdFwiO1xuaW1wb3J0IGphc3NpLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaS9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IEVudGl0eSwgUHJpbWFyeUNvbHVtbiwgQ29sdW1uLCBPbmVUb09uZSwgTWFueVRvTWFueSwgTWFueVRvT25lLCBPbmVUb01hbnksIEpvaW5Db2x1bW4sIEpvaW5UYWJsZSB9IGZyb20gXCJqYXNzaS91dGlsL0RhdGFiYXNlU2NoZW1hXCI7XG5pbXBvcnQgeyAkREJPYmplY3RRdWVyeSB9IGZyb20gXCJqYXNzaS9yZW1vdGUvREJPYmplY3RRdWVyeVwiO1xuQCREQk9iamVjdCgpXG5AJENsYXNzKFwibm9ydGh3aW5kLlN1cHBsaWVyc1wiKVxuZXhwb3J0IGNsYXNzIFN1cHBsaWVycyBleHRlbmRzIERCT2JqZWN0IHtcbiAgICBAUHJpbWFyeUNvbHVtbigpXG4gICAgaWQ6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgQENvbHVtbih7XHRudWxsYWJsZTogdHJ1ZX0pXG4gICAgQ29tcGFueU5hbWU6IHN0cmluZztcbiAgICBAQ29sdW1uKHtcdG51bGxhYmxlOiB0cnVlfSlcbiAgICBDb250YWN0TmFtZTogc3RyaW5nO1xuICAgIEBDb2x1bW4oe1x0bnVsbGFibGU6IHRydWV9KVxuICAgIENvbnRhY3RUaXRsZTogc3RyaW5nO1xuICAgIEBDb2x1bW4oe1x0bnVsbGFibGU6IHRydWV9KVxuICAgIEFkZHJlc3M6IHN0cmluZztcbiAgICBAQ29sdW1uKHtcdG51bGxhYmxlOiB0cnVlfSlcbiAgICBDaXR5OiBzdHJpbmc7XG4gICAgQENvbHVtbih7XHRudWxsYWJsZTogdHJ1ZX0pXG4gICAgUmVnaW9uOiBzdHJpbmc7XG4gICAgQENvbHVtbih7XHRudWxsYWJsZTogdHJ1ZX0pXG4gICAgUG9zdGFsQ29kZTogc3RyaW5nO1xuICAgIEBDb2x1bW4oe1x0bnVsbGFibGU6IHRydWV9KVxuICAgIENvdW50cnk6IHN0cmluZztcbiAgICBAQ29sdW1uKHtcdG51bGxhYmxlOiB0cnVlfSlcbiAgICBQaG9uZTogc3RyaW5nO1xuICAgIEBDb2x1bW4oe1x0bnVsbGFibGU6IHRydWV9KVxuICAgIEZheDogc3RyaW5nO1xuICAgIEBDb2x1bW4oe1x0bnVsbGFibGU6IHRydWV9KVxuICAgIEhvbWVQYWdlOiBzdHJpbmc7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbn1cbjtcbiJdfQ==