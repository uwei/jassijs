import { $ActionProvider, $Action } from "jassijs/base/Actions";
import { $Class } from "jassijs/remote/Registry";
import { FileNode } from "jassijs/remote/FileNode";
import { OptionDialog } from "jassijs/ui/OptionDialog";
import { FileActions } from "jassijs_editor/FileExplorer";
const code=`reportdesign = {
	content: [
    ]
};`;


@$ActionProvider("jassijs.remote.FileNode")
@$Class("jassijs_report.TemplateReport")
export class TemplateReport {
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


