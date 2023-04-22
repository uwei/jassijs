import { DBObject } from "jassijs/remote/DBObject";
export declare class DBObjectQueryProperties {
    name: string;
    description?: string;
}
export declare function $DBObjectQuery(property: DBObjectQueryProperties): Function;
export declare class DBObjectQuery {
    classname: string;
    name: string;
    description: string;
    _function: any;
    execute(): Promise<DBObject>;
    static getQueries(classname: string): Promise<DBObjectQuery[]>;
}
export declare function test(): Promise<void>;
