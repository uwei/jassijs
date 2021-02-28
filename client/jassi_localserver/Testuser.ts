import { Column, PrimaryColumn } from "jassi/util/DatabaseSchema";
import { Entity} from "jassi/util/DatabaseSchema";
import { $DBObject } from "jassi/remote/DBObject";
import { $Class } from "jassi/remote/Jassi";

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