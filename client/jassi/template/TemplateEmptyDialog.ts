import { $ActionProvider, $Action } from "jassi/base/Actions";
import { $Class } from "jassi/remote/Jassi";
import { FileNode } from "jassi/remote/FileNode";
import { OptionDialog } from "jassi/ui/OptionDialog";
import { FileExplorer, FileActions } from "jassi/ui/FileExplorer";
import { Server } from "jassi/remote/Server";
import { router } from "jassi/base/Router";
const code=`import { $Class } from "remote/jassi/base/Jassi";
import {Panel} from "jassi/ui/Panel";

type Me = {
}

@$Class("{{fullclassname}}")
export class {{dialogname}} extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
	}
}

export async function test(){
	var ret=new {{dialogname}}();
	return ret;
}`;

@$ActionProvider("jassi.base.FileNode")
@$Class("jassi.ui.TemplateEmptyDialog")
export class TemplateEmptyDialog {
	static code:string=code;
    @$Action({
        name: "New/Dialog",
        isEnabled: function(all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async newFile(all: FileNode[]) {

        var res = await OptionDialog.show("Enter dialog name:", ["ok", "cancel"], undefined, true, "Dialog");
        if (res.button === "ok" && res.text !== all[0].name) {
	    	var scode=code.replaceAll("{{dialogname}}",res.text);
	    	scode=scode.replaceAll("{{fullclassname}}",all[0].fullpath+"/"+res.text);
	    	FileActions.newFile(all,res.text+".ts",scode,true);
        }
    }
}



