import { OrderDetails } from "northwind/remote/OrderDetails";
import { Employees } from "northwind/remote/Employees";
import { Customer } from "northwind/remote/Customer";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { Shippers } from "northwind/remote/Shippers";
@$DBObject()
@$Class("northwind.Orders")
export class Orders extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super();
    } 
    @ManyToOne(type => Customer)
    Customer: Customer;
    @ManyToOne(type => Employees)
    Employee: Employees;
    @Column({ nullable: true })
    OrderDate: Date;
    @Column({ nullable: true })
    RequiredDate: Date;
    @Column({ nullable: true })
    ShippedDate: Date;
    @ManyToOne(type => Shippers)
    ShipVia: Shippers;
    @Column({ nullable: true, type: "decimal" })
    Freight: number;
    @Column({ nullable: true })
    ShipName: string;
    @Column({ nullable: true })
    ShipAddress: string;
    @Column({ nullable: true })
    ShipCity: string;
    @Column({ nullable: true })
    ShipRegion: string;
    @Column({ nullable: true })
    ShipPostalCode: string;
    @Column({ nullable: true })
    ShipCountry: string;
    @OneToMany(type => OrderDetails, e=>e.Order)
    Details: OrderDetails[];
}
export async function test() {
}
;
