import jassi, { $Class } from "jassi/remote/Jassi";
import { classes } from "jassi/remote/Classes";
import {RemoteProtocol} from "jassi/remote/RemoteProtocol";

export class Context{
	isServer:boolean;
	[key:string]:any;
}
@$Class("jassi.remote.RemoteObject")
export class RemoteObject{ 
	public static async call(method:(...ars:any)=>any,...parameter){
	 
		if(jassi.isServer)
			throw "should be called on client";
		var prot=new RemoteProtocol();
		var context=parameter[parameter.length-1];
		prot.classname=classes.getClassName(this);
		prot._this= "static";  
		prot.parameter=parameter;
		prot.method=method.name;
		prot.parameter.splice(parameter.length-1,1);

		var ret;
		if(context?.transactionitem){
			ret=await context.transactionitem.transaction.wait(context.transactionitem,prot);
			return ret;
		}
		//let Transaction= (await import("jassi/remote/Transaction")).Transaction;
		//var trans=Transaction.cache.get(_this);

		//if(trans&&trans[method.name]){
		//	throw "not implemented"
		//	ret=await trans[method.name][0]._push(undefined,prot.method,prot,trans[method.name][1]);
		//}

		ret= await prot.call();
		return ret;
	}

	public async call(_this,method:(...ars:any)=>any,...parameter){
		if(jassi.isServer)
			throw "should be called on client";
		var prot=new RemoteProtocol();
		var context=parameter[parameter.length-1];
		prot.classname=classes.getClassName(this);
		prot._this=_this;
		prot.parameter=parameter;
		prot.method=method.name;
		prot.parameter.splice(parameter.length-1,1);
		var ret;
		//let context=(await import("jassi/remote/Context")).Context;
		//let Transaction= (await import("jassi/remote/Transaction")).Transaction;
		//var trans=Transaction.cache.get(_this);
		//var trans=context.get("transaction");
		if(context?.transactionitem){
			ret=await context.transactionitem.transaction.wait(context.transactionitem,prot);
			return ret;
		}
	    ret= await prot.call();
		return ret;
	}
}