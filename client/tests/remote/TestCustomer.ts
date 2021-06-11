import { TestOrder } from "tests/remote/TestOrder";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
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
