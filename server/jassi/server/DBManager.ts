import { ConnectionOptions, createConnection, getConnection, SaveOptions, FindConditions, FindOneOptions, ObjectType, ObjectID, FindManyOptions, Connection, SelectQueryBuilder, Brackets, EntitySchema, getMetadataArgsStorage, Entity } from "typeorm";
import { classes } from "jassi/remote/Classes";

import registry from "jassi/remote/Registry";
import { DBObject } from "jassi/remote/DBObject";
import { ParentRightProperties } from "jassi/remote/security/Rights";
import { User } from "jassi/remote/security/User";
import { getRequest } from "./getRequest";
const parser = require('js-sql-parser');
const passwordIteration = 10000;
import fs = require('fs');
import Filesystem from "jassi/server/Filessystem";

export interface MyFindManyOptions<Entity = any> extends FindManyOptions {
  whereParams?: any,
  [field: string]: any
}


async function getConOpts(): Promise<ConnectionOptions> {
  var stype: string = "postgres";
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

  var dbobjects = await registry.getJSONData("$DBObject");
  for (var o = 0; o < dbobjects.length; o++) {
    var fname = dbobjects[o].filename;

    dbfiles.push("js/" + fname.replace(".ts", ".js"));
  }
  var opt: ConnectionOptions = {

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
var _instance: DBManager = undefined;
var _initrunning = undefined;
/**
 * Database access with typeorm
 */
export class DBManager {

  public static async get(): Promise<DBManager> {

    if (_instance === undefined) {

      _instance = new DBManager();

      var test = getMetadataArgsStorage();
      try {
        var opts = await getConOpts();

        _initrunning = createConnection(opts);
        await _initrunning;
        await _instance.mySync();
      } catch (err1) {
        try {
          _initrunning = undefined;
          opts["ssl"] = true;//heroku need this
          _initrunning = createConnection(opts);
          await _initrunning;
          await _instance.mySync();
        } catch (err) {
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



  private async mySync() {
    var con = getConnection();
    var schem = await import("typeorm/schema-builder/RdbmsSchemaBuilder");
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
  public static async destroyConnection() {
    if (_instance !== undefined)
      await getConnection().close();
    _instance = undefined;
    DBManager.clearArray(getMetadataArgsStorage().checks);
    DBManager.clearArray(getMetadataArgsStorage().columns);
    DBManager.clearArray(getMetadataArgsStorage().discriminatorValues);
    DBManager.clearArray(getMetadataArgsStorage().embeddeds);
    DBManager.clearArray(getMetadataArgsStorage().entityListeners);
    DBManager.clearArray(getMetadataArgsStorage().entityRepositories);
    DBManager.clearArray(getMetadataArgsStorage().entitySubscribers);
    DBManager.clearArray(getMetadataArgsStorage().exclusions);
    DBManager.clearArray(getMetadataArgsStorage().tables);
    DBManager.clearArray(getMetadataArgsStorage().generations);
    DBManager.clearArray(getMetadataArgsStorage().indices);
    DBManager.clearArray(getMetadataArgsStorage().inheritances);
    DBManager.clearArray(getMetadataArgsStorage().joinColumns);
    DBManager.clearArray(getMetadataArgsStorage().joinTables);
    DBManager.clearArray(getMetadataArgsStorage().namingStrategies);
    DBManager.clearArray(getMetadataArgsStorage().relationCounts);
    DBManager.clearArray(getMetadataArgsStorage().relationIds);
    DBManager.clearArray(getMetadataArgsStorage().relations);
    DBManager.clearArray(getMetadataArgsStorage().tables);
    DBManager.clearArray(getMetadataArgsStorage().transactionEntityManagers);
    DBManager.clearArray(getMetadataArgsStorage().transactionRepositories);
    DBManager.clearArray(getMetadataArgsStorage().trees);
    DBManager.clearArray(getMetadataArgsStorage().uniques);

  }
  private static clearArray(arr: any[]) {
    while (arr.length > 0) {
      arr.pop();
    }
  }
  private constructor() {
    Object.freeze(_instance);
  }
  connection() {
    return getConnection();
  }
  async remove<Entity>(entity: Entity) {
    var test = await (await DBManager.get()).checkParentRight(entity, [entity["id"]]);
    if (test === false)
      throw new Error("you are not allowed to delete " + classes.getClassName(entity) + " with id " + entity["id"]);
    await this.connection().manager.remove(entity);
  }

  private async addSaveTransaction(entity) {
    if (entity.objecttransaction) {
      let ot = entity.objecttransaction;
      if (!ot.savelist) {
        ot.savelist = [entity];
        ot.saveresolve=[];
        ot.addFunctionFinally(async () => {
          ot.savelist.forEach((ent)=>{
            delete ent.objecttransaction;
          });
          ot.savereturn = await this.connection().manager.save(ot.savelist);
          for (let x = 0; x < ot.savereturn.length; x++) {
            delete ot.savereturn[x].password;
            ot.saveresolve[x](ot.savereturn[x]);
          }
        })
      } else
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
  async insert(obj: DBObject) {

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
  /**
  * Saves all given entities in the database.
  * If entities do not exist in the database then inserts, otherwise updates.
  */
  async save<Entity>(entities: Entity[], options?: SaveOptions): Promise<Entity[]>;
  /**
   * Saves all given entities in the database.
   * If entities do not exist in the database then inserts, otherwise updates.
   */
  async save<Entity>(entity: Entity, options?: SaveOptions): Promise<Entity>;
  async save<Entity>(entity, options) {
    await this._checkParentRightsForSave(entity);
    if (classes.getClassName(entity) === "jassi.remote.security.User" && entity.password !== undefined) {
      entity.password = await new Promise((resolve) => {
        const crypto = require('crypto');
        const salt = crypto.randomBytes(8).toString('base64');
        crypto.pbkdf2(entity.password, salt, passwordIteration, 512, 'sha512', (err, derivedKey) => {
          if (err) throw err;
          resolve(passwordIteration.toString() + ":" + salt + ":" + derivedKey.toString('base64'));//.toString('base64'));  // '3745e48...aa39b34'
        });
      })

    }
    if (entity.objecttransaction&&options===undefined) {
      return this.addSaveTransaction(entity);
    }
    var ret = await this.connection().manager.save(entity, options);
    delete entity.password;
    delete ret["password"];
    return ret;
  }
  private async _checkParentRightsForSave<Entity>(entity: Entity) {
    if(getRequest().user.isAdmin)
      return;
    //Check if the object self has restrictions
    var cl = classes.getClass(classes.getClassName(entity));
    if (entity["id"] !== undefined) {
      var exist = await this.connection().manager.findOne(cl, entity["id"]);
      if (exist !== undefined) {
        var t = await this.checkParentRight(cl, [entity["id"]]);
        if (!t) {
          throw new Error("you are not allowed to save " + classes.getClassName(cl) + " with id " + entity["id"]);
        }
      }
    }
    //check if the field of parentRight is set
    if (registry.getMemberData("$CheckParentRight") !== undefined) {
      var data = registry.getMemberData("$CheckParentRight")[classes.getClassName(entity)];
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
          throw new Error("you are not allowed to save " + classes.getClassName(cl) + " with id " + entity["id"] + " - no access to property " + rel.propertyName);
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
          throw new Error("you are not allowed to save " + classes.getClassName(cl) + " with id " + entity["id"] + " - no access to property " + rel.propertyName);
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
  findOne<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity>, id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  /**
   * Finds first entity that matches given find options.
   */
  findOne<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  /**
  * Finds first entity that matches given conditions.
  */
  findOne<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity>, conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
  /**
   * Finds first entity that matches given conditions.
   */
  async findOne<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity>, p1?: any, p2?: any): Promise<Entity | undefined> {
    if (typeof p1 === "string" || typeof p1 === "number") {//search by id
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
 * Finds entities that match given options.
 */
  async find<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity>, options?: MyFindManyOptions<Entity>): Promise<Entity[]>;

  /**
   * Finds entities that match given conditions.
   */
  async find<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity>, conditions?: FindConditions<Entity>): Promise<Entity[]>;


  /**
    * Finds first entity that matches given conditions.
    */
  async find<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity>, p1?: any): Promise<Entity[]> {
    //return this.connection().manager.findOne(entityClass,id,options);
    // else

    var options: MyFindManyOptions<Entity> = p1;
    var clname = classes.getClassName(entityClass);
    var cl = classes.getClass(clname);
    var relations = new RelationInfo(clname, this);
    if (options)
      relations.addRelations(options.relations, true);
    var ret = await this.connection().manager.createQueryBuilder().
      select("me").from(cl, "me");
    if (options)
      ret = relations.addWhere(<string>options.where, options.whereParams, ret);

    ret = relations.addWhereBySample(options, ret);
    ret = relations.join(ret);
    if (!getRequest().user.isAdmin)
      ret = await relations.addParentRightDestriction(ret);


    var test = ret.getSql();
    return await ret.getMany();
    // return await this.connection().manager.find(entityClass, p1);
  }
  public async createUser(username: string, password: string): Promise<User> {
    //var hh=getConnection().manager.findOne(User,{ email: username });
    if (await getConnection().manager.findOne(User, { email: username }) !== undefined) {
      throw new Error("User already exists");
    }

    const user = new User();
    user.email = username;
    user.password = password;
    //first user would be admin

    if (await (await DBManager.get()).connection().manager.findOne(User) === undefined) {
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

  async getUser(user: string, password) {

    /* const users = await this.connection().getRepository(User)
     .createQueryBuilder()
     .select("user.id", "id")
     //.addSelect("user.password")
     .getMany();*/
    var ret = await this.connection().manager.createQueryBuilder().
      select("me").from(User, "me").addSelect("me.password").
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
        if (err) throw err;
        resolve(passwordIteration.toString() + ":" + salt + ":" + derivedKey.toString('base64'));//.toString('base64'));  // '3745e48...aa39b34'
      });
    })

    if (test === auser.password) {
      delete auser.password;
      return auser;
    } else {
      delete auser.password;
    }
    return undefined;
  }
  async checkParentRight(entityClass, ids: any[]): Promise<boolean> {

    var clname = classes.getClassName(entityClass);
    var cl = classes.getClass(clname);
    var relations = new RelationInfo(clname, this);

    var ret = await this.connection().manager.createQueryBuilder().
      select("me").from(cl, "me");

    ret = relations.join(ret);
    ret.andWhere("me.id IN (:...ids)", { ids: ids });
    if (!getRequest().user.isAdmin)
      ret = await relations.addParentRightDestriction(ret);
    var tt = ret.getSql();

    var test = await ret.getCount();
    return test === ids.length;
  }



}

class RelationInfo {
  className: string;
  dbmanager: DBManager;
  counter = 100;
  relations: {
    [path: string]: {
      name: string,
      className: string,
      fullPath: string,
      parentRights?: ParentRightProperties[],
      doSelect: boolean
    }
  }
  constructor(className: string, dbmanager: DBManager) {
    this.className = className;
    this.dbmanager = dbmanager
    this.relations = {};
    var testPR = registry.getData("$ParentRights", className);
    this.relations[""] = {
      name: "",
      className: className,
      fullPath: "",
      parentRights: (testPR.length !== 0 ? testPR[0].params[0] : undefined),
      doSelect: true
    }
    this.addRelationsFromParentRights("");
  }

  private addRelationsFromParentRights(relationname: string) {
    var pr = this.relations[relationname];
    if (registry.getMemberData("$CheckParentRight") !== undefined) {
      var data = registry.getMemberData("$CheckParentRight")[pr.className];
      if (data !== undefined) {
        var membername = "";
        for (var key in data) {
          membername = key;
        }
        var r = relationname + (relationname === "" ? "" : ".") + membername
        this.addRelations([r], false);
        this.addRelationsFromParentRights(r);
      }
    }


  }
  private _getRelationFromProperty(property: string): string {
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
  join<Entity>(builder: SelectQueryBuilder<Entity>): SelectQueryBuilder<Entity> {
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
  async addParentRightDestriction<Entity>(builder: SelectQueryBuilder<Entity>): Promise<SelectQueryBuilder<Entity>> {
    var username = "a@b.com";
    var ret = builder;
    //first we get the sql from User-Rights we had to check 
    var kk = getRequest().user;
    var userid = getRequest().user.user;
    var query = this.dbmanager.connection().createQueryBuilder().
      select("me").from(classes.getClass("jassi.remote.security.ParentRight"), "me").
      leftJoin("me.groups", "me_groups").
      leftJoin("me_groups.users", "me_groups_users");

    query = query.andWhere("me_groups_users.id=:theUserId", { theUserId: userid });


    var doBr = false;
    query = query.andWhere(new Brackets((entr) => {
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
        ret = ret.andWhere(new Brackets((qu) => {
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
              qu.andWhere("me.id>1 and me.id<1", param);//no right exists
            }
          }
        }));

      }
    }

    return ret;
  }
  private _checkExpression(node) {
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
  private _parseNode(node) {
    if (node.operator !== undefined) {
      var left = node.left;
      var right = node.right;
      this._checkExpression(left);
      this._checkExpression(right);
    }

  }
  addWhereBySample<Entity>(param: any, builder: SelectQueryBuilder<Entity>): SelectQueryBuilder<Entity> {

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
      ret = ret.andWhere(field + "=:" + placeholder, par)
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
  addWhere<Entity>(sql: string, whereParams: any, builder: SelectQueryBuilder<Entity>): SelectQueryBuilder<Entity> {
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

  addRelations(relations: string[], doselect: boolean) {
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
          if (registry.getMemberData("$CheckParentRight") !== undefined) {
            var data = registry.getMemberData("$CheckParentRight")[curClassname];
            for (var key in data) {
              membername = key;
            }
          }
          var vdata = this.dbmanager.connection().getMetadata(classes.getClass(curClassname));
          for (var r = 0; r < vdata.relations.length; r++) {
            var rel = vdata.relations[r];
            if (rel.propertyName === membername) {
              var clname = classes.getClassName(rel.type);
              var testPR = registry.getData("$ParentRights", clname);
              this.relations[curPath] = {
                className: classes.getClassName(rel.type),
                name: membername,
                fullPath: curPath,
                parentRights: (testPR.length !== 0 ? testPR[0].params[0] : undefined),
                doSelect: doselect
              }
            }
          }
        } else if (doselect) {
          this.relations[curPath].doSelect = true;
        }

        parent = curPath;
        curClassname = this.relations[curPath].className;
      }
    }
  }
}
Object.freeze(DBManager);