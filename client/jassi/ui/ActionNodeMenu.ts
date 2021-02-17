import { Menu } from "jassi/ui/Menu";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { Actions } from "jassi/base/Actions";
import { ActionNode} from "jassi/base/ActionNode";
import { MenuItem } from "jassi/ui/MenuItem";
type Me = {
    menu?: Menu;
};
@$Class("jassi/ui/ActionNodeMenu")
export class ActionNodeMenu extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.menu = new Menu();
		me.menu.width=150;
        this.add(me.menu);
        this.fillActions();
    }
    async fillActions(){
        
        var actions = await Actions.getActionsFor([new ActionNode()])//Class Actions
       
        actions.forEach(action => {
        	var path=action.name.split("/");//childmenus
        	var parent:Menu=this.me.menu;
        	for(var i=0;i<path.length;i++){
        		if(i===path.length-1){
	            	var men = new MenuItem();
		            men["_classaction"] = true;
		            men.text = path[i];
		            men.icon = action.icon;
		            men.onclick(() => action.call(undefined));
		            parent.add(men);
        		}else{
        			var name=path[i];
        			var found=undefined;
        			parent._components.forEach((men)=>{
        				if((<MenuItem>men).text===name)
        					found=(<MenuItem>men).items;
        			});
        			if(found===undefined){
        				var men= new MenuItem();
        				men["_classaction"] = true;
		            	men.text = name;
		            	parent.add(men);
		            	parent=men.items;
        			}else{
        				parent=found;
        			}
        		}
        	}
        })
    }
}
export async function test() {
    var ret = new ActionNodeMenu();
    return ret;
}
