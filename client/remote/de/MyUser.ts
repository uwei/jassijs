import {Entity, PrimaryColumn, Column} from "jassi/util/DatabaseSchema"; 
import { $DBObject } from "remote/jassi/base/DBObject";
import { $Class } from "remote/jassi/base/Jassi";


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