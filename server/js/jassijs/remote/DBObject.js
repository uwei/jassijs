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
var DBObject_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.DBObject = exports.MyFindManyOptions = exports.$DBObject = void 0;
const Jassi_1 = require("jassijs/remote/Jassi");
const Classes_1 = require("jassijs/remote/Classes");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
const Registry_1 = require("jassijs/remote/Registry");
let cl = Classes_1.classes; //force Classes
const DatabaseSchema_1 = require("jassijs/util/DatabaseSchema");
const Database_1 = require("jassijs/remote/Database");
function $DBObject(options) {
    return function (pclass, ...params) {
        var classname = Classes_1.classes.getClassName(pclass);
        if (!options)
            options = {};
        if (!options.name)
            options.name = classname.toLowerCase().replaceAll(".", "_");
        Registry_1.default.register("$DBObject", pclass, options);
        DatabaseSchema_1.Entity(options)(pclass, ...params); //pass to orginal Entitiy
    };
}
exports.$DBObject = $DBObject;
class MyFindManyOptions {
}
exports.MyFindManyOptions = MyFindManyOptions;
/**
* base class for all database entfities
* all objects which use the jassijs.db must implement this
* @class DBObject
*/
let DBObject = DBObject_1 = class DBObject extends RemoteObject_1.RemoteObject {
    constructor() {
        super();
    }
    //clear cache on reload
    static _initFunc() {
        Registry_1.default.onregister("$Class", (data, name) => {
            delete DBObject_1.cache[name];
        });
    }
    isAutoId() {
        var _a;
        var def = (_a = Database_1.db.getMetadata(this.constructor)) === null || _a === void 0 ? void 0 : _a.fields;
        return def.id.PrimaryGeneratedColumn !== undefined;
    }
    static getFromCache(classname, id) {
        if (!DBObject_1.cache[classname])
            return undefined;
        return DBObject_1.cache[classname][id.toString()];
    }
    static clearCache(classname) {
        DBObject_1.cache[classname] = {};
    }
    removeFromCache() {
        var clname = Classes_1.classes.getClassName(this);
        if (!DBObject_1.cache[clname])
            return;
        delete DBObject_1.cache[clname][this.id.toString()];
    }
    static _createObject(ob) {
        if (ob === undefined)
            return undefined;
        var cl = DBObject_1.cache[ob.__clname__];
        if (cl === undefined) {
            cl = {};
            DBObject_1.cache[ob.__clname__] = cl;
        }
        var ret = cl[ob.id];
        if (ret === undefined) {
            ret = new (Classes_1.classes.getClass(ob.__clname__))();
            cl[ob.id] = ret;
        }
        return ret;
    }
    //public id:number;
    /**
     * replace all childs objects with {id:}
     */
    _replaceObjectWithId(obj) {
        var ret = {};
        if (obj === undefined)
            return undefined;
        for (var key in obj) {
            ret[key] = obj[key];
            if (ret[key] !== undefined && ret[key] !== null && ret[key].id !== undefined) {
                ret[key] = { id: ret[key].id };
            }
            if (Array.isArray(ret[key])) {
                ret[key] = [];
                for (var i = 0; i < obj[key].length; i++) {
                    ret[key].push(obj[key][i]);
                    if (ret[key][i] !== undefined && ret[key][i] !== null && ret[key][i].id !== undefined) {
                        ret[key][i] = { id: ret[key][i].id };
                    }
                }
            }
        }
        return ret;
    }
    /**
    * save the object to jassijs.db
    */
    async save(context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            if (this.id !== undefined) {
                var cname = Classes_1.classes.getClassName(this);
                var cl = DBObject_1.cache[cname];
                if (cl === undefined) {
                    cl = {};
                    DBObject_1.cache[cname] = cl;
                }
                if (cl[this.id] === undefined) {
                    cl[this.id] = this; //must be cached before inserting, so the new properties are introduced to the existing
                    /*if (this.isAutoId())
                        throw new Error("autoid - load the object  before saving or remove id");
                    else{*/
                    return await this.call(this, this._createObjectInDB, context);
                    //}//fails if the Object is saved before loading 
                }
                else {
                    if (cl[this.id] !== this) {
                        throw new Error("the object must be loaded before save");
                    }
                }
                cl[this.id] = this; //Update cache on save
                var newob = this._replaceObjectWithId(this);
                var id = await this.call(newob, this.save, context);
                this.id = id;
                return this;
            }
            else {
                if (!this.isAutoId()) {
                    throw new Error("error while saving the Id is not set");
                }
                else {
                    var newob = this._replaceObjectWithId(this);
                    var h = await this.call(newob, this._createObjectInDB, context);
                    this.id = h.id;
                    DBObject_1.cache[Classes_1.classes.getClassName(this)][this.id] = this;
                    return this;
                }
            }
        }
        else {
            //@ts-ignore
            var man = await (await Promise.resolve().then(() => require("jassijs/server/DBManager"))).DBManager.get();
            return man.save(context, this);
            // return ["jassijs/base/ChromeDebugger.ts"];
        }
    }
    async _createObjectInDB(context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            throw new Error("createObject could oly be called on server");
        }
        else {
            //@ts-ignore
            var man = await (await Promise.resolve().then(() => require("jassijs/server/DBManager"))).DBManager.get();
            return man.insert(context, this);
        }
    }
    static async findOne(options = undefined, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await this.call(this.findOne, options, context);
        }
        else {
            //@ts-ignore
            var man = await (await Promise.resolve().then(() => require("jassijs/server/DBManager"))).DBManager.get();
            return man.findOne(context, this, options);
        }
    }
    static async find(options = undefined, context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            return await this.call(this.find, options, context);
        }
        else {
            //@ts-ignore
            var man = await (await Promise.resolve().then(() => require("jassijs/server/DBManager"))).DBManager.get();
            return man.find(context, this, options);
        }
    }
    /**
    * reload the object from jassijs.db
    */
    async remove(context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            //@ts-ignore
            var cl = DBObject_1.cache[Classes_1.classes.getClassName(this)];
            if (cl !== undefined) {
                delete cl[this.id];
            }
            return await this.call({ id: this.id }, this.remove, context);
        }
        else {
            //@ts-ignore
            var man = await (await Promise.resolve().then(() => require("jassijs/server/DBManager"))).DBManager.get();
            await man.remove(context, this);
        }
    }
    _getObjectProperty(dummy) {
    }
    _setObjectProperty(dummy, dumm1) {
    }
};
DBObject.cache = {};
DBObject._init = DBObject_1._initFunc();
DBObject = DBObject_1 = __decorate([
    Jassi_1.$Class("jassijs.remote.DBObject"),
    __metadata("design:paramtypes", [])
], DBObject);
exports.DBObject = DBObject;
async function test() {
    var h = Database_1.db.getMetadata(Classes_1.classes.getClass("de.Kunde"));
    // debugger;
}
exports.test = test;
//# sourceMappingURL=DBObject.js.map