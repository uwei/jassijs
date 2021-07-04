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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFJNb2R1bC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3RybW9kdWwvcmVtb3RlL1Rlc3RSTW9kdWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUlBLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSwyQkFBWTtRQUN4QyxrQ0FBa0M7UUFDM0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFZLEVBQUMsVUFBbUIsU0FBUztZQUMzRCxJQUFJLEVBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsQ0FBQSxFQUFFO2dCQUNwQixPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsT0FBTyxDQUFDLENBQUM7YUFDN0Q7aUJBQU07Z0JBQ0gsT0FBTyxRQUFRLEdBQUMsSUFBSSxDQUFDLENBQUUsbUNBQW1DO2FBQzdEO1FBQ0wsQ0FBQztLQUNKLENBQUE7SUFUWSxVQUFVO1FBRHRCLGNBQU0sQ0FBQyw4QkFBOEIsQ0FBQztPQUMxQixVQUFVLENBU3RCO0lBVFksZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IENvbnRleHQsIFJlbW90ZU9iamVjdCB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZW1vdGVPYmplY3RcIjtcblxuQCRDbGFzcyhcInRlc3RybW9kdWwucmVtb3RlLlRlc3RSTW9kdWxcIilcbmV4cG9ydCBjbGFzcyBUZXN0Uk1vZHVsIGV4dGVuZHMgUmVtb3RlT2JqZWN0e1xuICAgIC8vdGhpcyBpcyBhIHNhbXBsZSByZW1vdGUgZnVuY3Rpb25cbiAgICBwdWJsaWMgYXN5bmMgc2F5SGVsbG8obmFtZTogc3RyaW5nLGNvbnRleHQ6IENvbnRleHQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbCh0aGlzLCB0aGlzLnNheUhlbGxvLCBuYW1lLGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiSGVsbG8gXCIrbmFtZTsgIC8vdGhpcyB3b3VsZCBiZSBleGVjdXRlIG9uIHNlcnZlciAgXG4gICAgICAgIH1cbiAgICB9XG59Il19