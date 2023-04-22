import { DBObject } from "jassijs/remote/DBObject";
import { Group } from "jassijs/remote/security/Group";
export declare class Right extends DBObject {
    id: number;
    name: string;
    groups: Group[];
}
