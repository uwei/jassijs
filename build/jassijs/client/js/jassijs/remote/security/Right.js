var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Group", "jassijs/remote/Validator"], function (require, exports, DBObject_1, Registry_1, DatabaseSchema_1, Group_1, Validator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Right = void 0;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let Right = class Right extends DBObject_1.DBObject {
    };
    __decorate([
        (0, Validator_1.ValidateIsInt)({ optional: true }),
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Right.prototype, "id", void 0);
    __decorate([
        (0, Validator_1.ValidateIsString)(),
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], Right.prototype, "name", void 0);
    __decorate([
        (0, Validator_1.ValidateIsArray)({ optional: true, type: type => Group_1.Group }),
        (0, DatabaseSchema_1.ManyToMany)(type => Group_1.Group, ob => ob.rights),
        __metadata("design:type", Array)
    ], Right.prototype, "groups", void 0);
    Right = __decorate([
        (0, DBObject_1.$DBObject)({ name: "jassijs_right" }),
        (0, Registry_1.$Class)("jassijs.security.Right")
    ], Right);
    exports.Right = Right;
});
//# sourceMappingURL=Right.js.map