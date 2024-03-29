import { $Class } from "jassijs/remote/Registry";
import {DBObject, $DBObject } from "jassijs/remote/DBObject";
import { PrimaryColumn, Column, OneToOne } from "jassijs/util/DatabaseSchema";
//import { Entity, PrimaryColumn, Column,OneToOne,ManyToMany,ManyToOne,OneToMany } from "typeorm";


@$Class("de.Lieferant")
@$DBObject() 
export class Lieferant extends DBObject {
    @PrimaryColumn()
    declare id:number;
    @Column({nullable:false})
    name:string;
     
} 

/*export async function test(){
	var l=new Lieferant();
	l.id=900;
	l.name="kkkkkk";
	l.save();
	//var z:Lieferant=(await Lieferant.find({id:900}))[0];
   // z.plz="09456";
//    console.log(JSON.stringify(z));
}*/