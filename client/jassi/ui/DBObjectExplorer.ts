import {ContextMenu} from "jassi/ui/ContextMenu";
import {Tree} from "jassi/ui/Tree";
import { $Class } from "jassi/remote/Jassi";
import { $ActionProvider, $Action } from "jassi/base/Actions";
import {Panel} from "jassi/ui/Panel";
import registry from "jassi/remote/Registry";
import { router } from "jassi/base/Router";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";
import windows from "jassi/base/Windows";
import { FileNode } from "jassi/remote/FileNode";

@$Class("jassi.ui.DBObjectNode")
export class DBObjectNode {
	name?:string;
	filename?:string;
}
@$ActionProvider("jassi.remote.FileNode")
@$Class("jassi.ui.DBFileActions")
export class DBFileActions {
	
    @$Action({
        name: "View Data",
        isEnabled: async function(all: FileNode[]): Promise<boolean> {
            if(all[0].isDirectory())
				return false;
			//console.log("TODO make isEnabled this async")
		 var entrys=await registry.getJSONData("$DBObject");
            for(var x=0;x<entrys.length;x++){
	    		if(all[0].fullpath===entrys[x].filename)
	    			return true;
    		}
    		return false;

          
        }
    })
    static async ViewData(all: FileNode[]) {
       var entrys=await registry.getJSONData("$DBObject");
            for(var x=0;x<entrys.length;x++){
	    		if(all[0].fullpath===entrys[x].filename){
	    			var h=new DBObjectNode();
		    		h.name=entrys[x].classname;
		    		h.filename=entrys[x].filename;
		    		DBObjectActions.ViewData([h]);
	    		}
    		}
	}
}


@$ActionProvider("jassi.ui.DBObjectNode")
@$Class("jassi.ui.DBObjectActions")
export class DBObjectActions {
	@$Action({        name: "View Data"    })
    static async ViewData(all: DBObjectNode[]) {
        var ret = new DBObjectDialog();
		ret.dbclassname=all[0].name;
		ret.height="100%";
		windows.add(ret,all[0].name);
    }
    @$Action({        name: "Open Code"    })
    static async OpenCode(all: DBObjectNode[]) {
    	router.navigate("#do=jassi_editor.CodeEditor&file=" + all[0].filename);
    }

}
type Me = {
	tree?:Tree,
	contextmenu?:ContextMenu
}

@$Class("jassi.ui.DBObjectExplorer")
export class DBObjectExplorer extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
    	me.tree=new Tree();
    	me.contextmenu=new ContextMenu();
    	this.add(me.contextmenu);
    	this.add(me.tree);
    	me.tree.width="100%";
    	me.tree.height="100%";
    	me.tree.propDisplay="name";
    	me.tree.contextMenu=me.contextmenu;
    	me.tree.onclick(function(event?: JQueryEventObject/*, data?:Fancytree.EventData*/){
    		var node:DBObjectNode=event.data;
    		DBObjectActions.OpenCode([node]);
    	});
    	
    	me.contextmenu.includeClassActions=true;
    	this.update();
    }
    async update(){
    	var entrys=await registry.getJSONData("$DBObject");
    	var all=[];
    	entrys.forEach((entry)=>{
    		var h=new DBObjectNode();;
    		h.name=entry.classname;
    		h.filename=entry.filename;
    		all.push(h);
    	});
    	this.me.tree.items=all;
    }
}

export async function test(){
	var ret=new DBObjectExplorer();

	return ret;
}