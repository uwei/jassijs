
import jassi, { $Class } from "jassi/remote/Jassi";
import { classes } from "./Classes";
class TypeDef{
	[fieldname:string]:{[decorater:string]:any[]}
    
}
@$Class("jassi.remote.Database")
export class Database{
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
            if(testname===name&&key!==oclass)
                this.decoratorCalls.delete(key);
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
        this.decoratorCalls.get(constructor).push([delegate,fieldprops,decoraterprops]);
        var afield=def[field];
        if(def[field]===undefined){
        	afield={};
        	def[field]=afield;
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
var db=new Database();
export {db};
