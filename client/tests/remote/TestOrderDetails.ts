import { TestOrder } from "tests/remote/TestOrder";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import  { $Class } from "jassijs/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { $CheckParentRight } from "jassijs/remote/security/Rights";
@$DBObject()
@$Class("tests.TestOrderDetails")
export class TestOrderDetails extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super(); 
    }
    @$CheckParentRight()
    @ManyToOne(type => TestOrder,e=>e.details)
    Order: TestOrder;
} 
export async function test() {
}
;
