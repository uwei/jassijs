import { Products } from "northwind/remote/Products";
import { Orders } from "northwind/remote/Orders";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable, PrimaryGeneratedColumn } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { ValidateIsInstanceOf, ValidateIsInt, ValidateIsNumber } from "jassijs/remote/Validator";
@$DBObject()
@$Class("northwind.OrderDetails")
export class OrderDetails extends DBObject {
    @ValidateIsInt({optional:true})
    @PrimaryGeneratedColumn()
    declare id: number;
    constructor() {
        super(); 
    }

    @ValidateIsInstanceOf({type:type=>Orders})
    @ManyToOne(type => Orders, e=>e.Details)
    Order: Orders;

    @ValidateIsInstanceOf({type:type=>Products})
    @ManyToOne(type => Products)
    Product: Products;

    @ValidateIsNumber()
    @Column({ nullable: false, type: "decimal" })
    UnitPrice: number;
    
    @ValidateIsNumber()
    @Column()
    Quantity: number;
    
    @ValidateIsNumber()
    @Column({ nullable: true, type: "decimal" })
    Discount: number;
}
export async function test() {
}
;
