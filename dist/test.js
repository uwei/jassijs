"use strict:";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define("jassijs/remote/Classes", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.classes = exports.Classes = exports.JassiError = void 0;
    let JassiError = class JassiError extends Error {
        constructor(msg) {
            super(msg);
        }
    };
    JassiError = __decorate([
        $Class("jassijs.remote.JassiError"),
        __metadata("design:paramtypes", [String])
    ], JassiError);
    exports.JassiError = JassiError;
    function $Class(longclassname) {
        return function (pclass) {
            Registry_1.default.register("$Class", pclass, longclassname);
        };
    }
    /**
    * manage all registered classes ->jassijs.register("classes")
    * @class jassijs.base.Classes
    */
    let Classes = class Classes {
        constructor() {
            this._cache = {};
            this.funcRegister = Registry_1.default.onregister("$Class", this.register.bind(this));
        }
        destroy() {
            Registry_1.default.offregister("$Class", this.funcRegister);
        }
        /**
         * load the a class
         * @param classname - the class to load
         */
        async loadClass(classname) {
            var cl = await Registry_1.default.getJSONData("$Class", classname);
            if (cl === undefined) {
                try {
                    //@ts-ignore
                    if (require.main) { //nodes load project class from module
                        //@ts-ignore
                        await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                    }
                    else {
                        await new Promise((resolve_1, reject_1) => { require([classname.replaceAll(".", "/")], resolve_1, reject_1); });
                    }
                }
                catch (err) {
                    err = err;
                }
            }
            else {
                if (cl === undefined || cl.length === 0) {
                    throw new JassiError("Class not found:" + classname);
                }
                var file = cl[0].filename;
                //@ts-ignore
                if (window.document === undefined) {
                    var pack = file.split("/");
                    if (pack.length < 2 || pack[1] !== "remote") {
                        throw new JassiError("failed loadClass " + classname + " on server only remote classes coud be loaded");
                    }
                }
                //@ts-ignore
                if (require.main) { //nodes load project class from module
                    //@ts-ignore
                    var imp = await Promise.resolve().then(() => require.main.require(file.replace(".ts", "")));
                }
                else {
                    var imp = await new Promise((resolve_2, reject_2) => { require([file.replace(".ts", "")], resolve_2, reject_2); });
                }
            }
            return this.getClass(classname);
        }
        /**
        * get the class of the given classname
        * @param {string} - the classname
        * @returns {class} - the class
        */
        getClass(classname) {
            return this._cache[classname];
            /* var ret=this.getPackage(classname);
             
             if(ret!==undefined&&ret.prototype!==undefined && ret.prototype.constructor === ret)
                 return ret;
             else
                 return undefined; */
        }
        /**
        * get the name of the given class
        * @param {class} _class - the class (prototype)
        * @returns {string} name of the class
        */
        getClassName(_class) {
            var _a, _b, _c, _d, _e, _f;
            if (_class === undefined)
                return undefined;
            if ((_a = _class.constructor) === null || _a === void 0 ? void 0 : _a._classname)
                return (_b = _class.constructor) === null || _b === void 0 ? void 0 : _b._classname;
            if ((_d = (_c = _class.prototype) === null || _c === void 0 ? void 0 : _c.constructor) === null || _d === void 0 ? void 0 : _d._classname)
                return (_f = (_e = _class.prototype) === null || _e === void 0 ? void 0 : _e.constructor) === null || _f === void 0 ? void 0 : _f._classname;
            return undefined;
        }
        register(data, name) {
            //data.prototype._classname=name;
            this._cache[name] = data;
        }
    };
    Classes = __decorate([
        $Class("jassijs.remote.Classes"),
        __metadata("design:paramtypes", [])
    ], Classes);
    exports.Classes = Classes;
    ;
    let classes = new Classes();
    exports.classes = classes;
    async function test(t) {
        var cl = classes.getClass("jassijs.ui.Button");
        t.expectEqual(cl === await classes.loadClass("jassijs.ui.Button"));
        t.expectEqual(classes.getClassName(cl) === "jassijs.ui.Button");
    }
    exports.test = test;
});
define("jassijs/remote/ClientError", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClientError = void 0;
    let ClientError = class ClientError extends Error {
        constructor(msg) {
            super(msg);
        }
    };
    ClientError = __decorate([
        (0, Registry_2.$Class)("jassijs.remote.ClientError"),
        __metadata("design:paramtypes", [String])
    ], ClientError);
    exports.ClientError = ClientError;
});
define("jassijs/remote/DBArray", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Registry_3, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBArray = void 0;
    let cl = Classes_1.classes; //force Classes.
    let DBArray = class DBArray
    /**
    * Array for jassijs.base.DBObject's
    * can be saved to db
    * @class jassijs.base.DBArray
    */
     extends Array {
        constructor(...args) {
            super(...args);
        }
        /**
         * adds an object
         * if the object is linked to an other object then update this
         * @param {object} ob - the object to add
         */
        add(ob) {
            if (ob === undefined || ob === null)
                throw new Classes_1.JassiError("Error cannot add object null");
            this.push(ob);
            if (this._parentObject !== undefined) {
                //set linked object
                var link = jassijs.db.typeDef.linkForField(this._parentObject.__proto__._dbtype, this._parentObjectMember);
                if (link !== undefined && link.type === "array") { //array can not connected){
                    var test = ob._objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname === undefined) {
                        if (test.indexOf(this._parentObject) < 0)
                            test.add(this._parentObject);
                    }
                }
                if (link !== undefined && link.type === "object") {
                    var test = ob.__objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname !== undefined && test !== this) {
                        ob._setObjectProperty(link.name, this._parentObject);
                    }
                }
            }
        }
        /**
         * for compatibility
         */
        async resolve() {
            //Object was already resolved   
            return this;
        }
        /**
         * remove an object
         * if the object is linked to an other object then update this
         * @param {object} ob - the object to remove
         */
        remove(ob) {
            var pos = this.indexOf(ob);
            if (pos >= 0)
                this.splice(pos, 1);
            if (this._parentObject !== undefined) {
                //set linked object
                var link = jassijs.db.typeDef.linkForField(this._parentObject.__proto__._dbtype, this._parentObjectMember);
                if (link !== undefined && link.type === "array") { //array can not connected){
                    var test = ob._objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname === undefined) {
                        if (test.indexOf(this._parentObject) >= 0)
                            test.remove(this._parentObject);
                    }
                }
                if (link !== undefined && link.type === "object") {
                    var test = ob._getObjectProperty(link.name);
                    if (test !== undefined && test.unresolvedclassname !== undefined && test !== this) {
                        ob._setObjectProperty(link.name, null);
                    }
                }
            }
        }
    };
    DBArray = __decorate([
        (0, Registry_3.$Class)("jassijs.remote.DBArray"),
        __metadata("design:paramtypes", [Object])
    ], DBArray);
    exports.DBArray = DBArray;
});
define("jassijs/remote/DBObject", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/RemoteObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Database", "jassijs/remote/Validator", "jassijs/remote/Serverservice"], function (require, exports, Registry_4, Classes_2, RemoteObject_1, Registry_5, DatabaseSchema_1, Database_1, Validator_1, Serverservice_1) {
    "use strict";
    var DBObject_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObject = exports.MyFindManyOptions = exports.$DBObject = void 0;
    let cl = Classes_2.classes; //force Classes
    function $DBObject(options) {
        return function (pclass, ...params) {
            var classname = Classes_2.classes.getClassName(pclass);
            if (!options)
                options = {};
            if (!options.name)
                options.name = classname.toLowerCase().replaceAll(".", "_");
            Registry_5.default.register("$DBObject", pclass, options);
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
    let DBObject = DBObject_1 = class DBObject extends RemoteObject_1.RemoteObject {
        //clear cache on reload
        static _initFunc() {
            Registry_5.default.onregister("$Class", (data, name) => {
                delete DBObject_1.cache[name];
            });
        }
        constructor() {
            super();
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
            var clname = Classes_2.classes.getClassName(ob);
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
            var clname = Classes_2.classes.getClassName(this);
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
                ret = new (Classes_2.classes.getClass(ob.__clname__))();
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
            await this.validate({
                delegateOptions: {
                    ValidateIsInstanceOf: { alternativeJsonProperties: ["id"] },
                    ValidateIsArray: { alternativeJsonProperties: ["id"] }
                }
            });
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if (this.id !== undefined) {
                    var cname = Classes_2.classes.getClassName(this);
                    /* var cl = DBObject.cache[cname];
                     if (cl === undefined) {
                         cl = {};
                         DBObject.cache[cname] = cl;
                     }*/
                    var cached = DBObject_1.getFromCache(cname, this.id);
                    if (cached === undefined) {
                        DBObject_1.addToCache(this); //must be cached before inserting, so the new properties are introduced to the existing
                        if (this.isAutoId())
                            throw new Classes_2.JassiError("autoid - load the object  before saving or remove id");
                        else
                            return await this.call(this, this._createObjectInDB, context);
                        //}//fails if the Object is saved before loading 
                    }
                    else {
                        if (cached !== this) {
                            throw new Classes_2.JassiError("the object must be loaded before save");
                        }
                    }
                    DBObject_1.addToCache(this);
                    //                cl[this.id] = this;//Update cache on save
                    var newob = this._replaceObjectWithId(this);
                    var id = await this.call(newob, this.save, context);
                    this.id = id;
                    return this;
                }
                else {
                    if (!this.isAutoId()) {
                        throw new Classes_2.JassiError("error while saving the Id is not set");
                    }
                    else {
                        var newob = this._replaceObjectWithId(this);
                        var h = await this.call(newob, this._createObjectInDB, context);
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
                throw new Classes_2.JassiError("createObject could oly be called on server");
            }
            else {
                return (await Serverservice_1.serverservices.db).insert(context, this);
            }
        }
        static async findOne(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.findOne, options, context);
            }
            else {
                return (await Serverservice_1.serverservices.db).findOne(context, this, options);
            }
        }
        static async find(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.find, options, context);
            }
            else {
                return (await Serverservice_1.serverservices.db).find(context, this, options);
            }
        }
        /**
        * reload the object from jassijs.db
        */
        async remove(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                //@ts-ignore
                var cl = DBObject_1.cache[Classes_2.classes.getClassName(this)];
                if (cl !== undefined) {
                    delete cl[this.id];
                }
                return await this.call({ id: this.id }, this.remove, context);
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
        (0, Registry_4.$Class)("jassijs.remote.DBObject"),
        __metadata("design:paramtypes", [])
    ], DBObject);
    exports.DBObject = DBObject;
    async function test() {
        var h = Database_1.db.getMetadata(Classes_2.classes.getClass("de.Kunde"));
        // debugger;
    }
    exports.test = test;
});
define("jassijs/remote/DBObjectQuery", ["require", "exports", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Classes_3, Registry_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectQuery = exports.$DBObjectQuery = exports.DBObjectQueryProperties = void 0;
    class DBObjectQueryProperties {
    }
    exports.DBObjectQueryProperties = DBObjectQueryProperties;
    function $DBObjectQuery(property) {
        return function (target, propertyKey, descriptor) {
            var test = Classes_3.classes.getClassName(target);
            Registry_6.default.registerMember("$DBObjectQuery", target, propertyKey, property);
        };
    }
    exports.$DBObjectQuery = $DBObjectQuery;
    class DBObjectQuery {
        async execute() {
            return undefined;
        }
        static async getQueries(classname) {
            var cl = await Classes_3.classes.loadClass(classname);
            var ret = [];
            var all = Registry_6.default.getMemberData("$DBObjectQuery");
            var queries = all[classname];
            for (var name in queries) {
                var qu = queries[name][0][0];
                var query = new DBObjectQuery();
                query.classname = classname;
                query.name = qu.name;
                query.description = qu.description;
                query.execute = async function () {
                    return await cl[name]();
                };
                ret.push(query);
            }
            return ret;
        }
    }
    exports.DBObjectQuery = DBObjectQuery;
    async function test() {
        //	var qu=(await DBObjectQuery.getQueries("de.Kunde"))[0];
        //	var j=await qu.execute();
    }
    exports.test = test;
});
define("jassijs/remote/Database", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Registry_7, Classes_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.db = exports.Database = exports.TypeDef = void 0;
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
            var name = Classes_4.classes.getClassName(oclass);
            this.typeDef.forEach((value, key) => {
                var testname = Classes_4.classes.getClassName(key);
                if (testname === name && key !== oclass)
                    this.typeDef.delete(key);
            });
            this.decoratorCalls.forEach((value, key) => {
                var testname = Classes_4.classes.getClassName(key);
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
        (0, Registry_7.$Class)("jassijs.remote.Database"),
        __metadata("design:paramtypes", [])
    ], Database);
    exports.Database = Database;
    //@ts-ignore
    var db = new Database();
    exports.db = db;
});
define("jassijs/remote/DatabaseTools", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/Classes", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, Registry_8, RemoteObject_2, Classes_5, Serverservice_2, Validator_2) {
    "use strict";
    var DatabaseTools_1;
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DatabaseTools = void 0;
    let DatabaseTools = DatabaseTools_1 = class DatabaseTools extends RemoteObject_2.RemoteObject {
        //this is a sample remote function
        static async runSQL(sql, parameter = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.runSQL, sql, parameter, context);
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_5.JassiError("only admins can delete");
                return (await Serverservice_2.serverservices.db).runSQL(context, sql, parameter);
            }
        }
        static async dropTables(tables) {
            for (var i = 0; i < tables.length; i++) {
                if ((/[A-Z,a-z,_,0-9]+/g).exec(tables[i])[0] !== tables[i]) {
                    throw new Classes_5.JassiError(tables[i] + " is not a valid tablename");
                }
            }
            if (tables.length === 0) {
                throw new Classes_5.JassiError("no tables to drop");
            }
            return await DatabaseTools_1.runSQL("DROP TABLE " + tables.join(","));
        }
    };
    __decorate([
        (0, Validator_2.ValidateFunctionParameter)(),
        __param(0, (0, Validator_2.ValidateIsString)()),
        __param(1, (0, Validator_2.ValidateIsArray)({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Array, typeof (_a = typeof RemoteObject_2.Context !== "undefined" && RemoteObject_2.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], DatabaseTools, "runSQL", null);
    DatabaseTools = DatabaseTools_1 = __decorate([
        (0, Registry_8.$Class)("jassijs.remote.DatabaseTools")
    ], DatabaseTools);
    exports.DatabaseTools = DatabaseTools;
    async function test() {
        /*  var h=await DatabaseTools.runSQL('DROP TABLE :p1,:p2',[
                              {p1:"te_person2",
                                          p2:"tg_person"}]);//,"te_person2"]);*/
        //var h=await DatabaseTools.runSQL('select * from jassijs_rights'); 
    }
    exports.test = test;
});
define("jassijs/remote/Extensions", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extensions = exports.Extensions = exports.$Extension = void 0;
    function $Extension(forclass) {
        return function (pclass) {
            Registry_9.default.register("$Extension", pclass, forclass);
        };
    }
    exports.$Extension = $Extension;
    class ExtensionTarget {
        addFunction(name, func, ifExists) {
        }
        addMember(name) {
        }
        annotateMember(member, type, ...annotations) {
        }
    }
    class Extensions {
        constructor() {
            this.funcRegister = Registry_9.default.onregister("$Extension", this.register.bind(this));
        }
        destroy() {
            Registry_9.default.offregister("$Extension", this.funcRegister);
        }
        annotate(oclass, ...annotations) {
            throw new Error("not implemented yet");
        }
        register(extensionclass, forclass) {
            //TODO reloading???
            //we must wait with to extent because forclass ist not loaded
            var func = Registry_9.default.onregister("$Class", function (oclass, params) {
                if (oclass.prototype.constructor._classname === forclass) {
                    // reloading code-> registry.offregister("$Class", func);
                    let props = Object.getOwnPropertyNames(extensionclass.prototype);
                    for (var m = 0; m < props.length; m++) {
                        var member = props[m];
                        if (member !== "_classname" && member !== "constructor") {
                            if (typeof extensionclass.prototype[member] === "function") {
                                if (oclass.prototype[member] !== undefined) {
                                    var sic = oclass.prototype[member];
                                    var ext = extensionclass.prototype[member];
                                    oclass.prototype[member] = function (...p) {
                                        sic.bind(this)(...p);
                                        ext.bind(this)(...p);
                                    };
                                }
                                else
                                    oclass.prototype[member] = extensionclass.prototype[member];
                            }
                        }
                    }
                }
            });
            //  alert(forclass);
        }
        annotateMember(classname, member, type, ...annotations) {
            var func = Registry_9.default.onregister("$Class", function (oclass, params) {
                if (oclass.prototype.constructor._classname === classname) {
                    Registry_9.default.offregister("$Class", func);
                    //designtype
                    Reflect["metadata"]("design:type", type)(oclass.prototype, member);
                    for (var x = 0; x < annotations.length; x++) {
                        let ann = annotations[x];
                        ann(oclass.prototype, member);
                    }
                }
            });
        }
    }
    exports.Extensions = Extensions;
    var extensions = new Extensions();
    exports.extensions = extensions;
});
define("jassijs/remote/FileNode", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FileNode = void 0;
    ;
    let FileNode = class FileNode {
        constructor(fullpath = undefined) {
            if (fullpath) {
                this.fullpath = fullpath;
                this.name = fullpath.split("/")[fullpath.split("/").length - 1];
            }
        }
        isDirectory() {
            return this.files !== undefined;
        }
        resolveChilds(all) {
            if (all === undefined)
                all = {};
            //var ret:FileNode[]=[];
            if (this.files !== undefined) {
                for (let x = 0; x < this.files.length; x++) {
                    all[this.files[x].fullpath] = this.files[x];
                    this.files[x].resolveChilds(all);
                }
            }
            return all;
        }
    };
    FileNode = __decorate([
        (0, Registry_10.$Class)("jassijs.remote.FileNode"),
        __metadata("design:paramtypes", [String])
    ], FileNode);
    exports.FileNode = FileNode;
});
define("jassijs/remote/Jassi", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Jassi = void 0;
    //@ts-ignore
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
    /**
    * main class for jassi
    * @class Jassi
    */
    class Jassi {
        constructor() {
            this.isServer = false;
            //@ts-ignore
            this.isServer = window.document === undefined;
            //@ts-ignore
            //this.modules = window?.__jassijsconfig__?.modules;
            //@ts-ignore
            //this.options = window?.__jassijsconfig__?.options;
            if (!this.isServer) {
                //@ts-ignore 
                /*import("jassijs/modul").then((modul)=>{
                    jassijs.myRequire(modul.default.css["jassijs.css"]);
                    jassijs.myRequire(modul.default.css["jquery-ui.css"]);
                    jassijs.myRequire(modul.default.css["materialdesignicons.min.css"]);
        
                });*/
                //  this.myRequire("jassi/jassijs.css");
                //  this.myRequire("https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css");
                //  this.myRequire("https:///cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css");
            }
        }
        includeCSSFile(modulkey) {
            this.myRequire(this.cssFiles[modulkey]);
        }
        /**
         * include a global stylesheet
         * @id - the given id - important for update
         * @data - the css data to insert
         **/
        includeCSS(id, data) {
            //@ts-ignore
            var style = document.getElementById(id);
            //@ts-ignore
            if (!document.getElementById(id)) {
                style = document.createRange().createContextualFragment('<style id=' + id + '></style>').children[0];
                //@ts-ignore
                document.head.appendChild(style);
            }
            var sstyle = "";
            for (var selector in data) {
                var sstyle = sstyle + "\n\t" + selector + "{\n";
                var properties = data[selector];
                var prop = {};
                for (let key in properties) {
                    if (key === "_classname")
                        continue;
                    var newKey = key.replaceAll("_", "-");
                    prop[newKey] = properties[key];
                    sstyle = sstyle + "\t\t" + newKey + ":" + properties[key] + ";\n";
                }
                sstyle = sstyle + "\t}\n";
            }
            style.innerHTML = sstyle;
        }
        /**
        * include a js or a css file
        * @param {string|string[]} href - url(s) of the js or css file(s)
        * @param {function} [param] - would be added with? to the url
        */
        myRequire(href, event = undefined, param = undefined) {
            if (this.isServer)
                throw new Error("jassi.Require is only available on client");
            if ((typeof href) === "string") {
                href = [href];
            }
            var url = "";
            if (href instanceof Array) {
                if (href.length === 0) {
                    if (event !== undefined)
                        event();
                    return;
                }
                else {
                    url = href[0];
                    href.splice(0, 1);
                }
            }
            if (url.endsWith(".js")) {
                //@ts-ignore
                if (window.document.getElementById("-->" + url) !== null) {
                    this.myRequire(href, event);
                }
                else {
                    //@ts-ignore
                    var js = window.document.createElement("script");
                    //   js.type = "text/javascript";
                    js.src = url + (param !== undefined ? "?" + param : "");
                    var _this = this;
                    js.onload = function () {
                        _this.myRequire(href, event);
                    };
                    js.id = "-->" + url;
                    //@ts-ignore
                    window.document.head.appendChild(js);
                }
            }
            else {
                if (document.getElementById("-->" + url) != null) {
                    if (event)
                        event();
                    return;
                }
                //    <link href="lib/jquery.splitter.css" rel="stylesheet"/>
                //@ts-ignore
                var head = window.document.getElementsByTagName('head')[0];
                //@ts-ignore
                var link = window.document.createElement('link');
                //  link.rel  = 'import';
                link.href = url;
                link.rel = "stylesheet";
                link.id = "-->" + url;
                var _this = this;
                //@ts-ignore 
                link.onload = function (data1, data2) {
                    _this.myRequire(href, event);
                };
                head.appendChild(link);
            }
        }
    }
    exports.Jassi = Jassi;
    ;
    var jassijs = new Jassi();
    globalThis.jassijs = jassijs;
});
define("jassijs/remote/ObjectTransaction", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObjectTransaction = void 0;
    class ObjectTransaction {
        constructor() {
            this.statements = [];
            this.functionsFinally = [];
        }
        transactionResolved(context) {
            //var session = getNamespace('objecttransaction');
            var test = context.objecttransactionitem; // session.get("objecttransaction");
            if (test)
                test.resolve = true;
        }
        addFunctionFinally(functionToAdd) {
            this.functionsFinally.push(functionToAdd);
        }
        checkFinally() {
            let canFinally = true;
            this.statements.forEach((ent) => {
                if (ent.result === "**unresolved**")
                    canFinally = false;
                if (ent.result["then"] && !ent["resolve"]) { //Promise, which is not resolved by addFunctionFinally
                    canFinally = false;
                }
            });
            if (canFinally) {
                this.finally();
            }
        }
        async finally() {
            for (let x = 0; x < this.functionsFinally.length; x++) {
                await this.functionsFinally[x]();
            }
        }
    }
    exports.ObjectTransaction = ObjectTransaction;
});
define("jassijs/remote/Registry", ["require", "exports", "reflect-metadata"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.migrateModul = exports.Registry = exports.$register = exports.$Class = void 0;
    function $Class(longclassname) {
        return function (pclass) {
            registry.register("$Class", pclass, longclassname);
        };
    }
    exports.$Class = $Class;
    function $register(servicename, ...params) {
        return function (pclass) {
            registry.register(servicename, pclass, params);
        };
    }
    exports.$register = $register;
    if (Reflect["_metadataorg"] === undefined) {
        Reflect["_metadataorg"] = Reflect["metadata"];
        if (Reflect["_metadataorg"] === undefined)
            Reflect["_metadataorg"] = null;
    }
    //@ts-ignore
    Reflect["metadata"] = function (o, property, ...args) {
        return function (target, propertyKey, descriptor, ...fargs) {
            //delegation to 
            if (Reflect["_metadataorg"] !== null) {
                var func = Reflect["_metadataorg"](o, property, ...args);
                func(target, propertyKey, descriptor, ...fargs);
            }
            if (o === "design:type") {
                registry.registerMember("design:type", target, propertyKey, property);
            }
        };
    };
    class DataEntry {
    }
    class JSONDataEntry {
    }
    /**
    * Manage all known data registered by jassijs.register
    * the data is downloaded by /registry.json
    * registry.json is updated by the server on code upload
    * @class jassijs.base.Registry
    */
    class Registry {
        constructor() {
            this.jsondata = undefined;
            this.data = {};
            this.dataMembers = {};
            this.jsondataMembers = {};
            this._eventHandler = {};
            this._nextID = 10;
            this.isLoading = this.reload();
        }
        getData(service, classname = undefined) {
            var olddata = this.data[service];
            if (olddata === undefined)
                return [];
            var ret = [];
            if (classname !== undefined) {
                if (olddata[classname] !== undefined) {
                    ret.push(olddata[classname]);
                }
            }
            else {
                for (var key in olddata) {
                    ret.push(olddata[key]);
                }
            }
            return ret;
        }
        onregister(service, callback) {
            var events = this._eventHandler[service];
            if (events === undefined) {
                events = [];
                this._eventHandler[service] = events;
            }
            events.push(callback);
            //push already registered events
            var olddata = this.data[service];
            for (var key in olddata) {
                var dataentry = olddata[key];
                callback(dataentry.oclass, ...dataentry.params);
            }
            return callback;
        }
        offregister(service, callback) {
            var events = this._eventHandler[service];
            var pos = events.indexOf(callback);
            if (pos >= 0)
                events.splice(pos, 1);
        }
        /**
         * register an anotation
         * Important: this function should only used from an annotation, because the annotation is saved in
         *            index.json and could be read without loading the class
         **/
        register(service, oclass, ...params) {
            var sclass = oclass.prototype.constructor._classname;
            if (sclass === undefined && service !== "$Class") {
                throw new Error("@$Class member is missing or must be set at last");
                return;
            }
            if (service === "$Class") {
                sclass = params[0];
                oclass.prototype.constructor._classname = params[0];
            }
            if (this.data[service] === undefined) {
                this.data[service] = {};
            }
            this.data[service][sclass] = { oclass, params };
            //the array could be modified so we need a copy
            var events = this._eventHandler[service] === undefined ? undefined : [].concat(this._eventHandler[service]);
            if (events !== undefined) {
                for (var x = 0; x < events.length; x++) {
                    events[x](oclass, ...params);
                }
            }
            if (service === "$Class") {
                //console.log("load " + params[0]);
                //finalize temporary saved registerd members
                let tempMem = oclass.prototype.$$tempRegisterdMembers$$;
                if (tempMem === undefined)
                    //@ts-ignore
                    tempMem = oclass.$$tempRegisterdMembers$$;
                if (tempMem !== undefined) {
                    //this.dataMembers = oclass.prototype.$$tempRegisterdMembers$$;
                    for (var sservice in tempMem) {
                        var pservice = tempMem[sservice];
                        if (this.dataMembers[sservice] === undefined) {
                            this.dataMembers[sservice] = {};
                        }
                        this.dataMembers[sservice][sclass] = pservice;
                    }
                    delete oclass.prototype.$$tempRegisterdMembers$$;
                    //@ts-ignore
                    delete oclass.$$tempRegisterdMembers$$;
                }
            }
        }
        getMemberData(service) {
            return this.dataMembers[service];
        }
        getJSONMemberData(service) {
            return this.jsondataMembers[service];
        }
        /**
         * register an anotation
         * Important: this function should only used from an annotation
         **/
        registerMember(service, oclass /*new (...args: any[]) => any*/, membername, ...params) {
            var m = oclass;
            if (oclass.prototype !== undefined)
                m = oclass.prototype;
            //the classname is not already known so we temporarly store the data in oclass.$$tempRegisterdMembers$$
            //and register the member in register("$Class",....)
            if (m.$$tempRegisterdMembers$$ === undefined) {
                m.$$tempRegisterdMembers$$ = {};
            }
            if (m.$$tempRegisterdMembers$$[service] === undefined) {
                m.$$tempRegisterdMembers$$[service] = {};
            }
            if (m.$$tempRegisterdMembers$$[service][membername] === undefined) {
                m.$$tempRegisterdMembers$$[service][membername] = [];
            }
            m.$$tempRegisterdMembers$$[service][membername].push(params);
        }
        /**
        * with every call a new id is generated - used to create a free id for the dom
        * @returns {number} - the id
        */
        nextID() {
            this._nextID = this._nextID + 1;
            return this._nextID.toString();
        }
        /**
        * Load text with Ajax synchronously: takes path to file and optional MIME type
        * @param {string} filePath - the url
        * @returns {string} content
        */ /*
        loadFile(filePath)
        {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let response = null;
                xhr.addEventListener("readystatechange", function() {
                  if (this.readyState === xhr.DONE) {
                    response = this.responseText;
                    if (response) {
                      //response = JSON.parse(response);
                      resolve(response);
                    }
                  }
                });
                xhr.open("GET",filePath, true);
                xhr.send();
                xhr.overrideMimeType("application/json");
                xhr.onerror = function(error) {
                  reject({
                    error: "Some error"
                  })
                }
              });
        }*/
        async loadText(url) {
            return new Promise((resolve) => {
                //@ts-ignore
                let oReq = new XMLHttpRequest();
                oReq.open("GET", url);
                oReq.onerror = () => {
                    resolve(undefined);
                };
                oReq.addEventListener("load", () => {
                    if (oReq.status === 200)
                        resolve(oReq.responseText);
                    else
                        resolve(undefined);
                });
                oReq.send();
            });
        }
        /**
         * reload the registry
         */
        async reload() {
            this.jsondata = { $Class: {} };
            this.jsondataMembers = {};
            var _this = this;
            var modultext = "";
            //@ts-ignore
            if ((window === null || window === void 0 ? void 0 : window.document) === undefined) { //on server
                //@ts-ignore
                var fs = await new Promise((resolve_3, reject_3) => { require(['fs'], resolve_3, reject_3); });
                modultext = fs.readFileSync("./jassijs.json", 'utf-8');
                var modules = JSON.parse(modultext).modules;
                for (let modul in modules) {
                    try {
                        try {
                            //@ts-ignore
                            delete require.cache[require.resolve(modul + "/registry")];
                        }
                        catch (_a) {
                            //@ts-ignore
                            var s = (require.main["path"] + "/" + modul + "/registry").replaceAll("\\", "/") + ".js";
                            //@ts-ignore
                            delete require.cache[s];
                            //@ts-ignore
                            delete require.cache[s.replaceAll("/", "\\")];
                        }
                        //@ts-ignore
                        var data = (await require.main.require(modul + "/registry")).default;
                        this.initJSONData(data);
                    }
                    catch (_b) {
                        console.error("failed load registry " + modul + "/registry.js");
                    }
                }
            }
            else { //on client
                var all = {};
                var mod = JSON.parse(await (this.loadText("jassijs.json")));
                var modules = mod.modules;
                var myrequire = require;
                if (require.config === undefined) {
                    myrequire = window["serverRequire"];
                    modules = mod.servermodules;
                }
                for (let modul in modules) {
                    if (!modules[modul].endsWith(".js") && modules[modul].indexOf(".js?") === -1)
                        //@ts-ignore
                        myrequire.undef(modul + "/registry");
                    {
                        var m = modul;
                        all[modul] = new Promise((resolve, reject) => {
                            //@ts-ignore
                            myrequire([m + "/registry"], function (ret) {
                                resolve(ret.default);
                            });
                        });
                    }
                }
                for (let modul in modules) {
                    var data = await all[modul];
                    _this.initJSONData(data);
                }
            }
            /* for (let modul in modules) {
            
                        //requirejs.undef("js/"+modul+"/registry.js");
                        all[modul] = fs.readFileSync("./../client/"+modul+"/registry.js", 'utf-8');
                    }
                    for (let modul in modules) {
                        var data = await all[modul].default;
                        _this.initJSONData(data);
                    }
            */
            //var reg = await this.reloadRegistry();
            //_this.initJSONData(reg);
            /*     requirejs.undef("text!../../../../registry.json?bust="+window["jassiversion"]);
             require(["text!../../../../registry.json?bust="+window["jassiversion"]], function(registry){
                 _this.init(registry);
             });*/
        }
        /**
        * loads entries from json string
        * @param {string} json - jsondata
        */
        initJSONData(json) {
            if (json === undefined)
                return;
            var vdata = json;
            for (var file in vdata) {
                var vfiles = vdata[file];
                for (var classname in vfiles) {
                    if (classname === "date")
                        continue;
                    this.jsondata.$Class[classname] = {
                        classname: classname,
                        params: [classname],
                        filename: file
                    };
                    var theclass = vfiles[classname];
                    for (var service in theclass) {
                        if (service === "@members") {
                            //public jsondataMembers: { [service: string]: { [classname: string]: { [membername: string]: any[] } } } = {};
                            var mems = theclass[service];
                            for (let mem in mems) {
                                let scs = mems[mem];
                                for (let sc in scs) {
                                    if (!this.jsondataMembers[sc])
                                        this.jsondataMembers[sc] = {};
                                    if (!this.jsondataMembers[sc][classname])
                                        this.jsondataMembers[sc][classname] = {};
                                    if (this.jsondataMembers[sc][classname][mem] === undefined)
                                        this.jsondataMembers[sc][classname][mem] = [];
                                    this.jsondataMembers[sc][classname][mem].push(scs[sc]);
                                }
                            }
                        }
                        else {
                            if (this.jsondata[service] === undefined)
                                this.jsondata[service] = {};
                            var entr = new JSONDataEntry();
                            entr.params = theclass[service];
                            entr.classname = classname; //vfiles.$Class === undefined ? undefined : vfiles.$Class[0];
                            entr.filename = file;
                            this.jsondata[service][entr.classname] = entr;
                        }
                    }
                }
            }
        }
        /**
         *
         * @param service - the service for which we want informations
         */
        async getJSONData(service, classname = undefined) {
            // if (this.isLoading)
            await this.isLoading;
            /* if (this.jsondata === undefined) {
                 this.isLoading = this.reload();
                 await this.isLoading;
             }
             this.isLoading = undefined;*/
            var ret = [];
            var odata = this.jsondata[service];
            if (odata === undefined)
                return ret;
            if (classname !== undefined)
                return odata[classname] === undefined ? undefined : [odata[classname]];
            for (var clname in odata) {
                if (classname === undefined || classname === clname)
                    ret.push(odata[clname]);
            }
            return ret;
        }
        getAllFilesForService(service, classname = undefined) {
            var data = this.jsondata[service];
            var ret = [];
            for (var clname in data) {
                var test = data[clname];
                if (classname == undefined || test.classname === classname)
                    ret.push(test.filename);
            }
            return ret;
        }
        async loadAllFilesForEntries(entries) {
            var files = [];
            for (let x = 0; x < entries.length; x++) {
                if (files.indexOf(entries[x].filename) === -1)
                    files.push(entries[x].filename);
            }
            await this.loadAllFiles(files);
        }
        /**
         * load all files that registered the service
         * @param {string} service - name of the service
         * @param {function} callback - called when loading is finished
         */
        async loadAllFilesForService(service) {
            var services = this.getAllFilesForService(service);
            await this.loadAllFiles(services);
        }
        /**
         * load all files
         * @param {string} files - the files to load
         */
        async loadAllFiles(files) {
            //   var services = this.getAllFilesForService(service);
            return new Promise((resolve, reject) => {
                var dependency = [];
                for (var x = 0; x < files.length; x++) {
                    var name = files[x];
                    if (name.endsWith(".ts"))
                        name = name.substring(0, name.length - 3);
                    dependency.push(name);
                }
                var req = require;
                req(dependency, function () {
                    resolve(undefined);
                });
            });
        }
    }
    exports.Registry = Registry;
    ;
    var registry = new Registry();
    exports.default = registry;
    function migrateModul(oldModul, newModul) {
        if (newModul.registry) {
            newModul.registry._nextID = oldModul.registry._nextID;
            newModul.registry.entries = oldModul.registry.entries;
        }
    }
    exports.migrateModul = migrateModul;
});
//jassijs.registry=registry;
define("jassijs/remote/RemoteObject", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/RemoteProtocol"], function (require, exports, Registry_11, Classes_6, RemoteProtocol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoteObject = exports.Context = void 0;
    class Context {
    }
    exports.Context = Context;
    let RemoteObject = class RemoteObject {
        static async call(method, ...parameter) {
            if (jassijs.isServer)
                throw new Classes_6.JassiError("should be called on client");
            var prot = new RemoteProtocol_1.RemoteProtocol();
            var context = parameter[parameter.length - 1];
            prot.classname = Classes_6.classes.getClassName(this);
            prot._this = "static";
            prot.parameter = parameter;
            prot.method = method.name;
            prot.parameter.splice(parameter.length - 1, 1);
            var ret;
            if (context === null || context === void 0 ? void 0 : context.transactionitem) {
                ret = await context.transactionitem.transaction.wait(context.transactionitem, prot);
                return ret;
            }
            //let Transaction= (await import("jassijs/remote/Transaction")).Transaction;
            //var trans=Transaction.cache.get(_this);
            //if(trans&&trans[method.name]){
            //	throw "not implemented"
            //	ret=await trans[method.name][0]._push(undefined,prot.method,prot,trans[method.name][1]);
            //}
            ret = await prot.call();
            return ret;
        }
        async call(_this, method, ...parameter) {
            if (jassijs.isServer)
                throw new Classes_6.JassiError("should be called on client");
            var prot = new RemoteProtocol_1.RemoteProtocol();
            var context = parameter[parameter.length - 1];
            prot.classname = Classes_6.classes.getClassName(this);
            prot._this = _this;
            prot.parameter = parameter;
            prot.method = method.name;
            prot.parameter.splice(parameter.length - 1, 1);
            var ret;
            //let context=(await import("jassijs/remote/Context")).Context;
            //let Transaction= (await import("jassijs/remote/Transaction")).Transaction;
            //var trans=Transaction.cache.get(_this);
            //var trans=context.get("transaction");
            if (context === null || context === void 0 ? void 0 : context.transactionitem) {
                ret = await context.transactionitem.transaction.wait(context.transactionitem, prot);
                return ret;
            }
            ret = await prot.call();
            return ret;
        }
    };
    RemoteObject = __decorate([
        (0, Registry_11.$Class)("jassijs.remote.RemoteObject")
    ], RemoteObject);
    exports.RemoteObject = RemoteObject;
});
define("jassijs/remote/RemoteProtocol", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Registry_12, Classes_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoteProtocol = void 0;
    let RemoteProtocol = class RemoteProtocol {
        /**
         * converts object to jsonstring
         * if class is registerd in classes then the class is used
         * if id is used then recursive childs are possible
         * @param obj
         */
        stringify(obj) {
            var ref = [];
            return JSON.stringify(obj, function (key, value) {
                var val = {};
                var clname = value === null ? undefined : Classes_7.classes.getClassName(value);
                var k = clname;
                if (k !== undefined) {
                    val.__clname__ = clname;
                    //if (value.id !== undefined)
                    //	k = k + ":" + (value.id === undefined ? RemoteProtocol.counter++ : value.id);
                    //the object was seen the we save a ref
                    if (ref.indexOf(value) >= 0) {
                        val.__ref__ = ref.indexOf(value);
                    }
                    else {
                        Object.assign(val, value);
                        ref.push(value);
                        val.__refid__ = ref.length - 1;
                    }
                }
                else {
                    val = value;
                }
                return val;
            });
        }
        static async simulateUser(user = undefined, password = undefined) {
            var rights = (await new Promise((resolve_4, reject_4) => { require(["jassijs/remote/security/Rights"], resolve_4, reject_4); })).default;
            //	if(await rights.isAdmin()){
            //		throw new Error("not an admin")
            //	}
            //@ts-ignore
            var Cookies = (await new Promise((resolve_5, reject_5) => { require(["jassijs/util/Cookies"], resolve_5, reject_5); })).Cookies;
            if (user === undefined) {
                Cookies.remove("simulateUser", {});
                Cookies.remove("simulateUserPassword", {});
            }
            else {
                Cookies.set("simulateUser", user, {});
                Cookies.set("simulateUserPassword", password, {});
            }
        }
        async exec(config, object) {
            return await new Promise((resolve, reject) => {
                //@ts-ignore
                var xhr = new XMLHttpRequest();
                xhr.open('POST', config.url, true);
                xhr.setRequestHeader("Content-Type", "text");
                xhr.onload = function (data) {
                    if (this.status === 200)
                        resolve(this.responseText);
                    else
                        reject(this);
                };
                xhr.send(config.data);
                xhr.onerror = function (data) {
                    reject(data);
                };
            });
            //return await $.ajax(config, object);
        }
        /**
       * call the server
       */
        async call() {
            if (jassijs.isServer)
                throw new Classes_7.JassiError("should be called on client");
            var sdataObject = undefined;
            var url = "remoteprotocol?" + Date.now();
            var _this = this;
            var redirect = undefined;
            var config = {
                url: url,
                type: 'post',
                dataType: "text",
                data: this.stringify(this),
            };
            var ret;
            try {
                ret = await this.exec(config, this._this);
            }
            catch (ex) {
                if (ex.status === 401 || (ex.responseText && ex.responseText.indexOf("jwt expired") !== -1)) {
                    redirect = new Promise((resolve) => {
                        //@ts-ignore
                        new Promise((resolve_6, reject_6) => { require(["jassijs/base/LoginDialog"], resolve_6, reject_6); }).then((lib) => {
                            lib.doAfterLogin(resolve, _this);
                        });
                    });
                }
                else {
                    throw ex;
                }
            }
            if (redirect !== undefined)
                return await redirect;
            if (ret === "$$undefined$$")
                return undefined;
            var retval = await this.parse(ret);
            if (retval["**throw error**"] !== undefined) {
                throw new Classes_7.JassiError(retval["**throw error**"]);
            }
            return retval;
        }
        /**
         * converts jsonstring to an object
         */
        async parse(text) {
            var ref = {};
            if (text === undefined)
                return undefined;
            if (text === "")
                return "";
            //first get all classnames	
            var allclassnames = [];
            JSON.parse(text, function (key, value) {
                if (value === null || value === undefined)
                    return value;
                if (value.__clname__ !== null && value.__clname__ !== undefined && allclassnames.indexOf(value.__clname__) === -1) {
                    allclassnames.push(value.__clname__);
                }
                return value;
            });
            //all classes must be loaded
            for (var x = 0; x < allclassnames.length; x++) {
                await Classes_7.classes.loadClass(allclassnames[x]);
            }
            return JSON.parse(text, function (key, value) {
                var val = value;
                if (value === null || value === undefined)
                    return value;
                if (value.__ref__ !== undefined) {
                    val = ref[value.__ref__];
                    if (val === undefined) {
                        //TODO import types from js
                        //create dummy
                        var type = Classes_7.classes.getClass(value.__clname__);
                        //@ts-ignore
                        var test = type._createObject === undefined ? undefined : type._createObject(val);
                        if (test !== undefined)
                            val = test;
                        else
                            val = new type();
                        ref[value.__ref__] = val;
                    }
                }
                else {
                    if (value.__clname__ !== undefined) {
                        if (value.__refid__ !== undefined && ref[value.__refid__] !== undefined) { //there is a dummy
                            val = ref[value.__refid__];
                        }
                        else {
                            //TODO import types from js
                            var type = Classes_7.classes.getClass(value.__clname__);
                            //@ts-ignore
                            var test = type._createObject === undefined ? undefined : type._createObject(value);
                            if (test !== undefined)
                                val = test;
                            else
                                val = new type();
                            if (value.__refid__ !== undefined) {
                                ref[value.__refid__] = val;
                            }
                        }
                        Object.assign(val, value);
                        delete val.__refid__;
                        delete val.__clname__;
                    }
                }
                //Date conversation
                var datepattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
                if (typeof value === 'string') {
                    var a = datepattern.exec(value);
                    if (a)
                        return new Date(value);
                }
                return val;
            });
        }
        async test() {
            var a = new A();
            var b = new B();
            a.b = b;
            a.name = "max";
            a.id = 9;
            b.a = a;
            b.id = 7;
            var s = this.stringify(a);
            var test = await this.parse(s);
        }
    };
    RemoteProtocol.counter = 0;
    RemoteProtocol = __decorate([
        (0, Registry_12.$Class)("jassijs.remote.RemoteProtocol")
    ], RemoteProtocol);
    exports.RemoteProtocol = RemoteProtocol;
    class A {
    }
    //jassijs.register("classes", "de.A", A);
    class B {
    }
});
//jassijs.register("classes", "de.B", B);
//@ts-ignore
define("jassijs/remote/Serverservice", ["require", "exports", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Classes_8, Registry_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runningServerservices = exports.doNotReloadModule = exports.serverservices = exports.$Serverservice = exports.beforeServiceLoad = exports.ServerserviceProperties = void 0;
    class ServerserviceProperties {
    }
    exports.ServerserviceProperties = ServerserviceProperties;
    var runningServerservices = {};
    exports.runningServerservices = runningServerservices;
    var beforeServiceLoadHandler = [];
    function beforeServiceLoad(func) {
        beforeServiceLoadHandler.push(func);
    }
    exports.beforeServiceLoad = beforeServiceLoad;
    var serverservices = new Proxy(runningServerservices, {
        get(target, prop, receiver) {
            return new Promise(async (resolve, reject) => {
                var khsdf = runningServerservices;
                if (target[prop]) {
                    resolve(target[prop]);
                }
                else {
                    var all = await Registry_13.default.getJSONData("$Serverservice");
                    for (var x = 0; x < all.length; x++) {
                        var serv = all[x];
                        var name = serv.params[0].name;
                        if (name === prop) {
                            var classname = serv.classname;
                            var cl = await Registry_13.default.getJSONData("$Class", classname);
                            //@ts-ignore
                            if (require.main) { //nodes load project class from module
                                /*for (var jfile in require.cache) {
                                    if(jfile.replaceAll("\\","/").endsWith(serv.filename.substring(0,serv.filename.length-2)+"js")){
                                        delete require.cache[jfile];
                                    }
                                }*/
                                //@ts-ignore
                                await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                            }
                            else {
                                Classes_8.classes.loadClass(classname); //await import(classname.replaceAll(".", "/"));
                            }
                            var props = Registry_13.default.getData("$Serverservice", classname)[0].params[0];
                            for (var x = 0; x < beforeServiceLoadHandler.length; x++) {
                                await beforeServiceLoadHandler[x](prop, props);
                            }
                            var instance = props.getInstance();
                            target[prop] = instance;
                            resolve(instance);
                            return;
                        }
                    }
                }
                reject("serverservice not found:" + prop);
            });
        }
    });
    exports.serverservices = serverservices;
    function $Serverservice(properties) {
        return function (pclass) {
            Registry_13.default.register("$Serverservice", pclass, properties);
        };
    }
    exports.$Serverservice = $Serverservice;
    var doNotReloadModule = true;
    exports.doNotReloadModule = doNotReloadModule;
});
define("jassijs/remote/Server", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/FileNode", "jassijs/remote/Classes", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, Registry_14, RemoteObject_3, FileNode_1, Classes_9, Serverservice_3, Validator_3) {
    "use strict";
    var Server_1;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Server = void 0;
    let Server = Server_1 = class Server extends RemoteObject_3.RemoteObject {
        constructor() {
            super();
        }
        _convertFileNode(node) {
            var ret = new FileNode_1.FileNode();
            Object.assign(ret, node);
            if (ret.files !== undefined) {
                for (let x = 0; x < ret.files.length; x++) {
                    ret.files[x].parent = ret;
                    var s = ret.fullpath === undefined ? "" : ret.fullpath;
                    ret.files[x].fullpath = s + (s === "" ? "" : "/") + ret.files[x].name;
                    ret.files[x] = this._convertFileNode(ret.files[x]);
                }
            }
            return ret;
        }
        async fillFilesInMapIfNeeded() {
            var _a, _b, _c, _d, _e, _f;
            if (Server_1.filesInMap)
                return;
            var ret = {};
            for (var mod in jassijs.modules) {
                if ((_b = (_a = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _a === void 0 ? void 0 : _a.Server) === null || _b === void 0 ? void 0 : _b.filterModulInFilemap) {
                    if (((_d = (_c = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _c === void 0 ? void 0 : _c.Server) === null || _d === void 0 ? void 0 : _d.filterModulInFilemap.indexOf(mod)) === -1)
                        continue;
                }
                if (jassijs.modules[mod].endsWith(".js") || jassijs.modules[mod].indexOf(".js?") > -1) {
                    let mapname = jassijs.modules[mod].split("?")[0] + ".map";
                    if (jassijs.modules[mod].indexOf(".js?") > -1)
                        mapname = mapname + "?" + jassijs.modules[mod].split("?")[1];
                    var code = await $.ajax({ url: mapname, dataType: "text" });
                    var data = JSON.parse(code);
                    var files = data.sources;
                    for (let x = 0; x < files.length; x++) {
                        let fname = files[x].substring(files[x].indexOf(mod + "/"));
                        if (((_f = (_e = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _e === void 0 ? void 0 : _e.Server) === null || _f === void 0 ? void 0 : _f.filterSytemfilesInFilemap) === true) {
                            if (fname.endsWith("/modul.js") || fname.endsWith("/registry.js"))
                                continue;
                        }
                        if (fname.endsWith)
                            ret[fname] = {
                                id: x,
                                modul: mod
                            };
                    }
                }
            }
            Server_1.filesInMap = ret;
        }
        async addFilesFromMap(root) {
            await this.fillFilesInMapIfNeeded();
            for (var fname in Server_1.filesInMap) {
                let path = fname.split("/");
                var parent = root;
                for (let p = 0; p < path.length; p++) {
                    if (p + 1 < path.length) {
                        let dirname = path[p];
                        var found = undefined;
                        for (let f = 0; f < parent.files.length; f++) {
                            if (parent.files[f].name === dirname)
                                found = parent.files[f];
                        }
                        if (!found) {
                            found = {
                                flag: "fromMap",
                                name: dirname,
                                files: []
                            };
                            parent.files.push(found);
                        }
                        parent = found;
                    }
                    else {
                        parent.files.push({
                            flag: "fromMap",
                            name: path[p],
                            date: undefined
                        });
                    }
                }
            }
        }
        /**
        * gets alls ts/js-files from server
        * @param {Promise<string>} [async] - returns a Promise for asynchros handling
        * @returns {string[]} - list of files
        */
        async dir(withDate = false, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret;
                if ((await Server_1.isOnline(context)) === true)
                    ret = await this.call(this, this.dir, withDate, context);
                else
                    ret = { name: "", files: [] };
                await this.addFilesFromMap(ret);
                ret.fullpath = ""; //root
                let r = this._convertFileNode(ret);
                return r;
            }
            else {
                var rett = (await Serverservice_3.serverservices.filesystem).dir("", withDate);
                return rett;
                // return ["jassijs/base/ChromeDebugger.ts"];
            }
        }
        async zip(directoryname, serverdir = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.zip, directoryname, serverdir, context);
            }
            else {
                return (await Serverservice_3.serverservices.filesystem).zip(directoryname, serverdir);
                // return ["jassijs/base/ChromeDebugger.ts"];
            }
        }
        /**
         * gets the content of a file from server
         * @param {string} fileNamew
         * @returns {string} content of the file
         */
        async loadFiles(fileNames, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.loadFiles, fileNames, context);
            }
            else {
                return (await Serverservice_3.serverservices.filesystem).loadFiles(fileNames);
                // return ["jassijs/base/ChromeDebugger.ts"];
            }
        }
        /**
         * gets the content of a file from server
         * @param {string} fileName
         * @returns {string} content of the file
         */
        async loadFile(fileName, context = undefined) {
            var fromServerdirectory = fileName.startsWith("$serverside/");
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                await this.fillFilesInMapIfNeeded();
                if (!fromServerdirectory && Server_1.filesInMap[fileName]) {
                    //perhabs the files ar in localserver?
                    var Filesystem = Classes_9.classes.getClass("jassijs_localserver.Filesystem");
                    if (Filesystem && (await new Filesystem().loadFileEntry(fileName) !== undefined)) {
                        //use ajax
                    }
                    else {
                        var found = Server_1.filesInMap[fileName];
                        let mapname = jassijs.modules[found.modul].split("?")[0] + ".map";
                        if (jassijs.modules[found.modul].indexOf(".js?") > -1)
                            mapname = mapname + "?" + jassijs.modules[found.modul].split("?")[1];
                        var code = await this.loadFile(mapname, context);
                        var data = JSON.parse(code).sourcesContent[found.id];
                        return data;
                    }
                }
                if (fromServerdirectory) {
                    return await this.call(this, this.loadFile, fileName, context);
                }
                else
                    return $.ajax({ url: fileName, dataType: "text" });
                //return await this.call(this,"loadFile", fileName);
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_9.JassiError("only admins can loadFile from Serverdirectory");
                var rett = await (await Serverservice_3.serverservices.filesystem).loadFile(fileName);
                return rett;
            }
        }
        /**
        * put the content to a file
        * @param [{string}] fileNames - the name of the file
        * @param [{string}] contents
        */
        async saveFiles(fileNames, contents, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var allfileNames = [];
                var allcontents = [];
                var alltsfiles = [];
                for (var f = 0; f < fileNames.length; f++) {
                    var _this = this;
                    var fileName = fileNames[f];
                    var content = contents[f];
                    if (!fileName.startsWith("$serverside/") && (fileName.endsWith(".ts") || fileName.endsWith(".js"))) {
                        //var tss = await import("jassijs_editor/util/Typescript");
                        var tss = await Classes_9.classes.loadClass("jassijs_editor.util.Typescript");
                        var rets = await tss.instance.transpile(fileName, content);
                        allfileNames = allfileNames.concat(rets.fileNames);
                        allcontents = allcontents.concat(rets.contents);
                        alltsfiles.push(fileName);
                    }
                    else {
                        allfileNames.push(fileName);
                        allcontents.push(content);
                    }
                }
                var res = await this.call(this, this.saveFiles, allfileNames, allcontents, context);
                if (res === "") {
                    //@ts-ignore
                    new Promise((resolve_7, reject_7) => { require(["jassijs/ui/Notify"], resolve_7, reject_7); }).then((el) => {
                        el.notify(fileName + " saved", "info", { position: "bottom right" });
                    });
                    //if (!fromServerdirectory) {
                    for (var x = 0; x < alltsfiles.length; x++) {
                        await $.ajax({ url: alltsfiles[x], dataType: "text" });
                    }
                    // }
                }
                else {
                    //@ts-ignore
                    new Promise((resolve_8, reject_8) => { require(["jassijs/ui/Notify"], resolve_8, reject_8); }).then((el) => {
                        el.notify(fileName + " not saved", "error", { position: "bottom right" });
                    });
                    throw new Classes_9.JassiError(res);
                }
                return res;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_9.JassiError("only admins can saveFiles");
                var ret = (await Serverservice_3.serverservices.filesystem).saveFiles(fileNames, contents, true);
                return ret;
            }
        }
        /**
        * put the content to a file
        * @param {string} fileName - the name of the file
        * @param {string} content
        */
        async saveFile(fileName, content, context = undefined) {
            /*await this.fillFilesInMapIfNeeded();
            if (Server.filesInMap[fileName]) {
                //@ts-ignore
                 notify(fileName + " could not be saved on server", "error", { position: "bottom right" });
                return;
            }*/
            return await this.saveFiles([fileName], [content], context);
        }
        /**
       * deletes a server modul
       **/
        async testServersideFile(name, context = undefined) {
            if (!name.startsWith("$serverside/"))
                throw new Classes_9.JassiError(name + " is not a serverside file");
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.testServersideFile, name, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin) {
                    throw new Classes_9.JassiError("only admins can delete");
                }
                //@ts-ignore
                var test = (await new Promise((resolve_9, reject_9) => { require([name.replaceAll("$serverside/", "")], resolve_9, reject_9); })).test;
                if (test)
                    Server_1.lastTestServersideFileResult = await test();
                return Server_1.lastTestServersideFileResult;
            }
        }
        /**
       * deletes a server modul
       **/
        async removeServerModul(name, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.removeServerModul, name, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_9.JassiError("only admins can delete");
                return (await Serverservice_3.serverservices.filesystem).removeServerModul(name);
            }
        }
        /**
        * deletes a file or directory
        **/
        async delete(name, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.delete, name, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_9.JassiError("only admins can delete");
                return (await Serverservice_3.serverservices.filesystem).remove(name);
            }
        }
        /**
         * renames a file or directory
         **/
        async rename(oldname, newname, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.rename, oldname, newname, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_9.JassiError("only admins can rename");
                return (await Serverservice_3.serverservices.filesystem).rename(oldname, newname);
                ;
            }
        }
        /**
        * is the nodes server running
        **/
        static async isOnline(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                //no serviceworker no serverside implementation
                if (navigator.serviceWorker.controller === null)
                    return false;
                try {
                    if (this.isonline === undefined)
                        Server_1.isonline = await this.call(this.isOnline, context);
                    return await Server_1.isonline;
                }
                catch (_a) {
                    return false;
                }
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            }
            else {
                return true;
            }
        }
        /**
         * creates a file
         **/
        async createFile(filename, content, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.createFile, filename, content, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_9.JassiError("only admins can createFile");
                return (await Serverservice_3.serverservices.filesystem).createFile(filename, content);
            }
        }
        /**
        * creates a file
        **/
        async createFolder(foldername, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.createFolder, foldername, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_9.JassiError("only admins can createFolder");
                return (await Serverservice_3.serverservices.filesystem).createFolder(foldername);
            }
        }
        async createModule(modulname, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.createModule, modulname, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                if (!context.request.user.isAdmin)
                    throw new Classes_9.JassiError("only admins can createFolder");
                return (await Serverservice_3.serverservices.filesystem).createModule(modulname);
            }
        }
        static async mytest(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.mytest, context);
            }
            else
                return 14; //this is called on server
        }
    };
    Server.isonline = undefined;
    Server.lastTestServersideFileResult = undefined;
    //files found in js.map of modules in the jassijs.json
    Server.filesInMap = undefined;
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsBoolean)({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Boolean, typeof (_a = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "dir", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsString)()),
        __param(1, (0, Validator_3.ValidateIsBoolean)({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Boolean, typeof (_b = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _b : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "zip", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsArray)({ type: tp => String })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, typeof (_c = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _c : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "loadFiles", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_d = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _d : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "loadFile", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsArray)({ type: type => String })),
        __param(1, (0, Validator_3.ValidateIsArray)({ type: type => String })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Array, typeof (_e = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _e : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "saveFiles", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsString)()),
        __param(1, (0, Validator_3.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_f = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _f : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "saveFile", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_g = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _g : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "testServersideFile", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_h = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _h : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "removeServerModul", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_j = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _j : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "delete", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsString)()),
        __param(1, (0, Validator_3.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_k = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _k : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "rename", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_l = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _l : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "createFile", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_m = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _m : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "createFolder", null);
    __decorate([
        (0, Validator_3.ValidateFunctionParameter)(),
        __param(0, (0, Validator_3.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_o = typeof RemoteObject_3.Context !== "undefined" && RemoteObject_3.Context) === "function" ? _o : Object]),
        __metadata("design:returntype", Promise)
    ], Server.prototype, "createModule", null);
    Server = Server_1 = __decorate([
        (0, Registry_14.$Class)("jassijs.remote.Server"),
        __metadata("design:paramtypes", [])
    ], Server);
    exports.Server = Server;
});
define("jassijs/remote/Test", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Test = void 0;
    let Test = class Test {
        /**
         * fails if the condition is false
         * @parameter condition
         **/
        expectEqual(condition) {
            if (!condition)
                throw new Error("Test fails");
        }
        /**
         * fails if the func does not throw an error
         * @parameter func - the function that should failed
         **/
        expectError(func) {
            try {
                if (func.toString().startsWith("async ")) {
                    var errobj;
                    try {
                        throw new Error("test fails");
                    }
                    catch (err) {
                        errobj = err;
                    }
                    func().then(() => {
                        throw errobj;
                    }).catch((err) => {
                        if (err.message === "test fails")
                            throw errobj;
                        var k = 1; //io
                    });
                    return;
                }
                else {
                    func();
                }
            }
            catch (_a) {
                return; //io
            }
            throw new Error("test fails");
        }
        /**
        * fails if the func does not throw an error
        * @parameter func - the function that should failed
        **/
        async expectErrorAsync(func) {
            var errors = false;
            try {
                var errobj;
                await func().then((e) => {
                }).catch((e) => {
                    errors = true;
                });
            }
            catch (_a) {
                errors = true;
            }
            if (!errors)
                throw new Error("test fails");
        }
    };
    Test = __decorate([
        (0, Registry_15.$Class)("jassijs.remote.Test")
    ], Test);
    exports.Test = Test;
});
define("jassijs/remote/Settings", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/security/Setting", "jassijs/remote/Server", "jassijs/remote/Serverservice", "jassijs/remote/Validator"], function (require, exports, Registry_16, Registry_17, RemoteObject_4, Setting_1, Server_2, Serverservice_4, Validator_4) {
    "use strict";
    var Settings_1;
    var _a, _b, _c, _d;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.load = exports.test = exports.autostart = exports.$SettingsDescriptor = exports.settings = exports.Settings = void 0;
    const proxyhandler = {
        get: function (target, prop, receiver) {
            return prop;
        }
    };
    let Settings = Settings_1 = class Settings extends RemoteObject_4.RemoteObject {
        /**
        * loads the settings
        */
        static async load(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                //browser
                let entr = window.localStorage.getItem("jassijs.settings");
                if (entr) {
                    Settings_1.browserSettings = JSON.parse(entr);
                }
                else
                    Settings_1.browserSettings = {};
                var all = (await Server_2.Server.isOnline() === false) ? undefined : await this.call(this.load, context);
                if (all === null || all === void 0 ? void 0 : all.user) {
                    Settings_1.userSettings = JSON.parse(all.user.data);
                }
                else
                    Settings_1.userSettings = {};
                if (all === null || all === void 0 ? void 0 : all.allusers) {
                    Settings_1.allusersSettings = JSON.parse(all.allusers.data);
                }
                else
                    Settings_1.allusersSettings = {};
            }
            else {
                //@ts-ignore
                var man = await Serverservice_4.serverservices.db;
                var id = context.request.user.user;
                return {
                    user: await man.findOne(context, Setting_1.Setting, { "id": 1 }),
                    allusers: await man.findOne(context, Setting_1.Setting, { "id": 0 }),
                };
            }
        }
        static getAll(scope) {
            var ret = {};
            if (scope === "browser") {
                Object.assign(ret, Settings_1.browserSettings);
            }
            if (scope === "user") {
                Object.assign(ret, Settings_1.userSettings);
            }
            if (scope === "allusers") {
                Object.assign(ret, Settings_1.allusersSettings);
            }
            return ret;
        }
        gets(Settings_key) {
            if (Settings_1.browserSettings && Settings_1.browserSettings[Settings_key])
                return Settings_1.browserSettings[Settings_key];
            if (Settings_1.userSettings && Settings_1.userSettings[Settings_key])
                return Settings_1.userSettings[Settings_key];
            if (Settings_1.allusersSettings && Settings_1.allusersSettings[Settings_key])
                return Settings_1.allusersSettings[Settings_key];
            return undefined;
        }
        static async remove(Settings_key, scope, context = undefined) {
            if (scope === "browser") {
                delete Settings_1.browserSettings[Settings_key];
                window.localStorage.setItem("jassijs.settings", JSON.stringify(Settings_1.browserSettings));
            }
            if (scope === "user" || scope === "allusers") {
                if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                    if (scope == "user" && Settings_1.userSettings)
                        delete Settings_1.userSettings[Settings_key];
                    if (scope == "allusers" && Settings_1.allusersSettings)
                        delete Settings_1.allusersSettings[Settings_key];
                    this.call(this.remove, Settings_key, scope, context);
                }
                else {
                    //@ts-ignore
                    var man = await Serverservice_4.serverservices.db;
                    var id = context.request.user.user;
                    //first load
                    let entr = await man.findOne(context, Setting_1.Setting, { "id": (scope === "user" ? id : 0) });
                    if (entr !== undefined) {
                        var data = JSON.parse(entr.data);
                        delete data[Settings_key];
                        entr.data = JSON.stringify(data);
                        await man.save(context, entr);
                    }
                }
            }
        }
        static async save(Settings_key, value, scope) {
            let ob = {};
            //@ts-ignore
            ob[Settings_key] = value;
            return await this.saveAll(ob, scope);
        }
        static async saveAll(namevaluepair, scope, removeOtherKeys = false, context = undefined) {
            if (scope === "browser") {
                let entr = window.localStorage.getItem("jassijs.settings");
                var data = namevaluepair;
                if (entr) {
                    data = JSON.parse(entr);
                    Object.assign(data, namevaluepair);
                }
                if (removeOtherKeys)
                    data = namevaluepair;
                window.localStorage.setItem("jassijs.settings", JSON.stringify(data));
                if (removeOtherKeys)
                    Settings_1.browserSettings = {};
                Object.assign(Settings_1.browserSettings, namevaluepair);
            }
            if (scope === "user" || scope === "allusers") {
                if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                    var props = {};
                    Object.assign(props, namevaluepair);
                    if (scope == "user" && Settings_1.userSettings) {
                        if (removeOtherKeys)
                            Settings_1.userSettings = {};
                        Object.assign(Settings_1.userSettings, namevaluepair);
                    }
                    if (scope == "allusers" && Settings_1.allusersSettings) {
                        if (removeOtherKeys)
                            Settings_1.allusersSettings = {};
                        Object.assign(Settings_1.allusersSettings, namevaluepair);
                    }
                    return await this.call(this.saveAll, props, scope, removeOtherKeys, context);
                }
                else {
                    //@ts-ignore
                    var man = await Serverservice_4.serverservices.db;
                    var id = context.request.user.user;
                    //first load
                    let entr = await man.findOne(context, Setting_1.Setting, { "id": (scope === "user" ? id : 0) });
                    var data = namevaluepair;
                    if (removeOtherKeys !== true) {
                        if (entr !== undefined) {
                            data = JSON.parse(entr.data);
                            Object.assign(data, namevaluepair);
                        }
                    }
                    var newsetting = new Setting_1.Setting();
                    newsetting.id = (scope === "user" ? id : 0);
                    newsetting.data = JSON.stringify(data);
                    return await man.save(context, newsetting);
                    //return man.find(context, this, { "id": "admin" });
                }
            }
        }
    };
    Settings.keys = new Proxy({}, proxyhandler); //the Proxy allwas give the key back
    Settings.browserSettings = undefined;
    Settings.userSettings = undefined;
    Settings.allusersSettings = undefined;
    __decorate([
        (0, Validator_4.ValidateFunctionParameter)(),
        __param(0, (0, Validator_4.ValidateIsString)()),
        __param(1, (0, Validator_4.ValidateIsIn)({ in: ["browser", "user", "allusers"] })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, typeof (_a = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], Settings, "remove", null);
    __decorate([
        (0, Validator_4.ValidateFunctionParameter)(),
        __param(0, (0, Validator_4.ValidateIsString)()),
        __param(2, (0, Validator_4.ValidateIsIn)({ in: ["browser", "user", "allusers"] })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_b = typeof T !== "undefined" && T) === "function" ? _b : Object, typeof (_c = typeof T !== "undefined" && T) === "function" ? _c : Object, String]),
        __metadata("design:returntype", Promise)
    ], Settings, "save", null);
    __decorate([
        (0, Validator_4.ValidateFunctionParameter)(),
        __param(1, (0, Validator_4.ValidateIsIn)({ in: ["browser", "user", "allusers"] })),
        __param(2, (0, Validator_4.ValidateIsBoolean)({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String, Object, typeof (_d = typeof RemoteObject_4.Context !== "undefined" && RemoteObject_4.Context) === "function" ? _d : Object]),
        __metadata("design:returntype", Promise)
    ], Settings, "saveAll", null);
    Settings = Settings_1 = __decorate([
        (0, Registry_16.$Class)("jassijs.remote.Settings")
    ], Settings);
    exports.Settings = Settings;
    var settings = new Settings();
    exports.settings = settings;
    function $SettingsDescriptor() {
        return function (pclass) {
            Registry_17.default.register("$SettingsDescriptor", pclass);
        };
    }
    exports.$SettingsDescriptor = $SettingsDescriptor;
    async function autostart() {
        await Settings.load();
    }
    exports.autostart = autostart;
    async function test(t) {
        try {
            await Settings.load();
            var settings = new Settings();
            await Settings.remove("antestsetting", "user");
            await Settings.remove("antestsetting", "browser");
            await Settings.remove("antestsetting", "allusers");
            t.expectEqual(settings.gets("antestsetting") === undefined);
            await Settings.load();
            t.expectEqual(settings.gets("antestsetting") === undefined);
            await Settings.save("antestsetting", "1", "allusers");
            t.expectEqual(settings.gets("antestsetting") === "1");
            await Settings.load();
            t.expectEqual(settings.gets("antestsetting") === "1");
            await Settings.save("antestsetting", "2", "user");
            t.expectEqual(settings.gets("antestsetting") === "2");
            await Settings.load();
            t.expectEqual(settings.gets("antestsetting") === "2");
            await Settings.save("antestsetting", "3", "browser");
            t.expectEqual(settings.gets("antestsetting") === "3");
            await Settings.load();
            t.expectEqual(settings.gets("antestsetting") === "3");
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await Settings.remove("antestsetting", "user");
            await Settings.remove("antestsetting", "browser");
            await Settings.remove("antestsetting", "allusers");
        }
    }
    exports.test = test;
    async function load() {
        return Settings.load();
    }
    exports.load = load;
});
define("jassijs/remote/Transaction", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject"], function (require, exports, Registry_18, RemoteObject_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transaction = exports.TransactionItem = void 0;
    //var serversession;
    class TransactionItem {
        constructor() {
            this.result = "**unresolved**";
        }
    }
    exports.TransactionItem = TransactionItem;
    let Transaction = class Transaction extends RemoteObject_5.RemoteObject {
        constructor() {
            super(...arguments);
            this.statements = [];
            this.context = new RemoteObject_5.Context();
        }
        async execute() {
            //  return this.context.register("transaction", this, async () => {
            for (var x = 0; x < this.statements.length; x++) {
                var it = this.statements[x];
                var context = {
                    isServer: false,
                    transaction: this,
                    transactionitem: it
                };
                it.promise = it.obj[it.method.name](...it.params, context);
                it.promise.then((val) => {
                    it.result = val; //promise returned or resolved out of Transaction
                });
            }
            let _this = this;
            await new Promise((res) => {
                _this.ready = res;
            });
            var ret = [];
            for (let x = 0; x < this.statements.length; x++) {
                var res = await this.statements[x].promise;
                ret.push(res);
            }
            return ret;
            //  });
        }
        async wait(transactionItem, prot) {
            transactionItem.remoteProtocol = prot;
            //if all transactions are placed then do the request
            var foundUnplaced = false;
            for (let x = 0; x < this.statements.length; x++) {
                let it = this.statements[x];
                if (it.result === "**unresolved**" && it.remoteProtocol === undefined)
                    foundUnplaced = true;
            }
            if (foundUnplaced === false) {
                this.sendRequest();
            }
            let _this = this;
            return new Promise((res) => {
                transactionItem.resolve = res;
            }); //await this.statements[id].result;//wait for result - comes with Request
        }
        async sendRequest(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var prots = [];
                for (let x = 0; x < this.statements.length; x++) {
                    let st = this.statements[x];
                    if (st.result !== "**unresolved**")
                        prots.push(undefined);
                    else
                        prots.push(st.remoteProtocol.stringify(st.remoteProtocol));
                }
                var sic = this.statements;
                this.statements = prots;
                var ret = await this.call(this, this.sendRequest, context);
                this.statements = sic;
                for (let x = 0; x < this.statements.length; x++) {
                    this.statements[x].resolve(ret[x]);
                }
                this.ready();
                //ret is not what we want - perhaps there is a modification
                /* let ret2=[];
                 for(let x=0;x<this.statements.length;x++){
                     ret2.push(await this.statements[x].promise);
                 }
                 this.resolve(ret);*/
                return true;
            }
            else {
                //@ts-ignore
                //@ts-ignore
                var ObjectTransaction = (await new Promise((resolve_10, reject_10) => { require(["jassijs/remote/ObjectTransaction"], resolve_10, reject_10); })).ObjectTransaction;
                var ot = new ObjectTransaction();
                ot.statements = [];
                let ret = [];
                for (let x = 0; x < this.statements.length; x++) {
                    var stat = {
                        result: "**unresolved**"
                    };
                    ot.statements.push(stat);
                }
                for (let x = 0; x < this.statements.length; x++) {
                    ret.push(this.doServerStatement(this.statements, ot, x, context));
                }
                for (let x = 0; x < ret.length; x++) {
                    ret[x] = await ret[x];
                }
                return ret;
            }
        }
        async doServerStatement(statements, ot /*:ObjectTransaction*/, num, context) {
            //@ts-ignore
            var _execute = (await new Promise((resolve_11, reject_11) => { require(["jassijs/server/DoRemoteProtocol"], resolve_11, reject_11); }))._execute;
            var _this = this;
            var newcontext = {};
            Object.assign(newcontext, context);
            newcontext.objecttransaction = ot;
            newcontext.objecttransactionitem = ot.statements[num];
            //@ts-ignore
            ot.statements[num].result = _execute(_this.statements[num], context.request, newcontext);
            return ot.statements[num].result;
        }
        add(obj, method, ...params) {
            var ti = new TransactionItem();
            ti.method = method;
            ti.obj = obj;
            ti.params = params;
            ti.transaction = this;
            this.statements.push(ti);
        }
    };
    Transaction = __decorate([
        (0, Registry_18.$Class)("jassijs.remote.Transaction")
    ], Transaction);
    exports.Transaction = Transaction;
});
define("jassijs/remote/Validator", ["require", "exports", "reflect-metadata"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ValidateIsString = exports.ValidationIsStringOptions = exports.ValidateIsNumber = exports.ValidationIsNumberOptions = exports.ValidateMin = exports.ValidationMinOptions = exports.ValidateMax = exports.ValidationMaxOptions = exports.ValidateIsInt = exports.ValidationIsIntOptions = exports.ValidateIsInstanceOf = exports.ValidationIsInstanceOfOptions = exports.ValidateIsIn = exports.ValidationIsInOptions = exports.ValidateFunctionParameter = exports.ValidateIsDate = exports.ValidationIsDateOptions = exports.ValidateIsBoolean = exports.ValidationIsBooleanOptions = exports.ValidateIsArray = exports.ValidationIsArrayOptions = exports.validate = exports.ValidationError = exports.registerValidation = exports.ValidationOptions = void 0;
    const paramMetadataKey = Symbol("paramMetadataKey");
    class ValidationOptions {
    }
    exports.ValidationOptions = ValidationOptions;
    function registerValidation(name, options, func) {
        return (target, propertyKey, parameterIndex) => {
            //@ts-ignore
            let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) || {};
            if (params[parameterIndex] === undefined)
                params[parameterIndex] = {};
            params[parameterIndex][name] = {
                func,
                options
            };
            //@ts-ignore
            Reflect.defineMetadata(paramMetadataKey, params, target, propertyKey);
        };
    }
    exports.registerValidation = registerValidation;
    function translateMessage(msg, rule, property, target, value, options) {
        if (msg === undefined)
            return undefined;
        var ret = (options === null || options === void 0 ? void 0 : options.message) ? options === null || options === void 0 ? void 0 : options.message : msg;
        ret = ret.replaceAll("{rule}", rule).replaceAll("{property}", property).replaceAll("{target}", target).replaceAll("{value}", value);
        if (options) {
            for (var key in options) {
                ret = ret.replaceAll("{" + key + "}", options[key]);
            }
        }
        return ret;
    }
    class ValidationError {
        constructor(value, target, property, message) {
            this.value = value;
            this.target = target;
            this.property = property;
            this.message = message;
        }
    }
    exports.ValidationError = ValidationError;
    class ValidateOptions {
    }
    function validate(obj, options = undefined, raiseError = undefined) {
        var _a, _b;
        var ret = [];
        var target = obj.__proto__;
        for (var propertyName in obj) {
            //@ts-ignore
            let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyName);
            if (params) {
                for (var p in params) {
                    for (var rule in params[p]) {
                        //@ts-ignore
                        var val = obj[propertyName];
                        var func = params[p][rule].func;
                        var opts = Object.assign({}, params[p][rule].options);
                        if ((_a = options === null || options === void 0 ? void 0 : options.delegateOptions) === null || _a === void 0 ? void 0 : _a.ALL) {
                            opts = Object.assign(opts, (_b = options === null || options === void 0 ? void 0 : options.delegateOptions) === null || _b === void 0 ? void 0 : _b.ALL);
                        }
                        if ((options === null || options === void 0 ? void 0 : options.delegateOptions) && (options === null || options === void 0 ? void 0 : options.delegateOptions[rule])) {
                            opts = Object.assign(opts, options === null || options === void 0 ? void 0 : options.delegateOptions[rule]);
                        }
                        var err = func(target, propertyName, val, opts);
                        var test = translateMessage(err, rule, propertyName, obj, val, params[p][rule].options);
                        if (test !== undefined)
                            ret.push(new ValidationError(val, target, propertyName, test));
                    }
                }
            }
        }
        if (raiseError && ret.length > 0) {
            var sret = [];
            ret.forEach((err) => sret.push("ValidationError " + err.property + ": " + err.message));
            throw new Error(sret.join("\r\n"));
        }
        return ret;
    }
    exports.validate = validate;
    class ValidationIsArrayOptions extends ValidationOptions {
    }
    exports.ValidationIsArrayOptions = ValidationIsArrayOptions;
    function ValidateIsArray(options) {
        return registerValidation("ValidateIsArray", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (!Array.isArray(val))
                return "value {value} is not an array";
            if (options === null || options === void 0 ? void 0 : options.type) {
                for (var x = 0; x < val.length; x++) {
                    var tp = options.type();
                    if (val[x] !== undefined && !(val[x] instanceof tp)) {
                        if (typeof val[x] === 'string' && tp == String)
                            continue;
                        if (typeof val[x] === 'number' && tp == Number)
                            continue;
                        if (typeof val[x] === 'boolean' && tp == Boolean)
                            continue;
                        if (options === null || options === void 0 ? void 0 : options.alternativeJsonProperties) {
                            for (var x = 0; x < options.alternativeJsonProperties.length; x++) {
                                var key = options.alternativeJsonProperties[x];
                                if (val[x][key] === undefined)
                                    return propertyName + " is not array of type " + tp.name;
                            }
                        }
                        else
                            return "value {value} is not an array ot type " + tp.name;
                    }
                }
            }
        });
    }
    exports.ValidateIsArray = ValidateIsArray;
    class ValidationIsBooleanOptions extends ValidationOptions {
    }
    exports.ValidationIsBooleanOptions = ValidationIsBooleanOptions;
    function ValidateIsBoolean(options) {
        return registerValidation("ValidateIsBoolean", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (typeof val !== 'boolean')
                return propertyName + " is not a Boolean";
        });
    }
    exports.ValidateIsBoolean = ValidateIsBoolean;
    class ValidationIsDateOptions extends ValidationOptions {
    }
    exports.ValidationIsDateOptions = ValidationIsDateOptions;
    function ValidateIsDate(options) {
        return registerValidation("ValidateIsDate", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (!(val instanceof Date && !isNaN(val.valueOf())))
                return propertyName + " is not a date";
        });
    }
    exports.ValidateIsDate = ValidateIsDate;
    function ValidateFunctionParameter() {
        return (target, propertyName, descriptor, options) => {
            let method = descriptor.value;
            if (method === undefined)
                throw new Error("sdfgsdfgsfd");
            const funcname = method.name;
            const { [funcname]: newfunc } = {
                [funcname]: function () {
                    //@ts-ignore
                    let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyName);
                    if (params) {
                        for (var p in params) {
                            for (var rule in params[p]) {
                                //@ts-ignore
                                var arg = (p > arguments.length) ? undefined : arguments[p];
                                var val = arguments[p];
                                var func = params[p][rule].func;
                                var opt = params[p][rule].options;
                                var err = func(target, "parameter " + p, val, opt);
                                var test = translateMessage(err, rule, propertyName, target, val, params[p][rule].options);
                                if (test !== undefined)
                                    throw new Error(test);
                            }
                        }
                    }
                    return method.apply(this, arguments);
                }
            };
            descriptor.value = newfunc;
        };
    }
    exports.ValidateFunctionParameter = ValidateFunctionParameter;
    class ValidationIsInOptions extends ValidationOptions {
    }
    exports.ValidationIsInOptions = ValidationIsInOptions;
    function ValidateIsIn(options) {
        return registerValidation("ValidateIsIn", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (options.in.indexOf(val) === -1)
                return propertyName + " is not valid";
        });
    }
    exports.ValidateIsIn = ValidateIsIn;
    class ValidationIsInstanceOfOptions extends ValidationOptions {
    }
    exports.ValidationIsInstanceOfOptions = ValidationIsInstanceOfOptions;
    function ValidateIsInstanceOf(options) {
        return registerValidation("ValidateIsInstanceOf", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            var tp = options.type();
            if (!(val instanceof tp)) {
                if (options === null || options === void 0 ? void 0 : options.alternativeJsonProperties) {
                    for (var x = 0; x < options.alternativeJsonProperties.length; x++) {
                        var key = options.alternativeJsonProperties[x];
                        if (val[key] === undefined)
                            return propertyName + " is not of type " + tp.name;
                    }
                }
                else
                    return propertyName + " is not of type " + tp.name;
            }
        });
    }
    exports.ValidateIsInstanceOf = ValidateIsInstanceOf;
    class ValidationIsIntOptions extends ValidationOptions {
    }
    exports.ValidationIsIntOptions = ValidationIsIntOptions;
    function ValidateIsInt(options) {
        return registerValidation("ValidateIsInt", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (!Number.isInteger(val))
                return propertyName + " is not an Integer";
        });
    }
    exports.ValidateIsInt = ValidateIsInt;
    class ValidationMaxOptions extends ValidationOptions {
    }
    exports.ValidationMaxOptions = ValidationMaxOptions;
    function ValidateMax(options) {
        return registerValidation("ValidateMax", options, (target, propertyName, val, options) => {
            if ((options === null || options === void 0 ? void 0 : options.max) && val > (options === null || options === void 0 ? void 0 : options.max))
                return "value {value} is not longer then {max}";
        });
    }
    exports.ValidateMax = ValidateMax;
    class ValidationMinOptions extends ValidationOptions {
    }
    exports.ValidationMinOptions = ValidationMinOptions;
    function ValidateMin(options) {
        return registerValidation("ValidateMin", options, (target, propertyName, val, options) => {
            if ((options === null || options === void 0 ? void 0 : options.min) && val < (options === null || options === void 0 ? void 0 : options.min))
                return "value {value} is not smaller then {min}";
        });
    }
    exports.ValidateMin = ValidateMin;
    class ValidationIsNumberOptions extends ValidationOptions {
    }
    exports.ValidationIsNumberOptions = ValidationIsNumberOptions;
    function ValidateIsNumber(options) {
        return registerValidation("ValidateIsNumber", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (!(typeof val === 'number' && isFinite(val)))
                return propertyName + " is not a Number";
        });
    }
    exports.ValidateIsNumber = ValidateIsNumber;
    class ValidationIsStringOptions extends ValidationOptions {
    }
    exports.ValidationIsStringOptions = ValidationIsStringOptions;
    function ValidateIsString(options) {
        return registerValidation("ValidateIsInt", options, (target, propertyName, val, options) => {
            if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
                return undefined;
            if (typeof val !== 'string' && !(val instanceof String))
                return propertyName + " is not a String";
        });
    }
    exports.ValidateIsString = ValidateIsString;
    class TestSample {
        constructor() {
            this.test = this;
            this.testarr = [this];
            this.num = 9.1;
            this.bol = true;
            this.inprop = 1;
        }
        async call(num, text = undefined) {
            return num;
        }
    }
    __decorate([
        ValidateIsInt({ message: "r:{rule} p:{property} v:{value}" }),
        ValidateMax({ max: 10, message: "{max}" }),
        ValidateMin({ min: 5, message: "{value} is smaller then {min}" }),
        __metadata("design:type", Number)
    ], TestSample.prototype, "id", void 0);
    __decorate([
        ValidateFunctionParameter(),
        __param(0, ValidateIsInt()),
        __param(1, ValidateIsString({ optional: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], TestSample.prototype, "call", null);
    __decorate([
        ValidateIsString({ optional: true, message: "no string" }),
        __metadata("design:type", Object)
    ], TestSample.prototype, "str", void 0);
    __decorate([
        ValidateIsInstanceOf({ type: t => TestSample }),
        __metadata("design:type", Object)
    ], TestSample.prototype, "test", void 0);
    __decorate([
        ValidateIsArray({ type: t => TestSample }),
        __metadata("design:type", Object)
    ], TestSample.prototype, "testarr", void 0);
    __decorate([
        ValidateIsNumber(),
        __metadata("design:type", Object)
    ], TestSample.prototype, "num", void 0);
    __decorate([
        ValidateIsBoolean(),
        __metadata("design:type", Object)
    ], TestSample.prototype, "bol", void 0);
    __decorate([
        ValidateIsIn({ in: [1, "2", "3"] }),
        __metadata("design:type", Object)
    ], TestSample.prototype, "inprop", void 0);
    async function test(test) {
        var obj = new TestSample();
        obj.id = 8;
        var hh = validate(obj);
        test.expectEqual(validate(obj).length === 0);
        //@ts-ignore
        obj.id = "8";
        test.expectEqual(validate(obj)[0].message === "r:ValidateIsInt p:id v:8");
        test.expectEqual(await obj.call(8) === 8);
        test.expectError(() => obj.call("8"));
        obj.id = 0;
        test.expectEqual(validate(obj)[0].message === "0 is smaller then 5");
        obj.id = 20;
        test.expectEqual(validate(obj)[0].message === "10");
        obj.str = 20;
        obj.id = 8;
        var hdh = validate(obj)[0].message;
        test.expectError(() => validate(obj, undefined, true));
        test.expectEqual(validate(obj)[0].message === "no string");
        test.expectEqual(await obj.call(8, "ok") === 8);
        test.expectError(() => obj.call("8", 8));
        test.expectEqual(await obj.call(8, "ok") === 8);
        obj.str = "kk";
        test.expectEqual(validate(obj).length === 0);
        obj.num = "1.2";
        test.expectError(() => validate(obj, undefined, true));
        obj.num = 1.2;
        obj.testarr = 8;
        test.expectError(() => validate(obj, undefined, true));
        obj.testarr = [8];
        test.expectError(() => validate(obj, undefined, true));
        obj.testarr = [];
        test.expectEqual(validate(obj).length === 0);
        obj.bol = "";
        test.expectError(() => validate(obj, undefined, true));
        obj.bol = true;
        test.expectEqual(validate(obj).length === 0);
        obj.test = { kk: 9 };
        test.expectError(() => validate(obj, undefined, true));
        obj.test = { id: 9 };
        test.expectEqual(validate(obj, {
            delegateOptions: {
                ValidateIsInstanceOf: { alternativeJsonProperties: ["id"] }
            }
        }).length === 0);
        obj.test = obj;
        obj.testarr = [{ id: 8 }];
        test.expectError(() => validate(obj, undefined, true));
        test.expectEqual(validate(obj, {
            delegateOptions: {
                ValidateIsArray: { alternativeJsonProperties: ["id"] }
            }
        }).length === 0);
        obj.testarr = [];
        test.expectEqual(validate(obj).length === 0);
        obj.inprop = 5;
        test.expectError(() => validate(obj, undefined, true));
        obj.inprop = "2";
        test.expectEqual(validate(obj).length === 0);
    }
    exports.test = test;
    var l;
});
define("jassijs/remote/hallo", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OO = void 0;
    class KK {
    }
    class OO {
        constructor() {
            this.hallo = "";
        }
        static test() {
            //  var result = Reflect.getOwnMetadata("design:type", OO,"hallo");
            //  var result = Reflect.getMetadata("design:type", OO,"hallo");
            //  var jj=Reflect.getMetadataKeys(OO);
            //  var jj2=Reflect.getOwnMetadataKeys(OO);
        }
    }
    exports.OO = OO;
});
//this file is autogenerated don't modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "de/remote/AR.ts": {
        "date": 1681557287008,
        "de.AR": {
            "$Rights": [
                [
                    {
                        "name": "Auftragswesen/Ausgangsrechnung/festschreiben"
                    },
                    {
                        "name": "Auftragswesen/Ausgangsrechnung/löschen"
                    }
                ]
            ],
            "$DBObject": [],
            "@members": {
                "id": {
                    "PrimaryColumn": []
                },
                "strasse": {
                    "Column": []
                },
                "nummer": {
                    "Column": []
                },
                "ort": {
                    "Column": [
                        {
                            "nullable": true
                        }
                    ]
                },
                "kunde": {
                    "$CheckParentRight": [],
                    "ManyToOne": [
                        "function",
                        "function"
                    ]
                },
                "zeilen": {
                    "OneToMany": [
                        "function",
                        "function"
                    ]
                }
            }
        }
    },
    "de/remote/ARZeile.ts": {
        "date": 1680947290781,
        "de.ARZeile": {
            "$DBObject": [],
            "@members": {
                "id": {
                    "PrimaryGeneratedColumn": []
                },
                "text": {
                    "Column": []
                },
                "position": {
                    "Column": []
                },
                "preis": {
                    "Column": [
                        {
                            "nullable": true,
                            "type": "decimal"
                        }
                    ]
                },
                "ar": {
                    "$CheckParentRight": [],
                    "ManyToOne": [
                        "function",
                        "function"
                    ]
                }
            }
        }
    },
    "de/remote/Kunde.ext.ts": {
        "date": 1622985484000
    },
    "de/remote/Kunde.ts": {
        "date": 1681316844059,
        "de.Kunde": {
            "$ParentRights": [
                [
                    {
                        "name": "Kundennummern",
                        "sqlToCheck": "me.id>=:i1 and me.id<=:i2",
                        "description": {
                            "text": "Kundennummern",
                            "i1": "von",
                            "i2": "bis"
                        }
                    }
                ]
            ],
            "$DBObject": [],
            "@members": {
                "id": {
                    "PrimaryColumn": []
                },
                "vorname": {
                    "Column": []
                },
                "nachname": {
                    "Column": []
                },
                "strasse": {
                    "Column": []
                },
                "PLZ": {
                    "Column": []
                },
                "ort": {
                    "Column": [
                        {
                            "nullable": true
                        }
                    ]
                },
                "hausnummer": {
                    "Column": []
                },
                "rechnungen": {
                    "OneToMany": [
                        "function",
                        "function"
                    ]
                },
                "alleKundenNachNachname": {
                    "$DBObjectQuery": [
                        {
                            "name": "Alle nach Namen",
                            "description": "Kundenliste nach Namen"
                        }
                    ]
                },
                "alleKundenNachNummer": {
                    "$DBObjectQuery": [
                        {
                            "name": "Alle nach Nummer",
                            "description": "Kundenliste nach Nummer"
                        }
                    ]
                },
                "land": {
                    "Column": [
                        {
                            "nullable": true
                        }
                    ]
                }
            }
        }
    },
    "de/remote/KundeExt.ts": {
        "date": 1655556796000,
        "de.KundeExt": {
            "$Extension": [
                "de.Kunde"
            ]
        }
    },
    "de/remote/KundeExt2.ts": {
        "date": 1655556796000,
        "de.KundeExt2": {
            "$Extension": [
                "de.Kunde"
            ]
        }
    },
    "de/remote/Lieferant.ts": {
        "date": 1656072674000,
        "de.Lieferant": {
            "$DBObject": [],
            "@members": {
                "id": {
                    "PrimaryColumn": []
                },
                "name": {
                    "Column": [
                        {
                            "nullable": false
                        }
                    ]
                }
            }
        }
    },
    "de/remote/MyUser.ts": {
        "date": 1656072680000,
        "de.MyUser": {
            "$DBObject": [],
            "Entity": [],
            "@members": {
                "id": {
                    "PrimaryColumn": []
                },
                "firstName": {
                    "Column": []
                },
                "lastName": {
                    "Column": []
                },
                "age": {
                    "Column": []
                }
            }
        }
    },
    "de/remote/MyRemoteObject.ts": {
        "date": 1682192454974,
        "de.remote.MyRemoteObject": {
            "@members": {
                "sayHello": {
                    "ValidateFunctionParameter": []
                },
                "sayHello2": {
                    "ValidateFunctionParameter": []
                }
            }
        }
    }
};
define("de/remote/AR", ["require", "exports", "de/remote/ARZeile", "de/remote/Kunde", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Rights", "jassijs/remote/Serverservice"], function (require, exports, ARZeile_1, Kunde_1, DBObject_2, Registry_19, DatabaseSchema_2, Rights_1, Serverservice_5) {
    "use strict";
    var AR_1;
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.AR = void 0;
    /**
    * Ausgangsrechnung
    * @class de.AR
    */
    let AR = AR_1 = class AR extends DBObject_2.DBObject {
        constructor() {
            super();
            this.ort = "";
            this.id = 0;
            this.strasse = "";
            this.nummer = 0;
        }
        static async myfind(options = undefined, context = undefined) {
            if (!jassijs.isServer) {
                return await this.call(this.myfind, options, context);
            }
            else {
                //@ts-ignore
                var Brackets = (await new Promise((resolve_12, reject_12) => { require(["typeorm"], resolve_12, reject_12); })).Brackets;
                //@ts-ignore
                var man = await Serverservice_5.serverservices.db;
                var man2 = man;
                var ret = await man.connection().manager.createQueryBuilder().
                    select("me").from(AR_1, "me").
                    leftJoinAndSelect("me.kunde", ",me.kunde").
                    where("me.kunde=:id", { id: 5 }).getMany();
                var ret2 = await man.connection().manager.createQueryBuilder().
                    select("me").from(ARZeile_1.ARZeile, "me").
                    leftJoin("me.ar", "me_ar").
                    leftJoin("me_ar.kunde", "me_ar_kunde").
                    where("me_ar_kunde.id>:id", { id: 0 }).
                    andWhere(new Brackets(qp => {
                    qp.where("me_ar.id>=:p1 and me_ar.id<=:p2", { p1: 1, p2: 90 }).
                        orWhere("me_ar.id>=:p3 and me_ar.id<=:p4", { p3: 500, p4: 1000 });
                })).
                    andWhere(new Brackets(qp => {
                    qp.where("me_ar_kunde.id>=:von and me_ar_kunde.id<=:bis", { von: 1, bis: 90 }).
                        orWhere("me_ar_kunde.id>=:von and me_ar_kunde.id<=:bis", { von: 1, bis: 90 });
                })).
                    getMany();
                return ret;
            }
        }
        async sample() {
            var all = AR_1.myfind();
            var ar = new AR_1();
            ar.strasse = "gemeindeberg";
            ar.nummer = 7;
            ar.id = 30;
            ar.save();
            /*        var ar2 = await jassijs.db.load("de.AR", 30);
                    var test = await ar2.kunden.resolve();
                    var kd = await jassijs.db.load("de.Kunde", 9);
                    ar.kunde = kd;
                    await jassijs.db.save(ar);
                    var arneu = await jassijs.db.load("de.AR", 30);
                    var test = await arneu.kunde.resolve();
                    await jassijs.db.save(ar);
            */
            //jassijs.db.delete(kunde);
        }
    };
    __decorate([
        (0, DatabaseSchema_2.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], AR.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", String)
    ], AR.prototype, "strasse", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)(),
        __metadata("design:type", Number)
    ], AR.prototype, "nummer", void 0);
    __decorate([
        (0, DatabaseSchema_2.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], AR.prototype, "ort", void 0);
    __decorate([
        (0, Rights_1.$CheckParentRight)()
        //@JoinTable()
        ,
        (0, DatabaseSchema_2.ManyToOne)(type => Kunde_1.Kunde, kunde => kunde.rechnungen),
        __metadata("design:type", typeof (_a = typeof Kunde_1.Kunde !== "undefined" && Kunde_1.Kunde) === "function" ? _a : Object)
    ], AR.prototype, "kunde", void 0);
    __decorate([
        (0, DatabaseSchema_2.OneToMany)(type => ARZeile_1.ARZeile, zeile => zeile.ar),
        __metadata("design:type", Array)
    ], AR.prototype, "zeilen", void 0);
    AR = AR_1 = __decorate([
        (0, Rights_1.$Rights)([{ name: "Auftragswesen/Ausgangsrechnung/festschreiben" },
            { name: "Auftragswesen/Ausgangsrechnung/löschen" }]),
        (0, DBObject_2.$DBObject)(),
        (0, Registry_19.$Class)("de.AR"),
        __metadata("design:paramtypes", [])
    ], AR);
    exports.AR = AR;
    async function test() {
        //jassijs.db.clearCache();
        //var ar = await jassijs.db.load("de.AR", 30, "kunde");
        //ar.zeilen = await jassijs.db.load("de.ARZeile");
        var ak = await AR.myfind();
        return;
        //var z: AR = (await AR.find({ id: 902 }))[0];
        // z.plz="09456";
        //console.log(JSON.stringify(z));
        // z.save();
        /*	var hh=ar.kunde;
            var test=await ar.kunde.resolve();
            var kkk=ar.kunde.rechnungen;
            var kkk=ar.kunde.rechnungen.resolve();
            */
    }
    exports.test = test;
});
define("de/remote/ARZeile", ["require", "exports", "jassijs/remote/DBObject", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Rights", "de/remote/AR", "jassijs/remote/Serverservice"], function (require, exports, DBObject_3, Registry_20, DatabaseSchema_3, Rights_2, AR_2, Serverservice_6) {
    "use strict";
    var ARZeile_2;
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ARZeile = void 0;
    let ARZeile = ARZeile_2 = class ARZeile extends DBObject_3.DBObject {
        constructor() {
            super();
        }
        static async find(options = undefined, context = undefined) {
            if (!jassijs.isServer) {
                return await this.call(this.find, options, context);
            }
            else {
                return (await Serverservice_6.serverservices.db).find(context, this, options);
            }
        }
        get oo2() {
            var o = 12;
            var a = 9;
            var t = 1;
            return "gpp";
        }
        async sample() {
            var ret;
            var az = await jassijs.db.load("de.ARZeile", 120);
            var h = await az.ar.resolve();
            var ar2 = await jassijs.db.load("de.AR", 30);
            var az3 = new ARZeile_2();
            var h = await ar2.zeilen.resolve();
            ar2.zeilen.add(az3);
            ar2.zeilen.remove(az3);
            /*var z1=new de.ARZeile();
            z1.id=110;
            z1.text="lkjlk";
            jassijs.db.save(z1);
            var z2=new de.ARZeile();
            z2.id=120;
            z2.text="lddkjlk";
            jassijs.db.save(z2);
            var ar=jassijs.db.load("de.AR",30);
            ar.zeilen=new jassijs.base.DBArray(z1,z2);
            jassijs.db.save(ar);
            var arz=jassijs.db.load("de.ARZeile",1);
            var test=ar.zeilen;*/
        }
    };
    __decorate([
        (0, DatabaseSchema_3.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], ARZeile.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)(),
        __metadata("design:type", String)
    ], ARZeile.prototype, "text", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)(),
        __metadata("design:type", Number)
    ], ARZeile.prototype, "position", void 0);
    __decorate([
        (0, DatabaseSchema_3.Column)({ nullable: true, type: "decimal" }),
        __metadata("design:type", Number)
    ], ARZeile.prototype, "preis", void 0);
    __decorate([
        (0, Rights_2.$CheckParentRight)(),
        (0, DatabaseSchema_3.ManyToOne)(type => AR_2.AR, ar => ar.zeilen),
        __metadata("design:type", typeof (_a = typeof AR_2.AR !== "undefined" && AR_2.AR) === "function" ? _a : Object)
    ], ARZeile.prototype, "ar", void 0);
    ARZeile = ARZeile_2 = __decorate([
        (0, DBObject_3.$DBObject)(),
        (0, Registry_20.$Class)("de.ARZeile"),
        __metadata("design:paramtypes", [])
    ], ARZeile);
    exports.ARZeile = ARZeile;
    jassijs.test = async function () {
        //	var k=new Kunde();
        //k=k;
        var test = await jassijs.db.load("de.ARZeile");
        var z = new ARZeile();
        z.id = 150;
        z.text = "jjj";
        //   jassijs.db.save(z);
        return undefined;
    };
});
define("de/remote/Kunde.ext", ["require", "exports", "de/remote/KundeExt"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("de/remote/Kunde", ["require", "exports", "jassijs/remote/DBObject", "de/remote/AR", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/DBObjectQuery", "jassijs/remote/security/Rights", "jassijs/remote/Serverservice"], function (require, exports, DBObject_4, AR_3, Registry_21, DatabaseSchema_4, DBObjectQuery_1, Rights_3, Serverservice_7) {
    "use strict";
    var Kunde_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Kunde = void 0;
    //import "jassijs/ext/enableExtension.js?de.Kunde";
    let Kunde = Kunde_2 = class Kunde extends DBObject_4.DBObject {
        initExtensions() {
            //this function would be extended
        }
        constructor() {
            super();
            this.id = 0;
            this.vorname = "";
            this.nachname = "";
            this.strasse = "";
            this.PLZ = "";
            this.hausnummer = 0;
            this.initExtensions();
        }
        /**
        * add here all properties for the PropertyEditor
        * @param {[jassijs.ui.ComponentDescriptor]} desc - describe fields for propertyeditor
        * e.g.  desc.fields.push(new jassijs.ui.Property("id","number"));
        */
        static describeComponent(desc) {
            desc.actions.push({
                name: "Bewertung", description: "Bewerte den Kunden", icon: "mdi mdi-car", run: function (kunden) {
                    for (var x = 0; x < kunden.length; x++) {
                        // notify("bewerte..." + kunden[x].vorname, "info", { position: "right" });
                        //	alert("bewerten..."+kunden[x].vorname);
                    }
                }
            });
        }
        static async alleKundenNachNachname() {
            return await Kunde_2.find({ order: "nachname" });
        }
        static async alleKundenNachNummer() {
            return await Kunde_2.find({ order: "id" });
        }
        static async find(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.find, options, context);
            }
            else {
                return await (await Serverservice_7.serverservices.db).find(context, this, options);
            }
        }
        static async sample() {
            var kunde1 = new Kunde_2();
            Object.assign(kunde1, { id: 1, vorname: "Max", nachname: "Meier", strasse: "Dorfstrße", hausnummer: 100 });
            var kunde2 = new Kunde_2();
            Object.assign(kunde2, { id: 2, vorname: "Mario", nachname: "Meier", strasse: "Dorfstraße", hausnummer: 87 });
            var kunde3 = new Kunde_2();
            Object.assign(kunde3, { id: 3, vorname: "Alma", nachname: "Alser", strasse: "Hauptstraße", hausnummer: 7 });
            var kunde4 = new Kunde_2();
            Object.assign(kunde4, { id: 4, vorname: "Elke", nachname: "Krautz", strasse: "Gehweg", hausnummer: 5 });
            await kunde1.save();
            await kunde2.save();
            await kunde3.save();
            await kunde4.save();
            //jassijs.db.delete(kunde);
        }
    };
    __decorate([
        (0, DatabaseSchema_4.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Kunde.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_4.Column)(),
        __metadata("design:type", String)
    ], Kunde.prototype, "vorname", void 0);
    __decorate([
        (0, DatabaseSchema_4.Column)(),
        __metadata("design:type", String)
    ], Kunde.prototype, "nachname", void 0);
    __decorate([
        (0, DatabaseSchema_4.Column)(),
        __metadata("design:type", String)
    ], Kunde.prototype, "strasse", void 0);
    __decorate([
        (0, DatabaseSchema_4.Column)(),
        __metadata("design:type", String)
    ], Kunde.prototype, "PLZ", void 0);
    __decorate([
        (0, DatabaseSchema_4.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Kunde.prototype, "ort", void 0);
    __decorate([
        (0, DatabaseSchema_4.Column)(),
        __metadata("design:type", Number)
    ], Kunde.prototype, "hausnummer", void 0);
    __decorate([
        (0, DatabaseSchema_4.OneToMany)(type => AR_3.AR, ar => ar.kunde),
        __metadata("design:type", Array)
    ], Kunde.prototype, "rechnungen", void 0);
    __decorate([
        (0, DatabaseSchema_4.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], Kunde.prototype, "land", void 0);
    __decorate([
        (0, DBObjectQuery_1.$DBObjectQuery)({ name: "Alle nach Namen", description: "Kundenliste nach Namen" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Kunde, "alleKundenNachNachname", null);
    __decorate([
        (0, DBObjectQuery_1.$DBObjectQuery)({ name: "Alle nach Nummer", description: "Kundenliste nach Nummer" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Kunde, "alleKundenNachNummer", null);
    Kunde = Kunde_2 = __decorate([
        (0, Rights_3.$ParentRights)([{ name: "Kundennummern", sqlToCheck: "me.id>=:i1 and me.id<=:i2",
                description: {
                    text: "Kundennummern",
                    i1: "von",
                    i2: "bis"
                } }]),
        (0, DBObject_4.$DBObject)(),
        (0, Registry_21.$Class)("de.Kunde"),
        __metadata("design:paramtypes", [])
    ], Kunde);
    exports.Kunde = Kunde;
    async function test() {
        //var g=test.extFunc2();   
        //var h=test.extFunc();
        //await Kunde.sample();
        var k = await Kunde.findOne({ id: 1 });
        if (k === undefined)
            k = new Kunde();
        k.id = 1;
        k.vorname = "Ella";
        k.land = "Deutschland";
        k.nachname = "Klotz";
        k.ort = "Mainz";
        k.PLZ = "99992";
        var tt = await k.validate(k);
        k.save();
        //	new de.Kunde().generate();
        //jassijs.db.uploadType(de.Kunde);
    }
    exports.test = test;
    ;
});
define("de/remote/KundeExt", ["require", "exports", "jassijs/remote/Registry", "jassijs/util/DatabaseSchema", "jassijs/remote/Extensions"], function (require, exports, Registry_22, DatabaseSchema_5, Extensions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Extensions_1.extensions.annotateMember("de.Kunde", "extField", String, (0, DatabaseSchema_5.Column)({ nullable: true }));
    //  de.Kunde.prototype.extFunc=function(){return 6;}
    let KundeExt = class KundeExt {
        get hello2() {
            return "pp";
        }
        //this is called on Kunde
        /**
        * sample Extension
        */
        initExtensions() {
        }
        extFunc() {
            return 3;
        }
        /**
         * is called after main class is loaded
         * example type.prototype.hallo=function(){}
         * @param {class} type - the type to extend
         */
        static extend(type) {
            //type.prototype.extFunc = function () { return 8; }
        }
    };
    KundeExt = __decorate([
        (0, Extensions_1.$Extension)("de.Kunde"),
        (0, Registry_22.$Class)("de.KundeExt")
    ], KundeExt);
    //Hack for tabulator.js
    KundeExt.prototype.extFunc["match"] = function () { return false; };
});
//jassijs.register("extensions", "de.Kunde", KundeExt, "KundeExt");
define("de/remote/KundeExt2", ["require", "exports", "jassijs/remote/Extensions", "jassijs/remote/Registry"], function (require, exports, Extensions_2, Registry_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let KundeExt2 = class KundeExt2 {
        /**
        * sample Extension
        */
        constructor() {
        }
        //Error wenn tabelle mit Tabulator mit Kunden gefüllt wird
        //extFunc2() { return 8; }
        /**
         * is called after main class is loaded
         * example type.prototype.hallo=function(){}
         * @param {class} type - the type to extend
         */
        static extend(type) {
            //Error wenn tabelle mit Tabulator mit Kunden gefüllt wird
            //type.prototype.extFunc2 = function () { return 8; }
        }
    };
    KundeExt2 = __decorate([
        (0, Extensions_2.$Extension)("de.Kunde"),
        (0, Registry_23.$Class)("de.KundeExt2"),
        __metadata("design:paramtypes", [])
    ], KundeExt2);
});
//jassijs.register("extensions", "de.Kunde", KundeExt2, "KundeExt2");
define("de/remote/Lieferant", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/DBObject", "jassijs/util/DatabaseSchema"], function (require, exports, Registry_24, DBObject_5, DatabaseSchema_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Lieferant = void 0;
    //import { Entity, PrimaryColumn, Column,OneToOne,ManyToMany,ManyToOne,OneToMany } from "typeorm";
    let Lieferant = class Lieferant extends DBObject_5.DBObject {
    };
    __decorate([
        (0, DatabaseSchema_6.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Lieferant.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_6.Column)({ nullable: false }),
        __metadata("design:type", String)
    ], Lieferant.prototype, "name", void 0);
    Lieferant = __decorate([
        (0, Registry_24.$Class)("de.Lieferant"),
        (0, DBObject_5.$DBObject)()
    ], Lieferant);
    exports.Lieferant = Lieferant;
});
/*export async function test(){
    var l=new Lieferant();
    l.id=900;
    l.name="kkkkkk";
    l.save();
    //var z:Lieferant=(await Lieferant.find({id:900}))[0];
   // z.plz="09456";
//    console.log(JSON.stringify(z));
}*/ 
define("de/remote/MyRemoteObject", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/Validator"], function (require, exports, Registry_25, RemoteObject_6, Validator_5) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MyRemoteObject = void 0;
    let MyRemoteObject = class MyRemoteObject extends RemoteObject_6.RemoteObject {
        //this is a sample remote function
        async tt(name) {
            return "oo";
        }
        async sayHello(name, context = undefined) {
            console.log(this.sayHello.name);
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.sayHello, name, context);
            }
            else {
                console.log(await this.tt("hallo"));
                return "Hello " + name; //this would be execute on server  
            }
        }
        static async sayHello2(name, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.sayHello2, name, context);
            }
            else {
                return "Hello static " + name; //this would be execute on server  
            }
        }
    };
    __decorate([
        __param(0, (0, Validator_5.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], MyRemoteObject.prototype, "tt", null);
    __decorate([
        (0, Validator_5.ValidateFunctionParameter)(),
        __param(0, (0, Validator_5.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_a = typeof RemoteObject_6.Context !== "undefined" && RemoteObject_6.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], MyRemoteObject.prototype, "sayHello", null);
    __decorate([
        (0, Validator_5.ValidateFunctionParameter)(),
        __param(0, (0, Validator_5.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, typeof (_b = typeof RemoteObject_6.Context !== "undefined" && RemoteObject_6.Context) === "function" ? _b : Object]),
        __metadata("design:returntype", Promise)
    ], MyRemoteObject, "sayHello2", null);
    MyRemoteObject = __decorate([
        (0, Registry_25.$Class)("de.remote.MyRemoteObject")
    ], MyRemoteObject);
    exports.MyRemoteObject = MyRemoteObject;
    async function test() {
        console.log(await new MyRemoteObject().sayHello("Kurt"));
        // console.log(await MyRemoteObject.sayHello2("5"));
    }
    exports.test = test;
});
define("de/remote/MyUser", ["require", "exports", "jassijs/util/DatabaseSchema", "jassijs/remote/DBObject", "jassijs/remote/Registry"], function (require, exports, DatabaseSchema_7, DBObject_6, Registry_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MyUser = void 0;
    let MyUser = class MyUser {
    };
    __decorate([
        (0, DatabaseSchema_7.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], MyUser.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_7.Column)(),
        __metadata("design:type", String)
    ], MyUser.prototype, "firstName", void 0);
    __decorate([
        (0, DatabaseSchema_7.Column)(),
        __metadata("design:type", String)
    ], MyUser.prototype, "lastName", void 0);
    __decorate([
        (0, DatabaseSchema_7.Column)(),
        __metadata("design:type", Number)
    ], MyUser.prototype, "age", void 0);
    MyUser = __decorate([
        (0, DBObject_6.$DBObject)(),
        (0, DatabaseSchema_7.Entity)(),
        (0, Registry_26.$Class)("de.MyUser")
    ], MyUser);
    exports.MyUser = MyUser;
});
//# sourceMappingURL=test.js.map