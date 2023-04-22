import { DBObject, MyFindManyOptions } from "jassijs/remote/DBObject";
import { Context } from "jassijs/remote/RemoteObject";
export declare class Setting extends DBObject {
    id: number;
    constructor();
    data: string;
    save(context?: Context): Promise<void>;
    static findOne(options?: any, context?: Context): Promise<DBObject>;
    static find(options?: MyFindManyOptions, context?: Context): Promise<DBObject[]>;
    /**
    * reload the object from jassijs.db
    */
    remove(context?: Context): Promise<void>;
}
export declare function test(): Promise<void>;
