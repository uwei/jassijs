import { Products } from "northwind/remote/Products";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
@$DBObject()
@$Class("northwind.Categories")
export class Categories extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super();
    } 
    @Column({ nullable: true })
    CategoryName: string;
    @Column({ nullable: true })
    Description: string;
    @Column()
    Picture: string;
    @OneToMany(type => Products, e=>e.Category)
    Products: Products;
} 
export async function test() {
    

}
;
