import { $ActionProvider, $Action } from "jassi/base/Actions";
import { $Class } from "jassi/remote/Jassi";
import { FileNode } from "jassi/remote/FileNode";
import { OptionDialog } from "jassi/ui/OptionDialog";
import { FileExplorer, FileActions } from "jassi/ui/FileExplorer";
import { Server } from "jassi/remote/Server";
import { router } from "jassi/base/Router";
import { Property, $Property } from "jassi/ui/Property";
import { DBObject } from "jassi/remote/DBObject";
import { classes } from "jassi/remote/Classes";
import registry from "jassi/remote/Registry";
const code=`import { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { {{dbclassname}} } from "{{dbfilename}}";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView,  $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";

type Me = {
}&DBObjectViewMe

@$DBObjectView({classname:"{{fulldbclassname}}"})
@$Class("{{fullclassname}}")
export class {{dialogname}} extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
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
@$Class("jassi.template.TemplateDBDialogProperties")
export class TemplateDBDialogProperties {
	@$Property({decription:"name of the dialog"})
	dialogname:string;
	@$Property({type:"classselector", service:"$DBObject"})
    dbobject:DBObject;
}
@$ActionProvider("jassi.remote.FileNode")
@$Class("jassi.ui.TemplateDBDialog")
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


