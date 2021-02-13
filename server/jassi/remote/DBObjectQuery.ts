import { classes } from "jassi/remote/Classes";
import registry from "jassi/remote/Registry";
import {DBObject} from "jassi/remote/DBObject";


export class DBObjectQueryProperties{
	name:string;
	description?:string;
}
export function $DBObjectQuery(property:DBObjectQueryProperties):Function{
     return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        var test=classes.getClassName(target);
        registry.registerMember("$DBObjectQuery",target,propertyKey,property);
    }
}

export class DBObjectQuery{
	classname:string;
	name:string;
	description:string;
	_function;
	async execute():Promise<DBObject>{
		return undefined;
	}
	static async getQueries(classname:string):Promise<DBObjectQuery[]>{
		var cl=await classes.loadClass(classname);
		var ret:DBObjectQuery[]=[];
		var all=registry.getMemberData("$DBObjectQuery");
		var queries=all[classname];
		for(var name in queries){
			var qu:DBObjectQueryProperties=queries[name][0][0];
			var query=new DBObjectQuery();
			query.classname=classname;
			query.name=qu.name;
			query.description=qu.description;
			query.execute=async function(){
				return await cl[name]();
			}
			ret.push(query);
		}
		return ret;
	}
}

export async function test(){
	var qu=(await DBObjectQuery.getQueries("de.Kunde"))[0];
	var j=await qu.execute();
	
}
