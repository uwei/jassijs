import { Categories } from "northwind/remote/Categories";
import { Suppliers } from "northwind/remote/Suppliers";
import { DBObject, $DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassi/util/DatabaseSchema";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";
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
    var p: Products = await Products.findOne();
    debugger;
    p.ProductName = "udo";
    var p2 = await Products.findOne({ onlyColumns: [], relations: ["*"] });
    var k = p === p2;
}
;
