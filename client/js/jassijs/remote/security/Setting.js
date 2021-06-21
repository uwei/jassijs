var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema", "../Classes"], function (require, exports, DBObject_1, Jassi_1, DatabaseSchema_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Setting = void 0;
    let Setting = class Setting extends DBObject_1.DBObject {
        constructor() {
            super();
        }
        async save(context = undefined) {
            throw new Classes_1.JassiError("not suported");
        }
        static async findOne(options = undefined, context = undefined) {
            throw new Classes_1.JassiError("not suported");
        }
        static async find(options = undefined, context = undefined) {
            throw new Classes_1.JassiError("not suported");
        }
        /**
        * reload the object from jassijs.db
        */
        async remove(context = undefined) {
            throw new Classes_1.JassiError("not suported");
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
        DBObject_1.$DBObject({ name: "jassijs_setting" }),
        Jassi_1.$Class("jassijs.security.Setting"),
        __metadata("design:paramtypes", [])
    ], Setting);
    exports.Setting = Setting;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=Setting.js.map