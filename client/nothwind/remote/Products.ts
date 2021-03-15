import { DBObject, $DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassi/util/DatabaseSchema";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";
@$DBObject()
@$Class("nothwind.Products")
export class Products extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super();
    }
    @Column({	nullable: true})
    ProductName: string;
}
export async function test() {
}
;
