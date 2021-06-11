import { TestOrderDetails } from "tests/remote/TestOrderDetails";
import { TestCustomer } from "tests/remote/TestCustomer";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
@$DBObject()
@$Class("tests.TestOrder")
export class TestOrder extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super();
    }
    @ManyToOne(type => TestCustomer)
    customer: TestCustomer; 
    @OneToMany(type => TestOrderDetails,e=>e.Order)
    details: TestOrderDetails[];
}
export async function test() {
}
;
