import { $DBObject, DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import {JoinTable, Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { Group } from "jassijs/remote/security/Group";

//import "jassijs/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassijs_right"})
@$Class("jassijs.security.Right")

export class Right extends DBObject  {
 
    @PrimaryColumn()
    declare id: number;
    @Column()
    name:string;
    @ManyToMany(type=>Group,ob=>ob.rights)
    groups:Group[]
}