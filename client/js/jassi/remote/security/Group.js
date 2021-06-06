var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema", "jassijs/remote/security/ParentRight", "jassijs/remote/security/User", "jassijs/remote/security/Right"], function (require, exports, DBObject_1, jassijs_1, DatabaseSchema_1, ParentRight_1, User_1, Right_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Group = void 0;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let Group = class Group extends DBObject_1.DBObject {
    };
    __decorate([
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Group.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Group.prototype, "name", void 0);
    __decorate([
        DatabaseSchema_1.JoinTable(),
        DatabaseSchema_1.ManyToMany(type => ParentRight_1.ParentRight, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "parentRights", void 0);
    __decorate([
        DatabaseSchema_1.JoinTable(),
        DatabaseSchema_1.ManyToMany(type => Right_1.Right, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "rights", void 0);
    __decorate([
        DatabaseSchema_1.ManyToMany(type => User_1.User, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "users", void 0);
    Group = __decorate([
        DBObject_1.$DBObject({ name: "jassijs_group" }),
        jassijs_1.$Class("jassijs.security.Group")
    ], Group);
    exports.Group = Group;
});
//# sourceMappingURL=Group.js.map