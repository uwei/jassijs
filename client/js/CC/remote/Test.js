var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/remote/RemoteObject"], function (require, exports, Jassi_1, RemoteObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestServer = void 0;
    let TestServer = class TestServer extends RemoteObject_1.RemoteObject {
        async zip(hallo, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.zip, context);
            }
            else {
                return hallo + " Du";
            }
        }
    };
    TestServer = __decorate([
        Jassi_1.$Class("jassi.remote.Server")
    ], TestServer);
    exports.TestServer = TestServer;
    async function test() {
        console.log(await new TestServer().zip("Hallo"));
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NjL3JlbW90ZS9UZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFJQSxJQUFhLFVBQVUsR0FBdkIsTUFBYSxVQUFXLFNBQVEsMkJBQVk7UUFFakMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFhLEVBQUMsVUFBbUIsU0FBUztZQUN2RCxJQUFJLEVBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsQ0FBQSxFQUFFO2dCQUNwQixPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNuRDtpQkFBTTtnQkFDSCxPQUFPLEtBQUssR0FBQyxLQUFLLENBQUM7YUFDdEI7UUFDTCxDQUFDO0tBQ0osQ0FBQTtJQVRZLFVBQVU7UUFEdEIsY0FBTSxDQUFDLHFCQUFxQixDQUFDO09BQ2pCLFVBQVUsQ0FTdEI7SUFUWSxnQ0FBVTtJQVVoQixLQUFLLFVBQVUsSUFBSTtRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRkQsb0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2kvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7IENvbnRleHQsIFJlbW90ZU9iamVjdCB9IGZyb20gXCJqYXNzaS9yZW1vdGUvUmVtb3RlT2JqZWN0XCI7XHJcblxyXG5AJENsYXNzKFwiamFzc2kucmVtb3RlLlNlcnZlclwiKVxyXG5leHBvcnQgY2xhc3MgVGVzdFNlcnZlciBleHRlbmRzIFJlbW90ZU9iamVjdHtcclxuICAgIFxyXG4gICAgcHVibGljIGFzeW5jIHppcChoYWxsbzogc3RyaW5nLGNvbnRleHQ6IENvbnRleHQgPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoIWNvbnRleHQ/LmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNhbGwodGhpcywgdGhpcy56aXAsIGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBoYWxsbytcIiBEdVwiOyAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKXtcclxuICAgIGNvbnNvbGUubG9nKGF3YWl0IG5ldyBUZXN0U2VydmVyKCkuemlwKFwiSGFsbG9cIikpO1xyXG59Il19