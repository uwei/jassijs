import jassi, { $Class } from "remote/jassi/base/Jassi";
class TypeDef{
	[fieldname:string]:{[decorater:string]:any[]}
}
@$Class("remote.jassi.base.Database")
export class Database{
    typeDef:Map<object,TypeDef>=new Map();
    _setMetadata(constructor,field:string,decoratername:string,fieldprops:any[],decoraterprops:any[]){
        var def:TypeDef=this.typeDef.get(constructor);
        if(def===undefined){
            def=new TypeDef();
            this.typeDef.set(constructor,def);
        }
        var afield=def[field];
        if(def[field]===undefined){
        	afield={};
        	def[field]=afield;
        }
        afield[decoratername]=fieldprops;
    }
    getMetadata(sclass):TypeDef{
        return this.typeDef.get(sclass);
    }
}
var db=new Database();
export {db};
