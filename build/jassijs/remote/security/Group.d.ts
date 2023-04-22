import { DBObject } from "jassijs/remote/DBObject";
import { ParentRight } from "jassijs/remote/security/ParentRight";
import { User } from "jassijs/remote/security/User";
import { Right } from "jassijs/remote/security/Right";
export declare class Group extends DBObject {
    id: number;
    name: string;
    parentRights: ParentRight[];
    rights: Right[];
    users: User[];
}
