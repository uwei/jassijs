import jassi, { $Class } from "jassi/remote/Jassi";
import { classes } from "jassi/remote/Classes";
import { Context, RemoteObject } from "jassi/remote/RemoteObject";
import registry from "jassi/remote/Registry";
let cl = classes;//force Classes
import { Entity, EntityOptions } from "jassi/util/DatabaseSchema";
import { db } from "jassi/remote/Database";
import { Transaction } from "jassi/remote/Transaction";
   
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
export class MyFindManyOptions{
    relations?:string[];
    [sampleproperty:string]:any;
    /**
     * 
     * where e.g. id>5
     */
    where?:string;
    /**
     * e.g. where:"id>:param" ,whereParams:{param:5}
     */
    whereParams?:any;
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
    async save(context:Context=undefined) {
        if (!context?.isServer) {
            if (this.id !== undefined) {
                var cname = classes.getClassName(this);
                var cl = DBObject.cache[cname];
                if (cl === undefined) {
                    cl = {};
                    DBObject.cache[cname] = cl;
                }

                if (cl[this.id] === undefined) {
                    cl[this.id] = this;//must be cached before inserting, so the new properties are introduced to the existing
                    /*if (this.isAutoId())
                        throw new Error("autoid - load the object  before saving or remove id");
                    else{*/
                        return await this.call(this,this._createObjectInDB,context);
                    //}//fails if the Object is saved before loading 
                } else {
                    if (cl[this.id] !== this) {
                        throw new Error("the object must be loaded before save");
                    }
                }
                cl[this.id] = this;//Update cache on save
                var newob=this._replaceObjectWithId(this);
                var id= await this.call(newob, this.save,context);
                this.id=id;
                return this;
            } else {
                if (!this.isAutoId()) {
                    throw new Error("error while saving the Id is not set");
                } else{
                     var newob=this._replaceObjectWithId(this);
                	 var h= await this.call(newob, this._createObjectInDB,context);
                	 this.id=h.id;
                	 DBObject.cache[classes.getClassName(this)][this.id]=this;
                    return this;
                }
            }
        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.save(context,this);
            // return ["jassi/base/ChromeDebugger.ts"];
        }
    }
    async _createObjectInDB(context:Context=undefined) {
        if (!context?.isServer) {
            throw new Error("createObject could oly be called on server");

        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.insert(context,this);
        }
    }
    static async findOne(options = undefined,context:Context=undefined): Promise<DBObject> {
        if (!context?.isServer) {
            return await this.call(this.findOne, options,context);
        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.findOne(context,this, options);
        }
    }
    static async find(options:MyFindManyOptions = undefined,context:Context=undefined): Promise<DBObject[]> {
        if (!context?.isServer) {
            return await this.call(this.find, options,context);
        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.find(context,this, options);
        }
    }
    /**
    * reload the object from jassi.db
    */
    async remove(context:Context=undefined) {
        if (!context?.isServer) {
            //@ts-ignore
            var cl = DBObject.cache[classes.getClassName(this)];
            if (cl !== undefined) {
                delete cl[this.id];
            }

            return await this.call({ id: this.id }, this.remove,context);
        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            await man.remove(context,this);
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
