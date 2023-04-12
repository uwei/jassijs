import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";
@$DBObject()
@$Class("northwind.Suppliers")
export class Suppliers extends DBObject {
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
    ContactName: string;

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    ContactTitle: string;

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    Address: string;

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    City: string;

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    Region: string;

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    PostalCode: string;

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    Country: string;

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    Phone: string;

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    Fax: string;

    @ValidateIsString({optional:true})
    @Column({	nullable: true})
    HomePage: string;
}
export async function test() {
}
;

function ValidateIsIntn(arg0: { optional: boolean; }) {
throw new Error("Function not implemented.");
}
