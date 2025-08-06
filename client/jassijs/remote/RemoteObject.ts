import { $Class } from "jassijs/remote/Registry";
import { classes, JassiError } from "jassijs/remote/Classes";
import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";
import { getZoneContext, useZoneContext, } from "jassijs/remote/Context";
import { TransactionContext } from "jassijs/remote/Transaction";

const paramMetadataKey = Symbol("paramMetadataKey");
export class Context {
	isServer: boolean;
	[key: string]: any;
}
export function useContext<R = any>(
	context: Context,
	fn: (...args: any[]) => R,
	...args: any[]
): R {
	return <any>useZoneContext(context, fn);
}

export function getContext(): Context {
	return getZoneContext();
}
export function UseServer(): Function {
	return (target, propertyName, descriptor: PropertyDescriptor, options) => {
		let isstatic = target.constructor.name === "Function";
		let method = descriptor.value;
		let testuuu = 9;
		const funcname = method.name;
		let smethod: string = target[method.name].toString();
		let sparam = smethod.substring(smethod.indexOf('(') + 1, smethod.indexOf(')'));
		let paramnames = sparam.split(',');
		if (method["__originalParams"])
			paramnames = method["__originalParams"]
		let posContext = undefined;
		if (paramnames.length > 1 && paramnames[paramnames.length - 1].split('=')[0].trim() === "context")
			posContext = paramnames.length - 1;
		else
			posContext = paramnames.length;//func  without context declaration
		const { [funcname]: newfunc } = {//we need named function!
			[funcname]: function (...paramnames) {
				let test = paramnames;
				let test2 = posContext;
				let test3: string = target[method.name].toString();
				var context = undefined;
				if (posContext !== undefined && arguments.length > posContext) {
					context = arguments[posContext];
				}
				if (!context?.isServer) {
					return RemoteObject.docall(target, method, ...arguments)
				} else
					return method.apply(this, arguments);

			}
		}
		newfunc["__originalParams"] = paramnames;
		descriptor.value = newfunc;
	};
}

export function DefaultParameterValue(value: any): Function {
	return (target, propertyKey: string, parameterIndex: number) => {
		//@ts-ignore
		let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) || {};
		if (params[parameterIndex] === undefined)
			params[parameterIndex] = {};
		params[parameterIndex]["DefaultParameterValue"] = {
			value,
			index: parameterIndex
		}
		//@ts-ignore
		Reflect.defineMetadata(paramMetadataKey, params, target, propertyKey);
	};
}
export function _fillDefaultParameter(_this, method, parameter, withContext = undefined): Context {
	let smethod: string = _this[method.name].toString();

	let sparam = smethod.substring(smethod.indexOf('(') + 1, smethod.indexOf(')'));
	let paramnames = sparam.split(',');
	//the method is manipulated so we dont read the original params - we saved this in @UseServer and ValidateFunctionParameter
	if (_this[method.name]["__originalParams"])
		paramnames = _this[method.name]["__originalParams"];
	//remove context from parameters
	let posContext = undefined;
	var context: Context = withContext;
	if (paramnames.length > 0 && paramnames[paramnames.length - 1].split('=')[0].trim() === "context")
		posContext = paramnames.length - 1;
	if (parameter.length > paramnames.length) {//no parameter für context
		context = parameter[parameter.length - 1];
		posContext=parameter.length - 1;
	}else if (posContext !== undefined){
		paramnames.pop();
		context=parameter[posContext];
	}
	if (posContext !== undefined && parameter.length > posContext) {
		parameter.pop();
	}
	//read default parameter from @DefaultParameterValue parameter decorator
	//@ts-ignore
	let meta: any[] = Reflect.getOwnMetadata(paramMetadataKey, _this, method.name);
	var defaultparams = {};
	for (var key in meta) {
		let entr = meta[key].DefaultParameterValue;
		defaultparams[entr.index] = entr.value
	}
	//filling function parameter so we can add context on last parameter
	for (var x = parameter.length; x < paramnames.length; x++) {
		if (defaultparams[x] !== undefined)
			parameter.push(defaultparams[x]);
		else
			parameter.push(undefined);
	}
	return context;
}

@$Class("jassijs.remote.RemoteObject")
export class RemoteObject {
	public static async docall(_this, method: (...ars: any) => any, ...parameter) {
		return RemoteObject.docallWithReplaceThis(_this, _this, method, ...parameter);
	}
	public static async docallWithReplaceThis(replaceThis, _this, method: (...ars: any) => any, ...parameter) {
		if (jassijs.isServer)
			throw new JassiError("should be called on client");
		var prot = new RemoteProtocol();
		prot.classname = classes.getClassName(_this);
		prot._this = _this.constructor.prototype[method.name] !== undefined ? replaceThis : "static";
		prot.parameter = parameter;

		prot.method = method.name;
		var context = _fillDefaultParameter(_this, method, parameter);
		var ret;
		if (context?.transaction) {
			let ccontext: TransactionContext = context;
			ret = await ccontext.transaction.addProtocol(prot, context);

			//ret = await context.transactionitem.transaction.wait(context.transactionitem, prot);
			return ret;
		}
		//let Transaction= (await import("jassijs/remote/Transaction")).Transaction;
		//var trans=Transaction.cache.get(_this);

		//if(trans&&trans[method.name]){
		//	throw "not implemented"
		//	ret=await trans[method.name][0]._push(undefined,prot.method,prot,trans[method.name][1]);
		//}

		ret = await prot.call();
		return ret;
	}
	/*public static async call(method: (...ars: any) => any, ...parameter) {
		if(jassijs.isServer)
				throw new JassiError("should be called on client");
			var prot=new RemoteProtocol();
			var context=parameter[parameter.length-1];
			prot.classname=classes.getClassName(this);
			prot._this= "static";  
			prot.old=true;
			prot.parameter=parameter;
			prot.method=method.name;
			prot.parameter.splice(parameter.length-1,1);
	
			var ret;
			if(context?.transactionitem){
				ret=await context.transactionitem.transaction.wait(context.transactionitem,prot);
				return ret;
			}
			//let Transaction= (await import("jassijs/remote/Transaction")).Transaction;
			//var trans=Transaction.cache.get(_this);
	
			//if(trans&&trans[method.name]){
			//	throw "not implemented"
			//	ret=await trans[method.name][0]._push(undefined,prot.method,prot,trans[method.name][1]);
			//}
	
			ret= await prot.call();
			return ret;
	}

	public async call(_this, method: (...ars: any) => any, ...parameter) {
		if(jassijs.isServer)
				throw new JassiError( "should be called on client");
			var prot=new RemoteProtocol();
			var context=parameter[parameter.length-1];
			prot.classname=classes.getClassName(this);
			prot._this=_this;
			prot.parameter=parameter;
			prot.method=method.name;
			prot.old=true;
			prot.parameter.splice(parameter.length-1,1);
			var ret;
			//let context=(await import("jassijs/remote/Context")).Context;
			//let Transaction= (await import("jassijs/remote/Transaction")).Transaction;
			//var trans=Transaction.cache.get(_this);
			//var trans=context.get("transaction");
			if(context?.transactionitem){
				ret=await context.transactionitem.transaction.wait(context.transactionitem,prot);
				return ret;
			}
			ret= await prot.call();
			return ret;
	}*/
}

function test2() {
	console.log(JSON.stringify(getContext()));
	return 2;
}
export async function test() {
	const hallo = await useContext({ isServer: false, hallo: "Du" }, async () => {
		// await new Promise(res => setTimeout(res, 10));
		return test2();
	});
	console.log(hallo);
}