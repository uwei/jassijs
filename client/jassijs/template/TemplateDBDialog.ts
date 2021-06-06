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
const code=`import { $Class } from "jassijs/remote/Jassi";
import {Panel} from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { {{dbclassname}} } from "{{dbfilename}}";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView,  $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";

type Me = {
}&DBObjectViewMe

@$DBObjectView({classname:"{{fulldbclassname}}"})
@$Class("{{fullclassname}}")
export class {{dialogname}} extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    value: {{dbclassname}};
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "{{dialogname}}" : "{{dialogname}} " + this.value.id;
    }
    layout(me: Me) {
    }
}

export async function test(){
	var ret=new {{dialogname}};
	
	ret["value"]=<{{dbclassname}}>await {{dbclassname}}.findOne({ relations: ["*"] });
	return ret;
}`;
@$Class("jassijs.template.TemplateDBDialogProperties")
export class TemplateDBDialogProperties {
	@$Property({decription:"name of the dialog"})
	dialogname:string;
	@$Property({type:"classselector", service:"$DBObject"})
    dbobject:DBObject;
}
@$ActionProvider("jassijs.remote.FileNode")
@$Class("jassijs.ui.TemplateDBDialog")
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
            var cl=await registry.getJSONData("$Class",fulldbclassname);
	    	var dbfilename=cl[0].filename;
	    	dbfilename=dbfilename.substring(0,dbfilename.length-3);
	    	scode=scode.replaceAll("{{fullclassname}}",(all[0].fullpath+"/"+props.dialogname).replaceAll("/","."));
	    	scode=scode.replaceAll("{{dbclassname}}",shortdbclassname);
	    	scode=scode.replaceAll("{{fulldbclassname}}",fulldbclassname);
	    	scode=scode.replaceAll("{{dbfilename}}",dbfilename);
	    
	    	FileActions.newFile(all,props.dialogname+".ts",scode,true);
        }
    }
}


