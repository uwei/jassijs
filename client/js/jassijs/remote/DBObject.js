var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/RemoteObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Database", "jassijs/remote/Validator", "jassijs/remote/Serverservice"], function (require, exports, Registry_1, Classes_1, RemoteObject_1, Registry_2, DatabaseSchema_1, Database_1, Validator_1, Serverservice_1) {
    "use strict";
    var DBObject_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObject = exports.MyFindManyOptions = exports.$DBObject = void 0;
    Registry_2 = __importDefault(Registry_2);
    let cl = Classes_1.classes; //force Classes
    function $DBObject(options) {
        return function (pclass, ...params) {
            var classname = Classes_1.classes.getClassName(pclass);
            if (!options)
                options = {};
            if (!options.name)
                options.name = classname.toLowerCase().replaceAll(".", "_");
            Registry_2.default.register("$DBObject", pclass, options);
            //@ts-ignore
            (0, DatabaseSchema_1.Entity)(options)(pclass, ...params); //pass to orginal Entitiy
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
    let DBObject = DBObject_1 = class DBObject {
        //clear cache on reload
        static _initFunc() {
            Registry_2.default.onregister("$Class", (data, name) => {
                delete DBObject_1.cache[name];
            });
        }
        isAutoId() {
            var _a;
            var h = Database_1.db;
            var def = (_a = Database_1.db.getMetadata(this.constructor)) === null || _a === void 0 ? void 0 : _a.fields;
            return def.id.PrimaryGeneratedColumn !== undefined;
        }
        static getFromCache(classname, id) {
            if (!DBObject_1.cache[classname])
                return undefined;
            return DBObject_1.cache[classname][id.toString()];
        }
        async validate(options = undefined, throwError = false) {
            var ret = (0, Validator_1.validate)(this, options, throwError);
            return ret;
        }
        static addToCache(ob) {
            if (ob === undefined)
                return undefined;
            var clname = Classes_1.classes.getClassName(ob);
            var cl = DBObject_1.cache[clname];
            if (cl === undefined) {
                cl = {};
                DBObject_1.cache[clname] = cl;
            }
            cl[ob.id] = ob;
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
            let ttest = 9992;
            try {
                await this.validate({
                    delegateOptions: {
                        ValidateIsInstanceOf: { alternativeJsonProperties: ["id"] },
                        ValidateIsArray: { alternativeJsonProperties: ["id"] }
                    }
                });
                console.log("now");
            }
            catch (err) {
                debugger;
                console.log("error" + err);
            }
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if (this.id !== undefined) {
                    var cname = Classes_1.classes.getClassName(this);
                    /* var cl = DBObject.cache[cname];
                     if (cl === undefined) {
                         cl = {};
                         DBObject.cache[cname] = cl;
                     }*/
                    var cached = DBObject_1.getFromCache(cname, this.id);
                    if (cached === undefined) {
                        DBObject_1.addToCache(this); //must be cached before inserting, so the new properties are introduced to the existing
                        if (this.isAutoId())
                            throw new Classes_1.JassiError("autoid - load the object  before saving or remove id");
                        else
                            return await RemoteObject_1.RemoteObject.docall(this, this._createObjectInDB, ...arguments);
                        //}//fails if the Object is saved before loading 
                    }
                    else {
                        if (cached !== this) {
                            throw new Classes_1.JassiError("the object must be loaded before save");
                        }
                    }
                    DBObject_1.addToCache(this);
                    //                cl[this.id] = this;//Update cache on save
                    var newob = this._replaceObjectWithId(this);
                    var id = await RemoteObject_1.RemoteObject.docallWithReplaceThis(newob, this, this.save, ...arguments);
                    this.id = id;
                    return this;
                }
                else {
                    if (!this.isAutoId()) {
                        throw new Classes_1.JassiError("error while saving the Id is not set");
                    }
                    else {
                        var newob = this._replaceObjectWithId(this);
                        var h = await RemoteObject_1.RemoteObject.docallWithReplaceThis(newob, this, this._createObjectInDB, ...arguments);
                        this.id = h;
                        DBObject_1.addToCache(this);
                        //                	 DBObject.cache[classes.getClassName(this)][this.id]=this;
                        return this;
                    }
                }
            }
            else {
                return (await Serverservice_1.serverservices.db).save(context, this);
            }
        }
        async _createObjectInDB(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                throw new Classes_1.JassiError("createObject could oly be called on server");
            }
            else {
                return (await Serverservice_1.serverservices.db).insert(context, this);
            }
        }
        //@UseServer()
        static async findOne(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return RemoteObject_1.RemoteObject.docall(this, this.findOne, ...arguments);
            }
            else {
                var db = await (Serverservice_1.serverservices.db);
                return db.findOne(context, this, options);
            }
        }
        // @UseServer()
        static async find(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return RemoteObject_1.RemoteObject.docall(this, this.find, ...arguments);
            }
            else {
                var db = await (Serverservice_1.serverservices.db);
                return db.find(context, this, options);
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
                return await RemoteObject_1.RemoteObject.docallWithReplaceThis({ id: this.id }, this, this.remove, ...arguments);
            }
            else {
                //@ts-ignore
                return (await Serverservice_1.serverservices.db).remove(context, this);
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
        (0, Registry_1.$Class)("jassijs.remote.DBObject")
    ], DBObject);
    exports.DBObject = DBObject;
    async function test() {
        var h = Database_1.db.getMetadata(Classes_1.classes.getClass("de.Kunde"));
        // debugger;
    }
    exports.test = test;
});
//# sourceMappingURL=DBObject.js.map