import { OrderDetails } from "northwind/remote/OrderDetails";
import { Employees } from "northwind/remote/Employees";
import { Customer } from "northwind/remote/Customer";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { Shippers } from "northwind/remote/Shippers";
import { ValidateIsArray, ValidateIsDate, ValidateIsInstanceOf, ValidateIsNumber, ValidateIsString } from "jassijs/remote/Validator";
@$DBObject()
@$Class("northwind.Orders")
export class Orders extends DBObject {
    @ValidateIsNumber({optional:true})
    @PrimaryColumn()
    declare id: number;
    constructor() {
        super();
    } 

    @ValidateIsInstanceOf({type:Customer})
    @ManyToOne(type => Customer)
    Customer: Customer;

    @ValidateIsInstanceOf({type:Employees})
    @ManyToOne(type => Employees)
    Employee: Employees;

    @ValidateIsDate({optional:true})
    @Column({ nullable: true })
    OrderDate: Date;

    @ValidateIsDate({optional:true})
    @Column({ nullable: true })
    RequiredDate: Date;
    
    @ValidateIsDate({optional:true})
    @Column({ nullable: true })
    ShippedDate: Date;
    
    @ValidateIsInstanceOf({type:Shippers})
    @ManyToOne(type => Shippers)
    ShipVia: Shippers;

    @ValidateIsNumber({optional:true})
    @Column({ nullable: true, type: "decimal" })
    Freight: number;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    ShipName: string;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    ShipAddress: string;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    ShipCity: string;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    ShipRegion: string;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    ShipPostalCode: string;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    ShipCountry: string;

    @ValidateIsArray({type:OrderDetails})
    @OneToMany(type => OrderDetails, e=>e.Order)
    Details: OrderDetails[];
}
export async function test() {
}
;
