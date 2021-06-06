import { DBObject, MyFindManyOptions } from "jassi/remote/DBObject";
import { Context } from "jassi/remote/RemoteObject";
export declare class Setting extends DBObject {
    id: number;
    constructor();
    data: string;
    save(context?: Context): Promise<void>;
    static findOne(options?: any, context?: Context): Promise<DBObject>;
    static find(options?: MyFindManyOptions, context?: Context): Promise<DBObject[]>;
    /**
    * reload the object from jassi.db
    */
    remove(context?: Context): Promise<void>;
}
export declare function test(): Promise<void>;
