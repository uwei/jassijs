import { TestOrder } from "tests/remote/TestOrder";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { $ParentRights } from "jassijs/remote/security/Rights";
@$ParentRights([{ name: "TestCustomers", sqlToCheck: "me.id>=:i1 and me.id<=:i2",
        description: {
            text: "TestCustomer",
            i1: "from",
            i2: "to"
        } }])
@$DBObject()
@$Class("tests.TestCustomer")
export class TestCustomer extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super();
    }
    @Column({	nullable: true})
    name: string;
    @OneToMany(type => TestOrder,order=>order.customer)
    orders: TestOrder[];
}
export async function test() {
}
;
