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
exports.test = exports.Setting = void 0;
const DBObject_1 = require("jassi/remote/DBObject");
const Jassi_1 = require("jassi/remote/Jassi");
const DatabaseSchema_1 = require("jassi/util/DatabaseSchema");
let Setting = class Setting extends DBObject_1.DBObject {
    constructor() {
        super();
    }
    async save(context = undefined) {
        throw "not suported";
    }
    static async findOne(options = undefined, context = undefined) {
        throw "not suported";
    }
    static async find(options = undefined, context = undefined) {
        throw "not suported";
    }
    /**
    * reload the object from jassi.db
    */
    async remove(context = undefined) {
        throw "not suported";
    }
};
__decorate([
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Setting.prototype, "id", void 0);
__decorate([
    DatabaseSchema_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Setting.prototype, "data", void 0);
Setting = __decorate([
    DBObject_1.$DBObject({ name: "jassi_setting" }),
    Jassi_1.$Class("jassi.security.Setting"),
    __metadata("design:paramtypes", [])
], Setting);
exports.Setting = Setting;
async function test() {
}
exports.test = test;
;
//# sourceMappingURL=Setting.js.map