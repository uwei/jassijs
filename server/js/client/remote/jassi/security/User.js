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
const DBObject_1 = require("remote/jassi/base/DBObject");
const Jassi_1 = require("remote/jassi/base/Jassi");
const DatabaseSchema_1 = require("jassi/util/DatabaseSchema");
const Group_1 = require("remote/jassi/security/Group");
const ParentRight_1 = require("remote/jassi/security/ParentRight");
let User = class User extends DBObject_1.DBObject {
    /**
   * reload the object from jassi.db
   */
    async hallo() {
        if (!Jassi_1.default.isServer) {
            return await this.call(this, "hallo");
        }
        else {
            return 11;
        }
    }
    async save() {
        return await super.save();
    }
};
__decorate([
    DatabaseSchema_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    DatabaseSchema_1.Column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    DatabaseSchema_1.Column({ select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    DatabaseSchema_1.JoinTable(),
    DatabaseSchema_1.ManyToMany(type => Group_1.Group, ob => ob.users),
    __metadata("design:type", Array)
], User.prototype, "groups", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
User = __decorate([
    DBObject_1.$DBObject({ name: "jassi_user" }),
    Jassi_1.$Class("remote.jassi.security.User")
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