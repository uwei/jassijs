
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
@$DBObject()
@$Class("northwind.Customer")
export class Customer extends DBObject {
    @PrimaryColumn()
    id: string;
    @Column()
    CompanyName: string;
    @Column()
    ContactName: string;
    @Column()
    ContactTitle: string;
    @Column()
    Address: string;
    @Column()
    City: string;
    @Column({ nullable: true })
    // @Column({default:""})
    Region: string; 
    @Column({ nullable: true })
    PostalCode: string;
    @Column({ nullable: true })
    Country: string;
    @Column({ nullable: true })
    Phone: string;
    @Column({ nullable: true })
    Fax: string;
    constructor() { 
        super();
        this.CompanyName = "";
        this.ContactName = "";
        this.ContactTitle = "";
        this.Address = "";
        this.City = "";
        /*  this.id = 0;
          this.vorname = "";
          this.nachname = "";
          this.strasse = "";
          this.PLZ = "";
          this.hausnummer = 0;
          this.initExtensions();*/
    }

}
export async function test() {
    var all=await Customer.find();

    
    //var cus2=<Customer>await Customer.findOne();
    //debugger;
    //await Kunde.sample();
    //	new de.Kunde().generate();
    //jassijs.db.uploadType(de.Kunde);
}
;
