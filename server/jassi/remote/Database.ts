
import jassi, { $Class } from "jassi/remote/Jassi";
import { classes } from "./Classes";
export class TypeDef{
	fields:{[fieldname:string]:{[decorater:string]:any[]}}={};
    getRelation(fieldname):{type:string,oclass}{
        var ret=undefined;
        var test=this.fields[fieldname];
        for(let key in test){
            if(key==="OneToOne"||key==="OneToMany"||key==="ManyToOne"||key==="ManyToMany"){
                return {type:key,oclass:test[key][0]()};
                
            }
        }
        return ret;
    }
}
@$Class("jassi.remote.Database")
export class Database{
    private constructor(){
        ;
    }
    typeDef:Map<object,TypeDef>=new Map();
    decoratorCalls:Map<object,any[]>=new Map();
    private removeOld(oclass){
        var name=classes.getClassName(oclass);
        this.typeDef.forEach((value,key)=>{
            var testname=classes.getClassName(key);
            if(testname===name&&key!==oclass)
                this.typeDef.delete(key);
        });
        this.decoratorCalls.forEach((value,key)=>{
            var testname=classes.getClassName(key);
            if(testname===name&&key!==oclass){
                this.decoratorCalls.delete(key);
            }
        });
    }
    _setMetadata(constructor,field:string,decoratername:string,fieldprops:any[],decoraterprops:any[],delegate){
        var def:TypeDef=this.typeDef.get(constructor);
        if(def===undefined){
            def=new TypeDef();
            
            this.decoratorCalls.set(constructor,[]);
            this.typeDef.set(constructor,def);//new class
        }
        if(field==="this"){
            this.removeOld(constructor);
        }
        /*if(delegate===undefined){
            debugger;
        }*/
        this.decoratorCalls.get(constructor).push([delegate,fieldprops,decoraterprops]);
        var afield=def.fields[field];
        if(def.fields[field]===undefined){
        	afield={};
        	def.fields[field]=afield;
        }
        afield[decoratername]=fieldprops;
    }
    fillDecorators(){
        this.decoratorCalls.forEach((allvalues,key)=>{
            allvalues.forEach((value)=>{
                value[0](...value[1])(...value[2]);
            });
        });
    }
    getMetadata(sclass):TypeDef{
        return this.typeDef.get(sclass);
    }
}
//@ts-ignore
var db:Database=new Database();
export {db};
