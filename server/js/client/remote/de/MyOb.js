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
exports.test = exports.MyOb = void 0;
const DBObject_1 = require("remote/jassi/base/DBObject");
const Jassi_1 = require("remote/jassi/base/Jassi");
const typeorm_1 = require("typeorm");
let MyOb = class MyOb extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], MyOb.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MyOb.prototype, "name", void 0);
MyOb = __decorate([
    DBObject_1.$DBObject(),
    Jassi_1.$Class("de.MyOb"),
    __metadata("design:paramtypes", [])
], MyOb);
exports.MyOb = MyOb;
async function test() {
}
exports.test = test;
;
//# sourceMappingURL=MyOb.js.map