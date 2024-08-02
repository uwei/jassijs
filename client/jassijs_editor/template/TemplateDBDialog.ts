import registry, { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import { FileNode } from "jassijs/remote/FileNode";
import { DBObject } from "jassijs/remote/DBObject";
import { OptionDialog } from "jassijs/ui/OptionDialog";
import { classes } from "jassijs/remote/Classes";
import { FileActions } from "jassijs_editor/FileExplorer"; 

const code=`
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { {{dbclassname}} } from "{{dbfilename}}";
import { DBObjectView, $DBObjectView, ObjectViewToolbar } from "jassijs/ui/DBObjectView";
import { jc } from "jassijs/ui/Component";



@$DBObjectView({classname:"{{fulldbclassname}}"})
@$Class("{{fullclassname}}")
export class {{dialogname}} extends DBObjectView<{{dbclassname}}> {
    get title() {
        return this.value === undefined ? "{{dialogname}}" : "{{dialogname}} " + this.value.id;
    }
    render() {
        return jc(Panel, {
            children: [
                jc(ObjectViewToolbar, { view: this })
            ]
        })
    }
}

export async function test(){
	var ret=new {{dialogname}}();
	ret.value=<{{dbclassname}}>await {{dbclassname}}.findOne();
	return ret;
}`;
@$Class("jassijs_editor.template.TemplateDBDialogProperties")
export class TemplateDBDialogProperties {
	@$Property({decription:"name of the dialog"})
	dialogname:string;
	@$Property({type:"classselector", service:"$DBObject"})
    dbobject:DBObject;
}
@$ActionProvider("jassijs.remote.FileNode")
@$Class("jassijs.template.TemplateDBDialog")
export class TemplateDBDialog {
	static code:string=code;
    @$Action({
        name: "New/DBDialog",
        isEnabled: function(all: FileNode[]): boolean {
            return all[0].isDirectory();
        }
    })
    static async newFile(all: FileNode[]) {
		var props=new TemplateDBDialogProperties();
        var res = await OptionDialog.askProperties("Create new DBDialog:",props, ["ok", "cancel"],undefined,false);
        if (res.button === "ok" ) {
	    	var scode=code.replaceAll("{{dialogname}}",props.dialogname);
	    	var fulldbclassname= classes.getClassName(props.dbobject);
	    	var shortdbclassname=fulldbclassname.split(".")[fulldbclassname.split(".").length-1];
	    	var dbfilename=(await registry.getJSONData("$Class",fulldbclassname))[0].filename;
	    	dbfilename=dbfilename.substring(0,dbfilename.length-3);
	    	scode=scode.replaceAll("{{fullclassname}}",(all[0].fullpath+"/"+props.dialogname).replaceAll("/","."));
	    	scode=scode.replaceAll("{{dbclassname}}",shortdbclassname);
	    	scode=scode.replaceAll("{{fulldbclassname}}",fulldbclassname);
	    	scode=scode.replaceAll("{{dbfilename}}",dbfilename);
	    
	    	FileActions.newFile(all,props.dialogname+".ts",scode,true);
        }
    }
}


