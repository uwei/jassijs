import { DBObject } from "jassi/remote/DBObject";
import { Group } from "jassi/remote/security/Group";
export declare class Right extends DBObject {
    id: number;
    name: string;
    groups: Group[];
}
