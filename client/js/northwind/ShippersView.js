var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Shippers", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Jassi_1, Property_1, Shippers_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ShippersView = void 0;
    let ShippersView = class ShippersView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "ShippersView" : "ShippersView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_1.Textbox();
            me.phone = new Textbox_1.Textbox();
            me.companyName = new Textbox_1.Textbox();
            this.me.main.config({
                isAbsolute: true,
                width: "626",
                height: "150",
                children: [
                    me.id.config({
                        converter: new NumberConverter_1.NumberConverter(),
                        bind: [me.databinder, "id"],
                        label: "Id",
                        width: 40,
                        x: 5,
                        y: 0
                    }),
                    me.phone.config({
                        x: 5,
                        y: 50,
                        width: 215,
                        bind: [me.databinder, "Phone"],
                        label: "Phone"
                    }),
                    me.companyName.config({
                        x: 60,
                        y: 0,
                        bind: [me.databinder, "CompanyName"],
                        label: "Company name",
                        width: 160
                    })
                ]
            });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Shippers_1.Shippers !== "undefined" && Shippers_1.Shippers) === "function" ? _a : Object)
    ], ShippersView.prototype, "value", void 0);
    ShippersView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Shippers", actionname: "Northwind/Shippers", icon: "mdi mdi-truck-delivery" }),
        (0, Jassi_1.$Class)("northwind.ShippersView"),
        __metadata("design:paramtypes", [])
    ], ShippersView);
    exports.ShippersView = ShippersView;
    async function test() {
        var ret = new ShippersView;
        ret["value"] = await Shippers_1.Shippers.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hpcHBlcnNWaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9ydGh3aW5kL1NoaXBwZXJzVmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQWdCQSxJQUFhLFlBQVksR0FBekIsTUFBYSxZQUFhLFNBQVEsMkJBQVk7UUFJMUM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLDhDQUE4QztZQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsSUFBSSxLQUFLO1lBQ0wsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDdkYsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFNO1lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUN0QixFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNoQixVQUFVLEVBQUMsSUFBSTtnQkFDZixLQUFLLEVBQUUsS0FBSztnQkFDWixNQUFNLEVBQUUsS0FBSztnQkFDYixRQUFRLEVBQUU7b0JBQ04sRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUM7d0JBQ1QsU0FBUyxFQUFFLElBQUksaUNBQWUsRUFBRTt3QkFDaEMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7d0JBQzNCLEtBQUssRUFBRSxJQUFJO3dCQUNYLEtBQUssRUFBRSxFQUFFO3dCQUNULENBQUMsRUFBRSxDQUFDO3dCQUNKLENBQUMsRUFBRSxDQUFDO3FCQUNQLENBQUM7b0JBQ0YsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7d0JBQ1osQ0FBQyxFQUFFLENBQUM7d0JBQ0osQ0FBQyxFQUFFLEVBQUU7d0JBQ0wsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7d0JBQzlCLEtBQUssRUFBRSxPQUFPO3FCQUNqQixDQUFDO29CQUNGLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO3dCQUNsQixDQUFDLEVBQUUsRUFBRTt3QkFDTCxDQUFDLEVBQUUsQ0FBQzt3QkFDSixJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQzt3QkFDcEMsS0FBSyxFQUFFLGNBQWM7d0JBQ3JCLEtBQUssRUFBRSxHQUFHO3FCQUNiLENBQUM7aUJBQ0w7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDO0tBQ0osQ0FBQTtJQTNDRztRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsMkNBQTJDLEVBQUUsQ0FBQztzREFDOUUsbUJBQVEsb0JBQVIsbUJBQVE7K0NBQUM7SUFIZixZQUFZO1FBRnhCLElBQUEsNEJBQWEsRUFBQyxFQUFFLFNBQVMsRUFBRSxvQkFBb0IsRUFBRSxVQUFVLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLHdCQUF3QixFQUFFLENBQUM7UUFDcEgsSUFBQSxjQUFNLEVBQUMsd0JBQXdCLENBQUM7O09BQ3BCLFlBQVksQ0E4Q3hCO0lBOUNZLG9DQUFZO0lBK0NsQixLQUFLLFVBQVUsSUFBSTtRQUN0QixJQUFJLEdBQUcsR0FBRyxJQUFJLFlBQVksQ0FBQztRQUMzQixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQWEsTUFBTSxtQkFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUpELG9CQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTnVtYmVyQ29udmVydGVyIH0gZnJvbSBcImphc3NpanMvdWkvY29udmVydGVycy9OdW1iZXJDb252ZXJ0ZXJcIjtcbmltcG9ydCB7IFRleHRib3ggfSBmcm9tIFwiamFzc2lqcy91aS9UZXh0Ym94XCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XG5pbXBvcnQgeyBTaGlwcGVycyB9IGZyb20gXCJub3J0aHdpbmQvcmVtb3RlL1NoaXBwZXJzXCI7XG5pbXBvcnQgeyBEYXRhYmluZGVyIH0gZnJvbSBcImphc3NpanMvdWkvRGF0YWJpbmRlclwiO1xuaW1wb3J0IHsgREJPYmplY3RWaWV3LCAkREJPYmplY3RWaWV3LCBEQk9iamVjdFZpZXdNZSB9IGZyb20gXCJqYXNzaWpzL3VpL0RCT2JqZWN0Vmlld1wiO1xuaW1wb3J0IHsgREJPYmplY3REaWFsb2cgfSBmcm9tIFwiamFzc2lqcy91aS9EQk9iamVjdERpYWxvZ1wiO1xudHlwZSBNZSA9IHtcbiAgICBpZD86IFRleHRib3g7XG4gICAgcGhvbmU/OiBUZXh0Ym94O1xuICAgIGNvbXBhbnlOYW1lPzogVGV4dGJveDtcbn0gJiBEQk9iamVjdFZpZXdNZTtcbkAkREJPYmplY3RWaWV3KHsgY2xhc3NuYW1lOiBcIm5vcnRod2luZC5TaGlwcGVyc1wiLCBhY3Rpb25uYW1lOiBcIk5vcnRod2luZC9TaGlwcGVyc1wiLCBpY29uOiBcIm1kaSBtZGktdHJ1Y2stZGVsaXZlcnlcIiB9KVxuQCRDbGFzcyhcIm5vcnRod2luZC5TaGlwcGVyc1ZpZXdcIilcbmV4cG9ydCBjbGFzcyBTaGlwcGVyc1ZpZXcgZXh0ZW5kcyBEQk9iamVjdFZpZXcge1xuICAgIGRlY2xhcmUgbWU6IE1lO1xuICAgIEAkUHJvcGVydHkoeyBpc1VybFRhZzogdHJ1ZSwgaWQ6IHRydWUsIGVkaXRvcjogXCJqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5EQk9iamVjdEVkaXRvclwiIH0pXG4gICAgZGVjbGFyZSB2YWx1ZTogU2hpcHBlcnM7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8vdGhpcy5tZSA9IHt9OyB0aGlzIGlzIGNhbGxlZCBpbiBvYmplY3RkaWFsb2dcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XG4gICAgfVxuICAgIGdldCB0aXRsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCA/IFwiU2hpcHBlcnNWaWV3XCIgOiBcIlNoaXBwZXJzVmlldyBcIiArIHRoaXMudmFsdWUuaWQ7XG4gICAgfVxuICAgIGxheW91dChtZTogTWUpIHtcbiAgICAgICAgbWUuaWQgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5waG9uZSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLmNvbXBhbnlOYW1lID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgdGhpcy5tZS5tYWluLmNvbmZpZyh7XG4gICAgICAgICAgICBpc0Fic29sdXRlOnRydWUsXG4gICAgICAgICAgICB3aWR0aDogXCI2MjZcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIxNTBcIixcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgbWUuaWQuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgY29udmVydGVyOiBuZXcgTnVtYmVyQ29udmVydGVyKCksXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcImlkXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJJZFwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgICAgICAgICAgICAgIHg6IDUsXG4gICAgICAgICAgICAgICAgICAgIHk6IDBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5waG9uZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiA1LFxuICAgICAgICAgICAgICAgICAgICB5OiA1MCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDIxNSxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiUGhvbmVcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlBob25lXCJcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5jb21wYW55TmFtZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiA2MCxcbiAgICAgICAgICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiQ29tcGFueU5hbWVcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNvbXBhbnkgbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTYwXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHJldCA9IG5ldyBTaGlwcGVyc1ZpZXc7XG4gICAgcmV0W1widmFsdWVcIl0gPSA8U2hpcHBlcnM+YXdhaXQgU2hpcHBlcnMuZmluZE9uZSgpO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=