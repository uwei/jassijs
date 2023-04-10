
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";
@$DBObject()
@$Class("northwind.Customer")
export class Customer extends DBObject {

    @ValidateIsString({optional:true})
    @PrimaryColumn()
    declare id: string;

    @ValidateIsString()
    @Column()
    CompanyName: string;

    @ValidateIsString()
    @Column()
    ContactName: string;

    @ValidateIsString()
    @Column()
    ContactTitle: string;

    @ValidateIsString()
    @Column()
    Address: string;

    @ValidateIsString()
    @Column()
    City: string;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    // @Column({default:""})
    Region: string; 

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    PostalCode: string;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    Country: string;

    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    Phone: string;

    @ValidateIsString({optional:true})
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
