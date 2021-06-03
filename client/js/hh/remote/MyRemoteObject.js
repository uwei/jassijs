var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/remote/RemoteObject"], function (require, exports, Jassi_1, RemoteObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MyRemoteObject = void 0;
    let MyRemoteObject = class MyRemoteObject extends RemoteObject_1.RemoteObject {
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
    MyRemoteObject = __decorate([
        Jassi_1.$Class("hh/remote/MyRemoteObject")
    ], MyRemoteObject);
    exports.MyRemoteObject = MyRemoteObject;
    async function test() {
        console.log(await new MyRemoteObject().sayHello("Kurt"));
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTXlSZW1vdGVPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9oaC9yZW1vdGUvTXlSZW1vdGVPYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUlBLElBQWEsY0FBYyxHQUEzQixNQUFhLGNBQWUsU0FBUSwyQkFBWTtRQUM1QyxrQ0FBa0M7UUFDM0IsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFZLEVBQUMsVUFBbUIsU0FBUztZQUMzRCxJQUFJLEVBQUMsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFFBQVEsQ0FBQSxFQUFFO2dCQUNwQixPQUFPLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsT0FBTyxDQUFDLENBQUM7YUFDN0Q7aUJBQU07Z0JBQ0gsT0FBTyxRQUFRLEdBQUMsSUFBSSxDQUFDLENBQUUsbUNBQW1DO2FBQzdEO1FBQ0wsQ0FBQztLQUNKLENBQUE7SUFUWSxjQUFjO1FBRDFCLGNBQU0sQ0FBQywwQkFBMEIsQ0FBQztPQUN0QixjQUFjLENBUzFCO0lBVFksd0NBQWM7SUFVcEIsS0FBSyxVQUFVLElBQUk7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUZELG9CQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgQ29udGV4dCwgUmVtb3RlT2JqZWN0IH0gZnJvbSBcImphc3NpL3JlbW90ZS9SZW1vdGVPYmplY3RcIjtcblxuQCRDbGFzcyhcImhoL3JlbW90ZS9NeVJlbW90ZU9iamVjdFwiKVxuZXhwb3J0IGNsYXNzIE15UmVtb3RlT2JqZWN0IGV4dGVuZHMgUmVtb3RlT2JqZWN0e1xuICAgIC8vdGhpcyBpcyBhIHNhbXBsZSByZW1vdGUgZnVuY3Rpb25cbiAgICBwdWJsaWMgYXN5bmMgc2F5SGVsbG8obmFtZTogc3RyaW5nLGNvbnRleHQ6IENvbnRleHQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKCFjb250ZXh0Py5pc1NlcnZlcikge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbCh0aGlzLCB0aGlzLnNheUhlbGxvLCBuYW1lLGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFwiSGVsbG8gXCIrbmFtZTsgIC8vdGhpcyB3b3VsZCBiZSBleGVjdXRlIG9uIHNlcnZlciAgXG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpe1xuICAgIGNvbnNvbGUubG9nKGF3YWl0IG5ldyBNeVJlbW90ZU9iamVjdCgpLnNheUhlbGxvKFwiS3VydFwiKSk7XG59XG4iXX0=