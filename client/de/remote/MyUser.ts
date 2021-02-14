import {Entity, PrimaryColumn, Column} from "jassi/util/DatabaseSchema"; 
import { $DBObject } from "jassi/remote/DBObject";
import { $Class } from "jassi/remote/Jassi";


@$DBObject()
@Entity()
@$Class("de.MyUser")
export class MyUser{   

    @PrimaryColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

}