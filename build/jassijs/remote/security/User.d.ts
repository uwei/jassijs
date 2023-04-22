import { DBObject } from "jassijs/remote/DBObject";
import { Group } from "jassijs/remote/security/Group";
import { Context } from "jassijs/remote/RemoteObject";
export declare class User extends DBObject {
    id: number;
    email: string;
    password: string;
    groups: Group[];
    isAdmin: boolean;
    static findWithRelations(): Promise<any>;
    /**
   * reload the object from jassijs.db
   */
    hallo(context?: Context): Promise<any>;
    save(context?: Context): Promise<any>;
}
export declare function test(): Promise<void>;
export declare function test2(): Promise<void>;
