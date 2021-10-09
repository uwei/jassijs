import { $ActionProvider, $Action } from "jassijs/base/Actions";
import { $Class } from "jassijs/remote/Jassi";
import { FileNode } from "jassijs/remote/FileNode";
import { OptionDialog } from "jassijs/ui/OptionDialog";
import { FileExplorer, FileActions } from "jassijs/ui/FileExplorer";
import { Server } from "jassijs/remote/Server";
import { router } from "jassijs/base/Router";
import { Property, $Property } from "jassijs/ui/Property";
import { DBObject } from "jassijs/remote/DBObject";
import { classes } from "jassijs/remote/Classes";
import registry from "jassijs/remote/Registry";
const code=`var reportdesign = {
	content: [
    ]
};

export function test() {
    return { 
        reportdesign,
        //data:{},         //data
       // parameter:{}      //parameter
    };
}`;

@$ActionProvider("jassijs.remote.FileNode")
@$Class("jassijs.ui.TemplateDBDialog")
export class TemplateDBDialog {
	static code:string=code;
    @$Action({
        name: "New/Report",
        isEnabled: function(all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async newFile(all: FileNode[]) {
        var res = await OptionDialog.show("Create new Report:", ["ok", "cancel"],undefined,false,"Report1");
        if (res.button === "ok" ) {

	    
	    	FileActions.newFile(all,res.text+".ts",code,true);
        }
    }
}


