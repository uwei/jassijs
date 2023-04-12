import { $DBObject, DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { JoinTable,Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { ParentRight } from "jassijs/remote/security/ParentRight";
import { User } from "jassijs/remote/security/User";
import { Right } from "jassijs/remote/security/Right";
import { ValidateIsArray, ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";



//import "jassijs/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassijs_group"})
@$Class("jassijs.security.Group")

export class Group extends DBObject  {
 
    @ValidateIsInt({optional:true})
    @PrimaryColumn()
    declare id: number;

    @ValidateIsString()
    @Column()
    name:string;

    @ValidateIsArray({optional:true,type:type=>ParentRight})
    @JoinTable()
    @ManyToMany(type=>ParentRight,ob=>ob.groups)
    parentRights:ParentRight[];

    @ValidateIsArray({optional:true,type:type=>Right})
    @JoinTable()
    @ManyToMany(type=>Right,ob=>ob.groups)
    rights:Right[];

    @ValidateIsArray({optional:true,type:type=>User})
    @ManyToMany(type=>User,ob=>ob.groups)
    users:User[];
    
}