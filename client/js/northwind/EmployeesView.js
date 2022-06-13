var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Image", "jassijs/ui/Textarea", "jassijs/ui/Calendar", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Employees", "jassijs/ui/DBObjectView"], function (require, exports, ObjectChooser_1, HTMLPanel_1, NumberConverter_1, Image_1, Textarea_1, Calendar_1, Textbox_1, Jassi_1, Property_1, Employees_1, DBObjectView_1) {
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
            me.birthDate = new Calendar_1.Calendar();
            me.hiredate = new Calendar_1.Calendar();
            me.homephone = new Textbox_1.Textbox();
            me.notes = new Textarea_1.Textarea();
            me.image1 = new Image_1.Image();
            me.photoPath = new Textbox_1.Textbox();
            me.id = new Textbox_1.Textbox();
            me.reportsTo = new HTMLPanel_1.HTMLPanel();
            me.objectchooser1 = new ObjectChooser_1.ObjectChooser();
            this.me.main.config({
                children: [
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
                        width: 90,
                        bind: [me.databinder, "BirthDate"],
                        label: "Birth Date"
                    }),
                    me.hiredate.config({
                        x: 110,
                        y: 190,
                        bind: [me.databinder, "HireDate"],
                        label: "Hire Date",
                        width: 85
                    }),
                    me.homephone.config({
                        x: 210,
                        y: 190,
                        bind: [me.databinder, "HomePhone"],
                        label: "Home Phone",
                        width: 140
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
                    me.photoPath.config({
                        x: 5,
                        y: 240,
                        bind: [me.databinder, "PhotoPath"],
                        label: "Photo Path",
                        width: 460
                    }),
                    me.id.config({
                        x: 5,
                        y: 5,
                        width: 60,
                        label: "Id",
                        bind: [me.databinder, "id"],
                        converter: new NumberConverter_1.NumberConverter()
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
                width: "900",
                height: "900"
            });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Employees_1.Employees !== "undefined" && Employees_1.Employees) === "function" ? _a : Object)
    ], EmployeesView.prototype, "value", void 0);
    EmployeesView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        (0, Jassi_1.$Class)("northwind.EmployeesView"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1wbG95ZWVzVmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vcnRod2luZC9FbXBsb3llZXNWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBcUNBLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWMsU0FBUSwyQkFBWTtRQUkzQztZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsOENBQThDO1lBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxJQUFJLEtBQUs7WUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3pGLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBTTtZQUNULEVBQUUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDN0IsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUM1QixFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDbkMsRUFBRSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUMzQixFQUFFLENBQUMsVUFBVSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDeEIsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUMxQixFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxtQkFB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QUFFLENBQUM7UUFDbEIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBTEQsb0JBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYmplY3RDaG9vc2VyIH0gZnJvbSBcImphc3NpanMvdWkvT2JqZWN0Q2hvb3NlclwiO1xuaW1wb3J0IHsgSFRNTFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvSFRNTFBhbmVsXCI7XG5pbXBvcnQgeyBOdW1iZXJDb252ZXJ0ZXIgfSBmcm9tIFwiamFzc2lqcy91aS9jb252ZXJ0ZXJzL051bWJlckNvbnZlcnRlclwiO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tIFwiamFzc2lqcy91aS9JbWFnZVwiO1xuaW1wb3J0IHsgVGV4dGFyZWEgfSBmcm9tIFwiamFzc2lqcy91aS9UZXh0YXJlYVwiO1xuaW1wb3J0IHsgQ2FsZW5kYXIgfSBmcm9tIFwiamFzc2lqcy91aS9DYWxlbmRhclwiO1xuaW1wb3J0IHsgVGV4dGJveCB9IGZyb20gXCJqYXNzaWpzL3VpL1RleHRib3hcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJqYXNzaWpzL3VpL0J1dHRvblwiO1xuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xuaW1wb3J0IHsgRW1wbG95ZWVzIH0gZnJvbSBcIm5vcnRod2luZC9yZW1vdGUvRW1wbG95ZWVzXCI7XG5pbXBvcnQgeyBEYXRhYmluZGVyIH0gZnJvbSBcImphc3NpanMvdWkvRGF0YWJpbmRlclwiO1xuaW1wb3J0IHsgREJPYmplY3RWaWV3LCAkREJPYmplY3RWaWV3LCBEQk9iamVjdFZpZXdNZSB9IGZyb20gXCJqYXNzaWpzL3VpL0RCT2JqZWN0Vmlld1wiO1xuaW1wb3J0IHsgREJPYmplY3REaWFsb2cgfSBmcm9tIFwiamFzc2lqcy91aS9EQk9iamVjdERpYWxvZ1wiO1xudHlwZSBNZSA9IHtcbiAgICBmaXJzdE5hbWU/OiBUZXh0Ym94O1xuICAgIGxhc3ROYW1lPzogVGV4dGJveDtcbiAgICB0aXRsZT86IFRleHRib3g7XG4gICAgdGl0bGVPZkNvdXR0ZXN5PzogVGV4dGJveDtcbiAgICBhZGRyZXNzPzogVGV4dGJveDtcbiAgICBwb3N0YWxDb2RlPzogVGV4dGJveDtcbiAgICBjaXR5PzogVGV4dGJveDtcbiAgICByZWdpb24/OiBUZXh0Ym94O1xuICAgIHN0YXRlPzogVGV4dGJveDtcbiAgICBiaXJ0aERhdGU/OiBDYWxlbmRhcjtcbiAgICBoaXJlZGF0ZT86IENhbGVuZGFyO1xuICAgIGhvbWVwaG9uZT86IFRleHRib3g7XG4gICAgbm90ZXM/OiBUZXh0YXJlYTtcbiAgICBpbWFnZTE/OiBJbWFnZTtcbiAgICBwaG90b1BhdGg/OiBUZXh0Ym94O1xuICAgIGlkPzogVGV4dGJveDtcbiAgICByZXBvcnRzVG8/OiBIVE1MUGFuZWw7XG4gICAgb2JqZWN0Y2hvb3NlcjE/OiBPYmplY3RDaG9vc2VyO1xufSAmIERCT2JqZWN0Vmlld01lO1xuQCREQk9iamVjdFZpZXcoeyBjbGFzc25hbWU6IFwibm9ydGh3aW5kLkVtcGxveWVlc1wiLCBhY3Rpb25uYW1lOiBcIk5vcnRod2luZC9FbXBsb3llZXNcIiwgaWNvbjogXCJtZGkgbWRpLWFjY291bnQtdGllXCIgfSlcbkAkQ2xhc3MoXCJub3J0aHdpbmQuRW1wbG95ZWVzVmlld1wiKVxuZXhwb3J0IGNsYXNzIEVtcGxveWVlc1ZpZXcgZXh0ZW5kcyBEQk9iamVjdFZpZXcge1xuICAgIGRlY2xhcmUgbWU6IE1lO1xuICAgIEAkUHJvcGVydHkoeyBpc1VybFRhZzogdHJ1ZSwgaWQ6IHRydWUsIGVkaXRvcjogXCJqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5EQk9iamVjdEVkaXRvclwiIH0pXG4gICAgZGVjbGFyZSB2YWx1ZTogRW1wbG95ZWVzO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvL3RoaXMubWUgPSB7fTsgdGhpcyBpcyBjYWxsZWQgaW4gb2JqZWN0ZGlhbG9nXG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xuICAgIH1cbiAgICBnZXQgdGl0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlID09PSB1bmRlZmluZWQgPyBcIkVtcGxveWVlc1ZpZXdcIiA6IFwiRW1wbG95ZWVzVmlldyBcIiArIHRoaXMudmFsdWUuaWQ7XG4gICAgfVxuICAgIGxheW91dChtZTogTWUpIHtcbiAgICAgICAgbWUuZmlyc3ROYW1lID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUubGFzdE5hbWUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS50aXRsZSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLnRpdGxlT2ZDb3V0dGVzeSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLmFkZHJlc3MgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5wb3N0YWxDb2RlID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuY2l0eSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLnJlZ2lvbiA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLnN0YXRlID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuYmlydGhEYXRlID0gbmV3IENhbGVuZGFyKCk7XG4gICAgICAgIG1lLmhpcmVkYXRlID0gbmV3IENhbGVuZGFyKCk7XG4gICAgICAgIG1lLmhvbWVwaG9uZSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLm5vdGVzID0gbmV3IFRleHRhcmVhKCk7XG4gICAgICAgIG1lLmltYWdlMSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBtZS5waG90b1BhdGggPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5pZCA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLnJlcG9ydHNUbyA9IG5ldyBIVE1MUGFuZWwoKTtcbiAgICAgICAgbWUub2JqZWN0Y2hvb3NlcjEgPSBuZXcgT2JqZWN0Q2hvb3NlcigpO1xuICAgICAgICB0aGlzLm1lLm1haW4uY29uZmlnKHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgbWUuZmlyc3ROYW1lLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDgwLFxuICAgICAgICAgICAgICAgICAgICB5OiA1LFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJGaXJzdCBuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIkZpcnN0TmFtZVwiXVxuICAgICAgICAgICAgICAgIH0pLCBcbiAgICAgICAgICAgICAgICBtZS5sYXN0TmFtZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAyNTAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDUsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkxhc3QgTmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJMYXN0TmFtZVwiXVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnRpdGxlLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDQyMCxcbiAgICAgICAgICAgICAgICAgICAgeTogNSxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiVGl0bGVcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRpdGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA5MFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnRpdGxlT2ZDb3V0dGVzeS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiA1MjUsXG4gICAgICAgICAgICAgICAgICAgIHk6IDUsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlRpdGxlIG9mIEMuXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA4NSxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiVGl0bGVPZkNvdXJ0ZXN5XCJdXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUuYWRkcmVzcy5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiA1LFxuICAgICAgICAgICAgICAgICAgICB5OiA1MCxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQWRkcmVzc1wiLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJBZGRyZXNzXCJdLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMzQ1XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUucG9zdGFsQ29kZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiA1LFxuICAgICAgICAgICAgICAgICAgICB5OiA5NSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUG9zdGFsIENvZGVcIixcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiUG9zdGFsQ29kZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDkwXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUuY2l0eS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxMTAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDk1LFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJDaXR5XCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDaXR5XCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyNDBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5yZWdpb24uY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogNSxcbiAgICAgICAgICAgICAgICAgICAgeTogMTQwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJSZWdpb25cIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlJlZ2lvblwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogOTBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5zdGF0ZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxMTAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDE0MCxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiQ291bnRyeVwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiY291bnRyeVwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjQwXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUuYmlydGhEYXRlLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDUsXG4gICAgICAgICAgICAgICAgICAgIHk6IDE5MCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDkwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJCaXJ0aERhdGVcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkJpcnRoIERhdGVcIlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmhpcmVkYXRlLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDExMCxcbiAgICAgICAgICAgICAgICAgICAgeTogMTkwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJIaXJlRGF0ZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiSGlyZSBEYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA4NVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmhvbWVwaG9uZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAyMTAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDE5MCxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiSG9tZVBob25lXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJIb21lIFBob25lXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNDBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5ub3Rlcy5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAzNzUsXG4gICAgICAgICAgICAgICAgICAgIHk6IDUwLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjQwLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDE1NSxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiTm90ZXNcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk5vdGVzXCJcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5pbWFnZTEuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogNjMwLFxuICAgICAgICAgICAgICAgICAgICB5OiAyMCxcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRfY29sb3I6IFwiYmxhY2tcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcl9zdHlsZTogXCJzb2xpZFwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMjUsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlBob3RvUGF0aFwiXVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnBob3RvUGF0aC5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiA1LFxuICAgICAgICAgICAgICAgICAgICB5OiAyNDAsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlBob3RvUGF0aFwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUGhvdG8gUGF0aFwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDYwXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUuaWQuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogNSxcbiAgICAgICAgICAgICAgICAgICAgeTogNSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJJZFwiLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJpZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgY29udmVydGVyOiBuZXcgTnVtYmVyQ29udmVydGVyKClcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5yZXBvcnRzVG8uY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogNyxcbiAgICAgICAgICAgICAgICAgICAgeTogMjk4LFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJSZXBvcnRzIFRvXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlJlcG9ydHNUb1wiXSxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwie3tGaXJzdE5hbWV9fSB7e0xhc3ROYW1lfX1cIixcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDE2MFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLm9iamVjdGNob29zZXIxLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDE3MCxcbiAgICAgICAgICAgICAgICAgICAgeTogMzEwLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjUsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMjUsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlJlcG9ydHNUb1wiXSwgIFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogXCJub3J0aHdpbmQuRW1wbG95ZWVzXCJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGlzQWJzb2x1dGU6IHRydWUsXG4gICAgICAgICAgICB3aWR0aDogXCI5MDBcIixcbiAgICAgICAgICAgIGhlaWdodDogXCI5MDBcIlxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgZW0gPSAoYXdhaXQgRW1wbG95ZWVzLmZpbmQoeyBpZDogNCB9KSlbMF07XG4gICAgdmFyIHJldCA9IG5ldyBFbXBsb3llZXNWaWV3O1xuICAgIHJldFtcInZhbHVlXCJdID0gZW07XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==