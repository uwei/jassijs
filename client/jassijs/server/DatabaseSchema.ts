
import { classes } from "jassijs/remote/Classes";
import { db } from "jassijs/remote/Database";
    //@ts-ignore
import { Entity as DEntity,EntityOptions, PrimaryGeneratedColumn as DPrimaryGeneratedColumn,     JoinColumn as DJoinColumn, JoinTable as DJoinTable, Column as DColumn, PrimaryColumn as DPrimaryColumn,     OneToOne as DOneToOne, OneToMany as DOneToMany, ManyToOne as DManyToOne, ManyToMany as DManyToMany } from "typeorm";

function addDecorater(decoratername,delegate,...args){

    return function(...fargs){
        var con=fargs.length===1?fargs[0]:fargs[0].constructor;
        var clname=classes.getClassName(con);
        var field=fargs.length==1?"this":fargs[1];
        db._setMetadata(con,field,decoratername,args,fargs,delegate);
        if(delegate)
            delegate(...args)( ...fargs);
    }
}
export function Entity(...param): Function{
    //DEntity(param)(pclass, ...params);
    return addDecorater("Entity",DEntity,...param);
}
export function PrimaryGeneratedColumn(...param): Function{
    return addDecorater("PrimaryGeneratedColumn",DPrimaryGeneratedColumn,...param);
}
export function JoinColumn(...param): Function{
    return addDecorater("JoinColumn",DJoinColumn,...param);
}
export function JoinTable(...param): Function{
    return addDecorater("JoinTable",DJoinTable,...param);
}
export function Column(...param): Function{
    return addDecorater("Column",DColumn,...param);
}
export function PrimaryColumn(...param): Function{
    return addDecorater("PrimaryColumn",DPrimaryColumn,...param);
}
export function OneToOne(...param): Function{
    return addDecorater("OneToOne",DOneToOne,...param);
}
export function OneToMany(...param): Function{
    return addDecorater("OneToMany",DOneToMany,...param);
}

export function ManyToOne(...param): Function{
    return addDecorater("ManyToOne",DManyToOne,...param);
}

export function ManyToMany(...param): Function{
    return addDecorater("ManyToMany",DManyToMany,...param);
}
/*
export function $DBObject(options?: EntityOptions): Function {
    return function(pclass, ...params) {
    	var classname=classes.getClassName(pclass);
        if(!options)
            options={};
        if(!options.name)
            options.name=classname.toLowerCase().replaceAll(".","_");
        registry.register("$DBObject", pclass, options);
        Entity(options)(pclass, ...params);//pass to orginal Entitiy
    }
}
*/
/*
export {PrimaryGeneratedColumn};
export {JoinColumn};
export {JoinTable };
export { Column};
export {PrimaryColumn};
export {OneToOne};
export {OneToMany};
export {ManyToOne};
export {ManyToMany};*/
export {EntityOptions};
//export function Entity(options?: EntityOptions): Function;
//export declare type PrimaryGeneratedColumnType = "int" | "int2" | "int4" | "int8" | "integer" | "tinyint" | "smallint" | "mediumint" | "bigint" | "dec" | "decimal" | "fixed" | "numeric" | "number" | "uuid";
