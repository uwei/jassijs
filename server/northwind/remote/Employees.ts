import { DBObject, $DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassi/util/DatabaseSchema";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";
import { Transaction } from "jassi/remote/Transaction";
import { Context } from "jassi/remote/RemoteObject";
@$DBObject()
@$Class("northwind.Employees")
export class Employees extends DBObject {
    @PrimaryColumn()
    id: number;

    constructor() {
        super();
    }

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
    @JoinColumn()
    @ManyToOne(type => Employees)
    ReportsTo: Employees;
    @Column({ nullable: true })
    BirthDate: Date;
    @Column({ nullable: true })
    HireDate: Date;
    static async find(options = undefined,context:Context=undefined): Promise<any[]> {
        if (!context?.isServer) {
            return await this.call(this.find, options,context);
        }
        else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.find(context,this, options);
        }
    }
    async hallo(num) {
        if (!jassi.isServer) {
            var ret = await this.call(this, this.hallo, num);
            return ret * 10;
        } else {

            return num + 1;
            // return ["jassi/base/ChromeDebugger.ts"];
        }
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
export async function test() {
    var em = new Employees();
    em.id = getRandomInt(100000);
    var em2 = new Employees();
    em2.id = getRandomInt(100000);
    var trans = new Transaction();
    console.log(em.id + " " + em2.id);
    trans.add(em, em.save);
    trans.add(em2, em2.save);
    var h = await trans.execute();
    h = h;
    /*  var emp = new Employees();
      emp.id = 100003;
      emp.BirthDate = new Date(Date.now());
      //await emp.save();
      var emp2 = new Employees();
      emp2.id = 200000;
      emp2.ReportsTo = emp;
      //await emp2.save();*/
}
;
