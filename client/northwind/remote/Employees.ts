import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { Transaction } from "jassijs/remote/Transaction";
import { Context } from "jassijs/remote/RemoteObject";
import { serverservices } from "jassijs/remote/Serverservice";
import { ValidateIsDate, ValidateIsInstanceOf, ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";
@$DBObject()
@$Class("northwind.Employees")
export class Employees extends DBObject {

    @ValidateIsInt({optional:true})
    @PrimaryColumn()
    declare id: number;

    constructor() {
        super();
    }
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    LastName: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    FirstName: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    Title: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    TitleOfCourtesy: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    Address: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    City: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    Region: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    PostalCode: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    Country: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    HomePhone: string;
    @Column({ nullable: true })
    Extension: string;
    @Column({ nullable: true })
    Photo: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    Notes: string;
    
    @ValidateIsString({optional:true})
    @Column({ nullable: true })
    PhotoPath: string;

    @ValidateIsInstanceOf({type:Employees,optional:true})
    @JoinColumn()
    @ManyToOne(type => Employees)
    ReportsTo: Employees;

    @ValidateIsDate({optional:true})
    @Column({ nullable: true })
    BirthDate: Date;

    @ValidateIsDate({optional:true})
    @Column({ nullable: true })
    HireDate: Date;
    static async find(options = undefined,context:Context=undefined): Promise<Employees[]> {
        if (!context?.isServer) {
            if(options===undefined)
                options={relations:["ReportsTo"]}
            return await this.call(this.find, options,context);
        }
        else {
            //@ts-ignore
            var man = await (await serverservices.db);
            return man.find(context,this, options);
        }
    } 
  
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
export async function test() {
    var all=await Employees.find({where:"id>:p",whereParams:{p:5}});

}
export async function test2() {

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
