var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("jassijs_localserver/DBManager", ["require", "exports", "typeorm", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs/remote/security/User", "jassijs/remote/Registry"], function (require, exports, typeorm_1, Classes_1, Registry_1, User_1, Registry_2) {
    "use strict";
    var DBManager_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBManager = void 0;
    const parser = require('js-sql-parser');
    const passwordIteration = 10000;
    var _instance = undefined;
    var _initrunning = undefined;
    /**
     * Database access with typeorm
     */
    let DBManager = DBManager_1 = class DBManager {
        static async getConOpts() {
            var stype = "postgres";
            var shost = "localhost";
            var suser = "postgres";
            var spass = "ja$$1";
            var iport = 5432;
            var sdb = "jassi";
            //the default is the sqlite3
            //this is the default way: define an environment var DATABASSE_URL
            //type://user:password@hostname:port/database
            //eg: postgres://abcknhlveqwqow:polc78b98e8cd7168d35a66e392d2de6a8d5710e854c084ff47f90643lce2876@ec2-174-102-251-1.compute-1.amazonaws.com:5432/dcpqmp4rcmu182
            //@ts-ignore
            var test = process.env.DATABASE_URL;
            if (test !== undefined) {
                var all = test.split(":");
                stype = all[0];
                var h = all[2].split("@");
                shost = h[1];
                iport = Number(all[3].split("/")[0]);
                suser = all[1].replace("//", "");
                spass = h[0];
                sdb = all[3].split("/")[1];
            }
            var dbclasses = [];
            var dbobjects = await Registry_1.default.getJSONData("$DBObject");
            for (var o = 0; o < dbobjects.length; o++) {
                var clname = dbobjects[o].classname;
                dbclasses.push(await Classes_1.classes.loadClass(clname));
                //var fname = dbobjects[o].filename;
                //dbfiles.push("js/" + fname.replace(".ts", ".js"));
            }
            var opt = {
                //@ts-ignore
                "type": stype,
                "host": shost,
                "port": iport,
                "username": suser,
                "password": spass,
                "database": sdb,
                //"synchronize": true,
                "logging": false,
                "entities": dbclasses,
                //"js/client/remote/de/**/*.js"
                // "migrations": [
                //    "src/migration/**/*.ts"
                // ],
                // "subscribers": [
                //    "src/subscriber/**/*.ts"
                // ]
            };
            return opt;
        }
        static async get() {
            if (_instance === undefined) {
                _instance = new DBManager_1();
                var test = (0, typeorm_1.getMetadataArgsStorage)();
                try {
                    var opts = await DBManager_1.getConOpts();
                    Object.freeze(DBManager_1);
                    _initrunning = (0, typeorm_1.createConnection)(opts);
                    await _initrunning;
                }
                catch (err1) {
                    try {
                        _initrunning = undefined;
                        opts["ssl"] = true; //heroku need this
                        _initrunning = (0, typeorm_1.createConnection)(opts);
                        await _initrunning;
                    }
                    catch (err) {
                        console.log("DB corrupt - revert the last change");
                        _instance = undefined;
                        _initrunning = undefined;
                        if (err.message === "The server does not support SSL connections") {
                            throw err1;
                            console.error(err1);
                        }
                        else {
                            throw err;
                            console.error(err);
                        }
                    }
                }
                try {
                    await _instance.mySync();
                }
                catch (err) {
                    console.log("DB Schema could not be saved");
                    throw err;
                }
                await _instance.hasLoaded();
            }
            //wait for connection ready
            await _initrunning;
            //on server we convert decimal type to Number https://github.com/brianc/node-postgres/issues/811
            //@ts-ignore
            if ((window === null || window === void 0 ? void 0 : window.document) === undefined) {
                try {
                    //@ts-ignore
                    var types = (await new Promise((resolve_1, reject_1) => { require(['pg'], resolve_1, reject_1); })).types;
                    types.setTypeParser(1700, function (val) {
                        return parseFloat(val);
                    });
                }
                catch (_a) {
                }
            }
            return _instance;
        }
        /**
         * loading is finished
         */
        async hasLoaded() {
        }
        async mySync() {
            var con = (0, typeorm_1.getConnection)();
            //@ts-ignore
            var schem = await new Promise((resolve_2, reject_2) => { require(["typeorm/schema-builder/RdbmsSchemaBuilder"], resolve_2, reject_2); });
            var org = schem.RdbmsSchemaBuilder.prototype["executeSchemaSyncOperationsInProperOrder"];
            schem.RdbmsSchemaBuilder.prototype["executeSchemaSyncOperationsInProperOrder"] = async function () {
                //try{
                await this.createNewTables();
                await this.addNewColumns();
                await this.updatePrimaryKeys();
                await this.updateExistColumns();
                await this.createNewIndices();
                await this.createNewChecks();
                await this.createNewExclusions();
                await this.createCompositeUniqueConstraints();
                await this.createForeignKeys();
                await this.createViews();
                /*}catch(err){
                  this.prototype._error_=err;
                  }*/
            };
            //  var h=Reflect.getMetadata("design:type",AR.prototype,"id");
            await con.synchronize();
            //if(schem.RdbmsSchemaBuilder.prototype["_error_"])
            //throw schem.RdbmsSchemaBuilder.prototype["_error_"]; 
            //con.driver.
        }
        static async clearMetadata() {
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().checks);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().columns);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().discriminatorValues);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().embeddeds);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().entityListeners);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().entityRepositories);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().entitySubscribers);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().exclusions);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().tables);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().generations);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().indices);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().inheritances);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().joinColumns);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().joinTables);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().namingStrategies);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().relationCounts);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().relationIds);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().relations);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().tables);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().transactionEntityManagers);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().transactionRepositories);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().trees);
            DBManager_1.clearArray((0, typeorm_1.getMetadataArgsStorage)().uniques);
        }
        static async destroyConnection() {
            if (_instance !== undefined)
                await (0, typeorm_1.getConnection)().close();
            _instance = undefined;
            DBManager_1.clearMetadata();
        }
        static clearArray(arr) {
            while (arr.length > 0) {
                arr.pop();
            }
        }
        constructor() {
            Object.freeze(_instance);
        }
        connection() {
            return (0, typeorm_1.getConnection)();
        }
        async runSQL(context, sql, parameters = undefined) {
            var ret = await (await DBManager_1.get()).connection().query(sql, parameters);
            return ret;
        }
        async remove(context, entity) {
            var test = await (await DBManager_1.get()).checkParentRight(context, entity, [entity["id"]]);
            if (test === false)
                throw new Error("you are not allowed to delete " + Classes_1.classes.getClassName(entity) + " with id " + entity["id"]);
            await this.connection().manager.remove(entity);
        }
        async addSaveTransaction(context, entity) {
            if (context.objecttransaction) {
                let ot = context.objecttransaction;
                if (!ot.savelist) {
                    ot.savelist = [entity];
                    ot.saveresolve = [];
                    ot.addFunctionFinally(async () => {
                        ot.savereturn = await this.connection().manager.save(ot.savelist);
                        for (let x = 0; x < ot.savereturn.length; x++) {
                            delete ot.savereturn[x].password;
                            ot.saveresolve[x](ot.savereturn[x]);
                        }
                    });
                }
                else
                    ot.savelist.push(entity);
                return new Promise((resolve) => {
                    ot.saveresolve.push(resolve);
                    ot.transactionResolved(context);
                    ot.checkFinally();
                });
            }
        }
        /**
       * insert a new object
       * @param obj - the object to insert
       */
        async insert(context, obj) {
            await this._checkParentRightsForSave(context, obj);
            if (context.objecttransaction) {
                return this.addSaveTransaction(context, obj);
            }
            if (obj.id !== undefined) {
                if ((await this.connection().manager.findOne(obj.constructor, obj.id)) !== undefined) {
                    throw new Error("object is already in DB: " + obj.id);
                }
            }
            //@ts-ignore
            var ret = await this.connection().manager.insert(obj.constructor, obj);
            //save also relations
            let retob = await this.save(context, obj);
            return retob;
        }
        async save(context, entity, options) {
            var _a;
            await this._checkParentRightsForSave(context, entity);
            if (((window === null || window === void 0 ? void 0 : window.document) === undefined)) { //crypt password only in nodes
                if (Classes_1.classes.getClassName(entity) === "jassijs.security.User" && entity.password !== undefined) {
                    entity.password = await new Promise((resolve) => {
                        const crypto = require('crypto');
                        const salt = crypto.randomBytes(8).toString('base64');
                        crypto.pbkdf2(entity.password, salt, passwordIteration, 512, 'sha512', (err, derivedKey) => {
                            if (err)
                                throw err;
                            resolve(passwordIteration.toString() + ":" + salt + ":" + derivedKey.toString('base64')); //.toString('base64'));  // '3745e48...aa39b34'
                        });
                    });
                }
            }
            if (context.objecttransaction && options === undefined) {
                return this.addSaveTransaction(context, entity);
            }
            var ret = await this.connection().manager.save(entity, options);
            //delete entity.password;
            //delete ret["password"];
            //@ts-ignore
            return (_a = ret) === null || _a === void 0 ? void 0 : _a.id;
        }
        async _checkParentRightsForSave(context, entity) {
            var _a;
            if ((_a = context.request.user) === null || _a === void 0 ? void 0 : _a.isAdmin)
                return;
            //Check if the object self has restrictions
            var cl = Classes_1.classes.getClass(Classes_1.classes.getClassName(entity));
            if (entity["id"] !== undefined) {
                var exist = await this.connection().manager.findOne(cl, entity["id"]);
                if (exist !== undefined) {
                    var t = await this.checkParentRight(context, cl, [entity["id"]]);
                    if (!t) {
                        throw new Error("you are not allowed to save " + Classes_1.classes.getClassName(cl) + " with id " + entity["id"]);
                    }
                }
            }
            //check if the field of parentRight is set
            if (Registry_1.default.getMemberData("$CheckParentRight") !== undefined) {
                var data = Registry_1.default.getMemberData("$CheckParentRight")[Classes_1.classes.getClassName(entity)];
                for (var key in data) {
                    if (entity[key] === undefined) {
                        throw new Error("the field " + key + " must not be undefined");
                    }
                }
            }
            var vdata = this.connection().getMetadata(cl);
            //Check if the relations fields have restrictions
            for (var r = 0; r < vdata.relations.length; r++) {
                var rel = vdata.relations[r];
                var data = entity[rel.propertyName];
                if (data !== undefined && !Array.isArray(data)) {
                    let cl = rel.type;
                    var t = await this.checkParentRight(context, cl, [data["id"]]);
                    if (!t) {
                        throw new Error("you are not allowed to save " + Classes_1.classes.getClassName(cl) + " with id " + entity["id"] + " - no access to property " + rel.propertyName);
                    }
                }
                if (data !== undefined && Array.isArray(data)) {
                    let cl = rel.type;
                    var arr = [];
                    for (let x = 0; x < data.length; x++) {
                        arr.push(data[x].id);
                    }
                    let t = await this.checkParentRight(context, cl, arr);
                    if (!t) {
                        throw new Error("you are not allowed to save " + Classes_1.classes.getClassName(cl) + " with id " + entity["id"] + " - no access to property " + rel.propertyName);
                    }
                }
                /* var tp=await p1.__proto__.constructor;
                 var test=await this.connection().manager.findOne(tp,902);
                 var ob=await this.connection().manager.preload(tp,p1);
                 if(ob===undefined){//does not exists in DB
                   ob=p1;
                 }*/
            }
        }
        /**
         * Finds first entity that matches given conditions.
         */
        async findOne(context, entityClass, p1, p2) {
            if (typeof p1 === "string" || typeof p1 === "number") { //search by id
                p1 = { id: p1 };
            }
            var ret = await this.find(context, entityClass, p1);
            if (ret === undefined || ret.length === 0)
                return undefined;
            else
                return ret[0];
            //return this.connection().manager.findOne(entityClass,id,options);
            // else
            //return this.connection().manager.findOne(entityClass, p1, p2);
        }
        /**
          * Finds first entity that matches given conditions.
          */
        async find(context, entityClass, p1) {
            //return this.connection().manager.findOne(entityClass,id,options);
            // else
            var options = p1;
            var onlyColumns = options === null || options === void 0 ? void 0 : options.onlyColumns;
            var clname = Classes_1.classes.getClassName(entityClass);
            var cl = Classes_1.classes.getClass(clname);
            var relations = new RelationInfo(context, clname, this);
            var allRelations = this.resolveWildcharInRelations(clname, options === null || options === void 0 ? void 0 : options.relations);
            if (options && options.relations) {
                relations.addRelations(context, allRelations, true);
            }
            var ret = await this.connection().manager.createQueryBuilder().
                select("me").from(cl, "me");
            if (options)
                ret = relations.addWhere(context, options.where, options.whereParams, ret);
            options === null || options === void 0 ? true : delete options.where;
            options === null || options === void 0 ? true : delete options.whereParams;
            options === null || options === void 0 ? true : delete options.onlyColumns;
            ret = relations.addWhereBySample(context, options, ret);
            ret = relations.join(ret);
            if (!context.request.user.isAdmin)
                ret = await relations.addParentRightDestriction(context, ret);
            var test = ret.getSql();
            let objs = await ret.getMany();
            if (objs && onlyColumns) {
                objs.forEach((ob) => {
                    for (var key in ob) {
                        if (onlyColumns.indexOf(key) === -1 && allRelations.indexOf(key) === -1 && key !== "id")
                            ob[key] = undefined;
                    }
                });
            }
            return objs;
            // return await this.connection().manager.find(entityClass, p1);
        }
        resolveWildcharInRelations(classname, relation) {
            var ret = [];
            if (!relation)
                return ret;
            for (let r = 0; r < relation.length; r++) {
                if (relation[r] === "*") {
                    var vdata = (0, typeorm_1.getConnection)().getMetadata(Classes_1.classes.getClass(classname));
                    for (var re = 0; re < vdata.relations.length; re++) {
                        var s = vdata.relations[re].propertyName;
                        if (ret.indexOf(s) === -1)
                            ret.push(s);
                    }
                }
                else
                    ret.push(relation[r]);
            }
            return ret;
        }
        async createUser(context, username, password) {
            //var hh=getConnection().manager.findOne(User,{ email: username });
            if (await (0, typeorm_1.getConnection)().manager.findOne(User_1.User, { email: username }) !== undefined) {
                throw new Error("User already exists");
            }
            const user = new User_1.User();
            user.email = username;
            user.password = password;
            //first user would be admin
            if (await (await DBManager_1.get()).connection().manager.findOne(User_1.User) === undefined) {
                user.isAdmin = true;
            }
            //password is encrypted when saving
            /* await new Promise((resolve) => {
              const crypto = require('crypto');
        
              const salt = crypto.randomBytes(8).toString('base64');
              crypto.pbkdf2(password, salt, passwordIteration, 512, 'sha512', (err, derivedKey) => {
                if (err) throw err;
                resolve(passwordIteration.toString() + ":" + salt + ":" + derivedKey.toString('base64'));//.toString('base64'));  // '3745e48...aa39b34'
              });
            })*/
            await (await DBManager_1.get()).save(context, user);
            delete user.password;
            return user;
        }
        async login(context, user, password) {
            /* const users = await this.connection().getRepository(User)
             .createQueryBuilder()
             .select("user.id", "id")
             //.addSelect("user.password")
             .getMany();*/
            var ret = await this.connection().manager.createQueryBuilder().
                select("me").from(User_1.User, "me").addSelect("me.password").
                andWhere("me.email=:email", { email: user });
            /* if (options)
               ret = relations.addWhere(<string>options.where, options.whereParams, ret);
         
             ret = relations.addWhereBySample(options, ret);
             ret = relations.join(ret);
             ret = await relations.addParentRightDestriction(ret);*/
            var auser = await ret.getOne();
            if (!auser || !password)
                return undefined;
            let pw = auser.password.split(":");
            let iteration = parseInt(pw[0]);
            let salt = pw[1];
            var test = await new Promise((resolve) => {
                const crypto = require('crypto');
                crypto.pbkdf2(password, salt, iteration, 512, 'sha512', (err, derivedKey) => {
                    if (err)
                        throw err;
                    resolve(passwordIteration.toString() + ":" + salt + ":" + derivedKey.toString('base64')); //.toString('base64'));  // '3745e48...aa39b34'
                });
            });
            if (test === auser.password) {
                delete auser.password;
                return auser;
            }
            else {
                delete auser.password;
            }
            return undefined;
        }
        async checkParentRight(context, entityClass, ids) {
            var clname = Classes_1.classes.getClassName(entityClass);
            var cl = Classes_1.classes.getClass(clname);
            var relations = new RelationInfo(context, clname, this);
            var ret = await this.connection().manager.createQueryBuilder().
                select("me").from(cl, "me");
            ret = relations.join(ret);
            ret.andWhere("me.id IN (:...ids)", { ids: ids });
            if (!context.request.user.isAdmin)
                ret = await relations.addParentRightDestriction(context, ret);
            var tt = ret.getSql();
            var test = await ret.getCount();
            return test === ids.length;
        }
    };
    DBManager = DBManager_1 = __decorate([
        (0, Registry_2.$Class)("jassi_localserver.DBManager"),
        __metadata("design:paramtypes", [])
    ], DBManager);
    exports.DBManager = DBManager;
    class RelationInfo {
        constructor(context, className, dbmanager) {
            this.counter = 100;
            this.className = className;
            this.dbmanager = dbmanager;
            this.relations = {};
            var testPR = Registry_1.default.getData("$ParentRights", className);
            this.relations[""] = {
                name: "",
                className: className,
                fullPath: "",
                parentRights: (testPR.length !== 0 ? testPR[0].params[0] : undefined),
                doSelect: true
            };
            this.addRelationsFromParentRights(context, "");
        }
        addRelationsFromParentRights(context, relationname) {
            var pr = this.relations[relationname];
            if (Registry_1.default.getMemberData("$CheckParentRight") !== undefined) {
                var data = Registry_1.default.getMemberData("$CheckParentRight")[pr.className];
                if (data !== undefined) {
                    var membername = "";
                    for (var key in data) {
                        membername = key;
                    }
                    var r = relationname + (relationname === "" ? "" : ".") + membername;
                    this.addRelations(context, [r], false);
                    this.addRelationsFromParentRights(context, r);
                }
            }
        }
        _getRelationFromProperty(property) {
            var keys = property.split(".");
            var path = "me";
            for (var x = 0; x < keys.length; x++) {
                if (x + 1 === keys.length)
                    path = path + ".";
                else
                    path = path + "_";
                path = path + keys[x];
            }
            return path;
        }
        /**
         * add an andWhere to the sql-Query to check the parent rights
         * @param builder
         */
        join(builder) {
            var ret = builder;
            for (var key in this.relations) {
                if (key !== "") {
                    /* var keys = key.split(".");
                     var path = "me";
                     for (var x = 0; x < keys.length; x++) {
             
                       if (x + 1 === keys.length)
                         path = path + ".";
                       else
                         path = path + "_";
                       path = path + keys[x];
                     }*/
                    var path = this._getRelationFromProperty(key);
                    if (this.relations[key].doSelect)
                        ret = ret.leftJoinAndSelect(path, "me_" + key.replaceAll(".", "_"));
                    else
                        ret = ret.leftJoin(path, "me_" + key.replaceAll(".", "_"));
                }
            }
            return ret;
        }
        /**
         * add an andWhere to the sql-Query to check the parent rights
         * @param builder
         */
        async addParentRightDestriction(context, builder) {
            var username = "a@b.com";
            var ret = builder;
            //first we get the sql from User-Rights we had to check 
            var kk = context.request.user;
            var userid = context.request.user.user;
            var query = this.dbmanager.connection().createQueryBuilder().
                select("me").from(Classes_1.classes.getClass("jassijs.security.ParentRight"), "me").
                leftJoin("me.groups", "me_groups").
                leftJoin("me_groups.users", "me_groups_users");
            query = query.andWhere("me_groups_users.id=:theUserId", { theUserId: userid });
            var doBr = false;
            query = query.andWhere(new typeorm_1.Brackets((entr) => {
                var parentrights = undefined;
                for (var relationname in this.relations) {
                    var relation = this.relations[relationname];
                    if (relation.parentRights !== undefined) {
                        for (var x = 0; x < relation.parentRights.length; x++) {
                            doBr = true;
                            var right = relation.parentRights[x];
                            var param = {};
                            param["classname" + this.counter] = relation.className;
                            param["name" + this.counter] = right.name;
                            entr.orWhere("me.classname=:classname" + this.counter + " and me.name=:name" + this.counter, param);
                            this.counter++;
                        }
                    }
                }
                if (!doBr) {
                    doBr = true;
                    entr.orWhere("me.classname=me.classname");
                }
            }));
            var debug = query.getSql();
            var parentRights = await query.getMany();
            for (var relationname in this.relations) {
                var relation = this.relations[relationname];
                if (relation.parentRights !== undefined) {
                    ret = ret.andWhere(new typeorm_1.Brackets((qu) => {
                        for (var p = 0; p < relation.parentRights.length; p++) {
                            var pr = relation.parentRights[p];
                            var found = false;
                            for (var z = 0; z < parentRights.length; z++) {
                                var oneRight = parentRights[z];
                                if (oneRight.name === pr.name && oneRight.classname === relation.className) {
                                    var sql = pr.sqlToCheck;
                                    //modify sql that params are unique
                                    var param = {};
                                    for (var field in oneRight) {
                                        if (field !== "classname" && field !== "groups" && field !== "name") {
                                            sql = sql.replaceAll(":" + field, ":" + field + this.counter);
                                            if (relation.fullPath !== "")
                                                sql = sql.replaceAll("me.", "\"me_" + relation.fullPath.replaceAll(".", "_") + "\".");
                                            param[field + this.counter] = oneRight[field];
                                        }
                                    }
                                    qu.orWhere(sql, param);
                                    found = true;
                                    this.counter++;
                                }
                            }
                            if (!found) {
                                qu.andWhere("me.id>1 and me.id<1", param); //no right exists
                            }
                        }
                    }));
                }
            }
            return ret;
        }
        _checkExpression(context, node) {
            if (node.operator !== undefined) {
                this._parseNode(context, node);
            }
            //replace id to me.id and ar.zeile.id to me_ar_zeile.id
            if (node.type === "Identifier" && !node.value.startsWith("xxxparams")) {
                var name = node.value;
                var path = this._getRelationFromProperty(name);
                /*      var keys = name.split(".");
                      var path = "me";
                      for (var x = 0; x < keys.length; x++) {
                
                        if (x + 1 === keys.length)
                          path = path + ".";
                        else
                          path = path + "_";
                        path = path + keys[x];
                      }*/
                node.value = path;
                var pack = path.split(".")[0].substring(3);
                if (pack !== "")
                    this.addRelations(context, [pack], false);
            }
            var _this = this;
            if (node.type === "SimpleExprParentheses") {
                node.value.value.forEach(element => {
                    _this._parseNode(context, element);
                });
            }
        }
        _parseNode(context, node) {
            if (node.operator !== undefined) {
                var left = node.left;
                var right = node.right;
                this._checkExpression(context, left);
                this._checkExpression(context, right);
            }
        }
        addWhereBySample(context, param, builder) {
            var ret = builder;
            for (var key in param) {
                if (key === "cache" || key === "join" || key === "loadEagerRelations" || key === "loadRelationids" || key == "lock" || key == "order" ||
                    key === "relations" || key === "select" || key === "skip" || key === "take" || key === "where" || key === "withDeleted") {
                    continue;
                }
                //this should prevent sql injection
                var test = /[A-Z,a-z][A-Z,a-z,0-9,\.]*/g.exec(key);
                if (test === null || test[0] !== key)
                    throw new Error("could not set property " + key + " in where clause");
                var field = this._getRelationFromProperty(key);
                var pack = field.split(".")[0].substring(3);
                if (pack !== "")
                    this.addRelations(context, [pack], false);
                var placeholder = "pp" + this.counter++;
                var par = {};
                par[placeholder] = param[key];
                ret = ret.andWhere(field + "=:" + placeholder, par);
            }
            return ret;
            /* var dummyselect = "select * from k where ";
             //we must replace because parsing Exception
             var ast = parser.parse(dummyselect + sql.replaceAll(":","xxxparams"));
             this._parseNode(ast.value.where);
             var newsql=parser.stringify(ast).replaceAll("xxxparams",":");
             ret.andWhere(newsql.substring(dummyselect.length),whereParams);
             return ret;*/
        }
        addWhere(context, sql, whereParams, builder) {
            var ret = builder;
            if (sql === undefined)
                return ret;
            var dummyselect = "select * from k where ";
            //we must replace because parsing Exception
            var ast = parser.parse(dummyselect + sql.replaceAll(":", "xxxparams"));
            this._parseNode(context, ast.value.where);
            var newsql = parser.stringify(ast).replaceAll("xxxparams", ":");
            ret.andWhere(newsql.substring(dummyselect.length), whereParams);
            return ret;
        }
        addRelations(context, relations, doselect) {
            var _a;
            if (relations === undefined)
                return;
            for (var z = 0; z < relations.length; z++) {
                var relation = relations[z];
                var all = relation.split(".");
                var curPath = "";
                var parentPath = "";
                var curClassname = this.className;
                for (var x = 0; x < all.length; x++) {
                    parentPath = curPath;
                    curPath = curPath + (curPath === "" ? "" : ".") + all[x];
                    if (this.relations[curPath] === undefined) {
                        var vdata = this.dbmanager.connection().getMetadata(Classes_1.classes.getClass(curClassname));
                        //read type
                        var membername = all[x];
                        for (var r = 0; r < vdata.relations.length; r++) {
                            var rel = vdata.relations[r];
                            if (rel.propertyName === membername) {
                                var clname = Classes_1.classes.getClassName(rel.type);
                                var testPR = Registry_1.default.getData("$ParentRights", clname);
                                this.relations[curPath] = {
                                    className: Classes_1.classes.getClassName(rel.type),
                                    name: membername,
                                    fullPath: curPath,
                                    parentRights: (testPR.length !== 0 ? testPR[0].params[0] : undefined),
                                    doSelect: doselect
                                };
                            }
                        }
                        //Parentrights
                        membername = "";
                        if (!((_a = context.request.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
                            if (Registry_1.default.getMemberData("$CheckParentRight") !== undefined) {
                                var data = Registry_1.default.getMemberData("$CheckParentRight")[curClassname];
                                for (var key in data) {
                                    membername = key;
                                }
                            }
                        }
                        if (membername !== "") {
                            for (var r = 0; r < vdata.relations.length; r++) {
                                var rel = vdata.relations[r];
                                if (rel.propertyName === membername) {
                                    var clname = Classes_1.classes.getClassName(rel.type);
                                    var testPR = Registry_1.default.getData("$ParentRights", clname);
                                    var mpath = parentPath + (parentPath === "" ? "" : ".") + membername;
                                    this.relations[mpath] = {
                                        className: Classes_1.classes.getClassName(rel.type),
                                        name: membername,
                                        fullPath: mpath,
                                        parentRights: (testPR.length !== 0 ? testPR[0].params[0] : undefined),
                                        doSelect: doselect
                                    };
                                }
                            }
                        }
                    }
                    else if (doselect) {
                        this.relations[curPath].doSelect = true;
                    }
                    curClassname = this.relations[curPath].className;
                }
            }
        }
    }
});
define("jassijs_localserver/DatabaseSchema", ["require", "exports", "jassijs/remote/Classes", "jassijs/remote/Database", "typeorm"], function (require, exports, Classes_2, Database_1, typeorm_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ManyToMany = exports.ManyToOne = exports.OneToMany = exports.OneToOne = exports.PrimaryColumn = exports.Column = exports.JoinTable = exports.JoinColumn = exports.PrimaryGeneratedColumn = exports.Entity = void 0;
    function addDecorater(decoratername, delegate, ...args) {
        return function (...fargs) {
            var con = fargs.length === 1 ? fargs[0] : fargs[0].constructor;
            var clname = Classes_2.classes.getClassName(con);
            var field = fargs.length == 1 ? "this" : fargs[1];
            Database_1.db._setMetadata(con, field, decoratername, args, fargs, delegate);
            if (delegate)
                delegate(...args)(...fargs);
        };
    }
    function Entity(...param) {
        //DEntity(param)(pclass, ...params);
        return addDecorater("Entity", typeorm_2.Entity, ...param);
    }
    exports.Entity = Entity;
    function PrimaryGeneratedColumn(...param) {
        return addDecorater("PrimaryGeneratedColumn", typeorm_2.PrimaryGeneratedColumn, ...param);
    }
    exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
    function JoinColumn(...param) {
        return addDecorater("JoinColumn", typeorm_2.JoinColumn, ...param);
    }
    exports.JoinColumn = JoinColumn;
    function JoinTable(...param) {
        return addDecorater("JoinTable", typeorm_2.JoinTable, ...param);
    }
    exports.JoinTable = JoinTable;
    function Column(...param) {
        return addDecorater("Column", typeorm_2.Column, ...param);
    }
    exports.Column = Column;
    function PrimaryColumn(...param) {
        return addDecorater("PrimaryColumn", typeorm_2.PrimaryColumn, ...param);
    }
    exports.PrimaryColumn = PrimaryColumn;
    function OneToOne(...param) {
        return addDecorater("OneToOne", typeorm_2.OneToOne, ...param);
    }
    exports.OneToOne = OneToOne;
    function OneToMany(...param) {
        return addDecorater("OneToMany", typeorm_2.OneToMany, ...param);
    }
    exports.OneToMany = OneToMany;
    function ManyToOne(...param) {
        return addDecorater("ManyToOne", typeorm_2.ManyToOne, ...param);
    }
    exports.ManyToOne = ManyToOne;
    function ManyToMany(...param) {
        return addDecorater("ManyToMany", typeorm_2.ManyToMany, ...param);
    }
    exports.ManyToMany = ManyToMany;
});
//export function Entity(options?: EntityOptions): Function;
//export declare type PrimaryGeneratedColumnType = "int" | "int2" | "int4" | "int8" | "integer" | "tinyint" | "smallint" | "mediumint" | "bigint" | "dec" | "decimal" | "fixed" | "numeric" | "number" | "uuid";
define("jassijs_localserver/Filesystem", ["require", "exports", "jassijs/remote/Registry", "jassijs/util/Reloader", "jassijs/server/DBManager", "jassijs/remote/Registry", "jassijs/remote/Server"], function (require, exports, Registry_3, Reloader_1, DBManager_2, Registry_4, Server_1) {
    "use strict";
    var Filessystem_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = void 0;
    class FileEntry {
    }
    let Filessystem = Filessystem_1 = class Filessystem {
        static async getDB() {
            if (Filessystem_1.db)
                return Filessystem_1.db;
            var req = window.indexedDB.open("jassi", 1);
            req.onupgradeneeded = function (event) {
                var db = event.target["result"];
                var objectStore = db.createObjectStore("files", { keyPath: "id" });
            };
            Filessystem_1.db = await new Promise((resolve) => {
                req.onsuccess = (ev) => { resolve(ev.target["result"]); };
            });
            return Filessystem_1.db;
        }
        /**
         * exists a directory?
         * @param path
         */
        async existsDirectory(path) {
            var test = await this.dirEntry(path);
            return test.length > 0;
        }
        async dirFiles(dir, extensions, ignore = []) {
            var _a, _b;
            var ret = [];
            var all = await this.dirEntry(dir);
            for (let x = 0; x < all.length; x++) {
                let fname = all[x].id;
                var include = true;
                if (((_b = (_a = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _a === void 0 ? void 0 : _a.Server) === null || _b === void 0 ? void 0 : _b.filterSytemfilesInFilemap) === true) {
                    if (fname === "__default.db")
                        include = false;
                }
                if (extensions) {
                    include = false;
                    extensions.forEach((ent) => {
                        if (fname.endsWith(ent))
                            include = true;
                    });
                }
                if (ignore) {
                    ignore.forEach((ent) => {
                        if (fname === ent)
                            include = false;
                    });
                }
                if (include && !all[x].isDirectory)
                    ret.push(fname);
            }
            return ret;
        }
        async dirEntry(curdir = "") {
            var db = await Filessystem_1.getDB();
            let transaction = db.transaction('files', 'readonly');
            const store = transaction.objectStore('files');
            var ret = await store.openCursor();
            var all = [];
            await new Promise((resolve) => {
                ret.onsuccess = ev => {
                    var el = ev.target["result"];
                    if (el) {
                        if (curdir === "" || el.value.id === curdir || el.value.id.startsWith(curdir + "/"))
                            all.push(el.value);
                        el.continue();
                    }
                    else
                        resolve(undefined);
                };
                ret.onerror = ev => {
                    resolve(undefined);
                };
            });
            return all;
        }
        /**
         * @returns  [{name:"hallo",date:1566554},{name:"demo",files:[]}]
         */
        async dir(curdir = "", appendDate = false) {
            var _a, _b;
            var root = { name: "", files: [] };
            var all = await this.dirEntry(curdir);
            var keys = {
                "": root
            };
            for (let x = 0; x < all.length; x++) {
                var entr = all[x];
                var paths = entr.id.split("/");
                if (((_b = (_a = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _a === void 0 ? void 0 : _a.Server) === null || _b === void 0 ? void 0 : _b.filterSytemfilesInFilemap) === true) {
                    if (entr.id === "__default.db")
                        continue;
                }
                var parent = root;
                var currentpath = [];
                for (let p = 0; p < paths.length; p++) {
                    let name = paths[p];
                    currentpath.push(name);
                    let scurrentpath = currentpath.join("/");
                    if (p < paths.length - 1) { //the parentfolders
                        if (!keys[scurrentpath]) {
                            let nf = {
                                name: name,
                                files: []
                            };
                            parent.files.push(nf);
                            keys[scurrentpath] = nf;
                        }
                        parent = keys[scurrentpath];
                    }
                    else {
                        if (entr.isDirectory) {
                            if (keys[scurrentpath] === undefined) {
                                let nf = {
                                    name: name,
                                    files: []
                                };
                                keys[scurrentpath] = nf;
                                parent.files.push(nf);
                            }
                        }
                        else {
                            var newitem = {
                                name: name
                            };
                            if (appendDate)
                                newitem.date = entr.date;
                            parent.files.push(newitem);
                        }
                    }
                }
            }
            return root;
        }
        async createFile(filename, content) {
            return await this.saveFiles([filename], [content], false);
        }
        async saveFile(filename, content) {
            return await this.saveFiles([filename], [content]);
        }
        async saveFiles(fileNames, contents, rollbackonerror = true) {
            var _a;
            //serverside compile
            if (fileNames[0].startsWith("$serverside/")) {
                var allfileNames = [];
                var allcontents = [];
                for (var f = 0; f < fileNames.length; f++) {
                    var fileName = fileNames[f];
                    var content = contents[f];
                    if (fileName.endsWith(".ts") || fileName.endsWith(".js")) {
                        //@ts-ignore
                        var tss = await new Promise((resolve_3, reject_3) => { require(["jassijs_editor/util/Typescript"], resolve_3, reject_3); });
                        var rets = await tss.default.transpile(fileName, content);
                        allfileNames = allfileNames.concat(rets.fileNames);
                        allcontents = allcontents.concat(rets.contents);
                    }
                }
                fileNames = allfileNames;
                contents = allcontents;
            }
            var db = await Filessystem_1.getDB();
            var rollbackcontents = [];
            var jsToReload = [];
            var dbschemaHasChanged = false;
            for (let x = 0; x < fileNames.length; x++) {
                let fname = fileNames[x];
                if (fname.startsWith("js/") && fname.endsWith(".js"))
                    jsToReload.push(fname.substring(3).replace(".ts", ".js"));
                if (((_a = contents[x]) === null || _a === void 0 ? void 0 : _a.indexOf("@$DBObject(")) > -1)
                    dbschemaHasChanged = true;
                let exists = await this.loadFileEntry(fname);
                if (exists) {
                    rollbackcontents.push(exists.data);
                }
                else {
                    rollbackcontents.push(undefined); //this file would be killed at revert
                }
                if (contents[x] === undefined)
                    await this.remove(fname); //remove file on revert
                else {
                    let data = contents[x];
                    let transaction = db.transaction('files', 'readwrite');
                    const store = transaction.objectStore('files');
                    var el = new FileEntry();
                    el.id = fname;
                    el.data = data;
                    el.date = Date.now();
                    if (exists)
                        store.put(el);
                    else
                        store.add(el);
                    await new Promise((resolve) => { transaction.oncomplete = resolve; });
                }
            }
            if (fileNames.length === 1 && fileNames[0].endsWith("/registry.js")) //no indexer save recurse
                return;
            var RegistryIndexer = (await new Promise((resolve_4, reject_4) => { require(["jassijs_localserver/RegistryIndexer"], resolve_4, reject_4); })).RegistryIndexer;
            await new RegistryIndexer().updateRegistry();
            await Registry_4.default.reload();
            if (rollbackonerror) {
                try {
                    await Reloader_1.Reloader.instance.reloadJSAll(jsToReload);
                    if (dbschemaHasChanged) {
                        var man = await DBManager_2.DBManager.destroyConnection();
                        await DBManager_2.DBManager.get();
                    }
                }
                catch (err) {
                    console.error(err);
                    if (dbschemaHasChanged) {
                        await DBManager_2.DBManager.destroyConnection();
                    }
                    var restore = await this.saveFiles(fileNames, rollbackcontents, false);
                    if (dbschemaHasChanged) {
                        await DBManager_2.DBManager.get();
                    }
                    return err + "DB corrupt changes are reverted " + restore;
                }
            }
            return "";
        }
        async loadFileEntry(fileName) {
            var db = await Filessystem_1.getDB();
            let transaction = db.transaction('files', 'readonly');
            const store = transaction.objectStore('files');
            var ret = await store.get(fileName);
            var r = await new Promise((resolve) => {
                ret.onsuccess = ev => { resolve(ret.result); };
                ret.onerror = ev => { resolve(undefined); };
            });
            return r;
        }
        /**
        * deletes a server module (nothing to do on localserver)
        * @param modul - to delete
        */
        async removeServerModul(modul) {
            return "";
        }
        /**
        * create a folder
        * @param filename - the name of the new file
        * @param content - then content
        */
        async createFolder(filename) {
            if (filename.startsWith("/"))
                filename = filename.substring(1);
            var test = await this.loadFileEntry(filename);
            if (test)
                return filename + " allready exists";
            var db = await Filessystem_1.getDB();
            let transaction = db.transaction('files', 'readwrite');
            const store = transaction.objectStore('files');
            var el = {
                data: undefined,
                id: filename,
                isDirectory: true,
                date: Date.now()
            };
            store.add(el);
            transaction.onerror = (en) => {
                debugger;
            };
            await new Promise((resolve) => { transaction.oncomplete = resolve; });
            return "";
        }
        /**
         * create a module
         * @param modulname - the name of the module
      
         */
        async createModule(modulename) {
            if (!(await this.existsDirectory(modulename))) {
                await this.createFolder(modulename);
            }
            if (!(await this.existsDirectory(modulename + "/remote"))) {
                await this.createFolder(modulename + "/remote");
            }
            if ((await this.dirEntry(modulename + "/registry.js")).length === 0) {
                await this.saveFiles([modulename + "/registry.js", "js/" + modulename + "/registry.js"], ['define("' + modulename + '/registry",["require"], function(require) { return {  default: {	} } } );',
                    'define("' + modulename + '/registry",["require"], function(require) {return {  default: {	} } } );'], false);
            }
            if ((await this.dirEntry(modulename + "/modul.ts")).length === 0) {
                await this.saveFiles([modulename + "/modul.ts", "js/" + modulename + "/modul.js"], ["export default {}",
                    'define(["require", "exports"], function (require, exports) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = {};});'], false);
            }
            var json = await new Server_1.Server().loadFile("jassijs.json");
            var ob = JSON.parse(json);
            if (!ob.modules[modulename]) {
                ob.modules[modulename] = modulename;
                await this.saveFile("jassijs.json", JSON.stringify(ob, undefined, "\t"));
            }
            return "";
        }
        async loadFile(fileName) {
            var r = await this.loadFileEntry(fileName);
            return (r ? r.data : undefined);
        }
        /**
        * deletes a file or directory
        * @param file - old filename
        */
        async remove(file) {
            var entr = await this.dirEntry(file);
            if (entr.length === 0) {
                return file + " not exists";
            }
            var db = await Filessystem_1.getDB();
            for (let i = 0; i < entr.length; i++) {
                let transaction = db.transaction('files', 'readwrite');
                const store = transaction.objectStore('files');
                store.delete(entr[i].id);
                await new Promise((resolve) => { transaction.oncomplete = resolve; });
            }
            //update client jassijs.json if removing client module 
            var json = await new Server_1.Server().loadFile("jassijs.json");
            var ob = JSON.parse(json);
            if (ob.modules[file]) {
                delete ob.modules[file];
                this.saveFile("jassijs.json", JSON.stringify(ob, undefined, "\t"));
            }
            var RegistryIndexer = (await new Promise((resolve_5, reject_5) => { require(["jassijs_localserver/RegistryIndexer"], resolve_5, reject_5); })).RegistryIndexer;
            await new RegistryIndexer().updateRegistry();
            //entr = await this.dirEntry(file);
            return "";
        }
        /**
         * zip a directory
         */
        async zip(directoryname, serverdir = undefined, context = undefined) {
            //@ts-ignore
            var JSZip = (await new Promise((resolve_6, reject_6) => { require(["jassijs_localserver/ext/jszip"], resolve_6, reject_6); })).default;
            if (serverdir)
                throw new Error("serverdir is unsupported on localserver");
            var zip = new JSZip();
            var files = await this.dirEntry(directoryname);
            for (let x = 0; x < files.length; x++) {
                if (files[x].isDirectory)
                    zip.folder(files[x].id);
                else
                    zip.file(files[x].id, files[x].data);
            }
            var ret = await zip.generateAsync({ type: "base64" });
            //var ret = await zip.generateAsync({ type: "base64" });
            return ret;
        }
        /**
         * renames a file or directory
         * @param oldfile - old filename
         * @param newfile - new filename
         */
        async rename(oldfile, newfile) {
            var oldf = await this.dirEntry(oldfile);
            var newf = await this.dirEntry(newfile);
            if (oldf.length < 1)
                return oldfile + " not exists";
            if (newf.length > 0)
                return newfile + " already exists";
            for (let i = 0; i < oldf.length; i++) {
                await this.remove(oldf[i].id);
                oldf[i].id = newfile + oldf[i].id.substring(oldfile.length);
                if (oldf[i].isDirectory)
                    await this.createFolder(oldf[i].id);
                else
                    await this.createFile(oldf[i].id, oldf[i].data);
            }
            var RegistryIndexer = (await new Promise((resolve_7, reject_7) => { require(["jassijs_localserver/RegistryIndexer"], resolve_7, reject_7); })).RegistryIndexer;
            await new RegistryIndexer().updateRegistry();
            return "";
        }
    };
    Filessystem = Filessystem_1 = __decorate([
        (0, Registry_3.$Class)("jassijs_localserver.Filessystem")
    ], Filessystem);
    exports.default = Filessystem;
    async function test2() {
        var fs = new Filessystem();
        var hh = await fs.dir("local");
        /*await fs.createFolder("demo");
        await fs.createFile("demo/hallo", "");
        await fs.createFile("demo/hallo2", "");
        await fs.rename("demo","demo1");
        var hh=await fs.dirEntry();
        await fs.remove("demo1");*/
        return;
        await new Filessystem().saveFiles(["hallo.js"], ["alert(2)"]);
        var s1 = await new Filessystem().remove("hallo.js");
        var test = await new Filessystem().loadFile("hallo.js");
        var s2 = await new Filessystem().remove("hallo.js");
        var s = await new Filessystem().createFolder("demo");
        var s3 = await new Filessystem().remove("demo");
        await new Filessystem().saveFiles(["local/modul.ts"], [`export default {
    "require":{ 
        
    }
}`]);
        await new Filessystem().saveFiles(["local/registry.js"], [`//this file is autogenerated don't modify
define("local/registry",["require"], function(require) {
 return {
  default: {
	"local/modul.ts": {
		"date": 1614616375403
	}
}
 }
});`]);
    }
    exports.test2 = test2;
});
define("jassijs_localserver/Indexer", ["require", "exports", "jassijs/server/Filesystem", "jassijs/remote/Classes", "jassijs_editor/util/Typescript"], function (require, exports, Filesystem_1, Classes_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Indexer = void 0;
    class Indexer {
        async updateModul(root, modul, isserver) {
            var path = root + (root === "" ? "" : "/") + modul;
            //create empty if needed
            var text = "{}";
            if (await this.fileExists(path + "/registry.js")) {
                text = await this.readFile(path + "/registry.js");
                if (!isserver) {
                    text = text.substring(text.indexOf("default:") + 8);
                    text = text.substring(0, text.lastIndexOf("}") - 1);
                    text = text.substring(0, text.lastIndexOf("}") - 1);
                }
                else {
                    text = text.substring(text.indexOf("default=") + 8);
                }
            }
            var index = JSON.parse(text);
            //remove deleted files
            for (var key in index) {
                if (!(await this.fileExists(root + (root === "" ? "" : "/") + key))) {
                    delete index[key];
                }
            }
            var jsFiles = await this.dirFiles(modul, path, [".ts"], ["node_modules"]);
            for (let x = 0; x < jsFiles.length; x++) {
                var jsFile = jsFiles[x];
                var fileName = jsFile.substring((root.length + (root === "" ? 0 : 1)));
                if (fileName === undefined)
                    continue;
                var entry = index[fileName];
                if (entry === undefined) {
                    entry = {};
                    entry.date = undefined;
                    index[fileName] = entry;
                }
                if (await this.fileExists(root + (root === "" ? "" : "/") + fileName)) {
                    var dat = await this.getFileTime(root + (root === "" ? "" : "/") + fileName);
                    if (dat !== entry.date) {
                        var text = await this.readFile(root + (root === "" ? "" : "/") + fileName);
                        var sourceFile = ts.createSourceFile('hallo.ts', text, ts.ScriptTarget.ES5, true);
                        var outDecorations = [];
                        entry = {};
                        entry.date = undefined;
                        index[fileName] = entry;
                        this.collectAnnotations(sourceFile, entry);
                        // findex(Filesystem.path + "/" + jsFile);
                        entry.date = dat;
                    }
                }
            }
            if (!isserver) { //write client
                var text = JSON.stringify(index, undefined, "\t");
                text = "//this file is autogenerated don't modify\n" +
                    'define("' + modul + '/registry",["require"], function(require) {\n' +
                    ' return {\n' +
                    '  default: ' + text + "\n" +
                    ' }\n' +
                    '});';
                var jsdir = "js/" + path;
                if (Filesystem_1.default.path !== undefined)
                    jsdir = path.replace(Filesystem_1.default.path, Filesystem_1.default.path + "/js");
                if (!(await this.fileExists(jsdir)))
                    await this.createDirectory(jsdir);
                await this.writeFile(jsdir + "/registry.js", text);
                await this.writeFile(path + "/registry.js", text);
            }
            else { //write server
                var modules = JSON.parse(await this.readFile("./jassijs.json")).modules;
                for (let smodul in modules) {
                    if (modul === smodul) {
                        var text = JSON.stringify(index, undefined, "\t");
                        if (text !== "{}") {
                            text = '"use strict:"\n' +
                                "//this file is autogenerated don't modify\n" +
                                'Object.defineProperty(exports, "__esModule", { value: true });\n' +
                                'exports.default=' + text;
                            var jsdir = "js/" + modul;
                            if (!(await this.fileExists(jsdir)))
                                await this.createDirectory(jsdir);
                            await this.writeFile(jsdir + "/registry.js", text);
                            await this.writeFile(modul + "/registry.js", text);
                        }
                    }
                }
            }
        }
        convertArgument(arg) {
            if (arg === undefined)
                return undefined;
            if (arg.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                var ret = {};
                var props = arg.properties;
                if (props !== undefined) {
                    for (var p = 0; p < props.length; p++) {
                        ret[props[p].name.text] = this.convertArgument(props[p].initializer);
                    }
                }
                return ret;
            }
            else if (arg.kind === ts.SyntaxKind.StringLiteral) {
                return arg.text;
            }
            else if (arg.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                let ret = [];
                for (var p = 0; p < arg.elements.length; p++) {
                    ret.push(this.convertArgument(arg.elements[p]));
                }
                return ret;
            }
            else if (arg.kind === ts.SyntaxKind.Identifier) {
                return arg.text;
            }
            else if (arg.kind === ts.SyntaxKind.TrueKeyword) {
                return true;
            }
            else if (arg.kind === ts.SyntaxKind.FalseKeyword) {
                return false;
            }
            else if (arg.kind === ts.SyntaxKind.NumericLiteral) {
                return Number(arg.text);
            }
            else if (arg.kind === ts.SyntaxKind.ArrowFunction || arg.kind === ts.SyntaxKind.FunctionExpression) {
                return "function";
            }
            throw new Classes_3.JassiError("Error typ not found");
        }
        collectAnnotations(node, outDecorations, depth = 0) {
            var _a;
            //console.log(new Array(depth + 1).join('----'), node.kind, node.pos, node.end);
            if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                if (node.decorators !== undefined) {
                    var dec = {};
                    var sclass = undefined;
                    for (let x = 0; x < node.decorators.length; x++) {
                        var decnode = node.decorators[x];
                        var ex = decnode.expression;
                        if (ex.expression === undefined) {
                            dec[ex.text] = []; //Annotation without parameter
                        }
                        else {
                            if (ex.expression.text === "$Class")
                                sclass = this.convertArgument(ex.arguments[0]);
                            else {
                                if (dec[ex.expression.text] === undefined) {
                                    dec[ex.expression.text] = [];
                                }
                                for (var a = 0; a < ex.arguments.length; a++) {
                                    dec[ex.expression.text].push(this.convertArgument(ex.arguments[a]));
                                }
                            }
                        }
                    }
                    if (sclass !== undefined)
                        outDecorations[sclass] = dec;
                    //@members.value.$Property=[{name:string}]
                    for (let x = 0; x < node["members"].length; x++) {
                        var member = node["members"][x];
                        var membername = (_a = node["members"][x].name) === null || _a === void 0 ? void 0 : _a.escapedText;
                        if (member.decorators !== undefined) {
                            if (!dec["@members"])
                                dec["@members"] = {};
                            var decm = {};
                            dec["@members"][membername] = decm;
                            for (let x = 0; x < member.decorators.length; x++) {
                                var decnode = member.decorators[x];
                                var ex = decnode.expression;
                                if (ex.expression === undefined) {
                                    decm[ex.text] = []; //Annotation without parameter
                                }
                                else {
                                    if (decm[ex.expression.text] === undefined) {
                                        decm[ex.expression.text] = [];
                                    }
                                    for (var a = 0; a < ex.arguments.length; a++) {
                                        decm[ex.expression.text].push(this.convertArgument(ex.arguments[a]));
                                    }
                                }
                            }
                        }
                    }
                }
            }
            depth++;
            node.getChildren().forEach(c => this.collectAnnotations(c, outDecorations, depth));
        }
    }
    exports.Indexer = Indexer;
});
define("jassijs_localserver/Installserver", ["jassijs_localserver/Filesystem", "jassijs_localserver/DatabaseSchema"], function (Filesystem, schema) {
    return {
        //search for file in local-DB and undefine this files 
        //so this files could be loaded from local-DB
        autostart: async function () {
            var files = await new Filesystem.default().dirFiles("", ["js", "ts"]);
            files.forEach((fname) => {
                if (!fname.startsWith("js/")) {
                    var name = fname.substring(0, fname.length - 3);
                    requirejs.undef(name);
                }
            });
        }
    };
});
requirejs.undef("jassijs/util/DatabaseSchema");
define("jassijs/util/DatabaseSchema", ["jassijs_localserver/DatabaseSchema"], function (to) {
    return to;
});
define("jassijs/server/DoRemoteProtocol", ["jassijs_localserver/LocalProtocol"], function (locprot) {
    return {
        _execute: async function (protext, request, context) {
            var prot = JSON.parse(protext);
            return await locprot.localExec(prot, context);
        }
    };
});
define("jassijs/server/Filesystem", ["jassijs_localserver/Filesystem"], function (fs) {
    return fs;
});
define("jassijs/server/DBManager", ["jassijs_localserver/DBManager", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs_localserver/DBManager", "jassijs_localserver/TypeORMListener", "typeorm", "jassijs/remote/Database"], function (db, Classes_1, Registry_1, dbman, TypeORMListener, to, Database) {
    //create Admin User if doesn't a user exists 
    db.DBManager.prototype["hasLoaded"] = async function () {
        var User = await Classes_1.classes.loadClass("jassijs.security.User");
        var us = User.findOne();
        if (us) {
            us = new User();
            us.email = "admin";
            us.password = "jassi";
            us.isAdmin = true;
            await us.save();
        }
    };
    db.DBManager.prototype["login"] = async function (context, user, password) {
        try {
            var User = await Classes_1.classes.loadClass("jassijs.security.User");
            var ret = await this.connection().manager.createQueryBuilder().
                select("me").from(User, "me").addSelect("me.password").
                andWhere("me.email=:email", { email: user });
            var auser = await ret.getOne();
            if (!auser || !password)
                return undefined;
            if (auser.password === password) {
                delete auser.password;
                return auser;
            }
        }
        catch (err) {
            err = err;
        }
        return undefined;
    };
    db.DBManager["getConOpts"] = async function () {
        var dbclasses = [];
        const initSqlJs = window["SQL"];
        const SQL = await window["SQL"]({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: file => `https://sql.js.org/dist/${file}`
        });
        var dbobjects = await Registry_1.default.getJSONData("$DBObject");
        var dbfiles = [];
        for (var o = 0; o < dbobjects.length; o++) {
            var clname = dbobjects[o].classname;
            try {
                dbfiles.push(dbobjects[o].filename.replace(".ts", ""));
                dbclasses.push(await Classes_1.classes.loadClass(clname));
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }
        db.DBManager.clearMetadata();
        Database.db.fillDecorators();
        var tcl = await Classes_1.classes.loadClass("jassijs_localserver.TypeORMListener");
        to.EventSubscriber()(tcl);
        var Filessystem = await Classes_1.classes.loadClass("jassijs_localserver.Filessystem");
        var data = await new Filessystem().loadFile("__default.db");
        var opt = {
            database: data,
            type: "sqljs",
            subscribers: [TypeORMListener.TypeORMListener],
            "entities": dbclasses
        };
        return opt;
    };
    return db;
});
//DatabaseSchema
define("jassijs_localserver/LocalProtocol", ["require", "exports", "jassijs/remote/RemoteProtocol"], function (require, exports, RemoteProtocol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.localExec = void 0;
    RemoteProtocol_1.RemoteProtocol.prototype.exec = async function (config, ob) {
        var clname = JSON.parse(config.data).classname;
        var local = ["jassijs.remote.Transaction", "northwind.Employees", "northwind.Customer"];
        var classes = (await new Promise((resolve_8, reject_8) => { require(["jassijs/remote/Classes"], resolve_8, reject_8); })).classes;
        var DBObject = await classes.loadClass("jassijs.remote.DBObject");
        var ret;
        //
        /* if (clname === "jassijs.remote.Server") {
             var tst = JSON.parse(config.data);
             if (tst.method === "dir") {
                 var retserver = JSON.parse(await $.ajax(config));
                 var sret = await localExec(JSON.parse(config.data));
                 for(let i=0;i<retserver.files.length;i++){
                     if(retserver.files[i].name==="local"){
                         //retserver.files.splice(i,1);
                     }
                 }
                 for(let i=0;i<sret.files.length;i++){
                     if(sret.files[i].name==="local")
                         retserver.files.push(sret.files[i]);
                 }
                 return JSON.stringify(retserver);
             }else if(tst.method==="saveFiles"){
                 if(tst.parameter[0][0].startsWith("local/")||tst.parameter[0][0].startsWith("js/local/")){
                     var sret = await localExec(JSON.parse(config.data));
                     ret = new RemoteProtocol().stringify(sret);
                     if (ret === undefined)
                         ret = "$$undefined$$";
                     return ret;
                 }
             } else if(tst.parameter.length>0&&(tst.parameter[0]==="local"||tst.parameter[0].startsWith("local/"))) {
                 var sret = await localExec(JSON.parse(config.data));
                 ret = new RemoteProtocol().stringify(sret);
                 if (ret === undefined)
                     ret = "$$undefined$$";
                 return ret;
             }
     
         }
         if (local.indexOf(clname) > -1||clname.startsWith("local")) {*/
        var data = JSON.parse(config.data);
        var debugservermethods = []; //["dir"];//for testing run on server
        if (debugservermethods.indexOf(data.method) > -1) {
            ret = await $.ajax(config);
        }
        else {
            var sret = await localExec(data);
            ret = new RemoteProtocol_1.RemoteProtocol().stringify(sret);
            if (ret === undefined)
                ret = "$$undefined$$";
        }
        /* } else
             ret = await $.ajax(config);*/
        return ret;
    };
    async function localExec(prot, context = undefined) {
        var classes = (await new Promise((resolve_9, reject_9) => { require(["jassijs/remote/Classes"], resolve_9, reject_9); })).classes;
        var p = new RemoteProtocol_1.RemoteProtocol();
        var C = await classes.loadClass(prot.classname);
        if (context === undefined) {
            context = {
                isServer: true,
                request: {
                    user: {
                        isAdmin: true,
                        user: 1
                    }
                }
            };
            var Cookies = (await new Promise((resolve_10, reject_10) => { require(["jassijs/util/Cookies"], resolve_10, reject_10); })).Cookies;
            if (Cookies.get("simulateUser") && Cookies.get("simulateUserPassword")) {
                var DBManager = await classes.loadClass("jassi_localserver.DBManager");
                var man = await DBManager.get();
                var user = await man.login(context, Cookies.get("simulateUser"), Cookies.get("simulateUserPassword"));
                if (user === undefined) {
                    throw Error("simulated login failed");
                }
                else {
                    context.request.user.user = user.id;
                    context.request.user.isAdmin = user.isAdmin ? true : false;
                }
            }
        }
        if (prot._this === "static") {
            try {
                //await checkSimulateUser(request);
                if (prot.parameter === undefined)
                    ret = await (C[prot.method](context));
                else
                    ret = await (C[prot.method](...prot.parameter, context));
            }
            catch (ex) {
                console.error(ex.stack);
                var msg = ex.message;
                if (!msg)
                    msg = ex;
                if (!ex)
                    ex = "";
                ret = {
                    "**throw error**": msg
                };
            }
            //var s = new RemoteProtocol().stringify(ret);
            return ret;
        }
        else {
            var obj = new C();
            //if(runAfterCreation){
            //    obj=runAfterCreation(obj);
            //}
            if (prot._this !== undefined)
                Object.assign(obj, prot._this);
            var ret = undefined;
            try {
                //await checkSimulateUser(request);
                if (prot.parameter === undefined)
                    ret = await (obj[prot.method](context));
                else
                    ret = await (obj[prot.method](...prot.parameter, context));
            }
            catch (ex) {
                console.error(ex.stack);
                var msg = ex.message;
                if (!msg)
                    msg = ex;
                if (!ex)
                    ex = "";
                ret = {
                    "**throw error**": msg
                };
            }
            //var s = new RemoteProtocol().stringify(ret);
            return ret;
        }
    }
    exports.localExec = localExec;
});
define("jassijs_localserver/RegistryIndexer", ["require", "exports", "jassijs_localserver/Indexer", "jassijs/remote/Server", "jassijs_localserver/Filesystem", "jassijs/remote/Registry"], function (require, exports, Indexer_1, Server_2, Filesystem_2, Registry_5) {
    "use strict";
    var RegistryIndexer_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RegistryIndexer = void 0;
    let RegistryIndexer = RegistryIndexer_1 = class RegistryIndexer extends Indexer_1.Indexer {
        constructor() {
            super(...arguments);
            this.mapcache = {};
        }
        async updateRegistry() {
            //client modules
            var data = await new Server_2.Server().loadFile("jassijs.json");
            var modules = JSON.parse(data).modules;
            for (var m in modules) {
                if (await new Filesystem_2.default().existsDirectory(modules[m]) || await new Filesystem_2.default().existsDirectory(m)) {
                    if (modules[m].indexOf(".js") === -1) { //.js are internet modules
                        await this.updateModul("", m, false);
                    }
                    else {
                        await this.updateModul("", m, false);
                    }
                }
            }
            return;
        }
        async dirFiles(modul, path, extensions, ignore = []) {
            var tsfiles = await new Filesystem_2.default().dirFiles(path, extensions, ignore);
            //add files from map
            if (this.mapcache[modul] === undefined && jassijs.modules[modul] !== undefined && jassijs.modules[modul].indexOf(".js") > 0) { //read webtsfiles
                let ret = {};
                let mapname = jassijs.modules[modul].split("?")[0] + ".map";
                if (jassijs.modules[modul].indexOf(".js?") > -1)
                    mapname = mapname + "?" + jassijs.modules[modul].split("?")[1];
                var code = await $.ajax({ url: mapname, dataType: "text" });
                var data = JSON.parse(code);
                var files = data.sources;
                for (let x = 0; x < files.length; x++) {
                    let fname = files[x].substring(files[x].indexOf(modul + "/"));
                    ret[fname] = data.sourcesContent[x];
                }
                this.mapcache[modul] = ret;
            }
            if (this.mapcache[modul]) {
                for (var key in this.mapcache[modul]) {
                    if (tsfiles.indexOf(key) === -1) {
                        tsfiles.push(key);
                    }
                }
            }
            return tsfiles;
        }
        async writeFile(name, content) {
            await new Filesystem_2.default().saveFile(name, content);
        }
        async createDirectory(name) {
            await new Filesystem_2.default().createFolder(name);
            return;
        }
        async getFileTime(filename) {
            var entry = await new Filesystem_2.default().loadFileEntry(filename);
            if (entry !== undefined)
                return RegistryIndexer_1.version;
            for (var modul in this.mapcache) {
                if (this.mapcache[modul][filename]) {
                    return 0;
                }
            }
            return undefined;
        }
        async fileExists(filename) {
            for (var modul in this.mapcache) {
                if (this.mapcache[modul][filename]) {
                    return true;
                }
            }
            var test = await new Filesystem_2.default().loadFileEntry(filename);
            return test !== undefined;
        }
        async readFile(filename) {
            var ret = await new Filesystem_2.default().loadFile(filename);
            if (ret !== undefined)
                return ret;
            for (var modul in this.mapcache) {
                if (this.mapcache[modul][filename]) {
                    return this.mapcache[modul][filename];
                }
            }
            return undefined;
        }
    };
    RegistryIndexer.version = Math.floor(Math.random() * 100000);
    RegistryIndexer = RegistryIndexer_1 = __decorate([
        (0, Registry_5.$Class)("jassijs_localserver.RegistryIndexer")
    ], RegistryIndexer);
    exports.RegistryIndexer = RegistryIndexer;
});
define("jassijs_localserver/Testuser", ["require", "exports", "jassijs/util/DatabaseSchema", "jassijs/remote/DBObject", "jassijs/remote/Registry"], function (require, exports, DatabaseSchema_1, DBObject_1, Registry_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Testuser = void 0;
    let Testuser = class Testuser {
    };
    __decorate([
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], Testuser.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], Testuser.prototype, "firstname", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)(),
        __metadata("design:type", String)
    ], Testuser.prototype, "lastname", void 0);
    Testuser = __decorate([
        (0, DBObject_1.$DBObject)(),
        (0, Registry_6.$Class)("Testuser")
    ], Testuser);
    exports.Testuser = Testuser;
});
define("jassijs_localserver/TypeORMListener", ["require", "exports", "jassijs/remote/Registry", "typeorm", "jassijs_localserver/Filesystem", "jassijs/util/Reloader", "jassijs/remote/Registry", "jassijs_localserver/DBManager"], function (require, exports, Registry_7, typeorm_3, Filesystem_3, Reloader_2, Registry_8, DBManager_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeORMListener = void 0;
    //listener for code changes
    Reloader_2.Reloader.instance.addEventCodeReloaded(async function (files) {
        var dbobjects = await Registry_8.default.getJSONData("$DBObject");
        var reload = false;
        for (var x = 0; x < files.length; x++) {
            var file = files[x];
            dbobjects.forEach((data) => {
                if (data.filename === file + ".ts")
                    reload = true;
            });
        }
        if (reload) {
            await DBManager_3.DBManager.destroyConnection();
            await DBManager_3.DBManager.get();
        }
    });
    let TypeORMListener = class TypeORMListener {
        saveDB(event) {
            if (this.savetimer) {
                clearTimeout(this.savetimer);
                this.savetimer = undefined;
            }
            this.savetimer = setTimeout(() => {
                var data = event.connection.driver.export();
                new Filesystem_3.default().saveFile("__default.db", data);
                console.log("save DB");
            }, 300);
        }
        /**
         * Called after entity is loaded.
         */
        afterLoad(entity) {
            // console.log(`AFTER ENTITY LOADED: `, entity);
        }
        /**
         * Called before post insertion.
         */
        beforeInsert(event) {
            //console.log(`BEFORE POST INSERTED: `, event.entity);
        }
        /**
         * Called after entity insertion.
         */
        afterInsert(event) {
            this.saveDB(event);
            //console.log(`AFTER ENTITY INSERTED: `, event.entity);
        }
        /**
         * Called before entity update.
         */
        beforeUpdate(event) {
            //console.log(`BEFORE ENTITY UPDATED: `, event.entity);
        }
        /**
         * Called after entity update.
         */
        afterUpdate(event) {
            this.saveDB(event);
            //console.log(`AFTER ENTITY UPDATED: `, event.entity);
        }
        /**
         * Called before entity removal.
         */
        beforeRemove(event) {
            // console.log(`BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
        }
        /**
         * Called after entity removal.
         */
        afterRemove(event) {
            //  console.log(`AFTER ENTITY WITH ID ${event.entityId} REMOVED: `, event.entity);
            this.saveDB(event);
        }
        /**
         * Called before transaction start.
         */
        beforeTransactionStart(event) {
            // console.log(`BEFORE TRANSACTION STARTED: `, event);
        }
        /**
         * Called after transaction start.
         */
        afterTransactionStart(event /*: TransactionStartEvent*/) {
            //console.log(`AFTER TRANSACTION STARTED: `, event);
        }
        /**
         * Called before transaction commit.
         */
        beforeTransactionCommit(event /*: TransactionCommitEvent*/) {
            // console.log(`BEFORE TRANSACTION COMMITTED: `, event);
        }
        /**
         * Called after transaction commit.
         */
        afterTransactionCommit(event /*: TransactionCommitEvent*/) {
            //console.log(`AFTER TRANSACTION COMMITTED: `, event);
        }
        /**
         * Called before transaction rollback.
         */
        beforeTransactionRollback(event /*: TransactionRollbackEvent*/) {
            //   console.log(`BEFORE TRANSACTION ROLLBACK: `, event);
        }
        /**
         * Called after transaction rollback.
         */
        afterTransactionRollback(event /*: TransactionRollbackEvent*/) {
            // console.log(`AFTER TRANSACTION ROLLBACK: `, event);
        }
    };
    TypeORMListener = __decorate([
        (0, typeorm_3.EventSubscriber)(),
        (0, Registry_7.$Class)("jassijs_localserver.TypeORMListener")
    ], TypeORMListener);
    exports.TypeORMListener = TypeORMListener;
});
define("jassijs_localserver/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "loadbeforestart": ["js-sql-parser", "typeormbrowser", "jassijs_localserver/Installserver", "jassijs_localserver/LocalProtocol"],
        "require": {
            paths: {
                "jszip": "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip",
                "js-sql-parser": "https://cdn.jsdelivr.net/npm/js-sql-parser@1.4.1/dist/parser/sqlParser.min",
                "typeorm": "jassijs_localserver/ext/typeorm",
                "typeormbrowser": "https://uwei.github.io/jassijs/dist/typeorm/typeormbrowser",
                "window.SQL": "https://sql.js.org/dist/sql-wasm"
            },
            shim: {}
        }
    };
});
//this file is autogenerated don't modify
define("jassijs_localserver/registry", ["require"], function (require) {
    return {
        default: {
            "jassijs_localserver/DatabaseSchema.ts": {
                "date": 1622984213677
            },
            "jassijs_localserver/DBManager.ts": {
                "date": 1624103920275,
                "jassi_localserver.DBManager": {}
            },
            "jassijs_localserver/Filesystem.ts": {
                "date": 1625946455001,
                "jassijs_localserver.Filessystem": {}
            },
            "jassijs_localserver/Indexer.ts": {
                "date": 1627585602318
            },
            "jassijs_localserver/LocalProtocol.ts": {
                "date": 1624139285542
            },
            "jassijs_localserver/modul.ts": {
                "date": 1622998474045
            },
            "jassijs_localserver/RegistryIndexer.ts": {
                "date": 1624137198480,
                "jassijs_localserver.RegistryIndexer": {}
            },
            "jassijs_localserver/Testuser.ts": {
                "date": 1622984213666,
                "Testuser": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "firstname": {
                            "Column": []
                        },
                        "lastname": {
                            "Column": []
                        }
                    }
                }
            },
            "jassijs_localserver/TypeORMListener.ts": {
                "date": 1622998616949,
                "jassijs_localserver.TypeORMListener": {
                    "EventSubscriber": []
                }
            }
        }
    };
});
define("jassijs_localserver/ext/jszip", ["jszip"], function (JSZip) {
    JSZip.support.nodebuffer = undefined; //we hacked window.Buffer
    return {
        default: JSZip
    };
});
/*
define("jassijs_localserver/ext/typeorm-browser",["typeorm"], function(sql){

    //jassijs.myRequire("lib/skin-win8/ui.fancytree.min.css");
    //'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',

});*/ 
define("sha.js", [], () => { return {}; });
define("dotenv", [], () => { return {}; });
define("chalk", [], () => { return {}; });
define("cli-highlight", [], () => { return {}; });
define("events", [], () => { return {}; });
define("stream", [], () => { return {}; });
define("mkdirp", [], () => { return {}; });
define("glob", [], () => { return {}; });
define("app-root-path", [], () => { return {}; });
define("debug", [], () => { return {}; });
define("js-yaml", [], () => { return {}; });
define("xml2js", [], () => { return {}; });
define("path", [], () => { return {}; });
define("fs", [], () => { return {}; });
//"buffer":"https://cdn.jsdelivr.net/npm/buffer@6.0.3/index",
window.Buffer = class Buffer {
    static isBuffer(ob) {
        return false;
    }
};
window.global = window;
define("typeorm", ["typeorm/index", "typeorm/platform/PlatformTools", "window.SQL", "reflect-metadata"], function (to, pf, sql, buffer) {
    pf.PlatformTools.type = "browser";
    window.SQL = sql;
    return to;
});
/*
define("jassijs_localserver/ext/typeorm-browser",["typeorm"], function(sql){
   
    //jassijs.myRequire("lib/skin-win8/ui.fancytree.min.css");
    //'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',

});*/ 
//# sourceMappingURL=jassijs_localserver.js.map