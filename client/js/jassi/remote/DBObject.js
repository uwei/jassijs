var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes", "jassi/remote/RemoteObject", "jassi/remote/Registry", "jassi/util/DatabaseSchema", "jassi/remote/Database"], function (require, exports, Jassi_1, Classes_1, RemoteObject_1, Registry_1, DatabaseSchema_1, Database_1) {
    "use strict";
    var DBObject_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObject = exports.MyFindManyOptions = exports.$DBObject = void 0;
    let cl = Classes_1.classes; //force Classes
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
    * all objects which use the jassi.db must implement this
    * @class DBObject
    */
    let DBObject = DBObject_1 = class DBObject extends RemoteObject_1.RemoteObject {
        constructor() {
            super();
        }
        isAutoId() {
            var def = Database_1.db.getMetadata(this.constructor);
            return def.id.PrimaryGeneratedColumn !== undefined;
        }
        static getFromCache(classname, id) {
            if (!DBObject_1.cache[classname])
                return undefined;
            return DBObject_1.cache[classname][id.toString()];
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
        * save the object to jassi.db
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
                        if (this.isAutoId())
                            throw new Error("autoid - load the object  before saving or remove id");
                        else {
                            //this._createObjectInDB
                            return await this.call(this, this._createObjectInDB, context);
                        } //fails if the Object is saved before loading 
                    }
                    else {
                        if (cl[this.id] !== this) {
                            throw new Error("the object must be loaded before save");
                        }
                    }
                    cl[this.id] = this; //Update cache on save
                    var newob = this._replaceObjectWithId(this);
                    var h = await this.call(newob, this.save, context);
                    this.id = h.id;
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
                var man = await (await new Promise((resolve_1, reject_1) => { require(["jassi/server/DBManager"], resolve_1, reject_1); })).DBManager.get();
                return man.save(context, this);
                // return ["jassi/base/ChromeDebugger.ts"];
            }
        }
        async _createObjectInDB(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                throw new Error("createObject could oly be called on server");
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_2, reject_2) => { require(["jassi/server/DBManager"], resolve_2, reject_2); })).DBManager.get();
                return man.insert(context, this);
            }
        }
        static async findOne(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.findOne, options, context);
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_3, reject_3) => { require(["jassi/server/DBManager"], resolve_3, reject_3); })).DBManager.get();
                return man.findOne(context, this, options);
            }
        }
        static async find(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.find, options, context);
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_4, reject_4) => { require(["jassi/server/DBManager"], resolve_4, reject_4); })).DBManager.get();
                return man.find(context, this, options);
            }
        }
        /**
        * reload the object from jassi.db
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
                var man = await (await new Promise((resolve_5, reject_5) => { require(["jassi/server/DBManager"], resolve_5, reject_5); })).DBManager.get();
                await man.remove(context, this);
            }
        }
        _getObjectProperty(dummy) {
        }
        _setObjectProperty(dummy, dumm1) {
        }
    };
    DBObject.cache = {};
    DBObject = DBObject_1 = __decorate([
        Jassi_1.$Class("jassi.remote.DBObject"),
        __metadata("design:paramtypes", [])
    ], DBObject);
    exports.DBObject = DBObject;
    async function test() {
        var h = Database_1.db.getMetadata(Classes_1.classes.getClass("de.Kunde"));
        // debugger;
    }
    exports.test = test;
});
//# sourceMappingURL=DBObject.js.map