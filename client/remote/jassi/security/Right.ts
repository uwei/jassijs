import { $DBObject, DBObject } from "remote/jassi/base/DBObject";
import { $Class } from "remote/jassi/base/Jassi";
import {JoinTable, Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassi/util/DatabaseSchema";
import { Group } from "remote/jassi/security/Group";

//import "jassi/ext/enableExtension.js?de.Kunde";
@$DBObject({name:"jassi_right"})
@$Class("remote.jassi.security.Right")

export class Right extends DBObject  {

    @PrimaryColumn()
    id: number;
    @Column()
    name:string;
    @ManyToMany(type=>Group,ob=>ob.rights)
    groups:Group[]
}