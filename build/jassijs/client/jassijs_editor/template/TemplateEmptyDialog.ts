import { $ActionProvider, $Action } from "jassijs/base/Actions";
import { $Class } from "jassijs/remote/Registry";
import { FileNode } from "jassijs/remote/FileNode";
import { OptionDialog } from "jassijs/ui/OptionDialog";
import { FileExplorer, FileActions } from "jassijs_editor/FileExplorer";
import { Server } from "jassijs/remote/Server";
import { router } from "jassijs/base/Router";
const code=`import { $Class } from "jassijs/remote/Registry";
import {Panel} from "jassijs/ui/Panel";

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
        this.config({});
	}
}

export async function test(){
	var ret=new {{dialogname}}();
	return ret;
}`;

@$ActionProvider("jassijs.remote.FileNode")
@$Class("jassijs_editor.template.TemplateEmptyDialog")
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



