import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { Test } from "./Test";
declare global {
    export interface KnownSettings {
    }
}
export declare class Settings extends RemoteObject {
    static keys: KnownSettings;
    private static browserSettings;
    private static userSettings;
    private static allusersSettings;
    /**
    * loads the settings
    */
    static load(context?: Context): Promise<{
        user: any;
        allusers: any;
    }>;
    static getAll(scope: "browser" | "user" | "allusers"): {};
    gets<T>(Settings_key: T): T;
    static remove(Settings_key: string, scope: "browser" | "user" | "allusers", context?: Context): Promise<void>;
    static save<T>(Settings_key: T, value: T, scope: "browser" | "user" | "allusers"): Promise<any>;
    static saveAll(namevaluepair: {
        [key: string]: any;
    }, scope: "browser" | "user" | "allusers", removeOtherKeys?: boolean, context?: Context): Promise<any>;
}
declare var settings: Settings;
export { settings };
export declare function $SettingsDescriptor(): Function;
export declare function autostart(): Promise<void>;
export declare function test(t: Test): Promise<void>;
export declare function load(): Promise<{
    user: any;
    allusers: any;
}>;
