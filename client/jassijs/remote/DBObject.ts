import { $Class } from "jassijs/remote/Registry";
import { classes, JassiError } from "jassijs/remote/Classes";
import { Context,  RemoteObject } from "jassijs/remote/RemoteObject";
import registry from "jassijs/remote/Registry";
let cl = classes;//force Classes
import { Entity, EntityOptions } from "jassijs/util/DatabaseSchema";
import { db } from "jassijs/remote/Database";
import { validate, ValidationError} from "jassijs/remote/Validator";
import { serverservices } from "jassijs/remote/Serverservice";


export function $DBObject(options?: EntityOptions): Function {
    return function (pclass, ...params) {
        var classname = classes.getClassName(pclass);
        if (!options)
            options = {};
        if (!options.name)
            options.name = classname.toLowerCase().replaceAll(".", "_");
        registry.register("$DBObject", pclass, options);
        //@ts-ignore
        Entity(options)(pclass, ...params);//pass to orginal Entitiy
    }
}
export class MyFindManyOptions {
    relations?: string[];
    [sampleproperty: string]: any;
    /**
     * 
     * where e.g. id>5
     */
    where?: string;
    /**
     * e.g. where:"id>:param" ,whereParams:{param:5}
     */
    whereParams?: any;
    /**
   * Offset (paginated) where from entities should be taken.
   */
    skip?: number;
    /**
     * Limit (paginated) - max number of entities should be taken.
     */
    take?: number;
    /**
    * Order, in which entities should be ordered.
    */
    order?: {
        [field: string]: "ASC" | "DESC" | 1 | -1;
    };
}
/**
* base class for all database entfities
* all objects which use the jassijs.db must implement this
* @class DBObject
*/
@$Class("jassijs.remote.DBObject")
export class DBObject {
    id: number | string;
    private static cache: { [classname: string]: { [id: string]: DBObject } } = {};
    private static _init = DBObject._initFunc();
    //clear cache on reload
    private static _initFunc() {

        registry.onregister("$Class", (data: new (...args: any[]) => any, name: string) => {
            delete DBObject.cache[name];
        });
    }

   
    public isAutoId() {
        var h = db;
        var def = db.getMetadata(this.constructor)?.fields;
        return def.id.PrimaryGeneratedColumn !== undefined;
    }
    public static getFromCache(classname: string, id: number | string): DBObject {
        if (!DBObject.cache[classname])
            return undefined;
        return DBObject.cache[classname][id.toString()];
    }
    public async validate(options = undefined, throwError = false): Promise<ValidationError[]> {
        var ret = validate(this, options, throwError);
        return ret; 
    }
    private static addToCache(ob) {
        if (ob === undefined)
            return undefined;
        var clname = classes.getClassName(ob);
        var cl = DBObject.cache[clname];
        if (cl === undefined) {
            cl = {};
            DBObject.cache[clname] = cl;
        }
        cl[ob.id] = ob;
    }
    public static clearCache(classname: string) {
        DBObject.cache[classname] = {};
    }
    public removeFromCache() {

        var clname = classes.getClassName(this);
        if (!DBObject.cache[clname])
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
    async save(context:Context=undefined) {
        let ttest=9992;
        try {
            await this.validate({
                delegateOptions: {
                    ValidateIsInstanceOf: { alternativeJsonProperties: ["id"] },
                    ValidateIsArray: { alternativeJsonProperties: ["id"] }
                }
            });
            console.log("now"); 
            
        } catch(err) {
            debugger;
            console.log("error"+err);
        }
        if (!context?.isServer) {
            if (this.id !== undefined) {
                var cname = classes.getClassName(this);
                /* var cl = DBObject.cache[cname];
                 if (cl === undefined) {
                     cl = {};
                     DBObject.cache[cname] = cl;
                 }*/
                var cached = DBObject.getFromCache(cname, this.id);
                if (cached === undefined) {
                    DBObject.addToCache(this);//must be cached before inserting, so the new properties are introduced to the existing
                    if (this.isAutoId())
                        throw new JassiError("autoid - load the object  before saving or remove id");
                    else
                        return await RemoteObject.docall(this, this._createObjectInDB,...arguments);
                    //}//fails if the Object is saved before loading 
                } else {
                    if (cached !== this) {
                        throw new JassiError("the object must be loaded before save");
                    }
                }
                DBObject.addToCache(this);
                //                cl[this.id] = this;//Update cache on save
                var newob = this._replaceObjectWithId(this);
                var id = await RemoteObject.docallWithReplaceThis(newob, this, this.save,...arguments);
                this.id = id;
                return this;
            } else {
                if (!this.isAutoId()) {
                    throw new JassiError("error while saving the Id is not set");
                } else {
                    var newob = this._replaceObjectWithId(this);
                    var h = await RemoteObject.docallWithReplaceThis(newob, this, this._createObjectInDB,...arguments);
                    this.id = h;
                    DBObject.addToCache(this);
                    //                	 DBObject.cache[classes.getClassName(this)][this.id]=this;
                    return this;
                }
            }
        } else {
            return (await serverservices.db).save(context,this);
        }
    }
    async _createObjectInDB(context:Context=undefined) {
        if (!context?.isServer) {
            throw new JassiError("createObject could oly be called on server");

        } else {
            return (await serverservices.db).insert(context,this);
        }
    }
    //@UseServer()
    static async findOne(options = undefined,context:Context=undefined): Promise<DBObject> {
        if (!context?.isServer) {
            return RemoteObject.docall(this, this.findOne, ...arguments);
        } else {
            var db = await (serverservices.db);
            return db.findOne(context,this, options);
        }
    }
    // @UseServer()
    static async find(options: MyFindManyOptions = undefined,context:Context=undefined): Promise<DBObject[]> {
        if (!context?.isServer) {
            return RemoteObject.docall(this, this.find, ...arguments);
        } else {
            var db = await (serverservices.db);
            return db.find(context,this, <any>options);
        }

    }
    /**
    * reload the object from jassijs.db
    */
    async remove(context:Context=undefined) {
        if (!context?.isServer) {
            //@ts-ignore
            var cl = DBObject.cache[classes.getClassName(this)];
            if (cl !== undefined) {
                delete cl[this.id];
            }

            return await RemoteObject.docallWithReplaceThis({ id: this.id }, this, this.remove,...arguments);
        } else {
            //@ts-ignore
            return (await serverservices.db).remove(context,this);
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
