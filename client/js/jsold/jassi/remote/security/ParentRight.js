var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Group"], function (require, exports, DBObject_1, jassijs_1, DatabaseSchema_1, Group_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParentRight = void 0;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let ParentRight = class ParentRight extends DBObject_1.DBObject {
    };
    __decorate([
        DatabaseSchema_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], ParentRight.prototype, "name", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], ParentRight.prototype, "classname", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "i1", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "i2", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], ParentRight.prototype, "s1", void 0);
    __decorate([
        DatabaseSchema_1.Column({ nullable: true }),
        __metadata("design:type", String)
    ], ParentRight.prototype, "s2", void 0);
    __decorate([
        DatabaseSchema_1.ManyToMany(type => Group_1.Group, ob => ob.parentRights),
        __metadata("design:type", Array)
    ], ParentRight.prototype, "groups", void 0);
    ParentRight = __decorate([
        DBObject_1.$DBObject({ name: "jassijs_parentright" }),
        jassijs_1.$Class("jassijs.remote.security.ParentRight")
    ], ParentRight);
    exports.ParentRight = ParentRight;
});
//# sourceMappingURL=ParentRight.js.map
//# sourceMappingURL=ParentRight.js.map