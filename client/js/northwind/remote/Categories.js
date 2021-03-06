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
    exports.test = exports.Categories = void 0;
    let Categories = class Categories extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Categories.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "CategoryName", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Categories.prototype, "Description", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Categories.prototype, "Picture", void 0);
    Categories = __decorate([
        DBObject_1.$DBObject(),
        Jassi_1.$Class("northwind.Categories"),
        __metadata("design:paramtypes", [])
    ], Categories);
    exports.Categories = Categories;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F0ZWdvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25vcnRod2luZC9yZW1vdGUvQ2F0ZWdvcmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBTUEsSUFBYSxVQUFVLEdBQXZCLE1BQWEsVUFBVyxTQUFRLG1CQUFRO1FBR3BDO1lBQ0ksS0FBSyxFQUFFLENBQUM7UUFDWixDQUFDO0tBT0osQ0FBQTtJQVZHO1FBREMsOEJBQWEsRUFBRTs7MENBQ0w7SUFLWDtRQURDLHVCQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7O29EQUNMO0lBRXJCO1FBREMsdUJBQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzs7bURBQ047SUFFcEI7UUFEQyx1QkFBTSxFQUFFOzsrQ0FDTztJQVhQLFVBQVU7UUFGdEIsb0JBQVMsRUFBRTtRQUNYLGNBQU0sQ0FBQyxzQkFBc0IsQ0FBQzs7T0FDbEIsVUFBVSxDQVl0QjtJQVpZLGdDQUFVO0lBYWhCLEtBQUssVUFBVSxJQUFJO0lBQzFCLENBQUM7SUFERCxvQkFDQztJQUNELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEQk9iamVjdCwgJERCT2JqZWN0IH0gZnJvbSBcImphc3NpL3JlbW90ZS9EQk9iamVjdFwiO1xuaW1wb3J0IGphc3NpLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaS9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IEVudGl0eSwgUHJpbWFyeUNvbHVtbiwgQ29sdW1uLCBPbmVUb09uZSwgTWFueVRvTWFueSwgTWFueVRvT25lLCBPbmVUb01hbnksIEpvaW5Db2x1bW4sIEpvaW5UYWJsZSB9IGZyb20gXCJqYXNzaS91dGlsL0RhdGFiYXNlU2NoZW1hXCI7XG5pbXBvcnQgeyAkREJPYmplY3RRdWVyeSB9IGZyb20gXCJqYXNzaS9yZW1vdGUvREJPYmplY3RRdWVyeVwiO1xuQCREQk9iamVjdCgpXG5AJENsYXNzKFwibm9ydGh3aW5kLkNhdGVnb3JpZXNcIilcbmV4cG9ydCBjbGFzcyBDYXRlZ29yaWVzIGV4dGVuZHMgREJPYmplY3Qge1xuICAgIEBQcmltYXJ5Q29sdW1uKClcbiAgICBpZDogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBAQ29sdW1uKHtcdG51bGxhYmxlOiB0cnVlfSlcbiAgICBDYXRlZ29yeU5hbWU6IHN0cmluZztcbiAgICBAQ29sdW1uKHtcdG51bGxhYmxlOiB0cnVlfSlcbiAgICBEZXNjcmlwdGlvbjogc3RyaW5nO1xuICAgIEBDb2x1bW4oKVxuICAgIFBpY3R1cmU6IHN0cmluZztcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xufVxuO1xuIl19