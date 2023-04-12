import { Products } from "northwind/remote/Products";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";
@$DBObject()
@$Class("northwind.Categories")
export class Categories extends DBObject {
    @ValidateIsInt({optional:true})
    @PrimaryColumn()
    declare id: number;
    constructor() {
        super();
    }
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    CategoryName: string;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    Description: string;

    @ValidateIsString()
    @Column()
    Picture: string;

    @OneToMany(type => Products, e => e.Category)
    Products: Products;
}
export async function test() {


}
;
