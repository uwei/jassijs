import {Entity, PrimaryColumn, Column} from "jassijs/util/DatabaseSchema"; 
import { $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";


@$DBObject()
@Entity()
@$Class("de.MyUser")
export class MyUser{   

    @PrimaryColumn()
    declare id: number;

    @Column()
    firstName: string;
 
    @Column()
    lastName: string;

    @Column()
    age: number;

}