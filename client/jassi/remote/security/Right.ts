import { $DBObject, DBObject } from "jassi/remote/DBObject";
import { $Class } from "jassi/remote/Jassi";
import {JoinTable, Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassi/util/DatabaseSchema";
import { Group } from "jassi/remote/security/Group";

//import "jassi/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassi_right"})
@$Class("jassi.security.Right")

export class Right extends DBObject  {

    @PrimaryColumn()
    id: number;
    @Column()
    name:string;
    @ManyToMany(type=>Group,ob=>ob.rights)
    groups:Group[]
}