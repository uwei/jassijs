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
exports.test2 = exports.test = exports.User = void 0;
const DBObject_1 = require("jassijs/remote/DBObject");
const Registry_1 = require("jassijs/remote/Registry");
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const Group_1 = require("jassijs/remote/security/Group");
const ParentRight_1 = require("jassijs/remote/security/ParentRight");
const Validator_1 = require("jassijs/remote/Validator");
let User = class User extends DBObject_1.DBObject {
    static async findWithRelations() {
        return this.find({ relations: ["*"] });
    }
    /**
   * reload the object from jassijs.db
   */
    async hallo(context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await this.call(this, this.hallo, context);
        }
        else {
            return 11;
        }
    }
    async save(context = undefined) {
        return await super.save(context);
    }
};
__decorate([
    (0, Validator_1.ValidateIsNumber)({ optional: true }),
    (0, DatabaseSchema_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)(),
    (0, DatabaseSchema_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, Validator_1.ValidateIsString)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, Validator_1.ValidateIsArray)({ optional: true, type: type => Group_1.Group }),
    (0, DatabaseSchema_1.JoinTable)(),
    (0, DatabaseSchema_1.ManyToMany)(type => Group_1.Group, ob => ob.users),
    __metadata("design:type", Array)
], User.prototype, "groups", void 0);
__decorate([
    (0, Validator_1.ValidateIsBoolean)({ optional: true }),
    (0, DatabaseSchema_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
User = __decorate([
    (0, DBObject_1.$DBObject)({ name: "jassijs_user" }),
    (0, Registry_1.$Class)("jassijs.security.User")
], User);
exports.User = User;
async function test() {
    var gps = await (Group_1.Group.find({}));
}
exports.test = test;
async function test2() {
    var user = new User();
    user.id = 1;
    user.email = "a@b.com";
    user.password = "";
    var group1 = new Group_1.Group();
    group1.id = 1;
    group1.name = "Mandanten I";
    var group2 = new Group_1.Group();
    group2.id = 2;
    group2.name = "Mandanten 2";
    var pr1 = new ParentRight_1.ParentRight();
    pr1.id = 10;
    pr1.classname = "de.Kunde";
    pr1.name = "Kunden";
    pr1.i1 = 1;
    pr1.i2 = 4;
    await pr1.save();
    var pr2 = new ParentRight_1.ParentRight();
    pr2.id = 11;
    pr2.classname = "de.Kunde";
    pr2.name = "Kunden";
    pr2.i1 = 6;
    pr2.i2 = 10;
    await pr2.save();
    group1.parentRights = [pr1];
    await group1.save();
    group2.parentRights = [pr2];
    await group2.save();
    user.groups = [group1, group2];
    await user.save();
}
exports.test2 = test2;
//# sourceMappingURL=User.js.map