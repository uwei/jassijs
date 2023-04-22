import { ConnectionOptions, SaveOptions, FindConditions, FindOneOptions, ObjectType, ObjectID, FindManyOptions, Connection, EntitySchema } from "typeorm";
import { DBObject } from "jassijs/remote/DBObject";
import { User } from "jassijs/remote/security/User";
import { Context } from "jassijs/remote/RemoteObject";
export interface MyFindManyOptions<Entity = any> extends FindManyOptions {
    whereParams?: any;
    onlyColumns?: string[];
    order: {
        [field: string]: "ASC" | "DESC";
    };
}
declare global {
    export interface Serverservice {
        db: Promise<DBManager>;
    }
}
export declare class DBManager {
    waitForConnection: Promise<DBManager>;
    static getConOpts(): Promise<ConnectionOptions>;
    private static _get;
    private open;
    private mySync;
    private static clearMetadata;
    renewConnection(): Promise<void>;
    destroyConnection(waitForCompleteOpen?: boolean): Promise<void>;
    private static clearArray;
    private constructor();
    connection(): Connection;
    runSQL(context: Context, sql: string, parameters?: any[]): Promise<any>;
    remove<Entity>(context: Context, entity: Entity): Promise<void>;
    private addSaveTransaction;
    /**
   * insert a new object
   * @param obj - the object to insert
   */
    insert(context: Context, obj: DBObject): Promise<any>;
    /**
    * Saves all given entities in the database.
    * If entities do not exist in the database then inserts, otherwise updates.
    */
    save<Entity>(context: Context, entities: Entity[], options?: SaveOptions): Promise<Entity[]>;
    /**
     * Saves all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    save<Entity>(context: Context, entity: Entity, options?: SaveOptions): Promise<Entity>;
    private _checkParentRightsForSave;
    findOne<Entity>(context: Context, entityClass: ObjectType<Entity> | EntitySchema<Entity>, id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given find options.
     */
    findOne<Entity>(context: Context, entityClass: ObjectType<Entity> | EntitySchema<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
    * Finds first entity that matches given conditions.
    */
    findOne<Entity>(context: Context, entityClass: ObjectType<Entity> | EntitySchema<Entity>, conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
   * Finds entities that match given options.
   */
    find<Entity>(context: Context, entityClass: ObjectType<Entity> | EntitySchema<Entity>, options?: MyFindManyOptions<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     */
    find<Entity>(context: Context, entityClass: ObjectType<Entity> | EntitySchema<Entity>, conditions?: FindConditions<Entity>): Promise<Entity[]>;
    private resolveWildcharInRelations;
    createUser(context: Context, username: string, password: string): Promise<User>;
    login(context: Context, user: string, password: any): Promise<unknown>;
    checkParentRight(context: Context, entityClass: any, ids: any[]): Promise<boolean>;
}
