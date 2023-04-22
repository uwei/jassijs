import { $DBObject, DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import {  PrimaryGeneratedColumn,JoinTable,Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { Group } from "jassijs/remote/security/Group";
import { ParentRight } from "jassijs/remote/security/ParentRight";
import { Context } from "jassijs/remote/RemoteObject";
import { ValidateIsArray, ValidateIsBoolean, ValidateIsNumber, ValidateIsString } from "jassijs/remote/Validator";

 

@$DBObject({name:"jassijs_user"})
@$Class("jassijs.security.User")

export class User extends DBObject  {
	@ValidateIsNumber({optional:true})
    @PrimaryGeneratedColumn()
    declare id: number;
	
	@ValidateIsString()
    @Column()
    email:string;
	
	@ValidateIsString({optional:true})
    @Column({select: false})
    password:string;

	@ValidateIsArray({optional:true,type:type=>Group})
    @JoinTable()
    @ManyToMany(type=>Group,ob=>ob.users)
	groups:Group[];

	@ValidateIsBoolean({optional:true})
	@Column({nullable:true})
    isAdmin:boolean;
    
	static async  findWithRelations(){
		return this.find({relations:["*"]});
	}
     /**
    * reload the object from jassijs.db
    */
    async hallo(context:Context=undefined) {
        if (!context?.isServer) {
            return await this.call(this,this.hallo,context);
        } else {
			return 11;
        }
	}
	async save(context:Context=undefined){
		return await super.save(context); 
	}
}
export async function test(){
	
	var gps=await (Group.find({}));
	
}
export async function test2(){
	var user=new User();
	user.id=1;
	user.email="a@b.com";
	user.password="";
	
	var group1=new Group();
	group1.id=1;
	group1.name="Mandanten I";
	
	
	var group2=new Group();
	group2.id=2;
	group2.name="Mandanten 2";


	var pr1=new ParentRight();
	pr1.id=10;
	pr1.classname="de.Kunde";
	pr1.name="Kunden";
	pr1.i1=1;
	pr1.i2=4;
	await 	pr1.save();
	
	var pr2=new ParentRight();
	pr2.id=11;
	pr2.classname="de.Kunde";
	pr2.name="Kunden";
	pr2.i1=6;
	pr2.i2=10;
	await pr2.save();
	group1.parentRights=[pr1];
	await group1.save();
	group2.parentRights=[pr2];
	await group2.save();
	user.groups=[group1,group2];
	await user.save();
	
	
}