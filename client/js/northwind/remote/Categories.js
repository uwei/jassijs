var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "northwind/remote/Products", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, Products_1, DBObject_1, Jassi_1, DatabaseSchema_1) {
    "use strict";
    var _a;
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
    __decorate([
        DatabaseSchema_1.OneToMany(type => Products_1.Products, e => e.Category),
        __metadata("design:type", typeof (_a = typeof Products_1.Products !== "undefined" && Products_1.Products) === "function" ? _a : Object)
    ], Categories.prototype, "Products", void 0);
    Categories = __decorate([
        DBObject_1.$DBObject(),
        Jassi_1.$Class("northwind.Categories"),
        __metadata("design:paramtypes", [])
    ], Categories);
    exports.Categories = Categories;
    async function test() {
        var all = await Categories.find({ relations: ["*"] });
        debugger;
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F0ZWdvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL25vcnRod2luZC9yZW1vdGUvQ2F0ZWdvcmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQU9BLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSxtQkFBUTtRQUdwQztZQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1osQ0FBQztLQVNKLENBQUE7SUFaRztRQURDLDhCQUFhLEVBQUU7OzBDQUNMO0lBS1g7UUFEQyx1QkFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztvREFDTjtJQUVyQjtRQURDLHVCQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7O21EQUNQO0lBRXBCO1FBREMsdUJBQU0sRUFBRTs7K0NBQ087SUFFaEI7UUFEQywwQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQVEsRUFBRSxDQUFDLENBQUEsRUFBRSxDQUFBLENBQUMsQ0FBQyxRQUFRLENBQUM7c0RBQ2pDLG1CQUFRLG9CQUFSLG1CQUFRO2dEQUFDO0lBYlYsVUFBVTtRQUZ0QixvQkFBUyxFQUFFO1FBQ1gsY0FBTSxDQUFDLHNCQUFzQixDQUFDOztPQUNsQixVQUFVLENBY3RCO0lBZFksZ0NBQVU7SUFlaEIsS0FBSyxVQUFVLElBQUk7UUFDdEIsSUFBSSxHQUFHLEdBQUMsTUFBTSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUMsU0FBUyxFQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBRWpELFFBQVEsQ0FBQztJQUNiLENBQUM7SUFKRCxvQkFJQztJQUNELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcm9kdWN0cyB9IGZyb20gXCJub3J0aHdpbmQvcmVtb3RlL1Byb2R1Y3RzXCI7XG5pbXBvcnQgeyBEQk9iamVjdCwgJERCT2JqZWN0IH0gZnJvbSBcImphc3NpL3JlbW90ZS9EQk9iamVjdFwiO1xuaW1wb3J0IGphc3NpLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaS9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IEVudGl0eSwgUHJpbWFyeUNvbHVtbiwgQ29sdW1uLCBPbmVUb09uZSwgTWFueVRvTWFueSwgTWFueVRvT25lLCBPbmVUb01hbnksIEpvaW5Db2x1bW4sIEpvaW5UYWJsZSB9IGZyb20gXCJqYXNzaS91dGlsL0RhdGFiYXNlU2NoZW1hXCI7XG5pbXBvcnQgeyAkREJPYmplY3RRdWVyeSB9IGZyb20gXCJqYXNzaS9yZW1vdGUvREJPYmplY3RRdWVyeVwiO1xuQCREQk9iamVjdCgpXG5AJENsYXNzKFwibm9ydGh3aW5kLkNhdGVnb3JpZXNcIilcbmV4cG9ydCBjbGFzcyBDYXRlZ29yaWVzIGV4dGVuZHMgREJPYmplY3Qge1xuICAgIEBQcmltYXJ5Q29sdW1uKClcbiAgICBpZDogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH0gXG4gICAgQENvbHVtbih7IG51bGxhYmxlOiB0cnVlIH0pXG4gICAgQ2F0ZWdvcnlOYW1lOiBzdHJpbmc7XG4gICAgQENvbHVtbih7IG51bGxhYmxlOiB0cnVlIH0pXG4gICAgRGVzY3JpcHRpb246IHN0cmluZztcbiAgICBAQ29sdW1uKClcbiAgICBQaWN0dXJlOiBzdHJpbmc7XG4gICAgQE9uZVRvTWFueSh0eXBlID0+IFByb2R1Y3RzLCBlPT5lLkNhdGVnb3J5KVxuICAgIFByb2R1Y3RzOiBQcm9kdWN0cztcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciBhbGw9YXdhaXQgQ2F0ZWdvcmllcy5maW5kKHtyZWxhdGlvbnM6W1wiKlwiXX0pO1xuXG4gICAgZGVidWdnZXI7XG59XG47XG4iXX0=