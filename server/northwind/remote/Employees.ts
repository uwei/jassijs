import { DBObject, $DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassi/util/DatabaseSchema";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";
@$DBObject()
@$Class("northwind.Employees")
export class Employees extends DBObject {
    @PrimaryColumn()
    id: number;
    @Column({ nullable: true })
    BirthDate: Date;
    constructor() {
        super();
    }
    @Column({ nullable: true })
    HireDate: Date;
    @Column({ nullable: true })
    LastName: string;
    @Column({ nullable: true })
    FirstName: string;
    @Column({ nullable: true })
    Title: string;
    @Column({ nullable: true })
    TitleOfCourtesy: string;
    @Column({ nullable: true })
    Address: string;
    @Column({ nullable: true })
    City: string;
    @Column({ nullable: true })
    Region: string;
    @Column({ nullable: true })
    PostalCode: string;
    @Column({ nullable: true })
    Country: string;
    @Column({ nullable: true })
    HomePhone: string;
    @Column({ nullable: true })
    Extension: string;
    @Column({ nullable: true })
    Photo: string;
    @Column({ nullable: true })
    Notes: string;
    @Column({ nullable: true })
    PhotoPath: string;
    @OneToOne(type => Employees)
    ReportsTo: Employees;
}
export async function test() {
    var emp = new Employees();
    emp.id = 100003;
    emp.BirthDate = new Date(Date.now());
    await emp.save();
    var emp2 = new Employees();
    emp2.id = 200000;
    emp2.ReportsTo=emp;
    await emp2.save();
}
;
