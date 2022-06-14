var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Suppliers", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Jassi_1, Property_1, Suppliers_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SuppliersView = void 0;
    let SuppliersView = class SuppliersView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "SuppliersView" : "SuppliersView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_1.Textbox();
            me.homepage = new Textbox_1.Textbox();
            me.fax = new Textbox_1.Textbox();
            me.phone = new Textbox_1.Textbox();
            me.Country = new Textbox_1.Textbox();
            me.region = new Textbox_1.Textbox();
            me.city = new Textbox_1.Textbox();
            me.postalCode = new Textbox_1.Textbox();
            me.address = new Textbox_1.Textbox();
            me.contactTitle = new Textbox_1.Textbox();
            me.contactName = new Textbox_1.Textbox();
            me.companyName = new Textbox_1.Textbox();
            this.me.main.config({ isAbsolute: true, width: "800", height: "800", children: [
                    me.id.config({
                        x: 10,
                        y: 5,
                        converter: new NumberConverter_1.NumberConverter(),
                        width: 50,
                        bind: [me.databinder, "id"],
                        label: "Id"
                    }),
                    me.homepage.config({
                        x: 10,
                        y: 275,
                        bind: [me.databinder, "HomePage"],
                        label: "Home Page",
                        width: 355
                    }),
                    me.fax.config({
                        x: 180,
                        y: 230,
                        bind: [me.databinder, "Fax"],
                        label: "Fax",
                        width: 185
                    }),
                    me.phone.config({
                        x: 10,
                        y: 230,
                        bind: [me.databinder, "Phone"],
                        label: "Phone",
                        width: 155
                    }),
                    me.Country.config({
                        x: 180,
                        y: 185,
                        bind: [me.databinder, "Country"],
                        label: "Country",
                        width: 185
                    }),
                    me.region.config({
                        x: 10,
                        y: 185,
                        bind: [me.databinder, "Region"],
                        label: "Region",
                        width: 155
                    }),
                    me.city.config({
                        x: 120,
                        y: 140,
                        bind: [me.databinder, "City"],
                        label: "City",
                        width: 245
                    }),
                    me.postalCode.config({
                        x: 10,
                        y: 140,
                        bind: [me.databinder, "PostalCode"],
                        width: 95,
                        label: "Postal Code"
                    }),
                    me.address.config({
                        x: 10,
                        y: 95,
                        bind: [me.databinder, "Address"],
                        label: "Address",
                        width: 355
                    }),
                    me.contactTitle.config({
                        x: 180,
                        y: 50,
                        bind: [me.databinder, "ContactTitle"],
                        label: "Contact Title",
                        width: 185
                    }),
                    me.contactName.config({
                        x: 10,
                        y: 50,
                        bind: [me.databinder, "ContactName"],
                        label: "Contact Name"
                    }),
                    me.companyName.config({
                        x: 75,
                        y: 5,
                        label: "Company Name",
                        bind: [me.databinder, "CompanyName"],
                        width: 290
                    })
                ] });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Suppliers_1.Suppliers !== "undefined" && Suppliers_1.Suppliers) === "function" ? _a : Object)
    ], SuppliersView.prototype, "value", void 0);
    SuppliersView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Suppliers", actionname: "Northwind/Suppliers", icon: "mdi mdi-office-building-outline" }),
        (0, Jassi_1.$Class)("northwind.SuppliersView"),
        __metadata("design:paramtypes", [])
    ], SuppliersView);
    exports.SuppliersView = SuppliersView;
    async function test() {
        var ret = new SuppliersView;
        ret["value"] = await Suppliers_1.Suppliers.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3VwcGxpZXJzVmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vcnRod2luZC9TdXBwbGllcnNWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBeUJBLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWMsU0FBUSwyQkFBWTtRQUkzQztZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsOENBQThDO1lBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxJQUFJLEtBQUs7WUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3pGLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBTTtZQUNULEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDdEIsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUM1QixFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDekIsRUFBRSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUMzQixFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDeEIsRUFBRSxDQUFDLFVBQVUsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUM5QixFQUFFLENBQUMsT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxpQkFB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SUFBSSxFQUFFLGlDQUFpQyxFQUFFLENBQUM7UUFDL0gsSUFBQSxjQUFNLEVBQUMseUJBQXlCLENBQUM7O09BQ3JCLGFBQWEsQ0FnSHpCO0lBaEhZLHNDQUFhO0lBaUhuQixLQUFLLFVBQVUsSUFBSTtRQUN0QixJQUFJLEdBQUcsR0FBRyxJQUFJLGFBQWEsQ0FBQztRQUM1QixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQWMsTUFBTSxxQkFBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUpELG9CQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTnVtYmVyQ29udmVydGVyIH0gZnJvbSBcImphc3NpanMvdWkvY29udmVydGVycy9OdW1iZXJDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IFRleHRib3ggfSBmcm9tIFwiamFzc2lqcy91aS9UZXh0Ym94XCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XG5pbXBvcnQgeyBTdXBwbGllcnMgfSBmcm9tIFwibm9ydGh3aW5kL3JlbW90ZS9TdXBwbGllcnNcIjtcbmltcG9ydCB7IERhdGFiaW5kZXIgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XG5pbXBvcnQgeyBEQk9iamVjdFZpZXcsICREQk9iamVjdFZpZXcsIERCT2JqZWN0Vmlld01lIH0gZnJvbSBcImphc3NpanMvdWkvREJPYmplY3RWaWV3XCI7XG5pbXBvcnQgeyBEQk9iamVjdERpYWxvZyB9IGZyb20gXCJqYXNzaWpzL3VpL0RCT2JqZWN0RGlhbG9nXCI7XG50eXBlIE1lID0ge1xuICAgIGlkPzogVGV4dGJveDtcbiAgICBob21lcGFnZT86IFRleHRib3g7XG4gICAgZmF4PzogVGV4dGJveDtcbiAgICBwaG9uZT86IFRleHRib3g7XG4gICAgQ291bnRyeT86IFRleHRib3g7XG4gICAgcmVnaW9uPzogVGV4dGJveDtcbiAgICBjaXR5PzogVGV4dGJveDtcbiAgICBwb3N0YWxDb2RlPzogVGV4dGJveDtcbiAgICBhZGRyZXNzPzogVGV4dGJveDtcbiAgICBjb250YWN0VGl0bGU/OiBUZXh0Ym94O1xuICAgIGNvbnRhY3ROYW1lPzogVGV4dGJveDtcbiAgICBjb21wYW55TmFtZT86IFRleHRib3g7XG59ICYgREJPYmplY3RWaWV3TWU7XG5AJERCT2JqZWN0Vmlldyh7IGNsYXNzbmFtZTogXCJub3J0aHdpbmQuU3VwcGxpZXJzXCIsIGFjdGlvbm5hbWU6IFwiTm9ydGh3aW5kL1N1cHBsaWVyc1wiLCBpY29uOiBcIm1kaSBtZGktb2ZmaWNlLWJ1aWxkaW5nLW91dGxpbmVcIiB9KVxuQCRDbGFzcyhcIm5vcnRod2luZC5TdXBwbGllcnNWaWV3XCIpXG5leHBvcnQgY2xhc3MgU3VwcGxpZXJzVmlldyBleHRlbmRzIERCT2JqZWN0VmlldyB7XG4gICAgZGVjbGFyZSBtZTogTWU7XG4gICAgQCRQcm9wZXJ0eSh7IGlzVXJsVGFnOiB0cnVlLCBpZDogdHJ1ZSwgZWRpdG9yOiBcImphc3NpanMudWkuUHJvcGVydHlFZGl0b3JzLkRCT2JqZWN0RWRpdG9yXCIgfSlcbiAgICBkZWNsYXJlIHZhbHVlOiBTdXBwbGllcnM7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8vdGhpcy5tZSA9IHt9OyB0aGlzIGlzIGNhbGxlZCBpbiBvYmplY3RkaWFsb2dcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XG4gICAgfVxuICAgIGdldCB0aXRsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCA/IFwiU3VwcGxpZXJzVmlld1wiIDogXCJTdXBwbGllcnNWaWV3IFwiICsgdGhpcy52YWx1ZS5pZDtcbiAgICB9XG4gICAgbGF5b3V0KG1lOiBNZSkge1xuICAgICAgICBtZS5pZCA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLmhvbWVwYWdlID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuZmF4ID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUucGhvbmUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5Db3VudHJ5ID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUucmVnaW9uID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuY2l0eSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLnBvc3RhbENvZGUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5hZGRyZXNzID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuY29udGFjdFRpdGxlID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuY29udGFjdE5hbWUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5jb21wYW55TmFtZSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIHRoaXMubWUubWFpbi5jb25maWcoeyBpc0Fic29sdXRlOiB0cnVlLCB3aWR0aDogXCI4MDBcIiwgaGVpZ2h0OiBcIjgwMFwiLCBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIG1lLmlkLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDEwLFxuICAgICAgICAgICAgICAgICAgICB5OiA1LFxuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZXI6IG5ldyBOdW1iZXJDb252ZXJ0ZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJpZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiSWRcIlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmhvbWVwYWdlLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDEwLFxuICAgICAgICAgICAgICAgICAgICB5OiAyNzUsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIkhvbWVQYWdlXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJIb21lIFBhZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDM1NVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmZheC5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxODAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDIzMCxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiRmF4XCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJGYXhcIixcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDE4NVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnBob25lLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDEwLFxuICAgICAgICAgICAgICAgICAgICB5OiAyMzAsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlBob25lXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJQaG9uZVwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTU1XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUuQ291bnRyeS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxODAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDE4NSxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiQ291bnRyeVwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQ291bnRyeVwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTg1XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUucmVnaW9uLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDEwLFxuICAgICAgICAgICAgICAgICAgICB5OiAxODUsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlJlZ2lvblwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUmVnaW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNTVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5jaXR5LmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDEyMCxcbiAgICAgICAgICAgICAgICAgICAgeTogMTQwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJDaXR5XCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDaXR5XCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyNDVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5wb3N0YWxDb2RlLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDEwLFxuICAgICAgICAgICAgICAgICAgICB5OiAxNDAsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlBvc3RhbENvZGVcIl0sXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA5NSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUG9zdGFsIENvZGVcIlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmFkZHJlc3MuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogMTAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDk1LFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJBZGRyZXNzXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJBZGRyZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAzNTVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5jb250YWN0VGl0bGUuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogMTgwLFxuICAgICAgICAgICAgICAgICAgICB5OiA1MCxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiQ29udGFjdFRpdGxlXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDb250YWN0IFRpdGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxODVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5jb250YWN0TmFtZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxMCxcbiAgICAgICAgICAgICAgICAgICAgeTogNTAsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIkNvbnRhY3ROYW1lXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDb250YWN0IE5hbWVcIlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmNvbXBhbnlOYW1lLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDc1LFxuICAgICAgICAgICAgICAgICAgICB5OiA1LFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDb21wYW55IE5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiQ29tcGFueU5hbWVcIl0sXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyOTBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXSB9KTtcbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgcmV0ID0gbmV3IFN1cHBsaWVyc1ZpZXc7XG4gICAgcmV0W1widmFsdWVcIl0gPSA8U3VwcGxpZXJzPmF3YWl0IFN1cHBsaWVycy5maW5kT25lKCk7XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==