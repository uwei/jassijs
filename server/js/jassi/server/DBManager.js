"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBManager = void 0;
const typeorm_1 = require("typeorm");
const Classes_1 = require("jassi/remote/Classes");
const Registry_1 = require("jassi/remote/Registry");
const User_1 = require("jassi/remote/security/User");
const getRequest_1 = require("./getRequest");
const parser = require('js-sql-parser');
const passwordIteration = 10000;
async function getConOpts() {
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
    var dbfiles = [];
    //files should be in the remote package
    /*try {
  
      var list: string[] = new Filesystem().dirFiles("../client/remote", [".ts"]);
      for (var x = 0; x < list.length; x++) {
        var test = fs.readFileSync(list[x], { encoding: 'utf-8' });
        if (test.indexOf("@$DBObject(") !== -1) {
          dbfiles.push(list[x].replace("..", "js").replace(".ts", ".js"));
        }
      }
    } catch {
      throw Error("could not read DBObject classes");
    }*/
    var dbobjects = await Registry_1.default.getJSONData("$DBObject");
    for (var o = 0; o < dbobjects.length; o++) {
        var fname = dbobjects[o].filename;
        dbfiles.push("js/" + fname.replace(".ts", ".js"));
    }
    var opt = {
        //@ts-ignore
        "type": stype,
        "host": shost,
        "port": iport,
        "username": suser,
        "password": spass,
        "database": sdb,
        "synchronize": true,
        //  logger:"advanced-console",
        //    maxQueryExecutionTime:
        "logging": false,
        "entities": dbfiles,
    };
    return opt;
}
var _instance = undefined;
var _initrunning = undefined;
/**
 * Database access with typeorm
 */
