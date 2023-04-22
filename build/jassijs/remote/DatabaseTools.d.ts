import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
export declare class DatabaseTools extends RemoteObject {
    static runSQL(sql: string, parameter?: any[], context?: Context): Promise<any>;
    static dropTables(tables: string[]): Promise<string>;
}
export declare function test(): Promise<void>;
