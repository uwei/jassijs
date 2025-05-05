import { $ActionProvider, $Action } from "jassijs/base/Actions";
import { $Class } from "jassijs/remote/Registry";
import { FileNode } from "jassijs/remote/FileNode";
import { OptionDialog } from "jassijs/ui/OptionDialog";
import { FileExplorer, FileActions } from "jassijs_editor/FileExplorer";

const code=`import { ComponentProperties,SimpleComponentProperties,createComponent } from "jassijs/ui/Component";
import { States,createRefs } from "jassijs/ui/State";
type Refs={};
interface {{dialogname}}Properties extends SimpleComponentProperties {
    sampleProp?: string;
}
function {{dialogname}}(props: {{dialogname}}Properties,states: States<{{dialogname}}Properties>) {
    var refs: Refs=createRefs();
    return <div>{states.sampleProp}</div>;
}
export function test() {
    var ret=<{{dialogname}} sampleProp="jj"></{{dialogname}}>;
    var comp=createComponent(ret);
    return comp;
}
`;

@$ActionProvider("jassijs.remote.FileNode")
@$Class("jassijs_editor.template.TemplateEmptyTSXDialog")
export class TemplateEmptyTSXDialog {
	static code:string=code;
    @$Action({
        name: "New/Dialog.tsx",
        isEnabled: function(all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async newFile(all: FileNode[]) {

        var res = await OptionDialog.show("Enter dialog name:", ["ok", "cancel"], undefined, true, "Dialog");
        if (res.button === "ok" && res.text !== all[0].name) {
	    	var scode=code.replaceAll("{{dialogname}}",res.text);
	    	scode=scode.replaceAll("{{fullclassname}}",all[0].fullpath+"/"+res.text);
	    	FileActions.newFile(all,res.text+".tsx",scode,true);
        }
    }
}



