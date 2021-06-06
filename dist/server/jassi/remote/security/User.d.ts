import { DBObject } from "jassi/remote/DBObject";
import { Group } from "jassi/remote/security/Group";
import { Context } from "jassi/remote/RemoteObject";
export declare class User extends DBObject {
    id: number;
    email: string;
    password: string;
    groups: Group[];
    isAdmin: boolean;
    /**
   * reload the object from jassi.db
   */
    hallo(context?: Context): Promise<any>;
    save(): Promise<any>;
}
export declare function test(): Promise<void>;
export declare function test2(): Promise<void>;
