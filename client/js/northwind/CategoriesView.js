var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Table", "jassijs/ui/BoxPanel", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Property", "northwind/remote/Categories", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Table_1, BoxPanel_1, Textarea_1, Textbox_1, Jassi_1, Panel_1, Property_1, Categories_1, DBObjectView_1) {
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
        (0, Jassi_1.$Class)("northwind.CategoriesView"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F0ZWdvcmllc1ZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub3J0aHdpbmQvQ2F0ZWdvcmllc1ZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUF1QkEsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBZSxTQUFRLDJCQUFZO1FBSTVDO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFDUixpREFBaUQ7WUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELElBQUksS0FBSztZQUNMLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUMzRixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQU07WUFDVCxFQUFFLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDdEIsRUFBRSxDQUFDLElBQUksR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUN4QixFQUFFLENBQUMsV0FBVyxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztZQUN4QixFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFO29CQUN4QixFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQzt3QkFDaEIsUUFBUSxFQUFFOzRCQUNOLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO2dDQUNULEtBQUssRUFBRSxJQUFJO2dDQUNYLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDO2dDQUMzQixLQUFLLEVBQUUsRUFBRTtnQ0FDVCxTQUFTLEVBQUUsSUFBSSxpQ0FBZSxFQUFFOzZCQUNuQyxDQUFDOzRCQUNGLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dDQUNYLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDO2dDQUNyQyxLQUFLLEVBQUUsTUFBTTtnQ0FDYixLQUFLLEVBQUUsR0FBRzs2QkFDYixDQUFDO3lCQUNMO3dCQUNELEtBQUssRUFBRSxFQUFFO3dCQUNULFVBQVUsRUFBRSxJQUFJO3FCQUNuQixDQUFDO29CQUNGLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO3dCQUNsQixNQUFNLEVBQUUsRUFBRTt3QkFDVixLQUFLLEVBQUUsR0FBRzt3QkFDVixJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQzt3QkFDcEMsS0FBSyxFQUFFLGFBQWE7cUJBQ3ZCLENBQUM7b0JBQ0YsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO29CQUNwQixFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQzt3QkFDYixNQUFNLEVBQUUsTUFBTTt3QkFDZCxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQzt3QkFDdEMsS0FBSyxFQUFFLE1BQU07cUJBQ2hCLENBQUM7aUJBQ0wsRUFBRSxDQUFDLENBQUM7UUFDYixDQUFDO0tBQ0osQ0FBQTtJQWhERztRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsMkNBQTJDLEVBQUUsQ0FBQztzREFDOUUsdUJBQVUsb0JBQVYsdUJBQVU7aURBQUM7SUFIakIsY0FBYztRQUYxQixJQUFBLDRCQUFhLEVBQUMsRUFBRSxTQUFTLEVBQUUsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLHNCQUFzQixFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQztRQUM5RyxJQUFBLGNBQU0sRUFBQywwQkFBMEIsQ0FBQzs7T0FDdEIsY0FBYyxDQW1EMUI7SUFuRFksd0NBQWM7SUFvRHBCLEtBQUssVUFBVSxJQUFJO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDL0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFlLE1BQU0sdUJBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUUsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBSkQsb0JBSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOdW1iZXJDb252ZXJ0ZXIgfSBmcm9tIFwiamFzc2lqcy91aS9jb252ZXJ0ZXJzL051bWJlckNvbnZlcnRlclwiO1xuaW1wb3J0IHsgQ2hlY2tib3ggfSBmcm9tIFwiamFzc2lqcy91aS9DaGVja2JveFwiO1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tIFwiamFzc2lqcy91aS9UYWJsZVwiO1xuaW1wb3J0IHsgQm94UGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9Cb3hQYW5lbFwiO1xuaW1wb3J0IHsgVGV4dGFyZWEgfSBmcm9tIFwiamFzc2lqcy91aS9UZXh0YXJlYVwiO1xuaW1wb3J0IHsgVGV4dGJveCB9IGZyb20gXCJqYXNzaWpzL3VpL1RleHRib3hcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7IENhdGVnb3JpZXMgfSBmcm9tIFwibm9ydGh3aW5kL3JlbW90ZS9DYXRlZ29yaWVzXCI7XG5pbXBvcnQgeyBEYXRhYmluZGVyIH0gZnJvbSBcImphc3NpanMvdWkvRGF0YWJpbmRlclwiO1xuaW1wb3J0IHsgREJPYmplY3RWaWV3LCAkREJPYmplY3RWaWV3LCBEQk9iamVjdFZpZXdNZSB9IGZyb20gXCJqYXNzaWpzL3VpL0RCT2JqZWN0Vmlld1wiO1xuaW1wb3J0IHsgREJPYmplY3REaWFsb2cgfSBmcm9tIFwiamFzc2lqcy91aS9EQk9iamVjdERpYWxvZ1wiO1xudHlwZSBNZSA9IHtcbiAgICBib3hwYW5lbDE/OiBCb3hQYW5lbDtcbiAgICBJZD86IFRleHRib3g7XG4gICAgbmFtZT86IFRleHRib3g7XG4gICAgZGVzY3JpcHRpb24/OiBUZXh0YXJlYTtcbiAgICBwYW5lbDE/OiBQYW5lbDtcbiAgICB0YWJsZTE/OiBUYWJsZTtcbn0gJiBEQk9iamVjdFZpZXdNZTtcbkAkREJPYmplY3RWaWV3KHsgY2xhc3NuYW1lOiBcIm5vcnRod2luZC5DYXRlZ29yaWVzXCIsIGFjdGlvbm5hbWU6IFwiTm9ydGh3aW5kL0NhdGVnb3JpZXNcIiwgaWNvbjogXCJtZGkgbWRpLWN1YmVcIiB9KVxuQCRDbGFzcyhcIm5vcnRod2luZC5DYXRlZ29yaWVzVmlld1wiKVxuZXhwb3J0IGNsYXNzIENhdGVnb3JpZXNWaWV3IGV4dGVuZHMgREJPYmplY3RWaWV3IHtcbiAgICBkZWNsYXJlIG1lOiBNZTtcbiAgICBAJFByb3BlcnR5KHsgaXNVcmxUYWc6IHRydWUsIGlkOiB0cnVlLCBlZGl0b3I6IFwiamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvcnMuREJPYmplY3RFZGl0b3JcIiB9KVxuICAgIGRlY2xhcmUgdmFsdWU6IENhdGVnb3JpZXM7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8vIHRoaXMubWUgPSB7fTsgLy90aGlzIGlzIGNhbGxlZCBpbiBvYmplY3RkaWFsb2dcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XG4gICAgfVxuICAgIGdldCB0aXRsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCA/IFwiQ2F0ZWdvcmllc1ZpZXdcIiA6IFwiQ2F0ZWdvcmllc1ZpZXcgXCIgKyB0aGlzLnZhbHVlLmlkO1xuICAgIH1cbiAgICBsYXlvdXQobWU6IE1lKSB7XG4gICAgICAgIG1lLmJveHBhbmVsMSA9IG5ldyBCb3hQYW5lbCgpO1xuICAgICAgICBtZS5JZCA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLm5hbWUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5kZXNjcmlwdGlvbiA9IG5ldyBUZXh0YXJlYSgpO1xuICAgICAgICBtZS5wYW5lbDEgPSBuZXcgUGFuZWwoKTtcbiAgICAgICAgbWUudGFibGUxID0gbmV3IFRhYmxlKCk7XG4gICAgICAgIHRoaXMubWUubWFpbi5jb25maWcoeyBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIG1lLmJveHBhbmVsMS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgbWUuSWQuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJJZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcImlkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZXI6IG5ldyBOdW1iZXJDb252ZXJ0ZXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5uYW1lLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiQ2F0ZWdvcnlOYW1lXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIk5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjI1XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogODAsXG4gICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IHRydWVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5kZXNjcmlwdGlvbi5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDcwLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjgwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJEZXNjcmlwdGlvblwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiRGVzY3JpcHRpb25cIlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnBhbmVsMS5jb25maWcoe30pLFxuICAgICAgICAgICAgICAgIG1lLnRhYmxlMS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgICAgICBiaW5kSXRlbXM6IFttZS5kYXRhYmluZGVyLCBcIlByb2R1Y3RzXCJdLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXSB9KTtcbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgcmV0ID0gbmV3IENhdGVnb3JpZXNWaWV3KCk7XG4gICAgcmV0W1widmFsdWVcIl0gPSA8Q2F0ZWdvcmllcz5hd2FpdCBDYXRlZ29yaWVzLmZpbmRPbmUoeyByZWxhdGlvbnM6IFtcIipcIl0gfSk7XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==