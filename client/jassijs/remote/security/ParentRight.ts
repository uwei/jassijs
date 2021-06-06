import { $DBObject, DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Jassi";
import {JoinTable, Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { Group } from "jassijs/remote/security/Group";


//import "jassijs/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassijs_parentright"})
@$Class("jassijs.security.ParentRight")

export class ParentRight extends DBObject  {
 
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name:string;
    @Column()
    classname:string;
    @Column({nullable:true})
    i1:number;
    @Column({nullable:true})
    i2:number;
    @Column({nullable:true})
    s1:string;
    @Column({nullable:true})
    s2:string;
    @ManyToMany(type=>Group,ob=>ob.parentRights)
    groups:Group[]
}