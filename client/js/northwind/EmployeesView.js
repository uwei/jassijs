var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/DateTimeConverter", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Image", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Employees", "jassijs/ui/DBObjectView"], function (require, exports, DateTimeConverter_1, ObjectChooser_1, HTMLPanel_1, NumberConverter_1, Image_1, Textarea_1, Textbox_1, Registry_1, Property_1, Employees_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.EmployeesView = void 0;
    let EmployeesView = class EmployeesView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "EmployeesView" : "EmployeesView " + this.value.id;
        }
        layout(me) {
            me.firstName = new Textbox_1.Textbox();
            me.lastName = new Textbox_1.Textbox();
            me.title = new Textbox_1.Textbox();
            me.titleOfCouttesy = new Textbox_1.Textbox();
            me.address = new Textbox_1.Textbox();
            me.postalCode = new Textbox_1.Textbox();
            me.city = new Textbox_1.Textbox();
            me.region = new Textbox_1.Textbox();
            me.state = new Textbox_1.Textbox();
            me.birthDate = new Textbox_1.Textbox();
            me.hiredate = new Textbox_1.Textbox();
            me.homephone = new Textbox_1.Textbox();
            me.notes = new Textarea_1.Textarea();
            me.image1 = new Image_1.Image();
            me.photoPath = new Textbox_1.Textbox();
            me.id = new Textbox_1.Textbox();
            me.reportsTo = new HTMLPanel_1.HTMLPanel();
            me.objectchooser1 = new ObjectChooser_1.ObjectChooser();
            this.me.main.config({
                children: [
                    me.id.config({
                        x: 5,
                        y: 5,
                        width: 60,
                        label: "Id",
                        bind: [me.databinder, "id"],
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    me.firstName.config({
                        x: 80,
                        y: 5,
                        label: "First name",
                        bind: [me.databinder, "FirstName"]
                    }),
                    me.lastName.config({
                        x: 250,
                        y: 5,
                        label: "Last Name",
                        bind: [me.databinder, "LastName"]
                    }),
                    me.title.config({
                        x: 420,
                        y: 5,
                        bind: [me.databinder, "Title"],
                        label: "Title",
                        width: 90
                    }),
                    me.titleOfCouttesy.config({
                        x: 525,
                        y: 5,
                        label: "Title of C.",
                        width: 85,
                        bind: [me.databinder, "TitleOfCourtesy"]
                    }),
                    me.address.config({
                        x: 5,
                        y: 50,
                        label: "Address",
                        bind: [me.databinder, "Address"],
                        width: 345
                    }),
                    me.postalCode.config({
                        x: 5,
                        y: 95,
                        label: "Postal Code",
                        bind: [me.databinder, "PostalCode"],
                        width: 90
                    }),
                    me.city.config({
                        x: 110,
                        y: 95,
                        bind: [me.databinder, "City"],
                        label: "City",
                        width: 240
                    }),
                    me.region.config({
                        x: 5,
                        y: 140,
                        bind: [me.databinder, "Region"],
                        label: "Region",
                        width: 90
                    }),
                    me.state.config({
                        x: 110,
                        y: 140,
                        bind: [me.databinder, "Country"],
                        label: "country",
                        width: 240
                    }),
                    me.birthDate.config({
                        x: 5,
                        y: 190,
                        width: 100,
                        bind: [me.databinder, "BirthDate"],
                        label: "Birth Date",
                        converter: new DateTimeConverter_1.DateTimeConverter()
                    }),
                    me.hiredate.config({
                        x: 115,
                        y: 190,
                        bind: [me.databinder, "HireDate"],
                        label: "Hire Date",
                        width: 95,
                        converter: new DateTimeConverter_1.DateTimeConverter()
                    }),
                    me.homephone.config({
                        x: 220,
                        y: 190,
                        bind: [me.databinder, "HomePhone"],
                        label: "Home Phone",
                        width: 130
                    }),
                    me.photoPath.config({
                        x: 5,
                        y: 240,
                        bind: [me.databinder, "PhotoPath"],
                        label: "Photo Path",
                        width: 460
                    }),
                    me.notes.config({
                        x: 375,
                        y: 50,
                        width: 240,
                        height: 155,
                        bind: [me.databinder, "Notes"],
                        label: "Notes"
                    }),
                    me.image1.config({
                        x: 630,
                        y: 20,
                        src: "",
                        css: {
                            background_color: "black",
                            border_style: "solid"
                        },
                        width: 125,
                        bind: [me.databinder, "PhotoPath"]
                    }),
                    me.reportsTo.config({
                        x: 7,
                        y: 298,
                        label: "Reports To",
                        bind: [me.databinder, "ReportsTo"],
                        template: "{{FirstName}} {{LastName}}",
                        width: 160
                    }),
                    me.objectchooser1.config({
                        x: 170,
                        y: 310,
                        width: 25,
                        height: 25,
                        bind: [me.databinder, "ReportsTo"],
                        items: "northwind.Employees"
                    })
                ],
                isAbsolute: true,
                width: "750",
                height: "360"
            });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Employees_1.Employees !== "undefined" && Employees_1.Employees) === "function" ? _a : Object)
    ], EmployeesView.prototype, "value", void 0);
    EmployeesView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        (0, Registry_1.$Class)("northwind.EmployeesView"),
        __metadata("design:paramtypes", [])
    ], EmployeesView);
    exports.EmployeesView = EmployeesView;
    async function test() {
        var em = (await Employees_1.Employees.find({ id: 4 }))[0];
        var ret = new EmployeesView;
        ret["value"] = em;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1wbG95ZWVzVmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vcnRod2luZC9FbXBsb3llZXNWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBcUNBLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWMsU0FBUSwyQkFBWTtRQUkzQztZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsOENBQThDO1lBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxJQUFJLEtBQUs7WUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3pGLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBTTtZQUNULEVBQUUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDN0IsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUM1QixFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDbkMsRUFBRSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUMzQixFQUFFLENBQUMsVUFBVSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDeEIsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUMxQixFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFB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O1FBQzlDLElBQUksR0FBRyxHQUFHLElBQUksYUFBYSxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDbEIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBTEQsb0JBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEYXRlVGltZUNvbnZlcnRlciB9IGZyb20gXCJqYXNzaWpzL3VpL2NvbnZlcnRlcnMvRGF0ZVRpbWVDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IE9iamVjdENob29zZXIgfSBmcm9tIFwiamFzc2lqcy91aS9PYmplY3RDaG9vc2VyXCI7XG5pbXBvcnQgeyBIVE1MUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9IVE1MUGFuZWxcIjtcbmltcG9ydCB7IE51bWJlckNvbnZlcnRlciB9IGZyb20gXCJqYXNzaWpzL3VpL2NvbnZlcnRlcnMvTnVtYmVyQ29udmVydGVyXCI7XG5pbXBvcnQgeyBJbWFnZSB9IGZyb20gXCJqYXNzaWpzL3VpL0ltYWdlXCI7XG5pbXBvcnQgeyBUZXh0YXJlYSB9IGZyb20gXCJqYXNzaWpzL3VpL1RleHRhcmVhXCI7XG5pbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGJveFwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVnaXN0cnlcIjtcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XG5pbXBvcnQgeyBFbXBsb3llZXMgfSBmcm9tIFwibm9ydGh3aW5kL3JlbW90ZS9FbXBsb3llZXNcIjtcbmltcG9ydCB7IERhdGFiaW5kZXIgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XG5pbXBvcnQgeyBEQk9iamVjdFZpZXcsICREQk9iamVjdFZpZXcsIERCT2JqZWN0Vmlld01lIH0gZnJvbSBcImphc3NpanMvdWkvREJPYmplY3RWaWV3XCI7XG5pbXBvcnQgeyBEQk9iamVjdERpYWxvZyB9IGZyb20gXCJqYXNzaWpzL3VpL0RCT2JqZWN0RGlhbG9nXCI7XG50eXBlIE1lID0ge1xuICAgIGZpcnN0TmFtZT86IFRleHRib3g7XG4gICAgbGFzdE5hbWU/OiBUZXh0Ym94O1xuICAgIHRpdGxlPzogVGV4dGJveDtcbiAgICB0aXRsZU9mQ291dHRlc3k/OiBUZXh0Ym94O1xuICAgIGFkZHJlc3M/OiBUZXh0Ym94O1xuICAgIHBvc3RhbENvZGU/OiBUZXh0Ym94O1xuICAgIGNpdHk/OiBUZXh0Ym94O1xuICAgIHJlZ2lvbj86IFRleHRib3g7XG4gICAgc3RhdGU/OiBUZXh0Ym94O1xuICAgIGJpcnRoRGF0ZT86IFRleHRib3g7XG4gICAgaGlyZWRhdGU/OiBUZXh0Ym94O1xuICAgIGhvbWVwaG9uZT86IFRleHRib3g7XG4gICAgbm90ZXM/OiBUZXh0YXJlYTtcbiAgICBpbWFnZTE/OiBJbWFnZTtcbiAgICBwaG90b1BhdGg/OiBUZXh0Ym94O1xuICAgIGlkPzogVGV4dGJveDtcbiAgICByZXBvcnRzVG8/OiBIVE1MUGFuZWw7XG4gICAgb2JqZWN0Y2hvb3NlcjE/OiBPYmplY3RDaG9vc2VyO1xufSAmIERCT2JqZWN0Vmlld01lO1xuQCREQk9iamVjdFZpZXcoeyBjbGFzc25hbWU6IFwibm9ydGh3aW5kLkVtcGxveWVlc1wiLCBhY3Rpb25uYW1lOiBcIk5vcnRod2luZC9FbXBsb3llZXNcIiwgaWNvbjogXCJtZGkgbWRpLWFjY291bnQtdGllXCIgfSlcbkAkQ2xhc3MoXCJub3J0aHdpbmQuRW1wbG95ZWVzVmlld1wiKVxuZXhwb3J0IGNsYXNzIEVtcGxveWVlc1ZpZXcgZXh0ZW5kcyBEQk9iamVjdFZpZXcge1xuICAgIGRlY2xhcmUgbWU6IE1lO1xuICAgIEAkUHJvcGVydHkoeyBpc1VybFRhZzogdHJ1ZSwgaWQ6IHRydWUsIGVkaXRvcjogXCJqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5EQk9iamVjdEVkaXRvclwiIH0pXG4gICAgZGVjbGFyZSB2YWx1ZTogRW1wbG95ZWVzO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvL3RoaXMubWUgPSB7fTsgdGhpcyBpcyBjYWxsZWQgaW4gb2JqZWN0ZGlhbG9nXG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xuICAgIH1cbiAgICBnZXQgdGl0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlID09PSB1bmRlZmluZWQgPyBcIkVtcGxveWVlc1ZpZXdcIiA6IFwiRW1wbG95ZWVzVmlldyBcIiArIHRoaXMudmFsdWUuaWQ7XG4gICAgfVxuICAgIGxheW91dChtZTogTWUpIHtcbiAgICAgICAgbWUuZmlyc3ROYW1lID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUubGFzdE5hbWUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS50aXRsZSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLnRpdGxlT2ZDb3V0dGVzeSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLmFkZHJlc3MgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5wb3N0YWxDb2RlID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuY2l0eSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLnJlZ2lvbiA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLnN0YXRlID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuYmlydGhEYXRlID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuaGlyZWRhdGUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5ob21lcGhvbmUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5ub3RlcyA9IG5ldyBUZXh0YXJlYSgpO1xuICAgICAgICBtZS5pbWFnZTEgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgbWUucGhvdG9QYXRoID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuaWQgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5yZXBvcnRzVG8gPSBuZXcgSFRNTFBhbmVsKCk7XG4gICAgICAgIG1lLm9iamVjdGNob29zZXIxID0gbmV3IE9iamVjdENob29zZXIoKTtcbiAgICAgICAgdGhpcy5tZS5tYWluLmNvbmZpZyh7XG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIG1lLmlkLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDUsXG4gICAgICAgICAgICAgICAgICAgIHk6IDUsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiSWRcIixcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiaWRcIl0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlcjogbmV3IE51bWJlckNvbnZlcnRlcigpXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUuZmlyc3ROYW1lLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDgwLFxuICAgICAgICAgICAgICAgICAgICB5OiA1LFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJGaXJzdCBuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIkZpcnN0TmFtZVwiXVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmxhc3ROYW1lLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDI1MCxcbiAgICAgICAgICAgICAgICAgICAgeTogNSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiTGFzdCBOYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIkxhc3ROYW1lXCJdXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUudGl0bGUuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogNDIwLFxuICAgICAgICAgICAgICAgICAgICB5OiA1LFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJUaXRsZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiVGl0bGVcIixcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDkwXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUudGl0bGVPZkNvdXR0ZXN5LmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDUyNSxcbiAgICAgICAgICAgICAgICAgICAgeTogNSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiVGl0bGUgb2YgQy5cIixcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDg1LFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJUaXRsZU9mQ291cnRlc3lcIl1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5hZGRyZXNzLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDUsXG4gICAgICAgICAgICAgICAgICAgIHk6IDUwLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJBZGRyZXNzXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIkFkZHJlc3NcIl0sXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAzNDVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5wb3N0YWxDb2RlLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDUsXG4gICAgICAgICAgICAgICAgICAgIHk6IDk1LFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJQb3N0YWwgQ29kZVwiLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJQb3N0YWxDb2RlXCJdLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogOTBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5jaXR5LmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDExMCxcbiAgICAgICAgICAgICAgICAgICAgeTogOTUsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIkNpdHlcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNpdHlcIixcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDI0MFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnJlZ2lvbi5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiA1LFxuICAgICAgICAgICAgICAgICAgICB5OiAxNDAsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlJlZ2lvblwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUmVnaW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA5MFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnN0YXRlLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDExMCxcbiAgICAgICAgICAgICAgICAgICAgeTogMTQwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJDb3VudHJ5XCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJjb3VudHJ5XCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyNDBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5iaXJ0aERhdGUuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogNSxcbiAgICAgICAgICAgICAgICAgICAgeTogMTkwLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJCaXJ0aERhdGVcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkJpcnRoIERhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgY29udmVydGVyOiBuZXcgRGF0ZVRpbWVDb252ZXJ0ZXIoKVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmhpcmVkYXRlLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDExNSxcbiAgICAgICAgICAgICAgICAgICAgeTogMTkwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJIaXJlRGF0ZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiSGlyZSBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA5NSxcbiAgICAgICAgICAgICAgICAgICAgY29udmVydGVyOiBuZXcgRGF0ZVRpbWVDb252ZXJ0ZXIoKVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmhvbWVwaG9uZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAyMjAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDE5MCxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiSG9tZVBob25lXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJIb21lIFBob25lXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMzBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5waG90b1BhdGguY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogNSxcbiAgICAgICAgICAgICAgICAgICAgeTogMjQwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJQaG90b1BhdGhcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlBob3RvIFBhdGhcIixcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDQ2MFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLm5vdGVzLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDM3NSxcbiAgICAgICAgICAgICAgICAgICAgeTogNTAsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyNDAsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTU1LFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJOb3Rlc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiTm90ZXNcIlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmltYWdlMS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiA2MzAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDIwLFxuICAgICAgICAgICAgICAgICAgICBzcmM6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogXCJibGFja1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyX3N0eWxlOiBcInNvbGlkXCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEyNSxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiUGhvdG9QYXRoXCJdXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUucmVwb3J0c1RvLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDcsXG4gICAgICAgICAgICAgICAgICAgIHk6IDI5OCxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUmVwb3J0cyBUb1wiLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJSZXBvcnRzVG9cIl0sXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcInt7Rmlyc3ROYW1lfX0ge3tMYXN0TmFtZX19XCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNjBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5vYmplY3RjaG9vc2VyMS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxNzAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDMxMCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDI1LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDI1LFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJSZXBvcnRzVG9cIl0sXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBcIm5vcnRod2luZC5FbXBsb3llZXNcIlxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaXNBYnNvbHV0ZTogdHJ1ZSxcbiAgICAgICAgICAgIHdpZHRoOiBcIjc1MFwiLFxuICAgICAgICAgICAgaGVpZ2h0OiBcIjM2MFwiXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciBlbSA9IChhd2FpdCBFbXBsb3llZXMuZmluZCh7IGlkOiA0IH0pKVswXTtcbiAgICB2YXIgcmV0ID0gbmV3IEVtcGxveWVlc1ZpZXc7XG4gICAgcmV0W1widmFsdWVcIl0gPSBlbTtcbiAgICByZXR1cm4gcmV0O1xufVxuIl19