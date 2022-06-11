var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Databinder", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Databinder_1, Textbox_1, Button_1, Jassi_1, Panel_1) {
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
            me.textbox1 = new Textbox_1.Textbox();
            me.databinder1 = new Databinder_1.Databinder();
            me.panel1 = new Panel_1.Panel();
            me.button1 = new Button_1.Button();
            me.textbox2 = new Textbox_1.Textbox();
            me.databinder1.value = {
                Halo: "Du"
            };
            this.config({ children: [
                    me.textbox1.config({
                        value: "sadfasdf",
                        label: "asdf",
                        bind: [me.databinder1, "Halo"]
                    }),
                    me.databinder1.config({}),
                    me.textbox2.config({}),
                    me.panel1.config({ children: [
                            me.button1.config({ text: "button" })
                        ] })
                ] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlhbG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZGUvRGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFlQSxJQUFhLE1BQU0sR0FBbkIsTUFBYSxNQUFPLFNBQVEsYUFBSztRQUU3QjtZQUNJLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQU07WUFDVCxFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7WUFDbEMsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUMxQixFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHO2dCQUNuQixJQUFJLEVBQUUsSUFBSTthQUNiLENBQUM7WUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFO29CQUNoQixFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDZixLQUFLLEVBQUUsVUFBVTt3QkFDakIsS0FBSyxFQUFFLE1BQU07d0JBQ2IsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUM7cUJBQ2pDLENBQUM7b0JBQ0YsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO29CQUN6QixFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7b0JBQ3RCLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFOzRCQUNyQixFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQzt5QkFDeEMsRUFBRSxDQUFDO2lCQUNYLEVBQUUsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztLQUNKLENBQUE7SUE3QlksTUFBTTtRQURsQixJQUFBLGNBQU0sRUFBQyxXQUFXLENBQUM7O09BQ1AsTUFBTSxDQTZCbEI7SUE3Qlksd0JBQU07SUE4QlosS0FBSyxVQUFVLElBQUk7UUFDdEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUN2QixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFIRCxvQkFHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGFiaW5kZXIgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XG5pbXBvcnQgeyBDb250ZXh0TWVudSB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbnRleHRNZW51XCI7XG5pbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGJveFwiO1xuaW1wb3J0IHsgQ2hlY2tib3ggfSBmcm9tIFwiamFzc2lqcy91aS9DaGVja2JveFwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbnR5cGUgTWUgPSB7XG4gICAgdGV4dGJveDE/OiBUZXh0Ym94O1xuICAgIGRhdGFiaW5kZXIxPzogRGF0YWJpbmRlcjtcbiAgICBwYW5lbDE/OiBQYW5lbDtcbiAgICBidXR0b24xPzogQnV0dG9uO1xuICAgIHRleHRib3gyPzogVGV4dGJveDtcbn07XG5AJENsYXNzKFwiZGUvRGlhbG9nXCIpXG5leHBvcnQgY2xhc3MgRGlhbG9nIGV4dGVuZHMgUGFuZWwge1xuICAgIG1lOiBNZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5tZSA9IHt9O1xuICAgICAgICB0aGlzLmxheW91dCh0aGlzLm1lKTtcbiAgICB9XG4gICAgbGF5b3V0KG1lOiBNZSkge1xuICAgICAgICBtZS50ZXh0Ym94MSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLmRhdGFiaW5kZXIxID0gbmV3IERhdGFiaW5kZXIoKTtcbiAgICAgICAgbWUucGFuZWwxID0gbmV3IFBhbmVsKCk7XG4gICAgICAgIG1lLmJ1dHRvbjEgPSBuZXcgQnV0dG9uKCk7XG4gICAgICAgIG1lLnRleHRib3gyID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuZGF0YWJpbmRlcjEudmFsdWUgPSB7XG4gICAgICAgICAgICBIYWxvOiBcIkR1XCJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jb25maWcoeyBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIG1lLnRleHRib3gxLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcInNhZGZhc2RmXCIsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcImFzZGZcIixcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIxLCBcIkhhbG9cIl1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5kYXRhYmluZGVyMS5jb25maWcoe30pLFxuICAgICAgICAgICAgICAgIG1lLnRleHRib3gyLmNvbmZpZyh7fSksXG4gICAgICAgICAgICAgICAgbWUucGFuZWwxLmNvbmZpZyh7IGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5idXR0b24xLmNvbmZpZyh7IHRleHQ6IFwiYnV0dG9uXCIgfSlcbiAgICAgICAgICAgICAgICAgICAgXSB9KVxuICAgICAgICAgICAgXSB9KTtcbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgcmV0ID0gbmV3IERpYWxvZygpO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=