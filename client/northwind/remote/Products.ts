import { Categories } from "northwind/remote/Categories";
import { Suppliers } from "northwind/remote/Suppliers";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { ValidateIsBoolean, ValidateIsInstanceOf, ValidateIsInt, ValidateIsNumber, ValidateIsString } from "jassijs/remote/Validator";
@$DBObject()
@$Class("northwind.Products")
export class Products extends DBObject {
    @ValidateIsInt({optional:true})
    @PrimaryColumn()
    declare id: number;
    constructor() {
        super();
    }
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    ProductName: string;

    @ValidateIsInstanceOf({type:type=>Suppliers})
    @ManyToOne(type => Suppliers)
    Supplier: Suppliers;

    @ValidateIsInstanceOf({type:c=>Categories})
    @ManyToOne(type => Categories, e=>e.Products)
    Category: Categories;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    QuantityPerUnit: string;
    
    @ValidateIsNumber({optional:true})
    @Column({ nullable: true, type: "decimal" })
    UnitPrice: number;

    @ValidateIsNumber({optional:true})
    @Column({ nullable: true })
    UnitsInStock: number;
    
    @ValidateIsNumber({optional:true})
    @Column({ nullable: true })
    UnitsOnOrder: number;
    
    @ValidateIsNumber({optional:true})
    @Column({ nullable: true })
    ReorderLevel: number;
    
    @ValidateIsBoolean()
    @Column({ nullable: true })
    Discontinued: boolean;
}
export async function test() {
    var p: Products = <Products>await Products.findOne();
   
}
;
