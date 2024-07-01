import { Menu } from "jassijs/ui/Menu";
import { $Class } from "jassijs/remote/Registry";
import { Panel, PanelProperties } from "jassijs/ui/Panel";
import { Action, Actions } from "jassijs/base/Actions";
import { ActionNode} from "jassijs/base/ActionNode";
import { MenuItem } from "jassijs/ui/MenuItem";
type Me = {
    menu?: Menu;
};
export class ActionNodeMenuProperties{

}

@$Class("jassijs/ui/ActionNodeMenu")
export class ActionNodeMenu<T extends ActionNodeMenuProperties={}> extends Panel<ActionNodeMenuProperties> {
    me: Me;
    constructor(props:ActionNodeMenuProperties={}) {
        super(props);
        this.me = {};
        this.layout(this.me);
    }
	config(config:PanelProperties):ActionNodeMenu {
        super.config(<PanelProperties>config);
        return this;
    }
    layout(me: Me) {
        me.menu = new Menu();
		me.menu.width=150;
        this.add(me.menu);
        this.fillActions();
    }
    async fillActions(){
        
        var actions = await Actions.getActionsFor([new ActionNode()]);//Class Actions
        actions.sort((a:Action,b:Action)=>{
			return a.name.localeCompare(b.name);
		});
        actions.forEach(action => {
        	var path=action.name.split("/");//childmenus
        	var parent:Menu=this.me.menu;
        	for(var i=0;i<path.length;i++){
        		if(i===path.length-1){
	            	var men = new MenuItem();
		            men["_classaction"] = true;
		            men.text = path[i];
		            men.icon = action.icon;
		            men.onclick(() => {
						action.call(undefined);
					});
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
