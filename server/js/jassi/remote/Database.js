"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.Database = void 0;
const Jassi_1 = require("jassi/remote/Jassi");
class TypeDef {
}
let Database = class Database {
    constructor() {
        this.typeDef = new Map();
    }
    _setMetadata(constructor, field, decoratername, fieldprops, decoraterprops) {
        var def = this.typeDef.get(constructor);
        if (def === undefined) {
            def = new TypeDef();
            this.typeDef.set(constructor, def);
        }
        var afield = def[field];
        if (def[field] === undefined) {
            afield = {};
            def[field] = afield;
        }
        afield[decoratername] = fieldprops;
    }
    getMetadata(sclass) {
        return this.typeDef.get(sclass);
    }
};
Database = __decorate([
    Jassi_1.$Class("jassi.remote.Database")
], Database);
exports.Database = Database;
var db = new Database();
exports.db = db;
//# sourceMappingURL=Database.js.map