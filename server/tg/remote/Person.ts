import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
@$DBObject()
@$Class("tg.Person")
export class Person extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super();
    }
    @Column()
    name: string;
}
export async function test() {
    var j=new Person();
    j.id=9;
    j.name="Klaus";
    await j.save();
    var all=await Person.find();
    debugger;
}
;
