import {Entity, PrimaryColumn, Column} from "jassijs/util/DatabaseSchema"; 
import { $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Jassi";


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