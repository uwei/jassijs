var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/Checkbox", "jassijs/ui/Button", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Textbox_1, Checkbox_1, Button_1, Jassi_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog = void 0;
    let Dialog = class Dialog extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.panel1 = new Panel_1.Panel();
            me.textbox1 = new Textbox_1.Textbox();
            me.checkbox1 = new Checkbox_1.Checkbox();
            me.checkbox2 = new Checkbox_1.Checkbox();
            me.button1 = new Button_1.Button();
            this.config({
                children: [
                    me.panel1
                ]
            });
            me.panel1.add(me.checkbox2);
            me.panel1.add(me.button1);
            me.panel1.add(me.textbox1.config({ value: "dfgdfg" }));
            me.button1.text = "button";
        }
    };
    Dialog = __decorate([
        (0, Jassi_1.$Class)("de/Dialog"),
        __metadata("design:paramtypes", [])
    ], Dialog);
    exports.Dialog = Dialog;
    async function test() {
        var ret = new Dialog();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZGUvRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFjQSxJQUFhLE1BQU0sR0FBbkIsTUFBYSxNQUFPLFNBQVEsYUFBSztRQUU3QjtZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQU07WUFDVCxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7WUFDeEIsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUM1QixFQUFFLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFDLE9BQU8sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ1IsUUFBUSxFQUFFO29CQUNOLEVBQUUsQ0FBQyxNQUFNO2lCQUNaO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxQixFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkQsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQy9CLENBQUM7S0FDSixDQUFBO0lBdkJZLE1BQU07UUFEbEIsSUFBQSxjQUFNLEVBQUMsV0FBVyxDQUFDOztPQUNQLE1BQU0sQ0F1QmxCO0lBdkJZLHdCQUFNO0lBd0JaLEtBQUssVUFBVSxJQUFJO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDdkIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBSEQsb0JBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250ZXh0TWVudSB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbnRleHRNZW51XCI7XG5pbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGJveFwiO1xuaW1wb3J0IHsgQ2hlY2tib3ggfSBmcm9tIFwiamFzc2lqcy91aS9DaGVja2JveFwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbnR5cGUgTWUgPSB7XG4gICAgcGFuZWwxPzogUGFuZWw7XG4gICAgdGV4dGJveDE/OiBUZXh0Ym94O1xuICAgIGNoZWNrYm94MT86IENoZWNrYm94O1xuICAgIGNoZWNrYm94Mj86IENoZWNrYm94O1xuICAgIGJ1dHRvbjE/OiBCdXR0b247XG59O1xuQCRDbGFzcyhcImRlL0RpYWxvZ1wiKVxuZXhwb3J0IGNsYXNzIERpYWxvZyBleHRlbmRzIFBhbmVsIHtcbiAgICBtZTogTWU7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubWUgPSB7fTtcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XG4gICAgfVxuICAgIGxheW91dChtZTogTWUpIHtcbiAgICAgICAgbWUucGFuZWwxID0gbmV3IFBhbmVsKCk7XG4gICAgICAgIG1lLnRleHRib3gxID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuY2hlY2tib3gxID0gbmV3IENoZWNrYm94KCk7XG4gICAgICAgIG1lLmNoZWNrYm94MiA9IG5ldyBDaGVja2JveCgpO1xuICAgICAgICBtZS5idXR0b24xID0gbmV3IEJ1dHRvbigpO1xuICAgICAgICB0aGlzLmNvbmZpZyh7XG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIG1lLnBhbmVsMVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICAgICAgbWUucGFuZWwxLmFkZChtZS5jaGVja2JveDIpO1xuICAgICAgICBtZS5wYW5lbDEuYWRkKG1lLmJ1dHRvbjEpO1xuICAgICAgICBtZS5wYW5lbDEuYWRkKG1lLnRleHRib3gxLmNvbmZpZyh7IHZhbHVlOiBcImRmZ2RmZ1wiIH0pKTtcbiAgICAgICAgbWUuYnV0dG9uMS50ZXh0ID0gXCJidXR0b25cIjtcbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgcmV0ID0gbmV3IERpYWxvZygpO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=