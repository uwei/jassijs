var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel"], function (require, exports, Textbox_1, Registry_1, Panel_1) {
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
            me.textbox = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            me.textbox3 = new Textbox_1.Textbox();
            this.config({ children: [me.textbox3.config({})] });
        }
    };
    Dialog2 = __decorate([
        (0, Registry_1.$Class)("demo/Dialog2"),
        __metadata("design:paramtypes", [])
    ], Dialog2);
    exports.Dialog2 = Dialog2;
    async function test() {
        var ret = new Dialog2();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlhbG9nMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2RlbW8vRGlhbG9nMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBU0EsSUFBYSxPQUFPLEdBQXBCLE1BQWEsT0FBUSxTQUFRLGFBQUs7UUFFOUI7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFNO1lBQ1QsRUFBRSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUMzQixFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hELENBQUM7S0FDSixDQUFBO0lBYlksT0FBTztRQURuQixJQUFBLGlCQUFNLEVBQUMsY0FBYyxDQUFDOztPQUNWLE9BQU8sQ0FhbkI7SUFiWSwwQkFBTztJQWNiLEtBQUssVUFBVSxJQUFJO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDeEIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBSEQsb0JBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGJveFwiO1xuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XG50eXBlIE1lID0ge1xuICAgIHRleHRib3g/OiBUZXh0Ym94O1xuICAgIHRleHRib3gyPzogVGV4dGJveDtcbiAgICB0ZXh0Ym94Mz86IFRleHRib3g7XG59O1xuQCRDbGFzcyhcImRlbW8vRGlhbG9nMlwiKVxuZXhwb3J0IGNsYXNzIERpYWxvZzIgZXh0ZW5kcyBQYW5lbCB7XG4gICAgbWU6IE1lO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1lID0ge307XG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xuICAgIH1cbiAgICBsYXlvdXQobWU6IE1lKSB7XG4gICAgICAgIG1lLnRleHRib3ggPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS50ZXh0Ym94MiA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLnRleHRib3gzID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgdGhpcy5jb25maWcoeyBjaGlsZHJlbjogW21lLnRleHRib3gzLmNvbmZpZyh7fSldIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciByZXQgPSBuZXcgRGlhbG9nMigpO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=