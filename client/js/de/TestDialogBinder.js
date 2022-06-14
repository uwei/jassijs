var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/Databinder", "jassijs/ui/Repeater", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Textbox_1, Databinder_1, Repeater_1, Jassi_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestDialogBinder = void 0;
    let TestDialogBinder = class TestDialogBinder extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.databinder = new Databinder_1.Databinder();
            me.repeater = new Repeater_1.Repeater();
            me.repeater.config({
                createRepeatingComponent: function (me) {
                    me.textbox = new Textbox_1.Textbox();
                    me.repeater.design.config({ children: [
                            me.textbox.config({ bind: [me.repeater.design.databinder, "name"] })
                        ] });
                }
            });
            this.add(me.databinder);
            this.add(me.repeater);
            me.repeater.bind = [me.databinder, "customers"];
        }
    };
    TestDialogBinder = __decorate([
        (0, Jassi_1.$Class)("de/TestDialogBinder"),
        __metadata("design:paramtypes", [])
    ], TestDialogBinder);
    exports.TestDialogBinder = TestDialogBinder;
    async function test() {
        var ret = new TestDialogBinder();
        var data = {
            customers: [
                { name: "Hans" },
                { name: "Klaus" }
            ]
        };
        //  throw new Error("kkk");
        ret.me.databinder.value = data;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdERpYWxvZ0JpbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2RlL1Rlc3REaWFsb2dCaW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWFBLElBQWEsZ0JBQWdCLEdBQTdCLE1BQWEsZ0JBQWlCLFNBQVEsYUFBSztRQUV2QztZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQU07WUFDVCxFQUFFLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7WUFDN0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ2Ysd0JBQXdCLEVBQUUsVUFBVSxFQUFNO29CQUN0QyxFQUFFLENBQUMsT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO29CQUMzQixFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUU7NEJBQzlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUM7eUJBQ3ZFLEVBQUUsQ0FBQyxDQUFDO2dCQUNiLENBQUM7YUFDSixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDcEQsQ0FBQztLQUNKLENBQUE7SUF0QlksZ0JBQWdCO1FBRDVCLElBQUEsY0FBTSxFQUFDLHFCQUFxQixDQUFDOztPQUNqQixnQkFBZ0IsQ0FzQjVCO0lBdEJZLDRDQUFnQjtJQXVCdEIsS0FBSyxVQUFVLElBQUk7UUFDdEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHO1lBQ1AsU0FBUyxFQUFFO2dCQUNQLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtnQkFDaEIsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO2FBQ3BCO1NBQ0osQ0FBQztRQUNGLDJCQUEyQjtRQUMzQixHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQy9CLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQVhELG9CQVdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XG5pbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGJveFwiO1xuaW1wb3J0IHsgQ2hlY2tib3ggfSBmcm9tIFwiamFzc2lqcy91aS9DaGVja2JveFwiO1xuaW1wb3J0IHsgRGF0YWJpbmRlciB9IGZyb20gXCJqYXNzaWpzL3VpL0RhdGFiaW5kZXJcIjtcbmltcG9ydCB7IFJlcGVhdGVyIH0gZnJvbSBcImphc3NpanMvdWkvUmVwZWF0ZXJcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xudHlwZSBNZSA9IHtcbiAgICBkYXRhYmluZGVyPzogRGF0YWJpbmRlcjtcbiAgICByZXBlYXRlcj86IFJlcGVhdGVyO1xuICAgIHRleHRib3g/OiBUZXh0Ym94O1xufTtcbkAkQ2xhc3MoXCJkZS9UZXN0RGlhbG9nQmluZGVyXCIpXG5leHBvcnQgY2xhc3MgVGVzdERpYWxvZ0JpbmRlciBleHRlbmRzIFBhbmVsIHtcbiAgICBtZTogTWU7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubWUgPSB7fTtcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XG4gICAgfVxuICAgIGxheW91dChtZTogTWUpIHtcbiAgICAgICAgbWUuZGF0YWJpbmRlciA9IG5ldyBEYXRhYmluZGVyKCk7XG4gICAgICAgIG1lLnJlcGVhdGVyID0gbmV3IFJlcGVhdGVyKCk7XG4gICAgICAgIG1lLnJlcGVhdGVyLmNvbmZpZyh7XG4gICAgICAgICAgICBjcmVhdGVSZXBlYXRpbmdDb21wb25lbnQ6IGZ1bmN0aW9uIChtZTogTWUpIHtcbiAgICAgICAgICAgICAgICBtZS50ZXh0Ym94ID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgICAgICAgICBtZS5yZXBlYXRlci5kZXNpZ24uY29uZmlnKHsgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLnRleHRib3guY29uZmlnKHsgYmluZDogW21lLnJlcGVhdGVyLmRlc2lnbi5kYXRhYmluZGVyLCBcIm5hbWVcIl0gfSlcbiAgICAgICAgICAgICAgICAgICAgXSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYWRkKG1lLmRhdGFiaW5kZXIpO1xuICAgICAgICB0aGlzLmFkZChtZS5yZXBlYXRlcik7XG4gICAgICAgIG1lLnJlcGVhdGVyLmJpbmQgPSBbbWUuZGF0YWJpbmRlciwgXCJjdXN0b21lcnNcIl07XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHJldCA9IG5ldyBUZXN0RGlhbG9nQmluZGVyKCk7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGN1c3RvbWVyczogW1xuICAgICAgICAgICAgeyBuYW1lOiBcIkhhbnNcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcIktsYXVzXCIgfVxuICAgICAgICBdXG4gICAgfTtcbiAgICAvLyAgdGhyb3cgbmV3IEVycm9yKFwia2trXCIpO1xuICAgIHJldC5tZS5kYXRhYmluZGVyLnZhbHVlID0gZGF0YTtcbiAgICByZXR1cm4gcmV0O1xufVxuIl19