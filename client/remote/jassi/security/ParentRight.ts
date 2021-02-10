import { $DBObject, DBObject } from "remote/jassi/base/DBObject";
import { $Class } from "remote/jassi/base/Jassi";
import {JoinTable, Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassi/util/DatabaseSchema";
import { Group } from "remote/jassi/security/Group";


//import "jassi/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassi_parentright"})
@$Class("remote.jassi.security.ParentRight")

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