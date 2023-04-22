import { $DBObject, DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import {JoinTable, Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { Group } from "jassijs/remote/security/Group";
import { ValidateIsArray, ValidateIsInt, ValidateIsNumber, ValidateIsString } from "jassijs/remote/Validator";

 
//import "jassijs/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassijs_parentright"})
@$Class("jassijs.security.ParentRight")
 
export class ParentRight extends DBObject  {
    @ValidateIsInt({optional:true})
    @PrimaryGeneratedColumn()
    declare id: number;

    @ValidateIsString()
    @Column() 
    name:string;

    @ValidateIsString()
    @Column()
    classname:string;

    @ValidateIsNumber({optional:true})
    @Column({nullable:true})
    i1:number;

    @ValidateIsNumber({optional:true})
    @Column({nullable:true})
    i2:number;

    @ValidateIsString({optional:true})
    @Column({nullable:true})
    s1:string;

    @ValidateIsString({optional:true})
    @Column({nullable:true})
    s2:string;

    @ValidateIsArray({optional:true,type:type=>Group})
    @ManyToMany(type=>Group,ob=>ob.parentRights)
    groups:Group[]
}