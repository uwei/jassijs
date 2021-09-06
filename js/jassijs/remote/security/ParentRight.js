"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentRight = void 0;
const DBObject_1 = require("jassijs/remote/DBObject");
const Jassi_1 = require("jassijs/remote/Jassi");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const Group_1 = require("jassijs/remote/security/Group");
//import "jassijs/ext/enableExtension.js?de.Kunde";
let ParentRight = class ParentRight extends DBObject_1.DBObject {
};
__decorate([
    (0, DatabaseSchema_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ParentRight.prototype, "id", void 0);
__decorate([
    (0, DatabaseSchema_1.Column)(),
    __metadata("design:type", String)
], ParentRight.prototype, "name", void 0);
__decorate([
    (0, DatabaseSchema_1.Column)(),
    __metadata("design:type", String)
], ParentRight.prototype, "classname", void 0);
__decorate([
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ParentRight.prototype, "i1", void 0);
__decorate([
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ParentRight.prototype, "i2", void 0);
__decorate([
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ParentRight.prototype, "s1", void 0);
__decorate([
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ParentRight.prototype, "s2", void 0);
__decorate([
    (0, DatabaseSchema_1.ManyToMany)(type => Group_1.Group, ob => ob.parentRights),
    __metadata("design:type", Array)
], ParentRight.prototype, "groups", void 0);
ParentRight = __decorate([
    (0, DBObject_1.$DBObject)({ name: "jassijs_parentright" }),
    (0, Jassi_1.$Class)("jassijs.security.ParentRight")
], ParentRight);
exports.ParentRight = ParentRight;
//# sourceMappingURL=ParentRight.js.map