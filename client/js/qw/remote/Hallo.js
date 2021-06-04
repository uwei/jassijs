var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema"], function (require, exports, DBObject_1, Jassi_1, DatabaseSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Hallo = void 0;
    let Hallo = class Hallo extends DBObject_1.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        DatabaseSchema_1.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Hallo.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_1.Column(),
        __metadata("design:type", String)
    ], Hallo.prototype, "test", void 0);
    Hallo = __decorate([
        DBObject_1.$DBObject(),
        Jassi_1.$Class("qw.Hallo"),
        __metadata("design:paramtypes", [])
    ], Hallo);
    exports.Hallo = Hallo;
    async function test() {
        var h = new Hallo();
        h.id = 9;
        h.test = "kk";
        var k = await Hallo.findOne();
        debugger;
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=Hallo.js.map