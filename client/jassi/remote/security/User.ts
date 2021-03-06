import { $DBObject, DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import {  PrimaryGeneratedColumn,JoinTable,Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassi/util/DatabaseSchema";
import { Group } from "jassi/remote/security/Group";
import { ParentRight } from "jassi/remote/security/ParentRight";
import { Context } from "jassi/remote/RemoteObject";



@$DBObject({name:"jassi_user"})
@$Class("jassi.remote.security.User")

export class User extends DBObject  {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    email:string;
    @Column({select: false})
    password:string;
    @JoinTable()
    @ManyToMany(type=>Group,ob=>ob.users)
	groups:Group[];
	@Column({nullable:true})
    isAdmin:boolean;
    
     /**
    * reload the object from jassi.db
    */
    async hallo(context:Context=undefined) {
        if (!context?.isServer) {
            return await this.call(this,this.hallo,context);
        } else {
			return 11;
        }
	}
	async save(){
		return await super.save();
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