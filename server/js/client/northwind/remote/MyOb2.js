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
exports.test = exports.MyOb2 = void 0;
const DBObject_1 = require("remote/jassi/base/DBObject");
const Jassi_1 = require("jassi/remote/Jassi");
const DatabaseSchema_1 = require("jassi/util/DatabaseSchema");
let MyOb2 = class MyOb2 extends DBObject_1.DBObject {
    constructor() {
        super();
    }
};
__decorate([
    DatabaseSchema_1.PrimaryColumn(),
    __metadata("design:type", Number)
], MyOb2.prototype, "id", void 0);
MyOb2 = __decorate([
    DBObject_1.$DBObject(),
    Jassi_1.$Class("northwind.MyOb2"),
    __metadata("design:paramtypes", [])
], MyOb2);
exports.MyOb2 = MyOb2;
async function test() {
}
exports.test = test;
;
//# sourceMappingURL=MyOb2.js.map