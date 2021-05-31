import { DBObject, $DBObject, MyFindManyOptions } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassi/util/DatabaseSchema";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";
import { Context } from "jassi/remote/RemoteObject";
@$DBObject({name:"jassi_setting"})
@$Class("jassi.security.Setting")
export class Setting extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super();
    }
    
    @Column({	nullable: true})
    data: string;

     async save(context:Context=undefined) {
        throw "not suported";
    }
   
    static async findOne(options = undefined,context:Context=undefined): Promise<DBObject> {
        throw "not suported";
    }
    static async find(options:MyFindManyOptions = undefined,context:Context=undefined): Promise<DBObject[]> {
        throw "not suported";
    }
    /**
    * reload the object from jassi.db
    */
    async remove(context:Context=undefined) {
        throw "not suported";
    }
}
export async function test() {
}
;