class DBManager {
    static async get() {
        if (_instance === undefined) {
            _instance = new DBManager();
            var test = typeorm_1.getMetadataArgsStorage();
            try {
                var opts = await getConOpts();
                _initrunning = typeorm_1.createConnection(opts);
                await _initrunning;
                await _instance.mySync();
            }
            catch (err1) {
                try {
                    _initrunning = undefined;
                    opts["ssl"] = true; //heroku need this
                    _initrunning = typeorm_1.createConnection(opts);
                    await _initrunning;
                    await _instance.mySync();
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
        }
        //wait for connection ready
        await _initrunning;
        return _instance;
    }
    async mySync() {
        var con = typeorm_1.getConnection();
        var schem = await Promise.resolve().then(() => require("typeorm/schema-builder/RdbmsSchemaBuilder"));
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
    static async destroyConnection() {
        if (_instance !== undefined)
            await typeorm_1.getConnection().close();
        _instance = undefined;
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().checks);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().columns);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().discriminatorValues);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().embeddeds);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().entityListeners);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().entityRepositories);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().entitySubscribers);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().exclusions);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().tables);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().generations);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().indices);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().inheritances);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().joinColumns);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().joinTables);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().namingStrategies);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().relationCounts);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().relationIds);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().relations);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().tables);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().transactionEntityManagers);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().transactionRepositories);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().trees);
        DBManager.clearArray(typeorm_1.getMetadataArgsStorage().uniques);
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
        return typeorm_1.getConnection();
    }
    async remove(entity) {
        var test = await (await DBManager.get()).checkParentRight(entity, [entity["id"]]);
        if (test === false)
            throw new Error("you are not allowed to delete " + Classes_1.classes.getClassName(entity) + " with id " + entity["id"]);
        await this.connection().manager.remove(entity);
    }
    async addSaveTransaction(entity) {
        if (entity.objecttransaction) {
            let ot = entity.objecttransaction;
            if (!ot.savelist) {
                ot.savelist = [entity];
                ot.saveresolve = [];
                ot.addFunctionFinally(async () => {
                    ot.savelist.forEach((ent) => {
                        delete ent.objecttransaction;
                    });
                    ot.savereturn = await this.connection().manager.save(ot.savelist);
                    for (let x = 0; x < ot.savereturn.length; x++) {
                        delete ot.savereturn[x].password;
                        ot.saveresolve[x](ot.savereturn[x]);
                    }
                });
            }
            else
                ot.savelist.push(entity);
            //entity.objecttransaction.addFunctionFinally(
            return new Promise((resolve) => {
                ot.saveresolve.push(resolve);
                ot.transactionResolved();
                ot.checkFinally();
            });
        }
    }
    /**
   * insert a new object
   * @param obj - the object to insert
   */
    async insert(obj) {
        await this._checkParentRightsForSave(obj);
        if (obj["objecttransaction"]) {
            return this.addSaveTransaction(obj);
        }
        //@ts-ignore
        var ret = await this.connection().manager.insert(obj.constructor, obj);
        //save also relations
        ret = await this.save(obj);
        return ret;
    }
    async save(entity, options) {
        await this._checkParentRightsForSave(entity);
        if (Classes_1.classes.getClassName(entity) === "jassi.remote.security.User" && entity.password !== undefined) {
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
        if (entity.objecttransaction && options === undefined) {
            return this.addSaveTransaction(entity);
        }
        var ret = await this.connection().manager.save(entity, options);
        delete entity.password;
        delete ret["password"];
        return ret;
    }
    async _checkParentRightsForSave(entity) {
        if (getRequest_1.getRequest().user.isAdmin)
            return;
        //Check if the object self has restrictions
        var cl = Classes_1.classes.getClass(Classes_1.classes.getClassName(entity));
        if (entity["id"] !== undefined) {
            var exist = await this.connection().manager.findOne(cl, entity["id"]);
            if (exist !== undefined) {
                var t = await this.checkParentRight(cl, [entity["id"]]);
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
                var t = await this.checkParentRight(cl, [data["id"]]);
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
                let t = await this.checkParentRight(cl, arr);
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
    async findOne(entityClass, p1, p2) {
        if (typeof p1 === "string" || typeof p1 === "number") { //search by id
            p1 = { id: p1 };
        }
        var ret = await this.find(entityClass, p1);
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
    async find(entityClass, p1) {
        //return this.connection().manager.findOne(entityClass,id,options);
        // else
        var options = p1;
        var clname = Classes_1.classes.getClassName(entityClass);
        var cl = Classes_1.classes.getClass(clname);
        var relations = new RelationInfo(clname, this);
        if (options)
            relations.addRelations(options.relations, true);
        var ret = await this.connection().manager.createQueryBuilder().
            select("me").from(cl, "me");
        if (options)
            ret = relations.addWhere(options.where, options.whereParams, ret);
        ret = relations.addWhereBySample(options, ret);
        ret = relations.join(ret);
        if (!getRequest_1.getRequest().user.isAdmin)
            ret = await relations.addParentRightDestriction(ret);
        var test = ret.getSql();
        return await ret.getMany();
        // return await this.connection().manager.find(entityClass, p1);
    }
    async createUser(username, password) {
        //var hh=getConnection().manager.findOne(User,{ email: username });
        if (await typeorm_1.getConnection().manager.findOne(User_1.User, { email: username }) !== undefined) {
            throw new Error("User already exists");
        }
        const user = new User_1.User();
        user.email = username;
        user.password = password;
        //first user would be admin
        if (await (await DBManager.get()).connection().manager.findOne(User_1.User) === undefined) {
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
        await (await DBManager.get()).save(user);
        delete user.password;
        return user;
    }
    async getUser(user, password) {
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
    async checkParentRight(entityClass, ids) {
        var clname = Classes_1.classes.getClassName(entityClass);
        var cl = Classes_1.classes.getClass(clname);
        var relations = new RelationInfo(clname, this);
        var ret = await this.connection().manager.createQueryBuilder().
            select("me").from(cl, "me");
        ret = relations.join(ret);
        ret.andWhere("me.id IN (:...ids)", { ids: ids });
        if (!getRequest_1.getRequest().user.isAdmin)
            ret = await relations.addParentRightDestriction(ret);
        var tt = ret.getSql();
        var test = await ret.getCount();
        return test === ids.length;
    }
}
exports.DBManager = DBManager;
class RelationInfo {
    constructor(className, dbmanager) {
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
        this.addRelationsFromParentRights("");
    }
    addRelationsFromParentRights(relationname) {
        var pr = this.relations[relationname];
        if (Registry_1.default.getMemberData("$CheckParentRight") !== undefined) {
            var data = Registry_1.default.getMemberData("$CheckParentRight")[pr.className];
            if (data !== undefined) {
                var membername = "";
                for (var key in data) {
                    membername = key;
                }
                var r = relationname + (relationname === "" ? "" : ".") + membername;
                this.addRelations([r], false);
                this.addRelationsFromParentRights(r);
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
    async addParentRightDestriction(builder) {
        var username = "a@b.com";
        var ret = builder;
        //first we get the sql from User-Rights we had to check 
        var kk = getRequest_1.getRequest().user;
        var userid = getRequest_1.getRequest().user.user;
        var query = this.dbmanager.connection().createQueryBuilder().
            select("me").from(Classes_1.classes.getClass("jassi.remote.security.ParentRight"), "me").
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
                                            sql = sql.replaceAll("me.", "me_" + relation.fullPath.replaceAll(".", "_") + ".");
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
    _checkExpression(node) {
        if (node.operator !== undefined) {
            this._parseNode(node);
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
                this.addRelations([pack], false);
        }
        var _this = this;
        if (node.type === "SimpleExprParentheses") {
            node.value.value.forEach(element => {
                _this._parseNode(element);
            });
        }
    }
    _parseNode(node) {
        if (node.operator !== undefined) {
            var left = node.left;
            var right = node.right;
            this._checkExpression(left);
            this._checkExpression(right);
        }
    }
    addWhereBySample(param, builder) {
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
                this.addRelations([pack], false);
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
    addWhere(sql, whereParams, builder) {
        var ret = builder;
        if (sql === undefined)
            return ret;
        var dummyselect = "select * from k where ";
        //we must replace because parsing Exception
        var ast = parser.parse(dummyselect + sql.replaceAll(":", "xxxparams"));
        this._parseNode(ast.value.where);
        var newsql = parser.stringify(ast).replaceAll("xxxparams", ":");
        ret.andWhere(newsql.substring(dummyselect.length), whereParams);
        return ret;
    }
    addRelations(relations, doselect) {
        if (relations === undefined)
            return;
        for (var z = 0; z < relations.length; z++) {
            var relation = relations[z];
            var all = relation.split(".");
            var curPath = "";
            var parent = "";
            var curClassname = this.className;
            for (var x = 0; x < all.length; x++) {
                curPath = curPath + (curPath === "" ? "" : ".") + all[x];
                if (this.relations[curPath] === undefined) {
                    //read type
                    var membername = (x === 0 ? curPath : "");
                    if (Registry_1.default.getMemberData("$CheckParentRight") !== undefined) {
                        var data = Registry_1.default.getMemberData("$CheckParentRight")[curClassname];
                        for (var key in data) {
                            membername = key;
                        }
                    }
                    var vdata = this.dbmanager.connection().getMetadata(Classes_1.classes.getClass(curClassname));
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
                }
                else if (doselect) {
                    this.relations[curPath].doSelect = true;
                }
                parent = curPath;
                curClassname = this.relations[curPath].className;
            }
        }
    }
}
Object.freeze(DBManager);
//# sourceMappingURL=DBManager.js.map