var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/util/DatabaseSchema", "jassijs/remote/DBObject", "jassijs/remote/Registry"], function (require, exports, DatabaseSchema_1, DBObject_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MyUser = void 0;
    let MyUser = class MyUser {
    };
    __decorate([
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], MyUser.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], MyUser.prototype, "firstName", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], MyUser.prototype, "lastName", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", Number)
    ], MyUser.prototype, "age", void 0);
    MyUser = __decorate([
        (0, DBObject_1.$DBObject)(),
        (0, DatabaseSchema_1.Entity)(),
        (0, Registry_1.$Class)("de.MyUser")
    ], MyUser);
    exports.MyUser = MyUser;
});
//# sourceMappingURL=MyUser.js.map