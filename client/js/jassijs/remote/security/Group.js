var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/ParentRight", "jassijs/remote/security/User", "jassijs/remote/security/Right", "jassijs/remote/Validator", "../Config"], function (require, exports, DBObject_1, Registry_1, DatabaseSchema_1, ParentRight_1, User_1, Right_1, Validator_1, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Group = void 0;
    var hh = Config_1.config;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let Group = class Group extends DBObject_1.DBObject {
    };
    __decorate([
        (0, Validator_1.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Group.prototype, "id", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)(),
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], Group.prototype, "name", void 0);
    __decorate([
        (0, Validator_1.ValidateIsArray)({ optional: true, type: type => ParentRight_1.ParentRight }),
        (0, DatabaseSchema_1.JoinTable)(),
        (0, DatabaseSchema_1.ManyToMany)(type => ParentRight_1.ParentRight, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "parentRights", void 0);
    __decorate([
        (0, Validator_1.ValidateIsArray)({ optional: true, type: type => Right_1.Right }),
        (0, DatabaseSchema_1.JoinTable)(),
        (0, DatabaseSchema_1.ManyToMany)(type => Right_1.Right, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "rights", void 0);
    __decorate([
        (0, Validator_1.ValidateIsArray)({ optional: true, type: type => User_1.User }),
        (0, DatabaseSchema_1.ManyToMany)(type => User_1.User, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "users", void 0);
    Group = __decorate([
        (0, DBObject_1.$DBObject)({ name: "jassijs_group" }),
        (0, Registry_1.$Class)("jassijs.security.Group")
    ], Group);
    exports.Group = Group;
});
//# sourceMappingURL=Group.js.map