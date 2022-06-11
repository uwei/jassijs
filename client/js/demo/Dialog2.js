var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel"], function (require, exports, Jassi_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog2 = void 0;
    let Dialog2 = class Dialog2 extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            this.config({});
        }
    };
    Dialog2 = __decorate([
        (0, Jassi_1.$Class)("demo/Dialog2"),
        __metadata("design:paramtypes", [])
    ], Dialog2);
    exports.Dialog2 = Dialog2;
    async function test() {
        var ret = new Dialog2();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlhbG9nMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2RlbW8vRGlhbG9nMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBT0EsSUFBYSxPQUFPLEdBQXBCLE1BQWEsT0FBUSxTQUFRLGFBQUs7UUFFOUI7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFNO1lBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN2QixDQUFDO0tBQ0QsQ0FBQTtJQVZZLE9BQU87UUFEbkIsSUFBQSxjQUFNLEVBQUMsY0FBYyxDQUFDOztPQUNWLE9BQU8sQ0FVbkI7SUFWWSwwQkFBTztJQVliLEtBQUssVUFBVSxJQUFJO1FBQ3pCLElBQUksR0FBRyxHQUFDLElBQUksT0FBTyxFQUFFLENBQUM7UUFDdEIsT0FBTyxHQUFHLENBQUM7SUFDWixDQUFDO0lBSEQsb0JBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7UGFuZWx9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XG5cbnR5cGUgTWUgPSB7XG59XG5cbkAkQ2xhc3MoXCJkZW1vL0RpYWxvZzJcIilcbmV4cG9ydCBjbGFzcyBEaWFsb2cyIGV4dGVuZHMgUGFuZWwge1xuICAgIG1lOiBNZTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5tZSA9IHt9O1xuICAgICAgICB0aGlzLmxheW91dCh0aGlzLm1lKTtcbiAgICB9XG4gICAgbGF5b3V0KG1lOiBNZSkge1xuICAgICAgICB0aGlzLmNvbmZpZyh7fSk7XG5cdH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKXtcblx0dmFyIHJldD1uZXcgRGlhbG9nMigpO1xuXHRyZXR1cm4gcmV0O1xufSJdfQ==