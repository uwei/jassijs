import { Context, RemoteObject } from "jassi/remote/RemoteObject";
import { EntityOptions } from "jassi/util/DatabaseSchema";
export declare function $DBObject(options?: EntityOptions): Function;
export declare class MyFindManyOptions {
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
}
/**
* base class for all database entfities
* all objects which use the jassi.db must implement this
* @class DBObject
*/
export declare class DBObject extends RemoteObject {
    id: number | string;
    private static cache;
    private static _init;
    private static _initFunc;
    constructor();
    isAutoId(): boolean;
    static getFromCache(classname: string, id: number | string): DBObject;
    removeFromCache(): void;
    static _createObject(ob: any): DBObject;
    /**
     * replace all childs objects with {id:}
     */
    private _replaceObjectWithId;
    /**
    * save the object to jassi.db
    */
    save(context?: Context): Promise<any>;
    _createObjectInDB(context?: Context): Promise<any>;
    static findOne(options?: any, context?: Context): Promise<DBObject>;
    static find(options?: MyFindManyOptions, context?: Context): Promise<DBObject[]>;
    /**
    * reload the object from jassi.db
    */
    remove(context?: Context): Promise<any>;
    _getObjectProperty(dummy: any): void;
    _setObjectProperty(dummy: any, dumm1: any): void;
}
export declare function test(): Promise<void>;
