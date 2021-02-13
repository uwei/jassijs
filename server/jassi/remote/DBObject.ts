import jassi, { $Class } from "jassi/remote/Jassi";
import { classes } from "jassi/remote/Classes";
import { RemoteObject } from "jassi/remote/RemoteObject";
import registry from "jassi/remote/Registry";
let cl = classes;//force Classes
import { Entity, EntityOptions } from "jassi/util/DatabaseSchema";
import { db } from "jassi/remote/Database";
   
export function $DBObject(options?: EntityOptions): Function {
    return function(pclass, ...params) {
    	var classname=classes.getClassName(pclass);
        if(!options)
            options={};
        if(!options.name)
            options.name=classname.toLowerCase().replaceAll(".","_");
        registry.register("$DBObject", pclass, options);
        Entity(options)(pclass, ...params);//pass to orginal Entitiy
    }
}

/**
* base class for all database entfities
* all objects which use the jassi.db must implement this
* @class DBObject
*/
@$Class("jassi.remote.DBObject")
export class DBObject extends RemoteObject {
    id: number|string;
    private static cache: { [classname: string]: { [id:string]: DBObject } } = {};

    constructor() {
        super();
    }
    public isAutoId() {
        var def = db.getMetadata(this.constructor);
        return def.id.PrimaryGeneratedColumn !== undefined;
    }
    public static getFromCache(classname:string,id:number|string):DBObject {
    	if(!DBObject.cache[classname])
    		return undefined;
    	return  DBObject.cache[classname][id.toString()];
    }
    public removeFromCache(){
    
        var clname = classes.getClassName(this);
        if(!DBObject.cache[clname])
        	return;
        delete DBObject.cache[clname][this.id.toString()];
    }
    public static _createObject(ob) {
        if (ob === undefined)
            return undefined;
        var cl = DBObject.cache[ob.__clname__];
        if (cl === undefined) {
            cl = {};
            DBObject.cache[ob.__clname__] = cl;
        }
        var ret = cl[ob.id];
        if (ret === undefined) {
            ret = new (classes.getClass(ob.__clname__))();
            cl[ob.id] = ret;
        }
        return ret;
    }
    //public id:number;

	/**
	 * replace all childs objects with {id:}
	 */
    private _replaceObjectWithId(obj: any): any {
        var ret = {}
        if (obj === undefined)
            return undefined;
        for (var key in obj) {
            ret[key] = obj[key];
            if (ret[key] !== undefined &&ret[key] !== null && ret[key].id !== undefined) {
                ret[key] = { id: ret[key].id };
            }
            if (Array.isArray(ret[key])) {
                ret[key] = [];
                for(var i = 0;i < obj[key].length;i++) {
                    ret[key].push(obj[key][i]);
                    if (ret[key][i] !== undefined && ret[key][i] !== null &&ret[key][i].id !== undefined) {
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
    async save() {
        if (!jassi.isServer) {
            if (this.id !== undefined) {
                var cname = classes.getClassName(this);
                var cl = DBObject.cache[cname];
                if (cl === undefined) {
                    cl = {};
                    DBObject.cache[cname] = cl;
                }

                if (cl[this.id] === undefined) {
                    cl[this.id] = this;//must be cached before inserting, so the new properties are introduced to the existing
                    if (this.isAutoId())
                        throw new Error("autoid - load the object  before saving or remove id");
                    else
                        return await this.call(this, "_createObjectInDB");//fails if the Object is saved before loading 
                } else {
                    if (cl[this.id] !== this) {
                        throw new Error("the object must be loaded before save");
                    }
                }
                cl[this.id] = this;//Update cache on save
                var h= await this.call(this._replaceObjectWithId(this), "save");
                this.id=h.id;
                return this;
            } else {
                if (!this.isAutoId()) {
                    throw new Error("error while saving the Id is not set");
                } else{
                	 var h= await this.call(this._replaceObjectWithId(this), "_createObjectInDB");
                	 this.id=h.id;
                	 DBObject.cache[classes.getClassName(this)][this.id]=this;
                    return this;
                }
            }
        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.save(this);
            // return ["jassi/base/ChromeDebugger.ts"];
        }
    }
    async _createObjectInDB() {
        if (!jassi.isServer) {
            throw new Error("createObject could oly be called on server");

        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.insert(this);
        }
    }
    static async findOne(options = undefined): Promise<DBObject> {
        if (!jassi.isServer) {
            return await this.call("findOne", options);
        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.findOne(this, options);
        }
    }
    static async find(options = undefined): Promise<DBObject[]> {
        if (!jassi.isServer) {
            return await this.call("find", options);
        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.find(this, options);
        }
    }
    /**
    * reload the object from jassi.db
    */
    async remove() {
        if (!jassi.isServer) {
            //@ts-ignore
            var cl = DBObject.cache[classes.getClassName(this)];
            if (cl !== undefined) {
                delete cl[this.id];
            }

            return await this.call({ id: this.id }, "remove");
        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            await man.remove(this);
        }
    }

    _getObjectProperty(dummy) {

    }
    _setObjectProperty(dummy, dumm1) {

    }
}

export async function test() {
    var h = db.getMetadata(classes.getClass("de.Kunde"));
   // debugger;
}
