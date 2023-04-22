import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { EntityOptions } from "jassijs/util/DatabaseSchema";
import { ValidationError } from "jassijs/remote/Validator";
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
export declare class DBObject extends RemoteObject {
    id: number | string;
    private static cache;
    private static _init;
    private static _initFunc;
    constructor();
    isAutoId(): boolean;
    static getFromCache(classname: string, id: number | string): DBObject;
    validate(options?: any, throwError?: boolean): Promise<ValidationError[]>;
    private static addToCache;
    static clearCache(classname: string): void;
    removeFromCache(): void;
    static _createObject(ob: any): DBObject;
    /**
     * replace all childs objects with {id:}
     */
    private _replaceObjectWithId;
    /**
    * save the object to jassijs.db
    */
    save(context?: Context): Promise<any>;
    _createObjectInDB(context?: Context): Promise<any>;
    static findOne(options?: any, context?: Context): Promise<DBObject>;
    static find(options?: MyFindManyOptions, context?: Context): Promise<DBObject[]>;
    /**
    * reload the object from jassijs.db
    */
    remove(context?: Context): Promise<any>;
    _getObjectProperty(dummy: any): void;
    _setObjectProperty(dummy: any, dumm1: any): void;
}
export declare function test(): Promise<void>;
