import { $DBObject, DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import {JoinTable, Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { Group } from "jassijs/remote/security/Group";
import { ValidateIsArray, ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";

//import "jassijs/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassijs_right"})
@$Class("jassijs.security.Right")

export class Right extends DBObject  {
    @ValidateIsInt({optional:true})
    @PrimaryColumn()
    declare id: number;

    @ValidateIsString()
    @Column()
    name:string;

    @ValidateIsArray({optional:true,type:type=>Group})
    @ManyToMany(type=>Group,ob=>ob.rights)
    groups:Group[]
}