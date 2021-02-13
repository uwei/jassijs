
import {DBObject, $DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassi/util/DatabaseSchema";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";
 

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
   
    @Column({nullable:true})
   // @Column({default:""})
    Region: string;
    @Column({nullable:true})
    PostalCode: string;
    @Column({nullable:true})
    Country: string;
    @Column({nullable:true})
    Phone: string;
    @Column({nullable:true})
    Fax: string;
  
    constructor() {
        super();
        this.CompanyName="";
        this.ContactName="";
        this.ContactTitle="";
        this.Address="";
        this.City="";
        
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
	var cus:Customer=new Customer();
	cus.id="999000";
	cus.CompanyName="Hallo";
	await cus.save();
	
	//var cus2=<Customer>await Customer.findOne();
	//debugger;
    //await Kunde.sample();

    //	new de.Kunde().generate();
    //jassi.db.uploadType(de.Kunde);
};

