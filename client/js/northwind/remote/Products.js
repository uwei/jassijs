var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "northwind/remote/Categories", "northwind/remote/Suppliers", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, Categories_1, Suppliers_1, DBObject_1, Jassi_1, DatabaseSchema_1) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Products = void 0;
    let Products = class Products extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Products.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "ProductName", void 0);
    __decorate([
        DatabaseSchema_1.ManyToOne(type => Suppliers_1.Suppliers),
        __metadata("design:type", typeof (_a = typeof Suppliers_1.Suppliers !== "undefined" && Suppliers_1.Suppliers) === "function" ? _a : Object)
    ], Products.prototype, "Supplier", void 0);
    __decorate([
        DatabaseSchema_1.ManyToOne(type => Categories_1.Categories),
        __metadata("design:type", typeof (_b = typeof Categories_1.Categories !== "undefined" && Categories_1.Categories) === "function" ? _b : Object)
    ], Products.prototype, "Category", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], Products.prototype, "QuantityPerUnit", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitPrice", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsInStock", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "UnitsOnOrder", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Products.prototype, "ReorderLevel", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", Boolean)
    ], Products.prototype, "Discontinued", void 0);
    Products = __decorate([
        DBObject_1.$DBObject(),
        Jassi_1.$Class("northwind.Products"),
        __metadata("design:paramtypes", [])
    ], Products);
    exports.Products = Products;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZHVjdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9ub3J0aHdpbmQvcmVtb3RlL1Byb2R1Y3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBV0EsSUFBYSxRQUFRLEdBQXJCLE1BQWEsUUFBUyxTQUFRLG1CQUFRO1FBR2xDO1lBQ0ksS0FBSyxFQUFFLENBQUM7UUFDWixDQUFDO0tBbUJKLENBQUE7SUF0Qkc7UUFEQyw4QkFBYSxFQUFFOzt3Q0FDTDtJQUtYO1FBREMsdUJBQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7aURBQ1A7SUFFcEI7UUFEQywwQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQVMsQ0FBQztzREFDbkIscUJBQVMsb0JBQVQscUJBQVM7OENBQUM7SUFFcEI7UUFEQywwQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsdUJBQVUsQ0FBQztzREFDcEIsdUJBQVUsb0JBQVYsdUJBQVU7OENBQUM7SUFFckI7UUFEQyx1QkFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDOztxREFDRjtJQUV4QjtRQURDLHVCQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQzs7K0NBQ3pCO0lBRWxCO1FBREMsdUJBQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzs7a0RBQ0w7SUFFckI7UUFEQyx1QkFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDOztrREFDTDtJQUVyQjtRQURDLHVCQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7O2tEQUNMO0lBRXJCO1FBREMsdUJBQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzs7a0RBQ0o7SUF2QmIsUUFBUTtRQUZwQixvQkFBUyxFQUFFO1FBQ1gsY0FBTSxDQUFDLG9CQUFvQixDQUFDOztPQUNoQixRQUFRLENBd0JwQjtJQXhCWSw0QkFBUTtJQXlCZCxLQUFLLFVBQVUsSUFBSTtJQUMxQixDQUFDO0lBREQsb0JBQ0M7SUFDRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2F0ZWdvcmllcyB9IGZyb20gXCJub3J0aHdpbmQvcmVtb3RlL0NhdGVnb3JpZXNcIjtcbmltcG9ydCB7IFN1cHBsaWVycyB9IGZyb20gXCJub3J0aHdpbmQvcmVtb3RlL1N1cHBsaWVyc1wiO1xuaW1wb3J0IHsgQ2F0ZWdvcmllcyB9IGZyb20gXCJub3J0aHdpbmQvcmVtb3RlL0NhdGVnb3JpZXNcIjtcbmltcG9ydCB7IFN1cHBsaWVycyB9IGZyb20gXCJub3J0aHdpbmQvcmVtb3RlL1N1cHBsaWVyc1wiO1xuaW1wb3J0IHsgU3VwcGxpZXJzIH0gZnJvbSBcIm5vcnRod2luZC9yZW1vdGUvU3VwcGxpZXJzXCI7XG5pbXBvcnQgeyBEQk9iamVjdCwgJERCT2JqZWN0IH0gZnJvbSBcImphc3NpL3JlbW90ZS9EQk9iamVjdFwiO1xuaW1wb3J0IGphc3NpLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaS9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IEVudGl0eSwgUHJpbWFyeUNvbHVtbiwgQ29sdW1uLCBPbmVUb09uZSwgTWFueVRvTWFueSwgTWFueVRvT25lLCBPbmVUb01hbnksIEpvaW5Db2x1bW4sIEpvaW5UYWJsZSB9IGZyb20gXCJqYXNzaS91dGlsL0RhdGFiYXNlU2NoZW1hXCI7XG5pbXBvcnQgeyAkREJPYmplY3RRdWVyeSB9IGZyb20gXCJqYXNzaS9yZW1vdGUvREJPYmplY3RRdWVyeVwiO1xuQCREQk9iamVjdCgpXG5AJENsYXNzKFwibm9ydGh3aW5kLlByb2R1Y3RzXCIpXG5leHBvcnQgY2xhc3MgUHJvZHVjdHMgZXh0ZW5kcyBEQk9iamVjdCB7XG4gICAgQFByaW1hcnlDb2x1bW4oKVxuICAgIGlkOiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIEBDb2x1bW4oeyBudWxsYWJsZTogdHJ1ZSB9KVxuICAgIFByb2R1Y3ROYW1lOiBzdHJpbmc7XG4gICAgQE1hbnlUb09uZSh0eXBlID0+IFN1cHBsaWVycylcbiAgICBTdXBwbGllcjogU3VwcGxpZXJzO1xuICAgIEBNYW55VG9PbmUodHlwZSA9PiBDYXRlZ29yaWVzKVxuICAgIENhdGVnb3J5OiBDYXRlZ29yaWVzO1xuICAgIEBDb2x1bW4oe1x0bnVsbGFibGU6IHRydWV9KVxuICAgIFF1YW50aXR5UGVyVW5pdDogc3RyaW5nO1xuICAgIEBDb2x1bW4oe1x0bnVsbGFibGU6IHRydWUsXHR0eXBlOiBcImRlY2ltYWxcIn0pXG4gICAgVW5pdFByaWNlOiBudW1iZXI7XG4gICAgQENvbHVtbih7XHRudWxsYWJsZTogdHJ1ZX0pXG4gICAgVW5pdHNJblN0b2NrOiBudW1iZXI7XG4gICAgQENvbHVtbih7XHRudWxsYWJsZTogdHJ1ZX0pXG4gICAgVW5pdHNPbk9yZGVyOiBudW1iZXI7XG4gICAgQENvbHVtbih7XHRudWxsYWJsZTogdHJ1ZX0pXG4gICAgUmVvcmRlckxldmVsOiBudW1iZXI7XG4gICAgQENvbHVtbih7XHRudWxsYWJsZTogdHJ1ZX0pXG4gICAgRGlzY29udGludWVkOiBib29sZWFuO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG59XG47XG4iXX0=