import { $DBObject, DBObject } from "jassi/remote/DBObject";
import { $Class } from "jassi/remote/Jassi";
import { JoinTable,Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassi/util/DatabaseSchema";
import { ParentRight } from "jassi/remote/security/ParentRight";
import { User } from "jassi/remote/security/User";
import { Right } from "jassi/remote/security/Right";



//import "jassi/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassi_group"})
@$Class("jassi.remote.security.Group")

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