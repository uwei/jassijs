import { Categories } from "northwind/remote/Categories";
import { Suppliers } from "northwind/remote/Suppliers";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import  { $Class } from "jassijs/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
@$DBObject()
@$Class("northwind.Products")
export class Products extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super();
    }
    @Column({ nullable: true })
    ProductName: string;
    @ManyToOne(type => Suppliers)
    Supplier: Suppliers;
    @ManyToOne(type => Categories, e=>e.Products)
    Category: Categories;
    @Column({ nullable: true })
    QuantityPerUnit: string;
    @Column({ nullable: true, type: "decimal" })
    UnitPrice: number;
    @Column({ nullable: true })
    UnitsInStock: number;
    @Column({ nullable: true })
    UnitsOnOrder: number;
    @Column({ nullable: true })
    ReorderLevel: number;
    @Column({ nullable: true })
    Discontinued: boolean;
}
export async function test() {
    var p: Products = <Products>await Products.findOne();
   
}
;
