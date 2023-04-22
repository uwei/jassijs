import { $Class } from "jassijs/remote/Registry"; 


@$Class("jassijs.base.ActionNode")
export class ActionNode {
} 

export async function test(){
    var Actions=(await import("jassijs/base/Actions")).Actions;
    var actions = await Actions.getActionsFor([new ActionNode()]);//Class Actions
    console.log("found "+actions.length+" Actions"); 
}