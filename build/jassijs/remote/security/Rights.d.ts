import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
export declare class RightProperties {
    name: string;
    description?: string;
}
export declare class ParentRightProperties {
    name: string;
    description?: {
        text: string;
        [parametername: string]: string;
    };
    sqlToCheck: string;
}
export declare function $Rights(rights: RightProperties[]): Function;
export declare function $ParentRights(rights: [ParentRightProperties]): Function;
export declare function $CheckParentRight(): Function;
export declare class Rights extends RemoteObject {
    private _isAdmin;
    isAdmin(context?: Context): Promise<boolean>;
}
declare var rights: Rights;
export default rights;
