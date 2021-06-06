import { DBObject } from "jassi/remote/DBObject";
import { ParentRight } from "jassi/remote/security/ParentRight";
import { User } from "jassi/remote/security/User";
import { Right } from "jassi/remote/security/Right";
export declare class Group extends DBObject {
    id: number;
    name: string;
    parentRights: ParentRight[];
    rights: Right[];
    users: User[];
}
