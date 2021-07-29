var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/RemoteObject"], function (require, exports, Jassi_1, RemoteObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TestRModul = void 0;
    let TestRModul = class TestRModul extends RemoteObject_1.RemoteObject {
        //this is a sample remote function
        async sayHello(name, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.sayHello, name, context);
            }
            else {
                return "Hello " + name; //this would be execute on server  
            }
        }
    };
    TestRModul = __decorate([
        Jassi_1.$Class("testrmodul.remote.TestRModul")
    ], TestRModul);
    exports.TestRModul = TestRModul;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFJNb2R1bC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RybW9kdWwvcmVtb3RlL1Rlc3RSTW9kdWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUlBLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSwyQkFBWTtRQUN4QyxrQ0FBa0M7UUFDM0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFZLEVBQUMsVUFBbUIsU0FBUztZQUMzRCxJQUFJLENBQUMsQ0FBQSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsUUFBUSxDQUFBLEVBQUU7Z0JBQ3BCLE9BQU8sTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxPQUFPLENBQUMsQ0FBQzthQUM3RDtpQkFBTTtnQkFDSCxPQUFPLFFBQVEsR0FBQyxJQUFJLENBQUMsQ0FBRSxtQ0FBbUM7YUFDN0Q7UUFDTCxDQUFDO0tBQ0osQ0FBQTtJQVRZLFVBQVU7UUFEdEIsY0FBTSxDQUFDLDhCQUE4QixDQUFDO09BQzFCLFVBQVUsQ0FTdEI7SUFUWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgQ29udGV4dCwgUmVtb3RlT2JqZWN0IH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1JlbW90ZU9iamVjdFwiO1xuXG5AJENsYXNzKFwidGVzdHJtb2R1bC5yZW1vdGUuVGVzdFJNb2R1bFwiKVxuZXhwb3J0IGNsYXNzIFRlc3RSTW9kdWwgZXh0ZW5kcyBSZW1vdGVPYmplY3R7XG4gICAgLy90aGlzIGlzIGEgc2FtcGxlIHJlbW90ZSBmdW5jdGlvblxuICAgIHB1YmxpYyBhc3luYyBzYXlIZWxsbyhuYW1lOiBzdHJpbmcsY29udGV4dDogQ29udGV4dCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoIWNvbnRleHQ/LmlzU2VydmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMuc2F5SGVsbG8sIG5hbWUsY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJIZWxsbyBcIituYW1lOyAgLy90aGlzIHdvdWxkIGJlIGV4ZWN1dGUgb24gc2VydmVyICBcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=