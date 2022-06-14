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
    exports.test = exports.TestDialogBinder = void 0;
    let TestDialogBinder = class TestDialogBinder extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            this.config({});
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
        //ret.me.databinder.value = data;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdERpYWxvZ0JpbmRlcjIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9kZS9UZXN0RGlhbG9nQmluZGVyMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBV0EsSUFBYSxnQkFBZ0IsR0FBN0IsTUFBYSxnQkFBaUIsU0FBUSxhQUFLO1FBRXZDO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBTTtZQUNULElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEIsQ0FBQztLQUNKLENBQUE7SUFWWSxnQkFBZ0I7UUFENUIsSUFBQSxjQUFNLEVBQUMscUJBQXFCLENBQUM7O09BQ2pCLGdCQUFnQixDQVU1QjtJQVZZLDRDQUFnQjtJQVd0QixLQUFLLFVBQVUsSUFBSTtRQUN0QixJQUFJLEdBQUcsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7UUFDakMsSUFBSSxJQUFJLEdBQUc7WUFDUCxTQUFTLEVBQUU7Z0JBQ1AsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO2dCQUNoQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7YUFDcEI7U0FDSixDQUFDO1FBQ0osMkJBQTJCO1FBQ3pCLGlDQUFpQztRQUNqQyxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFYRCxvQkFXQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJqYXNzaWpzL3VpL0J1dHRvblwiO1xuaW1wb3J0IHsgVGV4dGJveCB9IGZyb20gXCJqYXNzaWpzL3VpL1RleHRib3hcIjtcbmltcG9ydCB7IENoZWNrYm94IH0gZnJvbSBcImphc3NpanMvdWkvQ2hlY2tib3hcIjtcbmltcG9ydCB7IERhdGFiaW5kZXIgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XG5pbXBvcnQgeyBSZXBlYXRlciB9IGZyb20gXCJqYXNzaWpzL3VpL1JlcGVhdGVyXCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbnR5cGUgTWUgPSB7XG5cbn07XG5AJENsYXNzKFwiZGUvVGVzdERpYWxvZ0JpbmRlclwiKVxuZXhwb3J0IGNsYXNzIFRlc3REaWFsb2dCaW5kZXIgZXh0ZW5kcyBQYW5lbCB7XG4gICAgbWU6IE1lO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1lID0ge307XG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xuICAgIH1cbiAgICBsYXlvdXQobWU6IE1lKSB7XG4gICAgICAgIHRoaXMuY29uZmlnKHt9KTtcbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgcmV0ID0gbmV3IFRlc3REaWFsb2dCaW5kZXIoKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgY3VzdG9tZXJzOiBbXG4gICAgICAgICAgICB7IG5hbWU6IFwiSGFuc1wiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiS2xhdXNcIiB9XG4gICAgICAgIF1cbiAgICB9O1xuICAvLyAgdGhyb3cgbmV3IEVycm9yKFwia2trXCIpO1xuICAgIC8vcmV0Lm1lLmRhdGFiaW5kZXIudmFsdWUgPSBkYXRhO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=