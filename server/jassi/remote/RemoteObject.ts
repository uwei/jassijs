import jassi, { $Class } from "jassi/remote/Jassi";
import { classes } from "jassi/remote/Classes";
import {RemoteProtocol} from "jassi/remote/RemoteProtocol";

@$Class("jassi.remote.RemoteObject")
export class RemoteObject{
	public static async call(method:string,...parameter){
	 
		if(jassi.isServer)
			throw "should be called on client";
		var prot=new RemoteProtocol();
		prot.classname=classes.getClassName(this);
		prot._this= "static"; 
		prot.parameter=parameter;
		prot.method=method;
		var ret= await prot.call();
		return ret;
	}

	public async call(_this,method:string,...parameter){
		if(jassi.isServer)
			throw "should be called on client";
		var prot=new RemoteProtocol();
		prot.classname=classes.getClassName(this);
		prot._this=_this;
		prot.parameter=parameter;
		prot.method=method;
		var ret= await prot.call();
		return ret;
	}
}