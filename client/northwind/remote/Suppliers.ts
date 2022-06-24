import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
@$DBObject()
@$Class("northwind.Suppliers")
export class Suppliers extends DBObject {
    @PrimaryColumn()
    declare id: number;
    constructor() {
        super();
    } 
    @Column({	nullable: true})
    CompanyName: string;
    @Column({	nullable: true})
    ContactName: string;
    @Column({	nullable: true})
    ContactTitle: string;
    @Column({	nullable: true})
    Address: string;
    @Column({	nullable: true})
    City: string;
    @Column({	nullable: true})
    Region: string;
    @Column({	nullable: true})
    PostalCode: string;
    @Column({	nullable: true})
    Country: string;
    @Column({	nullable: true})
    Phone: string;
    @Column({	nullable: true})
    Fax: string;
    @Column({	nullable: true})
    HomePage: string;
}
export async function test() {
}
;
