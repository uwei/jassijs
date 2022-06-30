import { $DBObject, DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { JoinColumn, JoinTable, Entity, PrimaryColumn,PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, OneToOne } from "jassijs/util/DatabaseSchema";


@$DBObject()
@$Class("tests.TestBigData")
export class TestBigData extends DBObject {
    @PrimaryGeneratedColumn()
    declare id: number;
    constructor() {
        super();
    }
    @Column({	nullable: true})
    name: string;
    @Column({	nullable: true})
    name2: string;
    @Column({	nullable: true})
    number1: number;
    @Column({	nullable: true})
    number2: number;
    
}