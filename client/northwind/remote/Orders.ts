import { OrderDetails } from "northwind/remote/OrderDetails";
import { Employees } from "northwind/remote/Employees";
import { Customer } from "northwind/remote/Customer";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { Shippers } from "northwind/remote/Shippers";
import { ValidateIsArray, ValidateIsDate, ValidateIsInstanceOf, ValidateIsNumber, ValidateIsString } from "jassijs/remote/Validator";
<<<<<<< HEAD
import { Context } from "jassijs/remote/RemoteObject";
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279

@$DBObject()
@$Class("northwind.Orders")
export class Orders extends DBObject {
    @ValidateIsNumber({ optional: true })
    @PrimaryColumn()
    declare id: number;
    constructor() {
        super();
    }

    @ValidateIsInstanceOf({ type: type => Customer })
    @ManyToOne(type => Customer)
    Customer: Customer;

    @ValidateIsInstanceOf({ type: type => Employees })
    @ManyToOne(type => Employees)
    Employee: Employees;

    @ValidateIsDate({ optional: true })
    @Column({ nullable: true })
    OrderDate: Date;

    @ValidateIsDate({ optional: true })
    @Column({ nullable: true })
    RequiredDate: Date;

    @ValidateIsDate({ optional: true })
    @Column({ nullable: true })
    ShippedDate: Date;

    @ValidateIsInstanceOf({ type: type => Shippers })
    @ManyToOne(type => Shippers)
    ShipVia: Shippers;

    @ValidateIsNumber({ optional: true })
    @Column({ nullable: true, type: "decimal" })
    Freight: number;

    @ValidateIsString({ optional: true })
    @Column({ nullable: true })
    ShipName: string;

    @ValidateIsString({ optional: true })
    @Column({ nullable: true })
    ShipAddress: string;

    @ValidateIsString({ optional: true })
    @Column({ nullable: true })
    ShipCity: string;

    @ValidateIsString({ optional: true })
    @Column({ nullable: true })
    ShipRegion: string;

    @ValidateIsString({ optional: true })
    @Column({ nullable: true })
    ShipPostalCode: string;

    @ValidateIsString({ optional: true })
    @Column({ nullable: true })
    ShipCountry: string;

    @ValidateIsArray({ type: type => OrderDetails })
    @OneToMany(type => OrderDetails, e => e.Order)
    Details: OrderDetails[];
<<<<<<< HEAD
    static async findAllWithDetails(context:Context): Promise<Orders[]> { 
        return <any>await Orders.find({ relations: ["*"] },context);
=======
    static async findAllWithDetails(): Promise<Orders[]> {
        return <any>await Orders.find({ relations: ["*"] });
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    }

}
export async function test() {
}
;
