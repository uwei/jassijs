import registry from "jassijs/remote/Registry";
import { $Class } from "jassijs/remote/Jassi";
import { FileNode } from "jassijs/remote/FileNode";
import { classes } from "jassijs/remote/Classes";


export class ActionProperties {
	/** @member {string} - the name of the Action */
	name: string;
	/** 
	* @member {string} - the description of the Action
	*/
	description?: string;
	/** 
	* @member {string}  - the icon of the Action
	*/
	icon?: string;
	isEnabled?: { (data?: any[]): boolean | Promise<boolean> };
	run?: any;
}
/**
 * usage 
 * @$Actions()
 * static test():ActionProperties[]{
 * }
 */
export function $Actions(): Function {

	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		registry.registerMember("$Actions", target, propertyKey);
	}
}

export function $Action(property: ActionProperties): Function {

	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		registry.registerMember("$Action", target, propertyKey, property);
	}
}

export function $ActionProvider(longclassname: string): Function {
	return function (pclass) {
		registry.register("$ActionProvider", pclass);
	}
}
export interface Action {
	name: string;
	icon?: string;
	call: (objects: any[]) => void;
}
@$Class("jassijs.base.Actions")
export class Actions {
	static async getActionsFor(vdata: any): Promise<Action[]> {
		//var oclass = vdata[0].constructor;
		var ret: { name: string, icon?: string, call: (objects: any[]) => {} }[] = [];
		/*men.text = actions[x].name;
				men.icon = actions[x].icon;
				men.onclick(function (evt) {
					ac.run([node]);
				});*/
		var sclass = classes.getClassName(vdata);
		var allclasses = (await registry.getJSONData("$ActionProvider")).filter(entr => entr.params[0] === sclass);
		//await registry.loadAllFilesForEntries(allclasses);

		//let data = registry.getData("$ActionProvider");
		for (let x = 0; x < allclasses.length; x++) {
			var entr = allclasses[x];
			var mem = registry.getJSONMemberData("$Action")[entr.classname];
			for (let name in mem) {
				let ac: ActionProperties = mem[name][0][0];
				if (ac.isEnabled !== undefined||ac.run!==undefined){//we musst load the class
					await classes.loadClass(entr.classname);
					ac= registry.getMemberData("$Action")[entr.classname][name][0][0];
				}
				if (ac.isEnabled !== undefined){
					if((await ac.isEnabled([vdata])) === false)
						continue;
				}
				let sclassname=entr.classname;
				let sname=name;
				ret.push({
					name: ac.name,
					icon: ac.icon,
					call: ac.run?ac.run:async(...param)=>{
						(await classes.loadClass(sclassname))[sname](...param);
					}
				})
			}

			
			mem = registry.getJSONMemberData("$Actions")[entr.classname];
			for (let name in mem) {
				let acs: ActionProperties[] =await (await classes.loadClass(entr.classname))[name]();
				for (let x = 0; x < acs.length; x++) {
					let ac = acs[x];
					if (ac.isEnabled !== undefined && ((await ac.isEnabled([vdata])) === false))
						continue;
					ret.push({
						name: ac.name,
						icon: ac.icon,
						call: ac.run
					})
				}
			}
		}
		return ret;
	}
}

export async function test() {

}


