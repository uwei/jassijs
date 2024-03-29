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
exports.db = exports.Database = exports.TypeDef = void 0;
const Registry_1 = require("jassijs/remote/Registry");
const Classes_1 = require("./Classes");
class TypeDef {
    constructor() {
        this.fields = {};
    }
    getRelation(fieldname) {
        var ret = undefined;
        var test = this.fields[fieldname];
        for (let key in test) {
            if (key === "OneToOne" || key === "OneToMany" || key === "ManyToOne" || key === "ManyToMany") {
                return { type: key, oclass: test[key][0]() };
            }
        }
        return ret;
    }
}
exports.TypeDef = TypeDef;
let Database = class Database {
    constructor() {
        this.typeDef = new Map();
        this.decoratorCalls = new Map();
        ;
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
            if (testname === name && key !== oclass) {
                this.decoratorCalls.delete(key);
            }
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
        /*if(delegate===undefined){
            debugger;
        }*/
        this.decoratorCalls.get(constructor).push([delegate, fieldprops, decoraterprops]);
        var afield = def.fields[field];
        if (def.fields[field] === undefined) {
            afield = {};
            def.fields[field] = afield;
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
    (0, Registry_1.$Class)("jassijs.remote.Database"),
    __metadata("design:paramtypes", [])
], Database);
exports.Database = Database;
//@ts-ignore
var db = new Database();
exports.db = db;
//# sourceMappingURL=Database.js.map