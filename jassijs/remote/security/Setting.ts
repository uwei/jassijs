import { DBObject, $DBObject, MyFindManyOptions } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, JoinColumn, JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { Context } from "jassijs/remote/RemoteObject";
import { JassiError } from "../Classes";
@$DBObject({name:"jassijs_setting"})
@$Class("jassijs.security.Setting")
export class Setting extends DBObject {
    @PrimaryColumn()
    id: number;
    constructor() {
        super();
    }
    
    @Column({	nullable: true})
    data: string;

     async save(context:Context=undefined) {
        throw new JassiError("not suported");
    }
    
    static async findOne(options = undefined,context:Context=undefined): Promise<DBObject> {
        throw new JassiError("not suported");
    }
    static async find(options:MyFindManyOptions = undefined,context:Context=undefined): Promise<DBObject[]> {
        throw new JassiError("not suported");
    }
    /**
    * reload the object from jassijs.db
    */
    async remove(context:Context=undefined) {
        throw new JassiError("not suported");
    }
}
export async function test() {
}
;
