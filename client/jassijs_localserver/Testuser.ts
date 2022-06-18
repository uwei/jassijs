import { Column, PrimaryColumn } from "jassijs/util/DatabaseSchema";
import { Entity} from "jassijs/util/DatabaseSchema";
import { $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";

@$DBObject()
@$Class("Testuser")
export class Testuser{
     @PrimaryColumn()
    id: number;
    @Column()
    firstname: string;
    @Column()
    lastname: string; 
}