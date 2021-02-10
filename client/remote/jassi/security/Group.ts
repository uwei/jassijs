import { $DBObject, DBObject } from "remote/jassi/base/DBObject";
import { $Class } from "remote/jassi/base/Jassi";
import { JoinTable,Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassi/util/DatabaseSchema";
import { ParentRight } from "remote/jassi/security/ParentRight";
import { User } from "remote/jassi/security/User";
import { Right } from "remote/jassi/security/Right";



//import "jassi/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassi_group"})
@$Class("remote.jassi.security.Group")

export class Group extends DBObject  {

    @PrimaryColumn()
    id: number;
    @Column()
    name:string;
    @JoinTable()
    @ManyToMany(type=>ParentRight,ob=>ob.groups)
    parentRights:ParentRight[];

    @JoinTable()
    @ManyToMany(type=>Right,ob=>ob.groups)
    rights:Right[];
    @ManyToMany(type=>User,ob=>ob.groups)
    users:User[];
    
}