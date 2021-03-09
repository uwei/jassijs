var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/remote/Jassi", "./Classes"], function (require, exports, Jassi_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.db = exports.Database = void 0;
    class TypeDef {
    }
    let Database = class Database {
        constructor() {
            this.typeDef = new Map();
            this.decoratorCalls = new Map();
        }
        removeOld(oclass) {
            var name = Classes_1.classes.getClassName(oclass);
            this.typeDef.forEach((value, key) => {
                var testname = Classes_1.classes.getClassName(key);
                if (testname === name && key !== oclass)
                    this.typeDef.delete(key);
            });
            this.decoratorCalls.forEach((value, key) => {
                var testname = Classes_1.classes.getClassName(key);
                if (testname === name && key !== oclass)
                    this.decoratorCalls.delete(key);
            });
        }
        _setMetadata(constructor, field, decoratername, fieldprops, decoraterprops, delegate) {
            var def = this.typeDef.get(constructor);
            if (def === undefined) {
                def = new TypeDef();
                this.decoratorCalls.set(constructor, []);
                this.typeDef.set(constructor, def); //new class
            }
            if (field === "this") {
                this.removeOld(constructor);
            }
            this.decoratorCalls.get(constructor).push([delegate, fieldprops, decoraterprops]);
            var afield = def[field];
            if (def[field] === undefined) {
                afield = {};
                def[field] = afield;
            }
            afield[decoratername] = fieldprops;
        }
        fillDecorators() {
            this.decoratorCalls.forEach((allvalues, key) => {
                allvalues.forEach((value) => {
                    value[0](...value[1])(...value[2]);
                });
            });
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
});
//# sourceMappingURL=Database.js.map