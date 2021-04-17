var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes", "jassi/remote/DBArray"], function (require, exports, Jassi_1, Classes_1, DBArray_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Database = void 0;
    var cl = Classes_1.classes; //force import
    let Database = class Database {
        /**
         * database service
         * @class jassi.base.Database
         */
        constructor() {
            /** @member {jassi.base.Database.TypeResolver} holds typedefinitions for each type
             *  use  typeDef[sclassname]
             */
            this.typeDef = new TypeResolver(this);
            /**
             * @member {Object.<string,{Object.<number,jassi.base.DBObject>}>} holds all known databaseobjects
             * cache[typename][id]=ob
             **/
            this.cache = {};
        }
        /**
         * clears the cache
         */
        clearCache() {
            for (var key in this.cache) {
                this.cache[key] = {};
            }
        }
        /**
         * registers a database class
         * @param {string} - the name of the class
         * @param {class} - the class
         */
        register(name, data) {
            var cl = Classes_1.classes.getClass(name);
            cl.prototype._dbtype = name;
            this.typeDef.addClass(cl);
            this.cache[name] = {};
        }
        /**
         * uploads the type definition to the server
         * @param {jassi.base.Database.Type} the type definition
         */
        async uploadType(definition) {
            var sdef = JSON.stringify(definition, undefined, "\t");
            return Jassi_1.default.server.call("uploadType", sdef);
        }
        /**
         * reloads a database object
         * @param {DBObject} objectToReload - the object to reload
         * @returns {jassi.base.DBObject} - the reloaded object
         */
        async reload(objectToReload) {
            var type = objectToReload.__proto__._dbtype;
            var ret = await this.query(type, "id=" + objectToReload.id);
            if (ret.length > 0)
                return ret[0];
        }
        /**
         * loads a object from db
         * @param {string} type - the typename
         * @param {int} id - the id of the object, load all if undefined
         * @param [{string}] resolveFields - the fields to resolve
         * @returns {jassi.base.DBObject}
         */
        async load(type, id, resolveFields = undefined) {
            var sid = "id>0";
            if (id !== undefined)
                sid = "id=" + id;
            if (resolveFields === undefined)
                resolveFields = [];
            for (var x = 0; x < resolveFields.length; x++) { //add .this
                resolveFields[x] = (resolveFields[x].startsWith("this.") ? "" : "this.") + resolveFields[x];
            }
            var ret = await this.query(type, sid, resolveFields);
            if (id !== undefined)
                return (ret.length > 0) ? ret[0] : null;
            return ret;
        }
        /**
         * Child objects are not loaded completly. This loads the object completly.
         * @param {jassi.base.DBObject} ob - the object to resolve
         * @returns {jassi.base.DBObject|jassi.base.DBArray}
         */
        async resolve(ob) {
            if (ob !== undefined) {
                if (ob.unresolvedclassname !== undefined) {
                    var ret = await this._getMember(ob.parent, ob.member, ob.unresolvedclassname, ob.id);
                    //set linked object
                    /*        var link=this.typeDef.linkForField(ob.parent.__proto__._dbtype,ob.member);
                            
                            if(link!==undefined&&this.getTypeDef(ob.parent.__proto__._dbtype)[ob.member].type==="array"&&
                                     link.type!="array"){//array can not connected){
                                for(var x=0;x<ret.length;x++){
                                    var aob=ret[x];
                                    
                                    aob["_"+link.name]=ob.parent;
                                }
                            }else if(link!==undefined&&link.type==="object"){
                                ret["_"+link.name]=ob.parent;
                            }
                                */
                    if (ret instanceof DBArray_1.DBArray) {
                    }
                    return ret;
                }
                else
                    return ob;
            }
            //if(ob)
        }
        /**
         * Child objects are not loaded completly. This loads a object member of a object.
         * @param {DBObject} ob - the object
         * @param {string} member - the name of the member to load
         * @param {string} memberclassname - the typename of the member
         * @param {int|string} ids - the id or the ids (comma separated) e.g. id1,id2,id3
         * @returns {DBObject} - the resolved member
         */
        async _getMember(ob, member, memberclassname, ids) {
            if (ids === undefined || ids === null) {
                var data = {
                    id: ob.id,
                    type: ob.__proto__._dbtype,
                    member: member
                };
                var sret = await Jassi_1.default.server.call("getMember", data);
                var obret = await this._fromJSON(memberclassname, sret);
                return obret;
            }
            //we only need to expand ids
            var def = this.typeDef.getTypeDef(ob.__proto__._dbtype);
            var field = def[member];
            if (field.type === "object") {
                var test = db.cache[memberclassname][ids];
                if (test !== undefined)
                    return test;
                return (await this.query(memberclassname, "id in (" + ids + ")"))[0];
            }
            if (field.type === "array") {
                var ret = new Jassi_1.default.base.DBArray();
                var vids = ids.split(",");
                var idsToResolve = "";
                for (var x = 0; x < vids.length; x++) {
                    var test = db.cache[memberclassname][vids[x]];
                    if (test !== undefined)
                        ret.add(test);
                    else { //resolve
                        var T = Classes_1.classes.getClass(memberclassname);
                        ob = new T();
                        idsToResolve = idsToResolve + (idsToResolve === "" ? "" : ",") + vids[x];
                        this.cache[memberclassname][vids[x]] = ob;
                        ret.add(ob); //will be filled with cache
                    }
                }
                if (idsToResolve !== "")
                    await this.query(memberclassname, "id in (" + idsToResolve + ")")[0]; //would be resolved with cache
                return ret;
            }
            //var sret=jassi.server.call("getMember",data);
            //var obret= this._fromJSON(memberclassname,sret);
            return obret;
        }
        /**
         * createObjects from returned json array retObs
         */
        _createObjects(type, retObs, resolvedFields) {
            var ret = new Jassi_1.default.base.DBArray();
            for (var x = 0; x < retObs.length; x++) {
                var props = retObs[x];
                var ob = this.cache[type][props["id"]];
                if (ob === undefined) {
                    var T = Classes_1.classes.getClass(type);
                    ob = new T();
                    this.cache[type][props["id"]] = ob;
                }
                //all returned relations are set to null
                for (var f = 0; f < resolvedFields.length; f++) {
                    ob._setObjectProperty(resolvedFields[f], null);
                }
                for (var prop in props) {
                    // var prop=props[y];
                    var data = props[prop];
                    /*if(data!==null&&data.unresolvedclassname!==undefined){
                        var def= this.typeDef.getTypeDef(type);
                        var field=def[prop];
    
                        if(field.type==="object"){
                            var iscached=this.cache[field.usertype][data["id"]];
                            if(iscached!==undefined){
                                 ob._setObjectProperty(prop,iscached);
                                 continue;
                             }
                         }
                         data.parent=ob;
                         data.member=prop;
                         data.id=data["id"];
                         data.resolve=async function(){
                             var res=await jassi.db.resolve(this);
                             this.parent._setObjectProperty(this.member,res);
                             ret=this.parent._objectProperties[this.member];
                             return ret;
                         }
                         data.resolve.bind(data);
                         ob._setObjectProperty(prop,data);
                        
    
                    }else*/
                    ob[prop] = data;
                }
                ret.push(ob);
            }
            return ret;
        }
        /**
         * loads an object from a jsonstring
         * @param {string} type - the name of the type
         * @param {string} json - the json string
         * @returns {jassi.base.DBObject}
         */
        async _fromJSON(type, json) {
            //   if(json==undefined)
            //       return null;
            var data = JSON.parse(json);
            var retOb = data.result;
            var retObs = retOb;
            var resolvedFields = [];
            var allResolvedFields = [];
            for (var cl in data.relations) {
                for (var field in data.relations[cl]) {
                    var sfield = field.split(".")[1];
                    if (resolvedFields.indexOf(sfield) === -1)
                        resolvedFields.push(sfield);
                }
                allResolvedFields.push(field);
            }
            var ret = this._createObjects(type, retObs, resolvedFields);
            for (var cl in data.resolvedObjects) {
                resolvedFields = [];
                var arr = data.resolvedObjects[cl];
                var rels = data.relations[cl];
                //calc object members for the class which we would modify 
                for (var rel in rels) {
                    for (var test = 0; test < allResolvedFields.length; test++) {
                        if (allResolvedFields[test].indexOf(rel + ".") !== -1) {
                            var toAdd = allResolvedFields[test].substring((rel + ".").length);
                            toAdd = toAdd.split(".")[0];
                            if (resolvedFields.indexOf(toAdd) === -1) {
                                resolvedFields.push(toAdd);
                            }
                        }
                    }
                }
                this._createObjects(cl, arr, resolvedFields);
            }
            //setup relations
            for (var cl in data.relations) {
                for (var ffield in data.relations[cl]) {
                    var _field = ffield.split(".");
                    field = _field[field.length - 1];
                    var rels = data.relations[cl][ffield];
                    for (var id in rels) {
                        var ob = this.cache[cl][Number(id)];
                        var def = this.typeDef.getTypeDef(cl);
                        var ofield = def[field];
                        var fieldtype = ofield.usertype;
                        if (ofield.type === "object") {
                            var mob = this.cache[fieldtype][Number(rels[id])];
                            ob._setObjectProperty(field, mob);
                        }
                        else {
                            var arr = new Jassi_1.default.base.DBArray();
                            var adata = rels[id];
                            for (var x = 0; x < adata.length; x++) {
                                var mob = this.cache[fieldtype][Number(adata[x])];
                                arr.add(mob);
                            }
                            ob._setObjectProperty(field, arr);
                        }
                    }
                }
            }
            if (retOb.length === undefined)
                return ret[0];
            return ret;
        }
        /**
         * executes a database query
         * @param {string} type - the name of the returned type
         * @param {type} query - the query string
         * @param [{string}] resolveFields - the fields to resolve
         * @returns {jassi.base.DBArray}
         */
        async query(type, query, resolveFields = undefined) {
            var parameter = {
                type: type,
                resolve: resolveFields
            };
            var sret = await Jassi_1.default.server.call("query", query, parameter);
            var ret = await this._fromJSON(type, sret);
            return ret;
        }
        /**
         * save the object to database
         * @param {jassi.base.DBObject} ob - the object to save
         */
        async save(ob) {
            var parameter = { type: ob.__proto__._dbtype };
            var toSave = { id: ob.id };
            var type = this.typeDef.getTypeDef(ob.__proto__._dbtype);
            var test = this.cache[ob.__proto__._dbtype][ob.id];
            if (test !== undefined && test !== ob)
                throw "only one persistent instance could saved! Use reload to get the previous persistent instance";
            for (var member in type) {
                var field = type[member];
                if (member === "linkedfields" || member === "name" || member === "fields" || member === "_classname")
                    continue;
                if (field.type === "object") {
                    if (ob._objectProperties[member] !== undefined && ob._objectProperties[member].unresolvedclassname !== undefined)
                        continue; //member was not resolved so ignore it
                    if (ob[member] === undefined || ob[member] === null) {
                        toSave[member] = null;
                    }
                    else
                        toSave[member] = { id: ob[member].id };
                }
                else if (field.type === "array") {
                    if (ob._objectProperties[member] !== undefined && ob._objectProperties[member].unresolvedclassname !== undefined)
                        continue; //member was not resolved so ignore it
                    var arr = ob[member];
                    if (ob[member] === undefined || ob[member] === null) {
                        toSave[member] = null;
                        continue;
                    }
                    toSave[member] = [];
                    for (var x = 0; x < arr.length; x++) {
                        var child = arr[x];
                        toSave[member].push({ id: child.id });
                    }
                }
                else if (field.type === "int" || field.type === "string")
                    toSave[member] = ob[member];
                else {
                    throw "member " + field.name + "type can not be saved " + field.type;
                }
            }
            var sob = JSON.stringify(toSave, undefined, "\t");
            var ret = await Jassi_1.default.server.call("save", sob, parameter);
            if (!$.isNumeric(ret))
                throw ret;
            ob.id = Number(ret);
            this.cache[ob.__proto__._dbtype][ob.id] = ob;
            $.notify("saved", "info", { position: "right" });
        }
        /**
         * deletes an object in the database
         * @param {jassi.base.DBObject} ob - the object to remove
         */
        async remove(ob) {
            var parameter = { type: ob.__proto__._dbtype };
            return await Jassi_1.default.server.call("remove", { id: ob.id }, parameter);
        }
    };
    Database = __decorate([
        Jassi_1.$Class("jassi.base.Database"),
        __metadata("design:paramtypes", [])
    ], Database);
    exports.Database = Database;
    let TypeResolver = class TypeResolver {
        /**
         * database definition of database classes
         * @class jassi.base.Database.TypeResolver
         */
        constructor(db) {
            this.db = db;
        }
        /**
         * adds a class to resolver
         * @param {class} thisclass - the class to add
         */
        addClass(thisclass) {
            return;
            var classname = thisclass.prototype._dbtype;
            var sclassname = classname.replaceAll(".", "_");
            //var def=JSON.parse(ret.responseText);
            this[sclassname] = new Type(sclassname);
            var fields = thisclass._fields;
            for (var x = 0; x < fields.length; x++) {
                var jf = fields[x];
                var field = new Field(jf.name, jf.type, jf.usertype, jf.link);
                this[sclassname][field.name] = field;
                if (field.link !== undefined) {
                    this[sclassname].linkedfields[field.link] = field;
                }
            }
        }
        /**
        * types are linked if they
        * gets the linked for a field
        *
        */
        linkForField(classname, field) {
            var link = this.getTypeDef(classname)[field].link;
            if (link === undefined) {
                var test = this.getTypeDef(classname)[field].usertype;
                test = this.getTypeDef(test).linkedfields[classname + "." + field];
                if (test !== undefined) {
                    return test;
                }
            }
            else {
                var stypename = link.substring(0, link.lastIndexOf("."));
                var sfield = link.substring(link.lastIndexOf(".") + 1, link.length);
                return this.getTypeDef(stypename)[sfield];
            }
            return undefined;
        }
        getTypeDef(classname) {
            var sclassname = classname.replaceAll(".", "_");
            if (this[sclassname] === undefined) {
                //var def=JSON.parse(ret.responseText);
                this[sclassname] = new Jassi_1.default.base.Database.Type(sclassname);
                debugger;
                alert("is the next line right?");
                var def = this[sclassname];
                for (var x = 0; x < def.fields.length; x++) {
                    var jf = def.fields[x];
                    var field = new Jassi_1.default.base.Database.Field(jf.name, jf.type, jf.usertype, jf.link);
                    this[sclassname][field.name] = field;
                    if (field.link !== undefined) {
                        this[sclassname].linkedfields[field.link] = field;
                    }
                }
            }
            return this[sclassname];
        }
    };
    TypeResolver = __decorate([
        Jassi_1.$Class("jassi.base.Database.TypeResolver"),
        __metadata("design:paramtypes", [Object])
    ], TypeResolver);
    let Type = class Type {
        /**
     * type definition of database class
     * @class jassi.base.Database.Type
     */
        constructor(name) {
            /**
             * @member {string} - the name of the type
             */
            this.name = name;
            /**
             * @member {[jassi.base.Database.Field]} - the persistent fields
             */
            this.fields = undefined;
            /**
             * all linked fields
             * @member {Object.<string,jassi.base.Database.Field>} [classname+"."+field]
             */
            this.linkedfields = {};
        }
    };
    Type = __decorate([
        Jassi_1.$Class("jassi.base.Database.Type"),
        __metadata("design:paramtypes", [Object])
    ], Type);
    let Field = class Field {
        /**
     * type definition of database field
     * @class jassi.base.Database.Field
     */
        constructor(name, type, usertype, link) {
            /**
             * @member {string} - the name of the field
             */
            this.name = name;
            /**
             * @member {string} - the database type
             * oneof string,int,object,array
             */
            this.type = type;
            /**
             * @member {string} - must be defined by type array and object
             */
            this.usertype = usertype;
            /**
             * @member {string} - the type and fieldname of the linked field [type.member]
             * The field is linked to an other field and has no own sql-table.
             * e.g.  Customer.invoices  could be linked to Invoice.customer
             * Links can be set between fields of type array or object of the own or a different classes.
             * If two fields are linked - the link must be set on only one field.
             */
            this.link = link;
        }
    };
    Field = __decorate([
        Jassi_1.$Class("jassi.base.Database.Field"),
        __metadata("design:paramtypes", [Object, Object, Object, Object])
    ], Field);
    var db = new Database();
    exports.default = db;
    Jassi_1.default.test = async function () {
        var all = await db.load("de.Kunde", undefined, ["rechnungen", "rechnungen.zeilen", "rechnungen.zeilen.ar"]);
        //var all=await jassi.db.load("de.ARZeile",undefined,["ar"]);
        all = all;
        //jassi.server.call("testQuery");
    };
});
//# sourceMappingURL=Database.js.map
//# sourceMappingURL=Database.js.map