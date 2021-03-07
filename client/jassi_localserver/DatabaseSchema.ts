import { classes } from "jassi/remote/Classes";
import { db } from "jassi/remote/Database";
    //@ts-ignore
import { Entity as DEntity,EntityOptions, PrimaryGeneratedColumn as DPrimaryGeneratedColumn,     JoinColumn as DJoinColumn, JoinTable as DJoinTable, Column as DColumn, PrimaryColumn as DPrimaryColumn,     OneToOne as DOneToOne, OneToMany as DOneToMany, ManyToOne as DManyToOne, ManyToMany as DManyToMany } from "typeorm";

function addDecorater(decoratername,delegate,...args){

    return function(...fargs){
        var con=fargs.length===1?fargs[0]:fargs[0].constructor;
        var clname=classes.getClassName(con);
        var field=fargs.length==1?"this":fargs[1];
        db._setMetadata(con,field,decoratername,args,fargs);
        if(delegate)
            delegate( ...fargs);
    }
}
export function Entity(...param): Function{
    //DEntity(param)(pclass, ...params);
    console.log("Ent:"+JSON.stringify(param));
    return addDecorater("Entity",DEntity(...param),param);
}
export function PrimaryGeneratedColumn(...param): Function{
    return addDecorater("PrimaryGeneratedColumn",DPrimaryGeneratedColumn(...param),param);
}
export function JoinColumn(...param): Function{
    return addDecorater("JoinColumn",DJoinColumn(...param),param);
}
export function JoinTable(...param): Function{
    return addDecorater("JoinTable",DJoinTable(...param),param);
}
export function Column(...param): Function{
    return addDecorater("Column",DColumn(...param),param);
}
export function PrimaryColumn(...param): Function{
    return addDecorater("PrimaryColumn",DPrimaryColumn(...param),param);
}
export function OneToOne(...param): Function{
    return addDecorater("OneToOne",DOneToOne(...param),param);
}
export function OneToMany(...param): Function{
    return addDecorater("OneToMany",DOneToMany(...param),param);
}

export function ManyToOne(...param): Function{
    return addDecorater("ManyToOne",DManyToOne(...param),param);
}

export function ManyToMany(...param): Function{
    return addDecorater("ManyToMany",DManyToMany(...param),param);
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
