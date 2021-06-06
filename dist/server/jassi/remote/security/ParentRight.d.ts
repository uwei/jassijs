import { DBObject } from "jassi/remote/DBObject";
import { Group } from "jassi/remote/security/Group";
export declare class ParentRight extends DBObject {
    id: number;
    name: string;
    classname: string;
    i1: number;
    i2: number;
    s1: string;
    s2: string;
    groups: Group[];
}
