import { $DBObject, DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Jassi";
import { JoinTable,Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { ParentRight } from "jassijs/remote/security/ParentRight";
import { User } from "jassijs/remote/security/User";
import { Right } from "jassijs/remote/security/Right";



//import "jassijs/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassijs_group"})
@$Class("jassijs.security.Group")

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