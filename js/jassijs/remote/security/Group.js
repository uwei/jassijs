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
exports.Group = void 0;
const DBObject_1 = require("jassijs/remote/DBObject");
const Registry_1 = require("jassijs/remote/Registry");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const ParentRight_1 = require("jassijs/remote/security/ParentRight");
const User_1 = require("jassijs/remote/security/User");
const Right_1 = require("jassijs/remote/security/Right");
const Validator_1 = require("jassijs/remote/Validator");
const Config_1 = require("../Config");
var hh = Config_1.config;
//import "jassijs/ext/enableExtension.js?de.Kunde";
let Group = class Group extends DBObject_1.DBObject {
};
__decorate([
    Validator_1.ValidateIsInt({ optional: true }),
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Group.prototype, "id", void 0);
__decorate([
    Validator_1.ValidateIsString(),
    DatabaseSchema_1.Column(),
    __metadata("design:type", String)
], Group.prototype, "name", void 0);
__decorate([
    Validator_1.ValidateIsArray({ optional: true, type: type => ParentRight_1.ParentRight }),
    DatabaseSchema_1.JoinTable(),
    DatabaseSchema_1.ManyToMany(type => ParentRight_1.ParentRight, ob => ob.groups),
    __metadata("design:type", Array)
], Group.prototype, "parentRights", void 0);
__decorate([
    Validator_1.ValidateIsArray({ optional: true, type: type => Right_1.Right }),
    DatabaseSchema_1.JoinTable(),
    DatabaseSchema_1.ManyToMany(type => Right_1.Right, ob => ob.groups),
    __metadata("design:type", Array)
], Group.prototype, "rights", void 0);
__decorate([
    Validator_1.ValidateIsArray({ optional: true, type: type => User_1.User }),
    DatabaseSchema_1.ManyToMany(type => User_1.User, ob => ob.groups),
    __metadata("design:type", Array)
], Group.prototype, "users", void 0);
Group = __decorate([
    DBObject_1.$DBObject({ name: "jassijs_group" }),
    Registry_1.$Class("jassijs.security.Group")
], Group);
exports.Group = Group;
//# sourceMappingURL=Group.js.map