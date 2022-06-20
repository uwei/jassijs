var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Table", "jassijs/ui/BoxPanel", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Property", "northwind/remote/Categories", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Table_1, BoxPanel_1, Textarea_1, Textbox_1, Registry_1, Panel_1, Property_1, Categories_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CategoriesView = void 0;
    let CategoriesView = class CategoriesView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            // this.me = {}; //this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "CategoriesView" : "CategoriesView " + this.value.id;
        }
        layout(me) {
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.Id = new Textbox_1.Textbox();
            me.name = new Textbox_1.Textbox();
            me.description = new Textarea_1.Textarea();
            me.panel1 = new Panel_1.Panel();
            me.table1 = new Table_1.Table();
            this.me.main.config({ children: [
                    me.boxpanel1.config({
                        children: [
                            me.Id.config({
                                label: "Id",
                                bind: [me.databinder, "id"],
                                width: 40,
                                converter: new NumberConverter_1.NumberConverter()
                            }),
                            me.name.config({
                                bind: [me.databinder, "CategoryName"],
                                label: "Name",
                                width: 225
                            })
                        ],
                        width: 80,
                        horizontal: true
                    }),
                    me.description.config({
                        height: 70,
                        width: 280,
                        bind: [me.databinder, "Description"],
                        label: "Description"
                    }),
                    me.panel1.config({}),
                    me.table1.config({
                        height: "100%",
                        bindItems: [me.databinder, "Products"],
                        width: "100%"
                    })
                ] });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Categories_1.Categories !== "undefined" && Categories_1.Categories) === "function" ? _a : Object)
    ], CategoriesView.prototype, "value", void 0);
    CategoriesView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Categories", actionname: "Northwind/Categories", icon: "mdi mdi-cube" }),
        (0, Registry_1.$Class)("northwind.CategoriesView"),
        __metadata("design:paramtypes", [])
    ], CategoriesView);
    exports.CategoriesView = CategoriesView;
    async function test() {
        var ret = new CategoriesView();
        ret["value"] = await Categories_1.Categories.findOne({ relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F0ZWdvcmllc1ZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub3J0aHdpbmQvQ2F0ZWdvcmllc1ZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUF1QkEsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBZSxTQUFRLDJCQUFZO1FBSTVDO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFDUixpREFBaUQ7WUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELElBQUksS0FBSztZQUNMLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUMzRixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQU07WUFDVCxFQUFFLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDdEIsRUFBRSxDQUFDLElBQUksR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUN4QixFQUFFLENBQUMsV0FBVyxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztZQUN4QixFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFO29CQUN4QixFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQzt3QkFDaEIsUUFBUSxFQUFFOzRCQUNOLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO2dDQUNULEtBQUssRUFBRSxJQUFJO2dDQUNYLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO2dDQUMzQixLQUFLLEVBQUUsRUFBRTtnQ0FDVCxTQUFTLEVBQUUsSUFBSSxpQ0FBZSxFQUFFOzZCQUNuQyxDQUFDOzRCQUNGLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dDQUNYLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDO2dDQUNyQyxLQUFLLEVBQUUsTUFBTTtnQ0FDYixLQUFLLEVBQUUsR0FBRzs2QkFDYixDQUFDO3lCQUNMO3dCQUNELEtBQUssRUFBRSxFQUFFO3dCQUNULFVBQVUsRUFBRSxJQUFJO3FCQUNuQixDQUFDO29CQUNGLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO3dCQUNsQixNQUFNLEVBQUUsRUFBRTt3QkFDVixLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQzt3QkFDcEMsS0FBSyxFQUFFLGFBQWE7cUJBQ3ZCLENBQUM7b0JBQ0YsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO29CQUNwQixFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzt3QkFDYixNQUFNLEVBQUUsTUFBTTt3QkFDZCxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQzt3QkFDdEMsS0FBSyxFQUFFLE1BQU07cUJBQ2hCLENBQUM7aUJBQ0wsRUFBRSxDQUFDLENBQUM7UUFDYixDQUFDO0tBQ0osQ0FBQTtJQWhERztRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsMkNBQTJDLEVBQUUsQ0FBQztzREFDOUUsdUJBQVUsb0JBQVYsdUJBQVU7aURBQUM7SUFIakIsY0FBYztRQUYxQixJQUFBLDRCQUFhLEVBQUMsRUFBRSxTQUFTLEVBQUUsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLHNCQUFzQixFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQztRQUM5RyxJQUFBLGlCQUFNLEVBQUMsMEJBQTBCLENBQUM7O09BQ3RCLGNBQWMsQ0FtRDFCO0lBbkRZLHdDQUFjO0lBb0RwQixLQUFLLFVBQVUsSUFBSTtRQUN0QixJQUFJLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQy9CLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBZSxNQUFNLHVCQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUpELG9CQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTnVtYmVyQ29udmVydGVyIH0gZnJvbSBcImphc3NpanMvdWkvY29udmVydGVycy9OdW1iZXJDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IENoZWNrYm94IH0gZnJvbSBcImphc3NpanMvdWkvQ2hlY2tib3hcIjtcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSBcImphc3NpanMvdWkvVGFibGVcIjtcbmltcG9ydCB7IEJveFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvQm94UGFuZWxcIjtcbmltcG9ydCB7IFRleHRhcmVhIH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGFyZWFcIjtcbmltcG9ydCB7IFRleHRib3ggfSBmcm9tIFwiamFzc2lqcy91aS9UZXh0Ym94XCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVnaXN0cnlcIjtcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XG5pbXBvcnQgeyBDYXRlZ29yaWVzIH0gZnJvbSBcIm5vcnRod2luZC9yZW1vdGUvQ2F0ZWdvcmllc1wiO1xuaW1wb3J0IHsgRGF0YWJpbmRlciB9IGZyb20gXCJqYXNzaWpzL3VpL0RhdGFiaW5kZXJcIjtcbmltcG9ydCB7IERCT2JqZWN0VmlldywgJERCT2JqZWN0VmlldywgREJPYmplY3RWaWV3TWUgfSBmcm9tIFwiamFzc2lqcy91aS9EQk9iamVjdFZpZXdcIjtcbmltcG9ydCB7IERCT2JqZWN0RGlhbG9nIH0gZnJvbSBcImphc3NpanMvdWkvREJPYmplY3REaWFsb2dcIjtcbnR5cGUgTWUgPSB7XG4gICAgYm94cGFuZWwxPzogQm94UGFuZWw7XG4gICAgSWQ/OiBUZXh0Ym94O1xuICAgIG5hbWU/OiBUZXh0Ym94O1xuICAgIGRlc2NyaXB0aW9uPzogVGV4dGFyZWE7XG4gICAgcGFuZWwxPzogUGFuZWw7XG4gICAgdGFibGUxPzogVGFibGU7XG59ICYgREJPYmplY3RWaWV3TWU7XG5AJERCT2JqZWN0Vmlldyh7IGNsYXNzbmFtZTogXCJub3J0aHdpbmQuQ2F0ZWdvcmllc1wiLCBhY3Rpb25uYW1lOiBcIk5vcnRod2luZC9DYXRlZ29yaWVzXCIsIGljb246IFwibWRpIG1kaS1jdWJlXCIgfSlcbkAkQ2xhc3MoXCJub3J0aHdpbmQuQ2F0ZWdvcmllc1ZpZXdcIilcbmV4cG9ydCBjbGFzcyBDYXRlZ29yaWVzVmlldyBleHRlbmRzIERCT2JqZWN0VmlldyB7XG4gICAgZGVjbGFyZSBtZTogTWU7XG4gICAgQCRQcm9wZXJ0eSh7IGlzVXJsVGFnOiB0cnVlLCBpZDogdHJ1ZSwgZWRpdG9yOiBcImphc3NpanMudWkuUHJvcGVydHlFZGl0b3JzLkRCT2JqZWN0RWRpdG9yXCIgfSlcbiAgICBkZWNsYXJlIHZhbHVlOiBDYXRlZ29yaWVzO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvLyB0aGlzLm1lID0ge307IC8vdGhpcyBpcyBjYWxsZWQgaW4gb2JqZWN0ZGlhbG9nXG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xuICAgIH1cbiAgICBnZXQgdGl0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlID09PSB1bmRlZmluZWQgPyBcIkNhdGVnb3JpZXNWaWV3XCIgOiBcIkNhdGVnb3JpZXNWaWV3IFwiICsgdGhpcy52YWx1ZS5pZDtcbiAgICB9XG4gICAgbGF5b3V0KG1lOiBNZSkge1xuICAgICAgICBtZS5ib3hwYW5lbDEgPSBuZXcgQm94UGFuZWwoKTtcbiAgICAgICAgbWUuSWQgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5uYW1lID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuZGVzY3JpcHRpb24gPSBuZXcgVGV4dGFyZWEoKTtcbiAgICAgICAgbWUucGFuZWwxID0gbmV3IFBhbmVsKCk7XG4gICAgICAgIG1lLnRhYmxlMSA9IG5ldyBUYWJsZSgpO1xuICAgICAgICB0aGlzLm1lLm1haW4uY29uZmlnKHsgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICBtZS5ib3hwYW5lbDEuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLklkLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiSWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJpZFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydGVyOiBuZXcgTnVtYmVyQ29udmVydGVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWUubmFtZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIkNhdGVnb3J5TmFtZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJOYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDIyNVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDgwLFxuICAgICAgICAgICAgICAgICAgICBob3Jpem9udGFsOiB0cnVlXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUuZGVzY3JpcHRpb24uY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA3MCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDI4MCxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiRGVzY3JpcHRpb25cIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRlc2NyaXB0aW9uXCJcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5wYW5lbDEuY29uZmlnKHt9KSxcbiAgICAgICAgICAgICAgICBtZS50YWJsZTEuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcbiAgICAgICAgICAgICAgICAgICAgYmluZEl0ZW1zOiBbbWUuZGF0YWJpbmRlciwgXCJQcm9kdWN0c1wiXSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0gfSk7XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHJldCA9IG5ldyBDYXRlZ29yaWVzVmlldygpO1xuICAgIHJldFtcInZhbHVlXCJdID0gPENhdGVnb3JpZXM+YXdhaXQgQ2F0ZWdvcmllcy5maW5kT25lKHsgcmVsYXRpb25zOiBbXCIqXCJdIH0pO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=