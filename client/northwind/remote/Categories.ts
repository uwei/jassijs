import { DBObject, $DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassi/util/DatabaseSchema";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";
@$DBObject()
@$Class("northwind.Categories")
export class Categories extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super();
    }
    @Column({	nullable: true})
    CategoryName: string;
    @Column({	nullable: true})
    Description: string;
    @Column()
    Picture: string;
}
export async function test() {
}
;
