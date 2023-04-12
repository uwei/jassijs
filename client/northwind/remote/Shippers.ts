import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";
@$DBObject()
@$Class("northwind.Shippers")
export class Shippers extends DBObject {
    @ValidateIsInt({optional:true})
    @PrimaryColumn()
    declare id: number;
    constructor() {
        super();
    }

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    CompanyName: string;

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    Phone: string; 
}
export async function test() {
}
;
