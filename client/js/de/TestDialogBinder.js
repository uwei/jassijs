var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Button", "jassijs/ui/Databinder", "jassijs/ui/Repeater", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Button_1, Databinder_1, Repeater_1, Jassi_1, Panel_1) {
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
                    me.button = new Button_1.Button();
                    me.repeater.design.config({ children: [
                            me.button.config({ text: "button" })
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
        throw new Error("kkk");
        ret.me.databinder.value = data;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdERpYWxvZ0JpbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2RlL1Rlc3REaWFsb2dCaW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWFBLElBQWEsZ0JBQWdCLEdBQTdCLE1BQWEsZ0JBQWlCLFNBQVEsYUFBSztRQUV2QztZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQU07WUFDVCxFQUFFLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7WUFFN0IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ2Ysd0JBQXdCLEVBQUUsVUFBVSxFQUFNO29CQUV0QyxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7b0JBQ3pCLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRTs0QkFDOUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7eUJBQ3ZDLEVBQUUsQ0FBQyxDQUFDO2dCQUNiLENBQUM7YUFDSixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDcEQsQ0FBQztLQUNKLENBQUE7SUF4QlksZ0JBQWdCO1FBRDVCLElBQUEsY0FBTSxFQUFDLHFCQUFxQixDQUFDOztPQUNqQixnQkFBZ0IsQ0F3QjVCO0lBeEJZLDRDQUFnQjtJQXlCdEIsS0FBSyxVQUFVLElBQUk7UUFDdEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHO1lBQ1AsU0FBUyxFQUFFO2dCQUNQLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtnQkFDaEIsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO2FBQ3BCO1NBQ0osQ0FBQztRQUNGLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkIsR0FBRyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUMvQixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFYRCxvQkFXQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJqYXNzaWpzL3VpL0J1dHRvblwiO1xuaW1wb3J0IHsgVGV4dGJveCB9IGZyb20gXCJqYXNzaWpzL3VpL1RleHRib3hcIjtcbmltcG9ydCB7IENoZWNrYm94IH0gZnJvbSBcImphc3NpanMvdWkvQ2hlY2tib3hcIjtcbmltcG9ydCB7IERhdGFiaW5kZXIgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XG5pbXBvcnQgeyBSZXBlYXRlciB9IGZyb20gXCJqYXNzaWpzL3VpL1JlcGVhdGVyXCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbnR5cGUgTWUgPSB7XG4gICAgZGF0YWJpbmRlcj86IERhdGFiaW5kZXI7XG4gICAgcmVwZWF0ZXI/OiBSZXBlYXRlcjtcbiAgICBidXR0b24/OiBCdXR0b247XG59O1xuQCRDbGFzcyhcImRlL1Rlc3REaWFsb2dCaW5kZXJcIilcbmV4cG9ydCBjbGFzcyBUZXN0RGlhbG9nQmluZGVyIGV4dGVuZHMgUGFuZWwge1xuICAgIG1lOiBNZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5tZSA9IHt9O1xuICAgICAgICB0aGlzLmxheW91dCh0aGlzLm1lKTtcbiAgICB9XG4gICAgbGF5b3V0KG1lOiBNZSkge1xuICAgICAgICBtZS5kYXRhYmluZGVyID0gbmV3IERhdGFiaW5kZXIoKTtcbiAgICAgICAgbWUucmVwZWF0ZXIgPSBuZXcgUmVwZWF0ZXIoKTtcbiAgICAgICAgXG4gICAgICAgIG1lLnJlcGVhdGVyLmNvbmZpZyh7IFxuICAgICAgICAgICAgY3JlYXRlUmVwZWF0aW5nQ29tcG9uZW50OiBmdW5jdGlvbiAobWU6IE1lKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbWUuYnV0dG9uID0gbmV3IEJ1dHRvbigpO1xuICAgICAgICAgICAgICAgIG1lLnJlcGVhdGVyLmRlc2lnbi5jb25maWcoeyBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgbWUuYnV0dG9uLmNvbmZpZyh7IHRleHQ6IFwiYnV0dG9uXCIgfSlcbiAgICAgICAgICAgICAgICAgICAgXSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYWRkKG1lLmRhdGFiaW5kZXIpO1xuICAgICAgICB0aGlzLmFkZChtZS5yZXBlYXRlcik7XG4gICAgICAgIG1lLnJlcGVhdGVyLmJpbmQgPSBbbWUuZGF0YWJpbmRlciwgXCJjdXN0b21lcnNcIl07XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHJldCA9IG5ldyBUZXN0RGlhbG9nQmluZGVyKCk7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGN1c3RvbWVyczogW1xuICAgICAgICAgICAgeyBuYW1lOiBcIkhhbnNcIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcIktsYXVzXCIgfVxuICAgICAgICBdXG4gICAgfTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJra2tcIik7XG4gICAgcmV0Lm1lLmRhdGFiaW5kZXIudmFsdWUgPSBkYXRhO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=