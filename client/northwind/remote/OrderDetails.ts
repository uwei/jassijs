import { Products } from "northwind/remote/Products";
import { Orders } from "northwind/remote/Orders";
import { DBObject, $DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable, PrimaryGeneratedColumn } from "jassi/util/DatabaseSchema";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";
@$DBObject()
@$Class("northwind.OrderDetails")
export class OrderDetails extends DBObject {
    @PrimaryGeneratedColumn()
    id: number;
    constructor() {
        super();
    }
    @ManyToOne(type => Orders, e=>e.Details)
    Order: Orders;
    @ManyToOne(type => Products)
    Product: Products;
    @Column({ nullable: false, type: "decimal" })
    UnitPrice: number;
    @Column()
    Quantity: number;
    @Column({ nullable: true, type: "decimal" })
    Discount: number;
}
export async function test() {
}
;
